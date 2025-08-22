import { useCallback, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { recommendationsService } from '../services/recommendationsService';

// Custom hook for managing user preferences and recommendations
export const useUserPreferences = () => {
  const {
    userProfile,
    languagePreferences,
    recommendations,
    userActivity,
    farmingData,
    notifications,
    setUserProfile,
    updateLanguagePreference,
    addRecommendation,
    markRecommendationAsRead,
    updateFarmingData,
    trackUserActivity,
    addSearchQuery,
    updateNotificationSettings,
    getRecommendationsByLanguage,
    getUnreadRecommendations,
    getRecommendationsByCrop,
    clearOldRecommendations,
    resetStore
  } = useUserStore();

  // Initialize user profile if not exists
  useEffect(() => {
    if (!userProfile.id) {
      setUserProfile({
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      });
    }
  }, [userProfile.id, setUserProfile]);

  // Track page visits automatically
  useEffect(() => {
    const currentPage = window.location.pathname;
    trackUserActivity(currentPage);
  }, [trackUserActivity]);

  // Update recommendations when user data changes
  useEffect(() => {
    if (userProfile.location.state && userProfile.farmingExperience) {
      const updateRecs = async () => {
        try {
          await recommendationsService.updateRecommendations();
        } catch (error) {
          console.error('Failed to update recommendations:', error);
        }
      };
      updateRecs();
    }
  }, [userProfile.location.state, userProfile.farmingExperience]);

  // Language management
  const changePrimaryLanguage = useCallback((language) => {
    updateLanguagePreference(language, true);
  }, [updateLanguagePreference]);

  const addSecondaryLanguage = useCallback((language) => {
    updateLanguagePreference(language, false);
  }, [updateLanguagePreference]);

  const removeSecondaryLanguage = useCallback((language) => {
    // This would need to be implemented in the store
    // console.log('Remove secondary language:', language);
  }, []);

  // User profile management
  const updateProfile = useCallback((profileData) => {
    setUserProfile(profileData);
  }, [setUserProfile]);

  const updateLocation = useCallback((locationData) => {
    setUserProfile({ location: locationData });
  }, [setUserProfile]);

  const updateFarmingExperience = useCallback((experience) => {
    setUserProfile({ farmingExperience: experience });
  }, [setUserProfile]);

  const updatePrimaryCrops = useCallback((crops) => {
    setUserProfile({ primaryCrops: crops });
  }, [setUserProfile]);

  const updateFarmSize = useCallback((size) => {
    setUserProfile({ farmSize: size });
  }, [setUserProfile]);

  // Farming data management
  const addSoilTestResult = useCallback((soilData) => {
    updateFarmingData({
      soilTestResults: [...farmingData.soilTestResults, soilData]
    });
  }, [farmingData.soilTestResults, updateFarmingData]);

  const addPestIssue = useCallback((pestData) => {
    updateFarmingData({
      pestIssues: [...farmingData.pestIssues, pestData]
    });
  }, [farmingData.pestIssues, updateFarmingData]);

  const addPlantedCrop = useCallback((cropData) => {
    updateFarmingData({
      plantedCrops: [...farmingData.plantedCrops, cropData]
    });
  }, [farmingData.plantedCrops, updateFarmingData]);

  const updateCurrentSeason = useCallback((season) => {
    updateFarmingData({ currentSeason: season });
  }, [updateFarmingData]);

  // Activity tracking
  const trackFeatureUsage = useCallback((featureName) => {
    trackUserActivity(null, featureName);
  }, [trackUserActivity]);

  const trackSearch = useCallback((query) => {
    addSearchQuery(query, languagePreferences.primaryLanguage);
  }, [addSearchQuery, languagePreferences.primaryLanguage]);

  const markTutorialComplete = useCallback((tutorialName) => {
    // This would need to be implemented in the store
    console.log('Mark tutorial complete:', tutorialName);
  }, []);

  // Recommendations management
  const markRecommendationRead = useCallback((type, id) => {
    markRecommendationAsRead(type, id);
  }, [markRecommendationAsRead]);

  const getLocalizedRecommendations = useCallback(() => {
    return getRecommendationsByLanguage(languagePreferences.primaryLanguage);
  }, [getRecommendationsByLanguage, languagePreferences.primaryLanguage]);

  const getCropSpecificRecommendations = useCallback((cropName) => {
    return getRecommendationsByCrop(cropName);
  }, [getRecommendationsByCrop]);

  const getUnreadCount = useCallback(() => {
    return getUnreadRecommendations().length;
  }, [getUnreadRecommendations]);

  // Notification management
  const toggleNotification = useCallback((type) => {
    updateNotificationSettings({
      [type]: !notifications[type]
    });
  }, [notifications, updateNotificationSettings]);

  const setNotificationLanguage = useCallback((language) => {
    updateNotificationSettings({ language });
  }, [updateNotificationSettings]);

  // Data cleanup
  const cleanupOldData = useCallback(() => {
    clearOldRecommendations();
  }, [clearOldRecommendations]);

  // Export user data
  const exportUserData = useCallback(() => {
    const data = {
      userProfile,
      languagePreferences,
      recommendations,
      userActivity,
      farmingData,
      notifications,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `krishimitra-user-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [userProfile, languagePreferences, recommendations, userActivity, farmingData, notifications]);

  // Import user data
  const importUserData = useCallback((data) => {
    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (parsedData.userProfile) setUserProfile(parsedData.userProfile);
      if (parsedData.languagePreferences) {
        Object.entries(parsedData.languagePreferences).forEach(([key, value]) => {
          if (key === 'primaryLanguage') {
            updateLanguagePreference(value, true);
          } else if (key === 'secondaryLanguages') {
            value.forEach(lang => updateLanguagePreference(lang, false));
          }
        });
      }
      if (parsedData.farmingData) updateFarmingData(parsedData.farmingData);
      if (parsedData.notifications) updateNotificationSettings(parsedData.notifications);
      
      return { success: true, message: 'Data imported successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to import data: ' + error.message };
    }
  }, [setUserProfile, updateLanguagePreference, updateFarmingData, updateNotificationSettings]);

  // Get user statistics
  const getUserStats = useCallback(() => {
    return {
      totalRecommendations: recommendations.crops.length + 
                           recommendations.farmingPractices.length + 
                           recommendations.marketOpportunities.length,
      unreadRecommendations: getUnreadCount(),
      totalSessions: userActivity.totalSessions,
      favoriteFeatures: userActivity.favoriteFeatures.length,
      completedTutorials: userActivity.completedTutorials.length,
      lastActive: userProfile.lastActive,
      memberSince: userProfile.createdAt
    };
  }, [recommendations, getUnreadCount, userActivity, userProfile]);

  return {
    // State
    userProfile,
    languagePreferences,
    recommendations,
    userActivity,
    farmingData,
    notifications,
    
    // Language management
    changePrimaryLanguage,
    addSecondaryLanguage,
    removeSecondaryLanguage,
    
    // Profile management
    updateProfile,
    updateLocation,
    updateFarmingExperience,
    updatePrimaryCrops,
    updateFarmSize,
    
    // Farming data management
    addSoilTestResult,
    addPestIssue,
    addPlantedCrop,
    updateCurrentSeason,
    
    // Activity tracking
    trackFeatureUsage,
    trackSearch,
    markTutorialComplete,
    
    // Recommendations
    markRecommendationRead,
    getLocalizedRecommendations,
    getCropSpecificRecommendations,
    getUnreadCount,
    
    // Notifications
    toggleNotification,
    setNotificationLanguage,
    
    // Data management
    cleanupOldData,
    exportUserData,
    importUserData,
    resetStore,
    
    // Statistics
    getUserStats
  };
};

// Hook for language-specific content
export const useLanguageContent = () => {
  const { languagePreferences, changePrimaryLanguage } = useUserPreferences();
  
  const isCurrentLanguage = useCallback((language) => {
    return languagePreferences.primaryLanguage === language;
  }, [languagePreferences.primaryLanguage]);

  const hasSecondaryLanguage = useCallback((language) => {
    return languagePreferences.secondaryLanguages.includes(language);
  }, [languagePreferences.secondaryLanguages]);
  const setLanguageContent=(language)=>{
    languagePreferences.primaryLanguage=language;
  }

  return {
    currentLanguage: languagePreferences.primaryLanguage,
    secondaryLanguages: languagePreferences.secondaryLanguages,
    autoTranslate: languagePreferences.autoTranslate,
    changeLanguage: changePrimaryLanguage,
    isCurrentLanguage,
    hasSecondaryLanguage,
    setLanguageContent
  };
};

// Hook for recommendations
export const useRecommendations = () => {
  const { 
    recommendations, 
    getLocalizedRecommendations, 
    getCropSpecificRecommendations,
    getUnreadCount,
    markRecommendationRead 
  } = useUserPreferences();

  const getRecommendationsByType = useCallback((type) => {
    return recommendations[type] || [];
  }, [recommendations]);

  const getRecommendationsByPriority = useCallback((type, priority = 'all') => {
    const recs = recommendations[type] || [];
    if (priority === 'all') return recs;
    return recs.filter(rec => rec.priority === priority);
  }, [recommendations]);

  return {
    recommendations,
    getLocalizedRecommendations,
    getCropSpecificRecommendations,
    getRecommendationsByType,
    getRecommendationsByPriority,
    unreadCount: getUnreadCount(),
    markAsRead: markRecommendationRead
  };
}; 