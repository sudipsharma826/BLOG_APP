import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },  // Ensure category name is unique
  imageUrl: { type: String, default: null,alias: 'catrgoryImage' },  // Store the URL of the category image
  postCount: { type: Number, default: 0 },  // Track the number of posts in this category
  createdAt: { type: Date, default: Date.now },
  
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);

export default Category;
