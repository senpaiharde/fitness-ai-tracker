import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import FoodLog, { IFoodLog } from '../models/FoodLog';



const router = Router();
router.use(authMiddleware);


router.get('/', async (req: Request,res: Response): Promise<any> => {
    try{
        const dataParam = req.query.date as string | undefined;
        const filter : any ={userId: req.user!.id};
        if(dataParam){
            const dayStart = new Date(dataParam);
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);
            filter.timestamp =  {$gte: dayStart, $lt: dayEnd}
        }
        const logs = await FoodLog.find(filter).sort({timeStamp: 1}).lean<IFoodLog>();
        res.json(logs);
    }catch(err: any){
        console.error(err);
        res.status(500).json({err: 'could not fetch food logs'})
    }
})


router.post('/', async (req,res): Promise<any> => {
    try{
        const payload = {
            userId: req.user!.id,
            timeStamp: req.body.timeStamp,
            foodItemId: req.body.foodItemId,
            manualText: req.body.manualText,
            grams: req.body.grams,
            calories: req.body.calories,
            macros: req.body.macros,
            note: req.body.notes,

        };
        const log = await FoodLog.create(payload);
        res.status(201).json(log)
    }catch(err: any){
        console.error(err);
        res.status(500).json({err: 'ccould not create food log'})
    }
})

router.delete('/:id',async (req,res): Promise<any> => {
    try{
        const result = await FoodLog.deleteOne({_id: req.params.id, userId: req.user?.id});
        if(result.deletedCount === 0) return res.status(404).json({err: 'not found'})
        res.status(204);
    }catch(err: any){
        console.error(err);
        res.status(500).json({err: 'could not delete foo log'})
    }
})

export default router;