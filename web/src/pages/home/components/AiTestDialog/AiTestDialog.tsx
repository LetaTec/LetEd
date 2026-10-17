import { Modal } from '@components/ui/Modal/Modal';
import { Text } from '@components/ui/Text/Text';
import { ENQUIRY_TEXT } from '@constants/enquiry';

export type AiTestDialogProps = {
  open: boolean;
  onClose: () => void;
};

// AI tests are not live yet; this explains the planned flow honestly.
export const AiTestDialog = ({ open, onClose }: AiTestDialogProps) => (
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
      {ENQUIRY_TEXT.testDescription}
    </Text>
  </Modal>
);
