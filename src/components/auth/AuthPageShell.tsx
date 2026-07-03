import Link from 'next/link';
import { ReactNode } from 'react';
import { LogIn } from 'lucide-react';

interface AuthPageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  bottomCtaHref: string;
  bottomCtaLabel: string;
}

export default function AuthPageShell({
  title,
  subtitle,
  children,
  bottomCtaHref,
  bottomCtaLabel,
}: AuthPageShellProps) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] relative flex items-center justify-center lg:block">
      {/* MOBILE BACKGROUND COVER (visible only below lg breakpoint) */}
      <div className="absolute inset-0 z-0 lg:hidden">
        <img
          src="/images/Left.png"
          alt="Kredar Mobile Background"
          className="h-full w-full object-cover filter brightness-[0.4]"
        />
        {/* Soft dark-green overlay to make text more readable */}
        <div className="absolute inset-0 bg-[#0a2e1f]/20 mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* DESKTOP LEFT PANEL (visible only on lg and up) */}
        <div className="relative hidden lg:block overflow-hidden">
          <img
            src="/images/Left.png"
            alt="Kredar Desktop"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* RIGHT PANEL (forms wrapper) */}
        <div className="flex items-center justify-center w-full px-4 sm:px-8 py-10">
          {/*
            Form Card:
            - On mobile: Translucent glassmorphism background (bg-white/90 backdrop-blur-md).
            - On desktop: Solid white card background (lg:bg-white).
          */}
          <div className="flex min-h-[560px] w-full max-w-[420px] flex-col rounded-2xl bg-white/95 backdrop-blur-md border border-white/20 px-6 sm:px-10 py-8 shadow-xl lg:bg-white lg:border-none lg:shadow-sm">
            {/* HEADER */}
            <div className="text-center">
              <h1 className="text-[2.25rem] font-semibold text-slate-900 leading-tight">{title}</h1>
              <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            </div>

            {/* FORM AREA */}
            <div className="mt-8 flex flex-1 flex-col">{children}</div>

            {/* FOOTER CTA */}
            <div className="mt-6 pt-4 border-t border-[#d8e1da]">
              <Link
                href={bottomCtaHref}
                className="flex items-center justify-center gap-2 text-lg font-semibold text-slate-700 hover:text-[#0f8b4b] transition-colors"
              >
                <LogIn size={18} />
                {bottomCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
