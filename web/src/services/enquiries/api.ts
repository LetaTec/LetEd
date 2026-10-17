import { API_CLIENT } from '@services/http/api';

import type { EnquiryRequest } from './types';

export const submitEnquiry = async (body: EnquiryRequest) => {
  await API_CLIENT.post('/enquiries', body);
};
