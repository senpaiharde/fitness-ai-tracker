import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import User, { IUser } from '../models/User';
import { z } from 'zod';
import { validate } from '../utils/validate';


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
const userUpdateSchema = z.object({
    fullname:               z.string().max(120).optional(),
    birthdate:              z.coerce.date().optional(),
    weightKg:               z.number().positive().optional(),
    heightCm:               z.number().positive().optional(),
    baselineBodyFatPercent: z.number().min(0).max(100).optional(),
    goals:                  z.array(z.string()).optional(),
    timeZone:               z.string().optional(),
    notificationPrefs:      z.object({ email: z.boolean(), push: z.boolean() }).partial().optional(),
    uiTheme:                z.enum(['light','dark']).optional()
  }).strict();
  
router.put('/me', validate(userUpdateSchema), async (req:Request, res: Response): Promise<any> => {
    try{
       
        const updated = await User.findByIdAndUpdate(
            req.user!.id,
            {$set: req.body},
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