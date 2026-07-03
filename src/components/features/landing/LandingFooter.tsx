'use client';

import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-[#030A03] border-t border-white/5 px-6 py-16 text-white text-sm">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4 max-w-xs">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0f8b4b] rounded flex items-center justify-center flex-shrink-0">
              <img src="/images/Vector(1).png" alt="Kredar" className="w-3.5 h-3.5 text-black" />
            </div>
            <span
              style={{
                color: '#FFF',
                fontFamily: 'var(--font-lexend-zetta)',
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '1.2px',
              }}
              className="uppercase tracking-[0.11em] select-none"
            >
              KREDAR
            </span>
          </Link>
          <p className="text-white/60 leading-relaxed text-xs">
            Infrastructure for Smarter Payments
          </p>
        </div>

        {/* Navigation Links Grid (4 columns) */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:flex lg:gap-16">
          <div className="space-y-4 min-w-[120px]">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase opacity-40">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Solutions
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 min-w-[140px]">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase opacity-40">
              Use Cases
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Savings & Investments
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Schools & Education
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Property Management
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 min-w-[120px]">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase opacity-40">
              Developers
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Webhooks
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4 min-w-[120px]">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase opacity-40">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Partners
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom copyright and social handles */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <span>© 2026 Kredar. All rights reserved.</span>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
