import { useState } from 'react';
import cx from 'classnames/bind';

import { SelectionSummary } from '@components/catalogue/SelectionSummary/SelectionSummary';
import { Button, ButtonRouteLink } from '@components/ui/Button/Button';
import { FieldStatus } from '@components/ui/Field/Field';
import { StatusDot } from '@components/ui/StatusDot/StatusDot';
import { Text } from '@components/ui/Text/Text';
import { canEnrolInBatch } from '@access/enrolments';
import {
  CATALOGUE_ERROR_CODE,
  CATALOGUE_TEXT,
  ENROLMENT_STATUS_COLOR,
  ENROLMENT_STATUS_LABEL,
} from '@constants/catalogue';
import { APP_ROUTES } from '@constants/routes';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { getApiErrorMessage, hasApiErrorCode } from '@services/api/errors';
import type { BatchContext } from '@services/catalogue';
import { createEnrolment, type Enrolment } from '@services/enrolments';

import styles from './EnrolmentReview.module.css';

const cn = cx.bind(styles);

const ENROLMENT_FALLBACK_ERROR =
  'Your seat could not be reserved. Please try again.';

export type EnrolmentReviewProps = {
  context: BatchContext;
  onChooseAnother: () => void;
  onEnrolmentChange: () => void;
};

type ReviewState =
  | { kind: 'review' }
  | { kind: 'reserved'; enrolment: Enrolment }
  | { kind: 'alreadyReserved' };

// Final step before enrolment. Reserving creates a real, server-side
// enrolment in PENDING_PAYMENT status — payment itself is not live yet.
export const EnrolmentReview = ({
  context,
  onChooseAnother,
  onEnrolmentChange,
}: EnrolmentReviewProps) => {
  const auth = useAuth();
  const { showToast } = useToast();
  const [state, setState] = useState<ReviewState>({ kind: 'review' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReserve = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const enrolment = await createEnrolment({ batchId: context.batch.id });
      setState({ kind: 'reserved', enrolment });
      showToast(CATALOGUE_TEXT.reservedToast);
      onEnrolmentChange();
    } catch (requestError) {
      if (hasApiErrorCode(requestError, CATALOGUE_ERROR_CODE.alreadyEnrolled)) {
        setState({ kind: 'alreadyReserved' });
        return;
      }

      if (
        hasApiErrorCode(requestError, CATALOGUE_ERROR_CODE.batchFull) ||
        hasApiErrorCode(requestError, CATALOGUE_ERROR_CODE.batchUnavailable)
      ) {
        // Refresh so the batch shows its current status.
        onEnrolmentChange();
      }

      setError(getApiErrorMessage(requestError, ENROLMENT_FALLBACK_ERROR));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.kind === 'reserved' || state.kind === 'alreadyReserved') {
    return (
      <div className={cn('review')}>
        <SelectionSummary context={context} />
        {state.kind === 'reserved' ? (
          <StatusDot
            color={ENROLMENT_STATUS_COLOR[state.enrolment.status]}
            label={ENROLMENT_STATUS_LABEL[state.enrolment.status]}
          />
        ) : (
          <FieldStatus tone="success">
            {CATALOGUE_TEXT.alreadyReservedMessage}
          </FieldStatus>
        )}
        <Text as="p" variant="small" tone="muted">
          {CATALOGUE_TEXT.paymentPendingNote}
        </Text>
        <div className={cn('actions')}>
          <ButtonRouteLink to={APP_ROUTES.MY_LEARNING} endIcon="arrowRight">
            {CATALOGUE_TEXT.viewMyLearning}
          </ButtonRouteLink>
        </div>
      </div>
    );
  }

  const canEnrol = canEnrolInBatch(auth, context.batch);

  return (
    <div className={cn('review')}>
      <SelectionSummary context={context} />
      <Text as="p" variant="small" tone="muted">
        {CATALOGUE_TEXT.paymentPendingNote}
      </Text>
      {error ? <FieldStatus tone="error">{error}</FieldStatus> : null}
      <div className={cn('actions')}>
        <Button variant="secondary" onClick={onChooseAnother}>
          {CATALOGUE_TEXT.chooseAnotherBatch}
        </Button>
        <Button
          loading={isSubmitting}
          disabled={!canEnrol}
          endIcon="arrowRight"
          onClick={handleReserve}
        >
          {CATALOGUE_TEXT.reserveSeat}
        </Button>
      </div>
    </div>
  );
};
