// ملف المنطق البرمجي للوكيل المحاسبي - ai-agent-acc

// قاموس الترجمة الفورية والتبديل (عربي / إنجليزي)
const translations = {
    ar: {
        title: "المساعد المحاسبي الذكي",
        convertBtn: "تحويل بالجنيه المصرى",
        submitBtn: "إرسال المعاملة المالية للمعالجة ➔",
        placeholderDesc: "أكمل بيان المعاملة المالية هنا (مثال: تحويل بنكى 5000 جنيه عمولة لمكتب محاماة)...",
        resTitle: "النتائج التحليلية الفورية:",
        amountLabel: "المبلغ المستخرج/الناتج:",
        debitLabel: "الجانب المدين:",
        creditLabel: "الجانب الدائن:",
        statementLabel: "القائمة المالية المتأثرة:",
        ledgerLabel: "كشف الحساب المرتبط:"
    },
    en: {
        title: "Smart Accounting Agent",
        convertBtn: "Convert to EGP",
        submitBtn: "Send Transaction for Processing ➔",
        placeholderDesc: "Complete transaction description here (e.g., Bank transfer 5000 EGP law firm commission)...",
        resTitle: "Instant Analytical Results:",
        amountLabel: "Extracted/Result Amount:",
        debitLabel: "Debit Side:",
        creditLabel: "Credit Side:",
        statementLabel: "Affected Financial Statement:",
        ledgerLabel: "Associated Ledger Account:"
    }
};

let currentLang = 'ar';

// وظيفة تبديل الحالة عند اختيار الدولة (قفل الحقول إذا كانت مصر)
function toggleForeignFields() {
    const country = document.getElementById('country-select').value;
    const amountInput = document.getElementById('amount-input');
    const convertBtn = document.getElementById('convert-btn');
    const foreignRes = document.getElementById('foreign-result-display');
    const transText = document.getElementById('transaction-text');

    if (country === 'Egypt') {
        amountInput.disabled = true;
        amountInput.value = '';
        convertBtn.disabled = true;
        convertBtn.style.opacity = '0.5';
        foreignRes.disabled = true;
        foreignRes.value = '';
        transText.placeholder = currentLang === 'ar' ? 
            "أكمل بيان المعاملة المالية بمصر (مثال: دفع إيجار محطة 1500 جنيه)..." :
            "Complete local transaction description (e.g., Pay station rent 1500 EGP)...";
    } else {
        amountInput.disabled = false;
        convertBtn.disabled = false;
        convertBtn.style.opacity = '1';
        foreignRes.disabled = false;
    }
}

// معالجة المعاملة المالية باستخدام القاموس المحاسبي المطور
function processAccountingTransaction() {
    const text = document.getElementById('transaction-text').value.trim();
    const resultsContainer = document.getElementById('results-container');
    
    if (!text) {
        alert(currentLang === 'ar' ? "يرجى كتابة بيان المعاملة المالية أولاً." : "Please enter the transaction description first.");
        return;
    }

    // استخراج رقمي مبدئي من النص (افتراضي أو بحث عن أرقام)
    const matchNumber = text.match(/\d+/);
    const amount = matchNumber ? matchNumber[0] : "1500";

    let debit = "--";
    let credit = "--";
    let statement = "--";
    let ledger = "--";
    let currencySymbol = currentLang === 'ar' ? "جنيه مصري" : "EGP";

    // منطق القاموس المحاسبي المطور بدقة
    if (text.includes("إيجار") || text.includes("محطة")) {
        debit = currentLang === 'ar' ? "حساب مصروف الإيجار التشغيلي" : "Operating Rent Expense Account";
        credit = currentLang === 'ar' ? "حساب النقدية / البنك" : "Cash / Bank Account";
        statement = currentLang === 'ar' ? "قائمة الدخل" : "Income Statement";
        ledger = currentLang === 'ar' ? "أستاذ المصروفات التشغيلية" : "Operating Expenses Ledger";
    } else if (text.includes("محاماة") || text.includes("عمولة") || text.includes("تحويل بنكى") || text.includes("تحويل بنكي")) {
        debit = currentLang === 'ar' ? "حساب الأتعاب المهنية والاستشارات (أتعاب محاماة)" : "Professional Fees & Legal Expenses";
        credit = currentLang === 'ar' ? "حساب البنك الجاري" : "Current Bank Account";
        statement = currentLang === 'ar' ? "قائمة الدخل المركز المالي" : "Income Statement & Financial Position";
        ledger = currentLang === 'ar' ? "أستاذ المصروفات الإدارية والخدمات المهنية" : "Administrative & Professional Services Ledger";
    } else {
        debit = currentLang === 'ar' ? "حساب المصروفات العامة / المخزون" : "General Expenses / Inventory";
        credit = currentLang === 'ar' ? "حساب الخزينة / النقدية" : "Cash / Treasury Account";
        statement = currentLang === 'ar' ? "قائمة المركز المالي وقائمة الدخل" : "Balance Sheet & Income Statement";
        ledger = currentLang === 'ar' ? "أستاذ المشتريات والمصروفات العامة" : "General Ledger";
    }

    // إظهار النتائج في صندوق العرض الفوري
    document.getElementById('val-amount').innerText = `${amount} ${currencySymbol}`;
    document.getElementById('val-debit').innerText = debit;
    document.getElementById('val-credit').innerText = credit;
    document.getElementById('val-statement').innerText = statement;
    document.getElementById('val-ledger').innerText = ledger;

    resultsContainer.classList.remove('results-box-hidden');
    resultsContainer.style.display = 'block';
}

// زر التبديل بين اللغات
document.getElementById('lang-toggle-btn').addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const t = translations[currentLang];

    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    if(currentLang === 'en') {
        document.body.classList.add('lang-en');
    } else {
        document.body.classList.remove('lang-en');
    }

    document.getElementById('widget-title').innerText = t.title;
    document.getElementById('convert-btn').innerText = t.convertBtn;
    document.getElementById('process-submit-btn').innerText = t.submitBtn;
    document.getElementById('transaction-text').placeholder = t.placeholderDesc;
    document.getElementById('res-title').innerText = t.resTitle;
});

// تهيئة أولية عند التحميل
window.onload = function() {
    toggleForeignFields();
};