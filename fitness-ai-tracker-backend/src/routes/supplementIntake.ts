import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import SupplementIntake, { ISupplementIntake } from '../models/SupplementIntake';
import { timeStamp } from 'console';


const router = Router();
router.use(authMiddleware);


router.get('/', async (req: Request,res: Response):Promise<any>=> {
    try{
        const dataParam = req.query.date as string | undefined;
        const filter: any = {userId: req.user?.id};
        if(dataParam){
            const dayStart = new Date(dataParam);
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate()+ 1);
            filter.timeStamp = { $gte: dayStart, $lt: dayEnd};
        }
        const logs = await SupplementIntake
        .find(filter)
        .sort({timeStamp: 1})
        .lean<ISupplementIntake>();
        res.json(logs);
    }catch(err: any){
        console.error(err);
        res.status(500).json({error: ' could not fetch supplement intakes'})
    }
})


router.post('/', async (req: Request,res: Response): Promise<any> => {
    try{
        const payload = {
            userId: req.user?.id,
            supplementId: req.body.supplementId,
            timestamp: req.body.timeStamp,
            dosageMg: req.body.dosageMg,
            notes: req.body.notes
        };
        const log = await SupplementIntake.create(payload);
        res.status(201).json(log);
    }catch(err: any){
        console.error(err);
        res.status(500).json({err: 'could not record supplements intake'})
    }
})


router.delete('/:id', async (req: Request,res: Response): Promise<any> => {
    try{
        const result = await SupplementIntake.deleteOne({
            _id: req.params.id,
            userId: req.user?.id
        });
        if(result.deletedCount === 0) return res.status(404).json({error: 'not found'})
        res.sendStatus(204);
    }catch(err: any){
        console.error(err);
        res.status(500).json({err: 'could not delete supplementt intake'})
    }
})

export default router;