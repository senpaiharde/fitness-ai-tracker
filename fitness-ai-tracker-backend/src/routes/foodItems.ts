import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authmiddleware';
import FoodItem, { IFoodItem } from '../models/FoodItem';
import { z } from 'zod';
import { validate } from '../utils/validate';
import dotenv from "dotenv";
dotenv.config();
const router = Router();
router.use(authMiddleware);




const USDA_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

router.get('/search',async (req,res): Promise<any> => {
    try{
        const q = (req.query.q as string)?.trim();
  if (!q) return res.json([]);

  /* 1. Try Mongo cache first */
  const cached = await FoodItem.find({
    name: { $regex: q, $options: "i" },
  })
    .limit(15)
    .lean();
  if (cached.length) return res.json(cached);

  /* 2. Hit USDA */
  const usda = await fetch(
    `${USDA_URL}?query=${encodeURIComponent(q)}&pageSize=10&api_key=${
      process.env.USDA_KEY
    }`
  ).then((r) => r.json());

  if (!usda.foods?.length) return res.json([]);

  /* 3. Map → FoodItem shape */
  const mapped = usda.foods.map((f: any) => {
    const get = (n: string) =>
      f.foodNutrients.find((x: any) => x.nutrientName === n)?.value ?? 0;
    return {
      name: f.description,
      servingSizeGrams: f.servingSize || 100,
      calories: get("Energy"),
      macros: {
        protein: get("Protein"),
        carbs: get("Carbohydrate, by difference"),
        fat: get("Total lipid (fat)"),
      },
    };
  });

  /* 4. Cache them (ignore dup errors) */
  await FoodItem.insertMany(mapped, { ordered: false }).catch(() => {});
  res.json(mapped);
    }catch (err: any){
        console.error(err);
        res.status(500).json({error: 'error searching item'})
    }
})





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