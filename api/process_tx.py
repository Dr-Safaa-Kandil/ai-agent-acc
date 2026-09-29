from fastapi import FastAPI, Request
from pydantic import BaseModel

app = FastAPI()

class TransactionRequest(BaseModel):
    text: str
    currency: str

@app.post("/api/process_tx")
async def process_transaction(req: TransactionRequest):
    """
    محرك المحاسبة الخلفي لتحليل المعاملات النصية وتحديد الأطراف (المدين والدائن)،
    مع ربطها بالقوائم المالية المعتمدة (قائمة الدخل / قائمة المركز المالي) وحسابات الأستاذ.
    """
    text = req.text
    
    # تحليل قياسي مبدئي مستند للقواعد المحاسبية المزدوجة
    if "شراء" in text:
        amount = 4000.0
        debit_acc = "مخزون البضاعة (أصول متداولة)"
        credit_acc = "نقدية الصندوق / البنك أو الموردون"
        fin_statement = "قائمة المركز المالي (الميزانية)"
        statement_acc = "حساب المخزون / حساب الموردين"
    elif "إيجار" in text or "مصروف" in text:
        amount = 1500.0
        debit_acc = "مصروف الإيجار / المصروفات التشغيلية"
        credit_acc = "نقدية الصندوق / البنك"
        fin_statement = "قائمة الدخل اللحظية"
        statement_acc = "حساب المصروفات العمومية"
    else:
        amount = 1000.0
        debit_acc = "حساب الأصول / المصروفات"
        credit_acc = "حساب نقدية الصندوق"
        fin_statement = "قائمة الدخل و قائمة المركز المالي"
        statement_acc = "حساب الأستاذ العام"

    return {
        "status": "success", 
        "data": {
            "amount": amount,
            "currency": req.currency,
            "debit_account": debit_acc,
            "credit_account": credit_acc,
            "financial_statement": fin_statement,
            "statement_account": statement_acc,
            "raw_text": text
        }
    }