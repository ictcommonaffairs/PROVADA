import { useState } from 'react';
import { sendForm, type FormPayload } from '../lib/email';

type SubmitState = 'idle' | 'submitting' | 'error';

export function useSubmit(onSuccess: () => void) {
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit(payload: FormPayload, honeypot: string) {
    if (honeypot.trim() !== '') {
      onSuccess();
      return;
    }

    setState('submitting');
    setErrorMessage(null);
    try {
      await sendForm(payload);
      setState('idle');
      onSuccess();
    } catch (err) {
      setState('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Versturen mislukt. Probeer opnieuw of mail ons op tim@commonaffairs.nl',
      );
    }
  }

  return { state, errorMessage, submit };
}
