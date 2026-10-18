/* ==========================================================
 * ÇEKİRDEK — çözülmüş sağlayıcı (dokunulmadı)
 * Arayüz adı: ../kayit.js içindeki kahraman kodu
 * Yayın alan adı: ../alanlar.js sabit haritasından gelir.
 * ========================================================== */
/* ============================================================
 * turkdizi.js
 * çözülen string: 395, üye erişimi: 247, silinen bootstrap: 28
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
      var fn = function () {
        if (_timers[value]) {
          delete _timers[value];
          try {
            arg1();
          } catch (err) {}
        }
      };
      if (typeof queueMicrotask === "function") queueMicrotask(fn);
      else typeof Promise !== "undefined" ? Promise.resolve().then(fn) : fn();
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
  fn = (arg1, arg2) => {
    for (var value4 in arg2)
      defineProp(arg1, value4, {
        get: arg2[value4],
        enumerable: !0
      });
  },
  _ = (arg1, arg2, arg3, arg4) => {
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
  fn2 = (arg1) =>
    _(
      defineProp({}, "__esModule", {
        value: !0
      }),
      arg1
    ),
  obj = {};
(fn(obj, {
  getStreams: () => getStreams
}),
  (module.exports = fn2(obj)));
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
var list = [
    xorDecode([
      66, 94, 94, 90, 89, 16, 5, 5, 83, 69, 95, 94, 95, 72, 79, 4, 67, 80, 70, 79, 70, 75, 68, 4,
      73, 69, 71
    ]),
    xorDecode([
      66, 94, 94, 90, 89, 16, 5, 5, 94, 95, 88, 65, 78, 67, 80, 67, 4, 75, 83, 88, 95, 65, 67, 4,
      93, 69, 88, 65, 79, 88, 89, 4, 78, 79, 92
    ])
  ],
  text = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
  apiKey = text,
  visitorData = "",
  num = 0;
async function fetchYouTubeSession(videoId) {
  let now = Date.now();
  if (now - num < 30 * 60 * 1000 && visitorData)
    return {
      apiKey: apiKey,
      visitorData: visitorData
    };
  try {
    let val = "https://www.youtube.com/watch?v=" + videoId + "&hl=en",
      response = await fetch(val, {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 12; Android TV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
        }
      });
    if (response.ok) {
      let text2 = await response.text(),
        match = text2.match(/"INNERTUBE_API_KEY":"([^"]+)"/),
        match2 = text2.match(/"VISITOR_DATA":"([^"]+)"/);
      (match && match[1] && (apiKey = match[1]),
        match2 && match2[1] && (visitorData = match2[1]),
        (num = now));
    }
  } catch (err) {
    log("Scarlet-Witch", "Watch page config fetch error: " + (err?.message || err));
  }
  return {
    apiKey: apiKey,
    visitorData: visitorData
  };
}
var items = [
  {
    name: "visionos",
    id: "101",
    ver: "1.02",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
    client: {
      clientName: "VISIONOS",
      clientVersion: "1.02",
      deviceMake: "Apple",
      deviceModel: "RealityDevice17,1",
      osName: "visionOS",
      osVersion: "26.5.23O471",
      hl: "en",
      gl: "US"
    }
  },
  {
    name: "ios",
    id: "5",
    ver: "20.10.1",
    ua: "com.google.ios.youtube/20.10.1 (iPhone16,2; U; CPU iOS 17_4 like Mac OS X)",
    client: {
      clientName: "IOS",
      clientVersion: "20.10.1",
      deviceModel: "iPhone16,2",
      osName: "iPhone",
      osVersion: "17.4.0.21E219",
      platform: "MOBILE",
      hl: "en",
      gl: "US"
    }
  },
  {
    name: "android",
    id: "3",
    ver: "20.10.35",
    ua: "com.google.android.youtube/20.10.35 (Linux; U; Android 14; en_US) gzip",
    client: {
      clientName: "ANDROID",
      clientVersion: "20.10.35",
      osName: "Android",
      osVersion: "14",
      platform: "MOBILE",
      androidSdkVersion: 34,
      hl: "en",
      gl: "US"
    }
  }
];
async function fetchStreamFormats(videoId, arg2) {
  let { apiKey: apiKey2, visitorData: visitorData2 } = await fetchYouTubeSession(videoId),
    val =
      "https://www.youtube.com/youtubei/v1/player?key=" +
      encodeURIComponent(apiKey2) +
      "&prettyPrint=false",
    list2 = [],
    value4 = null;
  for (let value5 of items)
    try {
      let headers = {
        "Content-Type": "application/json",
        Origin: "https://www.youtube.com",
        "User-Agent": value5.ua,
        "X-YouTube-Client-Name": value5.id,
        "X-YouTube-Client-Version": value5.ver
      };
      visitorData2 && (headers["X-Goog-Visitor-Id"] = visitorData2);
      let response = await fetch(val, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          videoId: videoId,
          contentCheckOk: !0,
          racyCheckOk: !0,
          context: {
            client: value5.client
          },
          playbackContext: {
            contentPlaybackContext: {
              html5Preference: "HTML5_PREF_WANTS"
            }
          }
        })
      });
      if (!response.ok) continue;
      let data = await response.json();
      if (data.playabilityStatus?.status !== "OK") continue;
      if (data.streamingData?.hlsManifestUrl) {
        let quality = "1080p",
          val2 = data.streamingData?.adaptiveFormats || [];
        for (let num2 = 0; num2 < val2.length; num2++) {
          let value6 = val2[num2]?.qualityLabel;
          if (value6) {
            if (value6.includes("2160p") || value6.includes("4K")) {
              quality = "4K";
              break;
            }
            ((value6.includes("1440p") || value6.includes("2K")) &&
              quality !== "4K" &&
              (quality = "1440p"),
              value6.includes("1080p") &&
                quality !== "4K" &&
                quality !== "1440p" &&
                (quality = "1080p"),
              value6.includes("720p") &&
                quality !== "4K" &&
                quality !== "1440p" &&
                quality !== "1080p" &&
                (quality = "720p"));
          }
        }
        list2.push({
          name: "Scarlet-Witch",
          title: "YouTube " + quality,
          url: data.streamingData.hlsManifestUrl,
          quality: quality,
          format: "m3u8",
          type: "hls",
          headers: {
            "User-Agent": value5.ua
          }
        });
        break;
      }
      if (!value4) {
        let val2 = data.streamingData?.formats || [],
          value6 = null;
        for (let num2 = 0; num2 < val2.length; num2++) {
          let value7 = val2[num2];
          value7.url &&
            (!value6 || (value7.bitrate && value7.bitrate > (value6.bitrate || 0))) &&
            (value6 = value7);
        }
        if (value6 && value6.url) {
          let quality = value6.qualityLabel || "360p";
          value4 = {
            name: "Scarlet-Witch",
            title: "YouTube " + quality,
            url: value6.url,
            quality: quality,
            format: "mp4",
            type: "mp4",
            headers: {
              "User-Agent": value5.ua
            }
          };
        }
      }
    } catch (err) {
      log("Scarlet-Witch", "Client " + value5.name + " failed: " + (err?.message || err));
    }
  return (list2.length === 0 && value4 && list2.push(value4), list2);
}
async function fetchJson(url) {
  for (let value4 of list)
    try {
      let response = await fetch("" + value4 + url, {
        signal:
          typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
            ? AbortSignal.timeout(8000)
            : void 0
      });
      if (response.ok) return await response.json();
    } catch {}
  return null;
}
async function getStreams(tmdbId, type, season, episode) {
  let isSeriesOrTv = type === "series" || type === "tv",
    isMovie = type === "movie";
  if (!isSeriesOrTv && !isMovie) return [];
  let replaced = String(tmdbId).replace("tmdb:", "").trim();
  if (isMovie) {
    log("Scarlet-Witch", "Film İsteği: tmdbId=" + replaced);
    try {
      let result = await fetchJson("/movie/" + replaced);
      if (result && result.found && result.videoId)
        return (
          log(
            "Scarlet-Witch",
            "Film eşleşmesi bulundu: " + result.title + "\x20(" + result.videoId + ")"
          ),
          await fetchStreamFormats(result.videoId, result.title)
        );
    } catch (err) {
      log("Scarlet-Witch", "Film mapping worker kontrol hatası: " + (err?.message || err));
    }
    return [];
  }
  let numValue = Number(season) || 1,
    numValue2 = Number(episode) || 1;
  log("Scarlet-Witch", "İstek: tmdbId=" + replaced + ", S=" + numValue + ", E=" + numValue2);
  try {
    let result = await fetchJson("/" + replaced + "/" + numValue + "/" + numValue2);
    if (result && result.found && result.videoId)
      return (
        log("Scarlet-Witch", "Eşleşme bulundu: " + result.title + "\x20(" + result.videoId + ")"),
        await fetchStreamFormats(result.videoId, result.title)
      );
  } catch (err) {
    log("Scarlet-Witch", "Mapping worker kontrol hatası: " + (err?.message || err));
  }
  return [];
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
