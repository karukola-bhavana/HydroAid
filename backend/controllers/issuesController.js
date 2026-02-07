const Issue = require('../models/Issue');
const User = require('../models/User');

// @desc    Create a new issue report
// @route   POST /api/issues
// @access  Public (allows anonymous but ties to a test/default user if missing)
const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      location,
      reportedBy, // optional
      departmentId,
      photos,
    } = req.body;

    if (!title || !description || !category || !location || !location.lat || !location.lng || !departmentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let reporterId = reportedBy;
    if (!reporterId) {
      // Fallback to a default/test user
      let testUser = await User.findOne({ email: 'issue-reporter@hydroaid.com' });
      if (!testUser) {
        testUser = await User.create({
          name: 'Issue Reporter',
          email: 'issue-reporter@hydroaid.com',
          password: 'test123',
          role: 'user',
        });
      }
      reporterId = testUser._id;
    }

    const newIssue = await Issue.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      location: { lat: Number(location.lat), lng: Number(location.lng) },
      reportedBy: reporterId,
      departmentId,
      photos: Array.isArray(photos) ? photos : [],
    });

    await newIssue.populate('reportedBy', 'name email');

    // Emit socket event for live updates
    if (req.io) {
      req.io.to('admin-room').emit('new-issue', newIssue);
      if (newIssue.departmentId) {
        req.io.to(`department-${newIssue.departmentId}`).emit('department-issue', newIssue);
      }
    }

    return res.status(201).json(newIssue);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createIssue,
};



