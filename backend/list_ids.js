import mongoose from 'mongoose';
import User from './models/User.js';
import Application from './models/Application.js';
import Challan from './models/Challan.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-rto';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('--- DATABASE IDS ---');
    
    const users = await User.find({}, 'name email role');
    console.log('\nUsers:');
    users.forEach(u => console.log(`- ${u.name} (${u.email}) [${u.role}]`));

    const apps = await Application.find({}, 'tracking_id service_type applicant_name');
    console.log('\nRecent Applications:');
    apps.slice(-3).forEach(a => console.log(`- ID: ${a.tracking_id} | ${a.service_type} | ${a.applicant_name}`));

    const challans = await Challan.find({}, 'challan_id vehicle_no violation');
    console.log('\nExample Challans:');
    challans.slice(-3).forEach(c => console.log(`- ID: ${c.challan_id} | Vehicle: ${c.vehicle_no} | ${c.violation}`));

    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
