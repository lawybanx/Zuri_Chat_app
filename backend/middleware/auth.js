import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
// Bring in Model
import User from '../models/User.js';

export const auth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Add user from payload
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Token is not valid');
    }
  }
  if (!token) {
    // Check for token
    res.status(401);
    throw new Error('No token, authorization denied');
  }
});
