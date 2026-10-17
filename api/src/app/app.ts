import { existsSync } from 'node:fs';
import path from 'node:path';

import cookieParser from 'cookie-parser';
import express, { type RequestHandler } from 'express';

import { errorHandler, notFoundHandler } from '../http/errors.js';
import { createOriginGuard } from '../http/originGuard.js';
import { createAuthRouter } from '../modules/auth/auth.routes.js';
import { createSessionMiddleware } from '../modules/auth/session.js';
import { createCatalogueRouter } from '../modules/catalogue/catalogue.routes.js';
import { createEnquiriesRouter } from '../modules/enquiries/enquiries.routes.js';
import { createEnrolmentsRouter } from '../modules/enrolments/enrolments.routes.js';
import type { AppContext } from './context.js';

const WEB_DIST_PATH = path.resolve(import.meta.dirname, '../../../web/dist');
const JSON_BODY_LIMIT = '32kb';

const securityHeaders: RequestHandler = (_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

const noStore: RequestHandler = (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
};

export const createApp = (context: AppContext) => {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(securityHeaders);

  const api = express.Router();
  api.use(noStore);
  api.use(express.json({ limit: JSON_BODY_LIMIT }));
  api.use(cookieParser());
  api.use(createOriginGuard([context.config.webOrigin]));
  api.use(createSessionMiddleware(context));

  api.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  api.use('/auth', createAuthRouter(context));
  api.use('/catalogue', createCatalogueRouter(context));
  api.use('/enrolments', createEnrolmentsRouter(context));
  api.use('/enquiries', createEnquiriesRouter(context));
  api.use(notFoundHandler);
  api.use(errorHandler);

  app.use('/api', api);

  if (context.config.serveWebDist) {
    if (!existsSync(WEB_DIST_PATH)) {
      throw new Error(
        `SERVE_WEB_DIST is enabled but ${WEB_DIST_PATH} does not exist — run "npm run build -w web" first`,
      );
    }

    app.use(express.static(WEB_DIST_PATH, { index: false }));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(WEB_DIST_PATH, 'index.html'));
    });
  }

  return app;
};
