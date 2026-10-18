/* ==========================================================
 * ÇEKİRDEK — çözülmüş sağlayıcı (dokunulmadı)
 * Arayüz adı: ../kayit.js içindeki kahraman kodu
 * Yayın alan adı: ../alanlar.js sabit haritasından gelir.
 * ========================================================== */
/* ============================================================
 * mihawk.js
 * çözülen string: 2287, üye erişimi: 1067, silinen bootstrap: 60
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
      var fn7 = function () {
        if (_timers[value]) {
          delete _timers[value];
          try {
            arg1();
          } catch (err) {}
        }
      };
      if (typeof queueMicrotask === "function") queueMicrotask(fn7);
      else typeof Promise !== "undefined" ? Promise.resolve().then(fn7) : fn7();
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
  value3 = Object.prototype.hasOwnProperty,
  fn7 = (arg1, arg2) => {
    for (var value4 in arg2)
      defineProp(arg1, value4, {
        get: arg2[value4],
        enumerable: !0
      });
  },
  fn8 = (arg1, arg2, arg3, arg4) => {
    if ((arg2 && typeof arg2 == "object") || typeof arg2 == "function") {
      for (let value4 of value2(arg2))
        !value3.call(arg1, value4) &&
          value4 !== arg3 &&
          defineProp(arg1, value4, {
            get: () => arg2[value4],
            enumerable: !(arg4 = value(arg2, value4)) || arg4.enumerable
          });
    }
    return arg1;
  },
  fn9 = (arg1) =>
    fn8(
      defineProp({}, "__esModule", {
        value: !0
      }),
      arg1
    ),
  obj = {};
(fn7(obj, {
  default: () => obj3,
  getStreams: () => getStreams
}),
  (module.exports = fn9(obj)));
function log(provider, message, level = "info", details) {
  let val = "[" + provider + "]";
  level === "error"
    ? console.error(val, message, details || "")
    : level === "warn"
      ? console.warn(val, message, details || "")
      : console.log(val, message, details || "");
  try {
    let value4 = (typeof globalThis < "u" ? globalThis : typeof global < "u" ? global : {})
      .__NUVIO_DEV_LOG_URL__;
    typeof value4 == "string" &&
      value4.startsWith("http") &&
      fetch(value4, {
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
      let value4 = localStorage.getItem("__NUVIO_DOMAINS_CACHE_V3__");
      if (value4) {
        let parsed = JSON.parse(value4);
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
var value4 = val.__NUVIO_CONFIG_STATE__;
async function log2(arg1 = !1) {
  let time = Date.now(),
    list = [];
  (list.push(obj2.REMOTE_CONFIG_URL), list.push(obj2.FALLBACK_CONFIG_URL));
  try {
    let value5 = val.__NUVIO_DEV_LOG_URL__;
    typeof value5 == "string" &&
      value5.includes("/api/log") &&
      list.push(value5.replace("/api/log", "/domains"));
  } catch {}
  let signal =
    typeof AbortSignal < "u" && typeof AbortSignal.timeout == "function"
      ? AbortSignal.timeout(4000)
      : void 0;
  for (let value5 of list)
    try {
      let response = await fetch(value5, {
        signal: signal
      });
      if (response.ok) {
        let data = await response.json(),
          val4 = data?.data ?? data,
          val5 = val4.domains || val4,
          value6 = val4.cookies,
          val6 = val4.tmdb_keys || val4.tmdbKeys;
        (val5 &&
          typeof val5 == "object" &&
          (value4.cachedDomains = {
            ...val5
          }),
          value6 &&
            typeof value6 == "object" &&
            (value4.cachedCookies = {
              ...value4.cachedCookies,
              ...value6
            }),
          Array.isArray(val6) && val6.length > 0 && (value4.cachedTmdbKeys = val6),
          (value4.lastFetchTime = time),
          (value4.lastFetchSource = value5),
          log("Config", "Domainler basariyla cekildi: " + value5, "info"));
        try {
          typeof localStorage < "u" &&
            localStorage &&
            localStorage.setItem(
              "__NUVIO_DOMAINS_CACHE_V3__",
              JSON.stringify({
                domains: value4.cachedDomains,
                cookies: value4.cachedCookies,
                tmdbKeys: value4.cachedTmdbKeys,
                time: time
              })
            );
        } catch {}
        return;
      }
    } catch (err) {
      log("Config", "Domain alinamadi (" + value5 + "): " + err.message, "warn");
    }
  value4.lastFetchTime = time - val2 + val3;
}
async function now(arg1 = !1) {
  let now2 = Date.now(),
    val4 = Object.keys(value4.cachedDomains).length > 0;
  (arg1 || !val4 || now2 - value4.lastFetchTime > val2) &&
    (value4.activeFetchPromise ||
      (value4.activeFetchPromise = log2(arg1).finally(() => {
        value4.activeFetchPromise = null;
      })),
    await value4.activeFetchPromise);
}
async function fn(arg1) {
  return (await now(), value4.cachedDomains[arg1] || "");
}
async function fn2() {
  return (await now(), value4.cachedTmdbKeys || []);
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
    let value5 = val4[num],
      val5 = url.includes("?") ? "&" : "?",
      val6 = "https://api.themoviedb.org/3/" + url + val5 + "api_key=" + value5;
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
var value5 = val4.__NUVIO_TMDB_UNIFIED_CACHE__;
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
  if (value5.has(val6)) return value5.get(val6);
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
            let value6 = [...result.translations.translations].sort((arg1, arg2) => {
              let fn10 = (arg12) =>
                arg12?.iso_639_1 === "tr" ? 0 : arg12?.iso_639_1 === "en" ? 1 : 2;
              return fn10(arg1) - fn10(arg2);
            });
            for (let value7 of value6) splitOf(list2, value7.data?.name || value7.data?.title);
          }
          let value6 = (
            result.alternative_titles?.results ||
            result.alternative_titles?.titles ||
            []
          )
            .map((arg1) => arg1.title)
            .filter(Boolean);
          for (let value7 of value6) splitOf(list2, value7);
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
            for (let value7 of result.images.posters)
              if (value7.file_path) {
                let replaced2 = String(value7.file_path).replace(/^\//, "");
                (list3.push(replaced2.toLowerCase()), list4.push(replaced2));
              }
          }
          if (Array.isArray(result.images?.backdrops)) {
            for (let value7 of result.images.backdrops)
              if (value7.file_path) {
                let replaced2 = String(value7.file_path).replace(/^\//, "");
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
  return (value5.set(val6, num), num);
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
    value6 = (url2 || "").toLowerCase();
  if (
    (value6.includes("trdual") ||
    value6.includes("dual") ||
    value6.includes("trdub") ||
    value6.includes("dublaj")
      ? ((hasTurkishAudio = !0), (hasOriginalAudio = !0))
      : (value6.includes("ses-tr") ||
          value6.includes("turkcedublaj") ||
          value6.includes("turkce-dublaj")) &&
        (hasTurkishAudio = !0),
    value6.includes("2160p") ||
    value6.includes("4k") ||
    value6.includes("uhd") ||
    value6.includes("-2160.")
      ? (detectedQuality = "4K")
      : value6.includes("1080p") ||
          value6.includes("1920x1080") ||
          value6.includes("fhd") ||
          value6.includes("-1080.")
        ? (detectedQuality = "1080p")
        : value6.includes("720p") ||
            value6.includes("1280x720") ||
            value6.includes("hd") ||
            value6.includes("-720.")
          ? (detectedQuality = "720p")
          : value6.includes("480p") ||
              value6.includes("854x480") ||
              value6.includes("sd") ||
              value6.includes("-480.")
            ? (detectedQuality = "480p")
            : (value6.includes("360p") || value6.includes("640x360") || value6.includes("-360.")) &&
              (detectedQuality = "360p"),
    value6.includes("hevc") || value6.includes("h265") || value6.includes("x265")
      ? (detectedCodec = "HEVC")
      : value6.includes("av1")
        ? (detectedCodec = "AV1")
        : (value6.includes("h264") || value6.includes("x264") || value6.includes("avc")) &&
          (detectedCodec = "H.264"),
    value6.includes("5.1") ||
    value6.includes("eac3") ||
    value6.includes("ac3") ||
    value6.includes("ddp")
      ? (detectedAudio = "Dolby 5.1")
      : (value6.includes("7.1") || value6.includes("atmos")) && (detectedAudio = "Dolby Atmos 7.1"),
    url && typeof url == "string")
  ) {
    let parts = url.split(/\r?\n/),
      num = 0;
    for (let value7 of parts) {
      let trimmed = value7.trim();
      if (trimmed.startsWith("#EXT-X-MEDIA:") && trimmed.includes("TYPE=AUDIO")) {
        let match = trimmed.match(/NAME=["']([^"']+)["']/i),
          match2 = trimmed.match(/LANGUAGE=["']([^"']+)["']/i),
          match3 = trimmed.match(/GROUP-ID=["']([^"']+)["']/i),
          value8 = (match ? match[1] : "").toLowerCase(),
          value9 = (match2 ? match2[1] : "").toLowerCase(),
          value10 = (match3 ? match3[1] : "").toLowerCase(),
          parts2 = value8.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),
          parts3 = value10.split(/[^a-z0-9çğıöşü]+/i).filter(Boolean),
          val5 =
            names2.includes(value9) ||
            names2.some((arg1) => parts2.includes(arg1) || parts3.includes(arg1)) ||
            names.some((arg1) => value8.includes(arg1) || value10.includes(arg1)) ||
            value8.includes("türk") ||
            value8.includes("turk") ||
            value10.includes("dual"),
          val6 =
            names4.includes(value9) ||
            names4.some((arg1) => parts2.includes(arg1) || parts3.includes(arg1)) ||
            names3.some((arg1) => value8.includes(arg1) || value10.includes(arg1)) ||
            value8.includes("orig") ||
            value8.includes("ing") ||
            value8.includes("eng");
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
          let value8 = splitOf3(val6, val5);
          embeddedSubtitles.push({
            label: value8.name || val5,
            url: url,
            lang: value8.code || val6
          });
        }
      }
      if (trimmed.startsWith("#EXT-X-STREAM-INF:")) {
        let match = trimmed.match(/RESOLUTION=(\d+)x(\d+)/i);
        if (match) {
          let num2 = parseInt(match[1], 10),
            num3 = parseInt(match[2], 10),
            value8 = Math.min(num2, num3),
            value9 = Math.max(num2, num3),
            val5 =
              value8 >= 2100 || value9 >= 3800
                ? 2160
                : value8 >= 1400 || value9 >= 2500
                  ? 1440
                  : value8 >= 1000 || value9 >= 1900
                    ? 1080
                    : value8 >= 700 || value9 >= 1200
                      ? 720
                      : value8 >= 450
                        ? 480
                        : value8;
          val5 > num && (num = val5);
        } else {
          let match2 = trimmed.match(/NAME=["']?([^"',\s]+)["']?/i);
          if (match2) {
            let value8 = match2[1].toLowerCase();
            value8.includes("2160") || value8.includes("4k")
              ? 2160 > num && (num = 2160)
              : value8.includes("1440") || value8.includes("2k")
                ? 1440 > num && (num = 1440)
                : value8.includes("1080")
                  ? 1080 > num && (num = 1080)
                  : value8.includes("720") && 720 > num && (num = 720);
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
    (hasTurkishAudio && hasOriginalAudio) || value6.includes("dual") || value6.includes("trdual");
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
function defineProp2(arg1) {
  let {
    hasTurkishAudio: hasTurkishAudio,
    hasOriginalAudio: hasOriginalAudio,
    isDual: isDual,
    hasSubtitles: hasSubtitles,
    hasTurkishSubtitles: hasTurkishSubtitles,
    isYerli: isYerli,
    siteHint: siteHint,
    defaultTitle: defaultTitle
  } = arg1;
  if (isYerli || siteHint?.isYerli) return "Yerli";
  if (siteHint?.label) {
    let value6 = siteHint.label.toLowerCase();
    if (
      (value6.includes("dub") || value6.includes("türk")) &&
      (value6.includes("alt") || value6.includes("sub"))
    )
      return "Dublaj / Altyazılı";
    if (value6.includes("dub") || value6.includes("türkçe ses")) return "Dublaj";
    if (value6.includes("alt") || value6.includes("sub")) return "Altyazılı";
    if (value6.includes("orijinal") || value6.includes("original")) return "Orijinal";
  }
  return isDual || (hasTurkishAudio && (hasOriginalAudio || hasTurkishSubtitles))
    ? "Dublaj / Altyazılı"
    : hasTurkishAudio || siteHint?.isDublaj
      ? "Dublaj"
      : hasTurkishSubtitles || siteHint?.isAltyazi
        ? "Altyazılı"
        : defaultTitle || (hasTurkishAudio ? "Dublaj" : "Orijinal");
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
  let fn10 = (input3) =>
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
    value6 = fn10(input || ""),
    value7 = fn10(input2 || ""),
    val5 =
      !!arg3 ||
      value6.includes("forced") ||
      value7.includes("forced") ||
      value6.includes("zorunlu") ||
      value7.includes("zorunlu"),
    replaced = value6
      .replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g, "")
      .replace(/[-_()[\]]/g, "\x20")
      .trim(),
    replaced2 = value7
      .replace(/\b(forced|zorunlu|narrative|captions|cc|sdh)\b/g, "")
      .replace(/[-_()[\]]/g, "\x20")
      .trim(),
    fn11 = (input3) => {
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
    clientProfile[value6] ||
    clientProfile[value7] ||
    clientProfile[replaced] ||
    clientProfile[replaced2];
  if (!val6) {
    let parts = (replaced2 + "\x20" + replaced).split(/\s+/).filter(Boolean);
    for (let value8 of parts)
      if (clientProfile[value8]) {
        val6 = clientProfile[value8];
        break;
      }
  }
  if (!val6) {
    for (let [value8, value9] of Object.entries(clientProfile))
      if (value8.length >= 4 && (replaced2.includes(value8) || replaced.includes(value8))) {
        val6 = value9;
        break;
      }
  }
  if (val6)
    return {
      code: val6.code,
      iso3: val6.iso3,
      language: val6.language,
      name: fn11(val6.name)
    };
  let trimmed = (input2 || input || "Altyazı").trim();
  trimmed = trimmed
    .replace(/\s*\((?:forced|zorunlu)\)/gi, "")
    .replace(/\s*-\s*(?:forced|zorunlu)/gi, "")
    .trim();
  let language = trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
    name = fn11(language),
    code = value6 && value6.length === 2 ? value6 : value7 && value7.length === 2 ? value7 : "und",
    iso3 = value6 && value6.length === 3 ? value6 : value7 && value7.length === 3 ? value7 : "und";
  return {
    code: code,
    iso3: iso3,
    language: language,
    name: name
  };
}
function fn4(arg1, arg2) {
  let list2 = [],
    set = new Set(),
    list3 = [...(arg1 || []), ...(arg2 || [])];
  for (let value6 of list3) {
    if (!value6 || !value6.url) continue;
    let url = value6.url.trim();
    if (set.has(url)) continue;
    set.add(url);
    let value7 = splitOf3(value6.lang, value6.label || value6.name || value6.language),
      name = value7.name || value6.label || value6.name || "Altyazı";
    list2.push({
      id: String(list2.length),
      url: url,
      label: name,
      name: name,
      language: value7.language,
      lang: value7.code,
      langCode: value7.iso3,
      headers: value6.headers
    });
  }
  return list2;
}
function defineProp3(arg1) {
  let {
      m3u8Text: m3u8Text,
      m3u8Url: m3u8Url,
      externalSubtitles: externalSubtitles,
      siteHint: siteHint,
      defaultTitle: defaultTitle
    } = arg1,
    value6 = buildUrl(m3u8Text, m3u8Url),
    subtitles = fn4(externalSubtitles),
    value7 = fn4(externalSubtitles, value6.embeddedSubtitles),
    hasSubtitles = value7.length > 0 || !!siteHint?.isAltyazi,
    hasTurkishSubtitles = value7.some(
      (arg12) =>
        arg12.lang === "tr" ||
        arg12.lang === "st" ||
        arg12.lang === "sot" ||
        arg12.langCode === "tur" ||
        arg12.langCode === "sot" ||
        arg12.label?.toLowerCase().includes("türk") ||
        arg12.label?.toLowerCase().includes("sotho") ||
        arg12.language === "Turkish" ||
        arg12.language?.toLowerCase().includes("sotho")
    ),
    hasTurkishAudio = value6.hasTurkishAudio || !!siteHint?.isDublaj,
    hasOriginalAudio = value6.hasOriginalAudio,
    isDual = value6.isDual || (hasTurkishAudio && (hasTurkishSubtitles || hasOriginalAudio)),
    languageTitle = defineProp2({
      hasTurkishAudio: hasTurkishAudio,
      hasOriginalAudio: hasOriginalAudio,
      isDual: isDual,
      hasSubtitles: hasSubtitles,
      hasTurkishSubtitles: hasTurkishSubtitles,
      isYerli: siteHint?.isYerli,
      siteHint: siteHint,
      defaultTitle: defaultTitle
    });
  return {
    hasTurkishAudio: hasTurkishAudio,
    hasOriginalAudio: hasOriginalAudio,
    isDual: isDual,
    hasSubtitles: hasSubtitles,
    hasTurkishSubtitles: hasTurkishSubtitles,
    isYerli: siteHint?.isYerli,
    languageTitle: languageTitle,
    subtitles: subtitles,
    detectedQuality: value6.detectedQuality,
    detectedCodec: value6.detectedCodec,
    detectedAudio: value6.detectedAudio
  };
}
function defineProp4(arg1) {
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
        let value6 = (arg12.lang || arg12.code || "").toLowerCase(),
          value7 = (arg12.langCode || arg12.iso3 || "").toLowerCase(),
          value8 = (arg12.name || arg12.label || arg12.title || "").toLowerCase();
        return (
          value6 === "tr" ||
          value6 === "st" ||
          value7 === "tur" ||
          value7 === "sot" ||
          value8.includes("türk") ||
          value8.includes("turk") ||
          value8.includes("sotho")
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
function normalizeCase(arg1) {
  return [...arg1].sort((arg12, arg2) => {
    let val5 =
        (arg12.label || arg12.name || "").toLowerCase().includes("forced") ||
        (arg12.label || arg12.name || "").toLowerCase().includes("zorunlu"),
      val6 =
        (arg2.label || arg2.name || "").toLowerCase().includes("forced") ||
        (arg2.label || arg2.name || "").toLowerCase().includes("zorunlu"),
      val7 =
        arg12.lang === "tr" ||
        arg12.lang === "tur" ||
        arg12.lang === "st" ||
        arg12.langCode === "tur" ||
        arg12.langCode === "sot" ||
        (arg12.label || arg12.name || "").toLowerCase().includes("türk") ||
        (arg12.label || arg12.name || "").toLowerCase().includes("sotho"),
      val8 =
        arg2.lang === "tr" ||
        arg2.lang === "tur" ||
        arg2.lang === "st" ||
        arg2.langCode === "tur" ||
        arg2.langCode === "sot" ||
        (arg2.label || arg2.name || "").toLowerCase().includes("türk") ||
        (arg2.label || arg2.name || "").toLowerCase().includes("sotho");
    if (val7 && val8) return !val5 && val6 ? -1 : val5 && !val6 ? 1 : 0;
    if (val7 && !val8) return -1;
    if (!val7 && val8) return 1;
    let val9 =
        arg12.lang === "en" ||
        arg12.lang === "eng" ||
        arg12.langCode === "eng" ||
        (arg12.label || arg12.name || "").toLowerCase().includes("ing"),
      val10 =
        arg2.lang === "en" ||
        arg2.lang === "eng" ||
        arg2.langCode === "eng" ||
        (arg2.label || arg2.name || "").toLowerCase().includes("ing");
    if (val9 && !val10) return -1;
    if (!val9 && val10) return 1;
    let val11 = arg12.label || arg12.name || arg12.title || "",
      val12 = arg2.label || arg2.name || arg2.title || "";
    return val11.localeCompare(val12, "tr");
  });
}
var userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
function fn5(arg1) {
  try {
    if (typeof AbortSignal < "u" && typeof AbortSignal.timeout == "function")
      return AbortSignal.timeout(arg1);
  } catch {}
}
function replaceIn(arg1) {
  return (arg1 || "")
    .toLowerCase()
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .trim();
}
function splitOf4(tmdbId) {
  let list2 = [],
    set = new Set(),
    fn10 = (arg1) => {
      let trimmed = arg1.trim();
      !trimmed ||
        trimmed.length < 2 ||
        set.has(trimmed) ||
        /[\u0370-\u03FF\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF]/.test(trimmed) ||
        (set.add(trimmed), list2.push(trimmed));
    };
  for (let value6 of tmdbId) {
    if (!value6) continue;
    let trimmed = value6.trim();
    /[,:;!\/\\|~?¿'’‘"`]/i.test(trimmed) || fn10(trimmed);
    let replaced = trimmed
      .replace(/[,:;!\/\\|~?¿'’‘"`\-_.]+/g, "\x20")
      .replace(/\s+/g, "\x20")
      .trim();
    replaced && replaced !== trimmed && fn10(replaced);
    let parts = replaced.split("\x20").filter((input) => input.length > 2);
    parts.length >= 2 &&
      (fn10(parts.join("\x20")), parts.length > 2 && fn10(parts.slice(-2).join("\x20")));
    let parts2 = trimmed
      .split(/[,:;!\/\\|~?¿'’‘"`\-_.]+/)
      .map((input) => input.trim())
      .filter((input) => input.length >= 2);
    for (let value7 of parts2.reverse()) fn10(value7);
  }
  for (let value6 of tmdbId) value6 && fn10(value6);
  return list2;
}
function fn6(arg1, arg2) {
  let list2 = [],
    value6,
    val5 = arg1.flags.includes("g") ? arg1.flags : arg1.flags + "g",
    pattern = new RegExp(arg1.source, val5);
  for (; (value6 = pattern.exec(arg2)) !== null;) list2.push(value6);
  return list2;
}
async function userAgentOf(url, url2) {
  try {
    let response = await fetch(url + "/ajax/posts?q=" + encodeURIComponent(url2), {
      headers: {
        "User-Agent": userAgent,
        "X-Requested-With": "XMLHttpRequest",
        Referer: url + "/"
      },
      signal: fn5(4000)
    });
    if (!response.ok) return [];
    let data = await response.json();
    return data && Array.isArray(data.data) ? data.data : [];
  } catch {
    return [];
  }
}
function _e(input) {
  let set = new Set(),
    value6 = fn6(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, input);
  for (let value7 of value6)
    try {
      let replaced = value7[1].replace(/[\u0000-\u001F\u007F-\u009F]/g, "\x20"),
        parsed = JSON.parse(replaced);
      if (parsed.actor && Array.isArray(parsed.actor)) {
        for (let value8 of parsed.actor)
          value8.name &&
            typeof value8.name == "string" &&
            value8.name.trim() &&
            set.add(value8.name.trim());
      }
    } catch {}
  let value7 = fn6(/<a[^>]*href="[^"]*\/oyuncu\/[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, input);
  for (let value8 of value7) {
    let val5 = value8[1] || "",
      match = val5.match(/<div[^>]*class="[^"]*list-title[^"]*"[^>]*>([^<]+)<\/div>/i);
    if (match && match[1] && match[1].trim()) set.add(match[1].trim());
    else {
      let replaced = val5.replace(/<[^>]+>/g, "").trim();
      replaced && set.add(replaced);
    }
  }
  return Array.from(set);
}
async function userAgentOf2(url, url2, arg3) {
  try {
    let response = await fetch(url.url, {
      headers: {
        "User-Agent": userAgent,
        Referer: arg3 + "/"
      },
      signal: fn5(4500)
    });
    if (!response.ok)
      return {
        verified: !1,
        html: ""
      };
    let html = await response.text(),
      value6 = _e(html)
        .map(replaceIn)
        .filter((arg1) => arg1.length >= 5),
      flag = !1,
      str = "";
    if (url2.cast && url2.cast.length > 0 && value6.length > 0)
      for (let value7 of url2.cast) {
        let value8 = replaceIn(value7);
        if (!(value8.length < 5) && value6.some((arg1) => arg1 === value8)) {
          ((flag = !0), (str = value7));
          break;
        }
      }
    let list2 = [url.name, url.url.split("/").filter(Boolean).pop()?.replace(/-/g, "\x20") || ""],
      match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    match && list2.push(match[1].replace(/<[^>]+>/g, "").trim());
    let value7 = fn6(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi, html);
    for (let value8 of value7)
      try {
        let replaced = value8[1].replace(/[\u0000-\u001F\u007F-\u009F]/g, "\x20"),
          parsed = JSON.parse(replaced);
        parsed.name && typeof parsed.name == "string" && list2.push(parsed.name);
      } catch {}
    let fn10 = (input) =>
        input
          .replace(/(\d+[\s\.-]*sezon|izle|dizi|program|kore|kdrama|altyazılı|dublaj)/gi, "")
          .trim(),
      set = new Set();
    for (let value8 of list2)
      value8 && (set.add(replaceIn(value8)), set.add(replaceIn(fn10(value8))));
    let value8 = (url2.titles || []).map(replaceIn).filter((arg1) => arg1.length >= 2),
      flag2 = !1,
      str2 = "",
      num = 0;
    for (let value9 of set)
      if (!(value9.length < 2)) {
        for (let value10 of value8)
          if (value9 === value10) {
            ((flag2 = !0), (str2 = value9 + " === " + value10), (num = value9.length));
            break;
          }
        if (flag2) break;
      }
    return flag2
      ? num <= 3 && url2.cast && url2.cast.length > 0 && value6.length > 0 && !flag
        ? {
            verified: !1,
            html: html
          }
        : {
            verified: !0,
            html: html,
            reason: "Tam başlık eşleşti: " + str2
          }
      : flag
        ? {
            verified: !0,
            html: html,
            reason: "Oyuncu eşleşti: " + str
          }
        : {
            verified: !1,
            html: html
          };
  } catch {
    return {
      verified: !1,
      html: ""
    };
  }
}
function buildSubtitles(input, arg2) {
  let list2 = [],
    set = new Set(),
    fn10 = (arg1, arg22) => {
      if (!arg1) return;
      let url = arg1.trim();
      if (set.has(url)) return;
      (url.startsWith("//")
        ? (url = "https:" + url)
        : url.startsWith("/") && (url = "" + arg2 + url),
        set.add(url));
      let value6 = splitOf3("", arg22 || url, !1);
      list2.push({
        id: String(list2.length),
        url: url,
        name: value6.name || "Türkçe",
        label: value6.name || "Türkçe",
        title: value6.name || "Türkçe",
        language: value6.language,
        lang: value6.code,
        langCode: value6.iso3,
        format: url.toLowerCase().includes(".srt") ? "srt" : "vtt",
        type: url.toLowerCase().includes(".srt") ? "srt" : "vtt",
        headers: {
          Referer: arg2 + "/",
          "User-Agent": userAgent
        }
      });
    },
    match = input.match(/["']?subtitle["']?\s*:\s*["']([^"']+)["']/i);
  if (match && match[1]) {
    let parts = match[1].trim().split(/,(?=\[|https?:\/\/|\/)/);
    for (let value6 of parts) {
      let trimmed = value6.trim().match(/^(?:\[([^\]]+)\])?\s*(https?:\/\/[^\s,]+|\/[^\s,]+)$/i);
      trimmed && fn10(trimmed[2], trimmed[1] || "");
    }
  }
  let value6 = fn6(/<track[^>]+>/gi, input);
  for (let value7 of value6) {
    let value8 = value7[0],
      match2 = value8.match(/src=["']([^"']+)["']/i),
      match3 = value8.match(/label=["']([^"']+)["']/i);
    match2 && fn10(match2[1], match3 ? match3[1] : "");
  }
  return normalizeCase(list2);
}
async function userAgentOf3(arg1, Referer, url) {
  try {
    let response = await fetch(url + "/ajax/embed", {
      method: "POST",
      headers: {
        "User-Agent": userAgent,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        Referer: Referer
      },
      body: "id=" + encodeURIComponent(arg1),
      signal: fn5(4000)
    });
    if (!response.ok) return null;
    let match = (await response.text()).match(/video\.php\?hash=([a-zA-Z0-9]+)/i);
    if (!match) return null;
    let response2 = await fetch(url + "/video.php?hash=" + match[1], {
      headers: {
        "User-Agent": userAgent,
        Referer: Referer
      },
      signal: fn5(4000)
    });
    if (!response2.ok) return null;
    let match2 = (await response2.text()).match(
      /https?:\/\/(?:www\.)?(?:vidmoly\.[a-z0-9]+)\/embed-([a-zA-Z0-9]+)\.html/i
    );
    if (!match2) return null;
    let Referer2 = match2[0],
      Origin = new URL(Referer2).origin,
      response3 = await fetch(Referer2, {
        headers: {
          "User-Agent": userAgent,
          Referer: Referer
        },
        signal: fn5(4000)
      });
    if (!response3.ok) return null;
    let text2 = await response3.text(),
      streamUrl = null,
      match3 = text2.match(/fetch\(['"](\/dl\?[^'"]+)['"]/);
    if (match3 && match3[1])
      try {
        let response4 = await fetch("" + Origin + match3[1], {
          headers: {
            "User-Agent": userAgent,
            Referer: Referer2,
            Origin: Origin,
            "X-Requested-With": "XMLHttpRequest"
          },
          signal: fn5(4000)
        });
        if (response4.ok) {
          let data = await response4.json();
          data &&
            typeof data.url == "string" &&
            data.url.startsWith("http") &&
            (streamUrl = data.url);
        }
      } catch {}
    if (!streamUrl) {
      let match4 = text2.match(/file\s*:\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i);
      match4 && (streamUrl = match4[1]);
    }
    if (!streamUrl) return null;
    let subtitles = buildSubtitles(text2, Origin);
    return {
      streamUrl: streamUrl,
      headers: {
        "User-Agent": userAgent,
        Referer: Origin + "/",
        Origin: Origin
      },
      subtitles: subtitles
    };
  } catch {
    return null;
  }
}
async function userAgentOf4(arg1, Referer, url) {
  try {
    let response = await fetch(url + "/ajax/embed", {
      method: "POST",
      headers: {
        "User-Agent": userAgent,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        Referer: Referer
      },
      body: "id=" + encodeURIComponent(arg1),
      signal: fn5(4000)
    });
    if (!response.ok) return null;
    let match = (await response.text()).match(/video\.php\?hash=([a-zA-Z0-9]+)/i);
    if (!match) return null;
    let response2 = await fetch(url + "/video.php?hash=" + match[1], {
      headers: {
        "User-Agent": userAgent,
        Referer: Referer
      },
      signal: fn5(4000)
    });
    if (!response2.ok) return null;
    let match2 = (await response2.text()).match(
      /https?:\/\/(?:www\.)?dtpasn\.asia\/video\/([a-zA-Z0-9]+)/i
    );
    if (!match2) return null;
    let value6 = match2[1],
      body = "hash=" + encodeURIComponent(value6) + "&r=" + encodeURIComponent(url + "/"),
      response3 = await fetch(
        "https://dtpasn.asia/player/index.php?data=" + value6 + "&do=getVideo",
        {
          method: "POST",
          headers: {
            "User-Agent": userAgent,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            Referer: "https://dtpasn.asia/video/" + value6,
            Origin: "https://dtpasn.asia"
          },
          body: body,
          signal: fn5(4000)
        }
      );
    if (!response3.ok) return null;
    let data = await response3.json(),
      streamUrl = data?.securedLink || data?.videoSource;
    return !streamUrl || typeof streamUrl != "string" || !streamUrl.startsWith("http")
      ? null
      : {
          streamUrl: streamUrl,
          headers: {
            "User-Agent": userAgent,
            Referer: "https://dtpasn.asia/",
            Origin: "https://dtpasn.asia"
          }
        };
  } catch {
    return null;
  }
}
async function getStreams(tmdbId, type, tmdbId2, tmdbId3) {
  if (typeof tmdbId == "object" && tmdbId !== null) {
    let value6 = tmdbId;
    ((tmdbId =
      value6.id || value6.tmdbId || value6.tmdb_id || value6.imdbId || value6.imdb_id || ""),
      !type && (value6.type || value6.mediaType) && (type = value6.type || value6.mediaType),
      tmdbId2 === void 0 &&
        (value6.season !== void 0 || value6.seasonNum !== void 0) &&
        (tmdbId2 = value6.season ?? value6.seasonNum),
      tmdbId3 === void 0 &&
        (value6.episode !== void 0 || value6.episodeNum !== void 0) &&
        (tmdbId3 = value6.episode ?? value6.episodeNum));
  }
  let now2 = Date.now(),
    replaced = String(tmdbId || "")
      .replace(/^tmdb:/i, "")
      .trim(),
    isTvOrSeries = type === "tv" || type === "series",
    val5 = tmdbId2 !== void 0 ? parseInt(String(tmdbId2), 10) : 1,
    val6 = tmdbId3 !== void 0 ? parseInt(String(tmdbId3), 10) : 1;
  log(
    "Punisher",
    "Tarama Başlatıldı -> TMDB: " +
      replaced +
      ", Tür: " +
      type +
      (isTvOrSeries ? " (S" + val5 + "E" + val6 + ")" : "")
  );
  try {
    let result = await fn("Punisher");
    if (!result) return (log("Punisher", "Domain not resolved", "warn"), []);
    ((result = result.replace(/\/+$/, "")),
      log("Punisher", "[Adım 1/4] TMDB ve Oyuncu bilgileri çözümleniyor (" + replaced + ")..."));
    let result2 = await fn3(replaced, isTvOrSeries ? "tv" : "movie");
    if (!result2 || result2.titles.length === 0)
      return (log("Punisher", "TMDB üzerinden başlık bilgisi alınamadı.", "warn"), []);
    log("Punisher", "[Adım 2/4] Veritabanı taranıyor...");
    let value6 = splitOf4(result2.titles),
      set = new Set(),
      value7 = null,
      str = "";
    for (let value8 of value6.slice(0, 10)) {
      log("Punisher", 'Arama yapılıyor: "' + value8 + '"...');
      let result3 = await userAgentOf(result, value8),
        val7 = /^[a-zA-Z0-9]{2,4}$/.test(value8)
          ? new RegExp("\x5cb" + value8 + "\x5cb", "i")
          : null;
      for (let value9 of result3) {
        if (set.has(value9.id)) continue;
        let val8 =
            value9.type === "Dizi" ||
            value9.type === "Program" ||
            value9.url.includes("/dizi/") ||
            value9.url.includes("/program/"),
          val9 = value9.type === "Film" || value9.url.includes("/film/");
        if (
          (isTvOrSeries ? !val8 : !val9) ||
          (val7 &&
            value9.name &&
            value9.name.toLowerCase().includes(value8.toLowerCase()) &&
            !val7.test(value9.name))
        )
          continue;
        set.add(value9.id);
        let result4 = await userAgentOf2(value9, result2, result);
        if (result4.verified) {
          ((value7 = value9),
            (str = result4.html),
            log(
              "Punisher",
              '[Adım 3/4] İçerik doğrulandı: "' +
                value9.name +
                '" (' +
                (result4.reason || "Doğrulandı") +
                ")"
            ));
          break;
        }
      }
      if (value7) break;
    }
    if (!value7 || !str)
      return (
        log(
          "Punisher",
          "Eşleşen içerik bulunamadı veya doğrulama başarısız oldu (Oyuncu / Başlık eşleşmedi).",
          "warn"
        ),
        []
      );
    let url = value7.url,
      value8 = str;
    if (isTvOrSeries) {
      let pattern = new RegExp(
          'href="([^"]*(?:' + val5 + "-sezon[/-])?" + val6 + '-bolum[^"]*)"',
          "i"
        ),
        match = str.match(pattern),
        value9 = null;
      if (match && match[1]) value9 = match[1];
      else {
        let value10 = fn6(/href="([^"]*bolum[^"]*)"/gi, str);
        for (let value11 of value10) {
          let value12 = value11[1],
            match2 = value12.match(/(\d+)-sezon/i),
            match3 = value12.match(/(\d+)-bolum/i),
            val7 = match2 ? parseInt(match2[1], 10) : 1,
            val8 = match3 ? parseInt(match3[1], 10) : 0;
          if (val7 === val5 && val8 === val6) {
            value9 = value12;
            break;
          }
        }
      }
      if (!value9)
        return (log("Punisher", "Sezon " + val5 + " Bölüm " + val6 + " bulunamadı.", "warn"), []);
      ((url = value9.startsWith("http")
        ? value9
        : "" + result + (value9.startsWith("/") ? "" : "/") + value9),
        log("Punisher", "Bölüm sayfası açılıyor: " + url));
      let response = await fetch(url, {
        headers: {
          "User-Agent": userAgent,
          Referer: value7.url
        },
        signal: fn5(4500)
      });
      if (!response.ok)
        return (log("Punisher", "Bölüm sayfası açılamadı: HTTP " + response.status, "warn"), []);
      value8 = await response.text();
    }
    log("Punisher", "[Adım 4/4] Oynatıcı akışları çözülüyor...");
    let value9 = fn6(
        /<button[^>]*class="[^"]*dropdown-source[^"]*"[^>]*data-embed="([^"]+)"[^>]*>([\s\S]*?)<\/button>/gi,
        value8
      ),
      value10 = null,
      str2 = "Türkçe Altyazı",
      value11 = null,
      str3 = "Türkçe Altyazı";
    for (let value12 of value9) {
      let value13 = value12[1],
        value14 = value12[2],
        match = value14.match(/<span class="name">([^<]+)<\/span>/i),
        match2 = value14.match(/<span class="language">([^<]+)<\/span>/i),
        val7 = match ? match[1].toLowerCase() : "",
        val8 = match2 ? match2[1].trim() : "Türkçe Altyazı";
      (!value10 &&
        (val7.includes("moly") || val7.includes("vidmoly")) &&
        ((value10 = value13), (str2 = val8)),
        !value11 && val7.includes("wdt") && ((value11 = value13), (str3 = val8)));
    }
    if (!value11) {
      let match = value8.match(/data-embed="(\d+)"[^>]*id="videoSource"/i);
      match && (value11 = match[1]);
    }
    let list2 = [];
    if (value10)
      try {
        let result3 = await userAgentOf3(value10, url, result);
        if (result3 && result3.streamUrl) {
          let isDublaj = str2.toLowerCase().includes("dublaj"),
            siteHint = {
              isDublaj: isDublaj,
              isAltyazi: !isDublaj
            },
            value12 = defineProp3({
              m3u8Url: result3.streamUrl,
              externalSubtitles: result3.subtitles,
              siteHint: siteHint
            }),
            details = value12.detectedQuality || "";
          if (!details) {
            let val7 =
              result3.streamUrl.match(/-(\d{3,4})\.mp4/i) || result3.streamUrl.match(/(\d{3,4})p/i);
            val7 && (details = val7[1] + "p");
          }
          (details || (details = "HD"),
            !details.includes("p") &&
              !details.includes("K") &&
              !details.includes("k") &&
              details !== "HD" &&
              (details = details + "p"));
          let languageTitle = isDublaj ? "Dublaj" : "Altyazılı";
          list2.push(
            defineProp4({
              name: "Mihawk [1]",
              url: result3.streamUrl,
              languageTitle: languageTitle,
              quality: details,
              details: details,
              format: "m3u8",
              headers: result3.headers,
              subtitles: value12.subtitles
            })
          );
        }
      } catch (err) {
        log("Punisher", "VidMoly çözme hatası: " + (err?.message || err), "warn");
      }
    if (value11)
      try {
        let result3 = await userAgentOf4(value11, url, result);
        if (result3 && result3.streamUrl) {
          let isDublaj = str3.toLowerCase().includes("dublaj"),
            siteHint = {
              isDublaj: isDublaj,
              isAltyazi: !isDublaj
            },
            details =
              defineProp3({
                m3u8Url: result3.streamUrl,
                siteHint: siteHint
              }).detectedQuality || "";
          if (!details) {
            let val7 =
              result3.streamUrl.match(/-(\d{3,4})\.mp4/i) || result3.streamUrl.match(/(\d{3,4})p/i);
            val7 && (details = val7[1] + "p");
          }
          (details || (details = "HD"),
            !details.includes("p") &&
              !details.includes("K") &&
              !details.includes("k") &&
              details !== "HD" &&
              (details = details + "p"));
          let languageTitle = isDublaj ? "Dublaj" : "Altyazılı";
          list2.push(
            defineProp4({
              name: "Mihawk [2]",
              url: result3.streamUrl,
              languageTitle: languageTitle,
              quality: details,
              details: details,
              format: "m3u8",
              headers: result3.headers
            })
          );
        }
      } catch (err) {
        log("Punisher", "WDT çözme hatası: " + (err?.message || err), "warn");
      }
    if (
      (list2.length > 1
        ? list2.forEach((arg1, arg2) => {
            arg1.name = "Mihawk [" + (arg2 + 1) + "]";
          })
        : list2.length === 1 && (list2[0].name = "Punisher"),
      list2.length === 0)
    )
      return (log("Punisher", "Akış linkleri çözülemedi.", "warn"), []);
    let now3 = ((Date.now() - now2) / 1000).toFixed(2);
    return (
      log(
        "Punisher",
        "TAMAMLANDI: " + list2.length + " akış hazırlandı (" + now3 + "s)",
        "success",
        list2.map((arg1) => ({
          server: arg1.name,
          title: arg1.title,
          quality: arg1.quality,
          format: arg1.format
        }))
      ),
      list2
    );
  } catch (err) {
    return (log("Punisher", "Kritik hata: " + (err?.message || err), "error"), []);
  }
}
(typeof globalThis < "u" && (globalThis.getStreams = getStreams),
  typeof global < "u" && (global.getStreams = getStreams),
  typeof window < "u" && (window.getStreams = getStreams));
var obj3 = {
    getStreams: getStreams
  },
  _exp = typeof module !== "undefined" && module.exports ? module.exports : {},
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
