// Mail-routes voor afspraakaanvragen. Zelfde dubbele verzending als het hoofdformulier:
// primair via FormSubmit, parallel via Web3Forms (log + backup). Eentje succesvol is genoeg.
// Daarnaast (optioneel) een schrijfactie naar de Google Apps Script voor live availability.

import { AVAILABILITY_URL } from '../data';

const RECIPIENT = 'tim@commonaffairs.nl';
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${RECIPIENT}`;
const WEB3FORMS_KEY = 'd68430f3-4107-41c9-8c33-5e8164621c18';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export type BookingPayload = {
  person: string;        // bv. 'Berend Hoffmann'
  dayIso: string;        // '2026-06-09'
  dayLabel: string;      // 'Dinsdag 9 juni'
  time: string;          // 'HH:MM'
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
};

export function buildBookingFields(payload: BookingPayload): Record<string, string> {
  return {
    _subject: `PROVADA: afspraakaanvraag - ${payload.person} op ${payload.dayLabel} om ${payload.time}`,
    _template: 'table',
    _captcha: 'false',
    _replyto: payload.email,
    Datum: `${payload.dayLabel} (${payload.dayIso})`,
    Tijd: `${payload.time} (15 minuten)`,
    'Afspraak met': payload.person,
    Naam: payload.name,
    Bedrijf: payload.company,
    'E-mail': payload.email,
    Telefoon: payload.phone || '-',
    Onderwerp: payload.topic || '-',
    Aangevraagd: new Date().toLocaleString('nl-NL', {
      dateStyle: 'long',
      timeStyle: 'short',
    }),
  };
}

type EndpointResponse = { success?: boolean | string; message?: string };

async function postFormSubmit(payload: BookingPayload): Promise<void> {
  const res = await fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(buildBookingFields(payload)),
  });
  if (!res.ok) throw new Error(`status ${res.status}`);
  const data = (await res.json().catch(() => null)) as EndpointResponse | null;
  if (!data || String(data.success) !== 'true') {
    throw new Error(data?.message || 'geen success terug');
  }
}

async function postWeb3Forms(payload: BookingPayload): Promise<void> {
  const fields = buildBookingFields(payload);
  const { _subject, _template: _t, _captcha: _c, _replyto, ...rest } = fields;
  void _t; void _c;

  const body = {
    access_key: WEB3FORMS_KEY,
    subject: _subject,
    reply_to: _replyto,
    from_name: payload.name,
    ...rest,
  };

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`status ${res.status}`);
  const data = (await res.json().catch(() => null)) as EndpointResponse | null;
  if (!data || data.success !== true) {
    throw new Error(data?.message || 'geen success terug');
  }
}

type WriteResponse = { success?: boolean; error?: string; message?: string };

async function postAvailabilityWrite(payload: BookingPayload): Promise<void> {
  if (!AVAILABILITY_URL) return; // Geen live availability geconfigureerd: skip.

  // text/plain om de CORS-preflight te vermijden die Apps Script niet beantwoordt.
  const res = await fetch(AVAILABILITY_URL, {
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
    throw new Error(
      'Beschikbaarheid niet bevestigd, probeer het opnieuw of mail ons op tim@commonaffairs.nl.',
    );
  }
  const data = (await res.json().catch(() => null)) as WriteResponse | null;
  if (!data || !data.success) {
    if (data?.error === 'slot_taken') {
      throw new Error(
        'Dit tijdslot is net door iemand anders geboekt. Kies een ander slot en probeer opnieuw.',
      );
    }
    throw new Error(
      'Beschikbaarheid niet bevestigd, probeer het opnieuw of mail ons op tim@commonaffairs.nl.',
    );
  }
}

export async function sendBooking(payload: BookingPayload): Promise<void> {
  // Eerst (indien geconfigureerd) de live availability check + log naar Google Sheet.
  // Bij een conflict gooien we hier al, dan slaan we de mail over.
  await postAvailabilityWrite(payload);

  // Daarna de mail-notificatie via FormSubmit + Web3Forms.
  const results = await Promise.allSettled([
    postFormSubmit(payload),
    postWeb3Forms(payload),
  ]);
  if (!results.some((r) => r.status === 'fulfilled')) {
    throw new Error(
      'Aanvraag versturen mislukt. Probeer het opnieuw of mail ons op tim@commonaffairs.nl.',
    );
  }
}
