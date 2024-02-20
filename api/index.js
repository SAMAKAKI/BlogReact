import express from 'express'
import mongoose from 'mongoose'
import doenv from 'dotenv'
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';

doenv.config()

mongoose.connect(process.env.MONGO).then(() => {
  console.log('MongoDB is connected')
}).catch((err) => {
  console.log(err)
})

const app = express()
app.use(cors())
app.use(express.json());
app.use(cookieParser())
app.use((err, req, res, next) => {
  const statusCode  = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
