import mongoose from 'mongoose';

const SubscribeSchema = new mongoose.Schema({
  
email: { type: String, required: true },
isUser: { type: Boolean, default: false },
subscribeDate: { type: Date, default: Date.now },

}, { timestamps: true });

const Subscribe = mongoose.model('Subscribe', SubscribeSchema);

export default Subscribe;
