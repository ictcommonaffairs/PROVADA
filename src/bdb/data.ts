// Configuratie voor het BdB-Groep afsprakenformulier.
// LET OP: dit is bewust losstaand van de Citymaker-app. Wijzigingen hier
// hebben geen effect op /afspraak/.

// Apps Script Web App URL voor het BdB-spreadsheet.
export const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw165sTHh5Q7iwW3MUkMNkM6iewNFZIeT3t-sAtsEOt0_uH5JFQagFR_PPUKLDOMyuO/exec';

// Personen + foto-bestandsnaam (inclusief extensie) in public/bdb/.
// Hoofdletters/spaties in naam = ook in bestandsnaam.
export type Person = {
  name: string;
  file: string;
};

export const PEOPLE: Person[] = [
  { name: 'Kristen Wokke',        file: 'Kristen Wokke.jpg' },
  { name: 'Sebastiaan Tiemessen', file: 'Sebastiaan Tiemessen.jpg' },
  { name: 'Rosa Bosman',          file: 'Rosa Bosman.jpg' },
  { name: 'Martijn Scheijde',     file: 'Martijn Scheijde.png' },
  { name: 'Rianne Pape',          file: 'Rianne Pape.png' },
];

// Dagen.
export type Day = {
  iso: string;
  label: string;
};

export const DAYS: Day[] = [
  { iso: '2026-06-09', label: 'Dinsdag 9 juni' },
  { iso: '2026-06-10', label: 'Woensdag 10 juni' },
  { iso: '2026-06-11', label: 'Donderdag 11 juni' },
];

// Vaste 15-minuten slots (gedeeld over alle drie de dagen).
// Gaten 11:30-13:30 (lunch), 14:00-14:30, 16:00-16:30 en na 17:00 zijn bewust niet boekbaar.
export const SLOTS: string[] = [
  '10:00', '10:15', '10:30', '10:45', '11:00', '11:15',
  '13:30', '13:45',
  '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
  '16:30', '16:45',
];

export function slotsForDay(_dayIso: string): string[] {
  // Alle dagen hetzelfde rooster. Pas dit aan als een dag eigen slots krijgt.
  return SLOTS;
}

// Vaste blokken die voor IEDEREEN gelden (bv. gezamenlijke presentatie).
// Een slot is geblokkeerd als de starttijd in [from, to) valt op die dag.
export type BlockedRange = {
  dayIso: string;
  from: string;
  to: string;
  reason: string;
};

export const BLOCKED: BlockedRange[] = [
  // Eerste half uur elke dag voor iedereen geblokkeerd.
  { dayIso: '2026-06-09', from: '10:00', to: '10:30', reason: 'Niet beschikbaar' },
  { dayIso: '2026-06-10', from: '10:00', to: '10:30', reason: 'Niet beschikbaar' },
  { dayIso: '2026-06-11', from: '10:00', to: '10:30', reason: 'Niet beschikbaar' },
  // Gezamenlijke presentatie.
  { dayIso: '2026-06-10', from: '13:30', to: '14:00', reason: 'Gezamenlijke presentatie' },
];

export function findBlocked(dayIso: string, time: string): BlockedRange | undefined {
  return BLOCKED.find((b) => b.dayIso === dayIso && time >= b.from && time < b.to);
}

// Per persoon: niet beschikbaar op specifieke dag + slot.
// Iemand kan ook hele dag(en) niet aanwezig zijn (gewoon alle slots toevoegen).
export type Unavailable = {
  person: string;   // moet exact matchen met Person.name
  dayIso: string;
  time: string;     // exact een waarde uit SLOTS
  reason?: string;  // optioneel; standaard 'Niet beschikbaar'
};

export const UNAVAILABLE: Unavailable[] = [
  // Rosa, dinsdag 14:30-15:00
  { person: 'Rosa Bosman',   dayIso: '2026-06-09', time: '14:30' },
  { person: 'Rosa Bosman',   dayIso: '2026-06-09', time: '14:45' },

  // Kristen, woensdag 14:30-15:00 (andere afspraak)
  { person: 'Kristen Wokke', dayIso: '2026-06-10', time: '14:30', reason: 'Andere afspraak' },
  { person: 'Kristen Wokke', dayIso: '2026-06-10', time: '14:45', reason: 'Andere afspraak' },

  // Rosa, woensdag 15:30-16:00
  { person: 'Rosa Bosman',   dayIso: '2026-06-10', time: '15:30' },
  { person: 'Rosa Bosman',   dayIso: '2026-06-10', time: '15:45' },

  // Kristen, donderdag 15:30-16:00
  { person: 'Kristen Wokke', dayIso: '2026-06-11', time: '15:30' },
  { person: 'Kristen Wokke', dayIso: '2026-06-11', time: '15:45' },

  // Rianne, donderdag 11:00-11:30
  { person: 'Rianne Pape',   dayIso: '2026-06-11', time: '11:00' },
  { person: 'Rianne Pape',   dayIso: '2026-06-11', time: '11:15' },

  // Rianne, donderdag 15:30-16:00
  { person: 'Rianne Pape',   dayIso: '2026-06-11', time: '15:30' },
  { person: 'Rianne Pape',   dayIso: '2026-06-11', time: '15:45' },
];

export function findUnavailable(
  person: string,
  dayIso: string,
  time: string,
): Unavailable | undefined {
  return UNAVAILABLE.find((u) => u.person === person && u.dayIso === dayIso && u.time === time);
}

export type SlotState = 'available' | 'taken' | 'blocked';
export type SlotStatus = { state: SlotState; reason?: string };
