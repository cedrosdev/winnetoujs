const updateTranslations = async (args) => {
  const get = (url) => {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET"
      }).then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          return reject("Translation file not found. Code error kj438dj.");
        }
      }).then(function(data) {
        return resolve(data);
      }).catch(function(error) {
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
      return;
    }
    Object.keys(data).map((key) => {
      let value = data[key];
      args.stringsClass[key] = value;
    });
    return resolve(true);
  });
};
const changeLang = (lang, reload = true) => {
  window.localStorage.setItem("lang", lang);
  reload && location.reload();
};
export {
  changeLang,
  updateTranslations
};
//# sourceMappingURL=translations.js.map
