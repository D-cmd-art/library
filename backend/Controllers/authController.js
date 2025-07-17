const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// It's crucial to load environment variables.
// If you're using 'dotenv', ensure it's configured in your server.js/app.js
// For example: require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET; // Get secret from environment variables

// Register new user
exports.registerUser = async (req, res) => {
    // The schema now includes 'role' with a default, so we don't need to explicitly
    // ask for it here for a standard user registration.
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // When creating a new user, the 'role' field will automatically
        // default to 'user' as defined in your Mongoose schema.
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        // Sign JWT token including user ID and their role
        // This is important for the 'authorizeRoles' middleware to work
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role }, // Include role in the token payload
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send back the token and the user's role
        res.status(201).json({
            token,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role // Return the role
            }
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Login existing user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Sign JWT token including user ID and their role
        // This is crucial for the 'authorizeRoles' middleware to work
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Include role in the token payload
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send back the token and the user's role
        res.json({
            token,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role // Return the role
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
