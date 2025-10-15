class ColorThemes {
  static applySavedTheme() {
    const theme_ = window.localStorage.getItem("winnetou-theme");
    if (theme_) {
      const theme = JSON.parse(theme_);
      const root = document.documentElement;
      Object.keys(theme).forEach((item) => {
        root.style.setProperty(item, theme[item]);
      });
    }
  }
  static newTheme(theme) {
    const root = document.documentElement;
    Object.keys(theme).forEach((item) => {
      root.style.setProperty(item, theme[item]);
    });
    window.localStorage.setItem("winnetou-theme", JSON.stringify(theme));
  }
}
export {
  ColorThemes
};
//# sourceMappingURL=colorThemes.js.map
