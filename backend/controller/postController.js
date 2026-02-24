import Post from '../models/postModel.js';
import Category from '../models/categoryModel.js';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinary.js';
import User from '../models/userModel.js';
import sendMail from '../utils/resend.js';
import Subscribe from '../models/subscribeModel.js';
import { deleteCachePattern } from '../utils/redis.js';

// Create a new post
export const createPost = async (req, res) => {
    if(!req.user.isAdmin){
        return res.status(401).json({ error: 'Admin privileges required to create a post' });
    }
    
    const { title, subtitle, content ,isFeatured} = req.body;
    let categories = JSON.parse(req.body.category); // Parse categories from request

    // Ensure categories are mapped to names or IDs
    if (categories && categories.length) {
        categories = categories.map((category) => category.name || category); // Handle both objects and strings
    }

    const file = req.file;

    // Validate input fields
    if (!title || !subtitle || !categories || !content) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Generate slug from the title
    const slug = title
        .toLowerCase()
        .split(' ')
        .join('-')
        .replace(/[^a-zA-Z0-9-]/g, '');

    try {
        let imageUrl = null;
        if (file) {
            const uploadResult = await uploadToCloudinary(file);
            imageUrl = uploadResult.secure_url;
        }

        // Fetch author details from the User model
        const author = await User.findOne({ email: req.user.email });
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        // Save the new post
        const newPost = new Post({
            title,
            subtitle,
            category: categories, // Ensure categories are an array of strings
            content,
            slug,
            userId: req.user.id,
            authorEmail: req.user.email,
            image: imageUrl,
            isFeatured: isFeatured,
        });


        await newPost.save();

        // Get all subscribed users
        const subscribedUsers = await Subscribe.find();
        const allSubscribedEmails = subscribedUsers.map((user) => user.email);


        //Get User Login user Deatils
        const currentUser = await User.findOne({ email: req.user.email });
       


        // Send email to subscribed users
        await sendMail({
            email: null,
            subject: `🔔 New Post Alert: ${newPost.title}`,
            message: null,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDWbNklDVmYkFY8qpAEi1wO-nDVSdiW9hLmf4JqUQyyKFiK_cCS4ZtcqOTD_XKc2faeOCenbFAr9nSEG9ZcC7wy3t1KFbnXUyMaQpi_mF61oSTxluNRr3lQe0-zz9-uYh-45WZGlBzWOr5ZjNfRbTx3DwptVtSwequyJ_70fdX1nbYxz4PpaTER6_0LLw/s1600/Screenshot_2024-05-18_163234-removebg-preview.png" alt="Sudip Sharma Logo" style="max-width: 200px; border-radius: 10px;">
              </div>
              <h2 style="color: #333;">Hello , ${currentUser.username}!</h2>
              <p style="font-size: 16px; line-height: 1.5;">A new post has been published on our community. Here’s what you need to know:</p>
              <div style="text-align: center; margin-bottom: 20px;">
                <a href="https://sudipsharma.com.np/blog/${newPost.slug}" style="text-decoration: none;">
                  <img src="${imageUrl}" alt="${newPost.title}" style="width: 100%; max-width: 500px; border-radius: 10px; margin-bottom: 10px;">
                </a>
              </div>
              <h3 style="color: #007BFF; font-size: 20px; text-align: center;">
                <a href="https://sudipsharma.com.np/blog/${newPost.slug}" style="text-decoration: none; color: #007BFF;">${newPost.title}</a>
              </h3>
              <p style="font-size: 14px; color: #555; text-align: center;">By <strong>${author.username}</strong> | Published on ${new Date().toLocaleDateString()}</p>
              <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">${content.split(' ').slice(0, 20).join(' ')}...</p>
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://sudipsharma.com.np/blog/${newPost.slug}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Read More</a>
              </div>
              <p style="font-size: 16px; line-height: 1.5; margin-top: 30px;">For assistance, feel free to reach out to us:</p>
              <ul style="font-size: 16px; line-height: 1.5; padding-left: 20px;">
                <li><strong>Email:</strong> <a href="mailto:sudeepsharma826@gmail.com" style="color: #007BFF;">sudeepsharma826@gmail.com</a></li>
                <li><strong>Mobile:</strong>977 + 9816662624</li>
              </ul>
              <p style="font-size: 16px; line-height: 1.5;">Connect with us on social media:</p>
              <div style="text-align: center; margin-top: 20px;">
                <a href="https://www.linkedin.com/in/sudipsharmanp/" style="margin-right: 10px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 30px; height: 30px;">
                </a>
                <a href="https://www.facebook.com/sudipsharma.np/" style="margin-left: 10px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 30px; height: 30px;">
                </a>
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://sudipsharma.com.np" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
              </div>
              <p style="font-size: 16px; line-height: 1.5; margin-top: 30px; text-align: center; color: #666;">
                Thank you for being part of our community!<br>
                <strong>- Sudip Sharma Team</strong>
              </p>
            </div>
            `,
            bcc: allSubscribedEmails,
        });

        // Update or create categories
        for (let cat of categories) {
            const existingCategory = await Category.findOne({ name: cat });
            if (existingCategory) {
                existingCategory.postCount += 1;
                await existingCategory.save();
            } else {
                const newCategory = new Category({ name: cat, postCount: 1 });
                await newCategory.save();
            }
        }

        // Invalidate all post-related caches after creating a new post
        await deleteCachePattern('cache:*');

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error.message);
        res.status(500).json({ error: 'Failed to create post' });
    }
};



// Get Categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

// Get a single post by slug
export const getPostBySlug = async (req, res) => {
    const { slug } = req.params;

    if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
    }

    try {
        const post = await Post.findOne({ slug });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Increment post views by 1
        post.postViews += 1;
        await post.save();

        res.status(200).json({ post });
    } catch (error) {
        console.error('Error fetching post:', error.message);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
};

// Update a post by slug
export const updatePost = async (req, res) => {
    const { slug } = req.params;
    const { title, subtitle, content ,isFeatured} = req.body;
    let categories = JSON.parse(req.body.category); // Parse categories
    const file = req.file;

    if (!req.user || !req.user.isAdmin) {
        return res.status(401).json({ error: 'Admin privileges required to update a post' });
    }

    if (!title || !subtitle || !content || !categories || !Array.isArray(categories)) {
        return res.status(400).json({ error: 'All fields are required and categories must be an array' });
    }

    // Normalize category names (preserve case)
    categories = categories.map(category =>
        typeof category === 'string' ? category.trim() : category.name.trim()
    );

    try {
        const post = await Post.findOne({ slug });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

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

        const oldCategories = post.category;
        post.title = title;
        post.subtitle = subtitle;
        post.category = categories; // Update categories
        post.content = content;
        post.image = image;
        post.updatedAt = new Date();
        post.userId = req.user.id;
        post.authorEmail = req.user.email;
        post.isFeatured = isFeatured;

        await post.save();

        // Handle old categories
        await Promise.all(
            oldCategories.map(async oldCategory => {
                const existingOldCategory = await Category.findOne({ name: oldCategory });
                if (existingOldCategory) {
                    existingOldCategory.postCount -= 1;

                    if (existingOldCategory.postCount <= 0) {
                        // Remove category if no posts are left
                        await existingOldCategory.deleteOne();
                    } else {
                        // Save updated category
                        await existingOldCategory.save();
                    }
                }
            })
        );

        // Handle new categories
        await Promise.all(
            categories.map(async category => {
                // Find category case-insensitively
                const existingCategory = await Category.findOne({ name: { $regex: `^${category}$`, $options: 'i' } });
                if (existingCategory) {
                    existingCategory.postCount += 1;
                    // Optionally update name to match latest case
                    if (existingCategory.name !== category) {
                        existingCategory.name = category;
                    }
                    await existingCategory.save();
                } else {
                    // Create new category
                    const newCategory = new Category({ name: category, postCount: 1 });
                    await newCategory.save();
                }
            })
        );

        // Invalidate all post-related caches after updating
        await deleteCachePattern('cache:*');

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error('Error updating post:', error.message);
        res.status(500).json({ error: 'Failed to update post' });
    }
};


// Delete a post by slug
export const deletePost = async (req, res) => {
    const { slug } = req.params;

    // Check for admin privileges
    if (!req.user || !req.user.isAdmin) {
        return res.status(401).json({ error: "Admin privileges required to delete a post" });
    }

    try {
        // Find the post by slug
        const post = await Post.findOne({ slug });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Delete associated image from Cloudinary
        if (post.image) {
            await deleteFromCloudinary(post.image);
        }

        const categories = post.category; // Array of categories

        // Delete the post
        await Post.deleteOne({ slug });

        // Update categories
        await Promise.all(
            categories.map(async (category) => {
                const existingCategory = await Category.findOne({ name: category });
                if (existingCategory) {
                    existingCategory.postCount -= 1;

                    if (existingCategory.postCount <= 0) {
                        // Remove category if no posts are left
                        await existingCategory.deleteOne();
                    } else {
                        // Save updated category
                        await existingCategory.save();
                    }
                }
            })
        );

        // Remove the post ID from user actions (likedPosts, lovedPosts, savedPosts) from user Model
        await User.updateMany(
            { 
                $or: [
                    { likedPosts: post._id },
                    { lovedPosts: post._id },
                    { savedPosts: post._id }
                ] 
            },
            { 
                $pull: { 
                    likedPosts: post._id,
                    lovedPosts: post._id,
                    savedPosts: post._id 
                } 
            }
        );

        // Remove the user references in the post growth fields (usersLikeList, usersLoveList, usersCommentList)
        const userUpdatePromises = [
            User.updateMany(
                { _id: { $in: post.usersLikeList } },
                { $pull: { likedPosts: post._id } }
            ),
            User.updateMany(
                { _id: { $in: post.usersLoveList } },
                { $pull: { lovedPosts: post._id } }
            ),
            User.updateMany(
                { _id: { $in: post.usersCommentList } },
                { $pull: { savedPosts: post._id } } // Optional if comments relate to saved posts
            )
        ];

        await Promise.all(userUpdatePromises);

        // Invalidate all post-related caches after deletion
        await deleteCachePattern('cache:*');

        res.status(200).json({ message: "Post deleted successfully and removed from all related data." });
    } catch (error) {
        console.error("Error deleting post:", error.message);
        res.status(500).json({ error: "Failed to delete post" });
    }
};



// Get all posts with filters
export const getPosts = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;
  
      // Build the query object based on provided filters
      const query = {
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } },
            { category: { $regex: req.query.searchTerm, $options: 'i' } },
            { subtitle: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      };
  
      // Fetch filtered and sorted posts
      const posts = await Post.find(query)
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      // Extract unique author emails from posts
      const authorEmails = [...new Set(posts.map((post) => post.authorEmail))];
  
      // Fetch corresponding author details
      const authors = await User.find({ email: { $in: authorEmails } }).select('email username photoURL');
  
      // Map author details for enrichment
      const authorMap = authors.reduce((acc, author) => {
        acc[author.email] = { username: author.username, avatar: author.photoURL };
        return acc;
      }, {});
  
      // Enrich posts with author details
      const enrichedPosts = posts.map((post) => ({
        ...post._doc, // Include all existing post fields
        author: authorMap[post.authorEmail] || {}, // Add author details
      }));
  
      // Calculate additional metadata
      const totalPosts = await Post.countDocuments(query);
      const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
      const lastMonthPosts = await Post.countDocuments({
        ...query,
        createdAt: { $gte: oneMonthAgo },
      });
  
      // Respond with enriched posts and metadata
      res.status(200).json({
        posts: enrichedPosts,
        totalPosts,
        lastMonthPosts,
      });
    } catch (error) {
      next(error);
    }
  };
  

// Delete a category
export const deleteCategory = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(401).json({ error: 'Admin privileges required to delete a category' });
    }

    const { categoryId } = req.params;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const categoryName = category.name;
        const postsToDelete = await Post.find({ category: categoryName });
        if (postsToDelete.length > 0) {
            await Post.deleteMany({ category: categoryName });
        }

        await category.deleteOne();

        // Invalidate all post-related caches after category deletion
        await deleteCachePattern('cache:*');

        res.status(200).json({ message: 'Category and associated posts deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error.message);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

// Helper function to check if user is authenticated, if post exists, and if user exists
const findPost = async (req, res) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { postId, userId } = req.body;

    // Check if postId and userId are provided in the request body
    if (!postId || !userId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    

    // Check if user exists in the User model
    const user = await User.findById(userId); // Corrected from 'user.findById' to 'User.findById'
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    return post;
};


// Helper function to add or remove interactions
const toggleInteraction = async (action, post, user, postList, userList, res) => {
    try {
        const isAlreadyInteracted = post[postList].includes(user._id);
        
        if (action === 'add' && !isAlreadyInteracted) {
            post[postList].push(user._id);
            user[userList].push(post._id);
        } else if (action === 'remove' && isAlreadyInteracted) {
            post[postList] = post[postList].filter((id) => id.toString() !== user._id.toString());
            user[userList] = user[userList].filter((id) => id.toString() !== post._id.toString());
        } else {
            // Avoid sending multiple responses: Return early if already interacted or not
            return res.status(400).json({ error: `Post already ${action === 'add' ? 'interacted' : 'not interacted'}` });
        }

        // Only one response is sent now
        await post.save();
        await user.save();

        return res.status(200).json({ message: `Post ${action === 'add' ? '' : 'un'}${postList.slice(5)}d successfully` });
    } catch (error) {
        // Ensure there's only one response
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message || 'Server error' });
        }
    }
};


// Like Button
export const likePost = async (req, res) => {
    try {
        const post = await findPost(req, res);  // Pass res here
        const { userId } = req.body;
        const user = await User.findById(userId);
        return toggleInteraction('add', post, user, 'usersLikeList', 'likedPosts', res);
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Server error' });
    }
};

// Unlike Button
export const unlikePost = async (req, res) => {
    try {
        const post = await findPost(req, res);  // Pass res here
        const { userId } = req.body;
        const user = await User.findById(userId);
        return toggleInteraction('remove', post, user, 'usersLikeList', 'likedPosts', res);
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Server error' });
    }
};

// Love Button
export const lovePost = async (req, res) => {
    try {
        const post = await findPost(req, res);  // Pass res here
        const { userId } = req.body;
        const user = await User.findById(userId);
        return toggleInteraction('add', post, user, 'usersLoveList', 'lovedPosts', res);
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Server error' });
    }
};

// Unlove Button
export const unlovePost = async (req, res) => {
    try {
        const post = await findPost(req, res);  // Pass res here
        const { userId } = req.body;
        const user = await User.findById(userId);
        return toggleInteraction('remove', post, user, 'usersLoveList', 'lovedPosts', res);
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Server error' });
    }
};

// Save Post Button
export const savePost = async (req, res) => {
    try {
        const post = await findPost(req, res);  // Pass res here
        const { userId } = req.body;
        const user = await User.findById(userId);
        return toggleInteraction('add', post, user, 'usersSaveList', 'savedPosts', res);
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Server error' });
    }
};

// Unsave Post Button
export const unSavePost = async (req, res) => {
    try {
        const post = await findPost(req, res);  // Pass res here
        const { userId } = req.body;
        const user = await User.findById(userId);
        return toggleInteraction('remove', post, user, 'usersSaveList', 'savedPosts', res);
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Server error' });
    }
};


//Get Featured Posts
export const getFeaturedPosts = async (req, res) => {
        try {
            // Fetch only featured posts
            const featuredPosts = await Post.find({ isFeatured: true })
                .sort({ updatedAt: -1, createdAt: -1 });

            // Collect all unique author emails from the posts
            const authorEmails = [...new Set(featuredPosts.map((post) => post.authorEmail))];

            // Fetch corresponding author details
            const authors = await User.find({ email: { $in: authorEmails } }).select('email username photoURL');

            // Map author details to their email for easy lookup
            const authorMap = authors.reduce((acc, author) => {
                acc[author.email] = { username: author.username, avatar: author.photoURL };
                return acc;
            }, {});

            // Enrich posts with author details
            const enrichedPosts = featuredPosts.map((post) => ({
                ...post._doc,
                author: authorMap[post.authorEmail] || {},
            }));

            res.status(200).json({ posts: enrichedPosts });
        } catch (error) {
            console.error('Error fetching featured posts:', error.message);
            res.status(500).json({ error: 'Failed to fetch featured posts' });
        }
    };


//Add Category
export const addCategory = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(401).json({ error: 'Admin privileges required to add a category' });
    }

    const { name } = req.body;
    const file = req.file;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        let image = null;
        if (file) {
            const uploadResult = await uploadToCloudinary(file);
            image = uploadResult.secure_url;
            
        }

        const newCategory = new Category({ 
            name, 
            catrgoryImage : image , 
            postCount: 0 ,
            createdAt: new Date()
         });
        await newCategory.save();

        // Invalidate category caches after adding new category
        await deleteCachePattern('cache:*');

        res.status(200).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
        console.error('Error adding category:', error.message);
        res.status(500).json({ error: 'Failed to add category' });
    }
};

export const updateCategory = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(401).json({ error: 'Admin privileges required to update a category' });
    }

    const { categoryId } = req.params;
    const { name } = req.body;
    const file = req.file;
    console.log(categoryId, name, file);

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        let image = category.catrgoryImage; // Preserve existing image initially

        // Only replace image if a new file is provided
        if (file != undefined) {
            try {
                // Delete old image from Cloudinary only if a new image is uploaded
                if (image) {
                    await deleteFromCloudinary(image);
                }
                const uploadResult = await uploadToCloudinary(file);
                image = uploadResult.secure_url;  // Get new image URL after upload
            } catch (err) {
                console.error('Image upload error:', err.message);
                return res.status(500).json({ error: 'Failed to upload image' });
            }
        }

        // Update the category with the new name and image
        category.name = name;
        category.catrgoryImage = image;  // Set to new image if updated, else retain old one
        category.updatedAt = new Date();
        await category.save();

        // Invalidate category caches after update
        await deleteCachePattern('cache:*');

        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        console.error('Error updating category:', error.message);
        res.status(500).json({ error: 'Failed to update category' });
    }
};


//Get a single category by slug
export const getCategoryBySlug = async (req, res) => {
    const { categorySlug } = req.params;

    if (!categorySlug) {
        return res.status(400).json({ error: 'Category slug is required' });
    }

    try {
        const category = await Category.findOne({ name: categorySlug });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({ category });
    } catch (error) {
        console.error('Error fetching category:', error.message);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

