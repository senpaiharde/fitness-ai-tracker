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
        if(start && end){
            filter.periodStart = { $gte: new Date(start) };
      filter.periodEnd   = { $lte: new Date(end) };
        }
        const list = await Summary.find(filter).sort({periodStart: -1}).lean<ISummary>();
        res.json(list);
    }catch(err:any){
        console.error(err)
        res.status(500).json({err: 'could not fetch summarius'})
    }
})

router.post('/', async (req,res): Promise<any>=> {
    try{
        const payload = {
            userId: req.user!.id,
            periodType: req.body.periodType,
            periodStart: new Date(req.body.periodStart),
            periodEnd: new Date(req.body.periodEnd),
            metrics: req.body.metrics,
            biggestWins: req.body.biggestWins,
      mainProblems:req.body.mainProblems,
      adjustmentPlan: req.body.adjustmentPlan
        };
        const summary = await Summary.create(payload)
        res.status(201).json(summary)
    }catch(err: any){
        console.error(err)
        res.status(500).json({err: 'could not create summary'})
    }
})

export default router;