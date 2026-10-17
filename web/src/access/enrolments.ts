import type { AuthContextValue } from '@context/AuthContext';
import { isBatchOpen, type Batch } from '@services/catalogue';

export const canEnrolInBatch = (auth: AuthContextValue, batch: Batch) =>
  auth.isLoggedIn && isBatchOpen(batch);
