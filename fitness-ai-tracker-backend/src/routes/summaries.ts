import { Router, Request, Response } from 'express';
import { authMiddleware }    from '../middleware/authmiddleware';
import Summary, { ISummary } from '../models/Summary';


const router = Router();
router.use(authMiddleware);

router.get('/', async (req:Request, res: Response): Promise<any> => {
    try{
        const {periodType, start,end} = req.query as any;
        const filter : any = {userId: req.user!.id};
        if(periodType) filter.periodType = periodType;
    }
})