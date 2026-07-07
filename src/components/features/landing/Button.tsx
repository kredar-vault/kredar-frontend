import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-[#0f8b4b] hover:bg-[#0c723d] shadow-[0_4px_20px_rgba(15,139,75,0.25)]',
    secondary:
      'bg-[#122218] border border-emerald-900/40 text-zinc-300 hover:text-white hover:bg-[#182f21]',
    white: 'bg-white hover:bg-zinc-100 text-[#06150d]',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
