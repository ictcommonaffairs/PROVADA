import Button from '../../components/Button';

type ThankYouProps = {
  person: string;
  dayLabel: string;
  time: string;
  onReset: () => void;
};

export default function ThankYou({ person, dayLabel, time, onReset }: ThankYouProps) {
  return (
    <section className="card thankyou" aria-live="polite">
      <div className="thankyou-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="64" height="64">
          <circle cx="32" cy="32" r="30" fill="var(--color-success-soft)" />
          <path
            d="M20 33l8 8 16-18"
            fill="none"
            stroke="var(--color-success)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="thankyou-title">Aanvraag verstuurd</h2>
      <p className="thankyou-text">
        Je hebt een afspraak van 15 minuten aangevraagd met <strong>{person}</strong> op{' '}
        <strong>{dayLabel}</strong> om <strong>{time}</strong>. We bevestigen 'm zo snel mogelijk per mail.
      </p>
      <Button variant="ghost" onClick={onReset}>Nog een afspraak aanvragen</Button>
      <p className="thankyou-link">
        <a href="https://www.citymaker.nl/" target="_blank" rel="noopener noreferrer">
          Bekijk citymaker.nl
        </a>
      </p>
    </section>
  );
}
