// Configuratie voor het BdB-Groep afsprakenformulier.
// LET OP: dit is bewust losstaand van de Citymaker-app. Wijzigingen hier
// hebben geen effect op /afspraak/.

// ============================================================
// VUL IN: Apps Script Web App URL voor het BdB-spreadsheet.
// Laat leeg tot je het hebt aangemaakt; dan toont de pagina geen live
// availability maar werkt de blocked-list wel.
// ============================================================
export const APPS_SCRIPT_URL = '';

// ============================================================
// VUL IN: namen en bijbehorende foto-bestandsnaam (zonder extensie).
// Foto's komen in public/bdb/<photo>.jpg.
// ============================================================
export type Person = {
  name: string;
  photo: string;
};

export const PEOPLE: Person[] = [
  { name: 'Voorbeeld Naam Een', photo: 'Voorbeeld Naam Een' },
  { name: 'Voorbeeld Naam Twee', photo: 'Voorbeeld Naam Twee' },
  { name: 'Voorbeeld Naam Drie', photo: 'Voorbeeld Naam Drie' },
];

// ============================================================
// VUL IN: dagen en eindtijden (start = 10:00 standaard, zie hieronder).
// ============================================================
export type Day = {
  iso: string;
  label: string;
  endTime: string; // 'HH:MM' exclusief
};

export const DAYS: Day[] = [
  { iso: '2026-06-09', label: 'Dinsdag 9 juni',   endTime: '19:00' },
  { iso: '2026-06-10', label: 'Woensdag 10 juni', endTime: '19:00' },
  { iso: '2026-06-11', label: 'Donderdag 11 juni', endTime: '18:00' },
];

const START_HOUR = 10;
const END_HOUR_MAX = 19;
const SLOT_MINUTES = 15;

function buildSlots(): string[] {
  const slots: string[] = [];
  const totalMinutes = (END_HOUR_MAX - START_HOUR) * 60;
  for (let m = 0; m < totalMinutes; m += SLOT_MINUTES) {
    const h = START_HOUR + Math.floor(m / 60);
    const mm = m % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`);
  }
  return slots;
}

export const SLOTS: string[] = buildSlots();

export function slotsForDay(dayIso: string): string[] {
  const day = DAYS.find((d) => d.iso === dayIso);
  if (!day) return SLOTS;
  return SLOTS.filter((t) => t < day.endTime);
}

// ============================================================
// VUL IN: vaste blokken waarin niemand boekbaar is (presentaties etc.).
// ============================================================
export type BlockedRange = {
  dayIso: string;
  from: string;
  to: string;
  reason: string;
};

export const BLOCKED: BlockedRange[] = [
  // Voorbeeld:
  // { dayIso: '2026-06-09', from: '13:00', to: '13:30', reason: 'Presentatie X' },
];

export function findBlocked(dayIso: string, time: string): BlockedRange | undefined {
  return BLOCKED.find((b) => b.dayIso === dayIso && time >= b.from && time < b.to);
}

export type SlotState = 'available' | 'taken' | 'blocked';
export type SlotStatus = { state: SlotState; reason?: string };
