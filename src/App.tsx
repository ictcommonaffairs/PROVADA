import { useState } from 'react';
import Header from './components/Header';
import ContactForm from './components/ContactForm';
import ThankYou from './components/ThankYou';

type View = 'form' | 'success';

export default function App() {
  const [view, setView] = useState<View>('form');

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        {view === 'form' ? (
          <ContactForm onSuccess={() => setView('success')} />
        ) : (
          <ThankYou onReset={() => setView('form')} />
        )}
      </main>
      <footer className="app-footer">
        <span>Citymaker · PROVADA 2026</span>
      </footer>
    </div>
  );
}
