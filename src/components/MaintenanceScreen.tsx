interface MaintenanceScreenProps {
  message: string;
  endTime: string;
}

export default function MaintenanceScreen({ message, endTime }: MaintenanceScreenProps) {
  const formatEndTime = (dateString: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return null;
    }
  };

  const formattedEndTime = formatEndTime(endTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="https://i.ibb.co/hFrqZrmB/Bugle-Boy-Radio.png" 
            alt="Bugle Boy Radio" 
            className="w-32 h-32 mx-auto mb-4 animate-pulse"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Bugle Boy Radio</h1>
        </div>

        {/* Maintenance Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-5xl">🔧</span>
          </div>
          <h2 className="text-2xl font-bold text-amber-400 mb-2">Under Maintenance</h2>
        </div>

        {/* Message */}
        <p className="text-gray-300 text-lg mb-6 leading-relaxed">
          {message || "We're currently performing scheduled maintenance to improve your listening experience. We'll be back shortly!"}
        </p>

        {/* End Time */}
        {formattedEndTime && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <p className="text-gray-400 text-sm mb-1">Expected to be back by</p>
            <p className="text-white font-semibold text-lg">{formattedEndTime}</p>
          </div>
        )}

        {/* Progress Animation */}
        <div className="mb-8">
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <p className="text-gray-500 text-sm">
          Questions? Visit{' '}
          <a 
            href="https://acllc.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber-500 hover:underline"
          >
            acllc.vercel.app
          </a>
        </p>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-700">
          <p className="text-gray-600 text-xs">
            © 2025 ACLLC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
