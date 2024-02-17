import express from 'express'
import mongoose from 'mongoose'
import doenv from 'dotenv'
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';

doenv.config()

mongoose.connect(process.env.MONGO).then(() => {
  console.log('MongoDB is connected')
}).catch((err) => {
  console.log(err)
})

const app = express()
app.use(express.json());

app.listen(3000, () => {
  console.log('Server running on port 3000')
})

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
