import React from 'react';

interface TermsOfServiceProps {
  isDark: boolean;
  onClose: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ isDark, onClose }) => {
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
            <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
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
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using Bugle Boy Radio ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
            <p>
              Bugle Boy Radio is created and operated by <a href="https://acllc.vercel.app" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline font-semibold">ACLLC</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>2. Description of Service</h2>
            <p className="mb-4">
              Bugle Boy Radio is a free online radio streaming application that allows users to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Stream live radio stations from across the United States</li>
              <li>Save favorite stations to their account</li>
              <li>Participate in live chat with other listeners</li>
              <li>View other online users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>3. User Accounts</h2>
            <p className="mb-4">To access certain features, you may need to create an account. You agree to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>4. Acceptable Use</h2>
            <p className="mb-4">When using our Service, you agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Post offensive, abusive, or inappropriate content in the chat</li>
              <li>Harass, bully, or threaten other users</li>
              <li>Share spam, advertisements, or promotional content</li>
              <li>Impersonate other users or entities</li>
              <li>Attempt to hack, disrupt, or damage the Service</li>
              <li>Use the Service for any illegal purposes</li>
              <li>Share personal information of others without consent</li>
              <li>Use automated bots or scripts</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>5. Chat Guidelines</h2>
            <p className="mb-4">Our live chat is a community space. Please:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Be respectful and kind to all users</li>
              <li>Keep conversations appropriate for all ages</li>
              <li>Do not share personal contact information</li>
              <li>Report any inappropriate behavior</li>
              <li>Remember that chat messages are public and permanent</li>
            </ul>
            <p className="mt-4">
              We reserve the right to remove any content and suspend accounts that violate these guidelines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>6. Intellectual Property</h2>
            <p className="mb-4">
              The Bugle Boy Radio name, logo, and application design are the property of ACLLC. The radio streams are provided by their respective broadcasters and are subject to their own terms and copyrights.
            </p>
            <p>
              You may not copy, modify, distribute, or reverse engineer any part of our Service without written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>7. Third-Party Content</h2>
            <p className="mb-4">
              Our Service streams radio content from third-party broadcasters. We do not control or take responsibility for:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>The content of radio broadcasts</li>
              <li>The availability of radio streams</li>
              <li>Any advertisements played by radio stations</li>
              <li>The accuracy of station information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>8. Disclaimer of Warranties</h2>
            <p className="mb-4">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Uninterrupted or error-free service</li>
              <li>The availability of any specific radio station</li>
              <li>The accuracy of any information provided</li>
              <li>That the Service will meet your specific requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ACLLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>10. Termination</h2>
            <p className="mb-4">
              We reserve the right to suspend or terminate your access to the Service at any time, without notice, for any reason, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Violation of these Terms</li>
              <li>Inappropriate behavior in chat</li>
              <li>Suspected fraudulent or illegal activity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>11. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>13. Contact Information</h2>
            <p className="mb-4">
              For any questions about these Terms, please contact us:
            </p>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className="font-semibold">ACLLC</p>
              <p>
                Website: <a href="https://acllc.vercel.app" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">https://acllc.vercel.app</a>
              </p>
            </div>
          </section>

          <section className={`p-4 rounded-lg ${isDark ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
            <p className="text-center">
              By using Bugle Boy Radio, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
