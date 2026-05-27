/**
 * Designtokens: vervang waardes door Citymaker-Figma tokens zodra de link gedeeld is.
 * De CSS-variabelen in styles/index.css consumeren deze logische namen.
 */
export const theme = {
  colors: {
    primary: '#0F4FE0',
    primaryDark: '#0B3CB0',
    primarySoft: '#E6EEFF',
    bg: '#F5F7FB',
    surface: '#FFFFFF',
    text: '#0F1A2B',
    textMuted: '#5A6478',
    border: '#D7DCE5',
    error: '#D1342F',
    success: '#1F9D55',
    successSoft: '#E3F6EC',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '20px',
  },
  font: {
    base: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
} as const;
