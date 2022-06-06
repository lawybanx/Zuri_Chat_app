import express from 'express';
import {
  getUsers,
  registerUser,
  loginUser,
} from '../../controllers/userController.js';
import { check } from 'express-validator';
import { auth } from '../../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(auth, getUsers)
  .post(
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email is required').notEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    registerUser
  );

router.post(
  '/login',

  check('email', 'Email is required').notEmpty(),
  check('email', 'Email is not valid').isEmail(),
  check('password', 'Password is required').notEmpty(),
  loginUser
);

export default router;
