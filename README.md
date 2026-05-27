# PROVADA Citymaker bezoekersformulier

Mobiel-eerst webapp voor de Citymaker-stand op PROVADA. Bezoekers scannen de
QR-code, vullen het formulier in en bij verzenden wordt de inhoud per e-mail
naar **tim@commonaffairs.nl** gestuurd via EmailJS (client-side, geen backend).

## Setup

1. Installeer dependencies:
   ```powershell
   npm install
   ```

2. Maak een EmailJS-account: https://www.emailjs.com (gratis tier ~200/maand).

3. Koppel een mailservice (Gmail/Outlook/SMTP), maak een template met deze
   placeholders:

   - `{{name}}` `{{company}}` `{{job_title}}` `{{email}}` `{{phone}}`
   - `{{message}}` `{{interests}}` `{{subject}}` `{{submitted_at}}`

   Zet in de template **To** op `tim@commonaffairs.nl` en **Reply-To** op
   `{{email}}`.

4. Kopieer `.env.example` naar `.env.local` en vul je IDs in:
   ```
   VITE_EMAILJS_SERVICE_ID=service_xxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
   ```

## Lokaal draaien

```powershell
npm run dev          # http://localhost:5173
npm run dev -- --host   # ook beschikbaar op LAN voor mobiel-testen
```

## Build

```powershell
npm run build        # output naar dist/
npm run preview      # serveer de build lokaal
```

## Deploy

De `dist/`-map is een statische site: Vercel, Netlify, GitHub Pages of eigen
hosting werkt allemaal. Bij Vercel: importeer de repo, plak dezelfde
`VITE_EMAILJS_*` variabelen in de project settings.

## Styling aanpassen aan Citymaker-Figma

Pas `src/styles/index.css` aan: alle kleuren, font en radius zijn CSS-variabelen
in `:root`. Logo zit in `src/components/Header.tsx` (vervang het SVG-mark door
het echte Citymaker-logo).
