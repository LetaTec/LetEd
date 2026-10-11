import { API_CLIENT } from '@services/http/api';

import type { Subject } from './types';

export const getCatalogue = async () =>
  (await API_CLIENT.get<{ subjects: Subject[] }>('/catalogue')).data.subjects;
