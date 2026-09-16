/* Ephemeral admin access state. Deliberately never persisted in web storage. */

const ENTRY_WINDOW_MS = 30_000;
const AUTH_SESSION_MS = 10 * 60_000;
const MAX_PIN_FAILURES = 5;
const FAILURE_LOCK_MS = 60_000;

let entryExpiresAt = 0;
let authenticated = false;
let authenticatedUntil = 0;
let pinFailures = 0;
let pinLockedUntil = 0;

export function grantAdminEntry() {
  entryExpiresAt = Date.now() + ENTRY_WINDOW_MS;
}

export function isAdminRouteAllowed() {
  return isAdminAuthenticated() || entryExpiresAt > Date.now();
}

export function isAdminAuthenticated() {
  if (authenticated && authenticatedUntil <= Date.now()) {
    authenticated = false;
    authenticatedUntil = 0;
  }
  return authenticated;
}

export function completeAdminAuthentication() {
  authenticated = true;
  authenticatedUntil = Date.now() + AUTH_SESSION_MS;
  entryExpiresAt = 0;
  pinFailures = 0;
  pinLockedUntil = 0;
}

export function lockAdminAccess() {
  authenticated = false;
  authenticatedUntil = 0;
  entryExpiresAt = 0;
}

export function getAdminPinLockSeconds() {
  return Math.max(0, Math.ceil((pinLockedUntil - Date.now()) / 1000));
}

export function recordAdminPinFailure() {
  if (pinLockedUntil > Date.now()) return getAdminPinLockSeconds();
  pinFailures += 1;
  if (pinFailures >= MAX_PIN_FAILURES) {
    pinFailures = 0;
    pinLockedUntil = Date.now() + FAILURE_LOCK_MS;
  }
  return getAdminPinLockSeconds();
}
