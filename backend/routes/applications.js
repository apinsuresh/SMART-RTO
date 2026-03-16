import express from 'express';
import Application from '../models/Application.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Submit a new application (Citizen)
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('Incoming App Payload:', req.body);
    const { service_type, applicant_name, dob, address, processing_rto } = req.body;
    
    // Generate tracking ID
    const tracking_id = `APP-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

    const newApp = new Application({
      tracking_id,
      service_type,
      user_id: req.user.id, // From verifyToken payload
      applicant_name,
      dob,
      address,
      processing_rto,
      steps: [
        {
          title: 'Application Submitted',
          desc: 'Form and initial fees paid.',
          completed: true,
          date: new Date().toLocaleDateString('en-GB')
        },
        { title: 'Document Verification', desc: 'Aadhar and Age proof verified.', completed: false },
        { title: 'RTO Approval', desc: 'Final approval from authorities.', completed: false },
        { title: 'Service Issuance', desc: 'Final document generated.', completed: false }
      ]
    });

    const savedApp = await newApp.save();
    res.status(201).json(savedApp);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Track application by ID (Citizen / Officer)
router.get('/:trackingId', verifyToken, async (req, res) => {
  try {
    const app = await Application.findOne({ tracking_id: req.params.trackingId.toUpperCase() });
    
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Optional: add authorization check to ensure citizens only view their own OR are officers
    if (req.user.role === 'citizen' && app.user_id.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Unauthorized to view this application' });
    }

    res.json(app);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all applications (Officer / Admin Dashboard)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const apps = await Application.find().sort({ submission_date: -1 });
    res.json(apps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update application status (Officer)
router.put('/:trackingId/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'officer') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { status, stepIndex } = req.body;
    const app = await Application.findOne({ tracking_id: req.params.trackingId.toUpperCase() });

    if (!app) return res.status(404).json({ message: 'Application not found' });

    app.status = status;
    
    // Update step if provided
    if (stepIndex !== undefined && app.steps[stepIndex]) {
      app.steps[stepIndex].completed = true;
      app.steps[stepIndex].date = new Date().toLocaleDateString('en-GB');
    }

    await app.save();
    res.json(app);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
