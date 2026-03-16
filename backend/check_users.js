import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-rto';

mongoose.connect(MONGO_URI)
  .then(async () => {
    const users = await User.find({}, { name: 1, email: 1, role: 1 });
    console.log('Current Users in DB:');
    console.log(JSON.stringify(users, null, 2));
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
