import { transaction, type Database } from './client.js';

// Catalogue content sourced from the SriDha Academy education-model document and the
// approved website prototype. Only values present in those sources are set;
// anything not yet decided (faculty, lesson durations) stays null so the
// website shows an explicit "to be announced" state instead of invented data.

type SeedLesson = {
  id: string;
  title: string;
  durationMinutes: number | null;
};

type SeedBatch = {
  id: string;
  name: string;
  scheduleLabel: string;
  startDate: string | null;
  startTime: string | null;
  sessionCount: number | null;
  sessionDurationMinutes: number | null;
  instructorName: string | null;
  capacity: number | null;
  status: 'OPEN' | 'UPCOMING' | 'INACTIVE';
};

type SeedTopic = {
  id: string;
  title: string;
  summary: string;
  level: string | null;
  pricePaise: number | null;
  priceTaxLabel: string | null;
  lessons: SeedLesson[];
  batches: SeedBatch[];
};

type SeedChapter = {
  id: string;
  title: string;
  topics: SeedTopic[];
};

type SeedSubject = {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: 'AVAILABLE' | 'UPCOMING';
  listPricePaise: number | null;
  listPriceTaxLabel: string | null;
  chapters: SeedChapter[];
};

// The source plan assumes up to 100 students per batch.
const BATCH_CAPACITY = 100;

export const CATALOGUE_SEED: readonly SeedSubject[] = [
  {
    id: 'subject_accounts',
    slug: 'accounts',
    name: 'Accounts',
    description:
      'Class 11 & 12 commerce learning with structured topic-based batches',
    status: 'AVAILABLE',
    listPricePaise: null,
    listPriceTaxLabel: null,
    chapters: [
      {
        id: 'chapter_accounts_gst',
        title: 'Goods and Services Tax (GST)',
        topics: [
          {
            id: 'topic_accounts_gst_class_11',
            title: 'Learn GST for Class 11',
            summary:
              'A focused topic that explains GST from first principles and shows how GST transactions are recorded in the books.',
            level: 'Class 11',
            pricePaise: 12900,
            priceTaxLabel: null,
            lessons: [
              {
                id: 'lesson_gst_what_is_gst',
                title: 'What is GST',
                durationMinutes: null,
              },
              {
                id: 'lesson_gst_entries',
                title: 'GST entries',
                durationMinutes: null,
              },
              {
                id: 'lesson_gst_input_tax_credit',
                title: 'Input tax credit',
                durationMinutes: null,
              },
              {
                id: 'lesson_gst_journal_entries',
                title: 'Journal entries of GST',
                durationMinutes: null,
              },
            ],
            batches: [
              {
                id: 'batch_gst_class_11_november',
                name: 'November batch',
                scheduleLabel: '1st & 2nd November',
                startDate: '2026-11-01',
                startTime: '10:00',
                sessionCount: 2,
                sessionDurationMinutes: null,
                instructorName: null,
                capacity: BATCH_CAPACITY,
                status: 'OPEN',
              },
              {
                id: 'batch_gst_class_11_december',
                name: 'December batch',
                scheduleLabel: '8th & 9th December',
                startDate: '2026-12-08',
                startTime: '10:00',
                sessionCount: 2,
                sessionDurationMinutes: null,
                instructorName: null,
                capacity: BATCH_CAPACITY,
                status: 'OPEN',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'subject_economics',
    slug: 'economics',
    name: 'Economics',
    description:
      'Focused online sessions designed around clear concepts and practice',
    status: 'AVAILABLE',
    listPricePaise: 49900,
    listPriceTaxLabel: 'GST',
    chapters: [],
  },
  {
    id: 'subject_mathematics',
    slug: 'mathematics',
    name: 'Mathematics',
    description:
      'Topic-led classes for students building their fundamentals and exam readiness',
    status: 'AVAILABLE',
    listPricePaise: 49900,
    listPriceTaxLabel: 'GST',
    chapters: [],
  },
  {
    id: 'subject_neet',
    slug: 'neet',
    name: 'NEET',
    description:
      'Competitive preparation pathway planned for the next expansion stage',
    status: 'UPCOMING',
    listPricePaise: null,
    listPriceTaxLabel: null,
    chapters: [],
  },
  {
    id: 'subject_jee',
    slug: 'jee',
    name: 'JEE',
    description:
      'Competitive preparation pathway planned to follow the initial school offering',
    status: 'UPCOMING',
    listPricePaise: null,
    listPriceTaxLabel: null,
    chapters: [],
  },
  {
    id: 'subject_ca_cs',
    slug: 'ca-cs',
    name: 'CA / CS',
    description:
      'Professional examination categories included in the broader education model',
    status: 'UPCOMING',
    listPricePaise: null,
    listPriceTaxLabel: null,
    chapters: [],
  },
];

// Idempotent: re-running updates catalogue rows in place and never touches
// users, sessions or enrolments.
export const seedCatalogue = (db: Database) => {
  const upsertSubject = db.prepare(`
    INSERT INTO subjects (id, slug, name, description, status, list_price_paise, list_price_tax_label, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET
      slug = excluded.slug, name = excluded.name, description = excluded.description,
      status = excluded.status, list_price_paise = excluded.list_price_paise,
      list_price_tax_label = excluded.list_price_tax_label, position = excluded.position
  `);
  const upsertChapter = db.prepare(`
    INSERT INTO chapters (id, subject_id, title, position) VALUES (?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET
      subject_id = excluded.subject_id, title = excluded.title, position = excluded.position
  `);
  const upsertTopic = db.prepare(`
    INSERT INTO topics (id, chapter_id, title, summary, level, price_paise, price_tax_label, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET
      chapter_id = excluded.chapter_id, title = excluded.title, summary = excluded.summary,
      level = excluded.level, price_paise = excluded.price_paise,
      price_tax_label = excluded.price_tax_label, position = excluded.position
  `);
  const upsertLesson = db.prepare(`
    INSERT INTO lessons (id, topic_id, title, duration_minutes, position) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET
      topic_id = excluded.topic_id, title = excluded.title,
      duration_minutes = excluded.duration_minutes, position = excluded.position
  `);
  const upsertBatch = db.prepare(`
    INSERT INTO batches (id, topic_id, name, schedule_label, start_date, start_time, session_count,
      session_duration_minutes, instructor_name, capacity, status, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET
      topic_id = excluded.topic_id, name = excluded.name, schedule_label = excluded.schedule_label,
      start_date = excluded.start_date, start_time = excluded.start_time,
      session_count = excluded.session_count,
      session_duration_minutes = excluded.session_duration_minutes,
      instructor_name = excluded.instructor_name, capacity = excluded.capacity,
      status = excluded.status, position = excluded.position
  `);

  transaction(db, () => {
    CATALOGUE_SEED.forEach((subject, subjectIndex) => {
      upsertSubject.run(
        subject.id,
        subject.slug,
        subject.name,
        subject.description,
        subject.status,
        subject.listPricePaise,
        subject.listPriceTaxLabel,
        subjectIndex,
      );

      subject.chapters.forEach((chapter, chapterIndex) => {
        upsertChapter.run(chapter.id, subject.id, chapter.title, chapterIndex);

        chapter.topics.forEach((topic, topicIndex) => {
          upsertTopic.run(
            topic.id,
            chapter.id,
            topic.title,
            topic.summary,
            topic.level,
            topic.pricePaise,
            topic.priceTaxLabel,
            topicIndex,
          );

          topic.lessons.forEach((lesson, lessonIndex) => {
            upsertLesson.run(
              lesson.id,
              topic.id,
              lesson.title,
              lesson.durationMinutes,
              lessonIndex,
            );
          });

          topic.batches.forEach((batch, batchIndex) => {
            upsertBatch.run(
              batch.id,
              topic.id,
              batch.name,
              batch.scheduleLabel,
              batch.startDate,
              batch.startTime,
              batch.sessionCount,
              batch.sessionDurationMinutes,
              batch.instructorName,
              batch.capacity,
              batch.status,
              batchIndex,
            );
          });
        });
      });
    });
  });
};
