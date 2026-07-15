import { registerUser, loginUser } from "../services/auth.service.js";

/**
 * Register Controller
 */
export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Login Controller
 */
export const login = async (req, res) => {
  console.log("===== LOGIN API HIT =====");
  console.log(req.body);

  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Logged-in User Profile
 */
export const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

/**
 * Update Logged-in User Profile
 */
export const updateProfile = async (req, res) => {
  const { name, profileImage } = req.body;

  if (name) req.user.name = name;
  if (profileImage) req.user.profileImage = profileImage;

  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: req.user,
  });
};