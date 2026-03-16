import express from 'express';
import Application from '../models/Application.js';
import Challan from '../models/Challan.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const pendingApps = await Application.countDocuments({ status: 'Pending' });
    const paidChallans = await Challan.countDocuments({ status: 'Paid' });
    const unpaidChallans = await Challan.countDocuments({ status: 'Unpaid' });
    
    // Sum total revenue from paid challans
    const paidChallanData = await Challan.find({ status: 'Paid' });
    const totalRevenue = paidChallanData.reduce((sum, c) => sum + (c.amount || 0), 0);

    res.json({
      total_revenue: totalRevenue,
      pending_applications: pendingApps,
      challans_paid: paidChallans,
      unpaid_challans: unpaidChallans
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/revenue-trend', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Get paid challans from the last 24 hours
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const paidChallans = await Challan.find({ 
      status: 'Paid',
      paid_at: { $gte: last24h }
    }).sort({ paid_at: 1 });

    // Initialize map for the 24 hours
    const trendMap = {};
    const now = new Date();
    for (let i = 0; i < 24; i++) {
        const d = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
        const hour = d.getHours().toString().padStart(2, '0') + ':00';
        trendMap[hour] = 0;
    }

    paidChallans.forEach(c => {
        if (c.paid_at) {
          const hour = new Date(c.paid_at).getHours().toString().padStart(2, '0') + ':00';
          if (trendMap[hour] !== undefined) {
              trendMap[hour] += c.amount;
          }
        }
    });

    const trendData = Object.keys(trendMap).sort().map(time => ({
        name: time,
        revenue: trendMap[time]
    }));

    res.json(trendData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
