import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Mock Applications Storage (In-Memory for Demo)
let MOCK_APPS = [
    {
        _id: 'app-mock-1',
        tracking_id: 'APP-1234-2024',
        service_type: 'Learner License',
        user_id: 'demo-user-123',
        applicant_name: 'Indhu S',
        dob: '1995-05-20',
        address: '123 Demo St, Mumbai, MH',
        processing_rto: 'Mumbai Central',
        status: 'Under Review',
        submission_date: new Date().toISOString(),
        steps: [
            { title: 'Application Submitted', desc: 'Form and initial fees paid.', completed: true, date: '15/03/2024' },
            { title: 'Document Verification', desc: 'Aadhar and Age proof verified.', completed: true, date: '16/03/2024' },
            { title: 'RTO Approval', desc: 'Final approval from authorities.', completed: false },
            { title: 'Service Issuance', desc: 'Final document generated.', completed: false }
        ]
    }
];

// Submit a new application (Citizen) - Mock
router.post('/', verifyToken, async (req, res) => {
    const { service_type, applicant_name, dob, address, processing_rto } = req.body;
    
    // Generate tracking ID
    const tracking_id = `APP-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

    const newApp = {
        _id: `mock-${Date.now()}`,
        tracking_id,
        service_type,
        user_id: req.user.id,
        applicant_name,
        dob,
        address,
        processing_rto,
        status: 'Pending',
        submission_date: new Date().toISOString(),
        steps: [
            { title: 'Application Submitted', desc: 'Form and initial fees paid.', completed: true, date: new Date().toLocaleDateString('en-GB') },
            { title: 'Document Verification', desc: 'Aadhar and Age proof verified.', completed: false },
            { title: 'RTO Approval', desc: 'Final approval from authorities.', completed: false },
            { title: 'Service Issuance', desc: 'Final document generated.', completed: false }
        ]
    };

    MOCK_APPS.push(newApp);
    res.status(201).json(newApp);
});

// Track application by ID (Citizen / Officer) - Mock
router.get('/:trackingId', verifyToken, async (req, res) => {
    const trackingId = req.params.trackingId.toUpperCase();
    const app = MOCK_APPS.find(a => a.tracking_id === trackingId);
    
    if (!app) {
        // Fallback for demo tracking consistency
        return res.json({
            tracking_id: trackingId,
            service_type: 'Demo Application',
            applicant_name: 'Demo Applicant',
            status: 'Processing',
            submission_date: new Date().toISOString(),
            steps: [{ title: 'Application Received', desc: 'Standard demo response.', completed: true, date: '17/03/2024' }]
        });
    }

    res.json(app);
});

// Get all applications (Officer / Admin Dashboard) - Mock
router.get('/', verifyToken, async (req, res) => {
    if (req.user.role !== 'officer') {
        return res.status(403).json({ message: 'Access denied. Officers only.' });
    }
    res.json(MOCK_APPS);
});

// Update application status (Officer) - Mock
router.put('/:trackingId/status', verifyToken, async (req, res) => {
    if (req.user.role !== 'officer') {
        return res.status(403).json({ message: 'Access denied. Officers only.' });
    }

    const { status, stepIndex } = req.body;
    const trackingId = req.params.trackingId.toUpperCase();
    const appIndex = MOCK_APPS.findIndex(a => a.tracking_id === trackingId);

    if (appIndex === -1) return res.status(404).json({ message: 'Application not found' });

    MOCK_APPS[appIndex].status = status;
    
    if (stepIndex !== undefined && MOCK_APPS[appIndex].steps[stepIndex]) {
        MOCK_APPS[appIndex].steps[stepIndex].completed = true;
        MOCK_APPS[appIndex].steps[stepIndex].date = new Date().toLocaleDateString('en-GB');
    }

    res.json(MOCK_APPS[appIndex]);
});

export default router;
