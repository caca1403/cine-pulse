/* ==========================================================
 * ÇEKİRDEK — çözülmüş sağlayıcı (dokunulmadı)
 * Arayüz adı: ../kayit.js içindeki kahraman kodu
 * Yayın alan adı: ../alanlar.js sabit haritasından gelir.
 * ========================================================== */
/* ============================================================
 * shamrock.js
 * çözülen string: 2128, üye erişimi: 954, silinen bootstrap: 50
 * ============================================================ */
var module =
    typeof module !== "undefined"
      ? module
      : {
          exports: {}
        },
  exports = typeof exports !== "undefined" ? exports : module.exports,
  _g =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof global !== "undefined"
        ? global
        : typeof window !== "undefined"
          ? window
          : this;
typeof String.prototype.normalize !== "function" &&
  (String.prototype.normalize = function () {
    var str = String(this),
      obj = {
        ç: "c",
        Ç: "C",
        ğ: "g",
        Ğ: "G",
        ı: "i",
        İ: "I",
        ö: "o",
        Ö: "O",
        ş: "s",
        Ş: "S",
        ü: "u",
        Ü: "U",
        á: "a",
        à: "a",
        â: "a",
        ä: "a",
        ã: "a",
        å: "a",
        é: "e",
        è: "e",
        ê: "e",
        ë: "e",
        í: "i",
        ì: "i",
        î: "i",
        ï: "i",
        ó: "o",
        ò: "o",
        ô: "o",
        ö: "o",
        õ: "o",
        ú: "u",
        ù: "u",
        û: "u",
        ü: "u",
        ñ: "n",
        Ñ: "N",
        ß: "ss"
      };
    return str.replace(/[çÇğĞıİöÖşŞüÜáàâäãåéèêëíìîïóòôöõúùûüñÑß]/g, function (arg1) {
      return obj[arg1] || arg1;
    });
  });
if (
  typeof TextDecoder === "undefined" &&
  (typeof _g === "undefined" || typeof _g.TextDecoder === "undefined")
) {
  var CustomTextDecoder = function (arg1) {
    this.encoding = arg1 || "utf-8";
  };
  CustomTextDecoder.prototype.decode = function (arg1) {
    if (!arg1) return "";
    var str = "",
      num = 0,
      length = arg1.length;
    while (num < length) {
      var value = arg1[num++];
      if (value < 128) str += String.fromCharCode(value);
      else {
        if (value > 191 && value < 224) {
          var value2 = arg1[num++];
          str += String.fromCharCode(((value & 31) << 6) | (value2 & 63));
        } else {
          if (value > 223 && value < 240) {
            var value2 = arg1[num++],
              value3 = arg1[num++];
            str += String.fromCharCode(((value & 15) << 12) | ((value2 & 63) << 6) | (value3 & 63));
          } else {
            if (value > 239 && value < 248) {
              var value2 = arg1[num++],
                value3 = arg1[num++],
                value4 = arg1[num++],
                val =
                  (((value & 7) << 18) |
                    ((value2 & 63) << 12) |
                    ((value3 & 63) << 6) |
                    (value4 & 63)) -
                  65536;
              str += String.fromCharCode(55296 + (val >> 10), 56320 + (val & 1023));
            }
          }
        }
      }
    }
    return str;
  };
  if (typeof _g !== "undefined") _g.TextDecoder = CustomTextDecoder;
  if (typeof globalThis !== "undefined") globalThis.TextDecoder = CustomTextDecoder;
  if (typeof global !== "undefined") global.TextDecoder = CustomTextDecoder;
}
if (typeof URL === "undefined" || (typeof _g !== "undefined" && typeof _g.URL === "undefined")) {
  var CustomURL = function (arg1, url) {
    var str = String(arg1 || "");
    if (url && str.indexOf("http://") !== 0 && str.indexOf("https://") !== 0) {
      var str2 = String(url);
      while (str2.length > 0 && str2.charAt(str2.length - 1) === "/") {
        str2 = str2.substring(0, str2.length - 1);
      }
      while (str.length > 0 && str.charAt(0) === "/") {
        str = str.substring(1);
      }
      str = str2 + "/" + str;
    }
    this.href = str;
    var value = str.indexOf("#");
    this.hash = value !== -1 ? str.substring(value) : "";
    var val = value !== -1 ? str.substring(0, value) : str,
      value2 = val.indexOf("?");
    this.search = value2 !== -1 ? val.substring(value2) : "";
    var val2 = value2 !== -1 ? val.substring(0, value2) : val,
      value3 = val2.indexOf("://");
    if (value3 !== -1) {
      var value4 = val2.indexOf("/", value3 + 3);
      value4 !== -1
        ? ((this.origin = val2.substring(0, value4)), (this.pathname = val2.substring(value4)))
        : ((this.origin = val2), (this.pathname = "/"));
    } else ((this.origin = ""), (this.pathname = val2));
  };
  CustomURL.prototype.toString = function () {
    return this.href;
  };
  if (typeof _g !== "undefined") _g.URL = CustomURL;
  if (typeof globalThis !== "undefined") globalThis.URL = CustomURL;
  if (typeof global !== "undefined") global.URL = CustomURL;
  if (typeof window !== "undefined") window.URL = CustomURL;
}
if (typeof _g.setTimeout === "undefined") {
  var _timerId = 1,
    _timers = {},
    _safeTimeout = function (arg1, arg2) {
      var value = _timerId++;
      if (typeof arg1 !== "function") return value;
      _timers[value] = !![];
      var fn5 = function () {
        if (_timers[value]) {
          delete _timers[value];
          try {
            arg1();
          } catch (err) {}
        }
      };
      if (typeof queueMicrotask === "function") queueMicrotask(fn5);
      else typeof Promise !== "undefined" ? Promise.resolve().then(fn5) : fn5();
      return value;
    },
    _safeClearTimeout = function (arg1) {
      delete _timers[arg1];
    };
  (typeof _g !== "undefined" &&
    ((_g.setTimeout = _safeTimeout), (_g.clearTimeout = _safeClearTimeout)),
    typeof globalThis !== "undefined" &&
      ((globalThis.setTimeout = _safeTimeout), (globalThis.clearTimeout = _safeClearTimeout)),
    typeof global !== "undefined" &&
      ((global.setTimeout = _safeTimeout), (global.clearTimeout = _safeClearTimeout)));
}
if (typeof AbortController === "undefined") {
  var CustomAbortController = function () {
    this.signal = {
      aborted: ![],
      _listeners: [],
      addEventListener: function (arg1, arg2) {
        if (arg1 === "abort") this._listeners.push(arg2);
      },
      removeEventListener: function (arg1, arg2) {
        arg1 === "abort" &&
          (this._listeners = this._listeners.filter(function (arg12) {
            return arg12 !== arg2;
          }));
      }
    };
    var value = this;
    this.abort = function () {
      if (value.signal.aborted) return;
      value.signal.aborted = !![];
      var value2 = value.signal._listeners.slice();
      for (var num = 0; num < value2.length; num++) {
        try {
          value2[num]();
        } catch (err) {}
      }
    };
  };
  if (typeof _g !== "undefined") _g.AbortController = CustomAbortController;
  if (typeof globalThis !== "undefined") globalThis.AbortController = CustomAbortController;
  if (typeof global !== "undefined") global.AbortController = CustomAbortController;
  if (typeof window !== "undefined") window.AbortController = CustomAbortController;
}
if (typeof AbortSignal === "undefined") {
  var CustomAbortSignal = function () {};
  CustomAbortSignal.timeout = function (season) {
    if (typeof AbortController !== "undefined") {
      var controller = new AbortController();
      return (
        setTimeout(function () {
          try {
            controller.abort();
          } catch (err) {}
        }, season || 0),
        controller.signal
      );
    }
    return undefined;
  };
  if (typeof _g !== "undefined") _g.AbortSignal = CustomAbortSignal;
  if (typeof globalThis !== "undefined") globalThis.AbortSignal = CustomAbortSignal;
  if (typeof global !== "undefined") global.AbortSignal = CustomAbortSignal;
  if (typeof window !== "undefined") window.AbortSignal = CustomAbortSignal;
} else
  typeof AbortSignal.timeout !== "function" &&
    (AbortSignal.timeout = function (season) {
      if (typeof AbortController !== "undefined") {
        var controller = new AbortController();
        return (
          setTimeout(function () {
            try {
              controller.abort();
            } catch (err) {}
          }, season || 0),
          controller.signal
        );
      }
      return undefined;
    });
if (typeof atob === "undefined" && (typeof _g === "undefined" || typeof _g.atob === "undefined")) {
  var _b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    _customAtob = function (input) {
      var replaced = String(input).replace(/=+$/, ""),
        str = "";
      for (
        var num = 0, num2 = 0, value, num3 = 0;
        (value = replaced.charAt(num3++));
        ~value && ((num2 = num % 4 ? num2 * 64 + value : value), num++ % 4)
          ? (str += String.fromCharCode(255 & (num2 >> ((-2 * num) & 6))))
          : 0
      ) {
        value = _b64.indexOf(value);
      }
      return str;
    };
  if (typeof _g !== "undefined") _g.atob = _customAtob;
  if (typeof globalThis !== "undefined") globalThis.atob = _customAtob;
  if (typeof global !== "undefined") global.atob = _customAtob;
}
if (typeof btoa === "undefined" && (typeof _g === "undefined" || typeof _g.btoa === "undefined")) {
  var _b64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    _customBtoa = function (arg1) {
      var str = String(arg1),
        str2 = "";
      for (
        var num = 0, value, num2 = 0, value2 = _b64Chars;
        str.charAt(num2 | 0) || ((value2 = "="), num2 % 1);
        str2 += value2.charAt(63 & (num >> (8 - (num2 % 1) * 8)))
      ) {
        value = str.charCodeAt((num2 += 3 / 4));
        if (value > 255) return "";
        num = (num << 8) | value;
      }
      return str2;
    };
  if (typeof _g !== "undefined") _g.btoa = _customBtoa;
  if (typeof globalThis !== "undefined") globalThis.btoa = _customBtoa;
  if (typeof global !== "undefined") global.btoa = _customBtoa;
}
typeof String.prototype.matchAll !== "function" &&
  (String.prototype.matchAll = function (arg1) {
    var str = String(this),
      val =
        arg1 && arg1.flags !== undefined
          ? arg1.flags
          : (arg1.global ? "g" : "") + (arg1.ignoreCase ? "i" : "") + (arg1.multiline ? "m" : "");
    if (!val.includes("g")) val += "g";
    var pattern = new RegExp(arg1.source, val),
      list = [],
      value;
    while ((value = pattern.exec(str)) !== null) {
      list.push(value);
    }
    return list[Symbol.iterator] ? list[Symbol.iterator]() : list;
  });
("use strict");
var defineProp = Object.defineProperty,
  value = Object.getOwnPropertyDescriptor,
  value2 = Object.getOwnPropertyNames,
  _e = Object.prototype.hasOwnProperty,
  fn5 = (arg1, arg2) => {
    for (var value3 in arg2)
      defineProp(arg1, value3, {
        get: arg2[value3],
        enumerable: !0
      });
  },
  fn6 = (arg1, arg2, arg3, arg4) => {
    if ((arg2 && typeof arg2 == "object") || typeof arg2 == "function") {
      for (let value3 of value2(arg2))
        !_e.call(arg1, value3) &&
          value3 !== arg3 &&
          defineProp(arg1, value3, {
            get: () => arg2[value3],
            enumerable: !(arg4 = value(arg2, value3)) || arg4.enumerable
          });
    }
    return arg1;
  },
  fn7 = (arg1) =>
    fn6(
      defineProp({}, "__esModule", {
        value: !0
      }),
      arg1
    ),
  obj = {};
(fn5(obj, {
  getStreams: () => getStreams
}),
  (module.exports = fn7(obj)));
function log(provider, message, level = "info", details) {
  let val = "[" + provider + "]";
  level === "error"
    ? console.error(val, message, details || "")
    : level === "warn"
      ? console.warn(val, message, details || "")
      : console.log(val, message, details || "");
  try {
    let value3 = (typeof globalThis < "u" ? globalThis : typeof global < "u" ? global : {})
      .__NUVIO_DEV_LOG_URL__;
    typeof value3 == "string" &&
      value3.startsWith("http") &&
      fetch(value3, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          provider: provider,
          level: level,
          message: message,
          details: details
        })
      }).catch(() => {});
  } catch {}
}
function xorDecode(arg1, xorKey = 42) {
  let str = "";
  for (let num = 0; num < arg1.length; num++) str += String.fromCharCode(arg1[num] ^ xorKey);
  return str;
}
var obj2 = {
    REMOTE_CONFIG_URL: xorDecode([
      66, 94, 94, 90, 89, 16, 5, 5, 73, 78, 68, 4, 67, 80, 70, 79, 70, 75, 68, 4, 73, 69, 71, 5, 78,
      69, 71, 75, 67, 68, 89, 4, 64, 89, 69, 68
    ]),
    FALLBACK_CONFIG_URL: xorDecode([
      66, 94, 94, 90, 89, 16, 5, 5, 78, 69, 71, 75, 67, 68, 4, 67, 80, 70, 79, 70, 75, 68, 4, 73,
      69, 71, 5, 78, 69, 71, 75, 67, 68, 89
    ]),
    DEFAULT_USER_AGENT:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  },
  val =
    typeof globalThis < "u"
      ? globalThis
      : typeof global < "u"
        ? global
        : typeof window < "u"
          ? window
          : {},
  val2 = 5 * 60 * 1000,
  val3 = 15 * 1000;
if (!val.__NUVIO_CONFIG_STATE__) {
  let cachedDomains = {},
    cachedCookies = {},
    cachedTmdbKeys = [],
    lastFetchTime = 0;
  try {
    if (typeof localStorage < "u" && localStorage) {
      let value3 = localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");
      if (value3) {
        let parsed = JSON.parse(value3);
        parsed &&
          typeof parsed.domains == "object" &&
          ((cachedDomains = parsed.domains),
          (cachedCookies = parsed.cookies || {}),
          (cachedTmdbKeys = parsed.tmdbKeys || []),
          (lastFetchTime = typeof parsed.time == "number" ? parsed.time : 0));
      }
    }
  } catch {}
  val.__NUVIO_CONFIG_STATE__ = {
    cachedDomains: cachedDomains,
    cachedCookies: cachedCookies,
    cachedTmdbKeys: cachedTmdbKeys,
    lastFetchTime: lastFetchTime,
    activeFetchPromise: null
  };
}
var value3 = val.__NUVIO_CONFIG_STATE__;
async function log2(arg1 = !1) {
  let time = Date.now(),
    list = [];
  (list.push(obj2.REMOTE_CONFIG_URL), list.push(obj2.FALLBACK_CONFIG_URL));
  try {
    let value4 = val.__NUVIO_DEV_LOG_URL__;
    typeof value4 == "string" &&
      value4.includes("/api/log") &&
      list.push(value4.replace("/api/log", "/domains"));
  } catch {}
  let signal =
    typeof AbortSignal < "u" && typeof AbortSignal.timeout == "function"
      ? AbortSignal.timeout(4000)
      : void 0;
  for (let value4 of list)
    try {
      let response = await fetch(value4, {
        signal: signal
      });
      if (response.ok) {
        let data = await response.json(),
          val4 = data?.data ?? data,
          val5 = val4.domains || val4,
          value5 = val4.cookies,
          val6 = val4.tmdb_keys || val4.tmdbKeys;
        (val5 &&
          typeof val5 == "object" &&
          (value3.cachedDomains = {
            ...val5
          }),
          value5 &&
            typeof value5 == "object" &&
            (value3.cachedCookies = {
              ...value3.cachedCookies,
              ...value5
            }),
          Array.isArray(val6) && val6.length > 0 && (value3.cachedTmdbKeys = val6),
          (value3.lastFetchTime = time),
          (value3.lastFetchSource = value4),
          log("Config", "Domainler basariyla cekildi: " + value4, "info"));
        try {
          typeof localStorage < "u" &&
            localStorage &&
            localStorage.setItem(
              "__NUVIO_DOMAINS_CACHE_V3__",
              JSON.stringify({
                domains: value3.cachedDomains,
                cookies: value3.cachedCookies,
                tmdbKeys: value3.cachedTmdbKeys,
                time: time
              })
            );
        } catch {}
        return;
      }
    } catch (err) {
      log("Config", "Domain alinamadi (" + value4 + "): " + err.message, "warn");
    }
  value3.lastFetchTime = time - val2 + val3;
}
async function now(arg1 = !1) {
  let now2 = Date.now(),
    val4 = Object.keys(value3.cachedDomains).length > 0;
  (arg1 || !val4 || now2 - value3.lastFetchTime > val2) &&
    (value3.activeFetchPromise ||
      (value3.activeFetchPromise = log2(arg1).finally(() => {
        value3.activeFetchPromise = null;
      })),
    await value3.activeFetchPromise);
}
async function fn(arg1) {
  return (await now(), value3.cachedDomains[arg1] || "");
}
async function fn2() {
  return (await now(), value3.cachedTmdbKeys || []);
}
var text = "a2f888b27315e62e471b2d587048f32e",
  list = [
    text,
    "68e094699525b18a70bab2f86b1fa706",
    "246ec6ffbbd6c05d76ad714241e3dcd1",
    "1865f43a0549ca50d341dd9ab8b29f49"
  ];
async function fetchJson(url) {
  let result = await fn2(),
    val4 = result.length > 0 ? [...result, ...list] : list;
  for (let num = 0; num < val4.length; num++) {
    let value4 = val4[num],
      val5 = url.includes("?") ? "&" : "?",
      val6 = "https://api.themoviedb.org/3/" + url + val5 + "api_key=" + value4;
    try {
      let signal =
          typeof AbortSignal < "u" && AbortSignal.timeout ? AbortSignal.timeout(4000) : void 0,
        response = await fetch(val6, {
          signal: signal
        });
      if (response.ok) return await response.json();
      if (response.status === 429) continue;
    } catch {}
  }
  return null;
}
var val4 =
  typeof globalThis < "u"
    ? globalThis
    : typeof global < "u"
      ? global
      : typeof window < "u"
        ? window
        : {};
val4.__NUVIO_TMDB_UNIFIED_CACHE__ || (val4.__NUVIO_TMDB_UNIFIED_CACHE__ = new Map());
var value4 = val4.__NUVIO_TMDB_UNIFIED_CACHE__;
function splitOf(arg1, input) {
  if (!input || typeof input != "string") return;
  let trimmed = input.trim();
  if (trimmed && (arg1.push(trimmed), trimmed.includes(":"))) {
    let parts = trimmed.split(":")[0].trim();
    parts.length > 2 && arg1.push(parts);
  }
}
function splitOf2(tmdbId, type) {
  let replaced = String(tmdbId || "")
      .replace(/^tmdb:/i, "")
      .trim(),
    isTvOrSeries = type === "tv" || type === "series",
    val5 = isTvOrSeries ? "tv" : "movie";
  if (!replaced)
    return Promise.resolve({
      imdbId: null,
      titles: [],
      cast: [],
      creators: [],
      genres: [],
      posterPath: null,
      backdropPath: null,
      allPosters: [],
      allPostersOriginal: []
    });
  let val6 = val5 + ":" + replaced;
  if (value4.has(val6)) return value4.get(val6);
  let num = (async () => {
    let list2 = [],
      imdbId = replaced.startsWith("tt") ? replaced : null,
      numericId,
      year,
      cast = [],
      creators = [],
      overview,
      genres = [],
      posterPath = null,
      backdropPath = null,
      list3 = [],
      list4 = [];
    try {
      if (replaced.startsWith("tt")) {
        let result = await fetchJson("find/" + replaced + "?external_source=imdb_id"),
          val7 = isTvOrSeries ? result?.tv_results?.[0] : result?.movie_results?.[0];
        if (val7) {
          ((numericId = val7.id),
            val7.overview && (overview = val7.overview),
            val7.poster_path && (posterPath = String(val7.poster_path).replace(/^\//, "")),
            val7.backdrop_path && (backdropPath = String(val7.backdrop_path).replace(/^\//, "")));
          let val8 = val7.release_date || val7.first_air_date;
          (val8 && (year = parseInt(String(val8).split("-")[0], 10)),
            splitOf(list2, val7.title),
            splitOf(list2, val7.name),
            splitOf(list2, val7.original_title),
            splitOf(list2, val7.original_name));
        }
      } else numericId = parseInt(replaced, 10);
      if (numericId && !isNaN(numericId)) {
        let result = await fetchJson(
          val5 +
            "/" +
            numericId +
            "?language=tr-TR&append_to_response=external_ids,credits,alternative_titles,translations,images&include_image_language=en,tr,ja,null"
        );
        if (result) {
          if (
            (result.external_ids?.imdb_id
              ? (imdbId = result.external_ids.imdb_id)
              : result.imdb_id && (imdbId = result.imdb_id),
            result.overview && (overview = result.overview),
            result.poster_path && (posterPath = String(result.poster_path).replace(/^\//, "")),
            result.backdrop_path &&
              (backdropPath = String(result.backdrop_path).replace(/^\//, "")),
            splitOf(list2, result.title),
            splitOf(list2, result.name),
            result.original_title &&
              result.original_title !== result.title &&
              splitOf(list2, result.original_title),
            result.original_name &&
              result.original_name !== result.name &&
              splitOf(list2, result.original_name),
            Array.isArray(result.translations?.translations))
          ) {
            let value5 = [...result.translations.translations].sort((arg1, arg2) => {
              let fn8 = (arg12) =>
                arg12?.iso_639_1 === "tr" ? 0 : arg12?.iso_639_1 === "en" ? 1 : 2;
              return fn8(arg1) - fn8(arg2);
            });
            for (let value6 of value5) splitOf(list2, value6.data?.name || value6.data?.title);
          }
          let value5 = (
            result.alternative_titles?.results ||
            result.alternative_titles?.titles ||
            []
          )
            .map((arg1) => arg1.title)
            .filter(Boolean);
          for (let value6 of value5) splitOf(list2, value6);
          let val7 = result.release_date || result.first_air_date;
          if (
            (val7 && (year = parseInt(String(val7).split("-")[0], 10)),
            Array.isArray(result.genres) &&
              (genres = result.genres.map((arg1) => arg1.name).filter(Boolean)),
            Array.isArray(result.credits?.cast))
          ) {
            let set = new Set();
            (result.credits.cast.slice(0, 15).forEach((arg1) => {
              (arg1.name && set.add(arg1.name), arg1.original_name && set.add(arg1.original_name));
            }),
              (cast = Array.from(set)));
          }
          let list5 = [];
          if (
            (Array.isArray(result.created_by) &&
              list5.push(...result.created_by.map((arg1) => arg1.name).filter(Boolean)),
            Array.isArray(result.credits?.crew) &&
              list5.push(
                ...result.credits.crew
                  .filter((arg1) => arg1.job === "Director" || arg1.department === "Directing")
                  .map((arg1) => arg1.name)
                  .filter(Boolean)
              ),
            (creators = Array.from(new Set(list5))),
            Array.isArray(result.images?.posters))
          ) {
            for (let value6 of result.images.posters)
              if (value6.file_path) {
                let replaced2 = String(value6.file_path).replace(/^\//, "");
                (list3.push(replaced2.toLowerCase()), list4.push(replaced2));
              }
          }
          if (Array.isArray(result.images?.backdrops)) {
            for (let value6 of result.images.backdrops)
              if (value6.file_path) {
                let replaced2 = String(value6.file_path).replace(/^\//, "");
                (list3.push(replaced2.toLowerCase()), list4.push(replaced2));
              }
          }
        }
      }
      if (!imdbId && numericId && !isNaN(numericId)) {
        let result = await fetchJson(val5 + "/" + numericId + "/external_ids");
        result?.imdb_id && (imdbId = result.imdb_id);
      }
    } catch {}
    return (
      posterPath && (list3.push(posterPath.toLowerCase()), list4.push(posterPath)),
      backdropPath && (list3.push(backdropPath.toLowerCase()), list4.push(backdropPath)),
      {
        imdbId: imdbId,
        numericId: numericId,
        titles: Array.from(new Set(list2.filter(Boolean))),
        year: year,
        cast: cast,
        creators: creators,
        overview: overview,
        genres: genres,
        posterPath: posterPath,
        backdropPath: backdropPath,
        allPosters: Array.from(new Set(list3)),
        allPostersOriginal: Array.from(new Set(list4))
      }
    );
  })();
  return (value4.set(val6, num), num);
}
async function fn3(arg1, arg2) {
  let result = await splitOf2(arg1, arg2);
  return {
    numericId: result.numericId,
    titles: result.titles,
    year: result.year,
    cast: result.cast,
    creators: result.creators,
    overview: result.overview,
    genres: result.genres
  };
}
async function fn4(arg1, arg2) {
  let result = await splitOf2(arg1, arg2);
  return {
    numericId: result.numericId,
    titles: result.titles,
    posterPath: result.posterPath,
    backdropPath: result.backdropPath,
    year: result.year,
    allPosters: result.allPosters,
    allPostersOriginal: result.allPostersOriginal
  };
}
async function defineProp2(arg1) {
  let {
    providerName: providerName,
    season: resolvedSeason,
    episode: resolvedEpisode,
    fetcher: fetcher,
    isValid: isValid
  } = arg1;
  try {
    let data = await fetcher(resolvedSeason, resolvedEpisode);
    if (isValid(data))
      return {
        data: data,
        resolvedSeason: resolvedSeason,
        resolvedEpisode: resolvedEpisode,
        strategy: "direct"
      };
  } catch (err) {
    log(
      providerName,
      "Doğrudan bölüm sorgusu hatası (S" +
        resolvedSeason +
        "E" +
        resolvedEpisode +
        "): " +
        (err?.message || err),
      "warn"
    );
  }
  return {
    data: null,
    resolvedSeason: resolvedSeason,
    resolvedEpisode: resolvedEpisode,
    strategy: "none"
  };
}
var names = [
    "türkçe",
    "turkish",
    "turkce",
    "dublaj",
    "trdual",
    "trdub",
    "ses-tr",
    "audio-tr",
    "tr-dub"
  ],
  names2 = ["tr", "tur", "ota"],
  names3 = ["english", "ingilizce", "original", "orijinal", "audio-en"],
  names4 = ["en", "eng", "und"];
function buildUrl(url, url2) {
  let hasTurkishAudio = !1,
    hasOriginalAudio = !1,
    embeddedSubtitles = [],
    detectedQuality,
    detectedCodec,
    detectedAudio,
    value5 = (url2 || "").toLowerCase();
  if (
    (value5.includes("trdual") ||
    value5.includes("dual") ||
    value5.includes("trdub") ||
    value5.includes("dublaj")
      ? ((hasTurkishAudio = !0), (hasOriginalAudio = !0))
      : (value5.includes("ses-tr") ||
          value5.includes("turkcedublaj") ||
          value5.includes("turkce-dublaj")) &&
        (hasTurkishAudio = !0),
    value5.includes("2160p") ||
    value5.includes("4k") ||
    value5.includes("uhd") ||
    value5.includes("-2160.")
      ? (detectedQuality = "4K")
      : value5.includes("1080p") ||
          value5.includes("1920x1080") ||
          value5.includes("fhd") ||
          value5.includes("-1080.")
        ? (detectedQuality = "1080p")
        : value5.includes("720p") ||
            value5.includes("1280x720") ||
            value5.includes("hd") ||
            value5.includes("-720.")
          ? (detectedQuality = "720p")
          : value5.includes("480p") ||
              value5.includes("854x480") ||
              value5.includes("sd") ||
              value5.includes("-480.")
            ? (detectedQuality = "480p")
            : (value5.includes("360p") || value5.includes("640x360") || value5.includes("-360.")) &&
              (detectedQuality = "360p"),
    value5.includes("hevc") || value5.includes("h265") || value5.includes("x265")
      ? (detectedCodec = "HEVC")
      : value5.includes("av1")
        ? (detectedCodec = "AV1")
        : (value5.includes("h264") || value5.includes("x264") || value5.includes("avc")) &&
          (detectedCodec = "H.264"),
    value5.includes("5.1") ||
    value5.includes("eac3") ||
    value5.includes("ac3") ||
    value5.includes("ddp")
      ? (detectedAudio = "Dolby 5.1")
      : (value5.includes("7.1") || value5.includes("atmos")) && (detectedAudio = "Dolby Atmos 7.1"),
    url && typeof url == "string")
  ) {
    let parts = url.split(/\r?\n/),
      num = 0;
    for (let value6 of parts) {
      let trimmed = value6.trim();
      if (trimmed.startsWith("#EXT-X-MEDIA:") && trimmed.includes("TYPE=AUDIO")) {
        let match = trimmed.match(/NAME=["']([^"']+)["']/i),
          match2 = trimmed.match(/LANGUAGE=["']([^"']+)["']/i),
          match3 = trimmed.match(/GROUP-ID=["']([^"']+)["']/i),
          value7 = (match ? match[1] : "").toLowerCase(),
          value8 = (match2 ? match2[1] : "").toLowerCase(),
          value9 = (match3 ? match3[1] : "").toLowerCase(),
          parts2 = value7.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),
          parts3 = value9.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),
          val5 =
            names2.includes(value8) ||
            names2.some((arg1) => parts2.includes(arg1) || parts3.includes(arg1)) ||
            names.some((arg1) => value7.includes(arg1) || value9.includes(arg1)) ||
            value7.includes("türk") ||
            value7.includes("turk") ||
            value9.includes("dual"),
          val6 =
            names4.includes(value8) ||
            names4.some((arg1) => parts2.includes(arg1) || parts3.includes(arg1)) ||
            names3.some((arg1) => value7.includes(arg1) || value9.includes(arg1)) ||
            value7.includes("orig") ||
            value7.includes("ing") ||
            value7.includes("eng");
        (val5 && (hasTurkishAudio = !0), val6 && (hasOriginalAudio = !0));
      }
      if (trimmed.startsWith("#EXT-X-MEDIA:") && trimmed.includes("TYPE=SUBTITLES")) {
        let match = trimmed.match(/URI=["']([^"']+)["']/i),
          match2 = trimmed.match(/NAME=["']([^"']+)["']/i),
          match3 = trimmed.match(/LANGUAGE=["']([^"']+)["']/i);
        if (match && match[1]) {
          let url = match[1];
          if (url2 && !url.startsWith("http"))
            try {
              url = new URL(url, url2).toString();
            } catch {}
          let val5 = match2 ? match2[1] : "Altyazı",
            val6 = match3 ? match3[1].toLowerCase() : "";
          val6 === "st" ||
          val6 === "sot" ||
          val5.toLowerCase().includes("sotho") ||
          val5.toLowerCase().includes("sesotho") ||
          url.toLowerCase().includes("sub_st")
            ? ((val6 = "tr"), (val5 = "Türkçe"))
            : val6 || (val6 = val5.toLowerCase().includes("türk") ? "tr" : "und");
          let value7 = splitOf3(val6, val5);
          embeddedSubtitles.push({
            label: value7.name || val5,
            url: url,
            lang: value7.code || val6
          });
        }
      }
      if (trimmed.startsWith("#EXT-X-STREAM-INF:")) {
        let match = trimmed.match(/RESOLUTION=(\d+)x(\d+)/i);
        if (match) {
          let num2 = parseInt(match[1], 10),
            num3 = parseInt(match[2], 10),
            value7 = Math.min(num2, num3),
            value8 = Math.max(num2, num3),
            val5 =
              value7 >= 2100 || value8 >= 3800
                ? 2160
                : value7 >= 1400 || value8 >= 2500
                  ? 1440
                  : value7 >= 1000 || value8 >= 1900
                    ? 1080
                    : value7 >= 700 || value8 >= 1200
                      ? 720
                      : value7 >= 450
                        ? 480
                        : value7;
          val5 > num && (num = val5);
        } else {
          let match2 = trimmed.match(/NAME=["']?([^"',\s]+)["']?/i);
          if (match2) {
            let value7 = match2[1].toLowerCase();
            value7.includes("2160") || value7.includes("4k")
              ? 2160 > num && (num = 2160)
              : value7.includes("1440") || value7.includes("2k")
                ? 1440 > num && (num = 1440)
                : value7.includes("1080")
                  ? 1080 > num && (num = 1080)
                  : value7.includes("720") && 720 > num && (num = 720);
          }
        }
      }
    }
    num >= 2160
      ? (detectedQuality = "4K")
      : num >= 1440
        ? (detectedQuality = "2K")
        : num >= 1080
          ? (detectedQuality = "1080p")
          : num >= 720
            ? (detectedQuality = "720p")
            : num >= 480 && (detectedQuality = "480p");
  }
  let isDual =
    (hasTurkishAudio && hasOriginalAudio) || value5.includes("dual") || value5.includes("trdual");
  return {
    hasTurkishAudio: hasTurkishAudio,
    hasOriginalAudio: hasOriginalAudio,
    isDual: isDual,
    embeddedSubtitles: embeddedSubtitles,
    detectedQuality: detectedQuality,
    detectedCodec: detectedCodec,
    detectedAudio: detectedAudio
  };
}
var clientProfile = {
  tr: {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  tur: {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  turkish: {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  turkce: {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  st: {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  sot: {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  sotho: {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  sesotho: {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  guneysotho: {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  "guney\x20sotho": {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  southernsotho: {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  "southern\x20sotho": {
    code: "tr",
    iso3: "tur",
    language: "Turkish",
    name: "Türkçe"
  },
  en: {
    code: "en",
    iso3: "eng",
    language: "English",
    name: "İngilizce"
  },
  eng: {
    code: "en",
    iso3: "eng",
    language: "English",
    name: "İngilizce"
  },
  english: {
    code: "en",
    iso3: "eng",
    language: "English",
    name: "İngilizce"
  },
  ingilizce: {
    code: "en",
    iso3: "eng",
    language: "English",
    name: "İngilizce"
  },
  de: {
    code: "de",
    iso3: "deu",
    language: "German",
    name: "Almanca"
  },
  ger: {
    code: "de",
    iso3: "deu",
    language: "German",
    name: "Almanca"
  },
  deu: {
    code: "de",
    iso3: "deu",
    language: "German",
    name: "Almanca"
  },
  german: {
    code: "de",
    iso3: "deu",
    language: "German",
    name: "Almanca"
  },
  almanca: {
    code: "de",
    iso3: "deu",
    language: "German",
    name: "Almanca"
  },
  fr: {
    code: "fr",
    iso3: "fra",
    language: "French",
    name: "Fransızca"
  },
  fra: {
    code: "fr",
    iso3: "fra",
    language: "French",
    name: "Fransızca"
  },
  fre: {
    code: "fr",
    iso3: "fra",
    language: "French",
    name: "Fransızca"
  },
  french: {
    code: "fr",
    iso3: "fra",
    language: "French",
    name: "Fransızca"
  },
  fransizca: {
    code: "fr",
    iso3: "fra",
    language: "French",
    name: "Fransızca"
  },
  es: {
    code: "es",
    iso3: "spa",
    language: "Spanish",
    name: "İspanyolca"
  },
  spa: {
    code: "es",
    iso3: "spa",
    language: "Spanish",
    name: "İspanyolca"
  },
  spanish: {
    code: "es",
    iso3: "spa",
    language: "Spanish",
    name: "İspanyolca"
  },
  ispanyolca: {
    code: "es",
    iso3: "spa",
    language: "Spanish",
    name: "İspanyolca"
  },
  pt: {
    code: "pt",
    iso3: "por",
    language: "Portuguese",
    name: "Portekizce"
  },
  por: {
    code: "pt",
    iso3: "por",
    language: "Portuguese",
    name: "Portekizce"
  },
  portuguese: {
    code: "pt",
    iso3: "por",
    language: "Portuguese",
    name: "Portekizce"
  },
  portekizce: {
    code: "pt",
    iso3: "por",
    language: "Portuguese",
    name: "Portekizce"
  },
  "pt-br": {
    code: "pt-BR",
    iso3: "por",
    language: "Portuguese (BR)",
    name: "Portekizce (Brezilya)"
  },
  "por-br": {
    code: "pt-BR",
    iso3: "por",
    language: "Portuguese (BR)",
    name: "Portekizce (Brezilya)"
  },
  "portekizce\x20brezilya": {
    code: "pt-BR",
    iso3: "por",
    language: "Portuguese (BR)",
    name: "Portekizce (Brezilya)"
  },
  "pt-pt": {
    code: "pt-PT",
    iso3: "por",
    language: "Portuguese (EU)",
    name: "Portekizce (Avrupa)"
  },
  "por-eu": {
    code: "pt-PT",
    iso3: "por",
    language: "Portuguese (EU)",
    name: "Portekizce (Avrupa)"
  },
  "portekizce\x20avrupa": {
    code: "pt-PT",
    iso3: "por",
    language: "Portuguese (EU)",
    name: "Portekizce (Avrupa)"
  },
  it: {
    code: "it",
    iso3: "ita",
    language: "Italian",
    name: "İtalyanca"
  },
  ita: {
    code: "it",
    iso3: "ita",
    language: "Italian",
    name: "İtalyanca"
  },
  italian: {
    code: "it",
    iso3: "ita",
    language: "Italian",
    name: "İtalyanca"
  },
  italyanca: {
    code: "it",
    iso3: "ita",
    language: "Italian",
    name: "İtalyanca"
  },
  ru: {
    code: "ru",
    iso3: "rus",
    language: "Russian",
    name: "Rusça"
  },
  rus: {
    code: "ru",
    iso3: "rus",
    language: "Russian",
    name: "Rusça"
  },
  russian: {
    code: "ru",
    iso3: "rus",
    language: "Russian",
    name: "Rusça"
  },
  rusca: {
    code: "ru",
    iso3: "rus",
    language: "Russian",
    name: "Rusça"
  },
  ar: {
    code: "ar",
    iso3: "ara",
    language: "Arabic",
    name: "Arapça"
  },
  ara: {
    code: "ar",
    iso3: "ara",
    language: "Arabic",
    name: "Arapça"
  },
  arabic: {
    code: "ar",
    iso3: "ara",
    language: "Arabic",
    name: "Arapça"
  },
  arapca: {
    code: "ar",
    iso3: "ara",
    language: "Arabic",
    name: "Arapça"
  },
  ja: {
    code: "ja",
    iso3: "jpn",
    language: "Japanese",
    name: "Japonca"
  },
  jpn: {
    code: "ja",
    iso3: "jpn",
    language: "Japanese",
    name: "Japonca"
  },
  japanese: {
    code: "ja",
    iso3: "jpn",
    language: "Japanese",
    name: "Japonca"
  },
  japonca: {
    code: "ja",
    iso3: "jpn",
    language: "Japanese",
    name: "Japonca"
  },
  ko: {
    code: "ko",
    iso3: "kor",
    language: "Korean",
    name: "Korece"
  },
  kor: {
    code: "ko",
    iso3: "kor",
    language: "Korean",
    name: "Korece"
  },
  korean: {
    code: "ko",
    iso3: "kor",
    language: "Korean",
    name: "Korece"
  },
  korece: {
    code: "ko",
    iso3: "kor",
    language: "Korean",
    name: "Korece"
  },
  zh: {
    code: "zh",
    iso3: "chi",
    language: "Chinese",
    name: "Çince"
  },
  chi: {
    code: "zh",
    iso3: "chi",
    language: "Chinese",
    name: "Çince"
  },
  zho: {
    code: "zh",
    iso3: "chi",
    language: "Chinese",
    name: "Çince"
  },
  chinese: {
    code: "zh",
    iso3: "chi",
    language: "Chinese",
    name: "Çince"
  },
  cince: {
    code: "zh",
    iso3: "chi",
    language: "Chinese",
    name: "Çince"
  },
  az: {
    code: "az",
    iso3: "aze",
    language: "Azerbaijani",
    name: "Azerbaycanca"
  },
  aze: {
    code: "az",
    iso3: "aze",
    language: "Azerbaijani",
    name: "Azerbaycanca"
  },
  azerbaijani: {
    code: "az",
    iso3: "aze",
    language: "Azerbaijani",
    name: "Azerbaycanca"
  },
  azerbaycanca: {
    code: "az",
    iso3: "aze",
    language: "Azerbaijani",
    name: "Azerbaycanca"
  },
  pl: {
    code: "pl",
    iso3: "pol",
    language: "Polish",
    name: "Lehçe"
  },
  pol: {
    code: "pl",
    iso3: "pol",
    language: "Polish",
    name: "Lehçe"
  },
  polish: {
    code: "pl",
    iso3: "pol",
    language: "Polish",
    name: "Lehçe"
  },
  lehce: {
    code: "pl",
    iso3: "pol",
    language: "Polish",
    name: "Lehçe"
  },
  nl: {
    code: "nl",
    iso3: "nld",
    language: "Dutch",
    name: "Felemenkçe"
  },
  nld: {
    code: "nl",
    iso3: "nld",
    language: "Dutch",
    name: "Felemenkçe"
  },
  dut: {
    code: "nl",
    iso3: "nld",
    language: "Dutch",
    name: "Felemenkçe"
  },
  dutch: {
    code: "nl",
    iso3: "nld",
    language: "Dutch",
    name: "Felemenkçe"
  },
  felemenkce: {
    code: "nl",
    iso3: "nld",
    language: "Dutch",
    name: "Felemenkçe"
  },
  hollandaca: {
    code: "nl",
    iso3: "nld",
    language: "Dutch",
    name: "Felemenkçe"
  },
  el: {
    code: "el",
    iso3: "ell",
    language: "Greek",
    name: "Yunanca"
  },
  ell: {
    code: "el",
    iso3: "ell",
    language: "Greek",
    name: "Yunanca"
  },
  gre: {
    code: "el",
    iso3: "ell",
    language: "Greek",
    name: "Yunanca"
  },
  greek: {
    code: "el",
    iso3: "ell",
    language: "Greek",
    name: "Yunanca"
  },
  yunanca: {
    code: "el",
    iso3: "ell",
    language: "Greek",
    name: "Yunanca"
  },
  hu: {
    code: "hu",
    iso3: "hun",
    language: "Hungarian",
    name: "Macarca"
  },
  hun: {
    code: "hu",
    iso3: "hun",
    language: "Hungarian",
    name: "Macarca"
  },
  hungarian: {
    code: "hu",
    iso3: "hun",
    language: "Hungarian",
    name: "Macarca"
  },
  macarca: {
    code: "hu",
    iso3: "hun",
    language: "Hungarian",
    name: "Macarca"
  },
  ro: {
    code: "ro",
    iso3: "ron",
    language: "Romanian",
    name: "Romence"
  },
  ron: {
    code: "ro",
    iso3: "ron",
    language: "Romanian",
    name: "Romence"
  },
  rum: {
    code: "ro",
    iso3: "ron",
    language: "Romanian",
    name: "Romence"
  },
  romanian: {
    code: "ro",
    iso3: "ron",
    language: "Romanian",
    name: "Romence"
  },
  romence: {
    code: "ro",
    iso3: "ron",
    language: "Romanian",
    name: "Romence"
  },
  sv: {
    code: "sv",
    iso3: "swe",
    language: "Swedish",
    name: "İsveççe"
  },
  swe: {
    code: "sv",
    iso3: "swe",
    language: "Swedish",
    name: "İsveççe"
  },
  swedish: {
    code: "sv",
    iso3: "swe",
    language: "Swedish",
    name: "İsveççe"
  },
  isvecce: {
    code: "sv",
    iso3: "swe",
    language: "Swedish",
    name: "İsveççe"
  },
  no: {
    code: "no",
    iso3: "nor",
    language: "Norwegian",
    name: "Norveççe"
  },
  nor: {
    code: "no",
    iso3: "nor",
    language: "Norwegian",
    name: "Norveççe"
  },
  norwegian: {
    code: "no",
    iso3: "nor",
    language: "Norwegian",
    name: "Norveççe"
  },
  norvecce: {
    code: "no",
    iso3: "nor",
    language: "Norwegian",
    name: "Norveççe"
  },
  da: {
    code: "da",
    iso3: "dan",
    language: "Danish",
    name: "Danca"
  },
  dan: {
    code: "da",
    iso3: "dan",
    language: "Danish",
    name: "Danca"
  },
  danish: {
    code: "da",
    iso3: "dan",
    language: "Danish",
    name: "Danca"
  },
  danca: {
    code: "da",
    iso3: "dan",
    language: "Danish",
    name: "Danca"
  },
  fi: {
    code: "fi",
    iso3: "fin",
    language: "Finnish",
    name: "Fince"
  },
  fin: {
    code: "fi",
    iso3: "fin",
    language: "Finnish",
    name: "Fince"
  },
  finnish: {
    code: "fi",
    iso3: "fin",
    language: "Finnish",
    name: "Fince"
  },
  fince: {
    code: "fi",
    iso3: "fin",
    language: "Finnish",
    name: "Fince"
  },
  cs: {
    code: "cs",
    iso3: "ces",
    language: "Czech",
    name: "Çekçe"
  },
  ces: {
    code: "cs",
    iso3: "ces",
    language: "Czech",
    name: "Çekçe"
  },
  cze: {
    code: "cs",
    iso3: "ces",
    language: "Czech",
    name: "Çekçe"
  },
  czech: {
    code: "cs",
    iso3: "ces",
    language: "Czech",
    name: "Çekçe"
  },
  cekce: {
    code: "cs",
    iso3: "ces",
    language: "Czech",
    name: "Çekçe"
  },
  uk: {
    code: "uk",
    iso3: "ukr",
    language: "Ukrainian",
    name: "Ukraynaca"
  },
  ukr: {
    code: "uk",
    iso3: "ukr",
    language: "Ukrainian",
    name: "Ukraynaca"
  },
  ukrainian: {
    code: "uk",
    iso3: "ukr",
    language: "Ukrainian",
    name: "Ukraynaca"
  },
  ukraynaca: {
    code: "uk",
    iso3: "ukr",
    language: "Ukrainian",
    name: "Ukraynaca"
  },
  bg: {
    code: "bg",
    iso3: "bul",
    language: "Bulgarian",
    name: "Bulgarca"
  },
  bul: {
    code: "bg",
    iso3: "bul",
    language: "Bulgarian",
    name: "Bulgarca"
  },
  bulgarian: {
    code: "bg",
    iso3: "bul",
    language: "Bulgarian",
    name: "Bulgarca"
  },
  bulgarca: {
    code: "bg",
    iso3: "bul",
    language: "Bulgarian",
    name: "Bulgarca"
  },
  hr: {
    code: "hr",
    iso3: "hrv",
    language: "Croatian",
    name: "Hırvatça"
  },
  hrv: {
    code: "hr",
    iso3: "hrv",
    language: "Croatian",
    name: "Hırvatça"
  },
  croatian: {
    code: "hr",
    iso3: "hrv",
    language: "Croatian",
    name: "Hırvatça"
  },
  hirvatca: {
    code: "hr",
    iso3: "hrv",
    language: "Croatian",
    name: "Hırvatça"
  },
  sr: {
    code: "sr",
    iso3: "srp",
    language: "Serbian",
    name: "Sırpça"
  },
  srp: {
    code: "sr",
    iso3: "srp",
    language: "Serbian",
    name: "Sırpça"
  },
  serbian: {
    code: "sr",
    iso3: "srp",
    language: "Serbian",
    name: "Sırpça"
  },
  sirpca: {
    code: "sr",
    iso3: "srp",
    language: "Serbian",
    name: "Sırpça"
  },
  sk: {
    code: "sk",
    iso3: "slk",
    language: "Slovak",
    name: "Slovakça"
  },
  slk: {
    code: "sk",
    iso3: "slk",
    language: "Slovak",
    name: "Slovakça"
  },
  slovak: {
    code: "sk",
    iso3: "slk",
    language: "Slovak",
    name: "Slovakça"
  },
  slovakca: {
    code: "sk",
    iso3: "slk",
    language: "Slovak",
    name: "Slovakça"
  },
  sl: {
    code: "sl",
    iso3: "slv",
    language: "Slovenian",
    name: "Slovence"
  },
  slv: {
    code: "sl",
    iso3: "slv",
    language: "Slovenian",
    name: "Slovence"
  },
  slovenian: {
    code: "sl",
    iso3: "slv",
    language: "Slovenian",
    name: "Slovence"
  },
  slovence: {
    code: "sl",
    iso3: "slv",
    language: "Slovenian",
    name: "Slovence"
  },
  hi: {
    code: "hi",
    iso3: "hin",
    language: "Hindi",
    name: "Hintçe"
  },
  hin: {
    code: "hi",
    iso3: "hin",
    language: "Hindi",
    name: "Hintçe"
  },
  hindi: {
    code: "hi",
    iso3: "hin",
    language: "Hindi",
    name: "Hintçe"
  },
  hintce: {
    code: "hi",
    iso3: "hin",
    language: "Hindi",
    name: "Hintçe"
  },
  th: {
    code: "th",
    iso3: "tha",
    language: "Thai",
    name: "Tayca"
  },
  tha: {
    code: "th",
    iso3: "tha",
    language: "Thai",
    name: "Tayca"
  },
  thai: {
    code: "th",
    iso3: "tha",
    language: "Thai",
    name: "Tayca"
  },
  tayca: {
    code: "th",
    iso3: "tha",
    language: "Thai",
    name: "Tayca"
  },
  vi: {
    code: "vi",
    iso3: "vie",
    language: "Vietnamese",
    name: "Vietnamca"
  },
  vie: {
    code: "vi",
    iso3: "vie",
    language: "Vietnamese",
    name: "Vietnamca"
  },
  vietnamese: {
    code: "vi",
    iso3: "vie",
    language: "Vietnamese",
    name: "Vietnamca"
  },
  vietnamca: {
    code: "vi",
    iso3: "vie",
    language: "Vietnamese",
    name: "Vietnamca"
  },
  id: {
    code: "id",
    iso3: "ind",
    language: "Indonesian",
    name: "Endonezce"
  },
  ind: {
    code: "id",
    iso3: "ind",
    language: "Indonesian",
    name: "Endonezce"
  },
  indonesian: {
    code: "id",
    iso3: "ind",
    language: "Indonesian",
    name: "Endonezce"
  },
  endonezce: {
    code: "id",
    iso3: "ind",
    language: "Indonesian",
    name: "Endonezce"
  },
  ms: {
    code: "ms",
    iso3: "msa",
    language: "Malay",
    name: "Malayca"
  },
  msa: {
    code: "ms",
    iso3: "msa",
    language: "Malay",
    name: "Malayca"
  },
  may: {
    code: "ms",
    iso3: "msa",
    language: "Malay",
    name: "Malayca"
  },
  malay: {
    code: "ms",
    iso3: "msa",
    language: "Malay",
    name: "Malayca"
  },
  malayca: {
    code: "ms",
    iso3: "msa",
    language: "Malay",
    name: "Malayca"
  },
  ca: {
    code: "ca",
    iso3: "cat",
    language: "Catalan",
    name: "Katalanca"
  },
  cat: {
    code: "ca",
    iso3: "cat",
    language: "Catalan",
    name: "Katalanca"
  },
  catalan: {
    code: "ca",
    iso3: "cat",
    language: "Catalan",
    name: "Katalanca"
  },
  katalanca: {
    code: "ca",
    iso3: "cat",
    language: "Catalan",
    name: "Katalanca"
  },
  "cat-eu": {
    code: "ca",
    iso3: "cat",
    language: "Catalan",
    name: "Katalanca (Avrupa)"
  },
  "katalanca\x20avrupa": {
    code: "ca",
    iso3: "cat",
    language: "Catalan",
    name: "Katalanca (Avrupa)"
  },
  he: {
    code: "he",
    iso3: "heb",
    language: "Hebrew",
    name: "İbranice"
  },
  heb: {
    code: "he",
    iso3: "heb",
    language: "Hebrew",
    name: "İbranice"
  },
  hebrew: {
    code: "he",
    iso3: "heb",
    language: "Hebrew",
    name: "İbranice"
  },
  ibranice: {
    code: "he",
    iso3: "heb",
    language: "Hebrew",
    name: "İbranice"
  },
  fa: {
    code: "fa",
    iso3: "fas",
    language: "Persian",
    name: "Farsça"
  },
  fas: {
    code: "fa",
    iso3: "fas",
    language: "Persian",
    name: "Farsça"
  },
  per: {
    code: "fa",
    iso3: "fas",
    language: "Persian",
    name: "Farsça"
  },
  persian: {
    code: "fa",
    iso3: "fas",
    language: "Persian",
    name: "Farsça"
  },
  farsca: {
    code: "fa",
    iso3: "fas",
    language: "Persian",
    name: "Farsça"
  },
  ta: {
    code: "ta",
    iso3: "tam",
    language: "Tamil",
    name: "Tamilce"
  },
  tam: {
    code: "ta",
    iso3: "tam",
    language: "Tamil",
    name: "Tamilce"
  },
  tamil: {
    code: "ta",
    iso3: "tam",
    language: "Tamil",
    name: "Tamilce"
  },
  tamilce: {
    code: "ta",
    iso3: "tam",
    language: "Tamil",
    name: "Tamilce"
  },
  te: {
    code: "te",
    iso3: "tel",
    language: "Telugu",
    name: "Teluguca"
  },
  tel: {
    code: "te",
    iso3: "tel",
    language: "Telugu",
    name: "Teluguca"
  },
  telugu: {
    code: "te",
    iso3: "tel",
    language: "Telugu",
    name: "Teluguca"
  },
  teluguca: {
    code: "te",
    iso3: "tel",
    language: "Telugu",
    name: "Teluguca"
  },
  kn: {
    code: "kn",
    iso3: "kan",
    language: "Kannada",
    name: "Kannadaca"
  },
  kan: {
    code: "kn",
    iso3: "kan",
    language: "Kannada",
    name: "Kannadaca"
  },
  kannada: {
    code: "kn",
    iso3: "kan",
    language: "Kannada",
    name: "Kannadaca"
  },
  kannadaca: {
    code: "kn",
    iso3: "kan",
    language: "Kannada",
    name: "Kannadaca"
  },
  ml: {
    code: "ml",
    iso3: "mal",
    language: "Malayalam",
    name: "Malayalamca"
  },
  mal: {
    code: "ml",
    iso3: "mal",
    language: "Malayalam",
    name: "Malayalamca"
  },
  malayalam: {
    code: "ml",
    iso3: "mal",
    language: "Malayalam",
    name: "Malayalamca"
  },
  malayalamca: {
    code: "ml",
    iso3: "mal",
    language: "Malayalam",
    name: "Malayalamca"
  },
  tl: {
    code: "tl",
    iso3: "tgl",
    language: "Filipino",
    name: "Filipince"
  },
  tgl: {
    code: "tl",
    iso3: "tgl",
    language: "Filipino",
    name: "Filipince"
  },
  fil: {
    code: "tl",
    iso3: "tgl",
    language: "Filipino",
    name: "Filipince"
  },
  filipino: {
    code: "tl",
    iso3: "tgl",
    language: "Filipino",
    name: "Filipince"
  },
  tagalog: {
    code: "tl",
    iso3: "tgl",
    language: "Filipino",
    name: "Filipince"
  },
  ka: {
    code: "ka",
    iso3: "kat",
    language: "Georgian",
    name: "Gürcüce"
  },
  kat: {
    code: "ka",
    iso3: "kat",
    language: "Georgian",
    name: "Gürcüce"
  },
  geo: {
    code: "ka",
    iso3: "kat",
    language: "Georgian",
    name: "Gürcüce"
  },
  georgian: {
    code: "ka",
    iso3: "kat",
    language: "Georgian",
    name: "Gürcüce"
  },
  gurcuce: {
    code: "ka",
    iso3: "kat",
    language: "Georgian",
    name: "Gürcüce"
  },
  sq: {
    code: "sq",
    iso3: "sqi",
    language: "Albanian",
    name: "Arnavutça"
  },
  sqi: {
    code: "sq",
    iso3: "sqi",
    language: "Albanian",
    name: "Arnavutça"
  },
  alb: {
    code: "sq",
    iso3: "sqi",
    language: "Albanian",
    name: "Arnavutça"
  },
  albanian: {
    code: "sq",
    iso3: "sqi",
    language: "Albanian",
    name: "Arnavutça"
  },
  arnavutca: {
    code: "sq",
    iso3: "sqi",
    language: "Albanian",
    name: "Arnavutça"
  },
  bs: {
    code: "bs",
    iso3: "bos",
    language: "Bosnian",
    name: "Boşnakça"
  },
  bos: {
    code: "bs",
    iso3: "bos",
    language: "Bosnian",
    name: "Boşnakça"
  },
  bosnian: {
    code: "bs",
    iso3: "bos",
    language: "Bosnian",
    name: "Boşnakça"
  },
  bosnakca: {
    code: "bs",
    iso3: "bos",
    language: "Bosnian",
    name: "Boşnakça"
  },
  mk: {
    code: "mk",
    iso3: "mkd",
    language: "Macedonian",
    name: "Makedonca"
  },
  mkd: {
    code: "mk",
    iso3: "mkd",
    language: "Macedonian",
    name: "Makedonca"
  },
  mac: {
    code: "mk",
    iso3: "mkd",
    language: "Macedonian",
    name: "Makedonca"
  },
  macedonian: {
    code: "mk",
    iso3: "mkd",
    language: "Macedonian",
    name: "Makedonca"
  },
  makedonca: {
    code: "mk",
    iso3: "mkd",
    language: "Macedonian",
    name: "Makedonca"
  },
  kk: {
    code: "kk",
    iso3: "kaz",
    language: "Kazakh",
    name: "Kazakça"
  },
  kaz: {
    code: "kk",
    iso3: "kaz",
    language: "Kazakh",
    name: "Kazakça"
  },
  kazakh: {
    code: "kk",
    iso3: "kaz",
    language: "Kazakh",
    name: "Kazakça"
  },
  kazakca: {
    code: "kk",
    iso3: "kaz",
    language: "Kazakh",
    name: "Kazakça"
  },
  uz: {
    code: "uz",
    iso3: "uzb",
    language: "Uzbek",
    name: "Özbekçe"
  },
  uzb: {
    code: "uz",
    iso3: "uzb",
    language: "Uzbek",
    name: "Özbekçe"
  },
  uzbek: {
    code: "uz",
    iso3: "uzb",
    language: "Uzbek",
    name: "Özbekçe"
  },
  ozbekce: {
    code: "uz",
    iso3: "uzb",
    language: "Uzbek",
    name: "Özbekçe"
  },
  bn: {
    code: "bn",
    iso3: "ben",
    language: "Bengali",
    name: "Bengalce"
  },
  ben: {
    code: "bn",
    iso3: "ben",
    language: "Bengali",
    name: "Bengalce"
  },
  bengali: {
    code: "bn",
    iso3: "ben",
    language: "Bengali",
    name: "Bengalce"
  },
  bengalce: {
    code: "bn",
    iso3: "ben",
    language: "Bengali",
    name: "Bengalce"
  },
  mr: {
    code: "mr",
    iso3: "mar",
    language: "Marathi",
    name: "Marathice"
  },
  mar: {
    code: "mr",
    iso3: "mar",
    language: "Marathi",
    name: "Marathice"
  },
  marathi: {
    code: "mr",
    iso3: "mar",
    language: "Marathi",
    name: "Marathice"
  },
  marathice: {
    code: "mr",
    iso3: "mar",
    language: "Marathi",
    name: "Marathice"
  },
  gu: {
    code: "gu",
    iso3: "guj",
    language: "Gujarati",
    name: "Guceratça"
  },
  guj: {
    code: "gu",
    iso3: "guj",
    language: "Gujarati",
    name: "Guceratça"
  },
  gujarati: {
    code: "gu",
    iso3: "guj",
    language: "Gujarati",
    name: "Guceratça"
  },
  guceratca: {
    code: "gu",
    iso3: "guj",
    language: "Gujarati",
    name: "Guceratça"
  },
  pa: {
    code: "pa",
    iso3: "pan",
    language: "Punjabi",
    name: "Pencapça"
  },
  pan: {
    code: "pa",
    iso3: "pan",
    language: "Punjabi",
    name: "Pencapça"
  },
  punjabi: {
    code: "pa",
    iso3: "pan",
    language: "Punjabi",
    name: "Pencapça"
  },
  pencapca: {
    code: "pa",
    iso3: "pan",
    language: "Punjabi",
    name: "Pencapça"
  },
  eu: {
    code: "eu",
    iso3: "baq",
    language: "Basque",
    name: "Baskça"
  },
  baq: {
    code: "eu",
    iso3: "baq",
    language: "Basque",
    name: "Baskça"
  },
  eus: {
    code: "eu",
    iso3: "baq",
    language: "Basque",
    name: "Baskça"
  },
  basque: {
    code: "eu",
    iso3: "baq",
    language: "Basque",
    name: "Baskça"
  },
  baskca: {
    code: "eu",
    iso3: "baq",
    language: "Basque",
    name: "Baskça"
  },
  gl: {
    code: "gl",
    iso3: "glg",
    language: "Galician",
    name: "Galisyaca"
  },
  glg: {
    code: "gl",
    iso3: "glg",
    language: "Galician",
    name: "Galisyaca"
  },
  galician: {
    code: "gl",
    iso3: "glg",
    language: "Galician",
    name: "Galisyaca"
  },
  galisyaca: {
    code: "gl",
    iso3: "glg",
    language: "Galician",
    name: "Galisyaca"
  },
  et: {
    code: "et",
    iso3: "est",
    language: "Estonian",
    name: "Estonca"
  },
  est: {
    code: "et",
    iso3: "est",
    language: "Estonian",
    name: "Estonca"
  },
  estonian: {
    code: "et",
    iso3: "est",
    language: "Estonian",
    name: "Estonca"
  },
  estonca: {
    code: "et",
    iso3: "est",
    language: "Estonian",
    name: "Estonca"
  },
  lv: {
    code: "lv",
    iso3: "lav",
    language: "Latvian",
    name: "Letonca"
  },
  lav: {
    code: "lv",
    iso3: "lav",
    language: "Latvian",
    name: "Letonca"
  },
  latvian: {
    code: "lv",
    iso3: "lav",
    language: "Latvian",
    name: "Letonca"
  },
  letonca: {
    code: "lv",
    iso3: "lav",
    language: "Latvian",
    name: "Letonca"
  },
  lt: {
    code: "lt",
    iso3: "lit",
    language: "Lithuanian",
    name: "Litvanca"
  },
  lit: {
    code: "lt",
    iso3: "lit",
    language: "Lithuanian",
    name: "Litvanca"
  },
  lithuanian: {
    code: "lt",
    iso3: "lit",
    language: "Lithuanian",
    name: "Litvanca"
  },
  litvanca: {
    code: "lt",
    iso3: "lit",
    language: "Lithuanian",
    name: "Litvanca"
  },
  is: {
    code: "is",
    iso3: "isl",
    language: "Icelandic",
    name: "İzlandaca"
  },
  isl: {
    code: "is",
    iso3: "isl",
    language: "Icelandic",
    name: "İzlandaca"
  },
  ice: {
    code: "is",
    iso3: "isl",
    language: "Icelandic",
    name: "İzlandaca"
  },
  icelandic: {
    code: "is",
    iso3: "isl",
    language: "Icelandic",
    name: "İzlandaca"
  },
  izlandaca: {
    code: "is",
    iso3: "isl",
    language: "Icelandic",
    name: "İzlandaca"
  }
};
function splitOf3(input, input2, arg3) {
  let fn8 = (input3) =>
      (input3 || "")
        .replace(/İ/g, "i")
        .replace(/I/g, "i")
        .replace(/ı/g, "i")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .toLowerCase()
        .trim(),
    value5 = fn8(input || ""),
    value6 = fn8(input2 || ""),
    val5 =
      !!arg3 ||
      value5.includes("forced") ||
      value6.includes("forced") ||
      value5.includes("zorunlu") ||
      value6.includes("zorunlu"),
    replaced = value5
      .replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g, "")
      .replace(/[-_()[\]]/g, "\x20")
      .trim(),
    replaced2 = value6
      .replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g, "")
      .replace(/[-_()[\]]/g, "\x20")
      .trim(),
    fn9 = (input3) => {
      let replaced3 = input3
        .replace(/\s*\((?:forced|zorunlu)\)/gi, "")
        .replace(/\s*-\s*(?:forced|zorunlu)/gi, "")
        .trim();
      return val5 ? replaced3 + " (Zorunlu)" : replaced3;
    };
  if (
    replaced === "st" ||
    replaced === "sot" ||
    replaced.includes("sotho") ||
    replaced2.includes("sotho") ||
    replaced2.includes("sesotho")
  )
    return {
      code: "tr",
      iso3: "tur",
      language: "Turkish",
      name: val5 ? "Türkçe (Zorunlu)" : "Türkçe"
    };
  let val6 =
    clientProfile[value5] ||
    clientProfile[value6] ||
    clientProfile[replaced] ||
    clientProfile[replaced2];
  if (!val6) {
    let parts = (replaced2 + "\x20" + replaced).split(/\s+/).filter(Boolean);
    for (let value7 of parts)
      if (clientProfile[value7]) {
        val6 = clientProfile[value7];
        break;
      }
  }
  if (!val6) {
    for (let [value7, value8] of Object.entries(clientProfile))
      if (value7.length >= 4 && (replaced2.includes(value7) || replaced.includes(value7))) {
        val6 = value8;
        break;
      }
  }
  if (val6)
    return {
      code: val6.code,
      iso3: val6.iso3,
      language: val6.language,
      name: fn9(val6.name)
    };
  let trimmed = (input2 || input || "Altyazı").trim();
  trimmed = trimmed
    .replace(/\s*\((?:forced|zorunlu)\)/gi, "")
    .replace(/\s*-\s*(?:forced|zorunlu)/gi, "")
    .trim();
  let language = trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
    name = fn9(language),
    code = value5 && value5.length === 2 ? value5 : value6 && value6.length === 2 ? value6 : "und",
    iso3 = value5 && value5.length === 3 ? value5 : value6 && value6.length === 3 ? value6 : "und";
  return {
    code: code,
    iso3: iso3,
    language: language,
    name: name
  };
}
function defineProp3(arg1) {
  let val5 = arg1.url ? buildUrl(void 0, arg1.url) : {},
    val6 = arg1.quality || arg1.inspection?.detectedQuality || val5.detectedQuality || "1080p";
  (val6.includes("\u2022") && (val6 = val6.split("\u2022")[0].trim()),
    !val6.includes("p") &&
      !val6.includes("K") &&
      !val6.includes("k") &&
      val6 !== "HD" &&
      val6 !== "FHD" &&
      val6 !== "SD" &&
      (val6 = val6 + "p"));
  let val7 = arg1.subtitles || arg1.inspection?.subtitles,
    flag = !!(
      arg1.inspection?.hasTurkishSubtitles ||
      val7?.some((arg12) => {
        let value5 = (arg12.lang || arg12.code || "").toLowerCase(),
          value6 = (arg12.langCode || arg12.iso3 || "").toLowerCase(),
          value7 = (arg12.name || arg12.label || arg12.title || "").toLowerCase();
        return (
          value5 === "tr" ||
          value5 === "st" ||
          value6 === "tur" ||
          value6 === "sot" ||
          value7.includes("türk") ||
          value7.includes("turk") ||
          value7.includes("sotho")
        );
      })
    ),
    trimmed = (arg1.languageTitle || arg1.inspection?.languageTitle || "").toLowerCase().trim(),
    val8 =
      trimmed.includes("dub") ||
      trimmed.includes("ses") ||
      trimmed.includes("dual") ||
      !!val5.hasTurkishAudio ||
      !!arg1.inspection?.hasTurkishAudio,
    val9 =
      trimmed.includes("dual") ||
      (trimmed.includes("dub") && (trimmed.includes("alt") || trimmed.includes("sub"))) ||
      (val8 && flag),
    title = "Orijinal";
  trimmed.includes("yerli") || arg1.inspection?.isYerli
    ? (title = "Yerli")
    : val9
      ? (title = "Dublaj / Altyazılı")
      : val8
        ? (title = "Dublaj")
        : flag || trimmed.includes("alt") || trimmed.includes("sub")
          ? (title = "Altyazılı")
          : (trimmed.includes("orijinal") ||
              trimmed.includes("yabancı") ||
              trimmed.includes("original")) &&
            (title = "Orijinal");
  let val10 =
      arg1.format === "m3u8" ||
      arg1.url.includes(".m3u8") ||
      arg1.url.includes("/master.") ||
      arg1.url.includes("/hls/") ||
      arg1.url.includes("/txt/"),
    format = arg1.format || (val10 ? "m3u8" : arg1.url.includes(".mp4") ? "mp4" : "m3u8"),
    val11 = format === "m3u8" ? "HLS" : format.toUpperCase(),
    list2 = [val6],
    val12 = arg1.codec || arg1.inspection?.detectedCodec || val5.detectedCodec;
  (val12 && val12 !== "H.264" && list2.push(val12),
    list2.push(val11),
    arg1.bitrate && list2.push(arg1.bitrate));
  let val13 = arg1.audio || arg1.inspection?.detectedAudio || val5.detectedAudio;
  val13 && val13 !== "AAC 2.0" && list2.push(val13);
  let val14 = arg1.details || list2.join(" • "),
    description = title + "\x0a" + val14,
    quality = val6 + " • " + title,
    clientProfile2 = {
      name: arg1.name,
      title: title,
      description: description,
      url: arg1.url,
      quality: quality,
      format: format
    };
  return (
    arg1.headers && Object.keys(arg1.headers).length > 0 && (clientProfile2.headers = arg1.headers),
    val7 && val7.length > 0 && (clientProfile2.subtitles = val7),
    clientProfile2
  );
}
var userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
async function request(url, url2 = {}, xorKey = 4000) {
  let signal = url2.signal;
  if (!signal && typeof AbortSignal < "u" && typeof AbortSignal.timeout == "function")
    try {
      signal = AbortSignal.timeout(xorKey);
    } catch {}
  return fetch(url, {
    ...url2,
    signal: signal
  });
}
function replaceIn(arg1) {
  return (arg1 || "")
    .toLowerCase()
    .replace(/[ıİ]/g, "i")
    .replace(/[ğĞ]/g, "g")
    .replace(/[üÜ]/g, "u")
    .replace(/[şŞ]/g, "s")
    .replace(/[öÖ]/g, "o")
    .replace(/[çÇ]/g, "c")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}
async function matchOf(arg1, arg2, headers) {
  let url = (arg2 || "").trim();
  if (!url) return [];
  if (/sibnet\.ru/i.test(url)) {
    let val5 = url.match(/videoid=(\d+)/i) || url.match(/video(\d{7,})/i);
    if (val5)
      try {
        let result = await request(arg1 + "/api/resolve-sibnet?id=" + val5[1], {
          headers: headers
        });
        if (result.ok) {
          let data = await result.json();
          if (data.success && data.streamUrl)
            return [
              {
                url: data.streamUrl.startsWith("http")
                  ? data.streamUrl
                  : "" + arg1 + data.streamUrl,
                quality: "1080p",
                format: "mp4"
              }
            ];
        }
      } catch {}
  }
  if (/mail\.ru/i.test(url))
    try {
      let result = await request(arg1 + "/api/proxy/mailru?url=" + encodeURIComponent(url), {
        headers: headers
      });
      if (result.ok) {
        let data = await result.json();
        if (data.success && Array.isArray(data.sources) && data.sources.length > 0)
          return data.sources.map((arg12) => ({
            url: arg12.url.startsWith("http") ? arg12.url : "" + arg1 + arg12.url,
            quality: arg12.quality || "1080p",
            format: "mp4"
          }));
      }
    } catch {}
  if (/vk\.com/i.test(url))
    try {
      let result = await request(arg1 + "/api/proxy/vk?url=" + encodeURIComponent(url), {
        headers: headers
      });
      if (result.ok) {
        let data = await result.json();
        if (data.success && Array.isArray(data.sources) && data.sources.length > 0)
          return data.sources.map((arg12) => ({
            url: arg12.url.startsWith("http") ? arg12.url : "" + arg1 + arg12.url,
            quality: arg12.quality || "1080p",
            format: "mp4"
          }));
      }
    } catch {}
  if (/abyssplayer\.com|abysscdn\.com|abyss\.to/i.test(url))
    try {
      let result = await request(arg1 + "/api/proxy/abysscdn?url=" + encodeURIComponent(url), {
        headers: headers
      });
      if (result.ok) {
        let data = await result.json();
        if (data.success) {
          if (Array.isArray(data.sources) && data.sources.length > 0)
            return data.sources.map((arg12) => ({
              url: arg12.url?.startsWith("http")
                ? arg12.url
                : "" + arg1 + (arg12.url?.startsWith("/") ? "" : "/") + arg12.url,
              quality: arg12.quality || "Auto",
              format: data.type === "hls" ? "m3u8" : "mp4"
            }));
          if (data.streamUrl || data.masterUrl) {
            let val5 = data.streamUrl || data.masterUrl;
            return [
              {
                url: val5?.startsWith("http")
                  ? val5
                  : "" + arg1 + (val5?.startsWith("/") ? "" : "/") + val5,
                quality: "Auto",
                format: data.type === "hls" ? "m3u8" : "mp4"
              }
            ];
          }
        }
      }
    } catch {}
  if (/ok\.ru/i.test(url)) {
    let value5 = url.match(/\/video(?:embed)?\/(\d+)/)?.[1];
    if (value5)
      try {
        let result = await request(
          "https://zerplayer.turksanimex.workers.dev/?url=" +
            encodeURIComponent("https://ok.ru/videoembed/" + value5)
        );
        if (result.ok) {
          let data = await result.json();
          if (data.success && Array.isArray(data.sources) && data.sources.length > 0)
            return data.sources.map((arg12) => ({
              url: arg12.url,
              quality: arg12.quality || "1080p",
              format: "mp4"
            }));
        }
      } catch {}
  }
  if (/voe\.sx|bryantenunder\.com/i.test(url))
    try {
      let result = await request(arg1 + "/api/proxy/voe?url=" + encodeURIComponent(url), {
        headers: headers
      });
      if (result.ok) {
        let data = await result.json();
        if (data.success && data.streamUrl)
          return [
            {
              url: data.streamUrl,
              quality: "1080p",
              format: data.type === "hls" ? "m3u8" : "mp4"
            }
          ];
      }
    } catch {}
  if (/vidmoly\./i.test(url))
    try {
      let result = await request(arg1 + "/api/proxy/vidmoly?url=" + encodeURIComponent(url), {
        headers: headers
      });
      if (result.ok) {
        let data = await result.json();
        if (data.success && data.streamUrl)
          return [
            {
              url: data.streamUrl,
              quality: "1080p",
              format: data.type === "hls" ? "m3u8" : "mp4"
            }
          ];
      }
    } catch {}
  if (/dailymotion\.com|dai\.ly/i.test(url))
    try {
      let result = await request(arg1 + "/api/proxy/dailymotion?url=" + encodeURIComponent(url), {
        headers: headers
      });
      if (result.ok) {
        let data = await result.json();
        if (data.success && data.streamUrl)
          return [
            {
              url: data.streamUrl,
              quality: "1080p",
              format: "m3u8"
            }
          ];
      }
    } catch {}
  return url.includes(".m3u8")
    ? [
        {
          url: url,
          quality: "1080p",
          format: "m3u8"
        }
      ]
    : url.includes(".mp4")
      ? [
          {
            url: url,
            quality: "1080p",
            format: "mp4"
          }
        ]
      : [];
}
async function getStreams(tmdbId, tmdbId2, tmdbId3, tmdbId4) {
  if (typeof tmdbId == "object" && tmdbId !== null) {
    let value5 = tmdbId;
    ((tmdbId =
      value5.id || value5.tmdbId || value5.tmdb_id || value5.imdbId || value5.imdb_id || ""),
      !tmdbId2 && (value5.type || value5.mediaType) && (tmdbId2 = value5.type || value5.mediaType),
      tmdbId3 === void 0 &&
        (value5.season !== void 0 || value5.seasonNum !== void 0) &&
        (tmdbId3 = value5.season ?? value5.seasonNum),
      tmdbId4 === void 0 &&
        (value5.episode !== void 0 || value5.episodeNum !== void 0) &&
        (tmdbId4 = value5.episode ?? value5.episodeNum));
  }
  let trimmed = String(tmdbId || "").trim();
  trimmed.toLowerCase().startsWith("tmdb:") && (trimmed = trimmed.slice(5));
  let parts = trimmed.split(":"),
    trimmed2 = parts[0].trim();
  parts.length >= 3 &&
    tmdbId3 == null &&
    ((tmdbId3 = parseInt(parts[1], 10)), (tmdbId4 = parseInt(parts[2], 10)));
  let now2 = Date.now();
  log(
    "Batgirl",
    "Tarama Başlatıldı -> TMDB: " +
      trimmed2 +
      ", Tür: " +
      tmdbId2 +
      ", Sezon: " +
      tmdbId3 +
      ", Bölüm: " +
      tmdbId4
  );
  try {
    if (!trimmed2) return [];
    let trimmed3 = String(tmdbId2 || "")
        .toLowerCase()
        .trim(),
      isTv =
        trimmed3 === "tv" || trimmed3 === "series" || trimmed3 === "show" || trimmed3 === "dizi",
      val5 = isTv ? "tv" : "movie",
      season = tmdbId3 != null ? Math.max(1, parseInt(String(tmdbId3), 10)) : 1,
      episode = tmdbId4 != null ? Math.max(1, parseInt(String(tmdbId4), 10)) : 1;
    log("Batgirl", "[Adım 1/4] TMDB başlık ve görsel verileri sorgulanıyor (" + trimmed2 + ")...");
    let [result, result2] = await Promise.all([fn3(trimmed2, val5), fn4(trimmed2, val5)]),
      trimmed4 = (result.titles || []).filter((arg1) => arg1 && arg1.trim().length > 0);
    if (trimmed4.length === 0)
      return (log("Batgirl", "TMDB başlığı çözülemedi: " + trimmed2, "warn"), []);
    let result3 = await fn("Batgirl");
    if (!result3) return (log("Batgirl", "Sağlayıcı adresi alınamadı.", "warn"), []);
    let Origin = result3.replace(/\/+$/, ""),
      headers = {
        "User-Agent": userAgent,
        Referer: Origin + "/",
        Origin: Origin
      },
      list2 = [];
    for (let value5 of trimmed4) {
      let trimmed5 = value5.trim();
      if ((trimmed5 && !list2.includes(trimmed5) && list2.push(trimmed5), trimmed5.includes(":"))) {
        let parts2 = trimmed5.split(":")[0].trim();
        parts2.length >= 3 && !list2.includes(parts2) && list2.push(parts2);
      }
      if (trimmed5.includes("-")) {
        let parts2 = trimmed5.split("-")[0].trim();
        parts2.length >= 3 && !list2.includes(parts2) && list2.push(parts2);
      }
    }
    let val6 = result2.posterPath ? result2.posterPath.toLowerCase().replace(/^\/+/, "") : null,
      val7 = result2.backdropPath ? result2.backdropPath.toLowerCase().replace(/^\/+/, "") : null,
      replaced = (result2.allPosters || []).map((input) => input.toLowerCase().replace(/^\/+/, ""));
    log(
      "Batgirl",
      "[Adım 2/4] Kaynak üzerinde aranıyor: [" + list2.slice(0, 5).join(",\x20") + "]"
    );
    let value5 = null,
      str = "",
      list3 = [],
      value6 = list2.slice(0, 9);
    for (let num = 0; num < value6.length; num += 3) list3.push(value6.slice(num, num + 3));
    for (let value7 of list3) {
      let encoded = value7.map(async (arg1) => {
          try {
            let val8 = Origin + "/api/search?q=" + encodeURIComponent(arg1) + "&limit=30",
              response = await fetch(val8, {
                headers: headers
              });
            if (!response.ok) return [];
            let data = await response.json();
            return Array.isArray(data?.data) ? data.data : [];
          } catch {
            return [];
          }
        }),
        value8 = (await Promise.all(encoded)).flat();
      for (let value9 of value8) {
        let value10 = (value9.poster || "").toLowerCase(),
          value11 = (value9.banner_image || "").toLowerCase();
        if (val6 && value10.includes(val6)) {
          ((value5 = value9), (str = "TMDB Ana Poster (" + val6 + ")"));
          break;
        }
        for (let value12 of replaced)
          if (value12.length >= 8 && value10.includes(value12)) {
            ((value5 = value9), (str = "TMDB Alt Poster (" + value12 + ")"));
            break;
          }
        if (value5) break;
        if (val7 && val7.length >= 8 && (value11.includes(val7) || value10.includes(val7))) {
          ((value5 = value9), (str = "TMDB Backdrop (" + val7 + ")"));
          break;
        }
        for (let value12 of replaced)
          if (value12.length >= 8 && (value11.includes(value12) || value10.includes(value12))) {
            ((value5 = value9), (str = "TMDB Görsel İmzası (" + value12 + ")"));
            break;
          }
        if (value5) break;
      }
      if (value5) break;
    }
    if (!value5) {
      let value7 = replaceIn(trimmed4[0] || ""),
        value8 = (trimmed4[0] || "").includes(":");
      for (let value9 of list2.slice(0, 4))
        try {
          let val8 = Origin + "/api/search?q=" + encodeURIComponent(value9) + "&limit=15",
            response = await fetch(val8, {
              headers: headers
            });
          if (!response.ok) continue;
          let data = await response.json(),
            val9 = Array.isArray(data?.data) ? data.data : [];
          for (let value10 of val9) {
            let value11 = (value10.poster || "").toLowerCase();
            if (
              (value11.includes("tmdb.org") || value11.includes("/t/p/")) &&
              (replaced.length > 0 || val6) &&
              !(
                (val6 && val6.length >= 8 && value11.includes(val6)) ||
                replaced.some((arg1) => arg1.length >= 8 && value11.includes(arg1))
              )
            )
              continue;
            let value12 = replaceIn(value10.title || ""),
              value13 = (value10.title || "").includes(":");
            if (value8 === value13 && value12 === value7) {
              ((value5 = value10), (str = 'İsim Birebir Eşleşmesi ("' + value10.title + "\x22)"));
              break;
            }
          }
          if (value5) break;
        } catch {}
    }
    if (!value5)
      return (
        log(
          "Batgirl",
          "İçerik kesin olarak doğrulanamadı (" + trimmed2 + "), boş döndürülüyor.",
          "warn"
        ),
        []
      );
    let id = value5.id,
      title = value5.title,
      val8 = value5.content_type === "movie" || !isTv;
    (log(
      "Batgirl",
      'Kesin Eşleşme Onaylandı -> "' + title + '" (ID: ' + id + ", Yöntem: " + str + ")",
      "success"
    ),
      log(
        "Batgirl",
        "[Adım 3/4] Oynatıcı embed listesi alınıyor (Sezon: " +
          season +
          ", Bölüm: " +
          episode +
          ")..."
      ));
    async function fetcher(arg1, arg2) {
      let val9 = val8
        ? Origin + "/api/film/" + id + "/embeds"
        : Origin + "/api/anime/" + id + "/embeds?season=" + arg1 + "&episode=" + arg2;
      try {
        let response = await fetch(val9, {
          headers: headers
        });
        if (response.ok) {
          let data = await response.json();
          if (Array.isArray(data?.embeds)) return data.embeds;
        }
      } catch {}
      return [];
    }
    let val9 =
      (
        await defineProp2({
          providerName: "Batgirl",
          tmdbNumericId: result.numericId,
          season: season,
          episode: episode,
          isTv: isTv,
          minAbsoluteThreshold: 24,
          fetcher: fetcher,
          isValid: (arg1) => Array.isArray(arg1) && arg1.length > 0
        })
      ).data || [];
    if (val9.length === 0)
      return (
        log(
          "Batgirl",
          "Bölüm embed bilgisi alınamadı (Sezon: " + season + ", Bölüm: " + episode + ").",
          "warn"
        ),
        []
      );
    let list4 = [],
      set = new Set();
    for (let value7 of val9) {
      let fansub = (value7.fansub_name || value7.language_label || "Bilinmiyor").trim(),
        str2 = String(value7.language_label || "").toLowerCase(),
        isDub = !!(
          value7.is_dubbed ||
          str2.includes("dub") ||
          fansub.toLowerCase().includes("dub")
        );
      if (
        (value7.url &&
          !set.has(value7.url) &&
          (set.add(value7.url),
          list4.push({
            fansub: fansub,
            isDub: isDub,
            url: value7.url
          })),
        Array.isArray(value7.sources))
      ) {
        for (let value8 of value7.sources)
          value8.url &&
            !set.has(value8.url) &&
            (set.add(value8.url),
            list4.push({
              fansub: fansub,
              isDub: isDub,
              url: value8.url
            }));
      }
    }
    log(
      "Batgirl",
      "Toplam " + list4.length + " adet aday oynatıcı toplandı. Akışlar çözümleniyor..."
    );
    let result4 = await Promise.all(
        list4.map(async (candidate) => {
          try {
            let resolvedList = await matchOf(Origin, candidate.url, headers);
            return {
              candidate: candidate,
              resolvedList: resolvedList
            };
          } catch {
            return {
              candidate: candidate,
              resolvedList: []
            };
          }
        })
      ),
      list5 = [],
      num = 1;
    for (let { candidate: candidate, resolvedList: resolvedList } of result4) {
      if (!resolvedList || resolvedList.length === 0) continue;
      let name = "Shamrock [" + num + "]";
      num++;
      let languageTitle = candidate.isDub ? "Dublaj" : "Altyazılı";
      for (let value7 of resolvedList) {
        let url = value7.url || "";
        if (
          (url.startsWith("//")
            ? (url = "https:" + url)
            : url.startsWith("/") && (url = "" + Origin + url),
          !url.startsWith("http"))
        )
          continue;
        let quality =
          !value7.quality || value7.quality.toLowerCase() === "auto" ? "1080p" : value7.quality;
        list5.push(
          defineProp3({
            name: name,
            url: url,
            languageTitle: languageTitle,
            quality: quality,
            format: value7.format,
            headers: {
              Referer: Origin + "/",
              "User-Agent": userAgent
            }
          })
        );
      }
    }
    if (num === 2) {
      for (let value7 of list5) value7.name = "Batgirl";
    }
    let now3 = ((Date.now() - now2) / 1000).toFixed(2);
    return (
      log(
        "Batgirl",
        "[Adım 4/4] TAMAMLANDI: " + list5.length + " adet akış listelendi (" + now3 + "s)",
        "success",
        list5.map((arg1) => ({
          server: arg1.name,
          kalite: arg1.quality,
          title: arg1.title
        }))
      ),
      list5
    );
  } catch (err) {
    return (log("Batgirl", "Tarama Hatası: " + (err?.message || err), "error"), []);
  }
}
var _exp = typeof module !== "undefined" && module.exports ? module.exports : {},
  _glob =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof global !== "undefined"
        ? global
        : typeof window !== "undefined"
          ? window
          : {},
  _gs = _exp.getStreams || (_exp.default && _exp.default.getStreams) || _glob.getStreams,
  _sub = _exp.getSubtitles || (_exp.default && _exp.default.getSubtitles) || _glob.getSubtitles;
if (_gs) {
  if (typeof globalThis !== "undefined") globalThis.getStreams = _gs;
  if (typeof global !== "undefined") global.getStreams = _gs;
  if (typeof window !== "undefined") window.getStreams = _gs;
  if (typeof module !== "undefined" && module.exports) { try { module.exports.getStreams = _gs; } catch (_) {} }
}
if (_sub) {
  if (typeof globalThis !== "undefined") globalThis.getSubtitles = _sub;
  if (typeof global !== "undefined") global.getSubtitles = _sub;
  if (typeof window !== "undefined") window.getSubtitles = _sub;
  if (typeof module !== "undefined" && module.exports) { try { module.exports.getSubtitles = _sub; } catch (_) {} }
}
