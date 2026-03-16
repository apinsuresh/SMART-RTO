import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-rto';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding');
    
    // Create citizen
    let citizen = await User.findOne({ email: 'test@test.com' });
    if (!citizen) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash('password', salt);
      citizen = new User({ name: 'Test Citizen', email: 'test@test.com', password_hash, role: 'citizen' });
      await citizen.save();
      console.log('Citizen test@test.com created with password "password"');
    } else {
      console.log('Citizen test@test.com already exists');
    }

    // Create officer
    let officer = await User.findOne({ email: 'admin@rto.com' });
    if (!officer) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash('admin123', salt);
      officer = new User({ name: 'RTO Officer', email: 'admin@rto.com', password_hash, role: 'officer' });
      await officer.save();
      console.log('Officer admin@rto.com created with password "admin123"');
    } else {
      console.log('Officer admin@rto.com already exists');
    }

    mongoose.disconnect();
    console.log('Seeding complete.');
  })
  .catch(err => {
    console.error('Database connection error:', err);
    mongoose.disconnect();
  });
