import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Register (for demo/seed purposes)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password_hash, role: role || 'citizen' });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Verify role if provided
    if (role && user.role !== role) {
      return res.status(403).json({ message: 'Unauthorized role access' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate payload and token
    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret_rto_key',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role, name: user.name });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Get Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, dob, gender, aadhaar, phone, currentAddress, permanentAddress } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (dob) user.dob = dob;
    if (gender) user.gender = gender;
    if (aadhaar) user.aadhaar = aadhaar;
    if (phone) user.phone = phone;
    if (currentAddress) user.currentAddress = currentAddress;
    if (permanentAddress) user.permanentAddress = permanentAddress;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
