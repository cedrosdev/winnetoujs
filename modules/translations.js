/**
 * @file translations.js
 * @description This file handles the translations for the application.
 * It fetches the translation files based on the selected language and updates the strings accordingly.
 * @author Pamela Sedrez
 * 
 * @param {object} args
 * @param {object} args.stringsClass
 * @param {object} args.translationsPublicPath
 */
export const updateTranslations = async args => {
  /**
   * Function to get json from API
   * @param {string} url API Endpoint
   */
  const get = url => {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          } else {
            return reject("Translation file not found. Code error kj438dj.");
          }
        })
        .then(function (data) {
          return resolve(data);
        })
        .catch(function (error) {
          return reject("Translation file not found. Code error kj438dssj.");
        });
    });
  };

  return new Promise(async (resolve, reject) => {
    if (!window.localStorage.getItem("lang")) return resolve(true);
    const localLang = window.localStorage.getItem("lang");
    const file = `${args.translationsPublicPath}/${localLang}.json`;
    let data;
    try {
      data = await get(file);
    } catch (e) {
      console.warn(
        `WinnetouJs translations error. Reloading... The file '${file}' was not found.`
      );
      window.localStorage.removeItem("lang");
      setTimeout(() => {
        location.reload();
      }, 200);
    }
    Object.keys(data).map(key => {
      let value = data[key];
      args.stringsClass[key] = value;
    });
    return resolve(true);
  });
};

/**
 * Changes the language of the application
 * 
 * @param {string} lang string language
 * @param {boolean} [reload] boolean reload page, default is true
 */
export const changeLang = (lang, reload = true) => {
  window.localStorage.setItem("lang", lang);
  reload && location.reload();
};
