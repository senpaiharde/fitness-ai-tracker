import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import FoodItem, { IFoodItem } from '../models/FoodItem';


const router = Router();
router.use(authMiddleware);

router.get('/', async (_req:Request, res: Response): Promise<any> => {
    try{
        const items = await FoodItem.find().lean<IFoodItem>();
        res.json(items);
    }catch(err: any){
        console.error(err);
        res.status(500).json({error: 'could not fetch food items'})
    }
});

router.get('/:id',async (req,res): Promise<any> => {
    try{
        const item = await FoodItem.findById(req.params.id).lean<IFoodItem>();
        if(!item) return res.status(404).json({error: 'not found'})
            res.json(item);
    }catch (err: any){
        console.error(err);
        res.status(500).json({error: 'error fetching item'})
    }
})


router.post('/',async (req,res):Promise<any> => {
    try{
        const {name, servingSizeGrams, calories, macros} = req.body;
        const newItem = await FoodItem.create({name, servingSizeGrams, calories, macros});
        res.status(201).json(newItem);
    }catch(err: any){
        console.error(err)
        res.status(500).json({error: 'could not add item'})
    }
})


router.put('/:id',async (req,res):Promise<any>=> {
    try{
        const updates = req.body;
        const updated = await FoodItem.findByIdAndUpdate(req.params.id, updates, {new: true})
        .lean<IFoodItem>()
        res.json(updated);
    }catch(err: any){
        console.error(err)
        res.status(500).json({error: 'could not not update item'})
    }
})

router.delete('/:id', async (req,res): Promise<any> => {
    try{
        await FoodItem.findByIdAndUpdate(req.params.id);
        res.sendStatus(204);
    }catch(err:any){
        console.error(err);
        res.status(500).json({error: 'could not delete item'})
    }
})

export default router;