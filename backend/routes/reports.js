import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', verifyToken, async (req, res) => {
    if (req.user.role !== 'officer') {
        return res.status(403).json({ message: 'Access denied. Officers only.' });
    }

    res.json({
        total_revenue: 15450,
        pending_applications: 12,
        challans_paid: 45,
        unpaid_challans: 8
    });
});

router.get('/revenue-trend', verifyToken, async (req, res) => {
    if (req.user.role !== 'officer') {
        return res.status(403).json({ message: 'Access denied. Officers only.' });
    }

    // Generate static trend data for the last 24 hours
    const trendData = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
        const d = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
        const hour = d.getHours().toString().padStart(2, '0') + ':00';
        trendData.push({
            name: hour,
            revenue: Math.floor(Math.random() * 2000) + 500
        });
    }

    res.json(trendData);
});

export default router;
