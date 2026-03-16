import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'officer'], default: 'citizen' },
  dob: { type: String },
  gender: { type: String },
  aadhaar: { type: String },
  phone: { type: String },
  currentAddress: { type: String },
  permanentAddress: { type: String },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
