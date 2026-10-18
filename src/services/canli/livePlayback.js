// Each cleanup step must run even when an earlier engine call throws.
export function disposeLiveMedia({ video, hls, mpegts, frames = [] }) {
  for (const operation of [
    () => hls?.stopLoad(), () => hls?.detachMedia(), () => hls?.destroy(),
    () => mpegts?.destroy(), () => video?.pause(),
    () => video?.removeAttribute('src'), () => video?.load(),
    ...Array.from(frames, (frame) => () => { frame.remove(); })
  ]) {
    try { operation(); } catch (_) {}
  }
}
