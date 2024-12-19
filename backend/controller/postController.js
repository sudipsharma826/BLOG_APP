import Post from '../models/postModel.js';
import Category from '../models/categoryModel.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Create a new post
export const createPost = async (req, res) => {
    const { title, subtitle, category, content } = req.body;
    const file = req.file;

    // Validate required fields
    if (!title || !subtitle || !category || !content) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const slug= title.toLowerCase().split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

    try {
        // Upload the file to Cloudinary if provided
        let imageUrl = null;
        if (file) {
            const uploadResult = await uploadToCloudinary(file);
            imageUrl = uploadResult.secure_url; 
        }

        // Save post to database
        const newPost = new Post({
            title,
            subtitle,
            category,
            content,
            slug,
            userId: req.user.id, 
            image: imageUrl,
            email: req.user.email,   
            
        });

        await newPost.save();

        // Update or create the category
        const existingCategory = await Category.findOne({ name: category });
        if (existingCategory) {
            existingCategory.postCount += 1;
            await existingCategory.save();
        } else {
            const newCategory = new Category({ name: category, postCount: 1 });
            await newCategory.save();
        }

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error.message);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

// Get Categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}, 'name');  // Fetch only the 'name' field
        res.status(200).json({ categories });  
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
