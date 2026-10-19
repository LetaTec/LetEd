import { Router } from 'express';

import type { AppContext } from '../../app/context.js';
import { getCatalogue } from './catalogue.repository.js';

// Public course discovery: anyone may read the catalogue. Selecting a batch is
// a separate, authenticated operation (see enrolments).
export const createCatalogueRouter = (context: AppContext) => {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json({ subjects: await getCatalogue(context) });
  });

  return router;
};
