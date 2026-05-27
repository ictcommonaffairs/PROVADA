import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type CommonProps = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

type InputProps = CommonProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'required'> & {
    as?: 'input';
  };

type TextareaProps = CommonProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'required'> & {
    as: 'textarea';
  };

type FieldProps = InputProps | TextareaProps;

export default function Field(props: FieldProps) {
  const { label, error, hint, required, id, ...rest } = props;
  const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      <label htmlFor={inputId} className="field-label">
        {label}
        {required && <span aria-hidden="true" className="field-required">*</span>}
      </label>
      {props.as === 'textarea' ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className="field-input field-textarea"
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className="field-input"
        />
      )}
      {error ? (
        <span id={`${inputId}-error`} className="field-error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span id={`${inputId}-hint`} className="field-hint">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
