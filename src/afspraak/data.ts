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
};

export const DAYS: Day[] = [
  { iso: '2026-06-09', label: 'Dinsdag 9 juni' },
  { iso: '2026-06-10', label: 'Woensdag 10 juni' },
  { iso: '2026-06-11', label: 'Donderdag 11 juni' },
];

// Tijdsloten: 10:00 t/m 17:15 in 15-min stappen (laatste 15-min afspraak start 17:15).
// Pas START_HOUR / END_HOUR / SLOT_MINUTES aan als de openingstijden anders zijn.
const START_HOUR = 10;
const END_HOUR = 17.5; // 17:30 = eindtijd
const SLOT_MINUTES = 15;

function buildSlots(): string[] {
  const slots: string[] = [];
  const totalMinutes = (END_HOUR - START_HOUR) * 60;
  for (let m = 0; m < totalMinutes; m += SLOT_MINUTES) {
    const h = START_HOUR + Math.floor(m / 60);
    const mm = m % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`);
  }
  return slots;
}

export const SLOTS: string[] = buildSlots();

// Live availability via Google Apps Script Web App (zie README/instructies).
// Vul deze URL in nadat je de Apps Script hebt gedeployed; laat leeg om de pagina
// zonder live-checks te draaien (alleen geblokkeerde presentatieslots zijn dan uit).
export const AVAILABILITY_URL = '';

// Vaste presentatie/Arena-blokken waarin niemand boekbaar is.
// Een slot is geblokkeerd als de tijd in [from, to) valt op die dag.
export type BlockedRange = {
  dayIso: string;
  from: string; // 'HH:MM' inclusief
  to: string;   // 'HH:MM' exclusief
  reason: string;
};

export const BLOCKED: BlockedRange[] = [
  {
    dayIso: '2026-06-09',
    from: '13:15',
    to: '13:45',
    reason: 'Stand 11.01: versneld integraal waterbewuste gebiedsontwikkeling',
  },
  {
    dayIso: '2026-06-10',
    from: '11:45',
    to: '12:30',
    reason: "Arena: lancering rekentool 'Citymaker'",
  },
  {
    dayIso: '2026-06-10',
    from: '16:00',
    to: '18:45',
    reason: 'Stand 11.01: slimme projecten beginnen met samenwerking',
  },
];

export function findBlocked(dayIso: string, time: string): BlockedRange | undefined {
  return BLOCKED.find((b) => b.dayIso === dayIso && time >= b.from && time < b.to);
}

export type SlotState = 'available' | 'taken' | 'blocked';
export type SlotStatus = { state: SlotState; reason?: string };

