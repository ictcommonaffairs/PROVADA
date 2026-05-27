import type { InputHTMLAttributes } from 'react';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
};

export default function Checkbox({ label, id, ...rest }: CheckboxProps) {
  const inputId =
    id ?? `cb-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return (
    <label htmlFor={inputId} className="checkbox">
      <input {...rest} id={inputId} type="checkbox" className="checkbox-input" />
      <span className="checkbox-box" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="12" height="12">
          <path
            d="M3 8.5l3 3 7-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="checkbox-label">{label}</span>
    </label>
  );
}
