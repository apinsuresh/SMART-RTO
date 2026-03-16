import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-rto';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Resetting user passwords...');
    const salt = await bcrypt.genSalt(10);
    
    // Reset citizen
    const citizenPassword = await bcrypt.hash('password', salt);
    await User.updateOne(
      { email: 'idhu@example.com' },
      { password_hash: citizenPassword, role: 'citizen' }
    );
    console.log('Citizen idhu@example.com password set to "password"');

    // Reset officer
    const officerPassword = await bcrypt.hash('admin123', salt);
    await User.updateOne(
      { email: 'admin@rto.com' },
      { password_hash: officerPassword, role: 'officer' }
    );
    console.log('Officer admin@rto.com password set to "admin123"');

    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
