import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
  req.headers.authorization &&
  req.headers.authorization.startsWith("Bearer")
) {

  console.log("Authorization Header:", req.headers.authorization);

  token = req.headers.authorization.split(" ")[1];

  console.log("Received Token:", token);
}

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify Token
const decoded = jwt.verify(token, process.env.JWT_SECRET);

console.log("Decoded:", decoded);

// Debug
const allUsers = await User.find().select("_id name email");
console.log("All Users:", allUsers);

const user = await User.findById(decoded.id).select("-password");
console.log("Found User:", user);

req.user = user;

if (!req.user) {
  return res.status(401).json({
    success: false,
    message: "User not found.",
  });
}

next();
  } catch (error) {
  console.error("JWT Error:", error);

  return res.status(401).json({
    success: false,
    message: error.message,
  });
}
};