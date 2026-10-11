import type { BatchAvailability, SubjectStatus } from '@constants/catalogue';

export type Price = {
  amountPaise: number;
  currency: 'INR';
  taxLabel: string | null;
};

export type Lesson = {
  id: string;
  title: string;
  durationMinutes: number | null;
};

export type Batch = {
  id: string;
  name: string;
  scheduleLabel: string;
  startDate: string | null;
  startTime: string | null;
  sessionCount: number | null;
  sessionDurationMinutes: number | null;
  instructorName: string | null;
  capacity: number | null;
  seatsRemaining: number | null;
  availability: BatchAvailability;
};

export type Topic = {
  id: string;
  title: string;
  summary: string;
  level: string | null;
  price: Price | null;
  lessons: Lesson[];
  batches: Batch[];
};

export type Chapter = {
  id: string;
  title: string;
  topics: Topic[];
};

export type Subject = {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: SubjectStatus;
  listPrice: Price | null;
  chapters: Chapter[];
};

// A topic together with the chapter and subject it belongs to.
export type TopicContext = {
  subject: Subject;
  chapter: Chapter;
  topic: Topic;
};

export type BatchContext = TopicContext & {
  batch: Batch;
};
