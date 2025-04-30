import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import Goal, { IGoal }   from '../models/Goal';
import LearningSession, { ILearningSession } from '../models/LearningSeason';


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


router.put('/:id',async (req,res): Promise<any> => {
    try{
        const updates: Partial<ILearningSession> = {...req.body}
        if(updates.date) updates.date = new Date(updates.date as any)
            const updated = await LearningSession
        .findByIdAndUpdate(
            {_id: req.params.id, userId: req.user!.id},
            {$set : updates},
            {new : true}
        )
        .lean<ILearningSession>();
        if(!updated) return res.status(404).json({error: 'not found'})
            res.json(updated)
    }catch(err: any){
        console.error(err)
        res.status(500).json({err: 'could not update session'})
    }
})


router.delete('/:id', async (req,res): Promise<any> => {
    try{
        const result = await LearningSession.deleteOne({
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