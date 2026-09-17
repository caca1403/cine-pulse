// Keep streaming providers and the player engine out of the initial page bundle.
export async function openPlayerModal(options) {
  const player = await import('./PlayerModal.js');
  return player.openPlayerModal(options);
}
