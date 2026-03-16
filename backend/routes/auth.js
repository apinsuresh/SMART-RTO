import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Mock Demo User
const DEMO_USER = {
    id: 'demo-user-123',
    name: 'Indhu S (Demo)',
    email: 'test@test.com',
    password: 'password', // Plain text for demo simplicity
    role: 'citizen',
    dob: '1995-05-20',
    gender: 'Female',
    aadhaar: 'XXXX-XXXX-1234',
    phone: '9876543210',
    currentAddress: '123 Demo St, Mumbai, MH',
    permanentAddress: '123 Demo St, Mumbai, MH'
};

const DEMO_OFFICER = {
    id: 'demo-officer-999',
    name: 'RTO Officer (Demo)',
    email: 'admin@test.com',
    password: 'password',
    role: 'officer'
};

// Register (Mock Success)
router.post('/register', async (req, res) => {
    res.status(201).json({ message: 'User registered successfully (Mock Mode)' });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    let userToLogin = null;
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
        userToLogin = DEMO_USER;
    } else if (email === DEMO_OFFICER.email && password === DEMO_OFFICER.password) {
        userToLogin = DEMO_OFFICER;
    }

    if (!userToLogin) {
        return res.status(400).json({ message: 'Invalid credentials. Try test@test.com / password' });
    }

    // Verify role if provided
    if (role && userToLogin.role !== role) {
        return res.status(403).json({ message: 'Unauthorized role access for this demo account' });
    }

    const payload = {
        user: {
            id: userToLogin.id,
            role: userToLogin.role
        }
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret_rto_key',
        { expiresIn: '1h' },
        (err, token) => {
            if (err) throw err;
            res.json({ token, role: userToLogin.role, name: userToLogin.name });
        }
    );
});

// Get Profile
router.get('/profile', verifyToken, async (req, res) => {
    // Always return demo user for profile request in mock mode
    res.json(DEMO_USER);
});

// Update Profile (Mock)
router.put('/profile', verifyToken, async (req, res) => {
    res.json({ message: 'Profile updated successfully (Mock Mode)', user: DEMO_USER });
});

export default router;
