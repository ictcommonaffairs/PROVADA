import { useState, type FormEvent } from 'react';
import Field from '../../components/Field';
import Button from '../../components/Button';

type Errors = Partial<Record<'name' | 'company' | 'email', string>>;

export type BookingFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
};

type BookingFormProps = {
  disabled: boolean;
  onSubmit: (values: BookingFormValues) => Promise<void>;
};

export default function BookingForm({ disabled, onSubmit }: BookingFormProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Vul je naam in';
    if (!company.trim()) next.company = 'Vul je bedrijf in';
    if (!email.trim()) {
      next.email = 'Vul je e-mailadres in';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Dit lijkt geen geldig e-mailadres';
    }
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;
    if (honeypot.trim() !== '') {
      // Stille succes-flow voor bots.
      return;
    }
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setBusy(true);
    setErrorMessage(null);
    try {
      await onSubmit({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        topic: topic.trim(),
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Aanvraag versturen mislukt. Probeer het opnieuw of mail ons op tim@commonaffairs.nl.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <Field
          label="Naam"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          autoCapitalize="words"
          error={errors.name}
        />
        <Field
          label="Bedrijf"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          autoComplete="organization"
          error={errors.company}
        />
        <Field
          label="E-mail"
          type="email"
          required
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          error={errors.email}
        />
        <Field
          label="Telefoon"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />
        <Field
          as="textarea"
          label="Onderwerp of vraag (optioneel)"
          rows={3}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Waar wil je het over hebben?"
        />
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="website-h">Website</label>
        <input
          id="website-h"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {errorMessage && (
        <div className="form-error" role="alert">
          {errorMessage}
        </div>
      )}

      <Button type="submit" loading={busy} disabled={disabled}>
        Afspraak aanvragen
      </Button>

      {disabled && (
        <p className="form-disclaimer">Kies eerst een persoon, een dag en een tijdslot hierboven.</p>
      )}
    </form>
  );
}
