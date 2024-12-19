import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },  // Title must be unique
  subtitle: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },  // No uniqueness constraint for category
  slug: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

export default Post;
