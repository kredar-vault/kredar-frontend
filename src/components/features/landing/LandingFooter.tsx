'use client';

import Link from 'next/link';
import KredarLogo from '@/components/KredarLogo';

export default function LandingFooter() {
  return (
    <footer className="bg-[#030A05] border-t border-white/5 px-4 md:px-6 py-12 md:py-14 text-white  selection:bg-[#006C49]/30">
      <div className="max-w-6xl mx-auto flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        {/* BRAND COLUMN */}
        <div className="space-y-3 max-w-xs">
          <Link href="/" className="flex items-center gap-2">
            <KredarLogo light />
          </Link>
          <p className="text-gray-400 leading-relaxed text-[11px] md:text-xs">
            Infrastructure for Smarter Payments
          </p>
        </div>

        {/* COMPACT NAVIGATION NAVIGATION */}
        <div className="grid grid-cols-3 gap-x-8 sm:gap-x-16 lg:flex lg:justify-between lg:max-w-lg lg:w-full">
          {/* Platform Anchors */}
          <div className="space-y-3 min-w-[100px]">
            <h4 className="font-bold text-white text-[10px] tracking-wider uppercase opacity-40">
              Platform
            </h4>
            <ul className="space-y-2 text-[11px] md:text-xs text-gray-300 font-medium">
              <li>
                <a href="#features" className="hover:text-[#00FF9D] transition-colors duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-[#00FF9D] transition-colors duration-200">
                  Process
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#00FF9D] transition-colors duration-200">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Action Links */}
          <div className="space-y-3 min-w-[120px]">
            <h4 className="font-bold text-white text-[10px] tracking-wider uppercase opacity-40">
              Resources
            </h4>
            <ul className="space-y-2 text-[11px] md:text-xs text-gray-300 font-medium">
              <li>
                <a href="#" className="hover:text-[#00FF9D] transition-colors duration-200">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/docs" className="hover:text-[#00FF9D] transition-colors duration-200">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3 min-w-[100px]">
            <h4 className="font-bold text-white text-[10px] tracking-wider uppercase opacity-40">
              Legal
            </h4>
            <ul className="space-y-2 text-[11px] md:text-xs text-gray-300 font-medium">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#00FF9D] transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#00FF9D] transition-colors duration-200">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM BASEBAR */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] md:text-[11px] text-gray-500">
        <span>© 2026 Kredar. All rights reserved.</span>

        {/* Social Hooks */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
            aria-label="Twitter"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
            aria-label="GitHub"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
