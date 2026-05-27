import Button from './Button';

type ThankYouProps = {
  onReset: () => void;
};

export default function ThankYou({ onReset }: ThankYouProps) {
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
      <h2 className="thankyou-title">Bedankt!</h2>
      <p className="thankyou-text">
        Je bericht is verstuurd naar het Citymaker-team. We nemen zo snel mogelijk contact met je op.
      </p>
      <img className="thankyou-image" src={`${import.meta.env.BASE_URL}tafel-01.png`} alt="Tafel 01" />
      <Button variant="ghost" onClick={onReset}>Nog een bericht sturen</Button>
      <p className="thankyou-link">
        <a href="https://www.citymaker.nl/" target="_blank" rel="noopener noreferrer">
          Bekijk citymaker.nl
        </a>
      </p>
    </section>
  );
}
