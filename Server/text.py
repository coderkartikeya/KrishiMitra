from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import os
from typing import Optional
from uuid import uuid4

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
