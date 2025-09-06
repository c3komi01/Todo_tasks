import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import todoRouter from './routes/todoRouter.js'
import userRouter from './routes/userRouter.js'  

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 3002

app.use(cors({
  origin: ['http://localhost:5173','http://127.0.0.1:5173'],
  methods: ['GET','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/health', (_req, res) => res.json({ ok: true }))


app.use('/user', userRouter)  
app.use('/', todoRouter)

app.use((err, req, res, _next) => {
  const statusCode = err.status || 500
  res.status(statusCode).json({
    error: { message: err.message || 'Internal server error', status: statusCode }
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} (env=${process.env.NODE_ENV || 'development'})`)
})
