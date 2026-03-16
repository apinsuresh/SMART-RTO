import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const MOCK_VEHICLES = {
    'MH01AB1234': {
        registration_no: 'MH01AB1234',
        owner_name: 'Indhu S',
        vehicle_class: 'LMV (Motor Car)',
        registration_date: '2022-10-15',
        rto_location: 'Mumbai Central',
        fitness_validity: '2037-10-14',
        maker_model: 'Maruti Swift VXi',
        fuel_type: 'Petrol',
        status: 'Active'
    },
    'DL01XY7890': {
        registration_no: 'DL01XY7890',
        owner_name: 'Rajesh Kumar',
        vehicle_class: 'MCWG (Motorcycle)',
        registration_date: '2021-03-22',
        rto_location: 'Delhi North',
        fitness_validity: '2036-03-21',
        maker_model: 'Royal Enfield Classic 350',
        fuel_type: 'Petrol',
        status: 'Active'
    }
};

// Get vehicle details by registration number (Mock)
router.get('/:regNo', verifyToken, async (req, res) => {
    const regNo = req.params.regNo.toUpperCase();
    const vehicle = MOCK_VEHICLES[regNo];
    
    if (!vehicle) {
        // Fallback mock data for demo
        return res.json({
            registration_no: regNo,
            owner_name: 'Demo Owner',
            vehicle_class: 'LMV',
            registration_date: '2023-01-01',
            rto_location: 'Default RTO',
            fitness_validity: '2038-01-01',
            maker_model: 'Generic Vehicle',
            fuel_type: 'Petrol',
            status: 'Active'
        });
    }
    
    res.json(vehicle);
});

// Create new vehicle record (Mock)
router.post('/', verifyToken, async (req, res) => {
    if (req.user.role !== 'officer') {
        return res.status(403).json({ message: 'Access denied. Officers only.' });
    }
    res.status(201).json({ ...req.body, message: 'Vehicle created (Mock Mode)' });
});

export default router;
