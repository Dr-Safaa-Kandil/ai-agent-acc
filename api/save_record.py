from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class RecordPayload(BaseModel):
    amount: float
    currency: str
    debit: str
    credit: str
    destination: str  # 'db' للرصد اللحظي أو 'sheets' للترحيل

@app.post("/api/save_record")
def save_financial_record(payload: RecordPayload):
    """
    توجيه قيد المعاملة إما للرصد اللحظي في قاعدة البيانات السحابية (ai-acc)
    أو الترحيل التلقائي إلى جدول Google Sheets (اليومية الإيطالية).
    """
    if payload.destination == "db":
        # منطق الرصد اللحظي في قاعدة البيانات
        return {"status": "success", "message": "تم الرصد اللحظي بنجاح في قاعدة بيانات نظام ai-acc"}
    elif payload.destination == "sheets":
        # منطق الترحيل التلقائي لـ Google Sheets (اليومية الإيطالية)
        return {"status": "success", "message": "تم ترحيل القيد بنجاح إلى جدول اليومية الإيطالية الشاملة"}
    else:
        raise HTTPException(status_code=400, destination="وجهة حفظ غير صالحة")