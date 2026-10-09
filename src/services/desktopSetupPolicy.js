export function canUseDesktopSetup(bridge, capacitor) {
  return bridge?.isDesktop === true && !capacitor?.isNativePlatform?.();
}

export function needsDesktopSetup(info) {
  return info?.python?.available === false || info?.sidecar?.alive === false;
}
