/* ==========================================================
 * ÇEKİRDEK — çözülmüş sağlayıcı (dokunulmadı)
 * Arayüz adı: ../kayit.js içindeki kahraman kodu
 * Yayın alan adı: ../alanlar.js sabit haritasından gelir.
 * ========================================================== */
/* ============================================================
 * imu.js
 * çözülen string: 657, üye erişimi: 475, silinen bootstrap: 40
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
      var fn4 = function () {
        if (_timers[value]) {
          delete _timers[value];
          try {
            arg1();
          } catch (err) {}
        }
      };
      if (typeof queueMicrotask === "function") queueMicrotask(fn4);
      else typeof Promise !== "undefined" ? Promise.resolve().then(fn4) : fn4();
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
  fn4 = (arg1, arg2) => {
    for (var value4 in arg2)
      defineProp(arg1, value4, {
        get: arg2[value4],
        enumerable: !0
      });
  },
  fn5 = (arg1, arg2, arg3, arg4) => {
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
  fn6 = (arg1) =>
    fn5(
      defineProp({}, "__esModule", {
        value: !0
      }),
      arg1
    ),
  obj = {};
(fn4(obj, {
  getStreams: () => getStreams
}),
  (module.exports = fn6(obj)));
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
              let fn7 = (arg12) =>
                arg12?.iso_639_1 === "tr" ? 0 : arg12?.iso_639_1 === "en" ? 1 : 2;
              return fn7(arg1) - fn7(arg2);
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
async function replaceIn(tmdbId, arg2) {
  let replaced = String(tmdbId || "")
    .replace(/^tmdb:/i, "")
    .trim();
  return replaced
    ? replaced.startsWith("tt")
      ? replaced
      : (await splitOf2(replaced, arg2)).imdbId
    : null;
}
function splitOf3(tmdbId2, tmdbId3, tmdbId4, tmdbId5) {
  let value6 = tmdbId2,
    value7 = tmdbId3,
    value8 = tmdbId4,
    value9 = tmdbId5;
  typeof tmdbId2 == "object" &&
    tmdbId2 !== null &&
    !Array.isArray(tmdbId2) &&
    ((value6 = tmdbId2.id || tmdbId2.tmdbId || tmdbId2.rawTmdbId || tmdbId2.imdbId || ""),
    (value7 = tmdbId2.type || tmdbId2.mediaType || tmdbId2.rawMediaType),
    (value8 = tmdbId2.season ?? tmdbId2.seasonNum ?? tmdbId2.rawSeasonNum),
    (value9 = tmdbId2.episode ?? tmdbId2.episodeNum ?? tmdbId2.rawEpisodeNum));
  let trimmed = String(value6 || "").trim();
  trimmed.toLowerCase().startsWith("tmdb:") && (trimmed = trimmed.slice(5));
  let parts = trimmed.split(":");
  parts[0] === "series" || parts[0] === "tv" || parts[0] === "show" || parts[0] === "dizi"
    ? (parts.shift(), (value7 = "tv"))
    : (parts[0] === "movie" || parts[0] === "film") && (parts.shift(), (value7 = "movie"));
  let tmdbId = parts[0].trim();
  if (parts.length >= 3) {
    let num = parseInt(parts[1], 10),
      num2 = parseInt(parts[2], 10);
    (isNaN(num) || (value8 = num), isNaN(num2) || (value9 = num2));
  }
  let trimmed2 = String(value7 || "")
      .toLowerCase()
      .trim(),
    isTv = trimmed2 === "tv" || trimmed2 === "series" || trimmed2 === "show" || trimmed2 === "dizi",
    mediaType = isTv ? "tv" : "movie",
    val5 = value8 != null && value8 !== "" ? parseInt(String(value8), 10) : 1,
    val6 = value9 != null && value9 !== "" ? parseInt(String(value9), 10) : 1;
  return {
    tmdbId: tmdbId,
    mediaType: mediaType,
    isTv: isTv,
    season: isNaN(val5) ? 1 : val5,
    episode: isNaN(val6) ? 1 : val6,
    startTime: Date.now()
  };
}
async function fn3(arg1, arg2, arg3) {
  let trimmed = String(arg1 || "").trim();
  if (trimmed.startsWith("tt")) return trimmed;
  let result = await replaceIn(trimmed, arg2);
  return !result || !result.startsWith("tt")
    ? (log(arg3, "Geçerli bir IMDb ID (tt...) bulunamadı (" + arg1 + ").", "warn"), null)
    : result;
}
function matchOf(tmdbId) {
  let flag = !1,
    flag2 = !1,
    flag3 = !1,
    names = ["türkçe", "turkish", "turkce", "dublaj", "tr", "tur", "dual", "ses-tr"],
    names2 = ["english", "ingilizce", "original", "orijinal", "en", "eng"];
  if (tmdbId) {
    let parts = tmdbId.split(/\r?\n/);
    for (let value6 of parts) {
      let trimmed = value6.trim();
      if (trimmed.startsWith("#EXT-X-MEDIA:") && trimmed.includes("TYPE=AUDIO")) {
        let match = trimmed.match(/NAME=["']([^"']+)["']/i),
          match2 = trimmed.match(/LANGUAGE=["']([^"']+)["']/i),
          match3 = trimmed.match(/GROUP-ID=["']([^"']+)["']/i),
          value7 = (match ? match[1] : "").toLowerCase(),
          value8 = (match2 ? match2[1] : "").toLowerCase(),
          value9 = (match3 ? match3[1] : "").toLowerCase();
        (names.some((arg1) => value7.includes(arg1) || value8 === arg1 || value9.includes(arg1)) &&
          (flag = !0),
          names2.some(
            (arg1) => value7.includes(arg1) || value8 === arg1 || value9.includes(arg1)
          ) && (flag2 = !0));
      }
      if (trimmed.startsWith("#EXT-X-MEDIA:") && trimmed.includes("TYPE=SUBTITLES")) {
        let match = trimmed.match(/NAME=["']([^"']+)["']/i),
          match2 = trimmed.match(/LANGUAGE=["']([^"']+)["']/i),
          value7 = (match ? match[1] : "").toLowerCase(),
          value8 = (match2 ? match2[1] : "").toLowerCase();
        (value8 === "tr" ||
          value8 === "tur" ||
          value8 === "st" ||
          value8 === "sot" ||
          value7.includes("türk") ||
          value7.includes("sotho")) &&
          (flag3 = !0);
      }
    }
  }
  return (flag && flag2) || (flag && flag3)
    ? "Dublaj / Altyazılı"
    : flag
      ? "Dublaj"
      : flag3
        ? "Altyazılı"
        : "Orijinal";
}
/* ── dublaj kanıt katmanı (2026-10-30) ─────────────────────────────────────
 * matchOf() master'daki EXT-X-MEDIA satırlarını zaten okuyor. Buradaki iki
 * yardımcı "· Türkçe Dublaj" etiketinin YALNIZ kanıtla basılmasını garantiye
 * alır:
 *   ① trSesIziVar(): master TYPE=AUDIO satırında LANGUAGE="tr|tur" veya
 *      NAME'de Türk/türkçe/dublaj izi → kanıt satırının kendisi döner.
 *   ② muxedTrSesKaniti(): master'da hiç AUDIO bildirimi yoksa ses MUX'ludur;
 *      ilk varyantın ilk segmanı indirilir (Range 0-256KB) ve MPEG-TS PAT/PMT
 *      dil tanımlayıcısı (0x0A, ISO-639-2) okunur — dublajKestirme.js Katman 2
 *      deseni. Dil okunamazsa kanıt YOK sayılır; etiket uydurulmaz. */
function trSesIziVar(metin) {
  for (const ham of String(metin || "").split(/\r?\n/)) {
    const satir = ham.trim();
    if (!satir.startsWith("#EXT-X-MEDIA:") || !/TYPE=AUDIO/i.test(satir)) continue;
    const lang = ((satir.match(/LANGUAGE="?([A-Za-z-]+)"?/i) || [])[1] || "").toLowerCase();
    const isim = ((satir.match(/NAME="([^"]*)"/i) || satir.match(/NAME=([^,]+)/i) || [])[1] || "").toLowerCase();
    if (lang === "tr" || lang === "tur" || /türk|turk|dublaj/i.test(isim)) return satir.slice(0, 160);
  }
  return "";
}
function tsSesDilleri(baytlar) {
  const b = baytlar instanceof Uint8Array ? baytlar : new Uint8Array(baytlar);
  const sesTipleri = { 3: 1, 4: 1, 6: 1, 15: 1, 129: 1, 131: 1, 132: 1, 135: 1, 144: 1, 145: 1, 146: 1, 161: 1, 172: 1, 209: 1 };
  const diller = new Set();
  let senkron = -1;
  for (let i = 0; i < 188 && i + 188 <= b.length; i++) if (b[i] === 0x47) { senkron = i; break; }
  if (senkron < 0) return diller;
  const pmtPidler = new Set();
  const bit = (o) => (o + 1 < b.length ? (b[o] << 8) | b[o + 1] : -1);
  for (let i = senkron; i + 188 <= b.length; i += 188) {
    if (b[i] !== 0x47) continue;
    const pid = ((b[i + 1] & 0x1f) << 8) | b[i + 2];
    if (!(b[i + 1] & 0x40)) continue;
    const afc = (b[i + 3] >> 4) & 3;
    if (afc === 0 || afc === 2) continue;
    let p = i + 4;
    if (afc === 3) p += 1 + b[p];
    if (p >= i + 188) continue;
    p += 1 + b[p];
    if (p >= i + 188) continue;
    if (pid === 0 && b[p] === 0x00) {
      const boy = bit(p + 1) & 0xfff, son = Math.min(p + 3 + boy, i + 188 - 4);
      for (let q = p + 6; q + 4 <= son; q += 4) if (bit(q) !== 0) pmtPidler.add(bit(q + 2) & 0x1fff);
    } else if (pmtPidler.has(pid) && b[p] === 0x02) {
      const boy = bit(p + 1) & 0xfff, son = Math.min(p + 3 + boy, i + 188);
      let q = p + 9 + (bit(p + 7) & 0xfff);
      while (q + 5 <= son) {
        const tur = b[q], eil = bit(q + 3) & 0xfff;
        if (sesTipleri[tur]) {
          let d = q + 5;
          const dSon = Math.min(d + eil, son);
          while (d + 2 <= dSon) {
            if (b[d] === 0x0a && d + 5 <= dSon) diller.add(String.fromCharCode(b[d + 2], b[d + 3], b[d + 4]).toLowerCase());
            d += 2 + b[d + 1];
          }
        }
        q += 5 + eil;
      }
    }
  }
  return diller;
}
async function muxedTrSesKaniti(masterMetin, headers) {
  const zamanAsimiMs = (ms) => (typeof AbortSignal < "u" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(ms) : void 0);
  try {
    const varyant = String(masterMetin || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean).find((s) => !s.startsWith("#"));
    if (!varyant) return "";
    let hedef = varyant;
    try { hedef = new URL(varyant, String(arguments[2] || varyant)).toString(); } catch {}
    const y1 = await fetch(hedef, { headers: headers, signal: zamanAsimiMs(7000) });
    if (!y1.ok) return "";
    const metin = await y1.text();
    let segAdres = hedef;
    if (/#EXTM3U/i.test(metin)) {
      const seg = metin.split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#"))[0];
      if (!seg) return "";
      try { segAdres = new URL(seg, hedef).toString(); } catch { segAdres = seg; }
    }
    const y2 = await fetch(segAdres, {
      headers: Object.assign({}, headers, { Range: "bytes=0-262143" }),
      signal: zamanAsimiMs(9000),
    });
    if (!y2.ok) return "";
    const baytlar = new Uint8Array(await y2.arrayBuffer());
    let diller = tsSesDilleri(baytlar);
    if ((!diller || diller.size === 0) && baytlar.length > 2048) {
      for (let ofset = 0; ofset < 188 * 12; ofset++) {
        if (baytlar[ofset] === 0x47 && baytlar[ofset + 188] === 0x47) {
          diller = tsSesDilleri(baytlar.subarray(ofset));
          if (diller && diller.size) break;
        }
      }
    }
    if (diller.has("tr") || diller.has("tur")) return "TS-PMT ses dili: " + Array.from(diller).join(",");
    return "";
  } catch {
    return "";
  }
}
async function getStreams(tmdbId2, tmdbId3, tmdbId4, tmdbId5) {

  let {
    tmdbId: tmdbId,
    mediaType: mediaType,
    isTv: isTv,
    season: season,
    episode: episode,
    startTime: startTime
  } = splitOf3(tmdbId2, tmdbId3, tmdbId4, tmdbId5);
  log(
    "Spider-Man",
    "Tarama Başlatıldı -> TMDB: " +
      tmdbId +
      ", Tür: " +
      mediaType +
      ", Sezon: " +
      season +
      ", Bölüm: " +
      episode
  );
  try {
    if (!tmdbId) return [];
    let result = await fn3(tmdbId, mediaType, "Spider-Man");
    if (!result) return [];
    let result2 = (await fn("Spider-Man") || await fn("imu"));
    if (!result2) return (log("Spider-Man", "Sağlayıcı adresi alınamadı.", "warn"), []);
    let url = "";
    if (isTv) {
      let value6 = episode.toString().padStart(2, "0");
      url = result2 + "/vs/" + result + "/s" + season + "/e" + value6;
    } else url = result2 + "/vs/" + result;
    log("Spider-Man", "[Adım 2/3] Akış sunucusu kontrol ediliyor...");
    let Referer = result2.includes("vixolity.com") ? "https://pl.vixolity.com/" : result2 + "/",
      Origin = result2.includes("vixolity.com") ? "https://pl.vixolity.com" : result2,
      headers = {
        Referer: Referer,
        Origin: Origin,
        "User-Agent": obj2.DEFAULT_USER_AGENT
      },
      str = "";
    try {
      let response = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!response.ok && response.status !== 200)
        return (
          log("Spider-Man", "Sunucuda bu içerik mevcut değil (HTTP " + response.status + ").", "warn"),
          []
        );
      str = await response.text();
    } catch (err) {
      return (log("Spider-Man", "Bağlantı kontrolü geçilemedi: " + err.message, "warn"), []);
    }
    if (!str || !str.includes("#EXTM3U"))
      return (log("Spider-Man", "Geçerli bir HLS akışı bulunamadı.", "warn"), []);
    let title = matchOf(str),
      sesKaniti = trSesIziVar(str);
    // Master ses izi bildirmiyorsa ses mux'ludur: ilk segmanın TS PMT dil
    // tanımlayıcısına bak (yalnız kanıt varsa "Türkçe Dublaj" etiketi basılır).
    if (!sesKaniti && !/#EXT-X-MEDIA:[^\n]*TYPE=AUDIO/i.test(str))
      sesKaniti = await muxedTrSesKaniti(str, headers, url);
    if (sesKaniti && !/Dublaj/i.test(title))
      title = (/^(Orijinal)$/i.test(title) ? "" : title + " \xb7 ") + "T\xfcrk\xe7e Dublaj";
    let now2 = ((Date.now() - startTime) / 1000).toFixed(2);
    if (sesKaniti) log("Spider-Man", "T\xfcrk\xe7e ses kanıtı: " + sesKaniti, "info");

    return (
      log("Spider-Man", "[Adım 3/3] Imu akışı hazır! (" + now2 + "s)", "success", {
        dil: title
      }),
      [
        {
          name: "Spider-Man",
          title: title,
          description: title + "\n1080p • HLS",
          url: url,
          quality: "1080p • " + title,
          format: "m3u8",
          headers: headers,
          ...(sesKaniti
            ? { diller: ["tr"], trSes: !0, dilDurumu: "dublaj", dilKaniti: sesKaniti }
            : {})
        }
      ]
    );
  } catch (err) {
    return (log("Spider-Man", "Hata: " + err.message, "error"), []);
  }
}
typeof globalThis < "u" && (globalThis.getStreams = getStreams);
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
