import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@components/ui/Button/Button';
import {
  FieldForm,
  FieldFormActions,
  FieldStatus,
} from '@components/ui/Field/Field';
import { Input } from '@components/ui/Input/Input';
import { Modal } from '@components/ui/Modal/Modal';
import { Select } from '@components/ui/Select/Select';
import {
  ENQUIRY_TEXT,
  ENQUIRY_TYPE,
  MODEL_PAPER_EXAM,
  MODEL_PAPER_EXAM_OPTIONS,
} from '@constants/enquiry';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { useApiForm } from '@hooks/useApiForm';
import { submitEnquiry } from '@services/enquiries';

const modelPaperSchema = z.object({
  email: z.string().trim().pipe(z.email(ENQUIRY_TEXT.emailInvalid)),
  exam: z.enum(MODEL_PAPER_EXAM),
});

type ModelPaperFormValues = z.infer<typeof modelPaperSchema>;

export type ModelPaperDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const ModelPaperDialog = ({ open, onClose }: ModelPaperDialogProps) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    formError,
    clearFormError,
    handleApiError,
  } = useApiForm<ModelPaperFormValues>({
    resolver: zodResolver(modelPaperSchema),
    values: { email: user?.email ?? '', exam: MODEL_PAPER_EXAM.JEE },
  });

  const handleClose = () => {
    clearFormError();
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async values => {
    clearFormError();

    try {
      await submitEnquiry({
        type: ENQUIRY_TYPE.MODEL_PAPER_WAITLIST,
        ...values,
      });
      showToast(ENQUIRY_TEXT.modelPaperSuccess);
      handleClose();
    } catch (error) {
      handleApiError(error);
    }
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      eyebrow={ENQUIRY_TEXT.modelPaperEyebrow}
      title={
        <>
          {ENQUIRY_TEXT.modelPaperTitle}
          <br />
          <em>{ENQUIRY_TEXT.modelPaperTitleEmphasis}</em>
        </>
      }
    >
      <FieldForm onSubmit={onSubmit}>
        {formError ? <FieldStatus tone="error">{formError}</FieldStatus> : null}
        <Input
          label={ENQUIRY_TEXT.emailLabel}
          type="email"
          autoComplete="email"
          placeholder={ENQUIRY_TEXT.emailPlaceholder}
          error={errors.email?.message}
          {...register('email')}
        />
        <Select
          label={ENQUIRY_TEXT.examLabel}
          options={MODEL_PAPER_EXAM_OPTIONS}
          error={errors.exam?.message}
          {...register('exam')}
        />
        <FieldFormActions note={ENQUIRY_TEXT.modelPaperFootnote}>
          <Button type="submit" loading={isSubmitting} endIcon="arrowRight">
            {ENQUIRY_TEXT.modelPaperSubmit}
          </Button>
        </FieldFormActions>
      </FieldForm>
    </Modal>
  );
};
