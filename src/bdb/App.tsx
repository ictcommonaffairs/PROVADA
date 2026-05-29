import { useEffect, useMemo, useState } from 'react';
import PersonPicker from './components/PersonPicker';
import DayPicker from './components/DayPicker';
import SlotPicker from './components/SlotPicker';
import BookingForm from './components/BookingForm';
import ThankYou from './components/ThankYou';
import {
  BLOCKED,
  DAYS,
  SLOTS,
  findBlocked,
  findUnavailable,
  slotsForDay,
  type SlotStatus,
} from './data';
import { sendBooking } from './lib/sheet';
import { slotKey, useAvailability } from './useAvailability';

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

  const { taken, loading: loadingAvailability, error: availabilityError } = useAvailability();

  const dayLabel = DAYS.find((d) => d.iso === dayIso)?.label ?? '';
  const ready = Boolean(person && dayIso && slot);

  const daySlots = useMemo(() => (dayIso ? slotsForDay(dayIso) : SLOTS), [dayIso]);

  useEffect(() => {
    if (slot && !daySlots.includes(slot)) {
      setSlot('');
    }
  }, [daySlots, slot]);

  const statuses: Record<string, SlotStatus> = useMemo(() => {
    const map: Record<string, SlotStatus> = {};
    for (const time of daySlots) {
      const blocked = dayIso ? findBlocked(dayIso, time) : undefined;
      if (blocked) {
        map[time] = { state: 'blocked', reason: blocked.reason };
        continue;
      }
      if (person && dayIso) {
        const unav = findUnavailable(person, dayIso, time);
        if (unav) {
          map[time] = { state: 'blocked', reason: unav.reason ?? 'Niet beschikbaar' };
          continue;
        }
        if (taken.has(slotKey(person, dayIso, time))) {
          map[time] = { state: 'taken' };
          continue;
        }
      }
      map[time] = { state: 'available' };
    }
    return map;
  }, [dayIso, person, taken, daySlots]);

  const blockedForDay = useMemo(
    () => (dayIso ? BLOCKED.filter((b) => b.dayIso === dayIso) : []),
    [dayIso],
  );

  if (confirmed) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">
            <img
              className="brand-logo"
              src={`${import.meta.env.BASE_URL}bdb/${encodeURI('bdb groep-logo.svg')}`}
              alt="BdB Groep"
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
          <span>BdB Groep · PROVADA 2026</span>
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
            src={`${import.meta.env.BASE_URL}bdb/${encodeURI('bdb groep-logo.svg')}`}
            alt="BdB Groep"
          />
          <span className="brand-sub">PROVADA 2026 · Afspraak inplannen</span>
        </div>
      </header>

      <main className="app-main">
        <section className="card form">
          <div className="form-intro">
            <h1 className="form-title">Plan een afspraak van 15 minuten</h1>
            <p className="form-subtitle">
              Kies met wie je wilt spreken, op welke dag en hoe laat.
            </p>
          </div>

          <h2 className="step-title">1. Met wie wil je een afspraak?</h2>
          <PersonPicker selected={person} onChange={setPerson} />

          <h2 className="step-title">2. Welke dag?</h2>
          <DayPicker selected={dayIso} onChange={setDayIso} />

          {blockedForDay.length > 0 && (
            <ul className="blocked-list" aria-label="Vaste presentaties op deze dag">
              {blockedForDay.map((b) => (
                <li key={`${b.dayIso}-${b.from}`} className="blocked-item">
                  <span className="blocked-time">{b.from}-{b.to}</span>
                  <span className="blocked-reason">{b.reason}</span>
                </li>
              ))}
            </ul>
          )}

          <h2 className="step-title">3. Welk tijdslot?</h2>
          {loadingAvailability && (
            <p className="form-disclaimer">Beschikbaarheid laden...</p>
          )}
          {availabilityError && (
            <p className="form-disclaimer">
              Beschikbaarheid kon niet geladen worden, je kunt toch een voorkeur doorgeven.
            </p>
          )}
          <SlotPicker
            selected={slot}
            onChange={setSlot}
            disabled={!person || !dayIso}
            statuses={statuses}
            slots={daySlots}
          />

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
        <span>BdB Groep · PROVADA 2026</span>
      </footer>
    </div>
  );
}
