import { API_CLIENT } from '@services/http/api';

import type { CreateEnrolmentRequest, Enrolment } from './types';

export const listEnrolments = async () =>
  (await API_CLIENT.get<{ enrolments: Enrolment[] }>('/enrolments')).data
    .enrolments;

export const createEnrolment = async (body: CreateEnrolmentRequest) =>
  (await API_CLIENT.post<{ enrolment: Enrolment }>('/enrolments', body)).data
    .enrolment;
