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
    default: 'https://th.bing.com/th/id/OIP.AM9J9nDVFAf_ssjpdxsKKQHaHa?w=186&h=186&c=7&r=0&o=5&pid=1.7'
  }
});

const User = mongoose.model('user', userSchema);

export default User;
