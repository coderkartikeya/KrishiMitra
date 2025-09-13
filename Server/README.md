# Server Setup

This server provides agricultural market price data using the data.gov.in API.

## Prerequisites

1. **Python 3.7+**
2. **data.gov.in API Key** - Get one from [data.gov.in](https://data.gov.in/)

## Installation

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

### Option 1: Environment Variable (Recommended)

Set the API key as an environment variable:

**Windows (Command Prompt):**
```cmd
set DATA_GOV_IN_API_KEY=your_api_key_here
```

**Windows (PowerShell):**
```powershell
$env:DATA_GOV_IN_API_KEY="your_api_key_here"
```

**Linux/Mac:**
```bash
export DATA_GOV_IN_API_KEY=your_api_key_here
```

### Option 2: .env File

Create a `.env` file in the Server directory:
```
DATA_GOV_IN_API_KEY=your_api_key_here
```

### Option 3: Docker Compose

When using Docker Compose, set the environment variable:
```bash
export DATA_GOV_IN_API_KEY=your_api_key_here
docker-compose up
```

## Usage

Run the test script:
```bash
python test.py
```

## API Endpoints

The script fetches agricultural market prices from data.gov.in for:
- State, district, and market filtering
- Commodity and variety filtering
- Date-based filtering
- Pagination support

## Error Handling

If you get a "DATA_GOV_IN_API_KEY not set" error, make sure you've:
1. Obtained an API key from data.gov.in
2. Set the environment variable correctly
3. Restarted your terminal/shell after setting the variable

