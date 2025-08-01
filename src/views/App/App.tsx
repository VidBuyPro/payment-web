import { ThemeProvider } from '@/shared/styles/theme';
import { Router } from '@/app/routes/Router';

function App() {
  return (
    <ThemeProvider
      defaultTheme='light'
      storageKey='repormais-theme'
    >
      <Router />
    </ThemeProvider>
  );
}

export default App;
