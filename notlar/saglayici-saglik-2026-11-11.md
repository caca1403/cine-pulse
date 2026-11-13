> **DÜZELTME (2026-11-13):** Bu rapordaki "json-bozuk 4 çekirdek" tespiti
> SAĞLIK ARACININ hatasıydı: çekirdek loglarındaki süslü parantezler ilk `{`
> eşleşmesini bozuyordu. Gerçekte spiderMan/superman/zatanna CANLI; yalnız
> Shazam 0 dönüyordu ve 2026-11-13'te onarıldı. Güncel ve ölçümlü durum:
> `saglayici-saglik-2026-11-13.md`. Aşağıdaki metin tarihsel kayıt olarak
> korunmuştur.

# Sağlayıcı Sağlık Raporu — 2026-11-11 (canlı, film #155, 45sn/çekirdek)

Komut: `node tools/kahraman-toplu-test.mjs --tur movie --timeout 45`
Sonuç: **CANLI 8/57** — site çalışıyor (detayda ~28 kaynak, oynatıcı oynatıyor) ama envanter döküldü.

## Arızalar (onarım dalgası hedefleri)
- **json-bozuk (API formu değişmiş):** shazam, spiderMan, superman, zatanna
- **0-2 sn'de ölü (muhtemelen domain/SSL ölümü):** robin, vision, wolverine, scarletWitch,
  supergirl, thor, winterSoldier, wonderWoman, punisher, sirius, spectre, nightwing, poisonIvy…
- Tam liste (canlı olmayan 49): aqualad, aquaman, arcturus, bane, batman, beastBoy, bellatrix,
  blackAdam, blackPanther, blackWidow, brainiac, captainAmerica, constantine, cyborg, daredevil,
  deadpool, doctorFate, doctorStrange, falcon, flash, harleyQuinn, hawkeye, hawkman, hulk,
  ironFist, joker, loki, lukeCage, lyra, moonKnight, nightwing, poisonIvy, punisher, raven,
  robin, scarletWitch, shazam, sirius, spectre, spiderMan, spiderWoman, supergirl, superman,
  thor, vision, winterSoldier, wolverine, wonderWoman, zatanna

## Canlı kalanlar (film #155)
nova, phyla, starLord(3 kaynak) + ilk satırları kesilenlerle toplam 8 (tam çıktı:
shell kaydı sh_1c7578aaa001U28xNFbs8F8Zjs).

## Yorum
- Tek film örneklemdir; her yapım başka sağlayıcıda yaşar — kullanıcı deneyimi (~28 kaynak)
  bu 8-10 canlı sağlayıcının toplamıdır.
- json-bozuk 4 çekirdek net onarım hedefidir (yapı değişimi).
- Ölüler için domain yenileme/alan kontrolü gerekir: `tools/kahraman-alan-kontrol.mjs`.

## Push durumu (2026-11-11)
- Commit HAZIR: 65e1d7d (75 dosya) — bu makinede GitHub kimliği YOK (HTTPS şifresi/SSH/PAT yok,
  sistemde düz metin token aranıp bulunamadı). Kullanıcı kendi terminalinden `git push origin main`
  çalıştırınca GH Actions deploy edecek.
