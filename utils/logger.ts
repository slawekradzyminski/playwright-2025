import pino from 'pino';
import path from 'path';
import fs from 'fs';

const logDir = path.resolve(process.cwd(), 'logs');
fs.mkdirSync(logDir, { recursive: true });

/**
 * Base Pino logger.
 * - Console: pino-pretty (colorized, human-readable timestamps)
 * - File:    logs/test.log (JSON, overwritten each run)
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'debug',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss.l',
          ignore: 'pid,hostname',
          messageFormat: '[{context}] {msg}',
        },
        level: 'debug',
      },
      {
        target: 'pino/file',
        options: {
          destination: path.join(logDir, 'test.log'),
          append: false,
        },
        level: 'debug',
      },
    ],
  },
});

/** Returns a child logger scoped to a named context (e.g. 'loginClient'). */
export const createLogger = (context: string) => logger.child({ context });
