// models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  photoURL: {
    type: String,
    default: '/images/user.png'
  },
  isAdmin: {
    type: Boolean,
    default: false
  } ,
  isSignIn: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  currentToken: {
    type: String,
    default: null
  },
  iNMaintenance: {
    type: Boolean,
    default: false
  },
  devices: [{  // Store device details
    deviceType: { type: String },  // Mobile, Desktop, etc.
    os: { type: String },  // OS info
    browser: { type: String },  // Browser info
    ip: { type: String },
    loginTime: { type: Date }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
},{timestamps: true});

const User = mongoose.model('user', userSchema);

export default User;
