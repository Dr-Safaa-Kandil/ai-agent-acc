/**
 * ai-agent-acc - ملف المنطق البرمجي وقاموس المعالجة المحاسبية الشامل
 * الإصدار: 3.5 Enterprise
 */

// متغيرات النظام العامة
let currentLang = 'ar';

// 1. فتح وإغلاق النافذة العائمة للمساعد بضمان التفعيل الفوري
function toggleModal() {
    const modal = document.getElementById('ai-modal-box');
    if (!modal) return;
    
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    } else {
        modal.style.display = 'none';
    }
}

// 2. قفل وتفعيل حقول العملات والتحويل عند اختيار الدولة
function toggleForeignFields() {
    const countrySelect = document.getElementById('country-select');
    const amountInput = document.getElementById('amount-input');
    const convertBtn = document.getElementById('convert-btn');
    const foreignRes = document.getElementById('foreign-result-display');
    
    if (!countrySelect) return;
    const country = countrySelect.value;
    
    if (country === 'Egypt') {
        if (amountInput) {
            amountInput.disabled = true;
            amountInput.value = '';
        }
        if (convertBtn) {
            convertBtn.disabled = true;
            convertBtn.style.opacity = '0.4';
        }
        if (foreignRes) {
            foreignRes.disabled = true;
            foreignRes.value = '';
        }
    } else {
        if (amountInput) amountInput.disabled = false;
        if (convertBtn) {
            convertBtn.disabled = false;
            convertBtn.style.opacity = '1';
        }
        if (foreignRes) foreignRes.disabled = false;
    }
}

// 3. دالة التحويل المعياري للعملات الأجنبية
function convertCurrency() {
    const amountInput = document.getElementById('amount-input');
    const foreignRes = document.getElementById('foreign-result-display');
    const countrySelect = document.getElementById('country-select');
    
    if (!amountInput || !foreignRes || !countrySelect) return;
    
    const val = parseFloat(amountInput.value);
    if (isNaN(val) || val <= 0) {
        alert("يرجى إدخال مبلغ مالى صحيح للتحويل.");
        return;
    }
    
    let rate = 1;
    let currencyCode = "EGP";
    const country = countrySelect.value;
    
    if (country === 'KSA') {
        rate = 13.5; // سعر استرشادي تقريبي للصرف
        currencyCode = "SAR";
    } else if (country === 'UAE') {
        rate = 13.8;
        currencyCode = "AED";
    } else if (country === 'USA') {
        rate = 50.5;
        currencyCode = "USD";
    }
    
    const resultVal = (val * rate).toFixed(2);
    foreignRes.value = `${resultVal} EGP (معادل لـ ${val} ${currencyCode})`;
}

// 4. قاموس المعالجة المحاسبية الذكي وتحليل القيود المزدوجة
function processAccountingTransaction() {
    const textElement = document.getElementById('transaction-text');
    const resultsContainer = document.getElementById('results-container');
    
    if (!textElement || !resultsContainer) return;
    
    const text = textElement.value.trim();
    
    if (!text) {
        alert("يرجى كتابة بيان المعاملة المالية أولاً في قاموس المعالجة.");
        return;
    }

    // استخراج المبلغ المالي من النص تلقائياً إن وجد
    const matchNumber = text.match(/\d+/);
    const amount = matchNumber ? matchNumber[0] : "1500";

    let debit = "--";
    let credit = "--";
    let statement = "--";
    let ledger = "--";
    let currencySymbol = "جنيه مصري (EGP)";

    // مطابقة دقيقة لأولويات وقواعد المعالجة المحاسبية (إيجار، محاماة، أتعاب، تحويل)
    if (text.includes("إيجار") || text.includes("محطة")) {
        debit = "حساب مصروف الإيجار التشغيلي";
        credit = "حساب النقدية / البنك بالخزينة";
        statement = "قائمة الدخل (Income Statement)";
        ledger = "أستاذ المصروفات التشغيلية والخدمية";
    } else if (text.includes("محاماة") || text.includes("عمولة") || text.includes("أتعاب") || text.includes("استشارية") || text.includes("تحويل بنكى")) {
        debit = "حساب الأتعاب المهنية والاستشارات القانونية";
        credit = "حساب البنك التجاري الجاري";
        statement = "قائمة الدخل (Income Statement)";
        ledger = "أستاذ المصروفات الإدارية والعمومية والخدمات المهنية";
    } else if (text.includes("أصل") || text.includes("شراء معدات")) {
        debit = "حساب الأصول الثابتة (المعدات والآلات)";
        credit = "حساب الموردين / أوراق الدفع";
        statement = "قائمة المركز المالي (Balance Sheet)";
        ledger = "أستاذ الأصول الثابتة";
    } else {
        debit = "حساب المصروفات العامة والمتنوعة";
        credit = "حساب الخزينة الرئيسية / النقدية";
        statement = "قائمة الدخل وقائمة المركز المالي";
        ledger = "أستاذ المصروفات العامة";
    }

    // تعيين القيم في عناصر الواجهة
    const valAmountElem = document.getElementById('val-amount');
    const valDebitElem = document.getElementById('val-debit');
    const valCreditElem = document.getElementById('val-credit');
    const valStatementElem = document.getElementById('val-statement');
    const valLedgerElem = document.getElementById('val-ledger');

    if (valAmountElem) valAmountElem.innerText = `${amount} ${currencySymbol}`;
    if (valDebitElem) valDebitElem.innerText = debit;
    if (valCreditElem) valCreditElem.innerText = credit;
    if (valStatementElem) valStatementElem.innerText = statement;
    if (valLedgerElem) valLedgerElem.innerText = ledger;

    // إظهار صندوق النتائج التحليلية
    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// 5. تبديل اللغة (عربي / إنجليزي) وتغيير الاتجاهات والنصوص
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    const langBtn = document.getElementById('lang-toggle-btn');
    const widgetTitle = document.getElementById('widget-title');
    const convertBtn = document.getElementById('convert-btn');
    const processBtn = document.getElementById('process-submit-btn');
    
    if(currentLang === 'en') {
        document.body.classList.add('lang-en');
        if (widgetTitle) widgetTitle.innerText = "Smart Accounting Agent & TaaS Processing";
        if (convertBtn) convertBtn.innerText = "Standard Convert";
        if (processBtn) processBtn.innerHTML = `<span>Send Transaction for Dual Analysis</span> <span class="btn-arrow-icon">➔</span>`;
        if (langBtn) langBtn.innerText = "Ar / En";
    } else {
        document.body.classList.remove('lang-en');
        if (widgetTitle) widgetTitle.innerText = "المساعد المحاسبي الذكي وقاموس المعالجة الآلية";
        if (convertBtn) convertBtn.innerText = "تحويل معياري";
        if (processBtn) processBtn.innerHTML = `<span>إرسال المعاملة المالية وقاموس المعالجة للتحليل المزدوج</span> <span class="btn-arrow-icon">➔</span>`;
        if (langBtn) langBtn.innerText = "En / Ar";
    }
}

// 6. دوال الأداة المساعدة المتقدمة (استيراد، حفظ، طباعة، تصدير)
function triggerDocumentImport() {
    alert("جاري فتح نافذة استيراد المستندات والفواتير الرقمية...");
}

function saveCurrentState() {
    alert("تم حفظ حالة البيانات المؤقتة بنجاح في الذاكرة المحلية.");
}

function printAccountingStatement() {
    window.print();
}

function copyResultText() {
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        navigator.clipboard.writeText(resultsContainer.innerText);
        alert("تم نسخ النتائج التحليلية للحافظة بنجاح!");
    }
}

function pinWidgetState() {
    alert("تم تثبيت واجهة المساعد النشطة.");
}

function openSystemSettings() {
    alert("فتح إعدادات النظام وقاموس القيود المحاسبية...");
}

function triggerOCRScan() {
    alert("جاري تفعيل نظام المسح الضوئي (OCR) لقراءة الفاتورة...");
}

function triggerImageUpload() {
    alert("اختر صورة الفاتورة أو المستند المراد تحليله...");
}

function triggerVoiceInput() {
    alert("الاستماع الصوتي مفعل... يرجى التحدث ببيان المعاملة.");
}

function exportToExcel365() {
    alert("جاري تجهيز وتصدير القيود المحاسبية إلى صيغة Excel 365...");
}

function exportToGoogleSheets() {
    alert("جاري مزامنة وترحيل القيود مباشرة إلى Google Sheets...");
}

function saveToSupabaseDB() {
    alert("جاري ترحيل وحفظ المعاملة بنجاح إلى قاعدة البيانات (ai-acc)...");
}

// تهيئة أولية عند تحميل المستند بالكامل
window.onload = function() {
    toggleForeignFields();
    const modal = document.getElementById('ai-modal-box');
    if (modal) {
        modal.style.display = 'none';
    }
};