import express from 'express';
import { signUp, verifyOtp, login, updateAdmin, getAllAdmins, getAdminById, deleteAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.put('/:adminId', updateAdmin);
router.get('/alladmin', getAllAdmins);
router.get('/:adminId', getAdminById);
router.delete('/:adminId', deleteAdmin);

export default router;
