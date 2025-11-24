from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import os
from typing import Optional
from uuid import uuid4
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
from fastapi import HTTPException

# Load MobileNetV2 for validation
try:
    validator_model = MobileNetV2(weights='imagenet')
    print("Validator model loaded successfully")
except Exception as e:
    print(f"Warning: Could not load validator model: {e}")
    validator_model = None

def is_plant_image(img_path):
    if validator_model is None:
        return True # Skip validation if model failed to load
        
    try:
        img = load_img(img_path, target_size=(224, 224))
        x = img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)
        
        preds = validator_model.predict(x)
        decoded = decode_predictions(preds, top=15)[0]
        
        # Keywords to identify plants/crops
        plant_keywords = [
            'plant', 'leaf', 'flower', 'fruit', 'vegetable', 'tree', 'grass', 
            'agriculture', 'crop', 'garden', 'pot', 'greenhouse', 'corn', 'maize',
            'wheat', 'rice', 'potato', 'tomato', 'pepper', 'fungus', 'mushroom',
            'cabbage', 'broccoli', 'cauliflower', 'zucchini', 'squash', 'cucumber',
            'pod', 'seed', 'root', 'stem', 'grain', 'harvest', 'orchard', 'lettuce',
            'spinach', 'herb', 'shrub', 'bush', 'vine', 'produce', 'food'
        ]
        
        # Check if any prediction matches plant keywords
        for _, label, prob in decoded:
            if any(keyword in label.lower() for keyword in plant_keywords):
                return True
                
        return False
        
    except Exception as e:
        print(f"Validation error: {e}")
        return True # Fail open

app = FastAPI()

# Allow CORS (for frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set model paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATHS = {
    "base": os.path.join(BASE_DIR, "models", "base.keras"),
    "tomato": os.path.join(BASE_DIR, "models", "model.h5")
}

# Cache loaded models
loaded_models = {}

def load_model(name: str):
    if name not in loaded_models:
        model_path = MODEL_PATHS.get(name, MODEL_PATHS["base"])
        loaded_models[name] = tf.keras.models.load_model(model_path)
    return loaded_models[name]

def predict(model, img_path):
    img = load_img(img_path, target_size=(256, 256))
    img_array = img_to_array(img) / 255.0
    img_array = tf.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    predicted_class = int(np.argmax(predictions[0]))
    confidence = round(100 * np.max(predictions[0]), 2)

    return predicted_class, confidence

@app.post("/predict")
async def predict_image(file: UploadFile = File(...), type: Optional[str] = Form("base")):
    try:
        # Save uploaded file temporarily
        temp_filename = f"temp_{uuid4().hex}.jpg"
        file_path = os.path.join(BASE_DIR, temp_filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Load appropriate model
        model_type = type.lower()
        if model_type not in MODEL_PATHS:
            model_type = "base"

        model = load_model(model_type)

        # Validate image before prediction
        if not is_plant_image(file_path):
            os.remove(file_path)
            raise HTTPException(status_code=400, detail="The uploaded image does not appear to be a plant leaf. Please upload a valid crop image.")

        # Predict
        predicted_class, confidence = predict(model, file_path)
        os.remove(file_path)

        return {
            "plant":type,
            "model_used": model_type,
            "predicted_class": predicted_class,
            "confidence": confidence
        }

    except Exception as e:
        return {"error": str(e)}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("text:app", host="0.0.0.0", port=8000, reload=True)
