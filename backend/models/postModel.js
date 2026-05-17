import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  authorEmail: { type: String, required: true },
  title: { type: String, required: true, unique: true },  // Title must be unique
  subtitle: { type: String, required: true },
  content: {type: String, required: true },
  categories: [{ type: String, required: true }],  // No uniqueness constraint for category
  slug: { type: String, required: true },
  image: { type: String },
  views: { type: Number, default: 0 },
  likedByUsers: [{ type: String }],//[] means it will be an array wthat stores strings
   commentedByUsers: [{ type: String }],
  lovedByUsers: [{ type: String }],
  savedByUsers: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'published' }, // Draft or published status
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
