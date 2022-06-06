import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import generateToken from '../utils/generateToken.js';

// Bring in Model
import User from '../models/User.js';

//  @route  GET api/users
//  @desc   Get All Users
//  @access Private

export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password');

  return res.status(200).json(users);
});

//  @route  POST api/users
//  @desc   Register new user
//  @access Public

export const registerUser = asyncHandler(async (req, res, next) => {
  // Get Errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }

  const { name, email, password } = req.body;

  // Check for existing user
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (!user) throw new Error('Something went wrong saving the user');

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});

//  @route  POST api/users/login
//  @desc   Login user
//  @access Public

export const loginUser = asyncHandler(async (req, res) => {
  // Get Errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(401);
    throw new Error('Invalid Email or Password');
  }

  const { email, password } = req.body;

  // Check for existing user
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});
