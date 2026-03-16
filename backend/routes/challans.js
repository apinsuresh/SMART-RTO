import express from 'express';
import Challan from '../models/Challan.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get challans by vehicle number
router.get('/vehicle/:regNo', verifyToken, async (req, res) => {
  try {
    const regNo = req.params.regNo.toUpperCase();
    const challans = await Challan.find({ vehicle_no: regNo }).sort({ date: -1 });
    
    // Always return an array (empty if none found, which is a good state)
    res.json(challans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Pay a challan (Citizen)
router.post('/pay/:challanId', verifyToken, async (req, res) => {
  try {
    const challan = await Challan.findOne({ challan_id: req.params.challanId.toUpperCase() });

    if (!challan) {
      return res.status(404).json({ message: 'Challan not found' });
    }

    if (challan.status === 'Paid') {
      return res.status(400).json({ message: 'Challan is already paid.' });
    }

    // Simulate Payment Gateway success logic
    challan.status = 'Paid';
    challan.payment_txn_id = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    challan.paid_at = new Date();
    
    await challan.save();
    
    res.json({ message: 'Payment successful', challan });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create new challan (Officer only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Access denied. Officers only.' });
    }

    const { vehicle_no, location, violation, amount, evidence_url } = req.body;
    const challan_id = `CHLN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newChallan = new Challan({
      challan_id,
      vehicle_no: vehicle_no.toUpperCase(),
      date: new Date(),
      location,
      violation,
      amount,
      evidence_url
    });

    const savedChallan = await newChallan.save();
    res.status(201).json(savedChallan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all challans summary for Admin Dashboard
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const challans = await Challan.find().sort({ date: -1 });
    res.json(challans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
