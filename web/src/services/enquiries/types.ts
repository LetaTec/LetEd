import type { ENQUIRY_TYPE, ModelPaperExam } from '@constants/enquiry';

export type ModelPaperWaitlistRequest = {
  type: typeof ENQUIRY_TYPE.MODEL_PAPER_WAITLIST;
  email: string;
  exam: ModelPaperExam;
};

export type EnquiryRequest = ModelPaperWaitlistRequest;
