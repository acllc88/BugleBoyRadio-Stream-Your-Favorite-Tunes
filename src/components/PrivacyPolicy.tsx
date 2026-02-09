import React from 'react';

interface PrivacyPolicyProps {
  isDark: boolean;
  onClose: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isDark, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.ibb.co/hFrqZrmB/Bugle-Boy-Radio.png" 
              alt="Bugle Boy Radio" 
              className="w-10 h-10 rounded-lg shadow-lg"
            />
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className={`p-6 overflow-y-auto max-h-[calc(90vh-100px)] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>1. Introduction</h2>
            <p className="mb-4">
              Welcome to Bugle Boy Radio ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our radio streaming application.
            </p>
            <p>
              Bugle Boy Radio is created and operated by <a href="https://acllc.vercel.app" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline font-semibold">ACLLC</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>2. Information We Collect</h2>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Personal Information</h3>
            <p className="mb-4">When you create an account, we may collect:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Email address</li>
              <li>Display name</li>
              <li>Profile photo (if you sign in with Google)</li>
              <li>Country/location (detected via IP for display purposes)</li>
            </ul>

            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Usage Information</h3>
            <p className="mb-4">We automatically collect:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Favorite radio stations you save</li>
              <li>Chat messages you send (public)</li>
              <li>Online presence status</li>
              <li>Device and browser information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and maintain our service</li>
              <li>To sync your favorite stations across devices</li>
              <li>To enable the live chat feature</li>
              <li>To show online user presence</li>
              <li>To send you notifications about new messages</li>
              <li>To improve our application</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>4. Data Storage</h2>
            <p className="mb-4">
              We use Firebase (by Google) to store your data securely. Your data is stored in the United States and is protected by industry-standard security measures.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Authentication data is managed by Firebase Authentication</li>
              <li>User preferences and favorites are stored in Firebase Firestore</li>
              <li>Chat messages are stored in Firebase Firestore</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>5. Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Firebase (Google)</strong> - Authentication and database</li>
              <li><strong>Radio station providers</strong> - Audio streaming (SomaFM, Radio Paradise, etc.)</li>
              <li><strong>ipapi.co</strong> - Country detection for display purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access your personal data</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of notifications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>7. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>9. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className="font-semibold">ACLLC</p>
              <p>
                Website: <a href="https://acllc.vercel.app" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">https://acllc.vercel.app</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
