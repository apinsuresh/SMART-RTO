import mongoose from 'mongoose';
import Application from './models/Application.js';
import User from './models/User.js';
import Challan from './models/Challan.js';
import Vehicle from './models/Vehicle.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-rto';

const firstNames = ['Amit', 'Rajesh', 'Suresh', 'Priya', 'Indhu', 'Sneha', 'Rahul', 'Anjali', 'Vikram', 'Neha'];
const lastNames = ['S', 'Kumar', 'Sharma', 'Patil', 'Gupta', 'Verma', 'Singh', 'Deshmukh', 'Menon', 'Iyer'];
const rtoLocations = ['Mumbai South', 'Mumbai North', 'Pune Central', 'Bangalore East', 'Delhi North', 'Chennai City', 'Hyderabad Cyberabad', 'Kolkata Central'];
const vehicleModels = ['Maruti Swift', 'Hyundai i20', 'Honda City', 'Toyota Fortuner', 'Royal Enfield Classic', 'Honda Activa', 'Yamaha R15', 'Tata Nexon'];
const violations = ['No Helmet', 'Over Speeding', 'Signal Jump', 'Drink & Drive', 'Wrong Way', 'No Seatbelt', 'Mobile while Driving'];
const serviceTypes = ['Learner License', 'Permanent License', 'Vehicle Registration'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Seeding Ultra-Comprehensive Data (25+ records per category)...');
    
    const citizen = await User.findOne({ email: 'idhu@example.com' });
    if (!citizen) {
      console.log('User idhu@example.com not found. Please run seed.js first.');
      process.exit(1);
    }

    // 1. Seed Vehicles (20 records)
    await Vehicle.deleteMany({});
    const vehicles = [];
    for (let i = 0; i < 20; i++) {
      const reg = `${getRandom(['MH', 'KA', 'DL', 'TS', 'TN'])}${Math.floor(Math.random() * 99)}${getRandom(['AB', 'CD', 'XY', 'ZZ'])}${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
      vehicles.push({
        registration_no: reg,
        owner_name: `${getRandom(firstNames)} ${getRandom(lastNames)}`,
        vehicle_class: getRandom(['LMV', 'MCWG', 'HMV']),
        registration_date: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 3000)),
        rto_location: getRandom(rtoLocations),
        fitness_validity: new Date(Date.now() + 86400000 * Math.floor(Math.random() * 5000)),
        maker_model: getRandom(vehicleModels),
        fuel_type: getRandom(['Petrol', 'Diesel', 'EV', 'CNG']),
        status: getRandom(['Active', 'Active', 'Active', 'Expired'])
      });
    }
    // Ensure user's vehicle is there
    vehicles.push({
      registration_no: 'MH01AB1234', owner_name: 'Indhu S', vehicle_class: 'LMV', registration_date: new Date(),
      rto_location: 'Mumbai Central', fitness_validity: new Date(Date.now() + 1e12), maker_model: 'Maruti Swift', fuel_type: 'Petrol', status: 'Active'
    });
    await Vehicle.insertMany(vehicles);
    console.log('Vehicles expanded.');

    // 2. Seed Challans (50 records)
    await Challan.deleteMany({});
    const challans = [];
    for (let i = 0; i < 50; i++) {
        const targetVehicle = getRandom(vehicles);
        challans.push({
            challan_id: `CHLN-${1000 + i}`,
            vehicle_no: targetVehicle.registration_no,
            date: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 60)),
            location: getRandom(['Main Street', 'Expressway', 'City Junction', 'Shopping Mall Parking', 'Airport Road']),
            violation: getRandom(violations),
            amount: getRandom([100, 200, 500, 1000, 2000]),
            status: getRandom(['Paid', 'Unpaid'])
        });
    }
    await Challan.insertMany(challans);
    console.log('Challans expanded.');

    // 3. Seed Applications (30 records)
    await Application.deleteMany({});
    const apps = [];
    for (let i = 0; i < 30; i++) {
        const status = getRandom(['Pending', 'Approved', 'Rejected', 'Under Review']);
        const type = getRandom(serviceTypes);
        apps.push({
            tracking_id: `APP-ULT-${5000 + i}`,
            service_type: type,
            user_id: citizen._id,
            applicant_name: `${getRandom(firstNames)} ${getRandom(lastNames)}`,
            dob: new Date('1990-01-01'),
            address: 'Somwhere in India',
            processing_rto: getRandom(rtoLocations),
            status: status,
            submission_date: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 30)),
            steps: [{ title: 'Application Submitted', desc: 'Received.', completed: true, date: '16/03/2024' }]
        });
    }
    await Application.insertMany(apps);
    console.log('Applications expanded.');

    console.log('ULTRA SEEDING COMPLETE.');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
