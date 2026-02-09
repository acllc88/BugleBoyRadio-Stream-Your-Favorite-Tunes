import { useState, useEffect, useRef, useCallback } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  type Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";

// Notification sound using Web Audio API
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    
    // Create oscillator for the "ding" sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Pleasant notification tone
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
    oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1); // Higher note
    oscillator.type = 'sine';
    
    // Fade in and out for smooth sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.15);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    console.log("🔔 Notification sound played!");
  } catch (err) {
    console.log("Could not play notification sound:", err);
  }
};

// Show browser notification
const showBrowserNotification = (title: string, body: string, onClick?: () => void) => {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      const notification = new Notification(title, {
        body,
        icon: "https://i.ibb.co/hFrqZrmB/Bugle-Boy-Radio.png",
        tag: "bugle-boy-chat",
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
        if (onClick) onClick();
      };
      
      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    } catch (err) {
      console.log("Notification error:", err);
    }
  }
};

interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  userEmoji?: string;
  createdAt: Timestamp | null;
}

interface OnlineUser {
  odid: string;
  oduserId: string;
  userName: string;
  userPhoto: string | null;
  lastSeen: number;
  countryCode?: string;
  countryName?: string;
  countryFlag?: string;
}

interface ChatRoomProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  currentStationName?: string;
}

export function ChatRoom({ isOpen, onClose, isDark }: ChatRoomProps) {
  const { user, setShowAuthModal } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [showOnlineList, setShowOnlineList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const presenceRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ===== REAL-TIME ONLINE PRESENCE SYSTEM =====
  useEffect(() => {
    if (!user) return;

    const userPresenceDoc = doc(db, "onlineUsers", user.uid);
    
    // Set user as online
    const setOnline = async () => {
      try {
        await setDoc(userPresenceDoc, {
          oduserId: user.uid,
          userName: user.displayName || user.email?.split("@")[0] || "Anonymous",
          userPhoto: user.photoURL || null,
          lastSeen: Date.now(),
        });
        console.log("✅ User is now online:", user.displayName);
      } catch (err) {
        console.error("Failed to set online:", err);
      }
    };

    // Set user as offline
    const setOffline = async () => {
      try {
        await deleteDoc(userPresenceDoc);
        console.log("👋 User is now offline");
      } catch (err) {
        console.error("Failed to set offline:", err);
      }
    };

    // Set online immediately
    setOnline();

    // Heartbeat every 10 seconds
    presenceRef.current = setInterval(() => {
      setOnline();
    }, 10000);

    // Cleanup stale users (older than 30 seconds)
    const cleanupStale = async () => {
      try {
        const onlineRef = collection(db, "onlineUsers");
        const snapshot = await getDocs(onlineRef);
        const now = Date.now();
        const THIRTY_SECONDS = 30 * 1000;
        
        snapshot.forEach(async (docSnap) => {
          const data = docSnap.data();
          if (data.lastSeen && now - data.lastSeen > THIRTY_SECONDS) {
            await deleteDoc(doc(db, "onlineUsers", docSnap.id));
            console.log("🧹 Cleaned stale user:", docSnap.id);
          }
        });
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    };

    cleanupStale();
    const cleanupInterval = setInterval(cleanupStale, 15000);

    // Handle page unload
    const handleUnload = () => {
      // Use sendBeacon for reliable cleanup on page close
      const url = `https://firestore.googleapis.com/v1/projects/bugleboyradio/databases/(default)/documents/onlineUsers/${user.uid}`;
      navigator.sendBeacon && navigator.sendBeacon(url, "");
      // Also try direct delete
      deleteDoc(userPresenceDoc).catch(() => {});
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setOffline();
      } else {
        setOnline();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (presenceRef.current) clearInterval(presenceRef.current);
      clearInterval(cleanupInterval);
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      setOffline();
    };
  }, [user]);

  // ===== LISTEN TO ONLINE USERS IN REAL-TIME =====
  useEffect(() => {
    const onlineRef = collection(db, "onlineUsers");
    
    const unsubscribe = onSnapshot(onlineRef, (snapshot) => {
      const now = Date.now();
      const THIRTY_SECONDS = 30 * 1000;
      const users: OnlineUser[] = [];
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Only include users seen in the last 30 seconds
        if (data.lastSeen && now - data.lastSeen < THIRTY_SECONDS) {
          users.push({
            odid: docSnap.id,
            oduserId: data.oduserId,
            userName: data.userName,
            userPhoto: data.userPhoto,
            lastSeen: data.lastSeen,
            countryCode: data.countryCode || 'US',
            countryName: data.countryName || 'United States',
            countryFlag: data.countryFlag || '🇺🇸',
          });
        }
      });
      
      setOnlineUsers(users);
      console.log("👥 Online users:", users.length, users.map(u => u.userName));
    }, (error) => {
      console.error("Online users listener error:", error);
    });

    return () => unsubscribe();
  }, []);

  // Track if this is first load (to prevent notifications on initial load)
  const isFirstLoadRef = useRef(true);
  const lastMessageIdRef = useRef<string | null>(null);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  // Check if we should show notification permission banner
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default" && isOpen) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowNotificationBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  const handleEnableNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setShowNotificationBanner(false);
        // Play a test sound
        playNotificationSound();
      }
    }
  };

  // Listen to messages in real-time - ALWAYS listen even when closed for notifications
  useEffect(() => {
    const messagesRef = collection(db, "chatMessages");
    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        msgs.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
      });
      
      const sortedMsgs = msgs.reverse();
      
      // Check for new messages (not from current user)
      if (!isFirstLoadRef.current && sortedMsgs.length > 0) {
        const latestMsg = sortedMsgs[sortedMsgs.length - 1];
        
        // Only notify if:
        // 1. It's a new message (different ID)
        // 2. It's not from the current user
        // 3. Either chat is closed OR window is not focused
        if (
          latestMsg.id !== lastMessageIdRef.current &&
          latestMsg.userId !== user?.uid
        ) {
          console.log("🔔 New message from:", latestMsg.userName);
          
          // Play sound notification
          playNotificationSound();
          
          // Show browser notification if permission granted and chat is closed
          if (!isOpen || document.hidden) {
            showBrowserNotification(
              `💬 ${latestMsg.userName}`,
              latestMsg.text.length > 50 ? latestMsg.text.substring(0, 50) + "..." : latestMsg.text,
              () => {
                // This will be handled by App.tsx to open chat
              }
            );
          }
        }
        
        lastMessageIdRef.current = latestMsg.id;
      }
      
      // Mark first load as complete
      if (isFirstLoadRef.current && sortedMsgs.length > 0) {
        isFirstLoadRef.current = false;
        lastMessageIdRef.current = sortedMsgs[sortedMsgs.length - 1]?.id || null;
      }
      
      setMessages(sortedMsgs);
    }, (error) => {
      console.error("Chat listener error:", error);
    });

    return () => unsubscribe();
  }, [user?.uid, isOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const messagesRef = collection(db, "chatMessages");
      await addDoc(messagesRef, {
        text: messageText,
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "Anonymous",
        userPhoto: user.photoURL || null,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  }, [newMessage, user, sending]);

  const formatTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return "now";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getUserColor = (oduserId: string) => {
    const colors = [
      "from-red-500 to-pink-600",
      "from-blue-500 to-indigo-600",
      "from-green-500 to-emerald-600",
      "from-purple-500 to-violet-600",
      "from-orange-500 to-amber-600",
      "from-cyan-500 to-teal-600",
      "from-fuchsia-500 to-pink-600",
      "from-rose-500 to-red-600",
    ];
    let hash = 0;
    for (let i = 0; i < oduserId.length; i++) {
      hash = oduserId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const onlineCount = onlineUsers.length;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Chat Panel */}
      <div
        ref={panelRef}
        className={cn(
          "fixed top-0 right-0 bottom-0 w-full sm:w-[400px] z-[70] transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className={cn(
          "flex flex-col h-full shadow-2xl",
          isDark
            ? "bg-[#0d0d14] border-l border-white/5"
            : "bg-white border-l border-gray-200"
        )}>
          {/* Chat Header */}
          <div className={cn(
            "flex-shrink-0 px-4 py-3 border-b flex items-center justify-between",
            isDark ? "border-white/5 bg-[#111118]" : "border-gray-100 bg-gray-50"
          )}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                  "bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20"
                )}>
                  💬
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#111118] shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
              </div>
              <div>
                <h3 className={cn("font-bold text-sm", isDark ? "text-white" : "text-gray-900")}>
                  Live Chat Room
                </h3>
                <button 
                  onClick={() => setShowOnlineList(!showOnlineList)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <span className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                    </span>
                    <span className={cn(
                      "text-xs font-bold",
                      isDark ? "text-green-400" : "text-green-600"
                    )}>
                      {onlineCount} online
                    </span>
                  </span>
                  <svg className={cn(
                    "w-3 h-3 transition-transform",
                    showOnlineList ? "rotate-180" : "",
                    isDark ? "text-white/40" : "text-gray-400"
                  )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95",
                isDark ? "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Notification Permission Banner */}
          {showNotificationBanner && (
            <div className={cn(
              "flex-shrink-0 px-4 py-3 border-b",
              isDark ? "border-white/5 bg-amber-500/10" : "border-amber-200 bg-amber-50"
            )}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔔</span>
                <div className="flex-1">
                  <p className={cn("text-xs font-semibold", isDark ? "text-amber-300" : "text-amber-800")}>
                    Enable notifications
                  </p>
                  <p className={cn("text-[10px]", isDark ? "text-amber-300/60" : "text-amber-700")}>
                    Get notified when new messages arrive
                  </p>
                </div>
                <button
                  onClick={handleEnableNotifications}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 transition-all"
                >
                  Enable
                </button>
                <button
                  onClick={() => setShowNotificationBanner(false)}
                  className={cn("text-lg", isDark ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600")}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Online Users List (Expandable) */}
          {showOnlineList && (
            <div className={cn(
              "flex-shrink-0 px-4 py-3 border-b overflow-x-auto",
              isDark ? "border-white/5 bg-[#0a0a10]" : "border-gray-100 bg-gray-50"
            )}>
              <p className={cn("text-[10px] font-semibold uppercase tracking-wider mb-2", isDark ? "text-white/30" : "text-gray-400")}>
                Online Now ({onlineCount})
              </p>
              {onlineCount === 0 ? (
                <p className={cn("text-xs", isDark ? "text-white/20" : "text-gray-400")}>
                  No users online
                </p>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {onlineUsers.map((u) => (
                    <div key={u.odid} className="flex flex-col items-center gap-1 min-w-[60px]">
                      <div className="relative">
                        {u.userPhoto ? (
                          <img src={u.userPhoto} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-green-400" />
                        ) : (
                          <div className={cn(
                            "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold border-2 border-green-400",
                            getUserColor(u.oduserId)
                          )}>
                            {getInitials(u.userName)}
                          </div>
                        )}
                        {/* Country flag badge */}
                        <span className="absolute -bottom-1 -right-1 text-sm" title={u.countryName}>
                          {u.countryFlag || '🌍'}
                        </span>
                      </div>
                      <span className={cn("text-[10px] truncate max-w-[60px] text-center font-medium", isDark ? "text-white/60" : "text-gray-600")}>
                        {u.userName.split(" ")[0]}
                      </span>
                      <span className={cn("text-[8px] -mt-1", isDark ? "text-white/30" : "text-gray-400")}>
                        {u.countryFlag} {u.countryCode}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages Area */}
          <div className={cn(
            "flex-1 overflow-y-auto px-4 py-3 space-y-1",
            isDark ? "scrollbar-dark" : ""
          )}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                <div className="text-5xl">🎺</div>
                <div>
                  <p className={cn("text-sm font-semibold", isDark ? "text-white/50" : "text-gray-500")}>
                    Welcome to the chat!
                  </p>
                  <p className={cn("text-xs mt-1", isDark ? "text-white/25" : "text-gray-400")}>
                    Be the first to say something. Share what you're listening to!
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => {
                  const isOwn = msg.userId === user?.uid;
                  const showAvatar = index === 0 || messages[index - 1].userId !== msg.userId;
                  const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.userId !== msg.userId;

                  return (
                    <div key={msg.id} className={cn("flex gap-2.5", isOwn ? "flex-row-reverse" : "flex-row", !showAvatar && (isOwn ? "pr-10" : "pl-10"))}>
                      {/* Avatar */}
                      {showAvatar && (
                        <div className="flex-shrink-0 mt-1">
                          {msg.userPhoto ? (
                            <img
                              src={msg.userPhoto}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-white/10"
                            />
                          ) : (
                            <div className={cn(
                              "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[10px] font-bold",
                              getUserColor(msg.userId)
                            )}>
                              {getInitials(msg.userName)}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Message bubble */}
                      <div className={cn("max-w-[75%] min-w-0", isOwn ? "items-end" : "items-start")}>
                        {showAvatar && (
                          <p className={cn(
                            "text-[10px] font-semibold mb-0.5 mx-1",
                            isOwn ? "text-right text-amber-400/70" : "",
                            isDark ? "text-white/40" : "text-gray-500"
                          )}>
                            {isOwn ? "You" : msg.userName}
                          </p>
                        )}
                        <div className={cn(
                          "px-3 py-2 text-sm leading-relaxed break-words",
                          isOwn
                            ? cn(
                                "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
                                showAvatar && isLastInGroup ? "rounded-2xl rounded-br-md" :
                                showAvatar ? "rounded-2xl rounded-br-md" :
                                isLastInGroup ? "rounded-2xl rounded-tr-md" :
                                "rounded-2xl"
                              )
                            : cn(
                                isDark ? "bg-white/[0.06] text-white/90" : "bg-gray-100 text-gray-800",
                                showAvatar && isLastInGroup ? "rounded-2xl rounded-bl-md" :
                                showAvatar ? "rounded-2xl rounded-bl-md" :
                                isLastInGroup ? "rounded-2xl rounded-tl-md" :
                                "rounded-2xl"
                              )
                        )}>
                          {msg.text}
                        </div>
                        {isLastInGroup && (
                          <p className={cn(
                            "text-[9px] mt-0.5 px-1",
                            isOwn ? "text-right" : "",
                            isDark ? "text-white/20" : "text-gray-400"
                          )}>
                            {formatTime(msg.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Chat Input */}
          <div className={cn(
            "flex-shrink-0 border-t px-3 py-3",
            isDark ? "border-white/5 bg-[#111118]" : "border-gray-100 bg-gray-50"
          )}>
            {user ? (
              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className={cn(
                      "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[10px] font-bold",
                      getUserColor(user.uid)
                    )}>
                      {getInitials(user.displayName || user.email?.split("@")[0] || "U")}
                    </div>
                  )}
                </div>
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    maxLength={500}
                    className={cn(
                      "w-full pl-4 pr-12 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all",
                      isDark
                        ? "bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/20"
                        : "bg-white border border-gray-200 text-gray-800 placeholder-gray-400"
                    )}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className={cn(
                      "absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                      newMessage.trim()
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
                        : isDark ? "text-white/15" : "text-gray-300"
                    )}
                  >
                    {sending ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="50 20" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-2">
                <p className={cn("text-xs mb-2", isDark ? "text-white/30" : "text-gray-400")}>
                  Sign in to join the conversation
                </p>
                <button
                  onClick={() => { setShowAuthModal(true); onClose(); }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  Sign In to Chat
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={cn(
            "flex-shrink-0 px-4 py-1.5 text-center",
            isDark ? "bg-[#0a0a0f]" : "bg-gray-100"
          )}>
            <p className={cn("text-[9px]", isDark ? "text-white/10" : "text-gray-300")}>
              Be kind & respectful 🎺
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
