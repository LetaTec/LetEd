import cx from 'classnames/bind';

import { Button } from '@components/ui/Button/Button';
import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { EmptyState } from '@components/ui/EmptyState/EmptyState';
import { IconButton } from '@components/ui/IconButton/IconButton';
import { Reveal } from '@components/ui/Reveal/Reveal';
import { Section } from '@components/ui/Section/Section';
import { SectionHead } from '@components/ui/SectionHead/SectionHead';
import { Spinner } from '@components/ui/Spinner/Spinner';
import { Text } from '@components/ui/Text/Text';
import { CATALOGUE_TEXT, SUBJECT_STATUS } from '@constants/catalogue';
import { COURSES_TEXT } from '@constants/home';
import { HOME_SECTION_ID } from '@constants/routes';
import type { CatalogueState } from '@hooks/useCatalogue';
import {
  getSubjectStartingPrice,
  hasTopics,
  type Subject,
} from '@services/catalogue';
import { formatPrice } from '@utils/currency';

import styles from './CoursesSection.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'courses-title';

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

const getPriceLabel = (subject: Subject) => {
  if (subject.status === SUBJECT_STATUS.UPCOMING)
    return CATALOGUE_TEXT.comingSoon;

  const price = getSubjectStartingPrice(subject);
  if (!price) return CATALOGUE_TEXT.priceOnRequest;

  return hasTopics(subject)
    ? `${CATALOGUE_TEXT.pricePrefix} ${formatPrice(price)}`
    : formatPrice(price);
};

export type CoursesSectionProps = {
  catalogue: CatalogueState;
  onOpenSubject: (subject: Subject) => void;
};

export const CoursesSection = ({
  catalogue,
  onOpenSubject,
}: CoursesSectionProps) => {
  const { subjects, isLoading, hasError, reload } = catalogue;

  return (
    <Section id={HOME_SECTION_ID.courses} labelledBy={TITLE_ID}>
      <SectionHead
        titleId={TITLE_ID}
        title={
          <>
            {COURSES_TEXT.title}
            <br />
            <em>{COURSES_TEXT.titleEmphasis}</em>
          </>
        }
        description={COURSES_TEXT.description}
      />

      {isLoading ? (
        <div className={cn('status')} role="status">
          <Spinner tone="muted" />
          <Text variant="small" tone="muted">
            {COURSES_TEXT.loading}
          </Text>
        </div>
      ) : null}

      {hasError ? (
        <EmptyState
          title={CATALOGUE_TEXT.loadError}
          action={
            <Button variant="secondary" onClick={reload}>
              {CATALOGUE_TEXT.retry}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !hasError ? (
        <CardGrid variant="ruled" columns={3}>
          {subjects.map((subject, index) => (
            <Reveal key={subject.id}>
              <Card
                variant="tile"
                label={formatIndex(index)}
                title={subject.name}
                description={subject.description}
                footer={
                  <>
                    <Text variant="price">{getPriceLabel(subject)}</Text>
                    <IconButton
                      icon="arrowUpRight"
                      size="lg"
                      label={COURSES_TEXT.openSubjectLabel(subject.name)}
                      onClick={() => onOpenSubject(subject)}
                    />
                  </>
                }
              />
            </Reveal>
          ))}
        </CardGrid>
      ) : null}
    </Section>
  );
};
