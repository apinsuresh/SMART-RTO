import express from 'express';
import License from '../models/License.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get DL details by DL Number and DOB
router.post('/lookup', verifyToken, async (req, res) => {
  try {
    const { dl_number, dob } = req.body;
    
    // In a real scenario, DOB formatting and strict matching would be applied here.
    // For simplicity, we search primarily by DL number and verify DOB.
    const license = await License.findOne({ dl_number: dl_number.toUpperCase() });
    
    if (!license) {
      return res.status(404).json({ message: 'Driving License not found' });
    }
    
    // Simplified DOB check (comparing date strings or standardized dates)
    const storedDob = new Date(license.dob).toISOString().split('T')[0];
    const inputDob = new Date(dob).toISOString().split('T')[0];
    
    if (storedDob !== inputDob) {
      return res.status(401).json({ message: 'Invalid Date of Birth for this DL.' });
    }
    
    res.json(license);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create new DL record (Officer only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Access denied. Officers only.' });
    }

    const newLicense = new License(req.body);
    const license = await newLicense.save();
    
    res.status(201).json(license);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
