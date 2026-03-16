import mongoose from 'mongoose';
import Challan from './models/Challan.js';
import dotenv from 'dotenv';
dotenv.config();

const updatePaidAt = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-rto');
    console.log('Connected to MongoDB');

    const paidChallans = await Challan.find({ status: 'Paid', paid_at: { $exists: false } });
    console.log(`Found ${paidChallans.length} paid challans without paid_at timestamps.`);

    for (const challan of paidChallans) {
      // Assign a random time within the last 12 hours to make it look "recent"
      const randomOffset = Math.floor(Math.random() * 12 * 60 * 60 * 1000);
      challan.paid_at = new Date(Date.now() - randomOffset);
      await challan.save();
    }

    console.log('Successfully updated paid challans with timestamps.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

updatePaidAt();
