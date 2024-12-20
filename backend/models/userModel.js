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
  createdAt: {
    type: Date,
    default: Date.now
  }
},{timestamps: true});

const User = mongoose.model('user', userSchema);

export default User;
