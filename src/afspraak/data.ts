// Configuratie voor het afsprakenformulier. Pas dit aan wanneer de PROVADA-data
// of de medewerkers veranderen.

export type Person = {
  name: string;
  // Bestandsnaam in public/ (zonder extensie). Verwacht <name>.jpg.
  photo: string;
};

export const PEOPLE: Person[] = [
  { name: 'Berend Hoffmann', photo: 'Berend Hoffmann' },
  { name: 'Steven Aerts', photo: 'Steven Aerts' },
  { name: 'Tim Kramer', photo: 'Tim Kramer' },
];

export type Day = {
  // ISO datum (YYYY-MM-DD) voor de mail-payload.
  iso: string;
  // Label voor de knop.
  label: string;
  // Eindtijd voor die dag, exclusief (laatste boekbare slot start = endTime - 15 min).
  endTime: string;
};

export const DAYS: Day[] = [
  { iso: '2026-06-09', label: 'Dinsdag 9 juni',   endTime: '19:00' },
  { iso: '2026-06-10', label: 'Woensdag 10 juni', endTime: '19:00' },
  { iso: '2026-06-11', label: 'Donderdag 11 juni', endTime: '18:00' },
];

// Tijdsloten: 10:00 tot het maximum van alle dagen, in 15-min stappen.
// slotsForDay() filtert per dag op die dag-specifieke eindtijd.
const START_HOUR = 10;
const END_HOUR_MAX = 19; // overall maximum (langste dag)
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
  // Lexicografisch werkt voor 'HH:MM' (vergelijking is correct omdat het zero-padded is).
  return SLOTS.filter((t) => t < day.endTime);
}

// Live availability via Google Apps Script Web App. URL staat centraal in src/lib/config.ts
// zodat zowel deze afspraak-app als het citymaker-formulier dezelfde endpoint gebruiken.
export { APPS_SCRIPT_URL as AVAILABILITY_URL } from '../lib/config';

// Vaste presentatie/Arena-blokken waarin niemand boekbaar is.
// Een slot is geblokkeerd als de tijd in [from, to) valt op die dag.
export type BlockedRange = {
  dayIso: string;
  from: string; // 'HH:MM' inclusief
  to: string;   // 'HH:MM' exclusief
  reason: string;
};

export const BLOCKED: BlockedRange[] = [
  // Dinsdag 9 juni
  {
    dayIso: '2026-06-09',
    from: '13:15',
    to: '13:45',
    reason: 'Stand 11.01 - Citymaker: versneld integraal waterbewuste gebiedsontwikkeling',
  },
  {
    dayIso: '2026-06-09',
    from: '16:00',
    to: '17:00',
    reason: 'Stand 11.01 - IGG bouweconomie: Data als fundament, IGG en de toekomst van kosten management',
  },
  // Woensdag 10 juni
  {
    dayIso: '2026-06-10',
    from: '11:45',
    to: '12:30',
    reason: "Arena: lancering rekentool 'Citymaker'",
  },
  {
    dayIso: '2026-06-10',
    from: '13:15',
    to: '13:45',
    reason: 'Stand 11.01 - IGG en BdB Groep: Leiderschap, de cruciale competentie voor ontwikkeling van teams en mensen',
  },
  {
    dayIso: '2026-06-10',
    from: '16:00',
    to: '17:00',
    reason: 'Stand 11.01 - Citymaker, IGG, BdB Groep & Objectum: slimme projecten beginnen met samenwerking',
  },
  // Donderdag 11 juni
  {
    dayIso: '2026-06-11',
    from: '13:00',
    to: '13:30',
    reason: 'Stand 11.01 - IGG en Objectum: Samen bouwen aan blijvende waarde',
  },
];

export function findBlocked(dayIso: string, time: string): BlockedRange | undefined {
  return BLOCKED.find((b) => b.dayIso === dayIso && time >= b.from && time < b.to);
}

export type SlotState = 'available' | 'taken' | 'blocked';
export type SlotStatus = { state: SlotState; reason?: string };

