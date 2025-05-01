import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import FoodItem, { IFoodItem } from '../models/FoodItem';
import { z } from 'zod';
import { validate } from '../utils/validate';

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

export const foodItemSchema = z.object({
    name:             z.string().min(1).max(120),
    servingSizeGrams: z.number().positive(),
    calories:         z.number().nonnegative(),
    macros: z.object({
      protein: z.number().nonnegative(),
      carbs:   z.number().nonnegative(),
      fat:     z.number().nonnegative()
    }).strict()
  }).strict();



router.post('/',validate(foodItemSchema),async (req,res):Promise<any> => {
    try{
        const newItem = await FoodItem.create(req.body)
        res.status(201).json(newItem);
    }catch(err: any){
        console.error(err)
        res.status(500).json({error: 'could not add item'})
    }
})





router.put('/:id',validate(foodItemSchema.partial()),    async (req,res):Promise<any>=> {
    try{
       
        const updated = await FoodItem.findByIdAndUpdate(
            req.body.id , {$set: req.body}, {new : true, runValidators: true}
        )
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