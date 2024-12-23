const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const user = new User({ first_name, last_name, email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
