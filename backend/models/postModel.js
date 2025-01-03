import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  authorEmail: { type: String, required: true },
  title: { type: String, required: true, unique: true },  // Title must be unique
  subtitle: { type: String, required: true },
  content: {type: String, required: true },
  category: [{ type: String, required: true }],  // No uniqueness constraint for category
  slug: { type: String, required: true },
  image: { type: String },
  postViews: { type: Number, default: 0 },
  usersLikeList: [{ type: String }],//[] means it will be an array wthat stores strings
   usersCommentList: [{ type: String }],
  usersLoveList: [{ type: String }],
  usersSaveList: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

export default Post;
