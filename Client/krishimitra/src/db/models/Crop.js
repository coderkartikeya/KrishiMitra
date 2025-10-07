import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true
  },
  localName: {
    type: String,
    required: [true, 'Local name is required'],
    trim: true
  },
  variety: {
    type: String,
    required: [true, 'Crop variety is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['cereal', 'pulse', 'oilseed', 'vegetable', 'fruit', 'spice', 'cash_crop', 'other'],
    required: [true, 'Crop category is required']
  },

  // Farm Details
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required']
  },
  farmId: {
    type: String,
    required: [true, 'Farm ID is required']
  },
  area: {
    type: Number,
    required: [true, 'Area is required'],
    min: [0.1, 'Area must be at least 0.1 acres']
  },
  unit: {
    type: String,
    enum: ['acres', 'hectares', 'bigha', 'kanal'],
    default: 'acres'
  },

  // Planting Information
  plantedDate: {
    type: Date,
    required: [true, 'Planted date is required']
  },
  expectedHarvestDate: {
    type: Date,
    required: [true, 'Expected harvest date is required']
  },
  actualHarvestDate: {
    type: Date,
    default: null
  },

  // Growth Status
  status: {
    type: String,
    enum: ['planning', 'planting', 'growing', 'flowering', 'fruiting', 'harvesting', 'harvested', 'failed'],
    default: 'planning'
  },
  health: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'critical'],
    default: 'good'
  },
  growthStage: {
    type: String,
    enum: ['seedling', 'vegetative', 'flowering', 'fruiting', 'maturity', 'harvest'],
    default: 'seedling'
  },

  // Environmental Conditions
  soilType: {
    type: String,
    enum: ['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky', 'unknown'],
    default: 'unknown'
  },
  irrigationType: {
    type: String,
    enum: ['drip', 'sprinkler', 'flood', 'rainfed', 'manual'],
    default: 'rainfed'
  },
  waterRequirement: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  // Yield Information
  expectedYield: {
    type: Number,
    min: [0, 'Expected yield must be positive']
  },
  actualYield: {
    type: Number,
    min: [0, 'Actual yield must be positive'],
    default: null
  },
  yieldUnit: {
    type: String,
    enum: ['quintals', 'tons', 'kg', 'bags'],
    default: 'quintals'
  },

  // Financial Information
  investment: {
    seeds: {
      type: Number,
      default: 0
    },
    fertilizers: {
      type: Number,
      default: 0
    },
    pesticides: {
      type: Number,
      default: 0
    },
    irrigation: {
      type: Number,
      default: 0
    },
    labor: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  revenue: {
    type: Number,
    default: 0
  },
  profit: {
    type: Number,
    default: 0
  },

  // Weather and Environmental Data
  weatherData: {
    temperature: {
      min: Number,
      max: Number,
      average: Number
    },
    humidity: {
      min: Number,
      max: Number,
      average: Number
    },
    rainfall: {
      total: Number,
      average: Number
    },
    lastUpdated: Date
  },

  // Care Schedule
  careSchedule: [{
    task: {
      type: String,
      required: true
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    completedDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue', 'cancelled'],
      default: 'pending'
    },
    notes: String
  }],

  // Notes and Observations
  notes: [{
    date: {
      type: Date,
      default: Date.now
    },
    observation: {
      type: String,
      required: true
    },
    images: [String], // URLs to uploaded images
    weather: {
      temperature: Number,
      humidity: Number,
      rainfall: Number
    }
  }],

  // Images
  images: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['planting', 'growth', 'disease', 'harvest', 'other'],
      default: 'other'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // AI Recommendations
  aiRecommendations: [{
    type: {
      type: String,
      enum: ['fertilizer', 'pesticide', 'irrigation', 'harvest', 'general'],
      required: true
    },
    recommendation: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    generatedAt: {
      type: Date,
      default: Date.now
    },
    isApplied: {
      type: Boolean,
      default: false
    }
  }],

  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better performance
cropSchema.index({ farmerId: 1, createdAt: -1 });
cropSchema.index({ status: 1 });
cropSchema.index({ plantedDate: 1 });
cropSchema.index({ expectedHarvestDate: 1 });

// Virtual for calculating days since planting
cropSchema.virtual('daysSincePlanting').get(function() {
  if (!this.plantedDate) return null;
  const now = new Date();
  const diffTime = Math.abs(now - this.plantedDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for calculating days to harvest
cropSchema.virtual('daysToHarvest').get(function() {
  if (!this.expectedHarvestDate) return null;
  const now = new Date();
  const diffTime = this.expectedHarvestDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to calculate profit
cropSchema.methods.calculateProfit = function() {
  this.profit = this.revenue - this.investment.total;
  return this.profit;
};

// Method to update status based on dates
cropSchema.methods.updateStatus = function() {
  const now = new Date();
  const daysSincePlanting = this.daysSincePlanting;
  const daysToHarvest = this.daysToHarvest;

  if (daysToHarvest <= 0 && this.status !== 'harvested') {
    this.status = 'harvesting';
  } else if (daysSincePlanting > 30 && this.status === 'planting') {
    this.status = 'growing';
  } else if (daysSincePlanting > 60 && this.status === 'growing') {
    this.status = 'flowering';
  } else if (daysSincePlanting > 90 && this.status === 'flowering') {
    this.status = 'fruiting';
  }

  return this.status;
};

// Pre-save middleware to calculate totals and update status
cropSchema.pre('save', function(next) {
  // Calculate total investment
  this.investment.total = 
    this.investment.seeds + 
    this.investment.fertilizers + 
    this.investment.pesticides + 
    this.investment.irrigation + 
    this.investment.labor + 
    this.investment.other;

  // Calculate profit
  this.calculateProfit();

  // Update status
  this.updateStatus();

  // Update timestamp
  this.updatedAt = new Date();

  next();
});

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;

