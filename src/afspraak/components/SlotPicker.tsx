import { SLOTS, type SlotStatus } from '../data';

type SlotPickerProps = {
  selected: string;
  onChange: (slot: string) => void;
  disabled?: boolean;
  statuses?: Record<string, SlotStatus>;
};

export default function SlotPicker({
  selected,
  onChange,
  disabled = false,
  statuses = {},
}: SlotPickerProps) {
  return (
    <div
      className={`slot-grid${disabled ? ' slot-grid--disabled' : ''}`}
      role="radiogroup"
      aria-label="Kies een tijdslot"
    >
      {SLOTS.map((s) => {
        const status: SlotStatus = statuses[s] ?? { state: 'available' };
        const isSelected = selected === s;
        const isDisabled = disabled || status.state !== 'available';
        const cls = [
          'slot-button',
          isSelected ? 'slot-button--selected' : '',
          status.state === 'taken' ? 'slot-button--taken' : '',
          status.state === 'blocked' ? 'slot-button--blocked' : '',
        ]
          .filter(Boolean)
          .join(' ');
        const title =
          status.state === 'blocked'
            ? status.reason
            : status.state === 'taken'
            ? 'Bezet'
            : undefined;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            className={cls}
            onClick={() => onChange(s)}
            title={title}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
