import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'orange' | 'amber';

// Dieselben Werte stehen auch in index.css (--color-brand /
// [data-theme="amber"]) - fuer reines CSS reicht das Custom Property,
// aber framer-motion kann `animate={{ backgroundColor }}` nicht zwischen
// zwei Werten interpolieren, wenn einer davon ein opakes `var(...)` ist.
// Wo eine echte Farb-Animation laeuft, braucht es das reale Hex hier.
const ACCENT_HEX: Record<Theme, { accentHex: string; accentHoverHex: string }> = {
  orange: { accentHex: '#FF5A1F', accentHoverHex: '#C23E10' },
  amber: { accentHex: '#FFD60A', accentHoverHex: '#FFE44D' },
};

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentHex: string;
  accentHoverHex: string;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const readStoredTheme = (): Theme => {
  try {
    const saved = localStorage.getItem('preferred-theme');
    if (saved === 'orange' || saved === 'amber') return saved;
  } catch {
    // localStorage nicht verfuegbar (SSR, eingeschraenkter Modus) - Standard bleibt.
  }
  return 'orange';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem('preferred-theme', next);
    } catch {
      // ignorieren
    }
  };

  useEffect(() => {
    if (theme === 'amber') {
      document.documentElement.setAttribute('data-theme', 'amber');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, ...ACCENT_HEX[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
