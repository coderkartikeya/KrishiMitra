'use client';

import { useEffect } from 'react';
import { useAuth } from '../middleware/clientAuth.js';

export default function AuthProvider({ children }) {
  const { initializeAuth, isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Initialize authentication state when the app loads
    console.log('AuthProvider: Initializing auth...');
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    console.log('AuthProvider: Auth state changed:', { isAuthenticated, user: user?.id, isLoading });
  }, [isAuthenticated, user, isLoading]);

  // Show loading state while initializing auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
