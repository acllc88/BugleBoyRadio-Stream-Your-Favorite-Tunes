import React from 'react';

interface FooterProps {
  isDark: boolean;
  onShowPrivacy: () => void;
  onShowTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ isDark, onShowPrivacy, onShowTerms }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-6 px-4 border-t ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Created By */}
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Created by
            </span>
            <a
              href="https://acllc.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-amber-500/25"
            >
              <span>ACLLC</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={onShowPrivacy}
              className={`text-sm hover:text-amber-500 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Privacy Policy
            </button>
            <button
              onClick={onShowTerms}
              className={`text-sm hover:text-amber-500 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Terms of Service
            </button>
            <a
              href="https://acllc.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm hover:text-amber-500 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            >
              Contact Us
            </a>
          </div>

          {/* Copyright */}
          <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            © {currentYear} ACLLC. All rights reserved.
          </div>
        </div>

        {/* Bottom Branding */}
        <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-center gap-2">
          <img 
            src="https://i.ibb.co/hFrqZrmB/Bugle-Boy-Radio.png" 
            alt="Bugle Boy Radio" 
            className="w-6 h-6 rounded"
          />
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Bugle Boy Radio — Stream 90+ USA Radio Stations Free
          </span>
        </div>
      </div>
    </footer>
  );
};
