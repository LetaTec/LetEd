import cx from 'classnames/bind';

import { Button } from '@components/ui/Button/Button';
import { Modal } from '@components/ui/Modal/Modal';
import { Text } from '@components/ui/Text/Text';
import { ENQUIRY_TEXT } from '@constants/enquiry';

import styles from './AiTestDialog.module.css';

const cn = cx.bind(styles);

export type AiTestDialogProps = {
  open: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onCreateProfile: () => void;
};

// AI tests are not live yet; this explains the planned flow honestly and
// routes visitors to the one real next step — creating a student profile.
export const AiTestDialog = ({
  open,
  isLoggedIn,
  onClose,
  onCreateProfile,
}: AiTestDialogProps) => (
  <Modal
    open={open}
    onClose={onClose}
    eyebrow={ENQUIRY_TEXT.testEyebrow}
    title={
      <>
        {ENQUIRY_TEXT.testTitle}
        <br />
        <em>{ENQUIRY_TEXT.testTitleEmphasis}</em>
      </>
    }
  >
    <Text as="p" tone="muted">
      {isLoggedIn
        ? ENQUIRY_TEXT.testSignedInDescription
        : ENQUIRY_TEXT.testDescription}
    </Text>
    {!isLoggedIn ? (
      <Button
        endIcon="arrowRight"
        className={cn('action')}
        onClick={onCreateProfile}
      >
        {ENQUIRY_TEXT.testSubmit}
      </Button>
    ) : null}
  </Modal>
);
