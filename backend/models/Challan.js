import mongoose from 'mongoose';

const challanSchema = new mongoose.Schema({
  challan_id: { type: String, required: true, unique: true, index: true },
  vehicle_no: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  violation: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
  evidence_url: { type: String },
  payment_txn_id: { type: String },
  paid_at: { type: Date },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Challan', challanSchema);
