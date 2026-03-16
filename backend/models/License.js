import mongoose from 'mongoose';

const licenseSchema = new mongoose.Schema({
  dl_number: { type: String, required: true, unique: true, index: true },
  dob: { type: Date, required: true },
  holder_name: { type: String, required: true },
  validity: { type: Date, required: true },
  rto_name: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Suspended', 'Expired'], default: 'Active' },
  vehicle_classes: [{ type: String }],
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('License', licenseSchema);
