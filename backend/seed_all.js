import mongoose from 'mongoose';
import Application from './models/Application.js';
import User from './models/User.js';
import Challan from './models/Challan.js';
import Vehicle from './models/Vehicle.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-rto';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Seeding comprehensive data...');
    
    const citizen = await User.findOne({ email: 'idhu@example.com' });
    if (!citizen) {
      console.log('User idhu@example.com not found.');
      process.exit(1);
    }

    // 1. Seed Vehicles
    await Vehicle.deleteMany({});
    const vehicles = [
      { 
        registration_no: 'MH01AB1234', 
        owner_name: 'Indhu S', 
        vehicle_class: 'LMV', 
        registration_date: new Date('2020-01-15'),
        rto_location: 'Mumbai Central',
        fitness_validity: new Date('2035-01-14'),
        maker_model: 'Maruti Swift',
        fuel_type: 'Petrol', 
        status: 'Active' 
      },
      { 
        registration_no: 'KA01MG5678', 
        owner_name: 'Rajesh Kumar', 
        vehicle_class: 'MCWG', 
        registration_date: new Date('2022-06-20'),
        rto_location: 'Bangalore West',
        fitness_validity: new Date('2037-06-19'),
        maker_model: 'Royal Enfield Classic',
        fuel_type: 'Petrol', 
        status: 'Active' 
      },
      { 
        registration_no: 'DL01CC9999', 
        owner_name: 'Amit Sharma', 
        vehicle_class: 'LMV', 
        registration_date: new Date('2018-11-10'),
        rto_location: 'Delhi North',
        fitness_validity: new Date('2023-11-09'),
        maker_model: 'Hyundai i20',
        fuel_type: 'Diesel', 
        status: 'Expired' 
      }
    ];
    await Vehicle.insertMany(vehicles);
    console.log('Vehicles seeded.');

    // 2. Seed Challans
    await Challan.deleteMany({});
    const challans = [
      { 
        challan_id: 'CHLN-001', 
        vehicle_no: 'MH01AB1234', 
        date: new Date(), 
        location: 'Linking Road, Bandra',
        violation: 'No Helmet', 
        amount: 500, 
        status: 'Unpaid' 
      },
      { 
        challan_id: 'CHLN-002', 
        vehicle_no: 'MH01AB1234', 
        date: new Date(Date.now() - 86400000 * 10), 
        location: 'Western Express Highway',
        violation: 'Over Speeding', 
        amount: 1000, 
        status: 'Paid' 
      },
      { 
        challan_id: 'CHLN-003', 
        vehicle_no: 'KA01MG5678', 
        date: new Date(Date.now() - 86400000 * 2), 
        location: 'MG Road, Bangalore',
        violation: 'Drink & Drive', 
        amount: 2000, 
        status: 'Unpaid' 
      }
    ];
    await Challan.insertMany(challans);
    console.log('Challans seeded.');

    // 3. Seed Applications
    await Application.deleteMany({});
    const apps = [
      {
        tracking_id: 'APP-LRN-1001',
        service_type: 'Learner License',
        user_id: citizen._id,
        applicant_name: 'Indhu S',
        dob: new Date('1995-05-15'),
        address: 'Mumbai, Maharashtra',
        processing_rto: 'MH-01',
        status: 'Pending',
        submission_date: new Date(),
        steps: [{ title: 'Application Submitted', desc: 'Received successfully.', completed: true, date: '16/03/2024' }]
      },
      {
        tracking_id: 'APP-REG-2002',
        service_type: 'Vehicle Registration',
        user_id: citizen._id,
        applicant_name: 'Indhu S',
        dob: new Date('1995-05-15'),
        address: 'Mumbai, Maharashtra',
        processing_rto: 'MH-01',
        status: 'Approved',
        submission_date: new Date(Date.now() - 86400000 * 2),
        steps: [
          { title: 'Application Submitted', desc: 'Received.', completed: true, date: '14/03/2024' },
          { title: 'Document Verification', desc: 'Success.', completed: true, date: '15/03/2024' }
        ]
      },
      {
        tracking_id: 'APP-PLN-3003',
        service_type: 'Permanent License',
        user_id: citizen._id,
        applicant_name: 'Indhu S',
        dob: new Date('1995-05-15'),
        address: 'Mumbai, Maharashtra',
        processing_rto: 'MH-01',
        status: 'Under Review',
        submission_date: new Date(Date.now() - 86400000 * 5),
        steps: [{ title: 'Application Submitted', desc: 'Received.', completed: true, date: '11/03/2024' }]
      }
    ];
    await Application.insertMany(apps);
    console.log('Applications seeded.');

    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
