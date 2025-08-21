import { useUserStore } from '../store/userStore';

// AI-powered recommendation service for KrishiMitra
export class RecommendationsService {
  constructor() {
    this.userStore = useUserStore.getState();
  }

  // Generate crop recommendations based on user profile and current conditions
  generateCropRecommendations() {
    const userProfile = this.userStore.userProfile;
    const farmingData = this.userStore.farmingData;
    const currentSeason = this.getCurrentSeason();
    
    const recommendations = [];

    // Basic crop recommendations based on season and location
    if (userProfile.location.state) {
      const seasonalCrops = this.getSeasonalCrops(currentSeason, userProfile.location.state);
      
      seasonalCrops.forEach(crop => {
        const recommendation = {
          name: crop.name,
          localName: crop.localNames[userProfile.preferredLanguage] || crop.name,
          season: currentSeason,
          soilType: crop.optimalSoil,
          waterRequirement: crop.waterNeeds,
          expectedYield: this.calculateExpectedYield(crop, userProfile.farmingExperience),
          marketPrice: this.getCurrentMarketPrice(crop.name, userProfile.location),
          reason: this.generateCropReason(crop, userProfile, currentSeason),
          confidence: this.calculateConfidenceScore(crop, userProfile),
          language: userProfile.preferredLanguage,
          category: 'seasonal',
          plantingTime: crop.plantingTime,
          harvestingTime: crop.harvestingTime,
          pestResistance: crop.pestResistance,
          diseaseResistance: crop.diseaseResistance
        };

        recommendations.push(recommendation);
      });
    }

    // Market-driven recommendations
    const marketOpportunities = this.analyzeMarketOpportunities(userProfile.location);
    marketOpportunities.forEach(opportunity => {
      const recommendation = {
        name: opportunity.cropName,
        localName: opportunity.localName,
        season: currentSeason,
        soilType: 'flexible',
        waterRequirement: 'moderate',
        expectedYield: opportunity.expectedYield,
        marketPrice: opportunity.currentPrice,
        reason: `High market demand with ${opportunity.priceIncrease}% price increase expected`,
        confidence: opportunity.confidence,
        language: userProfile.preferredLanguage,
        category: 'market-driven',
        marketTrend: opportunity.trend,
        demandPeriod: opportunity.demandPeriod
      };

      recommendations.push(recommendation);
    });

    // Personalized recommendations based on farming experience
    if (userProfile.farmingExperience === 'beginner') {
      const beginnerCrops = this.getBeginnerFriendlyCrops();
      beginnerCrops.forEach(crop => {
        const recommendation = {
          name: crop.name,
          localName: crop.localNames[userProfile.preferredLanguage] || crop.name,
          season: currentSeason,
          soilType: crop.optimalSoil,
          waterRequirement: crop.waterNeeds,
          expectedYield: crop.expectedYield,
          marketPrice: this.getCurrentMarketPrice(crop.name, userProfile.location),
          reason: 'Perfect for beginners - easy to grow and manage',
          confidence: 0.9,
          language: userProfile.preferredLanguage,
          category: 'beginner-friendly',
          difficulty: 'easy',
          maintenance: 'low'
        };

        recommendations.push(recommendation);
      });
    }

    // Add recommendations to store
    recommendations.forEach(rec => {
      this.userStore.addCropRecommendation(rec);
    });

    return recommendations;
  }

  // Generate farming practice recommendations
  generateFarmingPracticeRecommendations() {
    const userProfile = this.userStore.userProfile;
    const farmingData = this.userStore.farmingData;
    const currentSeason = this.getCurrentSeason();

    const practices = [];

    // Soil health practices
    if (farmingData.soilTestResults.length > 0) {
      const soilRecommendations = this.analyzeSoilHealth(farmingData.soilTestResults);
      soilRecommendations.forEach(practice => {
        practices.push({
          name: practice.name,
          localName: practice.localNames[userProfile.preferredLanguage] || practice.name,
          description: practice.description,
          benefits: practice.benefits,
          implementation: practice.implementation,
          cost: practice.cost,
          timeRequired: practice.timeRequired,
          season: currentSeason,
          language: userProfile.preferredLanguage,
          category: 'soil-health',
          urgency: practice.urgency
        });
      });
    }

    // Pest management practices
    if (farmingData.pestIssues.length > 0) {
      const pestRecommendations = this.analyzePestIssues(farmingData.pestIssues);
      pestRecommendations.forEach(practice => {
        practices.push({
          name: practice.name,
          localName: practice.localNames[userProfile.preferredLanguage] || practice.name,
          description: practice.description,
          benefits: practice.benefits,
          implementation: practice.implementation,
          cost: practice.cost,
          timeRequired: practice.timeRequired,
          season: currentSeason,
          language: userProfile.preferredLanguage,
          category: 'pest-management',
          effectiveness: practice.effectiveness
        });
      });
    }

    // Add practices to store
    practices.forEach(practice => {
      this.userStore.addFarmingPracticeRecommendation(practice);
    });

    return practices;
  }

  // Generate market opportunity recommendations
  generateMarketRecommendations() {
    const userProfile = this.userStore.userProfile;
    const currentSeason = this.getCurrentSeason();

    const opportunities = [];

    // Analyze nearby mandis
    if (userProfile.location.district) {
      const mandiAnalysis = this.analyzeNearbyMandis(userProfile.location);
      mandiAnalysis.forEach(mandi => {
        mandi.opportunities.forEach(opportunity => {
          opportunities.push({
            cropName: opportunity.cropName,
            localName: opportunity.localName,
            mandiName: mandi.name,
            currentPrice: opportunity.currentPrice,
            expectedPrice: opportunity.expectedPrice,
            bestSellingTime: opportunity.bestSellingTime,
            demand: opportunity.demand,
            reason: opportunity.reason,
            language: userProfile.preferredLanguage,
            distance: mandi.distance,
            transportCost: mandi.transportCost
          });
        });
      });
    }

    // Add opportunities to store
    opportunities.forEach(opportunity => {
      this.userStore.addMarketRecommendation(opportunity);
    });

    return opportunities;
  }

  // Helper methods
  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return 'summer';
    if (month >= 6 && month <= 9) return 'monsoon';
    if (month >= 10 && month <= 11) return 'winter';
    return 'winter'; // December and January
  }

  getSeasonalCrops(season, state) {
    // This would typically come from a database or API
    const seasonalCrops = {
      summer: {
        'Maharashtra': [
          {
            name: 'Cotton',
            localNames: { en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
            optimalSoil: 'black soil',
            waterNeeds: 'moderate',
            plantingTime: 'March-April',
            harvestingTime: 'September-October',
            pestResistance: 'medium',
            diseaseResistance: 'high'
          },
          {
            name: 'Soybean',
            localNames: { en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन' },
            optimalSoil: 'clay loam',
            waterNeeds: 'moderate',
            plantingTime: 'June-July',
            harvestingTime: 'October-November',
            pestResistance: 'high',
            diseaseResistance: 'medium'
          }
        ]
      },
      monsoon: {
        'Maharashtra': [
          {
            name: 'Rice',
            localNames: { en: 'Rice', hi: 'चावल', mr: 'भात' },
            optimalSoil: 'clay loam',
            waterNeeds: 'high',
            plantingTime: 'June-July',
            harvestingTime: 'October-November',
            pestResistance: 'medium',
            diseaseResistance: 'medium'
          }
        ]
      }
    };

    return seasonalCrops[season]?.[state] || [];
  }

  getBeginnerFriendlyCrops() {
    return [
      {
        name: 'Tomato',
        localNames: { en: 'Tomato', hi: 'टमाटर', mr: 'टोमॅटो' },
        optimalSoil: 'loamy',
        waterNeeds: 'moderate',
        expectedYield: '15-20 tons per acre',
        difficulty: 'easy',
        maintenance: 'low'
      },
      {
        name: 'Onion',
        localNames: { en: 'Onion', hi: 'प्याज', mr: 'कांदा' },
        optimalSoil: 'sandy loam',
        waterNeeds: 'moderate',
        expectedYield: '12-15 tons per acre',
        difficulty: 'easy',
        maintenance: 'low'
      }
    ];
  }

  calculateExpectedYield(crop, experience) {
    const baseYield = {
      'beginner': 0.7,
      'intermediate': 0.85,
      'expert': 1.0
    };

    const multiplier = baseYield[experience] || 0.8;
    return `${Math.round(crop.expectedYield * multiplier)} tons per acre`;
  }

  getCurrentMarketPrice(cropName, location) {
    // This would typically come from a real-time API
    const mockPrices = {
      'Cotton': '₹6,500 per quintal',
      'Soybean': '₹4,200 per quintal',
      'Rice': '₹2,800 per quintal',
      'Tomato': '₹40 per kg',
      'Onion': '₹25 per kg'
    };

    return mockPrices[cropName] || '₹0 per unit';
  }

  generateCropReason(crop, userProfile, season) {
    const reasons = [
      `Perfect ${season} crop for ${userProfile.location.state}`,
      `High market demand expected`,
      `Suitable for ${userProfile.farmingExperience} level farmers`,
      `Optimal soil conditions in your area`
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  calculateConfidenceScore(crop, userProfile) {
    let score = 0.5; // Base score

    // Location match
    if (userProfile.location.state) score += 0.2;

    // Experience level match
    if (userProfile.farmingExperience === 'expert') score += 0.2;
    else if (userProfile.farmingExperience === 'intermediate') score += 0.1;

    // Season match
    if (this.getCurrentSeason() === crop.season) score += 0.1;

    return Math.min(score, 1.0);
  }

  analyzeMarketOpportunities(location) {
    // Mock market analysis
    return [
      {
        cropName: 'Turmeric',
        localName: 'हल्दी',
        currentPrice: '₹8,000 per quintal',
        expectedPrice: '₹9,500 per quintal',
        priceIncrease: 18.75,
        expectedYield: '8-10 tons per acre',
        confidence: 0.85,
        trend: 'rising',
        demandPeriod: 'October-December'
      }
    ];
  }

  analyzeSoilHealth(soilTestResults) {
    // Mock soil analysis
    return [
      {
        name: 'Organic Matter Addition',
        localNames: { en: 'Organic Matter Addition', hi: 'जैविक पदार्थ जोड़ना', mr: 'सेंद्रिय पदार्थ जोडणे' },
        description: 'Add compost and organic matter to improve soil fertility',
        benefits: ['Improves soil structure', 'Increases water retention', 'Provides nutrients'],
        implementation: 'Apply 5-10 tons of compost per acre',
        cost: '₹2,000-5,000 per acre',
        timeRequired: '2-3 days',
        urgency: 'medium'
      }
    ];
  }

  analyzePestIssues(pestIssues) {
    // Mock pest analysis
    return [
      {
        name: 'Integrated Pest Management',
        localNames: { en: 'Integrated Pest Management', hi: 'एकीकृत कीट प्रबंधन', mr: 'एकात्मिक कीट व्यवस्थापन' },
        description: 'Use biological and chemical methods to control pests',
        benefits: ['Reduces pest damage', 'Minimizes chemical use', 'Long-term solution'],
        implementation: 'Combine neem oil, beneficial insects, and selective pesticides',
        cost: '₹1,500-3,000 per acre',
        timeRequired: '1-2 days',
        effectiveness: 'high'
      }
    ];
  }

  analyzeNearbyMandis(location) {
    // Mock mandi analysis
    return [
      {
        name: 'APMC Market, Pune',
        distance: '25 km',
        transportCost: '₹500 per ton',
        opportunities: [
          {
            cropName: 'Wheat',
            localName: 'गेहूं',
            currentPrice: '₹2,200 per quintal',
            expectedPrice: '₹2,500 per quintal',
            bestSellingTime: 'March-April',
            demand: 'high',
            reason: 'Post-harvest season with high demand'
          }
        ]
      }
    ];
  }

  // Generate personalized recommendations based on user behavior
  generatePersonalizedRecommendations() {
    const userActivity = this.userStore.userActivity;
    const recommendations = [];

    // Based on frequently visited pages
    const frequentPages = this.analyzePageVisits(userActivity.visitedPages);
    if (frequentPages.includes('crop-analysis')) {
      recommendations.push({
        type: 'feature',
        title: 'Advanced Crop Analysis',
        description: 'Based on your interest in crop analysis, try our AI-powered soil testing feature',
        priority: 'high'
      });
    }

    // Based on search history
    const searchPatterns = this.analyzeSearchPatterns(userActivity.searchHistory);
    if (searchPatterns.includes('pest-control')) {
      recommendations.push({
        type: 'content',
        title: 'Pest Management Guide',
        description: 'We noticed you\'re researching pest control. Here\'s a comprehensive guide',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  analyzePageVisits(visitedPages) {
    const pageCounts = {};
    visitedPages.forEach(page => {
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    });

    return Object.keys(pageCounts).filter(page => pageCounts[page] > 2);
  }

  analyzeSearchPatterns(searchHistory) {
    const patterns = [];
    searchHistory.forEach(search => {
      if (search.query.toLowerCase().includes('pest')) patterns.push('pest-control');
      if (search.query.toLowerCase().includes('soil')) patterns.push('soil-health');
      if (search.query.toLowerCase().includes('market')) patterns.push('market-analysis');
    });

    return [...new Set(patterns)];
  }

  // Update recommendations based on new user data
  updateRecommendations() {
    // Clear old recommendations
    this.userStore.clearOldRecommendations();

    // Generate new recommendations
    this.generateCropRecommendations();
    this.generateFarmingPracticeRecommendations();
    this.generateMarketRecommendations();

    // Generate personalized recommendations
    const personalized = this.generatePersonalizedRecommendations();
    
    return {
      crops: this.userStore.recommendations.crops,
      practices: this.userStore.recommendations.farmingPractices,
      markets: this.userStore.recommendations.marketOpportunities,
      personalized
    };
  }
}

// Export singleton instance
export const recommendationsService = new RecommendationsService(); 