// Ontvanger van de aanmeldingen. Pas dit aan als de mail naar een ander adres moet.
const RECIPIENT = 'tim@commonaffairs.nl';

// FormSubmit.co AJAX-endpoint: POST blijft in de pagina (geen redirect) en
// stuurt de inzending automatisch als e-mail naar RECIPIENT.
const ENDPOINT = `https://formsubmit.co/ajax/${RECIPIENT}`;

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

export async function sendForm(payload: FormPayload): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(buildEmailFields(payload)),
  });

  if (!res.ok) {
    throw new Error(`Versturen mislukt (status ${res.status}). Probeer het later opnieuw`);
  }

  const data = (await res.json().catch(() => null)) as { success?: string; message?: string } | null;
  if (!data || data.success !== 'true') {
    throw new Error(
      data && typeof data.message === 'string'
        ? data.message
        : 'Versturen mislukt. Probeer het later opnieuw',
    );
  }
}
