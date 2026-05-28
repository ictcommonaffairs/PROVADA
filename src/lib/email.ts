import { APPS_SCRIPT_URL } from './config';

// Ontvanger van de aanmeldingen. Pas dit aan als de mail naar een ander adres moet.
const RECIPIENT = 'tim@commonaffairs.nl';

// Primaire route: FormSubmit.co (AJAX) - stuurt de inzending als e-mail naar RECIPIENT.
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${RECIPIENT}`;

// Backup-route + log: Web3Forms. Mailt ook naar het bij de key geregistreerde adres
// en logt elke inzending in het Web3Forms-dashboard. Key is bedoeld voor client-side gebruik.
const WEB3FORMS_KEY = 'd68430f3-4107-41c9-8c33-5e8164621c18';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export type FormPayload = {
  name: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  message: string;
  interests: string[];
  interestOther: string;
  spokeWith: string;
};

export function buildEmailFields(payload: FormPayload): Record<string, string> {
  const interestList = [
    ...payload.interests,
    payload.interestOther.trim() ? `Anders: ${payload.interestOther.trim()}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return {
    // FormSubmit-instellingen (velden die met _ beginnen worden niet getoond).
    _subject: `PROVADA: nieuwe aanmelding van ${payload.name} (${payload.company})`,
    _template: 'table',
    _captcha: 'false',
    _replyto: payload.email, // 'Beantwoorden' gaat naar de aanmelder
    // Inhoud van de mail.
    Naam: payload.name,
    Bedrijf: payload.company,
    Functie: payload.jobTitle || '-',
    'E-mail': payload.email,
    Telefoon: payload.phone || '-',
    Interesse: interestList || '-',
    'Gesproken met': payload.spokeWith || '-',
    Bericht: payload.message || '-',
    Verstuurd: new Date().toLocaleString('nl-NL', {
      dateStyle: 'long',
      timeStyle: 'short',
    }),
  };
}

type EndpointResponse = { success?: boolean | string; message?: string };

async function postFormSubmit(payload: FormPayload): Promise<void> {
  const res = await fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(buildEmailFields(payload)),
  });
  if (!res.ok) throw new Error(`FormSubmit status ${res.status}`);
  const data = (await res.json().catch(() => null)) as EndpointResponse | null;
  // FormSubmit retourneert success als string "true".
  if (!data || String(data.success) !== 'true') {
    throw new Error(data?.message || 'FormSubmit gaf geen success terug');
  }
}

async function postWeb3Forms(payload: FormPayload): Promise<void> {
  // Web3Forms-velden: access_key + subject + reply_to + from_name zijn gereserveerd;
  // alle overige velden worden als rijen in de mail/dashboard-log opgenomen.
  const fields = buildEmailFields(payload);
  // FormSubmit-only velden eruit slopen voor de Web3Forms-payload.
  const {
    _subject, _template: _t, _captcha: _c, _replyto, ...rest
  } = fields;
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
  if (!res.ok) throw new Error(`Web3Forms status ${res.status}`);
  const data = (await res.json().catch(() => null)) as EndpointResponse | null;
  if (!data || data.success !== true) {
    throw new Error(data?.message || 'Web3Forms gaf geen success terug');
  }
}

async function postAppsScriptLog(payload: FormPayload): Promise<void> {
  if (!APPS_SCRIPT_URL) return;

  const interestList = [
    ...payload.interests,
    payload.interestOther.trim() ? `Anders: ${payload.interestOther.trim()}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const body = {
    kind: 'contact',
    name: payload.name,
    company: payload.company,
    jobTitle: payload.jobTitle,
    email: payload.email,
    phone: payload.phone,
    message: payload.message,
    interests: interestList,
    spokeWith: payload.spokeWith,
  };

  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('apps script status ' + res.status);
  const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
  if (!data || data.success !== true) {
    throw new Error('apps script geen success');
  }
}

export async function sendForm(payload: FormPayload): Promise<void> {
  // Parallel verzenden naar drie routes: twee mails (FormSubmit, Web3Forms) + sheet-log.
  // Eentje succesvol is genoeg voor de bezoeker.
  const results = await Promise.allSettled([
    postFormSubmit(payload),
    postWeb3Forms(payload),
    postAppsScriptLog(payload),
  ]);

  const ok = results.some((r) => r.status === 'fulfilled');
  if (!ok) {
    // Bewust geen provider-namen of fout-details aan de bezoeker tonen.
    throw new Error('Versturen mislukt. Probeer het opnieuw of mail ons op tim@commonaffairs.nl.');
  }
}
