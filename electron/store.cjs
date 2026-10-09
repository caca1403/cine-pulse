// CinePulse Desktop kalici magazasi (Nuvio tarzi ozellestirme + Cloudstream tarzi
// eklenti ac/kapa durumlari burada durur; renderer localStorage'indan bagimsiz,
// kullanici profiline baglidir ve EXE guncellemelerinde silinmez).
const fs = require('fs');
const path = require('path');

function createStore(userDataDir) {
  const file = path.join(userDataDir, 'cinepulse-store.json');
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8') || '{}');
    if (!data || typeof data !== 'object') data = {};
  } catch (_) {
    data = {};
  }
  const save = () => {
    try {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(data), 'utf8');
    } catch (_) {}
  };
  return {
    get(key, fallback = null) {
      const v = data[key];
      return v === undefined ? fallback : v;
    },
    set(key, value) {
      data[key] = value;
      save();
    },
    all() {
      return { ...data };
    }
  };
}

module.exports = { createStore };
