import os
import requests
from urllib.parse import urlencode
from config import DATA_GOV_IN_API_KEY, validate_config

BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

def build_params(api_key, limit=500, offset=0, **filters):
    """
    filters can include: state, district, market, commodity, variety, arrival_date
    Example: state="Delhi", market="Azadpur", commodity="Tomato"
    """
    # data.gov.in uses nested 'filters[field]' query params
    filter_params = {f"filters[{k}]": v for k, v in filters.items() if v}
    return {
        "api-key": api_key,
        "format": "json",
        "limit": str(limit),
        "offset": str(offset),
        **filter_params
    }

def fetch_mandi_prices(state=None, district=None, market=None, commodity=None, variety=None, date=None, max_pages=20):
    """
    Returns a list of price records for the supplied location filters.
    'date' expects YYYY-MM-DD (AGMARKNET arrival/price date).
    """
    # Validate configuration
    validate_config()
    api_key = DATA_GOV_IN_API_KEY

    all_rows = []
    offset = 0
    page = 0
    while page < max_pages:
        params = build_params(
            api_key=api_key,
            limit=1000,
            offset=offset,
            state=state,
            district=district,
            market=market,
            commodity=commodity,
            variety=variety,
            arrival_date=date  # field commonly used by the dataset
        )
        try:
            print(f"Making request to API with params: {params}")
            resp = requests.get(BASE_URL, params=params, timeout=30)
            print(f"Response status: {resp.status_code}")
            print(f"Response headers: {dict(resp.headers)}")
            
            if resp.status_code != 200:
                print(f"Error response: {resp.text}")
                resp.raise_for_status()
                
            data = resp.json()
            print(f"Response data keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
        except ValueError as e:
            print(f"Failed to parse JSON: {e}")
            print(f"Response text: {resp.text}")
            raise
        rows = data.get("records") or data.get("data") or []
        if not rows:
            break
        all_rows.extend(rows)
        # Stop if fewer than 'limit' came back (no more pages)
        if len(rows) < int(params["limit"]):
            break
        offset += int(params["limit"])
        page += 1
    return all_rows

if __name__ == "__main__":
    try:
        print("Starting mandi price fetch...")
        print(f"API Key set: {'Yes' if DATA_GOV_IN_API_KEY else 'No'}")
        
        # EXAMPLES:
        # 1) All commodities for a specific market today:
        print("Fetching prices for Delhi, Azadpur market...")
        records = fetch_mandi_prices(state="Delhi", market="Azadpur")
        
        print(f"Total records fetched: {len(records)}")
        
        if records:
            # Pretty print a few fields from the first 5 rows
            print("\nFirst 5 records:")
            for i, r in enumerate(records[:5]):
                print(f"Record {i+1}:")
                print(f"  State: {r.get('state')}")
                print(f"  District: {r.get('district')}")
                print(f"  Market: {r.get('market')}")
                print(f"  Commodity: {r.get('commodity')}")
                print(f"  Variety: {r.get('variety')}")
                print(f"  Min Price: {r.get('min_price')}")
                print(f"  Max Price: {r.get('max_price')}")
                print(f"  Modal Price: {r.get('modal_price')}")
                print(f"  Arrival Date: {r.get('arrival_date')}")
                print()
        else:
            print("No records returned from API")
            
    except Exception as e:
        print(f"Error occurred: {e}")
        import traceback
        traceback.print_exc()
