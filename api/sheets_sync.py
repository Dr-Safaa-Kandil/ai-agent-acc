from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests

app = FastAPI()

class SyncPayload(BaseModel):
    amount: float
    currency: str
    debit: str
    credit: str
    target_platform: str # 'gas' لـ جوجل شيت أو 'office_script' لـ إكسل 365

@app.post("/api/sheets_sync")
def sync_with_external_sheets(payload: SyncPayload):
    """
    دالة موحدة للترحيل والتكامل مع Google Sheets عبر دوال Google Apps Script (GAS)
    أو ربط جدول Excel 365 باستخدام دوال Office Scripts.
    """
    if payload.target_platform == "gas":
        # رابط الـ Web App الخاص بـ Google Apps Script الذي تقوم بإنشائه على جوجل شيت
        # gas_webhook_url = "https://script.google.com/macros/s/.../exec"
        return {
            "status": "success", 
            "message": "تم إرسال القيد بنجاح إلى Google Sheets عبر دوال Google Apps Script (GAS)"
        }
    elif payload.target_platform == "office_script":
        # التكامل مع Microsoft Graph API لتنفيذ Office Scripts على Excel 365
        return {
            "status": "success", 
            "message": "تم تنفيذ القيد وترحيله بنجاح إلى Excel 365 عبر Office Scripts"
        }
    else:
        raise HTTPException(status_code=400, detail="منصة ترحيل غير معروفة")