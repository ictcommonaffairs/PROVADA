import { useState } from 'react';
import Speakers from '../components/Speakers';
import DayPicker from './components/DayPicker';
import SlotPicker from './components/SlotPicker';
import BookingForm from './components/BookingForm';
import ThankYou from './components/ThankYou';
import { DAYS } from './data';
import { sendBooking } from './lib/email';

type Confirmed = {
  person: string;
  dayLabel: string;
  time: string;
};

export default function App() {
  const [person, setPerson] = useState('');
  const [dayIso, setDayIso] = useState('');
  const [slot, setSlot] = useState('');
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);

  const dayLabel = DAYS.find((d) => d.iso === dayIso)?.label ?? '';
  const ready = Boolean(person && dayIso && slot);

  if (confirmed) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">
            <img
              className="brand-logo"
              src={`${import.meta.env.BASE_URL}citymaker-logo.svg`}
              alt="Citymaker"
            />
            <span className="brand-sub">PROVADA 2026</span>
          </div>
        </header>
        <main className="app-main">
          <ThankYou
            person={confirmed.person}
            dayLabel={confirmed.dayLabel}
            time={confirmed.time}
            onReset={() => {
              setPerson('');
              setDayIso('');
              setSlot('');
              setConfirmed(null);
            }}
          />
        </main>
        <footer className="app-footer">
          <span>Citymaker · PROVADA 2026</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <img
            className="brand-logo"
            src={`${import.meta.env.BASE_URL}citymaker-logo.svg`}
            alt="Citymaker"
          />
          <span className="brand-sub">PROVADA 2026 · Afspraak inplannen</span>
        </div>
      </header>

      <main className="app-main">
        <section className="card form">
          <div className="form-intro">
            <h1 className="form-title">Plan je 15-minuten afspraak</h1>
            <p className="form-subtitle">
              Kies met wie je wilt spreken, op welke dag en hoe laat. We bevestigen de afspraak per mail.
            </p>
          </div>

          <h2 className="step-title">1. Met wie wil je een afspraak?</h2>
          <Speakers selected={person} onChange={setPerson} />

          <h2 className="step-title">2. Welke dag?</h2>
          <DayPicker selected={dayIso} onChange={setDayIso} />

          <h2 className="step-title">3. Welk tijdslot?</h2>
          <SlotPicker selected={slot} onChange={setSlot} disabled={!person || !dayIso} />

          <h2 className="step-title">4. Jouw gegevens</h2>
          <BookingForm
            disabled={!ready}
            onSubmit={async (values) => {
              await sendBooking({
                person,
                dayIso,
                dayLabel,
                time: slot,
                ...values,
              });
              setConfirmed({ person, dayLabel, time: slot });
            }}
          />
        </section>
      </main>

      <footer className="app-footer">
        <span>Citymaker · PROVADA 2026</span>
      </footer>
    </div>
  );
}
