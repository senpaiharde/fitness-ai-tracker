// src/utils/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body); //  throws on bad input
      next();
    } catch (err: any) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
  };
