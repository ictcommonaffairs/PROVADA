import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'ghost';
};

export default function Button({
  loading = false,
  variant = 'primary',
  children,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`btn btn--${variant} ${className ?? ''}`}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : null}
      <span>{loading ? 'Versturen…' : children}</span>
    </button>
  );
}
