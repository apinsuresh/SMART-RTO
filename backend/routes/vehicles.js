import express from 'express';
import Vehicle from '../models/Vehicle.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get vehicle details by registration number (Citizen / Officer)
router.get('/:regNo', verifyToken, async (req, res) => {
  try {
    const regNo = req.params.regNo.toUpperCase();
    const vehicle = await Vehicle.findOne({ registration_no: regNo });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create new vehicle record (Officer only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Access denied. Officers only.' });
    }

    const newVehicle = new Vehicle(req.body);
    const vehicle = await newVehicle.save();
    
    res.status(201).json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
