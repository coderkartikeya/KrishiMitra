import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// User preferences and recommendations store
export const useUserStore = create(
  persist(
    (set, get) => ({
      // User Profile
      userProfile: {
        id: null,
        name: '',
        phone: '',
        location: {
          state: '',
          district: '',
          village: '',
          coordinates: null
        },
        farmingExperience: '', // 'beginner', 'intermediate', 'expert'
        primaryCrops: [],
        farmSize: '', // in acres
        preferredLanguage: 'en',
        secondaryLanguages: [],
        lastActive: null,
        createdAt: null
      },

      // Language Preferences
      languagePreferences: {
        primaryLanguage: 'en',
        secondaryLanguages: [],
        autoTranslate: true,
        preferredScript: 'latin', // 'latin', 'devanagari', 'bengali', etc.
        lastLanguageChange: null
      },

      // User Recommendations
      recommendations: {
        crops: [],
        farmingPractices: [],
        marketOpportunities: [],
        weatherAlerts: [],
        governmentSchemes: [],
        lastUpdated: null
      },

      // User Activity & Learning
      userActivity: {
        visitedPages: [],
        searchHistory: [],
        favoriteFeatures: [],
        completedTutorials: [],
        lastSession: null,
        totalSessions: 0
      },

      // Farming Data
      farmingData: {
        currentSeason: '',
        plantedCrops: [],
        soilTestResults: [],
        pestIssues: [],
        yieldPredictions: [],
        marketPrices: []
      },

      // Notifications & Alerts
      notifications: {
        weatherAlerts: true,
        marketUpdates: true,
        pestAlerts: true,
        governmentSchemes: true,
        farmingTips: true,
        language: 'en'
      },

      // Actions
      setUserProfile: (profile) => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...profile,
            lastActive: new Date().toISOString()
          }
        }));
      },

      updateLanguagePreference: (language, isPrimary = false) => {
        const currentState = get();
        const now = new Date().toISOString();
        
        if (isPrimary) {
          set((state) => ({
            languagePreferences: {
              ...state.languagePreferences,
              primaryLanguage: language,
              lastLanguageChange: now
            },
            userProfile: {
              ...state.userProfile,
              preferredLanguage: language,
              lastActive: now
            }
          }));
        } else {
          set((state) => ({
            languagePreferences: {
              ...state.languagePreferences,
              secondaryLanguages: state.languagePreferences.secondaryLanguages.includes(language)
                ? state.languagePreferences.secondaryLanguages
                : [...state.languagePreferences.secondaryLanguages, language],
              lastLanguageChange: now
            }
          }));
        }
      },

      addRecommendation: (type, recommendation) => {
        set((state) => ({
          recommendations: {
            ...state.recommendations,
            [type]: [
              ...state.recommendations[type],
              {
                ...recommendation,
                id: Date.now(),
                timestamp: new Date().toISOString(),
                isRead: false
              }
            ],
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      markRecommendationAsRead: (type, recommendationId) => {
        set((state) => ({
          recommendations: {
            ...state.recommendations,
            [type]: state.recommendations[type].map(rec =>
              rec.id === recommendationId ? { ...rec, isRead: true } : rec
            )
          }
        }));
      },

      updateFarmingData: (data) => {
        set((state) => ({
          farmingData: {
            ...state.farmingData,
            ...data,
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      addCropRecommendation: (cropData) => {
        const recommendation = {
          cropName: cropData.name,
          localName: cropData.localName,
          season: cropData.season,
          soilType: cropData.soilType,
          waterRequirement: cropData.waterRequirement,
          expectedYield: cropData.expectedYield,
          marketPrice: cropData.marketPrice,
          reason: cropData.reason, // Why this crop is recommended
          confidence: cropData.confidence, // AI confidence score
          language: get().languagePreferences.primaryLanguage
        };

        get().addRecommendation('crops', recommendation);
      },

      addMarketRecommendation: (marketData) => {
        const recommendation = {
          cropName: marketData.cropName,
          localName: marketData.localName,
          mandiName: marketData.mandiName,
          currentPrice: marketData.currentPrice,
          expectedPrice: marketData.expectedPrice,
          bestSellingTime: marketData.bestSellingTime,
          demand: marketData.demand,
          reason: marketData.reason,
          language: get().languagePreferences.primaryLanguage
        };

        get().addRecommendation('marketOpportunities', recommendation);
      },

      addFarmingPracticeRecommendation: (practiceData) => {
        const recommendation = {
          practiceName: practiceData.name,
          localName: practiceData.localName,
          description: practiceData.description,
          benefits: practiceData.benefits,
          implementation: practiceData.implementation,
          cost: practiceData.cost,
          timeRequired: practiceData.timeRequired,
          season: practiceData.season,
          language: get().languagePreferences.primaryLanguage
        };

        get().addRecommendation('farmingPractices', recommendation);
      },

      trackUserActivity: (page, feature = null) => {
        const now = new Date().toISOString();
        set((state) => ({
          userActivity: {
            ...state.userActivity,
            visitedPages: [
              ...state.userActivity.visitedPages.filter(p => p !== page),
              page
            ].slice(-10), // Keep last 10 pages
            lastSession: now,
            totalSessions: state.userActivity.totalSessions + 1
          }
        }));

        if (feature) {
          set((state) => ({
            userActivity: {
              ...state.userActivity,
              favoriteFeatures: state.userActivity.favoriteFeatures.includes(feature)
                ? state.userActivity.favoriteFeatures
                : [...state.userActivity.favoriteFeatures, feature]
            }
          }));
        }
      },

      addSearchQuery: (query, language) => {
        set((state) => ({
          userActivity: {
            ...state.userActivity,
            searchHistory: [
              {
                query,
                language,
                timestamp: new Date().toISOString()
              },
              ...state.userActivity.searchHistory
            ].slice(0, 50) // Keep last 50 searches
          }
        }));
      },

      updateNotificationSettings: (settings) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            ...settings
          }
        }));
      },

      getRecommendationsByLanguage: (language) => {
        const state = get();
        const allRecommendations = [
          ...state.recommendations.crops,
          ...state.recommendations.farmingPractices,
          ...state.recommendations.marketOpportunities
        ];

        return allRecommendations.filter(rec => rec.language === language);
      },

      getUnreadRecommendations: () => {
        const state = get();
        const allRecommendations = [
          ...state.recommendations.crops,
          ...state.recommendations.farmingPractices,
          ...state.recommendations.marketOpportunities,
          ...state.recommendations.weatherAlerts,
          ...state.recommendations.governmentSchemes
        ];

        return allRecommendations.filter(rec => !rec.isRead);
      },

      getRecommendationsByCrop: (cropName) => {
        const state = get();
        const allRecommendations = [
          ...state.recommendations.crops,
          ...state.recommendations.farmingPractices,
          ...state.recommendations.marketOpportunities
        ];

        return allRecommendations.filter(rec => 
          rec.cropName?.toLowerCase().includes(cropName.toLowerCase()) ||
          rec.localName?.toLowerCase().includes(cropName.toLowerCase())
        );
      },

      clearOldRecommendations: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        set((state) => ({
          recommendations: {
            ...state.recommendations,
            crops: state.recommendations.crops.filter(rec => 
              new Date(rec.timestamp) > thirtyDaysAgo
            ),
            farmingPractices: state.recommendations.farmingPractices.filter(rec => 
              new Date(rec.timestamp) > thirtyDaysAgo
            ),
            marketOpportunities: state.recommendations.marketOpportunities.filter(rec => 
              new Date(rec.timestamp) > thirtyDaysAgo
            )
          }
        }));
      },

      resetStore: () => {
        set({
          userProfile: {
            id: null,
            name: '',
            phone: '',
            location: { state: '', district: '', village: '', coordinates: null },
            farmingExperience: '',
            primaryCrops: [],
            farmSize: '',
            preferredLanguage: 'en',
            secondaryLanguages: [],
            lastActive: null,
            createdAt: null
          },
          languagePreferences: {
            primaryLanguage: 'en',
            secondaryLanguages: [],
            autoTranslate: true,
            preferredScript: 'latin',
            lastLanguageChange: null
          },
          recommendations: {
            crops: [],
            farmingPractices: [],
            marketOpportunities: [],
            weatherAlerts: [],
            governmentSchemes: [],
            lastUpdated: null
          },
          userActivity: {
            visitedPages: [],
            searchHistory: [],
            favoriteFeatures: [],
            completedTutorials: [],
            lastSession: null,
            totalSessions: 0
          },
          farmingData: {
            currentSeason: '',
            plantedCrops: [],
            soilTestResults: [],
            pestIssues: [],
            yieldPredictions: [],
            marketPrices: []
          },
          notifications: {
            weatherAlerts: true,
            marketUpdates: true,
            pestAlerts: true,
            governmentSchemes: true,
            farmingTips: true,
            language: 'en'
          }
        });
      }
    }),
    {
      name: 'krishimitra-user-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userProfile: state.userProfile,
        languagePreferences: state.languagePreferences,
        recommendations: state.recommendations,
        userActivity: state.userActivity,
        farmingData: state.farmingData,
        notifications: state.notifications
      })
    }
  )
);

// Helper functions for common operations
export const userStoreHelpers = {
  // Get user's preferred language for content
  getUserLanguage: () => {
    const state = useUserStore.getState();
    return state.languagePreferences.primaryLanguage;
  },

  // Check if user has secondary language
  hasSecondaryLanguage: (language) => {
    const state = useUserStore.getState();
    return state.languagePreferences.secondaryLanguages.includes(language);
  },

  // Get recommendations in user's preferred language
  getLocalizedRecommendations: () => {
    const state = useUserStore.getState();
    const language = state.languagePreferences.primaryLanguage;
    return useUserStore.getState().getRecommendationsByLanguage(language);
  },

  // Add a new crop recommendation
  addCropSuggestion: (cropData) => {
    useUserStore.getState().addCropRecommendation(cropData);
  },

  // Add a new market opportunity
  addMarketSuggestion: (marketData) => {
    useUserStore.getState().addMarketRecommendation(marketData);
  },

  // Track page visit
  trackPageVisit: (pageName) => {
    useUserStore.getState().trackUserActivity(pageName);
  },

  // Update user location
  updateUserLocation: (locationData) => {
    useUserStore.getState().setUserProfile({
      location: locationData
    });
  }
}; 