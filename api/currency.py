from fastapi import FastAPI

app = FastAPI()

@app.get("/api/currency")
def get_exchange_rates(country_code: str):
    """
    إدارة أسعار الصرف للعملات الخليجية الشهيرة واستثناء مصر تلقائياً.
    """
    rates = {
        "EGY": {"currency": "EGP", "rate_to_usd": 1.0, "active_exchange": False},
        "SAU": {"currency": "SAR", "rate_to_usd": 3.75, "active_exchange": True},
        "ARE": {"currency": "AED", "rate_to_usd": 3.67, "active_exchange": True},
        "KWT": {"currency": "KWD", "rate_to_usd": 0.31, "active_exchange": True}
    }
    
    selected_country = rates.get(country_code, rates["EGY"])
    return {"status": "success", "exchange_info": selected_country}