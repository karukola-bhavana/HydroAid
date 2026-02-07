const Donation = require('../models/Donation');
const Project = require('../models/Project');
const Issue = require('../models/Issue');
const User = require('../models/User');

// @desc    Get real-time dashboard statistics
// @route   GET /api/stats/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Today's statistics
    const todayDonations = await Donation.aggregate([
      { $match: { createdAt: { $gte: today }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // This month's statistics
    const monthDonations = await Donation.aggregate([
      { $match: { createdAt: { $gte: thisMonth }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Project statistics
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalFunding: { $sum: '$currentFunding' }
        }
      }
    ]);

    // Issue statistics
    const issueStats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // User statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent donations (last 10)
    const recentDonations = await Donation.find({ status: 'completed' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Recent issues (last 10)
    const recentIssues = await Issue.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      today: {
        donations: todayDonations[0]?.total || 0,
        count: todayDonations[0]?.count || 0
      },
      month: {
        donations: monthDonations[0]?.total || 0,
        count: monthDonations[0]?.count || 0
      },
      projects: projectStats,
      issues: issueStats,
      users: userStats,
      recentDonations,
      recentIssues
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get department-specific statistics
// @route   GET /api/stats/department/:departmentId
const getDepartmentStats = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Department projects
    const projects = await Project.find({ departmentId });

    // Department donations
    const donations = await Donation.aggregate([
      { $match: { departmentId, createdAt: { $gte: today }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Department issues
    const issues = await Issue.find({ departmentId }).populate('reportedBy', 'name email');

    res.json({
      projects: {
        total: projects.length,
        byStatus: projects.reduce((acc, project) => {
          acc[project.status] = (acc[project.status] || 0) + 1;
          return acc;
        }, {})
      },
      donations: {
        today: donations[0]?.total || 0,
        count: donations[0]?.count || 0
      },
      issues: {
        total: issues.length,
        byPriority: issues.reduce((acc, issue) => {
          acc[issue.priority] = (acc[issue.priority] || 0) + 1;
          return acc;
        }, {}),
        recent: issues.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get live donation feed
// @route   GET /api/stats/donations/live
const getLiveDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'completed' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new donation and emit live event
// @route   POST /api/stats/donations
const createDonation = async (req, res) => {
  try {
    const { userId, amount, projectId, paymentMethod, departmentId, anonymous } = req.body;
    
    // If no userId provided, create a test user or use a default
    let actualUserId = userId;
    if (!userId) {
      // Find or create a test user
      let testUser = await User.findOne({ email: 'test@hydroaid.com' });
      if (!testUser) {
        testUser = await User.create({
          name: 'Test User',
          email: 'test@hydroaid.com',
          password: 'test123',
          role: 'user'
        });
      }
      actualUserId = testUser._id;
    }
    
    const donation = await Donation.create({
      userId: actualUserId,
      amount,
      projectId,
      paymentMethod,
      departmentId,
      anonymous: !!anonymous,
      status: 'completed'
    });
    
    // Populate user for frontend
    await donation.populate('userId', 'name email');
    
    // Emit live event
    if (req.io) {
      req.io.to('admin-room').emit('new-donation', donation);
    }
    
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getDepartmentStats,
  getLiveDonations,
  createDonation
}; 