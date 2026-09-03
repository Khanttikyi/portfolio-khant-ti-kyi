import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly storageKey = 'portfolio-theme';

  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggle(): void {
    const nextTheme: Theme =
      this.theme() === 'dark' ? 'light' : 'dark';

    this.setTheme(nextTheme);
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);

    localStorage.setItem(this.storageKey, theme);

    this.applyTheme(theme);
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }

  private getInitialTheme(): Theme {

    const savedTheme = localStorage.getItem(
      this.storageKey
    ) as Theme | null;

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
      ? 'dark'
      : 'light';
  }

  private applyTheme(theme: Theme): void {

    const root = document.documentElement;

    root.classList.remove(
      'dark-theme',
      'light-theme'
    );

    root.classList.add(
      `${theme}-theme`
    );

    document.body.classList.remove(
      'dark-theme',
      'light-theme'
    );

    document.body.classList.add(
      `${theme}-theme`
    );
  }
}
