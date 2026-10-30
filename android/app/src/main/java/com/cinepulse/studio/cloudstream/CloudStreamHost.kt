package com.cinepulse.studio.cloudstream

import android.content.Context
import android.util.Log
import com.lagradost.api.setContext
import com.lagradost.cloudstream3.APIHolder
import com.lagradost.cloudstream3.AnimeLoadResponse
import com.lagradost.cloudstream3.CloudStreamApp
import com.lagradost.cloudstream3.Episode
import com.lagradost.cloudstream3.LiveStreamLoadResponse
import com.lagradost.cloudstream3.LoadResponse
import com.lagradost.cloudstream3.MainAPI
import com.lagradost.cloudstream3.MainPageRequest
import com.lagradost.cloudstream3.MovieLoadResponse
import com.lagradost.cloudstream3.SearchResponse
import com.lagradost.cloudstream3.SubtitleFile
import com.lagradost.cloudstream3.TvSeriesLoadResponse
import com.lagradost.cloudstream3.plugins.BasePlugin
import com.lagradost.cloudstream3.plugins.Plugin
import com.lagradost.cloudstream3.utils.ExtractorLink
import dalvik.system.DexClassLoader
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.lang.ref.WeakReference
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.util.zip.ZipFile

/**
 * CLOUDSTREAM3 EKLENTİ KONAĞI (kullanıcı 2026-10-29).
 *
 * CloudStream3'ün plugin formatı (resmî APK eklentiler ve .cs3 paketi =
 * zip içinde classes.dex + manifest.json) cihazda DexClassLoader ile yüklenir.
 * Eklentilerin link-time referans verdiği com.lagradost.cloudstream3.* API'si
 * app/cloudstreamApi/kotlin altında vendor edilen cloudstream v4.8.0 `library`
 * kaynaklarından gelir — yani plugin dex'i ile aynı FQN/imza seti host dex'inde
 * bulunur (binary uyumun tek yolu budur; birebir uyum cloudstream sürüm
 * etiketine bağlıdır, v4.8.0 dışı derlenmiş plugin'ler üye eksikliği verebilir).
 *
 * Keşif sırası: (1) zip içi manifest.json pluginClassName (WioSinema ve benzeri
 * .cs3 formatları), (2) dex class_defs taraması — BasePlugin/MainAPI alt sınıfları.
 * BasePlugin alt sınıfı bulunursa load() çağrılır ve APIHolder'a kaydettiği
 * MainAPI örnekleri (sourcePlugin == dosya yolu) bu eklentiye ait sayılır.
 *
 * Tüm kamu metotları hata durumunda {ok:false,...} JSON döner; NoClassDefFoundError
 * gibi bağlantı hatalarında eksik FQN mesaj içinde raporlanır (D3 tanılama kuralı).
 */
class CloudStreamHost(private val appContext: Context) {

    companion object { private const val TAG = "CinePulseCloudStream" }

    class YuklenenEklenti(
        val id: String,
        val dosya: File,
        val loader: DexClassLoader,
        val pluginSinifi: String?,
        val ad: String,
        val saglayicilar: MutableList<MainAPI> = mutableListOf(),
        var pluginOrnegi: Any? = null,
    )

    private val pluginsDir: File by lazy {
        File(appContext.filesDir, "cloudstream/plugins").apply { mkdirs() }
    }
    private val optDir: File by lazy {
        File(appContext.filesDir, "cloudstream/odex").apply { mkdirs() }
    }
    private val yukluler = LinkedHashMap<String, YuklenenEklenti>()
    private var hazir = false

    private fun ensureInit() {
        if (hazir) return
        hazir = true
        try {
            CloudStreamApp.hostContext = appContext
            setContext(WeakReference(appContext))
        } catch (t: Throwable) {
            Log.w(TAG, "konak başlatılamadı", t)
        }
    }

    // ---------------------------------------------------------------- indirme

    private fun indir(url: String, hedef: File) {
        var baglantiUrl = url
        repeat(6) {
            val baglanti = URL(baglantiUrl).openConnection() as HttpURLConnection
            baglanti.instanceFollowRedirects = false
            baglanti.connectTimeout = 20_000
            baglanti.readTimeout = 40_000
            baglanti.setRequestProperty(
                "User-Agent",
                "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 CinePulse/1.0"
            )
            val kod = baglanti.responseCode
            if (kod in 300..399) {
                val yon = baglanti.getHeaderField("Location") ?: error("yönlendirme hedefi yok")
                baglantiUrl = if (yon.startsWith("/")) URL(URL(baglantiUrl), yon).toString() else yon
                baglanti.disconnect()
                return@repeat
            }
            require(kod == 200) { "HTTP $kod: $baglantiUrl" }
            baglanti.inputStream.use { girdi ->
                FileOutputStream(hedef).use { hedefAcik -> girdi.copyTo(hedefAcik) }
            }
            baglanti.disconnect()
            return
        }
        error("çok fazla yönlendirme: $url")
    }

    private fun sha1kisa(b: ByteArray): String =
        MessageDigest.getInstance("SHA-1").digest(b).joinToString("") { "%02x".format(it) }.substring(0, 12)

    // ------------------------------------------------------------ dex tarama

    /** Yüklenebilir, salt-okunur bir dex kaynağı üretir: zip'ten (apk/cs3) classes.dex
     *  dışa çıkarılır; ham dex olduğu gibi kullanılır. Kaynak: W^X (Android 10+) ve
     *  Android 7'de zip içi sıkışık dex'in mmap edilememesi (kullanıcı 2026-10-29). */
    private fun dexDosyasiHazirla(dosya: File, id: String): File {
        try {
            ZipFile(dosya).use { zip ->
                val girdi = zip.getEntry("classes.dex") ?: return@use
                val cikti = File(pluginsDir, "$id.dex")
                if (cikti.exists()) cikti.delete()
                zip.getInputStream(girdi).use { g -> FileOutputStream(cikti).use { c -> g.copyTo(c) } }
                cikti.setReadOnly()
                return cikti
            }
        } catch (_: Exception) { /* zip değil */ }
        if (!dosya.canWrite() || dosya.setReadOnly()) return dosya
        return dosya
    }

    /** classes.dex'in class_defs tablosundan sınıf adlarını (MUTF-8) listeler. */
    private fun dexSinifAdlari(dex: ByteArray): List<String> {
        fun u32(off: Int) =
            (dex[off].toInt() and 0xff) or ((dex[off + 1].toInt() and 0xff) shl 8) or
                ((dex[off + 2].toInt() and 0xff) shl 16) or ((dex[off + 3].toInt() and 0xff) shl 24)

        fun uleb128(off: Int): Pair<Int, Int> { // IntArray? — değer + yeni offset
            var deger = 0; var shift = 0; var i = off
            while (true) {
                val b = dex[i].toInt() and 0xff; i++
                deger = deger or ((b and 0x7f) shl shift)
                if (b and 0x80 == 0) break
                shift += 7
            }
            return deger to i
        }

        val stringIdsSize = u32(0x38); val stringIdsOff = u32(0x3c)
        val typeIdsSize = u32(0x40);  val typeIdsOff = u32(0x44)
        val classDefsSize = u32(0x60); val classDefsOff = u32(0x64)
        if (classDefsOff <= 0 || classDefsOff + classDefsSize * 32 > dex.size) return emptyList()

        // string_ids: her girdi uint offset; orada uleb128 uzunluk + MUTF-8 (NUL biter)
        fun string(i: Int): String {
            val off = u32(stringIdsOff + i * 4)
            val (_, metinOff) = uleb128(off) // utf16_size atla
            var son = metinOff
            while (son < dex.size && dex[son].toInt() != 0) son++
            return String(dex, metinOff, son - metinOff, Charsets.UTF_8)
        }
        val sonuc = ArrayList<String>(classDefsSize)
        for (n in 0 until classDefsSize) {
            val item = classDefsOff + n * 32
            val typeIdx = u32(item)
            if (typeIdx >= typeIdsSize) continue
            val descIdx = u32(typeIdsOff + typeIdx * 4)
            if (descIdx >= stringIdsSize) continue
            sonuc.add(string(descIdx))
        }
        return sonuc
    }

    // --------------------------------------------------------------- yükleme

    fun apkYukle(url: String, gorunenAd: String?): JSONObject = try {
        ensureInit()
        val ham = url.toByteArray()
        // Geçerli geçici ad; gerçek id içerik hash'i ile belirlenir.
        val tmp = File(appContext.cacheDir, "cs_in_${System.currentTimeMillis()}")
        indir(url, tmp)
        val bayt = tmp.readBytes()
        val id = sha1kisa(bayt)
        val uzanti = if (url.substringAfterLast('/').contains('.'))
            url.substringAfterLast('/').substringAfterLast('.', "cs3").lowercase() else "cs3"
        val dosya = File(pluginsDir, "$id.$uzanti")
        tmp.delete()
        if (!dosya.exists()) dosya.writeBytes(bayt)
        yukleDosya(dosya, gorunenAd ?: url.substringAfterLast('/'))
    } catch (t: Throwable) {
        hataJson("yükleme/indirme", url, t)
    }

    /** Diskteki bir eklenti dosyasını (apk/cs3) classloader'a alıp kaydeder. */
    @Synchronized
    fun yukleDosya(dosya: File, gorunenAd: String?): JSONObject = try {
        ensureInit()
        val id = sha1kisa(dosya.name.toByteArray())
        yukluler[id]?.let { return@yukleDosya durumJson(id) } // zaten yüklü

        val bayt = dosya.readBytes()
        // Android 10+ W^X: DexClassLoader yazılabilir dex'i reddeder; .cs3 içindeki
        // classes.dex sıkışık olabilir — ham .dex olarak dışa çıkar ve salt-okunur yap.
        val dexDosya = dexDosyasiHazirla(dosya, id)
        val loader = DexClassLoader(dexDosya.absolutePath, optDir.absolutePath, null, javaClass.classLoader)

        // 1) zip içi manifest.json (resmî CloudStream .cs3 formatı)
        var pluginSinif: String? = null
        var manifesto = JSONObject()
        try {
            ZipFile(dosya).use { zip ->
                zip.getEntry("manifest.json")?.let { e ->
                    manifesto = JSONObject(zip.getInputStream(e).reader().readText())
                    pluginSinif = manifesto.optString("pluginClassName", "")
                        .ifBlank { null }
                }
            }
        } catch (_: Exception) { /* saf .apk olabilir */ }

        // 2) candidate sınıflar: manifest varsa o, yoksa dex taraması
        val siniflar: List<String> = pluginSinif?.let { listOf(it) }
            ?: dexSinifAdlari(bayt).map { it.substring(1, it.length - 1) } // L..; soy

        val yukl = YuklenenEklenti(id, dosya, loader, pluginSinif, gorunenAd ?: manifesto.optString("name", dosya.name))
        val oncekiler = APIHolder.allProviders.toList()

        var basePluginOrnegi: BasePlugin? = null
        var dogrudanMainAPI: MainAPI? = null
        val onAdaylar = ArrayList<Class<*>>()
        var forNameIlkHata: String? = null
        for (sinifAdi in siniflar) {
            // dex tanımlayıcıları 'pkg/Sinif', manifest.json ise 'pkg.Sinif' biçimindedir;
            // Class.forName nokta ister. Sentetik lambda/adlandırılmış sınıflar atlanır.
            if (sinifAdi.contains('$')) continue
            val ad = if (sinifAdi.contains('/')) sinifAdi.replace('/', '.') else sinifAdi
            val sinif = try { Class.forName(ad, false, loader) } catch (t: Throwable) {
                // bağlama hatasını yutma: kök nedeni hata JSON'una taşı
                if (forNameIlkHata == null) {
                    val koken = generateSequence(t as Throwable?) { it.cause }.last()
                    forNameIlkHata = "$ad → " + koken.javaClass.simpleName + ": " + (koken.message ?: "-")
                }
                continue
            }
            if (BasePlugin::class.java.isAssignableFrom(sinif) && !java.lang.reflect.Modifier.isAbstract(sinif.modifiers))
                onAdaylar.add(sinif)
            else if (MainAPI::class.java.isAssignableFrom(sinif) && !java.lang.reflect.Modifier.isAbstract(sinif.modifiers))
                onAdaylar.add(sinif)
        }
        var ctorIlkHata: String? = null
        for (sinif in onAdaylar) {
            try {
                val ornek = sinif.getDeclaredConstructor().newInstance()
                if (ornek is BasePlugin && basePluginOrnegi == null) basePluginOrnegi = ornek
                if (ornek is MainAPI && dogrudanMainAPI == null) dogrudanMainAPI = ornek
            } catch (t: Throwable) {
                // argsız ctor yok veya clinit patladı: nedenini hata JSON'una taşı (kör devam ayıp)
                if (ctorIlkHata == null) {
                    val koken = generateSequence(t as Throwable?) { it.cause }.last()
                    ctorIlkHata = sinif.name + " → " + koken.javaClass.simpleName + ": " + (koken.message ?: "-")
                }
            }
        }

        if (basePluginOrnegi != null) {
            basePluginOrnegi.filename = dosya.absolutePath
            // Gerçek pluginler load(context: Context) override eder (v4.8.0 API); argsız
            // load() çağırmak kayıt olaylarını hiç tetiklemiyordu (2026-10-29 WioSinema teşhisi).
            if (basePluginOrnegi is Plugin) basePluginOrnegi.load(appContext) else basePluginOrnegi.load()
            yukl.pluginOrnegi = basePluginOrnegi
            (APIHolder.allProviders.toList() - oncekiler).forEach { it.sourcePlugin = dosya.absolutePath }
            yukl.saglayicilar.addAll(APIHolder.allProviders.toList() - oncekiler)
        } else if (dogrudanMainAPI != null) {
            dogrudanMainAPI.sourcePlugin = dosya.absolutePath
            APIHolder.allProviders.add(dogrudanMainAPI)
            yukl.saglayicilar.add(dogrudanMainAPI)
        } else {
            return@yukleDosya JSONObject().put("ok", false)
                .put("hata", "BasePlugin/MainAPI alt sınıfı bulunamadı")
                .put("sinif", pluginSinif ?: "dex-taraması")
                .put("forNameIlkHata", forNameIlkHata ?: "-")
                .put("ctorIlkHata", ctorIlkHata ?: "-")
        }

        yukluler[id] = yukl
        JSONObject()
            .put("ok", true).put("id", id).put("ad", yukl.ad)
            .put("pluginSinifi", pluginSinif ?: JSONObject.NULL)
            .put("saglayiciSayisi", yukl.saglayicilar.size)
            .put("saglayicilar", saglayiciJson(yukl))
    } catch (t: Throwable) {
        hataJson("dex-yukleme", dosya.name, t)
    }

    fun kaldir(ekId: String): JSONObject = try {
        val y = yukluler.remove(ekId) ?: return@kaldir JSONObject().put("ok", false).put("hata", "id yok: $ekId")
        (y.pluginOrnegi as? BasePlugin)?.beforeUnload()
        y.saglayicilar.forEach { APIHolder.allProviders.remove(it) }
        JSONObject().put("ok", true).put("id", ekId)
    } catch (t: Throwable) {
        hataJson("kaldirma", ekId, t)
    }

    /** Uygulama açılışında daha önce indirilen eklenti dosyalarını yeniden yükler. */
    @Synchronized
    fun disktekiEklentileriYenidenYukle() {
        try {
            pluginsDir.listFiles()?.forEach { f ->
                if (f.isFile && (f.name.endsWith(".cs3") || f.name.endsWith(".apk") || f.name.endsWith(".jar"))) {
                    yukleDosya(f, null)
                }
            }
        } catch (_: Exception) {}
    }

    // ------------------------------------------------------------------ repo

    /** CloudStream repo manifesti → indir-yükle. Üç gerçek format destelenir:
     *  1) {name, plugins:[{name,url}]}                (klasik repo.json)
     *  2) {name, pluginLists:[url,...]}               (Wiojelt/TurkSinema dolaylı formatı —
     *     kullanıcı 2026-10-29 örneği; pluginLists hedefleri {url,name}[] dizisidir)
     *  3) kökte düz [{url,name}] dizisi                (plugins.json'ların kendisi) */
    fun repoEkle(repoUrl: String, hepsiniYukle: Boolean): JSONObject = try {
        ensureInit()
        val tmp = File(appContext.cacheDir, "cs_repo_${System.currentTimeMillis()}.json")
        indir(repoUrl, tmp)
        val manifesto = JSONObject(tmp.readText())
        tmp.delete()
        val pluginler = manifesto.optJSONArray("plugins") ?: JSONArray()
        // 2) pluginLists dolaylı biçimi: her listeyi çekip {url,name}[] kalemlerini topla
        var kalemListesi = pluginler
        val pluginLists = manifesto.optJSONArray("pluginLists")
        if (pluginler.length() == 0 && pluginLists != null && pluginLists.length() > 0) {
            kalemListesi = JSONArray()
            for (li in 0 until pluginLists.length()) {
                val lUrl = pluginLists.getString(li).substringBefore('#')
                val lTmp = File(appContext.cacheDir, "cs_plist_${li}_${System.currentTimeMillis()}.json")
                indir(lUrl, lTmp)
                val dizi = JSONArray(lTmp.readText())
                lTmp.delete()
                for (pi in 0 until dizi.length()) kalemListesi.put(dizi.getJSONObject(pi))
            }
        }
        val sonuc = JSONArray()
        for (i in 0 until kalemListesi.length()) {
            val p = kalemListesi.getJSONObject(i)
            val adres = p.optString("url", "")
            val kayit = JSONObject().put("ad", p.optString("name", "")).put("url", adres)
            if (hepsiniYukle && adres.isNotBlank()) {
                try { kayit.put("yukleme", apkYukle(adres, p.optString("name", ""))) }
                catch (t: Throwable) { kayit.put("yukleme", hataJson("repo-kalem", adres, t)) }
            }
            sonuc.put(kayit)
        }
        JSONObject().put("ok", true).put("repoAdi", manifesto.optString("name", repoUrl))
            .put("eklentiSayisi", kalemListesi.length()).put("eklentiler", sonuc)
    } catch (t: Throwable) {
        // 3) kökü düz dizi olan plugins.json doğrudan repo adresi olarak verildiyse
        try {
            val tmp = File(appContext.cacheDir, "cs_repo_duz_${System.currentTimeMillis()}.json")
            indir(repoUrl, tmp)
            val dizi = JSONArray(tmp.readText())
            tmp.delete()
            val sonuc = JSONArray()
            for (i in 0 until dizi.length()) {
                val p = dizi.getJSONObject(i)
                val adres = p.optString("url", "")
                val kayit = JSONObject().put("ad", p.optString("name", "")).put("url", adres)
                if (hepsiniYukle && adres.isNotBlank()) {
                    try { kayit.put("yukleme", apkYukle(adres, p.optString("name", ""))) }
                    catch (t2: Throwable) { kayit.put("yukleme", hataJson("repo-kalem", adres, t2)) }
                }
                sonuc.put(kayit)
            }
            JSONObject().put("ok", true).put("repoAdi", repoUrl)
                .put("eklentiSayisi", dizi.length()).put("eklentiler", sonuc)
        } catch (t2: Throwable) { hataJson("repo", repoUrl, t2) }
    }

    // -------------------------------------------------------------- sorgular

    private fun saglayiciBul(sagId: String): Pair<YuklenenEklenti, MainAPI>? {
        val parca = sagId.split("#")
        val y = yukluler[parca[0]] ?: yukluler.values.firstOrNull { it.id.startsWith(parca[0]) } ?: return null
        val idx = parca.getOrNull(1)?.toIntOrNull() ?: 0
        return y.saglayicilar.getOrNull(idx)?.let { y to it }
    }

    fun listesi(): JSONObject = try {
        val arr = JSONArray()
        yukluler.values.forEach { y ->
            arr.put(JSONObject()
                .put("id", y.id).put("ad", y.ad).put("dosya", y.dosya.name)
                .put("saglayicilar", saglayiciJson(y)))
        }
        JSONObject().put("ok", true).put("ekler", arr)
            .put("apiKokSurum", "cloudstream v4.8.0 library (vendor)")
    } catch (t: Throwable) { hataJson("liste", "", t) }

    private fun saglayiciJson(y: YuklenenEklenti): JSONArray {
        val arr = JSONArray()
        y.saglayicilar.forEachIndexed { i, api ->
            arr.put(JSONObject()
                .put("sagId", "${y.id}#$i")
                .put("ad", api.name)
                .put("anaUrl", api.mainUrl)
                .put("dil", api.lang)
                .put("anaSayfaVar", api.hasMainPage)
                .put("hizliAramaVar", api.hasQuickSearch)
                .put("turler", JSONArray(api.supportedTypes.map { it.name })))
        }
        return arr
    }

    fun anaSayfalar(sagId: String): JSONObject = try {
        val api = saglayiciBul(sagId)?.second ?: return@anaSayfalar saglayiciYok(sagId)
        val arr = JSONArray()
        api.mainPage.forEachIndexed { i, mp ->
            arr.put(JSONObject().put("index", i).put("ad", mp.name).put("veri", mp.data))
        }
        JSONObject().put("ok", true).put("saglayici", api.name).put("sayfalar", arr)
    } catch (t: Throwable) { hataJson("anaSayfalar", sagId, t) }

    fun anaSayfaIcerik(sagId: String, sayfaIndex: Int, sayfa: Int): JSONObject = try {
        val api = saglayiciBul(sagId)?.second ?: return@anaSayfaIcerik saglayiciYok(sagId)
        val mp = api.mainPage.getOrNull(sayfaIndex)
            ?: return@anaSayfaIcerik JSONObject().put("ok", false).put("hata", "sayfaIndex yok: $sayfaIndex")
        val yanit = runBlocking {
            withTimeout((api.getMainPageTimeoutMs ?: 45_000L)) {
                api.getMainPage(sayfa, MainPageRequest(mp.name, mp.data, mp.horizontalImages))
            }
        }
        val arr = JSONArray()
        yanit?.items?.forEach { row ->
            arr.put(JSONObject().put("baslik", row.name)
                .put("ogeler", aramalarJson(row.list, sagId)))
        }
        JSONObject().put("ok", true).put("saglayici", api.name).put("bolumler", arr)
    } catch (t: Throwable) { hataJson("anaSayfaIcerik", "$sagId/$sayfaIndex/$sayfa", t) }

    /** sagId boş/`*` ise tüm yüklü sağlayıcılarda arar. */
    fun ara(sagId: String, sorgu: String): JSONObject = try {
        val hedefler = if (sagId.isBlank() || sagId == "*")
            yukluler.values.flatMap { y -> y.saglayicilar.map { y to it } }
        else listOfNotNull(saglayiciBul(sagId))
        if (hedefler.isEmpty()) return@ara saglayiciYok(sagId)
        val sonuc = JSONArray()
        hedefler.forEach { (y, api) ->
            try {
                val liste = runBlocking {
                    withTimeout((api.searchTimeoutMs ?: 40_000L)) { api.search(sorgu) }
                } ?: emptyList()
                sonuc.put(JSONObject()
                    .put("sagId", "${y.id}#${y.saglayicilar.indexOf(api)}")
                    .put("saglayici", api.name)
                    .put("ogeler", aramalarJson(liste, "${y.id}#${y.saglayicilar.indexOf(api)}")))
            } catch (t: Throwable) {
                sonuc.put(JSONObject().put("saglayici", api.name)
                    .put("hata", t.javaClass.simpleName + ": " + (t.message ?: "")))
            }
        }
        JSONObject().put("ok", true).put("sonuclar", sonuc)
    } catch (t: Throwable) { hataJson("ara", "$sagId|$sorgu", t) }

    fun yukle(sagId: String, url: String): JSONObject = try {
        val api = saglayiciBul(sagId)?.second ?: return@yukle saglayiciYok(sagId)
        val yanit = runBlocking {
            withTimeout((api.loadTimeoutMs ?: 60_000L)) { api.load(url) }
        } ?: return@yukle JSONObject().put("ok", false).put("hata", "load boş döndü")
        JSONObject().put("ok", true).put("sagId", sagId).put("detay", detayJson(yanit))
    } catch (t: Throwable) { hataJson("yukle", "$sagId|$url", t) }

    /** loadLinks çağırıp ExtractorLink listesini üretir (D3: uçtan uca akış). */
    fun akislar(sagId: String, dataUrl: String): JSONObject = try {
        val api = saglayiciBul(sagId)?.second ?: return@akislar saglayiciYok(sagId)
        val linkler = JSONArray()
        val altyazilar = JSONArray()
        runBlocking {
            withTimeout((api.loadLinksTimeoutMs ?: 120_000L)) {
                api.loadLinks(dataUrl, false,
                    { sub: SubtitleFile ->
                        altyazilar.put(JSONObject().put("dil", sub.lang).put("url", sub.url))
                    },
                    { link: ExtractorLink ->
                        linkler.put(JSONObject()
                            .put("ad", link.name).put("url", link.url)
                            .put("referer", link.referer).put("kaynak", link.source)
                            .put("kalite", link.quality)
                            .put("tur", link.type.name)
                            .put("durumIzleyici", link.isM3u8)
                            .put("baslik", link.name))
                    })
            }
        }
        JSONObject().put("ok", true).put("saglayici", api.name)
            .put("linkler", linkler).put("altyazilar", altyazilar)
    } catch (t: Throwable) { hataJson("akislar", "$sagId|$dataUrl", t) }

    fun durum(): JSONObject = JSONObject()
        .put("ok", true)
        .put("konak", "CinePulse CloudStream host D1-D4")
        .put("apiKokSurum", "cloudstream v4.8.0 library (vendor)")
        .put("yukluEklenti", yukluler.size)
        .put("kayitliSaglayici", APIHolder.allProviders.size)

    // ------------------------------------------------------------------ json

    /** year yalnız somut SearchResponse alt türlerinde (base sınıfta yok). */
    private fun yilOf(s: SearchResponse): Int? = when (s) {
        is com.lagradost.cloudstream3.MovieSearchResponse -> s.year
        is com.lagradost.cloudstream3.TvSeriesSearchResponse -> s.year
        is com.lagradost.cloudstream3.AnimeSearchResponse -> s.year
        else -> null
    }

    private fun aramalarJson(liste: List<SearchResponse>?, sagId: String): JSONArray {
        val arr = JSONArray()
        liste?.forEach { s ->
            arr.put(JSONObject()
                .put("ad", s.name).put("url", s.url)
                .put("tur", s.type?.name ?: "")
                .put("poster", s.posterUrl ?: JSONObject.NULL)
                .put("yil", yilOf(s) ?: JSONObject.NULL)
                .put("sagId", sagId))
        }
        return arr
    }

    @Suppress("DEPRECATION_ERROR") // Episode ctor deprecated; data/name çifti burada yeterli
    private fun detayJson(r: LoadResponse): JSONObject {
        val j = JSONObject()
            .put("ad", r.name).put("url", r.url)
            .put("tur", r.type?.name ?: "")
            .put("poster", r.posterUrl ?: JSONObject.NULL)
            .put("yil", r.year ?: JSONObject.NULL)
            .put("ozet", r.plot ?: "")
        val bolumler = JSONArray()
        when (r) {
            // Episode ctor sırası: (data, name, ...) — data ilk argüman.
            is MovieLoadResponse -> bolumler.put(epizodJson(Episode(r.dataUrl, r.name)))
            is LiveStreamLoadResponse -> bolumler.put(epizodJson(Episode(r.dataUrl, r.name)))
            is TvSeriesLoadResponse -> r.episodes.forEach { bolumler.put(epizodJson(it)) }
            is AnimeLoadResponse -> r.episodes.forEach { (durum, eps) ->
                eps.forEach { e ->
                    bolumler.put(epizodJson(e).put("dubStatus", durum.name))
                }
            }
        }
        j.put("bolumler", bolumler)
        j.put("bolumSayisi", bolumler.length())
        return j
    }

    private fun epizodJson(e: Episode): JSONObject = JSONObject()
        .put("ad", e.name ?: JSONObject.NULL)
        .put("veri", e.data ?: JSONObject.NULL)
        .put("sezon", e.season ?: JSONObject.NULL)
        .put("bolum", e.episode ?: JSONObject.NULL)

    private fun saglayiciYok(sagId: String) =
        JSONObject().put("ok", false).put("hata", "sağlayıcı bulunamadı: $sagId (önce csEklentiListesi/csEklentiYukle)")

    private fun durumJson(id: String): JSONObject =
        JSONObject().put("ok", true).put("zatenYuklu", true).put("id", id)

    /** NoClassDefFoundError mesajı eksik FQN'i taşır — D3 tanılama sözü buradan gelir. */
    private fun hataJson(islem: String, hedef: String, t: Throwable): JSONObject {
        Log.e(TAG, "[$islem] $hedef", t)
        var koken: Throwable = t
        var derinlik = 0
        while (koken.cause != null && koken.cause !== koken && derinlik < 6) { koken = koken.cause!!; derinlik++ }
        return JSONObject().put("ok", false)
            .put("islem", islem)
            .put("tur", koken.javaClass.name)
            .put("hata", (koken.message ?: t.javaClass.simpleName).take(500))
    }
}
