// src/utils/validate.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';

// returns an Express-compatible middleware
export const validate =
  <T extends ZodSchema>(schema: T): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): any => {
    try {
      // Parse + coerce; overwrite body with safe, typed data
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: err.errors, // array of { path, message }
        });
      }
      next(err);
    }
  };
