const mongoose = require('mongoose');

// Replace with your actual MongoDB URI
const mongoURI = 'mongodb://127.0.0.1:27017/mydatabase';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

db.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});
