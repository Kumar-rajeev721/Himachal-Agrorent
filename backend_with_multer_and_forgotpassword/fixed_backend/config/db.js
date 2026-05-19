const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI ||
  'mongodb://kumarrajeev6785:rajeev1600@ac-htsjwpx-shard-00-00.k9xhdqs.mongodb.net:27017,ac-htsjwpx-shard-00-01.k9xhdqs.mongodb.net:27017,ac-htsjwpx-shard-00-02.k9xhdqs.mongodb.net:27017/?ssl=true&replicaSet=atlas-12pxq7-shard-0&authSource=admin&appName=Project';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected to Database successfully ***');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error('');
    console.error('ACTION NEEDED: Your IP is not whitelisted in MongoDB Atlas!');
    console.error('Go to: https://cloud.mongodb.com');
    console.error('  -> Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0)');
    console.error('');
    process.exit(1);
  }
};

module.exports = connectDB;
