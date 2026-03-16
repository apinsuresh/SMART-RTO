import mongoose from 'mongoose';
import Challan from './models/Challan.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-rto';

const exampleChallans = [
  {
    challan_id: 'CHLN-2024-88291',
    vehicle_no: 'MH01AB1234',
    date: new Date('2024-03-10T14:30:00'),
    location: 'Marine Lines, Mumbai',
    violation: 'Over Speeding',
    amount: 1000,
    status: 'Unpaid'
  },
  {
    challan_id: 'CHLN-2024-11023',
    vehicle_no: 'MH01AB1234',
    date: new Date('2024-02-15T10:15:00'),
    location: 'Worli Sea Link, Mumbai',
    violation: 'No Seatbelt',
    amount: 500,
    status: 'Paid',
    payment_txn_id: 'TXN-ABC123XYZ'
  },
  {
    challan_id: 'CHLN-2024-55610',
    vehicle_no: 'KA01MG5678',
    date: new Date('2024-03-12T18:45:00'),
    location: 'MG Road, Bangalore',
    violation: 'Wrong Side Driving',
    amount: 2000,
    status: 'Unpaid'
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for challan seeding');
    
    // Clear existing challans for these vehicles to avoid duplicates in demo
    await Challan.deleteMany({ vehicle_no: { $in: ['MH01AB1234', 'KA01MG5678'] } });
    
    await Challan.insertMany(exampleChallans);
    console.log('Example challans seeded successfully');
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error seeding challans:', err);
    mongoose.disconnect();
  });
