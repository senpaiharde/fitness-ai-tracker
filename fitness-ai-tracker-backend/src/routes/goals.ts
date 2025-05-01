import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import Goal, { IGoal }   from '../models/Goal';

import { z } from 'zod';
import { validate } from '../utils/validate';


const router = Router();
router.use(authMiddleware);

router.get('/', async (_req,res): Promise<any> => {
    try{
        const goals = await Goal.find({ userId: (_req as any).user.id }).lean<IGoal>();
        res.json(goals);
    }catch(err: any){
        console.error(err)
        res.status(500).json({err: 'could not fetch goals'})
    }
})
export const createLearning = z
  .object({
    date: z.coerce.date(),
    title: z.string().min(1).max(120),
    description: z.string().max(200).optional(),
    createdAt: z.string().datetime().optional(),
    targetDate: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .optional(),
      status: z.enum(['active','paused','completed']).optional(),
  })
  .strict();

export const updateLearning = createLearning.partial().extend({
    title: z.string().min(1).max(120),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .optional(),
});
router.put('/:id',validate(updateLearning),async (req,res): Promise<any> => {
    try{
        const updated = await Goal.findByIdAndUpdate(
              { _id: req.params.id, userId: req.user!.id }, // owner check
              { $set: req.body },
              { new: true, runValidators: true }
        )
        .lean<IGoal>();
        if(!updated) return res.status(404).json({error: 'not found'})
            res.json(updated)
    }catch(err: any){
        console.error(err)
        res.status(500).json({err: 'could not update session'})
    }
})


router.delete('/:id', async (req,res): Promise<any> => {
    try{
        const result = await Goal.deleteOne({
            _id: req.params.id,
            userId: req.user!.id
        })
        if(result.deletedCount === 0) return res.status(404).json({error: 'not found'})
            res.status(204)
    }catch(err: any){
        console.error(err)
        res.status(500).json({err: 'could not delete session'})
    }
})


export default router;