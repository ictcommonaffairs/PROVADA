import { SLOTS } from '../data';

type SlotPickerProps = {
  selected: string;
  onChange: (slot: string) => void;
  disabled?: boolean;
};

export default function SlotPicker({ selected, onChange, disabled = false }: SlotPickerProps) {
  return (
    <div className={`slot-grid${disabled ? ' slot-grid--disabled' : ''}`} role="radiogroup" aria-label="Kies een tijdslot">
      {SLOTS.map((s) => {
        const isSelected = selected === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            className={`slot-button${isSelected ? ' slot-button--selected' : ''}`}
            onClick={() => onChange(s)}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
