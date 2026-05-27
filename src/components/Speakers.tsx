import { useState } from 'react';

// De namen komen overeen met de bestandsnamen in public/ (bijv. "Berend Hoffmann.jpg").
const SPEAKERS = ['Berend Hoffmann', 'Steven Aerts', 'Tim Kramer'];

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type SpeakerProps = {
  name: string;
  selected: boolean;
  onToggle: () => void;
};

function Speaker({ name, selected, onToggle }: SpeakerProps) {
  const [failed, setFailed] = useState(false);

  return (
    <li className="speaker">
      <button
        type="button"
        className={`speaker-bubble${selected ? ' speaker-bubble--selected' : ''}`}
        onClick={onToggle}
        aria-pressed={selected}
      >
        <span className="speaker-photo">
          {failed ? (
            <span className="speaker-initials">{initials(name)}</span>
          ) : (
            <img
              src={`${import.meta.env.BASE_URL}${encodeURI(name)}.jpg`}
              alt=""
              onError={() => setFailed(true)}
            />
          )}
        </span>
        <span className="speaker-name">{name}</span>
      </button>
    </li>
  );
}

type SpeakersProps = {
  selected: string;
  onChange: (name: string) => void;
};

export default function Speakers({ selected, onChange }: SpeakersProps) {
  return (
    <section className="speakers">
      <h2 className="speakers-title">Wie heb je gesproken?</h2>
      <ul className="speakers-list">
        {SPEAKERS.map((name) => (
          <Speaker
            key={name}
            name={name}
            selected={selected === name}
            // Opnieuw klikken op de geselecteerde deselecteert (optioneel veld).
            onToggle={() => onChange(selected === name ? '' : name)}
          />
        ))}
      </ul>
    </section>
  );
}
