from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from datetime import datetime

app = FastAPI(title="Krishimitra Analysis API", version="1.0.0")

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class SoilAnalysisRequest(BaseModel):
    location: Optional[str] = None
    soil_type: Optional[str] = None
    ph_level: Optional[float] = None
    moisture_content: Optional[float] = None
    organic_matter: Optional[float] = None
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None

class SoilAnalysisResponse(BaseModel):
    analysis_id: str
    timestamp: str
    soil_health_score: float
    recommendations: List[str]
    suitable_crops: List[str]
    fertilizer_suggestions: List[str]
    irrigation_advice: str
    ph_status: str
    nutrient_balance: dict

class CropAnalysisRequest(BaseModel):
    crop_type: str
    growth_stage: Optional[str] = None
    planting_date: Optional[str] = None
    area: Optional[float] = None
    soil_type: Optional[str] = None

class CropAnalysisResponse(BaseModel):
    analysis_id: str
    timestamp: str
    crop_health_score: float
    growth_recommendations: List[str]
    pest_disease_alerts: List[str]
    harvest_prediction: dict
    yield_forecast: dict
    care_schedule: List[dict]

class DiseaseDetectionRequest(BaseModel):
    plant_type: str
    confidence_threshold: float = 0.5

class DiseaseDetectionResponse(BaseModel):
    predicted_class: int
    confidence: float
    disease_name: str
    remedies: List[str]
    severity: str

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Krishimitra Analysis API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Soil Analysis Endpoints
@app.post("/api/soil/analyze", response_model=SoilAnalysisResponse)
async def analyze_soil(
    soil_data: SoilAnalysisRequest,
    image: Optional[UploadFile] = File(None)
):
    """
    Analyze soil health and provide recommendations
    """
    try:
        analysis_id = f"soil_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # TODO: Implement actual soil analysis logic
        # This is a placeholder implementation
        soil_health_score = 75.0  # Placeholder score
        
        recommendations = [
            "Add organic compost to improve soil structure",
            "Consider pH adjustment based on target crops",
            "Implement crop rotation to maintain soil health"
        ]
        
        suitable_crops = [
            "Wheat", "Rice", "Tomato", "Potato", "Onion"
        ]
        
        fertilizer_suggestions = [
            "Apply NPK 19:19:19 at 50kg per acre",
            "Add organic manure 2-3 weeks before planting"
        ]
        
        irrigation_advice = "Maintain soil moisture at 60-70% field capacity"
        ph_status = "Optimal" if soil_data.ph_level and 6.0 <= soil_data.ph_level <= 7.5 else "Needs adjustment"
        
        nutrient_balance = {
            "nitrogen": "adequate" if soil_data.nitrogen and soil_data.nitrogen > 20 else "deficient",
            "phosphorus": "adequate" if soil_data.phosphorus and soil_data.phosphorus > 15 else "deficient",
            "potassium": "adequate" if soil_data.potassium and soil_data.potassium > 100 else "deficient"
        }
        
        return SoilAnalysisResponse(
            analysis_id=analysis_id,
            timestamp=datetime.now().isoformat(),
            soil_health_score=soil_health_score,
            recommendations=recommendations,
            suitable_crops=suitable_crops,
            fertilizer_suggestions=fertilizer_suggestions,
            irrigation_advice=irrigation_advice,
            ph_status=ph_status,
            nutrient_balance=nutrient_balance
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soil analysis failed: {str(e)}")

@app.post("/api/soil/analyze-image")
async def analyze_soil_image(image: UploadFile = File(...)):
    """
    Analyze soil from image (color, texture, etc.)
    """
    try:
        # TODO: Implement image analysis logic
        # This is a placeholder implementation
        return {
            "analysis_id": f"soil_img_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "soil_color": "brown",
            "texture": "loamy",
            "moisture_indicator": "moderate",
            "organic_matter_indicator": "good",
            "recommendations": [
                "Soil appears healthy with good organic matter content",
                "Consider adding compost for better structure"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soil image analysis failed: {str(e)}")

# Crop Analysis Endpoints
@app.post("/api/crop/analyze", response_model=CropAnalysisResponse)
async def analyze_crop(crop_data: CropAnalysisRequest):
    """
    Analyze crop health and provide growth recommendations
    """
    try:
        analysis_id = f"crop_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # TODO: Implement actual crop analysis logic
        crop_health_score = 80.0  # Placeholder score
        
        growth_recommendations = [
            "Ensure adequate spacing between plants",
            "Monitor for signs of nutrient deficiency",
            "Maintain consistent watering schedule"
        ]
        
        pest_disease_alerts = [
            "Watch for aphid infestation in early growth stage",
            "Monitor for fungal diseases during humid conditions"
        ]
        
        harvest_prediction = {
            "estimated_harvest_date": "2024-03-15",
            "days_to_harvest": 45,
            "harvest_readiness": "on_track"
        }
        
        yield_forecast = {
            "expected_yield": 25.5,
            "yield_unit": "quintals",
            "confidence_level": 85
        }
        
        care_schedule = [
            {
                "date": "2024-02-01",
                "task": "Apply first dose of fertilizer",
                "priority": "high"
            },
            {
                "date": "2024-02-15",
                "task": "Check for pest infestation",
                "priority": "medium"
            }
        ]
        
        return CropAnalysisResponse(
            analysis_id=analysis_id,
            timestamp=datetime.now().isoformat(),
            crop_health_score=crop_health_score,
            growth_recommendations=growth_recommendations,
            pest_disease_alerts=pest_disease_alerts,
            harvest_prediction=harvest_prediction,
            yield_forecast=yield_forecast,
            care_schedule=care_schedule
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crop analysis failed: {str(e)}")

@app.post("/api/crop/analyze-image")
async def analyze_crop_image(
    image: UploadFile = File(...),
    crop_type: str = "general"
):
    """
    Analyze crop health from image
    """
    try:
        # TODO: Implement crop image analysis logic
        return {
            "analysis_id": f"crop_img_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "crop_health": "good",
            "growth_stage": "vegetative",
            "issues_detected": [],
            "recommendations": [
                "Crop appears healthy",
                "Continue current care routine"
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crop image analysis failed: {str(e)}")

# Disease Detection Endpoint (for compatibility with existing frontend)
@app.post("/predict", response_model=DiseaseDetectionResponse)
async def predict_disease(
    file: UploadFile = File(...),
    plant: str = "Tomato"
):
    """
    Predict plant disease from leaf image
    """
    try:
        # TODO: Implement actual ML model prediction
        # This is a placeholder implementation
        predicted_class = 0  # Placeholder class index
        confidence = 85.5  # Placeholder confidence
        
        # Mock disease data based on plant type
        disease_mapping = {
            "Tomato": {
                0: {"name": "Tomato_Target_Spot", "remedies": ["Remove infected leaves", "Apply fungicide"]},
                1: {"name": "Tomato_healthy", "remedies": ["Continue monitoring"]},
                2: {"name": "Tomato_Early_blight", "remedies": ["Apply fungicide", "Improve air circulation"]}
            },
            "Potato": {
                0: {"name": "Potato_Early_blight", "remedies": ["Apply fungicide", "Crop rotation"]},
                1: {"name": "Potato_healthy", "remedies": ["Continue monitoring"]},
                2: {"name": "Potato_Late_blight", "remedies": ["Remove infected plants", "Apply copper fungicide"]}
            }
        }
        
        disease_info = disease_mapping.get(plant, disease_mapping["Tomato"])[predicted_class]
        
        return DiseaseDetectionResponse(
            predicted_class=predicted_class,
            confidence=confidence,
            disease_name=disease_info["name"],
            remedies=disease_info["remedies"],
            severity="moderate" if "healthy" not in disease_info["name"] else "none"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Disease prediction failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


