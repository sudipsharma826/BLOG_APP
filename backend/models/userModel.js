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
    default: 'https://blogger.googleusercontent.com/img/a/AVvXsEjp9DrYG0vFqd2QoKcDfbBnFTCXwRd78rQLKbMH2ofTMNuNkmfMv7IxOV7kYVAEptd7pYUUgrpOYuFy4pU2yVe0S59Zn_EzYW8u96_iFXv2NKYF5QFlWG3GhhZVYcfvZFmtNY4b-UQIqnsI142OKiB2rGWZZaRzXxyYMTQlqbbFqZKmgylDwMvuc29S0cs=s150'
  }
});

const User = mongoose.model('user', userSchema);

export default User;
