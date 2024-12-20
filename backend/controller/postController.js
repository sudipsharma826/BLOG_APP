import Post from '../models/postModel.js';
import Category from '../models/categoryModel.js';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinary.js';

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

// Get a single post by slug
export const getPostBySlug = async (req, res) => {
    const slug = req.params.slug;


    if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
    }

    // Ensure the user is authenticated and is an admin
    if (!req.user.isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const post = await Post.findOne({ slug });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ post });
    } catch (error) {
        console.error('Error fetching post:', error.message);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};


// Update a post by slug
export const updatePost = async (req, res) => {
    const slug = req.params.slug;
    const { title, subtitle, category, content } = req.body;
    const file = req.file;
  
    if (!req.user || !req.user.isAdmin) {
      return res.status(401).json({ error: 'Admin privileges required to update a post' });
    }
  
    if (!title || !subtitle || !category || !content) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const post = await Post.findOne({ slug });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Handle image upload
      let image = post.image;
      if (file) {
        try {
          if (image) await deleteFromCloudinary(image);
          const uploadResult = await uploadToCloudinary(file);
          image = uploadResult.secure_url;
        } catch (err) {
          console.error('Image upload error:', err.message);
          return res.status(500).json({ error: 'Failed to upload image' });
        }
      }
  
      // Update post fields
      const oldCategory = post.category;
      post.title = title;
      post.subtitle = subtitle;
      post.category = category;
      post.content = content;
      post.image = image;
      post.updatedAt = new Date();
      post.userId = req.user.id;
  
      await post.save();
  
      // Update category counts
      if (oldCategory !== category) {
        const existingOldCategory = await Category.findOne({ name: oldCategory });
        if (existingOldCategory) {
          existingOldCategory.postCount -= 1;
          if (existingOldCategory.postCount <= 0) await existingOldCategory.deleteOne();
          else await existingOldCategory.save();
        }
      }
  
      const existingCategory = await Category.findOne({ name: category });
      if (existingCategory) {
        existingCategory.postCount += 1;
        await existingCategory.save();
      } else {
        const newCategory = new Category({ name: category, postCount: 1 });
        await newCategory.save();
      }
  
      res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
      console.error('Error updating post:', error.message);
      res.status(500).json({ error: 'Failed to update post' });
    }
  };


  // Delete a post by slug
  export const deletePost = async (req, res) => {
    const slug = req.params.slug;
  
    if (!req.user || !req.user.isAdmin) {
      return res.status(401).json({ error: 'Admin privileges required to delete a post' });
    }
  
    try {
      const post = await Post.findOne({ slug });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Delete post image from Cloudinary
      if (post.image) {
        await deleteFromCloudinary(post.image);
      }
  
      // Update category post count
      const existingCategory = await Category.findOne({ name: post.category });
      if (existingCategory) {
        existingCategory.postCount -= 1;
        if (existingCategory.postCount <= 0) {
          await existingCategory.deleteOne();
        } else {
          await existingCategory.save();
        }
      }
  
      // Delete the post
      await Post.deleteOne({ slug });
  
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error.message);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  };

// Get all posts with  filters
export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { category: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};


  