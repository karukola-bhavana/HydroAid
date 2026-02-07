const User = require('../models/User');
const jwt = require('jsonwebtoken');

// List of authorized admin emails
const ADMIN_EMAILS = [
  'dhannasruthi@gmail.com',
  'varshinimenta393@gmail.com',
  'karanampranathi81@gmail.com',
  'mudilivarnitha@gmail.com',
  'srujanamanepalli61@gmail.com',
  'newadmin@example.com',
];

// Reusable function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
const signup = async (req, res) => {
  const { name, email, password, role, department } = req.body;
  const emailLower = email.toLowerCase();

  try {
    // Role-based validation
    if (role === 'admin' && !ADMIN_EMAILS.includes(emailLower)) {
      return res.status(403).json({ message: 'This email is not authorized for admin registration.' });
    }
    if (role !== 'admin' && ADMIN_EMAILS.includes(emailLower)) {
      return res.status(403).json({ message: 'This email is reserved for admin accounts.' });
    }

    const userExists = await User.findOne({ email: emailLower });
    if (userExists) {
      return res.status(400).json({ message: `This email is already registered as a ${userExists.role}.` });
    }

    const user = await User.create({
      name,
      email: emailLower,
      password,
      role,
      departmentName: department,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { email, password, role } = req.body;
  const emailLower = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Role validation
    if (user.role !== role) {
      return res.status(401).json({ message: `This email is registered as a ${user.role}, not ${role}.` });
    }

    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        redirectTo: user.role === 'admin' ? '/admin-dashboard' : '/dashboard'
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { signup, login, getUsers }; 