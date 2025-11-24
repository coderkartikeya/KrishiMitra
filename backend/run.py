#!/usr/bin/env python3
"""
Run script for Krishimitra Analysis API
"""
import uvicorn
from main import app

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )


