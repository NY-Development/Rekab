import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

function formatZodError(error: z.ZodError) {
  const messages = error.issues.map((e) => {
    const path = e.path.length > 0 ? `${e.path.join('.')}: ` : '';
    return `${path}${e.message}`;
  });
  return messages;
}

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof z.ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: formatZodError(err),
    });
    return;
  }

  // Application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue || {})[0] || 'field';
    res.status(409).json({
      status: 'error',
      message: `Duplicate value for '${field}'. Please use a different value.`,
    });
    return;
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values((err as any).errors || {}).map(
      (e: any) => e.message
    );
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: messages,
    });
    return;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      status: 'error',
      message: `Invalid ${(err as any).path}: ${(err as any).value}`,
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again.',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      status: 'error',
      message: 'Token expired. Please log in again.',
    });
    return;
  }

  // Unknown errors
  console.error('Unhandled Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
