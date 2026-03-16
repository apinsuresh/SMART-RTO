import mongoose from 'mongoose';
import Application from './models/Application.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-rto';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Seeding applications...');
    const citizen = await User.findOne({ email: 'idhu@example.com' });
    if (!citizen) {
      console.log('Citizen not found. Please register idhu@example.com first.');
      process.exit(1);
    }

    const apps = [
      {
        tracking_id: 'APP-1023-2024',
        service_type: 'Learner License',
        user_id: citizen._id,
        applicant_name: 'Indhu S',
        dob: '1995-05-15',
        address: 'XXXX',
        processing_rto: 'Mumbai Central',
        status: 'Pending',
        submission_date: new Date('2024-03-10'),
        steps: [{ title: 'Application Submitted', desc: 'Form and initial fees paid.', completed: true, date: '10/03/2024' }]
      },
      {
        tracking_id: 'APP-5561-2024',
        service_type: 'Vehicle Registration',
        user_id: citizen._id,
        applicant_name: 'Indhu S',
        dob: '1995-05-15',
        address: 'XXXX',
        processing_rto: 'Bangalore West',
        status: 'Approved',
        submission_date: new Date('2024-02-28'),
        steps: [
          { title: 'Application Submitted', desc: 'Form and initial fees paid.', completed: true, date: '28/02/2024' },
          { title: 'Document Verification', desc: 'Verified.', completed: true, date: '01/03/2024' },
          { title: 'RTO Approval', desc: 'Approved.', completed: true, date: '05/03/2024' }
        ]
      }
    ];

    await Application.deleteMany({});
    await Application.insertMany(apps);
    console.log('Applications seeded successfully.');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });
