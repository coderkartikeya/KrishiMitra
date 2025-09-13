import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Authentication store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Authentication state
      isAuthenticated: false,
      user: null,
      tokens: {
        accessToken: null,
        refreshToken: null
      },
      isLoading: false,
      error: null,

      // Actions
      login: async (userData, tokens) => {
        // console.log('Logging in user:', userData);
        set({
          isAuthenticated: true,
          user: userData,
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          },
          isLoading: false,
          error: null
        });
        // console.log('User logged in successfully');
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          tokens: {
            accessToken: null,
            refreshToken: null
          },
          isLoading: false,
          error: null
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: {
            ...state.user,
            ...userData
          }
        }));
      },

      updateTokens: (tokens) => {
        set((state) => ({
          tokens: {
            ...state.tokens,
            ...tokens
          }
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Check if user is authenticated
      isLoggedIn: () => {
        const state = get();
        return state.isAuthenticated && state.user && state.tokens.accessToken;
      },

      // Get user ID
      getUserId: () => {
        const state = get();
        return state.user?.id || null;
      },

      // Get access token
      getAccessToken: () => {
        const state = get();
        return state.tokens.accessToken;
      },

      // Get refresh token
      getRefreshToken: () => {
        const state = get();
        return state.tokens.refreshToken;
      },

      // Check if token is expired (basic check)
      isTokenExpired: () => {
        const state = get();
        if (!state.tokens.accessToken) return true;
        
        try {
          const payload = JSON.parse(atob(state.tokens.accessToken.split('.')[1]));
          return Date.now() >= payload.exp * 1000;
        } catch {
          return true;
        }
      },

      // Refresh authentication state from server
      refreshAuth: async () => {
        const state = get();
        if (!state.tokens.refreshToken) {
          get().logout();
          return false;
        }

        try {
          set({ isLoading: true });
          
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Tokens are automatically set via cookies
              set({ isLoading: false, error: null });
              return true;
            }
          }
          
          // If refresh fails, logout
          get().logout();
          return false;
        } catch (error) {
          console.error('Token refresh error:', error);
          get().logout();
          return false;
        }
      },

      // Initialize auth state from cookies
      initializeAuth: async () => {
        try {
          console.log('AuthStore: Initializing authentication...');
          set({ isLoading: true });
          
          const response = await fetch('/api/auth/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // console.log('AuthStore: Profile response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('AuthStore: Profile data:', data);
            if (data.success) {
              set({
                isAuthenticated: true,
                user: data.user,
                isLoading: false,
                error: null
              });
              // console.log('AuthStore: Authentication initialized successfully');
              return true;
            }
          }
          
          // If profile fetch fails, user is not authenticated
          // console.log('AuthStore: Profile fetch failed, logging out');
          get().logout();
          return false;
        } catch (error) {
          console.error('AuthStore: Auth initialization error:', error);
          get().logout();
          return false;
        }
      }
    }),
    {
      name: 'krishimitra-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        // Don't persist tokens - they're in cookies
      })
    }
  )
);

// Helper functions for authentication
export const authHelpers = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return useAuthStore.getState().isAuthenticated;
  },

  // Get current user
  getCurrentUser: () => {
    return useAuthStore.getState().user;
  },

  // Get user ID
  getUserId: () => {
    return useAuthStore.getState().getUserId();
  },

  // Login user
  loginUser: async (userData, tokens) => {
    return useAuthStore.getState().login(userData, tokens);
  },

  // Logout user
  logoutUser: () => {
    return useAuthStore.getState().logout();
  },

  // Update user data
  updateUserData: (userData) => {
    return useAuthStore.getState().updateUser(userData);
  },

  // Initialize authentication
  initializeAuth: () => {
    return useAuthStore.getState().initializeAuth();
  },

  // Refresh authentication
  refreshAuth: () => {
    return useAuthStore.getState().refreshAuth();
  }
};
