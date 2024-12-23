const Blog = require("../models/blog");
const User = require("../models/user");

// Helper function to calculate reading time (1 minute per 250 words)
const calculateReadingTime = (body) => {
  const words = body.split(" ").length;
  return Math.ceil(words / 250); // minutes
};

exports.createBlog = async (req, res) => {
  const { title, description, tags, body } = req.body;
  const { userId } = req.user;

  try {
    const blog = new Blog({
      title,
      description,
      tags,
      body,
      author: userId,
      reading_time: calculateReadingTime(body),
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBlogs = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    author,
    title,
    tags,
    sort = "timestamp",
    state,
  } = req.query;

  try {
    const filters = {};
    if (author) filters.author = author;
    if (title) filters.title = new RegExp(title, "i");
    if (tags) filters.tags = { $in: tags.split(",") };
    if (state) filters.state = state;

    const blogs = await Blog.find(filters)
      .sort({ [sort]: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(blogs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id).populate("author");
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.read_count += 1;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add more actions for updating, deleting, etc.
