import { ThemeProvider, useTheme } from '../ThemeProvider';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background">
      <p className="text-foreground text-lg">Текущая тема: {theme}</p>
      <Button onClick={toggleTheme} size="lg" data-testid="button-toggle-theme">
        {theme === 'light' ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
        Переключить тему
      </Button>
    </div>
  );
}

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}
