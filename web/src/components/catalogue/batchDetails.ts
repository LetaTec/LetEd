import type { KeyValueItem } from '@components/ui/KeyValueList/KeyValueList';
import { CATALOGUE_TEXT } from '@constants/catalogue';
import type { Batch, Price } from '@services/catalogue';
import { formatPrice } from '@utils/currency';
import { formatDateOnly, formatWallClockTime } from '@utils/date';

const orToBeAnnounced = <T>(value: T | null, format: (value: T) => string) =>
  value === null ? CATALOGUE_TEXT.toBeAnnounced : format(value);

export const formatTopicPrice = (price: Price | null) =>
  price ? formatPrice(price) : CATALOGUE_TEXT.priceOnRequest;

// Every batch field the data model supports. Missing values are shown as
// "To be announced" rather than invented.
export const getBatchDetailItems = (batch: Batch): KeyValueItem[] => [
  {
    label: CATALOGUE_TEXT.startsLabel,
    value: orToBeAnnounced(batch.startDate, formatDateOnly),
  },
  {
    label: CATALOGUE_TEXT.timeLabel,
    value: orToBeAnnounced(batch.startTime, formatWallClockTime),
  },
  {
    label: CATALOGUE_TEXT.sessionsLabel,
    value: orToBeAnnounced(batch.sessionCount, CATALOGUE_TEXT.sessionCount),
  },
  {
    label: CATALOGUE_TEXT.durationLabel,
    value: orToBeAnnounced(
      batch.sessionDurationMinutes,
      CATALOGUE_TEXT.durationMinutes,
    ),
  },
  {
    label: CATALOGUE_TEXT.facultyLabel,
    value: orToBeAnnounced(batch.instructorName, name => name),
  },
  {
    label: CATALOGUE_TEXT.seatsLabel,
    value: orToBeAnnounced(batch.seatsRemaining, CATALOGUE_TEXT.seatsRemaining),
  },
];
