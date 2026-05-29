import { useState } from 'react';
import { PEOPLE } from '../data';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type PersonProps = {
  name: string;
  file: string;
  selected: boolean;
  onToggle: () => void;
};

function Person({ name, file, selected, onToggle }: PersonProps) {
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
              src={`${import.meta.env.BASE_URL}bdb/${encodeURI(file)}`}
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

type PersonPickerProps = {
  selected: string;
  onChange: (name: string) => void;
};

export default function PersonPicker({ selected, onChange }: PersonPickerProps) {
  return (
    <section className="speakers">
      <ul className="speakers-list">
        {PEOPLE.map((p) => (
          <Person
            key={p.name}
            name={p.name}
            file={p.file}
            selected={selected === p.name}
            onToggle={() => onChange(selected === p.name ? '' : p.name)}
          />
        ))}
      </ul>
    </section>
  );
}
