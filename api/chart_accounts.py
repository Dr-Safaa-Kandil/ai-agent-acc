from fastapi import FastAPI

app = FastAPI()

@app.get("/api/chart_accounts")
def get_chart_of_accounts():
    """
    توفير هيكل شجرة الحسابات الكامل وفق المعايير الدولية للمحاسبة المالية (IFRS).
    تشمل الأصول، الخصوم، حقوق الملكية، الإيرادات، والمصروفات.
    """
    tree = {
        "100000": "الأصول (Assets)",
        "200000": "الخصوم (Liabilities)",
        "300000": "حقوق الملكية (Equity)",
        "400000": "الإيرادات (Revenues)",
        "500000": "المصروفات والتكاليف (Expenses & Costs)"
    }
    return {"status": "success", "chart_of_accounts": tree}