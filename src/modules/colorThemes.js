export class ColorThemes {
  /**
   * Apply the saved theme from localStorage
   * @returns {void}
   * @description This method applies the theme stored in localStorage to the document.
   * If no theme is found, it does nothing.
   *
   */
  static applySavedTheme() {
    let theme_ = window.localStorage.getItem("winnetou-theme");
    if (theme_) {
      let theme = JSON.parse(theme_);
      let root = document.documentElement;
      Object.keys(theme).forEach(function (item) {
        root.style.setProperty(item, theme[item]);
      });
    }
  }
  /**
   * Change application css
   * @param  {object} theme New theme
   */
  static newTheme(theme) {
    let root = document.documentElement;
    Object.keys(theme).forEach(function (item) {
      root.style.setProperty(item, theme[item]);
    });
    window.localStorage.setItem("winnetou-theme", JSON.stringify(theme));
  }
}
