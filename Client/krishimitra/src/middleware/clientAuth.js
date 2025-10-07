import { useAuthStore, authHelpers } from '../store/authStore.js';

/**
 * Client-side authentication middleware
 * This runs in the browser and integrates with the auth store
 */
export class ClientAuthMiddleware {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize authentication state
   */
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await authHelpers.initializeAuth();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return authHelpers.isAuthenticated();
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return authHelpers.getCurrentUser();
  }

  /**
   * Get user ID
   */
  getUserId() {
    return authHelpers.getUserId();
  }

  /**
   * Login user and update store
   */
  async login(userData, tokens) {
    try {
      await authHelpers.loginUser(userData, tokens);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  /**
   * Logout user and clear store
   */
  async logout() {
    try {
      // Call logout API to clear server-side cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Clear client-side store
      authHelpers.logoutUser();
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local store even if API call fails
      authHelpers.logoutUser();
      return false;
    }
  }

  /**
   * Update user data in store
   */
  updateUser(userData) {
    authHelpers.updateUserData(userData);
  }

  /**
   * Refresh authentication tokens
   */
  async refreshAuth() {
    try {
      return await authHelpers.refreshAuth();
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Make authenticated API request
   */
  async authenticatedRequest(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      // If unauthorized, try to refresh token
      if (response.status === 401) {
        const refreshed = await this.refreshAuth();
        if (refreshed) {
          // Retry the request
          return await fetch(url, defaultOptions);
        } else {
          // Refresh failed, redirect to login
          this.logout();
          window.location.href = '/login';
          return null;
        }
      }

      return response;
    } catch (error) {
      console.error('Authenticated request failed:', error);
      throw error;
    }
  }

  /**
   * Check if route requires authentication
   */
  requiresAuth(pathname) {
    const protectedRoutes = [
      '/dashboard',
      '/profile',
      '/settings',
      '/mycrops',
      '/market',
      '/schemes',
      '/soilAnalysis',
      '/plantDisease',
      '/plantscan'
    ];

    return protectedRoutes.some(route => pathname.startsWith(route));
  }

  /**
   * Handle route protection
   */
  handleRouteProtection(pathname) {
    if (this.requiresAuth(pathname) && !this.isAuthenticated()) {
      // Redirect to login
      window.location.href = '/login';
      return false;
    }
    return true;
  }
}

// Create singleton instance
export const clientAuth = new ClientAuthMiddleware();

// React hook for authentication
export const useAuth = () => {
  const authStore = useAuthStore();
  
  return {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    isLoading: authStore.isLoading,
    error: authStore.error,
    login: authStore.login,
    logout: authStore.logout,
    updateUser: authStore.updateUser,
    refreshAuth: authStore.refreshAuth,
    initializeAuth: authStore.initializeAuth
  };
};

// Higher-order component for protected routes
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Utility function to check authentication status
export const checkAuth = () => {
  return clientAuth.isAuthenticated();
};

// Utility function to get current user
export const getCurrentUser = () => {
  return clientAuth.getCurrentUser();
};





