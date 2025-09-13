import { verifyToken } from '../utils/jwt.js';
import { getTokenFromRequest } from '../utils/cookies.js';
import User from '../db/models/User.js';

/**
 * Authentication middleware
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const token = await getTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = verifyToken(token);
    
    // Find user in database
    const user = await User.findById(decoded.userId).select('-pin');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    if (user.isAccountLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Add user to request object
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = await getTokenFromRequest(req);
    
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-pin');
      
      if (user && user.isActive && !user.isAccountLocked()) {
        req.user = user;
        req.userId = user._id;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Check if user is verified
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
export const requireVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required'
    });
  }

  next();
};

/**
 * Rate limiting middleware for authentication attempts
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
export const rateLimitAuth = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    
    if (!mobile) {
      return next();
    }

    const user = await User.findByMobile(mobile);
    
    if (user && user.isAccountLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.'
      });
    }

    next();
  } catch (error) {
    console.error('Rate limit auth error:', error);
    next();
  }
};

/**
 * Admin authentication middleware
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

/**
 * Sync authentication state with client store
 * This function can be called from API routes to update the client store
 * @param {Object} user - User object
 * @param {Object} tokens - Token object
 */
export const syncAuthWithStore = (user, tokens) => {
  // This would typically be called from the client side
  // Server-side middleware can't directly update client stores
  // But we can provide the data structure that the client expects
  return {
    user: {
      id: user._id,
      mobile: user.mobile,
      aadhaar: user.aadhaar,
      location: user.location,
      profile: user.profile,
      farm: user.farm,
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    tokens: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  };
};

/**
 * Get user data for client store
 * @param {Object} user - User object from database
 * @returns {Object} Formatted user data for client store
 */
export const formatUserForStore = (user) => {
  return {
    id: user._id,
    mobile: user.mobile,
    aadhaar: user.aadhaar,
    location: user.location,
    profile: user.profile,
    farm: user.farm,
    isVerified: user.isVerified,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    preferences: user.preferences,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};