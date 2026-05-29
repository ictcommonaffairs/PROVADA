// Backend voor het BdB-Groep afsprakenformulier.
// Bewust GEEN mail-routes (geen FormSubmit, geen Web3Forms): alleen schrijven naar
// het BdB-Google-Sheet via de Apps Script Web App. Conflict-check zit serverside.

import { APPS_SCRIPT_URL } from '../data';

export type BookingPayload = {
  person: string;        // bv. 'Voornaam Achternaam'
  dayIso: string;        // '2026-06-09'
  dayLabel: string;      // 'Dinsdag 9 juni'
  time: string;          // 'HH:MM'
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
};

type WriteResponse = { success?: boolean; error?: string; message?: string };

export async function sendBooking(payload: BookingPayload): Promise<void> {
  if (!APPS_SCRIPT_URL) {
    throw new Error(
      'Boekingen zijn nog niet geactiveerd. Neem contact op via de stand.',
    );
  }

  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      person: payload.person,
      dayIso: payload.dayIso,
      dayLabel: payload.dayLabel,
      time: payload.time,
      name: payload.name,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      topic: payload.topic,
    }),
  });
  if (!res.ok) {
    throw new Error('Versturen mislukt, probeer het opnieuw.');
  }
  const data = (await res.json().catch(() => null)) as WriteResponse | null;
  if (!data || !data.success) {
    if (data?.error === 'slot_taken') {
      throw new Error(
        'Dit tijdslot is net door iemand anders geboekt. Kies een ander slot en probeer opnieuw.',
      );
    }
    throw new Error('Versturen mislukt, probeer het opnieuw.');
  }
}
