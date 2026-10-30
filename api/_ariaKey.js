/* Aria (Nightwing) Cf-Control XOR anahtarı — bundle'a gömülmez.
   Dağıtım env'inden okunur: ARIA_CF_KEY. */
export function ariaKeyPayload() {
  return { key: String(process.env.ARIA_CF_KEY || '').trim() };
}
