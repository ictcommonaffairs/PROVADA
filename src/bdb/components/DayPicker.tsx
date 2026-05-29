import { DAYS } from '../data';

type DayPickerProps = {
  selected: string;
  onChange: (iso: string) => void;
};

export default function DayPicker({ selected, onChange }: DayPickerProps) {
  return (
    <div className="day-picker" role="radiogroup" aria-label="Kies een dag">
      {DAYS.map((d) => {
        const isSelected = selected === d.iso;
        return (
          <button
            key={d.iso}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`day-button${isSelected ? ' day-button--selected' : ''}`}
            onClick={() => onChange(d.iso)}
          >
            <span className="day-button-label">{d.label}</span>
            <span className="day-button-sub">2026</span>
          </button>
        );
      })}
    </div>
  );
}
