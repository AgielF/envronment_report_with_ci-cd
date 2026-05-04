import express from 'express';
import { register, login } from '../controllers/authController.js';
// Import rules dan fungsi validate
import { registerValidationRules, validate } from '../middlewares/validator.js';

const router = express.Router();

// Register dengan validasi
router.post('/register', registerValidationRules, validate, register);

// Login (biasanya validasi login cukup simpel, bisa ditambahkan jika perlu)
router.post('/login', login);

export default router;