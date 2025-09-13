import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# API Configuration
DATA_GOV_IN_API_KEY = os.getenv("DATA_GOV_IN_API_KEY")

# Validate required configuration
def validate_config():
    """Validate that all required configuration is present"""
    if not DATA_GOV_IN_API_KEY:
        raise RuntimeError(
            "DATA_GOV_IN_API_KEY environment variable is not set. "
            "Please set it with your data.gov.in API key. "
            "You can get one from: https://data.gov.in/"
        )

# Export configuration
__all__ = ['DATA_GOV_IN_API_KEY', 'validate_config']

