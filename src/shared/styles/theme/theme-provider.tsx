import { createContext, useEffect, useState } from 'react';
import type {
  ThemeProviderPropsType,
  ThemeProviderStateType,
  ThemeType
} from './theme-provider.types';

const initialState: ThemeProviderStateType = {
  theme: 'system',
  setTheme: () => null
};

export const ThemeProviderContext =
  createContext<ThemeProviderStateType>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderPropsType) {
  const [theme, setTheme] = useState<ThemeType>(
    () => (localStorage.getItem(storageKey) as ThemeType) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: ThemeType) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    }
  };

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={value}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}
