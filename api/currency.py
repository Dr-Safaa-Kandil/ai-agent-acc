from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get("/api/currency")
def get_exchange_rates(country_code: str):
    """
    إدارة وتوفير أسعار الصرف الحية للعملات الأجنبية مقابل الجنيه المصري (EGP).
    """
    # أسعار الصرف المحدثة لتتوافق مع محرك التحويل الفوري في الواجهة الأمامية
    rates = {
        "Egypt": {"currency": "EGP", "rate_to_egp": 1.0, "active_exchange": False},
        "KSA": {"currency": "SAR", "rate_to_egp": 13.00, "active_exchange": True},
        "UAE": {"currency": "AED", "rate_to_egp": 13.30, "active_exchange": True},
        "Kuwait": {"currency": "KWD", "rate_to_egp": 160.00, "active_exchange": True},
        "Qatar": {"currency": "QAR", "rate_to_egp": 13.20, "active_exchange": True},
        "Bahrain": {"currency": "BHD", "rate_to_egp": 128.00, "active_exchange": True},
        "Oman": {"currency": "OMR", "rate_to_egp": 125.00, "active_exchange": True},
        "USA": {"currency": "USD", "rate_to_egp": 48.50, "active_exchange": True}
    }
    
    # البحث عن الدولة المطلوبة (مع دعم الحروف الكبيرة والصغيرة)
    matched_country = next((v for k, v in rates.items() if k.lower() == country_code.lower()), None)
    
    if not matched_country:
        raise HTTPException(status_code=404, detail="Country code not found or not supported.")
        
    return {
        "status": "success", 
        "exchange_info": matched_country
    }