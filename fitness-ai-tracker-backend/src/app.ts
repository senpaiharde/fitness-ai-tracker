import express from 'express'
import cors    from 'cors'
import helmet  from 'helmet'
import morgan  from 'morgan'
import dotenv  from 'dotenv'

import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import scheduleRouter from './routes/schedule'
import settingsRouter from './routes/setttings'
import foodItemRouter from './routes/foodItems';
import foodLogRouter from './routes/foodLogs'
import supplementsRouter from './routes/supplementIntake';
import compoundInjectionRouter from './routes/compoundInjection'
import learningRouter from './routes/learning'
import goalsRouter from './routes/goals'
import summariesRouter from './routes/summaries'

dotenv.config()
const app = express()
app.use((req, res, next) => {
    console.log(`→ [REQ] ${req.method} ${req.path}`)
    next()
  })
app.use(helmet())
app.use(morgan('dev'))
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }))
app.use(express.json())


app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/settings', settingsRouter)
app.use('/food-Items', foodItemRouter);
app.use('/food-logs', foodLogRouter);
app.use('/supplements', supplementsRouter)
app.use('/supplements', compoundInjectionRouter)
app.use('/learning', learningRouter)
app.use('/goals', goalsRouter)
app.use('/summaries', summariesRouter)




console.log('✅ User routes loaded')





console.log('✅ profile routes loaded')
app.use('/schedule', scheduleRouter)
console.log('✅ Schedule routes loaded')

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

export default app
