import { existsSync } from 'node:fs';
import path from 'node:path';

import cookieParser from 'cookie-parser';
import express, { type RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';

import {
  ApiError,
  ERROR_CODE,
  errorHandler,
  notFoundHandler,
} from '../http/errors.js';
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

const createCorsMiddleware = (
  allowedOrigins: readonly string[],
): RequestHandler => {
  const originSet = new Set(allowedOrigins);

  return (req, res, next) => {
    const origin = req.get('origin');
    if (origin && originSet.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Cookie, Accept, X-Requested-With',
      );
      res.setHeader('Access-Control-Max-Age', '86400');
      res.setHeader('Vary', 'Origin');
    }

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    next();
  };
};

export const createApp = (context: AppContext) => {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(securityHeaders);

  const api = express.Router();
  api.use(noStore);
  api.use(createCorsMiddleware(context.config.allowedOrigins));
  api.use(express.json({ limit: JSON_BODY_LIMIT }));
  api.use(cookieParser());
  api.use(createOriginGuard(context.config.allowedOrigins));
  api.use(createSessionMiddleware(context));

  // Health endpoint: tests live database connectivity
  api.get('/health', async (_req, res) => {
    try {
      await context.db.query('SELECT 1');
      res.json({
        status: 'ok',
        env: context.config.env,
        database: 'connected',
        timestamp: context.now().toISOString(),
      });
    } catch (error) {
      res.status(503).json({
        status: 'error',
        database: 'disconnected',
        message: (error as Error).message,
      });
    }
  });

  // Rate limiting on sensitive endpoints
  if (context.config.enableRateLimiting) {
    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 15,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (_req, _res, next) => {
        next(
          new ApiError(
            429,
            ERROR_CODE.rateLimitExceeded,
            'Too many authentication attempts. Please try again later.',
          ),
        );
      },
    });

    const passwordResetLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (_req, _res, next) => {
        next(
          new ApiError(
            429,
            ERROR_CODE.rateLimitExceeded,
            'Too many password reset attempts. Please try again later.',
          ),
        );
      },
    });

    api.use('/auth/register', authLimiter);
    api.use('/auth/login', authLimiter);
    api.use('/auth/password-reset', passwordResetLimiter);
  }

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
