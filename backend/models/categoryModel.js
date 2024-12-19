import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },  // Ensure category name is unique
  postCount: { type: Number, default: 0 },  // Track the number of posts in this category
  
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);

export default Category;
