import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import User, { IUser } from '../models/User';


const router = Router()

router.use(authMiddleware);


router.get('/me',async  (req: Request, res: Response): Promise<any>  => {
    try{
        const user = await User.findById(req.user!.id)
        .select('-passwordHash')
        .lean();

       if(!user)return res.status(404).json({error: 'user not found'})

        res.json(user);

    }catch(err:any){
        console.error(err)
        res.status(500).json({error: 'could not fetch user'})
    }
});

router.put('/me', async (req:Request, res: Response): Promise<any> => {
    try{
        const allowed = [
            'fullname','birthdate','weightKg','heightCm',
            'baselineBodyFatPercent','goals',
            'timeZone','notificationPrefs','uiTheme'
        ];
        const updates : Partial<IUser> = {}
        for (const key of allowed) {
            if(req.body[key] !== undefined){
                (updates as any)[key] = req.body[key]
            }
        }
        const updated = await User.findByIdAndUpdate(
            req.user!.id,
            {$set: updates},
            {new : true}
        )
        .select('-passwordHash')
        .lean();
        if(!updated) return res.status(404).json({error: 'user not found'});
        res.json(updated);
    }catch(err: any){
        console.error(err);
        res.status(500).json({error: 'could not update user' })
    }
})

export default router;