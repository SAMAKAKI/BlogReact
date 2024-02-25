import express from 'express';
import { updateUser, deleteUser, signOut, getUsers } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/getUsers', verifyToken, getUsers)
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.post('/sign-out', signOut)


export default router;
