const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
// const cors = require('cors');
const app = express();
const PORT = 3000;

// app.use(cors({
//   origin: 'https://www.adshark.net',
//   credentials: true
// }));

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

// // Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

/// Define the user schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    apiToken: {
        type: String,
        default: "",
    },
    verified: {
        type: Boolean,
        default: false,
    },
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
async function fetchPerformanceReport(apiToken, format, startDate, endDate, groupBy = 'date', additionalParams = {}) {
  const url = `${BASE_URL}.${format}`; // Include format in the URL path
  const params = {
    start_date: startDate,
    finish_date: endDate,
    group_by: groupBy, // Pass as a string, not an array
    ...additionalParams
  };

  console.log('Making API request with:', {
    url,
    params,
    headers: {
      'X-API-Key': apiToken.substring(0, 4) + '...' // Log partial token for security
    }
  });

  try {
    const response = await axios.get(url, {
      headers: {
        'X-API-Key': apiToken
      },
      params: params,
    });

    console.log('API Response:', {
      status: response.status,
      data: {
        ...response.data,
        items: response.data.items // Explicitly log the items array
      }
    });

    return response.data;
  } catch (error) {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data, // Log the full error response
      message: error.message
    });
    throw error;
  }
}

// Function to validate dates
function validateDates(startDate, endDate) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > today || end > today) {
    throw new Error('Cannot request future dates');
  }

  if (start > end) {
    throw new Error('Start date must be before end date');
  }

  return {
    startDate: start.toISOString().split('T')[0], // Format as YYYY-MM-DD
    endDate: end.toISOString().split('T')[0] // Format as YYYY-MM-DD
  };
}


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
    console.log('Using API token:', user.apiToken.substring(0, 4) + '...');
    req.apiToken = user.apiToken;
    next();
  } catch (err) {
    console.error('Error fetching user API token:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


app.get('/performance-report', isAuthenticated,  fetchUserApiToken, async (req, res) => {
  const { format = 'json', startDate, endDate, groupBy = 'date', ...additionalParams } = req.query;
  const apiToken = req.apiToken;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: 'startDate and endDate are required.',
      example: '/performance-report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD'
    });
  }

  try {
    const validDates = validateDates(startDate, endDate);

    const data = await fetchPerformanceReport(
      apiToken,
      format,
      validDates.startDate,
      validDates.endDate,
      groupBy,
      additionalParams
    );

    res.json({
      message: 'Performance Report',
      startDate: validDates.startDate,
      endDate: validDates.endDate,
      groupBy: groupBy,
      data
    });
  } catch (error) {
    console.error('Error in performance-report handler:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch performance report.',
      details: error.response?.data || error.message
    });
  }
});


app.get('/performance-report-campaign', isAuthenticated, fetchUserApiToken, async (req, res) => {
  const { format = 'json', startDate, endDate, groupBy = 'campaign', ...additionalParams } = req.query;
  const apiToken = req.apiToken;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: 'startDate and endDate are required.',
      example: '/performance-report-campaign?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD'
    });
  }

  try {
    const validDates = validateDates(startDate, endDate);

    // Fetch campaign-specific data
    const data = await fetchPerformanceReport(
      apiToken,
      format,
      validDates.startDate,
      validDates.endDate,
      groupBy, // Ensure this groups by 'campaign'
      additionalParams
    );

    res.json({
      message: 'Performance Report by Campaign',
      startDate: validDates.startDate,
      endDate: validDates.endDate,
      groupBy: groupBy,
      data // Ensure this contains campaign-specific data
    });
  } catch (error) {
    console.error('Error in performance-report-campaign handler:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch performance report by campaign.',
      details: error.response?.data || error.message
    });
  }
});


/////////////////////////////////////////////////////////////////////////////////sending campaign data to user/////////////////////////////////////////////////////

const sendCampaignEmail = (email, username, campaignData) => {
  // HTML content for the email
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #8bbcd4;">Hello ${username},</h2>
      <p>Thank you for creating a campaign with AdShark! Here are the details of your campaign:</p>
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
      <h3 style="color: #8bbcd4;">Your Campaign Details:</h3>
      <ul style="list-style-type: none; padding: 0;">
        <li><strong>Campaign Name:</strong> ${campaignData.campaignName}</li>
        <li><strong>Device Format:</strong> ${campaignData.deviceFormat}</li>
        <li><strong>Traffic Type:</strong> ${campaignData.trafficType}</li>
        <li><strong>Connection Type:</strong> ${campaignData.connectionType}</li>
        <li><strong>Ad Unit:</strong> ${campaignData.adUnit}</li>
        <li><strong>Pricing Type:</strong> ${campaignData.pricingType}</li>
        <li><strong>Landing URL:</strong> ${campaignData.landingUrl}</li>
        <li><strong>Countries:</strong> ${campaignData.countries.join(', ')}</li>
        <li><strong>Price:</strong> $${campaignData.price}</li>
        <li><strong>Schedule:</strong> ${campaignData.schedule}</li>
        <li><strong>Blacklist/Whitelist:</strong> ${campaignData.blacklistWhitelist.join(', ')}</li>
        <li><strong>IP Ranges:</strong> ${campaignData.ipRanges.join(', ')}</li>
      </ul>
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #777;">This email was sent by AdShark. Please do not reply to this email.</p>
    </div>
  `;

  const mailOptions = {
    from: 'info@adshark.net',
    to: email,
    subject: 'Your Campaign Details',
    text: `Hello ${username},\n\nThank you for creating a campaign with AdShark! Here are the details of your campaign:\n${JSON.stringify(campaignData, null, 2)}\n\nIf you have any questions, please contact support.`, // Fallback plain text version
    html: htmlContent, // HTML version of the email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Campaign email sent:', info.response);
    }
  });
};



app.post('/api/campaigns',isAuthenticated,  async (req, res) => {
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
    sendCampaignEmail(user.email, user.username, campaignData);
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
//////////////////////////////////////////////////////////////////////sending support email/////////////////////////////////////////////////////////
const sendSupportEmail = (name, email, subject, issue) => {
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #8bbcd4;">New Support Request</h2>
          <p>You have received a new support request from <strong>${name}</strong> (${email}).</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <h3 style="color: #8bbcd4;">Support Request Details:</h3>
          <ul style="list-style-type: none; padding: 0;">
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Subject:</strong> ${subject}</li>
              <li><strong>Issue:</strong> ${issue}</li>
          </ul>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">This email was sent by AdShark Support System. Please respond to the user directly.</p>
      </div>
  `;

  const mailOptions = {
      from: email, 
      to: 'adshark00@gmail.com', // Support team email address
      subject: `Support Request: ${subject}`, // Email subject
      text: `You have received a new support request from ${name} (${email}).\n\nSubject: ${subject}\n\nIssue: ${issue}`, // Plain text version
      html: htmlContent,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending support email:', error);
      } else {
          console.log('Support email sent:', info.response);
      }
  });
};

// Support form submission endpoint
app.post('/submit-support', (req, res) => {
  const { name, email, subject, issue } = req.body;

  console.log('Received support request:', { name, email, subject, issue }); // Debugging log

  // Send the support email
  sendSupportEmail(name, email, subject, issue);
  res.redirect('/dashboard.html');
});
//////////////////////////////////////////////////////////////////////sending contact email/////////////////////////////////////////////////////////

const sendContactEmail = (name, email, subject, message) => {
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #8bbcd4;">New Contact Request</h2>
          <p>You have received a new contact request from <strong>${name}</strong> (${email}).</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <h3 style="color: #8bbcd4;">Contact Request Details:</h3>
          <ul style="list-style-type: none; padding: 0;">
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Subject:</strong> ${subject}</li>
              <li><strong>Message:</strong> ${message}</li>
          </ul>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">This email was sent by AdShark Contact Form. Please respond to the user directly.</p>
      </div>
  `;

  const mailOptions = {
      from: email, // Sender email address
      to: 'adshark00@gmail.com', // Support team email address
      subject: `Contact Request: ${subject}`, // Email subject
      text: `New Contact Request from ${name} (${email}).\n\nSubject: ${subject}\n\nMessage: ${message}`, // Plain text version
      html: htmlContent,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending contact email:', error);
      } else {
          console.log('Contact email sent:', info.response);
      }
  });
};

// Contact form submission endpoint
app.post('/submit-contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  console.log('Received contact request:', { name, email, subject, message }); // Debugging log

  // Validate required fields
  if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
      // Send the contact email
      sendContactEmail(name, email, subject, message);

      // Send a JSON response
      res.redirect('/contact.html');
  } catch (error) {
      console.error('Error sending contact email:', error);
      res.status(500).json({ message: 'Failed to submit the contact request.' });
  }
});


// // Update campaign
// app.put('/api/campaigns/:id', isAuthenticated, async (req, res) => {
//   try {
//     const campaign = await Campaign.findOneAndUpdate(
//       {
//         _id: req.params.id,
//         userId: req.session.userId
//       },
//       req.body,
//       { new: true }
//     );

//     if (!campaign) {
//       return res.status(404).json({
//         success: false,
//         message: 'Campaign not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Campaign updated successfully',
//       data: campaign
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating campaign',
//       error: error.message
//     });
//   }
// });

// // // Delete campaign
// app.delete('/api/campaigns/:id', isAuthenticated, async (req, res) => {
//   try {
//     const campaign = await Campaign.findOneAndDelete({
//       _id: req.params.id,
//       userId: req.session.userId
//     });

//     if (!campaign) {
//       return res.status(404).json({
//         success: false,
//         message: 'Campaign not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Campaign deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting campaign',
//       error: error.message
//     });
//   }
// });



// Routes
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a strong secret key

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/TOS', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'TOS.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});
// app.post('/signup', signUpUser);

// Add a new user to the database
const addUser = async (userData) => {
  try {
      const user = new User(userData);
      await user.save();
  } catch (error) {
      console.error('Error adding user to database:', error);
  }
};


// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'adshark00@gmail.com',
      pass: 'iasy nmqs bzpa favn',
  },
});

const sendVerificationEmail = (email, username) => {
  // Generate a JWT token
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

  // Construct the verification URL
  const verificationUrl = `http://adshark.net/verify-email?token=${token}`;

  // HTML content for the email
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #8bbcd4;">Hello ${username},</h2>
      <p>Thank you for registering! Please verify your email by clicking the button below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #8bbcd4; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Verify Email
      </a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-wrap: break-word;">${verificationUrl}</p>
      <p>If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #777;">This email was sent by AdShark. Please do not reply to this email.</p>
    </div>
  `;

  const mailOptions = {
    from: 'info@adshark.net',
    to: email,
    subject: 'Email Verification',
    text: `Hello ${username},\n\nThank you for registering! Please verify your email by clicking the link below:\n${verificationUrl}\n\nIf you did not request this, please ignore this email.`, // Fallback plain text version
    html: htmlContent, // HTML version of the email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

// Update user verification status
const updateUserVerificationStatus = async (email, status) => {
  try {
      await User.updateOne({ email }, { verified: status });
      console.log(`User verification status updated for ${email}: ${status}`);
  } catch (error) {
      console.error('Error updating user verification status:', error);
  }
};

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
  }

  // Add new user to the database
  await addUser({ username, email, password });

  // Send verification email
  sendVerificationEmail(email, username);

  res.redirect('/success.html');
});

app.post('/check-user', async (req, res) => {
  const { email, username } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }


    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'User with this username already exists' });
    }


    res.status(200).json({ message: 'User is available' });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Find a user by email
const findUserByEmail = async (email) => {
  try {
      return await User.findOne({ email });
  } catch (error) {
      console.error('Error finding user by email:', error);
  }
};

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await findUserByEmail(email);
  if (!user) {
      return res.status(400).json({ message: 'User not found' });
  }
  // Check if password matches (you should use bcrypt for password hashing in a real application)
  if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Check if user is verified
  if (!user.verified) {
    return res.status(401).json({ success: false, error: 'Please verify your email before logging in' });
  }
  req.session.userId = user._id;
  return res.status(200).json({ success: true, redirectUrl: '/dashboard.html' });
});



// Verify Email Endpoint
app.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      const { email } = decoded;

      // Update user verification status
      await updateUserVerificationStatus(email, true);

      res.redirect('/verified.html');
  } catch (error) {
      res.status(400).json({ message: 'Invalid or expired token' });
  }
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});