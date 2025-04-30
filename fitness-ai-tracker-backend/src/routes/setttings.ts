import { Router, Request, Response, request } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import UserSettings, { IUserSettings } from '../models/UserSettings';
import { json } from 'stream/consumers';


const router  = Router()
router.use(authMiddleware);


router.get('/', async (req:Request, res: Response): Promise<any> => {
    try{
        let settings = await UserSettings.findOne(
            {userId: req.user!.id},
            { $setOnInsert: { userId: req.user!.id } },
        { new: true, upsert: true })
        .lean<IUserSettings>();
       res.json(settings)
    }catch(err: any){
        console.log(err);
        res.status(500).json({err: 'could not fetch settings'})

    }
})

router.get('/',async (req:Request, res: Response): Promise<any> => {
    try{
        const allowed = [
            'preferredWakeTime','preferredSleepTime',
      'learningFocusAreas','supplementProtocols',
      'dailyLogReminder','weeklyReviewDay'
        ] as const ;
        const updates: Partial<IUserSettings> = {};
        for (const key of allowed){
            if(req.body[key] !== undefined){
                (updates as any)[key] = req.body[key]
            }
        }
        const settings = await UserSettings
        .findByIdAndUpdate(
            {userId : req.body!.id},
            {$set: updates},
            {new: true, upsert: true}
        )
        .lean<IUserSettings>();
        res.json(settings);
 }catch(err: any){
    console.error(err)
    res.status(500).json({errpr: 'could not update settings'})
 }
})

export default router;