import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import LearningSession, { ILearningSession } from '../models/LearningSeason';
import LearningSeason from '../models/LearningSeason';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const dataParam = req.query.date as string | undefined;
    const filter: any = { userId: req.user!.id };
    if (dataParam) {
      filter.date = new Date(dataParam);
    }
    const sessions = await LearningSession.find(filter)
      .sort({ startTime: 1 })
      .lean<ILearningSession>();
    res.json(sessions);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not fetch learning sessions' });
  }
});

router.post('/', async (req, res): Promise<any> => {
  try {
    const payload = {
      userId: req.user!.id,
      date: new Date(req.body.date),
      topic: req.body.topic,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      notes: req.body.notes,
    };
    const session = await LearningSeason.create(payload);
    res.status(201).json(session);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not create learning session' });
  }
});

router.put('/:id', async (req, res): Promise<any> => {
  try {
    const updates: Partial<ILearningSession> = { ...req.body };
    if (updates.date) updates.date = new Date(updates.date as any);
    const updated = await LearningSeason.findByIdAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { $set: updates },
      { new: true }
    ).lean<ILearningSession>();
    if (!updated) return res.status(404).json({ err: 'not found' });
    res.json(updated);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ err: 'could not update session' });
  }
});


router.delete('/:id', async (req,res): Promise<any>=> {
    try{
        const result = await LearningSeason.deleteOne({
            _id: req.params.id,
            userId: req.user!.id
        })
        if(result.deletedCount === 0) return res.status(404).json({error: 'not found'})
            res.sendStatus(204);
    }catch(err:any){
        console.error(err)
        res.status(500).json({err: ' could not delete session'})
    }
})

export default router;