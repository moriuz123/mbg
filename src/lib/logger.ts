import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: 'mbg-sumedang-service' },
  transports: [
    // Standard out console logging
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

// If we're not in Vercel/Serverless and in Node environment, we can save to files
if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  // Dalam lingkungan Docker production yang sesungguhnya (bukan serverless), 
  // kita biasanya me-mount volume /var/log/app untuk error.log
  logger.add(
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs/error.log'), 
      level: 'error' 
    })
  );
  logger.add(
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs/combined.log') 
    })
  );
}
