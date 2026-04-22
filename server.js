const express = require('express');
const mongoose = require('mongoose');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const CandidateRoutes = require('./routes/candidateRoutes');
app.use('/api/user', userRoutes);
app.use('/api/candidate', CandidateRoutes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
