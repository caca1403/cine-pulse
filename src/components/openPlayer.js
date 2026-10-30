// Keep streaming providers and the player engine out of the initial page bundle.
// openPlayerModal'ın SON parametresi opsiyonel taramaKarti'dir (madde 1 sözleşmesi,
// kullanıcı 2026-10-28): buradan aynen iletilir; PlayerModal henüz almıyorsa
// yok sayılır — regresyon riski yok.
export async function openPlayerModal(options, taramaKarti) {
  const player = await import('./PlayerModal.js');
  return player.openPlayerModal(options, taramaKarti);
}
