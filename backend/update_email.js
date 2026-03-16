import mongoose from 'mongoose';
import User from './models/User.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/smart-rto';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Update the email for the test user
    const result = await User.updateOne(
      { email: 'test@test.com' },
      { email: 'idhu@example.com' }
    );
    console.log('Update result:', result);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
