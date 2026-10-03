/**
 * ai-agent-acc - ملف المنطق البرمجي وقاموس المعالجة المحاسبية الشامل
 * الإصدار: 4.1 Enterprise - النسخة المعدلة لضبط أزرار التحرير ونصوص التحويل بدقة
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

// 2. قفل وتفعيل حقول العملات والتحويل عند اختيار الدولة (مصر تعطل المبلغ والتحويل، وتفعل الناتج)
function toggleForeignFields() {
    const countrySelect = document.getElementById('country-select');
    const amountInput = document.getElementById('amount-input');
    const convertBtn = document.getElementById('convert-btn');
    const foreignRes = document.getElementById('foreign-result-display');
    const foreignNoteInput = document.getElementById('foreign-note-input');
    
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
            foreignRes.disabled = false;
            foreignRes.value = '';
        }
        if (foreignNoteInput) {
            foreignNoteInput.disabled = true;
            foreignNoteInput.value = '';
        }
    } else {
        if (amountInput) amountInput.disabled = false;
        if (convertBtn) {
            convertBtn.disabled = false;
            convertBtn.style.opacity = '1';
        }
        if (foreignRes) foreignRes.disabled = false;
        if (foreignNoteInput) foreignNoteInput.disabled = false;
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
        alert(currentLang === 'ar' ? "يرجى إدخال مبلغ مالى صحيح للتحويل." : "Please enter a valid amount for conversion.");
        return;
    }
    
    let rate = 1;
    let currencyCode = "EGP";
    const country = countrySelect.value;
    
    if (country === 'Kuwait') {
        rate = 165.0;
        currencyCode = "KWD";
    } else if (country === 'KSA') {
        rate = 13.5; 
        currencyCode = "SAR";
    } else if (country === 'UAE') {
        rate = 13.8;
        currencyCode = "AED";
    } else if (country === 'USA') {
        rate = 50.5;
        currencyCode = "USD";
    }
    
    const resultVal = (val * rate).toFixed(2);
    foreignRes.value = `${currencyCode} ${resultVal} (${currentLang === 'ar' ? 'معادل لـ' : 'Equivalent to'} ${val})`;
}

// 4. قاموس المعالجة المحاسبية الذكي وتحليل القيود المزدوجة
function processAccountingTransaction() {
    const countrySelect = document.getElementById('country-select');
    const amountInput = document.getElementById('amount-input');
    const textElement = document.getElementById('transaction-text');
    const resultsContainer = document.getElementById('results-container');
    
    if (!countrySelect || !textElement || !resultsContainer) return;
    
    if (countrySelect.value === 'Egypt') {
        const localAmount = amountInput ? amountInput.value.trim() : "";
        const textVal = textElement.value.trim();
        if (!textVal && !localAmount) {
            alert(currentLang === 'ar' ? "أكمل المعاملة المالية بذكر المبلغ" : "Complete the financial transaction by stating the amount");
            return;
        }
    }
    
    const text = textElement.value.trim();
    const amount = (amountInput && amountInput.value) ? amountInput.value : "1500";

    let debit = "--";
    let credit = "--";
    let statement = "--";
    let ledger = "--";
    let currencySymbol = currentLang === 'ar' ? "جنيه مصري (EGP)" : "Egyptian Pounds (EGP)";

    if (text.includes("إيجار") || text.includes("محطة") || text.includes("مستلزمات") || text.includes("rent")) {
        debit = currentLang === 'ar' ? "حساب المصروفات العامة والمتنوعة" : "General & Miscellaneous Expenses Account";
        credit = currentLang === 'ar' ? "حساب الخزينة الرئيسية / النقدية" : "Main Treasury / Cash Account";
        statement = currentLang === 'ar' ? "قائمة الدخل وقائمة المركز المالي" : "Income Statement & Balance Sheet";
        ledger = currentLang === 'ar' ? "أستاذ المصروفات العامة" : "General Expenses Ledger";
    } else if (text.includes("محاماة") || text.includes("عمولة") || text.includes("أتعاب") || text.includes("استشارية") || text.includes("legal")) {
        debit = currentLang === 'ar' ? "حساب الأتعاب المهنية والاستشارات القانونية" : "Professional Fees & Legal Consultancy Account";
        credit = currentLang === 'ar' ? "حساب البنك التجاري الجاري" : "Commercial Bank Current Account";
        statement = currentLang === 'ar' ? "قائمة الدخل (Income Statement)" : "Income Statement";
        ledger = currentLang === 'ar' ? "أستاذ المصروفات الإدارية والعمومية والخدمات المهنية" : "Admin Expenses & Professional Services Ledger";
    } else if (text.includes("أصل") || text.includes("شراء معدات") || text.includes("equipment")) {
        debit = currentLang === 'ar' ? "حساب الأصول الثابتة (المعدات والآلات)" : "Fixed Assets Account (Equipment & Machinery)";
        credit = currentLang === 'ar' ? "حساب الموردين / أوراق الدفع" : "Suppliers / Notes Payable Account";
        statement = currentLang === 'ar' ? "قائمة المركز المالي (Balance Sheet)" : "Balance Sheet";
        ledger = currentLang === 'ar' ? "أستاذ الأصول الثابتة" : "Fixed Assets Ledger";
    } else {
        debit = currentLang === 'ar' ? "حساب مصروف الإيجار التشغيلي" : "Operational Rent Expense Account";
        credit = currentLang === 'ar' ? "حساب النقدية / البنك بالخزينة" : "Cash / Treasury Bank Account";
        statement = currentLang === 'ar' ? "قائمة الدخل (Income Statement)" : "Income Statement";
        ledger = currentLang === 'ar' ? "أستاذ المصروفات التشغيلية والخدمية" : "Operational & Service Expenses Ledger";
    }

    const valAmountElem = document.getElementById('val-amount');
    const valDebitElem = document.getElementById('val-debit');
    const valCreditElem = document.getElementById('val-credit');
    const valStatementElem = document.getElementById('val-statement');
    const valLedgerElem = document.getElementById('val-ledger');
    const valAccountStatementElem = document.getElementById('val-account-statement');

    if (valAmountElem) valAmountElem.innerText = `${amount} ${currencySymbol}`;
    if (valDebitElem) valDebitElem.innerText = debit;
    if (valCreditElem) valCreditElem.innerText = credit;
    if (valStatementElem) valStatementElem.innerText = statement;
    if (valLedgerElem) valLedgerElem.innerText = ledger;
    if (valAccountStatementElem) valAccountStatementElem.innerText = currentLang === 'ar' ? "سجل الأستاذ العام للمعاملات النقدية" : "General Ledger for Cash Transactions";

    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// 5. تبديل اللغات والاتجاهات (RTL / LTR) مع ضبط الترتيب المكاني لصف العملات وترجمة القوائم والأزرار والأيقونة
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    
    document.documentElement.lang = currentLang;
    document.documentElement.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';

    const langBtn = document.getElementById('lang-toggle-btn');
    const widgetContainer = document.getElementById('ai-cost-assistant-widget');
    const widgetTitle = document.getElementById('widget-launcher-title');
    const modalHeaderTitle = document.getElementById('modal-header-title');
    const convertBtn = document.getElementById('convert-btn');
    const processBtn = document.getElementById('process-submit-btn');
    const welcomeMsg1 = document.getElementById('welcome-msg-1');
    const welcomeMsg2 = document.getElementById('welcome-msg-2');
    const labelDate = document.getElementById('label-date');
    const labelExchange = document.getElementById('label-exchange-title');
    const amountInput = document.getElementById('amount-input');
    const foreignResultDisplay = document.getElementById('foreign-result-display');
    const foreignNoteInput = document.getElementById('foreign-note-input');
    const transactionText = document.getElementById('transaction-text');
    const examplesText = document.getElementById('examples-text');
    const foreignCurrencyRow = document.getElementById('foreign-currency-row');

    const txtCopy = document.getElementById('txt-copy');
    const txtPaste = document.getElementById('txt-paste');
    const txtImport = document.getElementById('txt-import');

    const txtVoice = document.getElementById('txt-voice');
    const txtImage = document.getElementById('txt-image');
    const txtOcr = document.getElementById('txt-ocr');

    const optEgypt = document.getElementById('opt-egypt');
    const optKuwait = document.getElementById('opt-kuwait');
    const optKsa = document.getElementById('opt-ksa');
    const optUae = document.getElementById('opt-uae');
    const optUsa = document.getElementById('opt-usa');

    if (currentLang === 'en') {
        document.body.classList.add('lang-en');
        
        if (widgetContainer) {
            widgetContainer.style.right = 'auto';
            widgetContainer.style.left = '20px';
        }
        if (widgetTitle) widgetTitle.innerText = "Smart Accounting Assistant";

        if (foreignCurrencyRow) {
            foreignCurrencyRow.style.flexDirection = 'row-reverse';
        }

        if (modalHeaderTitle) modalHeaderTitle.innerText = "Smart Financial Accounting Assistant ai-agent-acc";
        if (convertBtn) convertBtn.innerText = "🧮 Convert to EGP";
        if (processBtn) processBtn.innerHTML = `<span>Send Financial Transaction for Dual Analysis</span> <span class="btn-arrow-icon">➔</span>`;
        if (langBtn) langBtn.innerText = "Ar / En";
        if (welcomeMsg1) welcomeMsg1.innerText = "Welcome to your smart agent for financial transaction recording";
        if (welcomeMsg2) welcomeMsg2.innerText = "Select: Country / Enter: Amount / Click: Standard Convert";
        if (labelDate) labelDate.innerText = "Date: 2026-10-01";
        if (labelExchange) labelExchange.innerText = "Currency Exchange Rate to EGP";
        if (amountInput) amountInput.placeholder = "Amount...";
        if (foreignResultDisplay) foreignResultDisplay.placeholder = "Conversion result to Egyptian Pounds...";
        if (foreignNoteInput) foreignNoteInput.placeholder = "Complete transaction statement in foreign country";
        if (transactionText) transactionText.placeholder = "Type financial transaction and processing dictionary here...";
        if (examplesText) examplesText.innerText = "Example: Operational rent | Legal consulting fees | Equipment purchase";

        if (txtCopy) txtCopy.innerText = "Copy";
        if (txtPaste) txtPaste.innerText = "Paste";
        if (txtImport) txtImport.innerText = "Import";

        if (txtVoice) txtVoice.innerText = "Voice Record";
        if (txtImage) txtImage.innerText = "Upload Image";
        if (txtOcr) txtOcr.innerText = "OCR Scan";

        if (optEgypt) optEgypt.innerText = "Egypt (EGP)";
        if (optKuwait) optKuwait.innerText = "Kuwait - Kuwaiti Dinar (KWD)";
        if (optKsa) optKsa.innerText = "Saudi Arabia (SAR)";
        if (optUae) optUae.innerText = "UAE (AED)";
        if (optUsa) optUsa.innerText = "United States (USD)";

    } else {
        document.body.classList.remove('lang-en');
        
        if (widgetContainer) {
            widgetContainer.style.left = 'auto';
            widgetContainer.style.right = '20px';
        }
        if (widgetTitle) widgetTitle.innerText = "المساعد المحاسبي الذكي";

        if (foreignCurrencyRow) {
            foreignCurrencyRow.style.flexDirection = 'row';
        }

        if (modalHeaderTitle) modalHeaderTitle.innerText = "الوكيل الذكي للمحاسبة المالية ai-agent-acc";
        if (convertBtn) convertBtn.innerText = "🧮 تحويل للجنيه المصري";
        if (processBtn) processBtn.innerHTML = `<span>إرسال المعاملة المالية للتحليل قبل التسجيل/ الرصد</span> <span class="btn-arrow-icon">➔</span>`;
        if (langBtn) langBtn.innerText = "En / Ar";
        if (welcomeMsg1) welcomeMsg1.innerText = "مرحبا مع وكيلك الذكى لتسجيل المعاملات المالية";
        if (welcomeMsg2) welcomeMsg2.innerText = "اختر: الدولة / ادخل: المبلغ / اضغط: تحويل معياري";
        if (labelDate) labelDate.innerText = "التاريخ: 2026-10-01";
        if (labelExchange) labelExchange.innerText = "سعر صرف العملة للجنيه المصري";
        if (amountInput) amountInput.placeholder = "المبلغ...";
        if (foreignResultDisplay) foreignResultDisplay.placeholder = "ناتج التحويل للجنيه المصري...";
        if (foreignNoteInput) foreignNoteInput.placeholder = "أكمل بيان المعاملة بالدولة الأجنبية";
        if (transactionText) transactionText.placeholder = "أكتب هنا بيان المعاملة المالية وقاموس المعالجة (مثال: دفع إيجار محطة 1500 أو أتعاب محاماة)...";
        if (examplesText) examplesText.innerText = "مثال: مصروف إيجار تشغيلي | أتعاب استشارية قانونية | شراء معدات";

        if (txtCopy) txtCopy.innerText = "نسخ";
        if (txtPaste) txtPaste.innerText = "لصق";
        if (txtImport) txtImport.innerText = "استيراد";

        if (txtVoice) txtVoice.innerText = "تسجيل صوتي";
        if (txtImage) txtImage.innerText = "جلب صورة";
        if (txtOcr) txtOcr.innerText = "مسح ضوئي";

        if (optEgypt) optEgypt.innerText = "مصر (EGP)";
        if (optKuwait) optKuwait.innerText = "الكويت - دينار كويتي (KWD)";
        if (optKsa) optKsa.innerText = "السعودية (SAR)";
        if (optUae) optUae.innerText = "الإمارات (AED)";
        if (optUsa) optUsa.innerText = "الدولار الأمريكي (USD)";
    }
}

// 6. دوال الأدوات المساعدة المحدثة
function copyResultText() {
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        const textToCopy = resultsContainer.innerText.replace(/[^0-9.]/g, '');
        navigator.clipboard.writeText(textToCopy).then(() => {}).catch(err => {
            console.error('فشل النسخ الصامت', err);
        });
    }
}

function pasteWidgetState() {
    navigator.clipboard.readText().then(text => {
        const txText = document.getElementById('transaction-text');
        if (txText) txText.value = text;
    }).catch(() => {
        alert(currentLang === 'ar' ? "يرجى السماح بالصلاحية أو استخدام الاختصار (Ctrl+V) للصق." : "Please allow clipboard access or use Ctrl+V.");
    });
}

function triggerDocumentImport() { alert(currentLang === 'ar' ? "جاري فتح نافذة استيراد المستندات والفواتير الرقمية..." : "Opening document import window..."); }
function triggerOCRScan() { alert(currentLang === 'ar' ? "جاري تفعيل نظام المسح الضوئي (OCR)..." : "Activating OCR scan..."); }
function triggerImageUpload() { alert(currentLang === 'ar' ? "اختر صورة الفاتورة أو المستند المراد تحليله..." : "Select invoice image..."); }
function triggerVoiceInput() { alert(currentLang === 'ar' ? "الاستماع الصوتي مفعل... يرجى التحدث." : "Voice listening active..."); }
function exportToExcel365() { alert(currentLang === 'ar' ? "جاري تجهيز وتصدير القيود إلى صيغة Excel 365..." : "Exporting to Excel 365..."); }
function exportToGoogleSheets() { alert(currentLang === 'ar' ? "جاري مزامنة وترحيل القيود مباشرة إلى Google Sheets..." : "Syncing to Google Sheets..."); }
function saveToSupabaseDB() { alert(currentLang === 'ar' ? "جاري ترحيل وحفظ المعاملة بنجاح إلى قاعدة البيانات (ai-acc)..." : "Saving to Supabase database..."); }

// تهيئة أولية عند تحميل المستند بالكامل
window.onload = function() {
    toggleForeignFields();
    const modal = document.getElementById('ai-modal-box');
    if (modal) {
        modal.style.display = 'none';
    }
    const widgetContainer = document.getElementById('ai-cost-assistant-widget');
    if (widgetContainer) {
        widgetContainer.style.right = '20px';
        widgetContainer.style.left = 'auto';
    }
    const foreignCurrencyRow = document.getElementById('foreign-currency-row');
    if (foreignCurrencyRow) {
        foreignCurrencyRow.style.flexDirection = 'row';
    }
};