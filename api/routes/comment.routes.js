import express from 'express'
import { create, getPostComments } from '../controllers/comment.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/create', verifyToken, create)
router.get('/getPostComments/:postId', getPostComments)

export default router
