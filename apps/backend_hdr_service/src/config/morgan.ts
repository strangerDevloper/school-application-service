import { Request, Response } from 'express';
import morgan from 'morgan';

// Add token for timestamp in ISO format
morgan.token('time', () => {
  return new Date().toISOString();
});

// Add token for request body with sensitive data filtering
morgan.token('req-body', (req: Request) => {
  if (req.method === 'GET') return '';
  const sanitizedBody = { ...req.body };
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'authorization', 'credit_card'];
  sensitiveFields.forEach((field) => {
    if (sanitizedBody[field]) sanitizedBody[field] = '[FILTERED]';
  });
  return JSON.stringify(sanitizedBody);
});

// Create custom format
const customFormat = ':time [:status] ":method :url" :response-time ms - :res[content-length] - :req-body';

// Export configured morgan middleware
const morganMiddleware = morgan(customFormat, {
  skip: (req) => {
    // Skip logging for health check endpoints
    return req.url?.includes('healthCheck') ?? false;
  },
});

export default morganMiddleware;
