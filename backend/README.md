# Krishimitra Analysis API

A FastAPI backend for soil and crop analysis with disease detection capabilities.

## Features

- **Soil Analysis**: Analyze soil health, nutrients, and provide recommendations
- **Crop Analysis**: Monitor crop health, growth stages, and yield predictions
- **Disease Detection**: Detect plant diseases from leaf images
- **Image Analysis**: Process soil and crop images for insights

## Setup

1. **Install Python 3.8+** (if not already installed)

2. **Create virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**:
   ```bash
   python run.py
   ```
   
   Or directly:
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

## API Endpoints

### Health Check
- `GET /` - API status
- `GET /health` - Health check

### Soil Analysis
- `POST /api/soil/analyze` - Analyze soil data
- `POST /api/soil/analyze-image` - Analyze soil from image

### Crop Analysis
- `POST /api/crop/analyze` - Analyze crop data
- `POST /api/crop/analyze-image` - Analyze crop from image

### Disease Detection
- `POST /predict` - Detect plant diseases from leaf images

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

## Development

The API includes placeholder implementations for all endpoints. To add real functionality:

1. **Soil Analysis**: Integrate with soil testing APIs or ML models
2. **Crop Analysis**: Add computer vision models for crop health
3. **Disease Detection**: Integrate trained ML models for plant disease classification

## CORS Configuration

The API is configured to allow requests from:
- http://localhost:3000
- http://127.0.0.1:3000

Update the CORS origins in `main.py` if your frontend runs on different ports.

## Environment Variables

Create a `.env` file for configuration:
```
API_HOST=127.0.0.1
API_PORT=8000
DEBUG=True
```

## Testing

Test the API using curl or the Swagger UI:

```bash
# Health check
curl http://127.0.0.1:8000/health

# Soil analysis
curl -X POST "http://127.0.0.1:8000/api/soil/analyze" \
     -H "Content-Type: application/json" \
     -d '{"ph_level": 6.5, "moisture_content": 60}'
```


