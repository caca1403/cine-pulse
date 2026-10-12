const events = [];
const MAX_EVENTS = 250;
export function recordProviderEvent(event) {
  events.push({ at: Date.now(), ...event });
  if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
}
export function getProviderDiagnostics() { return events.map(event => ({ ...event })); }
export function clearProviderDiagnostics() { events.length = 0; }
