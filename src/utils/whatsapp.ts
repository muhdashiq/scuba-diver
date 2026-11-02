export const DEFAULT_WHATSAPP_MESSAGE =
  'Hello! I am interested in scuba diving activities and courses. Could you please share your available dive trips, prices, and schedules?';

/**
 * Normalise a phone number into the digits-only international form wa.me expects.
 *
 * We only accept numbers that already carry an international prefix ("+" or "00").
 * A local number without a country code cannot be converted reliably, and guessing
 * would risk messaging the wrong person — so we return null rather than fabricate one.
 */
export function normalizeInternationalPhone(raw: string | undefined | null): string | null {
  if (!raw) return null;
  // OSM sometimes lists several numbers separated by ";" — use the first.
  const first = raw.split(/[;,/]/)[0]?.trim() ?? '';
  let candidate = first.replace(/[\s().\-–]/g, '');
  if (candidate.startsWith('00')) candidate = `+${candidate.slice(2)}`;
  if (!candidate.startsWith('+')) return null;
  const digits = candidate.slice(1);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.length < 8 || digits.length > 15) return null;
  if (digits.startsWith('0')) return null; // country codes never start with 0
  return digits;
}

export function buildWhatsAppUrl(phoneDigits: string, message: string): string {
  const text = message.trim();
  const base = `https://wa.me/${phoneDigits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
