import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot, collection, getDocs, deleteDoc } from 'firebase/firestore';

interface AdminDashboardProps {
  onLogout: () => void;
  isDark: boolean;
}

interface Settings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceEndTime: string;
  announcement: string;
  announcementEnabled: boolean;
}

interface StationStats {
  totalStations: number;
  genres: string[];
}

export default function AdminDashboard({ onLogout, isDark }: AdminDashboardProps) {
  const [settings, setSettings] = useState<Settings>({
    maintenanceMode: false,
    maintenanceMessage: '',
    maintenanceEndTime: '',
    announcement: '',
    announcementEnabled: false
  });
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [stationStats] = useState<StationStats>({ totalStations: 125, genres: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'maintenance' | 'announcements' | 'users'>('overview');

  // Load settings from Firebase
  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'general');
    
    const unsubscribe = onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSettings({
          maintenanceMode: data.maintenanceMode || false,
          maintenanceMessage: data.maintenanceMessage || '',
          maintenanceEndTime: data.maintenanceEndTime || '',
          announcement: data.announcement || '',
          announcementEnabled: data.announcementEnabled || false
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Load online users count
  useEffect(() => {
    const onlineRef = collection(db, 'onlineUsers');
    const unsubscribe = onSnapshot(onlineRef, (snapshot) => {
      const now = Date.now();
      const activeUsers = snapshot.docs.filter(doc => {
        const data = doc.data();
        return data.lastSeen && (now - data.lastSeen) < 60000;
      });
      setOnlineUsers(activeUsers.length);
    });

    return () => unsubscribe();
  }, []);

  // Load message count
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messagesRef = collection(db, 'chatMessages');
        const snapshot = await getDocs(messagesRef);
        setTotalMessages(snapshot.size);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    loadMessages();
  }, []);

  // Save settings to Firebase - ALL USERS SEE CHANGES IMMEDIATELY
  const saveSettings = async () => {
    setIsSaving(true);
    console.log('💾 Saving settings to Firebase...', settings);
    
    try {
      const settingsRef = doc(db, 'settings', 'general');
      await setDoc(settingsRef, {
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage,
        maintenanceEndTime: settings.maintenanceEndTime,
        announcement: settings.announcement,
        announcementEnabled: settings.announcementEnabled,
        updatedAt: Date.now(),
        updatedBy: 'admin'
      });
      
      console.log('✅ Settings saved successfully! All users will see changes in real-time.');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      alert('Failed to save settings. Check console for errors.');
    }
    setIsSaving(false);
  };

  // Toggle maintenance mode - SAVES TO FIREBASE IMMEDIATELY
  const toggleMaintenance = async () => {
    const newMode = !settings.maintenanceMode;
    console.log('🔧 Toggling maintenance mode to:', newMode);
    
    try {
      const settingsRef = doc(db, 'settings', 'general');
      await setDoc(settingsRef, {
        maintenanceMode: newMode,
        maintenanceMessage: settings.maintenanceMessage || 'We are currently performing maintenance. Please check back soon!',
        maintenanceEndTime: settings.maintenanceEndTime,
        announcementEnabled: settings.announcementEnabled,
        announcement: settings.announcement,
        updatedAt: Date.now(),
        updatedBy: 'admin'
      });
      console.log('✅ Maintenance mode saved to Firebase:', newMode);
      
      // Show confirmation
      if (newMode) {
        alert('🔴 Maintenance mode is now ACTIVE!\n\nAll users will see the maintenance screen.');
      } else {
        alert('🟢 Maintenance mode is now OFF!\n\nThe app is live again.');
      }
    } catch (error) {
      console.error('❌ Error toggling maintenance:', error);
      alert('Failed to toggle maintenance mode. Check console for errors.');
    }
  };

  // Clear all chat messages
  const clearAllMessages = async () => {
    if (!confirm('Are you sure you want to delete ALL chat messages? This cannot be undone!')) {
      return;
    }

    try {
      const messagesRef = collection(db, 'chatMessages');
      const snapshot = await getDocs(messagesRef);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      setTotalMessages(0);
      alert('All messages deleted successfully');
    } catch (error) {
      console.error('Error clearing messages:', error);
      alert('Failed to clear messages');
    }
  };

  // Clear online users
  const clearOnlineUsers = async () => {
    if (!confirm('Clear all online user records? This will reset the online counter.')) {
      return;
    }

    try {
      const onlineRef = collection(db, 'onlineUsers');
      const snapshot = await getDocs(onlineRef);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      setOnlineUsers(0);
      alert('Online users cleared');
    } catch (error) {
      console.error('Error clearing online users:', error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminLoginTime');
    onLogout();
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-red-200 text-sm">Bugle Boy Radio Control Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Live indicator */}
              <div className="flex items-center gap-2 bg-red-800/50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">{onlineUsers} Online</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
              >
                Logout →
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
            { id: 'announcements', label: 'Announcements', icon: '📢' },
            { id: 'users', label: 'Users & Chat', icon: '👥' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Stats Cards */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Online Now</p>
                  <p className="text-2xl font-bold text-green-500">{onlineUsers}</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Messages</p>
                  <p className="text-2xl font-bold text-blue-500">{totalMessages}</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📻</span>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Radio Stations</p>
                  <p className="text-2xl font-bold text-amber-500">{stationStats.totalStations}</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  settings.maintenanceMode ? 'bg-red-500/20' : 'bg-green-500/20'
                }`}>
                  <span className="text-2xl">{settings.maintenanceMode ? '🔴' : '🟢'}</span>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                  <p className={`text-lg font-bold ${settings.maintenanceMode ? 'text-red-500' : 'text-green-500'}`}>
                    {settings.maintenanceMode ? 'Maintenance' : 'Live'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>🔧</span> Maintenance Mode
            </h2>

            {/* Big Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-500/20 mb-6">
              <div>
                <h3 className="font-bold text-lg">Maintenance Mode</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {settings.maintenanceMode 
                    ? 'App is currently in maintenance mode. Users see maintenance screen.'
                    : 'App is live. Toggle to put app in maintenance mode.'
                  }
                </p>
              </div>
              <button
                onClick={toggleMaintenance}
                className={`relative w-20 h-10 rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-400'
                }`}
              >
                <div className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-lg transition-transform ${
                  settings.maintenanceMode ? 'translate-x-10' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Maintenance Settings */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Maintenance Message
                </label>
                <textarea
                  value={settings.maintenanceMessage}
                  onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                  placeholder="We're currently upgrading our servers to bring you a better experience..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-red-500 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Estimated End Time
                </label>
                <input
                  type="datetime-local"
                  value={settings.maintenanceEndTime}
                  onChange={(e) => setSettings({ ...settings, maintenanceEndTime: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-red-500 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
              </div>

              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <span>✅</span>
                    Saved!
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>📢</span> Announcements
            </h2>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/20 mb-6">
              <div>
                <h3 className="font-bold text-lg">Show Announcement Banner</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Display a banner at the top of the app for all users
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, announcementEnabled: !settings.announcementEnabled })}
                className={`relative w-20 h-10 rounded-full transition-colors ${
                  settings.announcementEnabled ? 'bg-amber-500' : 'bg-gray-400'
                }`}
              >
                <div className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-lg transition-transform ${
                  settings.announcementEnabled ? 'translate-x-10' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Announcement Text
                </label>
                <textarea
                  value={settings.announcement}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  placeholder="🎉 New stations added! Check out our Hip-Hop collection..."
                  rows={2}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-amber-500 transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <span>✅</span>
                    Saved!
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Save Announcement
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Users & Chat Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Online Users */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>👥</span> Online Users ({onlineUsers})
              </h2>
              
              <div className="flex gap-4">
                <button
                  onClick={clearOnlineUsers}
                  className="px-4 py-2 bg-red-600/20 text-red-500 hover:bg-red-600/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <span>🗑️</span>
                  Clear All Online Records
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>💬</span> Chat Messages ({totalMessages})
              </h2>
              
              <div className="flex gap-4">
                <button
                  onClick={clearAllMessages}
                  className="px-4 py-2 bg-red-600/20 text-red-500 hover:bg-red-600/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <span>🗑️</span>
                  Delete All Messages
                </button>
              </div>
              
              <p className={`mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                ⚠️ Deleting messages cannot be undone. Use with caution.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-8 pt-6 border-t text-center text-sm ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
          <p>🛡️ Admin Dashboard • Bugle Boy Radio • Created by ACLLC</p>
          <p className="mt-1">
            <a href="https://acllc.vercel.app" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">
              acllc.vercel.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
