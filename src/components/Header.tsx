import { useState } from 'react';

export default function Header() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header className="app-header">
      <div className="brand">
        {logoFailed ? (
          <span className="brand-name brand-name--fallback">Citymaker</span>
        ) : (
          <img
            className="brand-logo"
            src={`${import.meta.env.BASE_URL}citymaker-logo.svg`}
            alt="Citymaker"
            onError={() => setLogoFailed(true)}
          />
        )}
        <span className="brand-sub">PROVADA 2026</span>
      </div>
    </header>
  );
}
