export type ThemeType = 'dark' | 'light' | 'system';

export type ThemeProviderPropsType = {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
  storageKey?: string;
};

export type ThemeProviderStateType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};
