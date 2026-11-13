import { Router } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers, getUserById, updateUser, deleteUser } from '../../models/forms/registration.js';
import { requireLogin } from '../../middleware/auth.js';
import { registrationValidation, editValidation } from '../../middleware/validation/forms.js';

const router = Router();

export default router;