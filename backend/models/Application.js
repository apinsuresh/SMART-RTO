import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  tracking_id: { type: String, required: true, unique: true, index: true },
  service_type: { type: String, required: true, enum: ['Learner License', 'Permanent License', 'Vehicle Registration'] },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicant_name: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Under Review', 'Approved', 'Rejected'], default: 'Pending' },
  steps: [
    {
      title: { type: String, required: true },
      desc: { type: String, required: true },
      completed: { type: Boolean, default: false },
      date: { type: String, default: 'Pending' }
    }
  ],
  processing_rto: { type: String, required: true },
  submission_date: { type: Date, default: Date.now }
});

export default mongoose.model('Application', applicationSchema);
