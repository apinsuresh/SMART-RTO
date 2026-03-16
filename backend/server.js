import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import licenseRoutes from './routes/licenses.js';
import applicationRoutes from './routes/applications.js';
import challanRoutes from './routes/challans.js';
import reportRoutes from './routes/reports.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["https://smart-rto.vercel.app", "http://localhost:5173"],
  credentials: true
}));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/challans', challanRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => res.send('Smart RTO API Running...'));

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-rto';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
