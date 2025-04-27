import express from "express";
import { authMiddleware } from '../middleware/authmiddleware';
import ScheduleEntry from "../models/ScheduleEntry";

const router = express.Router();
router.use(authMiddleware)

router.get('/:date',async (req,res) => {
    const data = await ScheduleEntry.find({
        userId: req.user?.id,
        date: req.params.date,

    }).lean();
    res.json(data)
})

router.put("/:date/:hour", async (req,res) => {
  const { date, hour } = req.params;
  const updates = req.body;
  const doc = await ScheduleEntry.findByIdAndUpdate(
    {userId: req.user?.id, date,hour},
    updates,
    {new: true, upsert:true, setDefaultsOnInsert: true}
  );
  res.json(doc);
})


router.delete('/:date/:hour', async (req,res) => {
    await ScheduleEntry.findByIdAndDelete({
        userId: req.user?.id,
        date: req.body.date,
        hour: req.body.hour
    })
    res.sendStatus(204);
})

export default router;