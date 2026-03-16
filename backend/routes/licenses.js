import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Mock DL Data
const MOCK_LICENSES = {
    'DL1234567890': {
        dl_number: 'DL1234567890',
        name: 'Indhu S',
        dob: '1995-05-20',
        father_name: 'Suresh Kumar',
        address: '123 Demo St, Mumbai, MH',
        blood_group: 'B+',
        status: 'Active',
        expiry_date: '2035-05-19',
        vehicles_authorised: ['LMV', 'MCWG']
    }
};

// Get DL details by DL Number and DOB (Mock)
router.post('/lookup', verifyToken, async (req, res) => {
    const { dl_number, dob } = req.body;
    const dlNo = dl_number.toUpperCase();
    const license = MOCK_LICENSES[dlNo];
    
    if (!license) {
        // Fallback for demo
        return res.json({
            dl_number: dlNo,
            name: 'Demo Citizen',
            dob: dob || '1990-01-01',
            father_name: 'Parent Name',
            address: 'Somwhere in India',
            blood_group: 'O+',
            status: 'Active',
            expiry_date: '2040-01-01',
            vehicles_authorised: ['LMV', 'MCWG']
        });
    }
    
    res.json(license);
});

// Create new DL record (Mock)
router.post('/', verifyToken, async (req, res) => {
    if (req.user.role !== 'officer') {
        return res.status(403).json({ message: 'Access denied. Officers only.' });
    }
    res.status(201).json({ ...req.body, message: 'License record created (Mock Mode)' });
});

export default router;
