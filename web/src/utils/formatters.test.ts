import { formatPrice } from './currency';
import { formatDateOnly, formatWallClockTime } from './date';
import { resolveInternalPath } from './url';

describe('formatters', () => {
  it('formats prices in rupees with an optional tax label', () => {
    expect(
      formatPrice({ amountPaise: 12900, currency: 'INR', taxLabel: null }),
    ).toBe('₹129');
    expect(
      formatPrice({ amountPaise: 49900, currency: 'INR', taxLabel: 'GST' }),
    ).toBe('₹499 + GST');
  });

  it('formats calendar dates without shifting the day', () => {
    expect(formatDateOnly('2026-11-01')).toBe('1 Nov 2026');
  });

  it('formats published wall-clock times in IST', () => {
    expect(formatWallClockTime('10:00')).toMatch(/^10:00\s?am IST$/i);
  });
});

describe('resolveInternalPath', () => {
  it('accepts same-origin paths only', () => {
    expect(resolveInternalPath('/my-learning', '/')).toBe('/my-learning');
    expect(resolveInternalPath('//evil.example', '/')).toBe('/');
    expect(resolveInternalPath('https://evil.example', '/')).toBe('/');
    expect(resolveInternalPath(null, '/')).toBe('/');
  });
});
