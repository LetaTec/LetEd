import cx from 'classnames/bind';

import { SelectionSummary } from '@components/catalogue/SelectionSummary/SelectionSummary';
import { TopicDetails } from '@components/catalogue/TopicDetails/TopicDetails';
import { EnrolmentReview } from '@components/enrolments/EnrolmentReview/EnrolmentReview';
import { Button } from '@components/ui/Button/Button';
import { EmptyState } from '@components/ui/EmptyState/EmptyState';
import { FieldStatus } from '@components/ui/Field/Field';
import { Modal } from '@components/ui/Modal/Modal';
import { Text } from '@components/ui/Text/Text';
import { AUTH_VIEW, type AuthView } from '@constants/auth';
import { CATALOGUE_TEXT, SUBJECT_STATUS } from '@constants/catalogue';
import { useAuth } from '@context/AuthContext';
import {
  listTopics,
  type Batch,
  type BatchContext,
  type Subject,
} from '@services/catalogue';

import styles from './CourseDialog.module.css';

const cn = cx.bind(styles);

export type CourseDialogProps = {
  open: boolean;
  subject: Subject | null;
  selection: BatchContext | null;
  hasUnknownBatch: boolean;
  onClose: () => void;
  onSelectBatch: (batch: Batch) => void;
  onClearBatch: () => void;
  onOpenAuth: (view: AuthView) => void;
  onEnrolmentChange: () => void;
};

// Course discovery → batch selection → authentication gate → enrolment
// review, all in one dialog whose state lives in the URL.
export const CourseDialog = ({
  open,
  subject,
  selection,
  hasUnknownBatch,
  onClose,
  onSelectBatch,
  onClearBatch,
  onOpenAuth,
  onEnrolmentChange,
}: CourseDialogProps) => {
  const { isLoggedIn, status } = useAuth();
  const topics = subject ? listTopics([subject]) : [];

  const renderBody = () => {
    if (!subject) return null;

    if (selection) {
      if (status === 'loading') return <SelectionSummary context={selection} />;

      if (!isLoggedIn) {
        return (
          <div className={cn('step')}>
            <SelectionSummary context={selection} />
            <Text as="p" variant="small" tone="muted">
              {CATALOGUE_TEXT.signInRequired}
            </Text>
            <div className={cn('actions')}>
              <Button variant="secondary" onClick={onClearBatch}>
                {CATALOGUE_TEXT.chooseAnotherBatch}
              </Button>
              <div className={cn('authActions')}>
                <Button
                  variant="secondary"
                  onClick={() => onOpenAuth(AUTH_VIEW.login)}
                >
                  {CATALOGUE_TEXT.continueToSignIn}
                </Button>
                <Button
                  endIcon="arrowRight"
                  onClick={() => onOpenAuth(AUTH_VIEW.register)}
                >
                  {CATALOGUE_TEXT.createAccountToContinue}
                </Button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <EnrolmentReview
          key={selection.batch.id}
          context={selection}
          onChooseAnother={onClearBatch}
          onEnrolmentChange={onEnrolmentChange}
        />
      );
    }

    if (topics.length === 0) {
      return (
        <EmptyState
          title={
            subject.status === SUBJECT_STATUS.UPCOMING
              ? CATALOGUE_TEXT.comingSoon
              : CATALOGUE_TEXT.noTopicsTitle
          }
          message={
            subject.status === SUBJECT_STATUS.UPCOMING
              ? CATALOGUE_TEXT.upcomingSubjectMessage
              : CATALOGUE_TEXT.noTopicsMessage
          }
        />
      );
    }

    return (
      <div className={cn('topics')}>
        {topics.map(context => (
          <TopicDetails
            key={context.topic.id}
            context={context}
            onSelectBatch={onSelectBatch}
          />
        ))}
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={
        selection
          ? CATALOGUE_TEXT.reviewEyebrow
          : `${CATALOGUE_TEXT.subjectEyebrow} / ${subject?.name ?? ''}`
      }
      title={
        selection ? (
          <>
            {CATALOGUE_TEXT.reviewTitle}
            <br />
            <em>{CATALOGUE_TEXT.reviewTitleEmphasis}</em>
          </>
        ) : (
          <>
            {CATALOGUE_TEXT.learnTitle}
            <br />
            <em>{subject?.name}.</em>
          </>
        )
      }
    >
      <div className={cn('body')}>
        {!selection ? (
          <Text as="p" variant="small" tone="muted" className={cn('note')}>
            {CATALOGUE_TEXT.topicWiseNote}
          </Text>
        ) : null}
        {hasUnknownBatch ? (
          <FieldStatus tone="error">{CATALOGUE_TEXT.batchNotFound}</FieldStatus>
        ) : null}
        {renderBody()}
      </div>
    </Modal>
  );
};
