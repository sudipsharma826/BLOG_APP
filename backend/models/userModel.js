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
  },
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
  devices: [{ 
    deviceType: { type: String }, 
    os: { type: String }, 
    browser: { type: String }, 
    ip: { type: String },
    loginTime: { type: Date }
  }],
  likedPosts: [{ type: String }],
  lovedPosts: [{ type: String }],
  savedPosts: [{ type: String }],
  commentPosts: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);  // Ensure the model is registered correctly

export default User;
