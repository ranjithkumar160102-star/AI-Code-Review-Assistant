import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

/**
 * Register a new user
 */
export const registerUser = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate JWT
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Login user
 */
export const loginUser = async ({ email, password }) => {

  console.log("================================");
  console.log("Email from frontend:", email);
  console.log("Password from frontend:", password);

  // Find user
  const user = await User.findOne({ email });

  console.log("User from DB:", user);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  console.log("Password Match:", isMatch);
  console.log("================================");

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};