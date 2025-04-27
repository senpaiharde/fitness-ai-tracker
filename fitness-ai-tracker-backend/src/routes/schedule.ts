import express from "express";
import { authMiddleware } from "../middleware/authmiddleware";
import ScheduleEntry from "../models/ScheduleEntry";

const router = express.Router();
router.use(authMiddleware);

// GET /api/schedule/2025-04-30
router.get("/:date", async (req, res) => {
  const data = await ScheduleEntry.find({
    userId: req.user!.id,
    date: req.params.date,
  }).lean();
  res.json(data);
});

// PUT /api/schedule/2025-04-30/15
router.put("/:date/:hour", async (req, res) => {
  const { date, hour } = req.params;
  const updates = req.body; // { planned, actual, status }

  const doc = await ScheduleEntry.findOneAndUpdate(
    { userId: req.user!.id, date, hour },
    updates,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(doc);
});

// DELETE /api/schedule/2025-04-30/15
router.delete("/:date/:hour", async (req, res) => {
  const { date, hour } = req.params;
  await ScheduleEntry.deleteOne({
    userId: req.user!.id,
    date,
    hour: Number(hour),
  });
  res.sendStatus(204);
});

export default router;
