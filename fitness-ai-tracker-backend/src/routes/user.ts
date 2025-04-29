// src/routes/user.ts
import { Router, Request, Response } from 'express'
import { authMiddleware }    from '../middleware/authmiddleware'
import User                  from '../models/User'
import ScheduleEntry         from '../models/ScheduleEntry'

const router = Router()

// apply auth to *all* /user/* routes
router.use(authMiddleware)

/**
 * GET /user/profile
 * -> returns just the profile sub-doc (age, height, weight, enchancementLog)
 */
router.get('/profile', async (req: Request, res: Response): Promise<any> => {
  console.log('🔍 GET /user/profile')
  const user = await User.findById((req as any).user.id)
    .select('profile')
    .lean()

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  // send back the profile object directly
  return res.json(user.profile)
})

/**
 * GET /user/me
 * -> returns full user + scheduleEntries
 */
router.get('/me', async (req: Request, res: Response): Promise<any> => {
  console.log('🗓️ GET /user/me')
  const userDoc = await User.findById((req as any).user.id)
    .select('-passwordHash')
    .lean()

  if (!userDoc) {
    return res.status(404).json({ error: 'User not found' })
  }

  // fetch all entries for this user
  const scheduleEntries = await ScheduleEntry.find({ userId: (req as any).user.id })
    .sort({ date: 1, hour: 1 })
    .lean()

  console.log('    → found', scheduleEntries.length, 'entries')

  // merge into one object
  const result = {
    ...userDoc,
    scheduleEntries,
  }

  return res.json(result)
})

/**
 * PATCH /user/me
 * -> update profile fields (age, height, weight, etc.)
 */
router.patch('/me', async (req: Request, res: Response): Promise<any> => {
  console.log('✏️ PATCH /user/me', req.body)
  const updates = Object.fromEntries(
    Object.entries(req.body).map(([k, v]) => ([`profile.${k}`, v]))
  )

  const updatedDoc = await User.findByIdAndUpdate(
    (req as any).user.id,
    { $set: updates },
    { new: true }
  )
    .select('-passwordHash')
    .lean()

  if (!updatedDoc) {
    return res.status(404).json({ error: 'User not found' })
  }
  return res.json(updatedDoc)
})

export default router;
