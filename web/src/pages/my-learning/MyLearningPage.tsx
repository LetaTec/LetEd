import { useCallback, useEffect, useState } from 'react';
import cx from 'classnames/bind';

import { formatTopicPrice } from '@components/catalogue/batchDetails';
import { Button, ButtonRouteLink } from '@components/ui/Button/Button';
import { Card } from '@components/ui/Card/Card';
import { CardGrid } from '@components/ui/CardGrid/CardGrid';
import { EmptyState } from '@components/ui/EmptyState/EmptyState';
import { Heading } from '@components/ui/Heading/Heading';
import { Section } from '@components/ui/Section/Section';
import { Spinner } from '@components/ui/Spinner/Spinner';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import { Text } from '@components/ui/Text/Text';
import {
  CATALOGUE_TEXT,
  ENROLMENT_STATUS,
  ENROLMENT_STATUS_COLOR,
  ENROLMENT_STATUS_LABEL,
} from '@constants/catalogue';
import { BOOK_TEXT } from '@constants/home';
import { PAGE_TEXT } from '@constants/pages';
import { APP_ROUTES, HOME_SECTION_ID, toSectionHref } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { listEnrolments, type Enrolment } from '@services/enrolments';
import { formatDateOnly } from '@utils/date';

import styles from './MyLearningPage.module.css';

const cn = cx.bind(styles);

const TITLE_ID = 'my-learning-title';

const describeEnrolment = (enrolment: Enrolment) =>
  [
    `${enrolment.batch.scheduleLabel} · ${enrolment.batch.name}`,
    enrolment.batch.startDate
      ? `${CATALOGUE_TEXT.startsLabel} ${formatDateOnly(enrolment.batch.startDate)}`
      : null,
    CATALOGUE_TEXT.lessonCount(enrolment.topic.lessons.length),
    formatTopicPrice(enrolment.topic.price),
  ]
    .filter(Boolean)
    .join(' · ');

const MyLearningPage = () => {
  const { user } = useAuth();
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const load = useCallback(() => {
    setIsLoading(true);
    setHasError(false);

    listEnrolments()
      .then(setEnrolments)
      .catch(error => {
        console.error('[enrolments] failed to load enrolments', error);
        setHasError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(load, [load]);

  const hasPendingPayment = enrolments.some(
    enrolment => enrolment.status === ENROLMENT_STATUS.PENDING_PAYMENT,
  );

  return (
    <Section labelledBy={TITLE_ID} className={cn('page')}>
      <div className={cn('head')}>
        <Text as="div" variant="eyebrow">
          {PAGE_TEXT.myLearningEyebrow}
        </Text>
        <Heading level={1} variant="display" id={TITLE_ID}>
          {PAGE_TEXT.myLearningTitle}{' '}
          <em>{PAGE_TEXT.myLearningTitleEmphasis}</em>
        </Heading>
        {user ? (
          <Text as="p" tone="muted">
            {PAGE_TEXT.myLearningGreeting(user.student.fullName)}
          </Text>
        ) : null}
      </div>

      {isLoading ? (
        <div className={cn('status')} role="status">
          <Spinner tone="muted" />
          <Text variant="small" tone="muted">
            {PAGE_TEXT.loading}
          </Text>
        </div>
      ) : null}

      {hasError ? (
        <EmptyState
          title={PAGE_TEXT.myLearningLoadError}
          action={
            <Button variant="secondary" onClick={load}>
              {CATALOGUE_TEXT.retry}
            </Button>
          }
        />
      ) : null}

      {!isLoading && !hasError && enrolments.length === 0 ? (
        <EmptyState
          title={PAGE_TEXT.myLearningEmptyTitle}
          message={PAGE_TEXT.myLearningEmptyMessage}
          action={
            <ButtonRouteLink
              to={`${APP_ROUTES.HOME}${toSectionHref(HOME_SECTION_ID.courses)}`}
              endIcon="arrowRight"
            >
              {PAGE_TEXT.myLearningBrowse}
            </ButtonRouteLink>
          }
        />
      ) : null}

      {!isLoading && !hasError && enrolments.length > 0 ? (
        <>
          <CardGrid variant="tiled" columns={2}>
            {enrolments.map(enrolment => (
              <div key={enrolment.id}>
                <Card
                  variant="panel"
                  label={BOOK_TEXT.topicLabel(
                    enrolment.subject.name,
                    enrolment.topic.level,
                  )}
                  title={enrolment.topic.title}
                  description={describeEnrolment(enrolment)}
                  footer={
                    <StatusDot
                      color={ENROLMENT_STATUS_COLOR[enrolment.status]}
                      label={ENROLMENT_STATUS_LABEL[enrolment.status]}
                    />
                  }
                />
              </div>
            ))}
          </CardGrid>
          {hasPendingPayment ? (
            <Text as="p" variant="small" tone="muted" className={cn('note')}>
              {PAGE_TEXT.myLearningPaymentNote}
            </Text>
          ) : null}
        </>
      ) : null}
    </Section>
  );
};

export default MyLearningPage;
