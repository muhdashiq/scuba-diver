import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE, normalizeInternationalPhone } from '../whatsapp';

describe('WhatsApp helpers', () => {
  it('normalises international numbers', () => {
    expect(normalizeInternationalPhone('+20 69 360-0000')).toBe('20693600000');
    expect(normalizeInternationalPhone('0044 (20) 7946 0958')).toBe('442079460958');
    expect(normalizeInternationalPhone('+1 305 555 0100; +1 305 555 0101')).toBe('13055550100');
  });
  it('refuses to guess country codes or accept junk', () => {
    expect(normalizeInternationalPhone('069 123 456')).toBeNull();
    expect(normalizeInternationalPhone('+12')).toBeNull();
    expect(normalizeInternationalPhone('+0 123 456 789')).toBeNull();
    expect(normalizeInternationalPhone('call us')).toBeNull();
    expect(normalizeInternationalPhone(undefined)).toBeNull();
  });
  it('builds a click-to-chat URL with an encoded message', () => {
    const url = buildWhatsAppUrl('201001234567', DEFAULT_WHATSAPP_MESSAGE);
    expect(url.startsWith('https://wa.me/201001234567?text=')).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1])).toBe(DEFAULT_WHATSAPP_MESSAGE);
    expect(buildWhatsAppUrl('201001234567', '   ')).toBe('https://wa.me/201001234567');
  });
});
