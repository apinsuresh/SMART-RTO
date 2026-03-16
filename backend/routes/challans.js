import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

let MOCK_CHALLANS = [
    {
        challan_id: 'CHLN-2024-10045',
        vehicle_no: 'MH01AB1234',
        date: '2024-03-10T10:30:00Z',
        location: 'Worli Sea Link, Mumbai',
        violation: 'Over Speeding',
        amount: 1000,
        status: 'Unpaid'
    },
    {
        challan_id: 'CHLN-2024-10089',
        vehicle_no: 'DL01XY7890',
        date: '2024-02-15T14:20:00Z',
        location: 'Connaught Place, Delhi',
        violation: 'Wrong Way Driving',
        amount: 2000,
        status: 'Paid',
        payment_txn_id: 'TXN-DEMO-999',
        paid_at: '2024-02-16T12:00:00Z'
    }
];

// Get challans by vehicle number (Mock)
router.get('/vehicle/:regNo', verifyToken, async (req, res) => {
    const regNo = req.params.regNo.toUpperCase();
    const challans = MOCK_CHALLANS.filter(c => c.vehicle_no === regNo);
    res.json(challans);
});

// Pay a challan (Citizen) - Mock
router.post('/pay/:challanId', verifyToken, async (req, res) => {
    const challanId = req.params.challanId.toUpperCase();
    const challanIndex = MOCK_CHALLANS.findIndex(c => c.challan_id === challanId);

    if (challanIndex === -1) {
        return res.status(404).json({ message: 'Challan not found' });
    }

    if (MOCK_CHALLANS[challanIndex].status === 'Paid') {
        return res.status(400).json({ message: 'Challan is already paid.' });
    }

    MOCK_CHALLANS[challanIndex].status = 'Paid';
    MOCK_CHALLANS[challanIndex].payment_txn_id = `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    MOCK_CHALLANS[challanIndex].paid_at = new Date().toISOString();
    
    res.json({ message: 'Payment successful (Mock)', challan: MOCK_CHALLANS[challanIndex] });
});

// Create new challan (Officer) - Mock
router.post('/', verifyToken, async (req, res) => {
    if (req.user.role !== 'officer') {
        return res.status(403).json({ message: 'Access denied. Officers only.' });
    }

    const { vehicle_no, location, violation, amount } = req.body;
    const challan_id = `CHLN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newChallan = {
        challan_id,
        vehicle_no: vehicle_no.toUpperCase(),
        date: new Date().toISOString(),
        location,
        violation,
        amount,
        status: 'Unpaid'
    };

    MOCK_CHALLANS.push(newChallan);
    res.status(201).json(newChallan);
});

// Get all challans summary for Admin Dashboard - Mock
router.get('/', verifyToken, async (req, res) => {
    if (req.user.role !== 'officer') {
        return res.status(403).json({ message: 'Access denied. Officers only.' });
    }
    res.json(MOCK_CHALLANS);
});

export default router;
