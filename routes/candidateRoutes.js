const express = require('express');
const router = express.Router();

const Candidate = require('../models/candidate');
const User = require('../models/user');
const { jwtAuthMiddleware } = require('../jwt');

/**
 * 🔹 ADMIN CHECK
 */
const isAdmin = async (id) => {
  const user = await User.findById(id);
  return user && user.role === 'admin';
};

/**
 * 🔹 CREATE CANDIDATE (ADMIN)
 */
router.post('/', jwtAuthMiddleware, async (req, res) => {
  if (!(await isAdmin(req.user.id))) {
    return res.status(403).json({ message: 'Admin only' });
  }

  const candidate = new Candidate(req.body);
  await candidate.save();

  res.json({ message: 'Candidate created' });
});

/**
 * 🔹 GET CANDIDATES
 */
router.get('/', jwtAuthMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);

  let candidates;

  if (user.role === 'admin') {
    // Admin sees vote count
    candidates = await Candidate.find();
  } else {
    // Voter should not see vote count
    candidates = await Candidate.find().select('-voteCount -votes');
  }

  res.json(candidates);
});

/**
 * 🔹 UPDATE CANDIDATE (ADMIN)
 */
router.put('/:id', jwtAuthMiddleware, async (req, res) => {
  if (!(await isAdmin(req.user.id))) {
    return res.status(403).json({ message: 'Admin only' });
  }

  const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(candidate);
});

/**
 * 🔹 DELETE CANDIDATE (ADMIN)
 */
router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
  if (!(await isAdmin(req.user.id))) {
    return res.status(403).json({ message: 'Admin only' });
  }

  await Candidate.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

/**
 * 🔹 VOTE (USER ONLY)
 */
router.post('/vote/:id', jwtAuthMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.role === 'admin') {
    return res.status(403).json({ message: 'Admin cannot vote' });
  }

  if (user.isVoted) {
    return res.status(400).json({ message: 'Already voted' });
  }

  const candidate = await Candidate.findById(req.params.id);

  candidate.votes.push({ user: user._id });
  candidate.voteCount++;

  await candidate.save();

  user.isVoted = true;
  await user.save();

  res.json({ message: 'Vote successful' });
});

/**
 * 🔹 RESULTS (ADMIN ONLY)
 */
router.get('/results', jwtAuthMiddleware, async (req, res) => {
  if (!(await isAdmin(req.user.id))) {
    return res.status(403).json({ message: 'Admin only' });
  }

  const results = await Candidate.find().sort({ voteCount: -1 });
  res.json(results);
});

module.exports = router;