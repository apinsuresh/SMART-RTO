import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  registration_no: { type: String, required: true, unique: true, index: true },
  owner_name: { type: String, required: true },
  vehicle_class: { type: String, required: true },
  registration_date: { type: Date, required: true },
  rto_location: { type: String, required: true },
  fitness_validity: { type: Date, required: true },
  maker_model: { type: String, required: true },
  fuel_type: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Suspended', 'Expired'], default: 'Active' },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Vehicle', vehicleSchema);
