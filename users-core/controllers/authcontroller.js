const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const xss = require("xss");
const Joi = require("joi");
const {
  generateTokenAndSend,
  verifyAndDecryptToken,
} = require("../../middlewares/genarattokenandcookies");
const {
  validateRegister,
  validateLogin,
  formatValidationErrors: formatAuthValidationErrors,
} = require("../validators/AuthValidator");
const { validateLocationUpdate } = require("../validators/ProfileValidator");
const emailService = require("../util/sendGemail");
const { getUserModel } = require("../../models/users-core/users.models");
const User = getUserModel();
const { refreshAccessToken } = require("../../middlewares/genarattokenandcookies");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */

exports.register = asyncHandler(async (req, res) => {
  const data = {
    role: xss(req.body.role),
    username: xss(req.body.username),
    email: xss(req.body.email),
    password: xss(req.body.password),
    phone: xss(req.body.phone),
    country: xss(req.body.country),
    Address: xss(req.body.Address),
    identityNumber: xss(req.body.identityNumber),
    IpPhone: xss(req.body.IpPhone),
    location: {
      type: "Point",
      coordinates: [
        parseFloat(xss(req.body.longitude)),
        parseFloat(xss(req.body.latitude)),
      ],
    },
    gender: xss(req.body.gender),
  };

  const { error } = validateRegister(data);
  if (error) {
    return res.status(400).json({ error: formatAuthValidationErrors(error) });
  }

  // Check email address in new structure
  const userExists = await User.findOne({ "email.address": data.email });
  if (userExists)
    return res.status(401).json({ error: "User already exists!" });

  // Check duplicate identity in KYC collection
  const { getUserKYCModel } = require("../../models/users-core/users.models");
  const UserKYC = getUserKYCModel();

  const idExists = await UserKYC.findOne({
    identityNumber: data.identityNumber,
  });
  if (idExists)
    return res
      .status(401)
      .json({ error: "Identity number already registered!" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const newUser = new User({
    role: data.role,
    username: data.username,
    email: {
      address: data.email,
      verified: false,
      verificationCode: verificationCode,
    },
    password: hashedPassword,
    phone: data.phone,
    location: data.location,
    country: data.country,
    Address: data.Address,
    gender: data.gender,
  });

  try {
    await newUser.save();

    // Post-save hook creates Wallet and KYC
    // We should update the KYC with the identity number we received
    // and automatically verify documentation if the user is a Patient
    await UserKYC.findOneAndUpdate(
      { userId: newUser._id },
      { 
        identityNumber: data.identityNumber,
        ...(data.role === "patient" ? { documentation: true } : {})
      },
      { upsert: true }, // Should exist, but safe
    );

    const result = await emailService.sendVerificationEmail({
      to: data.email,
      verificationCode,
      username: data.username || data.email,
    });

    if (!result || !result.success) {
      return res
        .status(500)
        .json({ error: "Failed to send verification email" });
    }

    generateTokenAndSend(newUser, res, {
      id: newUser._id,
      role: newUser.role,
      avatar: newUser.avatar,
      documentation: data.role === "patient", // Patients are auto-verified in register logic above
      message: "Verification email sent successfully",
    });

    console.log(`register successfully ${data.username}`)
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message)
  }
});

/**
 * @desc    Verify email address
 * @route   POST /api/auth/verifyEmail
 * @access  Public
 */
exports.verifyEmail = asyncHandler(async (req, res) => {
  try {
    const data = { code: xss(req.body.code) };
    const schema = Joi.object({ code: Joi.string().required() });
    const { error } = schema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({
      _id: req.user._id,
      "email.verificationCode": data.code,
    });

    if (!user)
      return res.status(404).json({ error: "User not found or invalid code!" });

    user.email.verified = true;
    user.email.verificationCode = null;
    await user.save();

    generateTokenAndSend(user, res, {
      id: user._id,
      role: user.role,
      avatar: user.avatar,
      documentation: user.documentation || false,
      message: "Email verified successfully!",
    });

    console.log(`verifyEmail successfully ${user.username}`)
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
    console.log(error.message)
  }
});

/**
 * @desc    User login
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  try {
    const data = {
      email: req.body.email ? xss(req.body.email.trim()) : undefined,
      password: req.body.password ? xss(req.body.password) : undefined,
      phone: req.body.phone ? xss(req.body.phone) : undefined,
      fcmToken: req.body.fcmToken ? xss(req.body.fcmToken) : undefined,
    };

    const { error } = validateLogin(data);
    if (error)
      return res.status(400).json({ error: formatAuthValidationErrors(error) });

    const loginQuery = [];
    if (data.email) loginQuery.push({ "email.address": data.email });
    if (data.phone) loginQuery.push({ phone: data.phone });

    if (loginQuery.length === 0) {
      return res.status(400).json({ error: "Invalid email or phone!" });
    }

    const user = await User.findOne({ $or: loginQuery });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password!" });

    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid email or password!" });

    const { getUserKYCModel } = require("../../models/users-core/users.models");
    const UserKYC = getUserKYCModel();
    const kyc = await UserKYC.findOne({ userId: user._id });
    const isDocVerified = kyc ? kyc.documentation : false;

    // Combine user data with documentation status for the token
    const userWithKYC = user.toObject();
    userWithKYC.documentation = isDocVerified;

    if (data.fcmToken) {
      if (!user.fcmTokens.includes(data.fcmToken)) {
        user.fcmTokens.push(data.fcmToken);
        if (user.fcmTokens.length > 5)
          user.fcmTokens = user.fcmTokens.slice(-5);
        await user.save();
      }
    }

    generateTokenAndSend(userWithKYC, res, {
      id: user._id,
      avatar: user.avatar,
      role: user.role,
      documentation: isDocVerified,
    });

    console.log(`login successfully ${user.username}`)
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message)
  }
});

/**
 * @desc    Update user location
 * @route   PATCH /api/auth/updateLocation
 * @access  Public
 */
exports.updateLocation = asyncHandler(async (req, res) => {
  try {
    const data = {
      location: {
        type: "Point",
        coordinates: [
          parseFloat(xss(req.body.longitude)),
          parseFloat(xss(req.body.latitude)),
        ],
      },
    };
    const locationPayload = {
      userId: String(req.user._id),
      coordinates: data.location.coordinates,
    };
    const { error } = validateLocationUpdate(locationPayload);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: data },
      { new: true },
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    generateTokenAndSend(user, res, {
      id: user._id,
      role: user.role,
      avatar: user.avatar,
      documentation: user.documentation || false,
      message: "Location updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @desc    Verify phone number
 * @route   POST /api/auth/viledLogin
 * @access  Public
 */
exports.viledLogin = asyncHandler(async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (fcmToken) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { fcmTokens: fcmToken },
      });

      const userDoc = await User.findById(req.user._id);
      if (userDoc && !userDoc.fcmTokens.includes(fcmToken)) {
        userDoc.fcmTokens.push(fcmToken);
        await userDoc.save();
      }
    }

    generateTokenAndSend(req.user, res, {
      id: req.user._id,
      role: req.user.role,
      avatar: req.user.avatar,
      documentation: req.user.documentation || false,
      message: `Welcome back ${req.user.username}`,
    });

    console.log(`viledLogin successfully ${req.user.username}`)


  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message)

  }
});

/**
 * @desc    User logout
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (fcmToken) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.fcmTokens = user.fcmTokens.filter((token) => token !== fcmToken);
        await user.save();
      }
    }

    res.setHeader("x-auth-token", "");
    res.status(200).json({ message: "Logged out successfully" });

    console.log(`logout successfully ${req.user.username}`)
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message)

  }
});

/**
 * @desc    Change user password
 * @route   POST /api/auth/changePassword
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Both old and new passwords are required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
    console.log(`changePassword successfully for user ${user._id}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
});

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/auth/refresh
 * @access  Public
 */

exports.Refresh = asyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: "refreshToken is required in request body",
      });
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiry,
    } = refreshAccessToken(refreshToken);

    // Send tokens via headers (primary for mobile)
    res.setHeader("auth-token", accessToken);
    res.setHeader("refresh-token", newRefreshToken);

    // Also send in response body (as backup)
    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiry,
      tokenType: "Bearer",
      message: "Token refreshed successfully - session extended indefinitely",
    });
  } catch (error) {
    console.error("[REFRESH] Error:", error);
    return res.status(401).json({
      error: "Failed to refresh token",
      message: error.message,
    });
  }
});
