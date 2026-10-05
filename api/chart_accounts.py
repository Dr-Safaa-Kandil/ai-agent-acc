from fastapi import FastAPI

app = FastAPI()

@app.get("/api/chart_accounts")
def get_chart_of_accounts():
    """
    توفير هيكل شجرة الحسابات الكامل والمفصل وفق المعايير الدولية للمحاسبة المالية (IFRS).
    تشمل كافة تفريعات الأصول، الخصوم، حقوق الملكية، الإيرادات، والمصروفات بدقة ستة أرقام.
    """
    tree = {
        # الأصول (Assets)
        "100000": "الأصول (Assets)",
        "110000": "الأصول المتداولة (Current Assets)",
        "111000": "النقدية وما في حكمها / البنوك (Cash and Cash Equivalents)",
        "111100": "حـ/ البنك المركزي / النقدية الأجنبية",
        "112000": "العملاء والمدينون (Accounts Receivable)",
        "113000": "المخزون السلعي (Inventory)",
        "120000": "الأصول غير المتداولة (Non-Current Assets)",
        "121000": "الخواص والمعدات (Property, Plant and Equipment)",
        
        # الخصوم (Liabilities)
        "200000": "الخصوم (Liabilities)",
        "210000": "الخصوم المتداولة (Current Liabilities)",
        "211000": "الموردون والدائنون (Accounts Payable)",
        "212000": "المصروفات المستحقة والضرائب (Accrued Expenses & Taxes)",
        "220000": "الخصوم غير المتداولة (Non-Current Liabilities)",
        
        # حقوق الملكية (Equity)
        "300000": "حقوق الملكية (Equity)",
        "310000": "رأس المال (Capital)",
        "320000": "الأرباح المبقاة (Retained Earnings)",
        
        # الإيرادات (Revenues)
        "400000": "الإيرادات (Revenues)",
        "410000": "إيرادات المبيعات والنشاط الرئيسي (Sales & Operating Revenues)",
        "420000": "الإيرادات الأخرى (Other Revenues)",
        
        # المصروفات والتكاليف (Expenses & Costs)
        "500000": "المصروفات والتكاليف (Expenses & Costs)",
        "510000": "تكلفة البضاعة المباعة (Cost of Goods Sold)",
        "520000": "المصروفات التشغيلية والإدارية (Operating & Administrative Expenses)",
        "530000": "المصروفات الخارجية والمهمات (External Expenses & Supplies)",
        "531100": "حـ/ المصروفات الخارجية والمهمات (أجنبية)"
    }
    return {"status": "success", "chart_of_accounts": tree}