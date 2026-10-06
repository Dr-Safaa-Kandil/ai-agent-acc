from fastapi import FastAPI
from pydantic import BaseModel
import re

app = FastAPI()

class TransactionRequest(BaseModel):
    text: str
    currency: str

@app.post("/api/process_tx")
async def process_transaction(req: TransactionRequest):
    """
    محرك المحاسبة الخلفي المطوّر لتحليل المعاملات ومحادثات واتساب،
    واستخراج المبالغ بمرونة وتوجيهها مباشرة إلى جداول الأستاذ المساعد المستقلة وفق المعايير الدولية.
    """
    text = req.text
    
    # 1. استخراج الأرقام/المبلغ من النص المدخل ديناميكياً
    amount_match = re.findall(r'\d+(?:\.\d+)?', text)
    amount = float(amount_match[0]) if amount_match else 0.00

    # 2. التحليل الذكي وتوجيه المعاملة لجدول الأستاذ المساعد المستقل المناسب
    if any(keyword in text for keyword in ["أصل ثابت", "أصول ثابتة", "معدات", "أجهزة", "سيارة", "مبنى", "آلات", "حاسبات"]):
        debit_acc = "حـ/ الأصول غير المتداولة - الخواص والمعدات (121000)"
        credit_acc = "حـ/ البنك المركزي / النقدية أو الدائنون"
        fin_statement = "قائمة المركز المالي (الميزانية)"
        subsidiary_ledger = "الأستاذ المساعد للأصول الثابتة (أجهزة ومعدات)"
    elif "مهمات" in text or "خارجية" in text or "شراء" in text:
        debit_acc = "حـ/ المصروفات الخارجية والمهمات (531100)"
        credit_acc = "حـ/ البنك المركزي / النقدية الأجنبية (111100)"
        fin_statement = "قائمة الدخل / المركز المالي"
        subsidiary_ledger = "الأستاذ المساعد للمصروفات الخارجية والمعاملات النقدية"
    elif "إيجار" in text or "مصروف" in text:
        debit_acc = "حـ/ المصروفات التشغيلية والإدارية (520000)"
        credit_acc = "حـ/ النقدية بالصندوق (111000)"
        fin_statement = "قائمة الدخل اللحظية"
        subsidiary_ledger = "الأستاذ المساعد للمصروفات التشغيلية"
    else:
        debit_acc = "حـ/ الأصول المتداولة / العام"
        credit_acc = "حـ/ البنوك والنقدية"
        fin_statement = "قائمة المركز المالي"
        subsidiary_ledger = "الأستاذ المساعد العام المستقل"

    return {
        "status": "success", 
        "data": {
            "amount": amount,
            "currency": req.currency,
            "debit_account": debit_acc,
            "credit_account": credit_acc,
            "financial_statement": fin_statement,
            "subsidiary_ledger": subsidiary_ledger,
            "raw_text": text
        }
    }