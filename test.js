const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'your-secret-key',  // Change this to a secure secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://adshark00:0KKX2YSBGY9Zrz21@cluster0.g7lpz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ttl: 24 * 60 * 60 // Session TTL (1 day)
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Cookie TTL (1 day)
  }
}));

// MongoDB connection
mongoose.connect('mongodb+srv://adshark00:0KKX2YSBGY9Zrz21@cluster0.g7lpz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  apiToken: {
    type: String,
    default: "",
  }
});

const campaignSchema = new mongoose.Schema({
  // User reference (matching your existing User model)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  
  // Required Settings
  campaignName: {
    type: String,
    required: true
  },
  deviceFormat: {
    type: String,
    enum: ['mobile', 'tablet', 'mobile-tablet'],
    required: true
  },
  trafficType: {
    type: String,
    required: true
  },
  connectionType: {
    type: String,
    required: true
  },

  // Ad Unit & Pricing
  adUnit: {
    type: String,
    enum: ['popunder', 'social-bar', 'native-banner', 'in-page-push', 'interstitial'],
    required: true
  },
  pricingType: {
    type: String,
    enum: ['cpm', 'cpa', 'cpc'],
    required: true
  },
  landingUrl: {
    type: String,
    required: true
  },

  // Countries and Price
  countries: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true
  },

  // Schedule
  schedule: {
    type: String,
    enum: ['start-once-verified', 'keep-inactive'],
    default: 'start-once-verified'
  },

  // Advanced Settings
  blacklistWhitelist: {
    type: [String],
    default: []
  },
  ipRanges: {
    type: [String],
    default: []
  },

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'rejected'],
    default: 'pending'
  }
});

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;


const User = mongoose.model('User', userSchema);

// Constants
const BASE_URL = 'https://api3.adsterratools.com/advertiser/stats';

// Function to fetch performance report
async function fetchPerformanceReport(apiToken, format, startDate, endDate, groupBy = ['campaign'], additionalParams = {}) {
  const url = `${BASE_URL}.${format}`;
  const params = {
    start_date: startDate,
    finish_date: endDate,
    'group_by[]': groupBy,
    ...additionalParams,
  };

  console.log('Making API request to:', url);
  console.log('With parameters:', params);
  console.log('Headers:', { 'X-API-Key': '***' });

  try {
    const response = await axios.get(url, {
      headers: {
        'X-API-Key': apiToken,
      },
      params: params,
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Full error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        params: error.config?.params,
      },
    });
    throw error;
  }
}

// Function to validate dates
function validateDates(startDate, endDate) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure dates are not in the future
  if (start > today || end > today) {
    throw new Error('Cannot request future dates');
  }

  // Ensure start date is before end date
  if (start > end) {
    throw new Error('Start date must be before end date');
  }

  return {
    startDate: startDate,
    endDate: new Date(Math.min(end.getTime(), today.getTime())).toISOString().split('T')[0],
  };
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.post('/signup', async (req, res) => {
  const { username, email, password, token } = req.body;

  try {
    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      // Render the signup page again with an error message
      return res.render('signup', {
        error: 'User with this email or username already exists',
        formData: { username, email }, // Pass back the entered data
      });
    }

    // If no user exists, create a new user
    const user = new User({ username, email, password, apiToken: token });
    await user.save();
    req.session.userId = user._id;

    res.redirect('/login.html');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).render('signup', { error: 'Error creating user', formData: req.body });
  }
});

app.post('/check-user', async (req, res) => {
  const { email, username } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }
    res.status(200).json({ message: 'User is available' });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      req.session.userId = user._id;
      return res.status(200).json({ success: true, redirectUrl: '/dashboard.html' });
    } else {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ success: false, error: 'An error occurred during login' });
  }
});



app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/login');
    }
  });
});

// Updated fetchUserApiToken middleware
const fetchUserApiToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.apiToken) {
      return res.status(400).json({ message: 'API token not assigned to user' });
    }
    req.apiToken = user.apiToken;
    next();
  } catch (err) {
    console.error('Error fetching user API token:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Performance report endpoint with authentication
app.get('/performance-report', isAuthenticated, fetchUserApiToken, async (req, res) => {
  const { format = 'json', startDate, endDate, groupBy, ...additionalParams } = req.query;
  const apiToken = req.apiToken;

  console.log('Incoming request:', { format, startDate, endDate, groupBy, additionalParams });

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: 'startDate and endDate are required.',
      example: '/performance-report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD',
    });
  }

  try {
    const validDates = validateDates(startDate, endDate);
    const groupByArray = groupBy ? groupBy.split(',') : ['campaign'];

    console.log('Validated request parameters:', { validDates, groupByArray });

    const data = await fetchPerformanceReport(apiToken, format, validDates.startDate, validDates.endDate, groupByArray, additionalParams);

    res.json({
      message: 'Performance Report',
      startDate: validDates.startDate,
      endDate: validDates.endDate,
      groupBy: groupByArray,
      data,
    });
  } catch (error) {
    console.error('Error in performance-report handler:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch performance report.',
      details: error.response?.data || error.message,
    });
  }
});



app.post('/api/campaigns', isAuthenticated, async (req, res) => {
  try {
    // Get user from session
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const campaignData = {
      ...req.body,
      userId: user._id,
      username: user.username
    };

    const campaign = new Campaign(campaignData);
    await campaign.save();

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating campaign',
      error: error.message
    });
  }
});

// Get user's campaigns
app.get('/api/campaigns', isAuthenticated, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ userId: req.session.userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaigns',
      error: error.message
    });
  }
});

// Get single campaign
app.get('/api/campaigns/:id', isAuthenticated, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.session.userId
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching campaign',
      error: error.message
    });
  }
});

// Update campaign
app.put('/api/campaigns/:id', isAuthenticated, async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.session.userId
      },
      req.body,
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating campaign',
      error: error.message
    });
  }
});

// Delete campaign
app.delete('/api/campaigns/:id', isAuthenticated, async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting campaign',
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});