import mongoose from 'mongoose';
import Vehicle from './models/Vehicle.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-rto';

const exampleVehicles = [
  {
    registration_no: 'MH01AB1234',
    owner_name: 'Indhu S',
    vehicle_class: 'Motor Car (LMV)',
    registration_date: new Date('2020-01-15'),
    rto_location: 'Mumbai South (MH01)',
    fitness_validity: new Date('2035-01-14'),
    maker_model: 'HONDA CITY i-VTEC',
    fuel_type: 'PETROL',
    status: 'Active'
  },
  {
    registration_no: 'KA01MG5678',
    owner_name: 'Rajesh Kumar',
    vehicle_class: 'Motor Cycle',
    registration_date: new Date('2022-08-20'),
    rto_location: 'Bangalore Central (KA01)',
    fitness_validity: new Date('2037-08-19'),
    maker_model: 'ROYAL ENFIELD CLASSIC 350',
    fuel_type: 'PETROL',
    status: 'Active'
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for vehicle seeding');
    
    // Clear existing records for these vehicles
    await Vehicle.deleteMany({ registration_no: { $in: ['MH01AB1234', 'KA01MG5678'] } });
    
    await Vehicle.insertMany(exampleVehicles);
    console.log('Example vehicles seeded successfully');
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error seeding vehicles:', err);
    mongoose.disconnect();
  });
