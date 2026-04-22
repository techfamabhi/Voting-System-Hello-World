const express = require('express');
const router = express.Router();

const User = require('../models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

/**
 * 🔹 CREATE FIRST ADMIN (OPEN)
 */
router.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();

    const token = generateToken({ id: saved._id });

    res.json({ message: 'User created', token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🔹 LOGIN
 */
router.post('/login', async (req, res) => {
  const { aadharCardNumber, password } = req.body;

  const user = await User.findOne({ aadharCardNumber });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken({ id: user._id });

  res.json({ token });
});

/**
 * 🔹 ADMIN: CREATE USER (VOTER ONLY)
 */
// 🔹 ADMIN: CREATE USER (VOTER ONLY)
router.post('/create-user', jwtAuthMiddleware, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);

    // ✅ Only admin allowed
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    const { email, aadharCardNumber } = req.body;

    // ✅ Check duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // ✅ Check duplicate aadhar
    const existingAadhar = await User.findOne({ aadharCardNumber });
    if (existingAadhar) {
      return res.status(400).json({ message: 'Aadhar already exists' });
    }

    // ✅ Create voter (force role)
    const user = new User({
      ...req.body,
      role: 'voter'
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 🔹 ADMIN: GET USERS
 */
router.get('/users', jwtAuthMiddleware, async (req, res) => {
  const admin = await User.findById(req.user.id);

  if (admin.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }

  const users = await User.find().select('-password');
  res.json(users);
});

/**
 * 🔹 ADMIN: UPDATE USER
 */
router.put('/user/:id', jwtAuthMiddleware, async (req, res) => {
  const admin = await User.findById(req.user.id);

  if (admin.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

/**
 * 🔹 ADMIN: DELETE USER
 */
router.delete('/user/:id', jwtAuthMiddleware, async (req, res) => {
  const admin = await User.findById(req.user.id);

  if (admin.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;