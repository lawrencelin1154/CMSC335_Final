require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });

app.use('/api', require('./routes/api'));


// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error({ msg: 'unhandled error', path: req.path, error: err.message });
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
