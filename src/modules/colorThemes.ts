interface Theme {
  [key: string]: string;
}

export class ColorThemes {
  static applySavedTheme(): void {
    const theme_ = window.localStorage.getItem("winnetou-theme");
    if (theme_) {
      const theme: Theme = JSON.parse(theme_);
      const root = document.documentElement;
      Object.keys(theme).forEach((item: string) => {
        root.style.setProperty(item, theme[item]);
      });
    }
  }

  static newTheme(theme: Theme): void {
    const root = document.documentElement;
    Object.keys(theme).forEach((item: string) => {
      root.style.setProperty(item, theme[item]);
    });
    window.localStorage.setItem("winnetou-theme", JSON.stringify(theme));
  }
}
