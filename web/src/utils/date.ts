import { DEFAULT_LOCALE } from '@constants/locale';

// Date-only values ("2026-11-01") are calendar dates, so they are formatted in
// UTC to avoid shifting a day in timezones behind UTC.
export const formatDateOnly = (value: string): string =>
  new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));

// Wall-clock times ("10:00") are shown as published, in India Standard Time.
export const formatWallClockTime = (value: string): string => {
  const [hours, minutes] = value.split(':').map(Number);
  const date = new Date(Date.UTC(2000, 0, 1, hours, minutes));

  return `${new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(date)} IST`;
};
