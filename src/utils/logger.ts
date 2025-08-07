import { createLogger, format, transports } from 'winston';
import path from 'path';

const logFilePath = path.join(__dirname, '../../storage/logs/app.log');

export const logger = createLogger({
  level: 'error', // You can change this to 'info', 'debug', etc.
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack || ''}`;
    })
  ),
  transports: [
    new transports.File({ filename: logFilePath }),
  ],
});
