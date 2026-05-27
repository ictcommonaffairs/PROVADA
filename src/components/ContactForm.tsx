import { useState, type FormEvent } from 'react';
import Field from './Field';
import Checkbox from './Checkbox';
import Button from './Button';
import Speakers from './Speakers';
import { useSubmit } from '../hooks/useSubmit';

const INTEREST_OPTIONS = [
  'Demo aanvragen',
  'Prijsinformatie',
  'Samenwerken / partnership',
  'Hou mij op de hoogte',
];

type Errors = Partial<Record<'name' | 'company' | 'email', string>>;

type ContactFormProps = {
  onSuccess: () => void;
};

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [other, setOther] = useState(false);
  const [interestOther, setInterestOther] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [spokeWith, setSpokeWith] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const { state, errorMessage, submit } = useSubmit(onSuccess);

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

  function toggleInterest(option: string, checked: boolean) {
    setInterests((prev) =>
      checked ? [...prev, option] : prev.filter((o) => o !== option),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    await submit(
      {
        name: name.trim(),
        company: company.trim(),
        jobTitle: jobTitle.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        interests,
        interestOther: other ? interestOther : '',
        spokeWith,
      },
      honeypot,
    );
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <div className="form-intro">
        <h1 className="form-title">Even kort kennismaken</h1>
        <p className="form-subtitle">
          Laat je gegevens achter en stel je vraag, dan nemen we na de beurs contact met je op.
        </p>
      </div>

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
          label="Functie"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          autoComplete="organization-title"
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
          label="Je vraag of opmerking"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Waar kunnen we je mee helpen?"
        />
      </div>

      <fieldset className="interests">
        <legend className="interests-legend">Waar heb je interesse in?</legend>
        <div className="interests-list">
          {INTEREST_OPTIONS.map((option) => (
            <Checkbox
              key={option}
              label={option}
              checked={interests.includes(option)}
              onChange={(e) => toggleInterest(option, e.target.checked)}
            />
          ))}
          <Checkbox
            label="Anders"
            checked={other}
            onChange={(e) => setOther(e.target.checked)}
          />
          {other && (
            <Field
              label="Anders, namelijk"
              value={interestOther}
              onChange={(e) => setInterestOther(e.target.value)}
              placeholder="Vertel ons in één regel"
            />
          )}
        </div>
      </fieldset>

      <Speakers selected={spokeWith} onChange={setSpokeWith} />

      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {state === 'error' && errorMessage && (
        <div className="form-error" role="alert">
          {errorMessage}
        </div>
      )}

      <Button type="submit" loading={state === 'submitting'}>
        Verzenden
      </Button>

      <p className="form-disclaimer">
        Door te verzenden ga je akkoord met het opslaan van deze gegevens voor contact door Citymaker.
      </p>
    </form>
  );
}
