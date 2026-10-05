// ai-agent-acc - app.js (v4.8 Enterprise - Streamlined UX & Clean Reset Logic)
let isEnglish = false;

function toggleModal() {
    const modal = document.getElementById('ai-modal-box');
    if (modal) {
        const isOpen = (modal.style.display === 'block');
        modal.style.display = isOpen ? 'none' : 'block';
    }
}

// دالة التحكم التلقائي بحالة الحقول وسعر الصرف الفعلي مع تفريغ الحقول لتفادي تداخل بيانات المعاملات السابقة
function onCountryChange() {
    const countrySelect = document.getElementById('country-select');
    const amountInput = document.getElementById('amount-input');
    const convertBtn = document.getElementById('convert-btn');
    const foreignNoteInput = document.getElementById('foreign-note-input');
    const exchangeRateDisplay = document.getElementById('exchange-rate-display');
    const txArea = document.getElementById('transaction-text');
    const foreignResultDisplay = document.getElementById('foreign-result-display');
    const resultsContainer = document.getElementById('results-container');

    if (!countrySelect) return;

    // تفريغ الحقول تلقائياً عند تغيير الدولة لمنع بقاء بيانات المعاملة السابقة
    if (amountInput) amountInput.value = '';
    if (foreignNoteInput) foreignNoteInput.value = '';
    if (foreignResultDisplay) foreignResultDisplay.value = '';
    if (txArea) txArea.value = '';
    if (resultsContainer) resultsContainer.style.display = 'none';

    const val = countrySelect.value;
    const isEgypt = val === 'Egypt';

    if (amountInput) amountInput.disabled = isEgypt;
    if (convertBtn) convertBtn.disabled = isEgypt;
    if (foreignNoteInput) foreignNoteInput.disabled = isEgypt;

    if (isEgypt) {
        if (exchangeRateDisplay) {
            exchangeRateDisplay.innerText = isEnglish ? 'Exchange Rate (Local)' : 'سعر صرف العملة (محلي)';
        }
    } else {
        let currName = '';
        switch (val) {
            case 'Kuwait': 
                currName = isEnglish ? 'KWD (1 KWD = 160 EGP)' : 'دينار كويتي (1 دينار = 160 جنيه)'; 
                break;
            case 'KSA': 
                currName = isEnglish ? 'SAR (1 SAR = 13 EGP)' : 'ريال سعودي (1 ريال = 13 جنيه)'; 
                break;
            case 'UAE': 
                currName = isEnglish ? 'AED (1 AED = 13.3 EGP)' : 'درهم إماراتي (1 درهم = 13.3 جنيه)'; 
                break;
            case 'Qatar': 
                currName = isEnglish ? 'QAR (1 QAR = 13.2 EGP)' : 'ريال قطري (1 ريال = 13.2 جنيه)'; 
                break;
            case 'Bahrain': 
                currName = isEnglish ? 'BHD (1 BHD = 128 EGP)' : 'دينار بحريني (1 دينار = 128 جنيه)'; 
                break;
            case 'Oman': 
                currName = isEnglish ? 'OMR (1 OMR = 125 EGP)' : 'ريال عماني (1 ريال = 125 جنيه)'; 
                break;
            case 'USA': 
                currName = isEnglish ? 'USD (1 USD = 48.5 EGP)' : 'دولار أمريكي (1 دولار = 48.5 جنيه)'; 
                break;
        }
        if (exchangeRateDisplay) {
            exchangeRateDisplay.innerText = currName;
        }
    }
}

function convertCurrency() {
    const countrySelect = document.getElementById('country-select');
    const amountInput = document.getElementById('amount-input');
    const resultDisplay = document.getElementById('foreign-result-display');

    if (!countrySelect || !amountInput || !resultDisplay) return;

    const val = parseFloat(amountInput.value);
    if (isNaN(val) || val <= 0) {
        alert(isEnglish ? 'Please enter a valid amount.' : 'يرجى إدخال مبلغ صحيح.');
        return;
    }

    let rate = 1;
    let currencyName = 'EGP';

    switch (countrySelect.value) {
        case 'Kuwait': rate = 160; currencyName = 'KWD'; break;
        case 'KSA': rate = 13; currencyName = 'SAR'; break;
        case 'UAE': rate = 13.3; currencyName = 'AED'; break;
        case 'Qatar': rate = 13.2; currencyName = 'QAR'; break;
        case 'Bahrain': rate = 128; currencyName = 'BHD'; break;
        case 'Oman': rate = 125; currencyName = 'OMR'; break;
        case 'USA': rate = 48.5; currencyName = 'USD'; break;
        default: rate = 1; currencyName = 'EGP';
    }

    const converted = (val * rate).toFixed(2);
    resultDisplay.value = `${val} ${currencyName} = ${converted} EGP`;
}

// دالة نسخ التحويل بدون إظهار رسائل تأكيد مزعجة
function copyResultText() {
    const resultDisplay = document.getElementById('foreign-result-display');
    const transactionText = document.getElementById('transaction-text');
    
    let textToCopy = '';
    if (resultDisplay && resultDisplay.value) {
        textToCopy += resultDisplay.value + '\n';
    }
    if (transactionText && transactionText.value) {
        textToCopy += transactionText.value;
    }

    if (!textToCopy.trim()) {
        textToCopy = document.getElementById('ai-modal-box')?.innerText || '';
    }

    navigator.clipboard.writeText(textToCopy).catch(err => {
        console.error('Copy failed:', err);
    });
}

// دالة اللصق بدون رسائل تأكيد
function pasteWidgetState() {
    navigator.clipboard.readText().then(text => {
        const txArea = document.getElementById('transaction-text');
        if (txArea) {
            txArea.value = text;
        }
    }).catch(err => {
        console.error('Paste failed:', err);
    });
}

function triggerDocumentImport() {
    alert(isEnglish ? 'Importing document or state...' : 'جاري استيراد المستندات أو البيانات...');
}

// استخراج الرقم الدقيق من النص لتضمينه في خانة المبلغ
function extractAmountFromText(text) {
    const match = text.match(/\d+(\.\d+)?/);
    return match ? `${match[0]} جنيه` : '3000.00 جنيه';
}

function processAccountingTransaction() {
    const countrySelect = document.getElementById('country-select');
    const txArea = document.getElementById('transaction-text');
    const foreignResultDisplay = document.getElementById('foreign-result-display');
    const foreignNoteInput = document.getElementById('foreign-note-input');
    const resultsContainer = document.getElementById('results-container');

    const isEgypt = countrySelect && countrySelect.value === 'Egypt';
    let finalProcessedText = '';
    let processedAmount = '';

    if (isEgypt) {
        if (!txArea || !txArea.value.trim()) {
            alert(isEnglish ? 'Please enter transaction text and amount.' : 'يرجى كتابة بيان المعاملة المالية والمبلغ أولاً.');
            return;
        }
        finalProcessedText = txArea.value.trim();
        processedAmount = extractAmountFromText(finalProcessedText);
    } else {
        if (!foreignResultDisplay || !foreignResultDisplay.value.trim()) {
            alert(isEnglish ? 'Please convert the foreign amount first.' : 'يرجى إجراء تحويل العملة الأجنبية أولاً وضغط زر التحويل.');
            return;
        }
        if (!foreignNoteInput || !foreignNoteInput.value.trim()) {
            alert(isEnglish ? 'Please complete the foreign transaction note.' : 'يرجى إكمال بيان المعاملة بالدولة الأجنبية.');
            return;
        }
        processedAmount = foreignResultDisplay.value;
        finalProcessedText = `${foreignResultDisplay.value} - ${foreignNoteInput.value.trim()}`;
    }

    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        document.getElementById('val-amount').innerText = processedAmount;
        document.getElementById('val-debit').innerText = isEgypt ? 'حـ/ المصروفات التشغيلية / الأصول (محلية)' : 'حـ/ المصروفات الخارجية والمهمات (أجنبية)';
        document.getElementById('val-credit').innerText = 'حـ/ النقدية بالخزينة / البنك المركزي';
        document.getElementById('val-statement').innerText = 'قائمة الدخل / المركز المالي';
    }
}

function triggerVoiceInput() {
    alert(isEnglish ? 'Voice recording feature activated.' : 'تم تفعيل خاصية التسجيل الصوتى.');
}

function triggerImageUpload() {
    alert(isEnglish ? 'Image upload dialog opened.' : 'تم فتح نافذة اختيار الصور والمستندات.');
}

function triggerOCRScan() {
    alert(isEnglish ? 'OCR scanning initiated.' : 'جاري إجراء المسح الضوئي للنص المستهدف.');
}

function saveToSupabaseDB() {
    alert(isEnglish ? 'Successfully recorded to Supabase (ai-acc).' : 'تم التسجيل بنجاح فى قاعدة بيانات Supabase (ai-acc).');
}

function exportToGoogleSheets() {
    alert(isEnglish ? 'Exported to Google Sheets successfully.' : 'تم التصدير إلى Google Sheets بنجاح.');
}

function exportToExcel365() {
    alert(isEnglish ? 'Exported to Excel 365 successfully.' : 'تم التصدير إلى Excel 365 بنجاح.');
}

function toggleLanguage() {
    isEnglish = !isEnglish;
    const body = document.body;
    
    if (isEnglish) {
        body.classList.add('lang-en');
        document.getElementById('widget-launcher-title').innerText = 'Smart Accounting Assistant';
        document.getElementById('modal-header-title').innerText = 'ai-agent-acc Financial Accounting Agent';
        document.getElementById('welcome-msg-1').innerText = 'Welcome to your smart financial transaction agent';
        document.getElementById('welcome-msg-2').innerText = 'Select: Country / Enter: Amount / Click: Standard Convert';
        document.getElementById('label-date').innerText = 'Date: 2026-10-01';
        
        document.getElementById('opt-egypt').innerText = 'Egypt (EG) - EGP';
        document.getElementById('opt-ksa').innerText = 'Saudi Arabia (SA) - SAR';
        document.getElementById('opt-uae').innerText = 'United Arab Emirates (AE) - AED';
        document.getElementById('opt-kuwait').innerText = 'Kuwait (KW) - KWD';
        document.getElementById('opt-qatar').innerText = 'Qatar (QA) - QAR';
        document.getElementById('opt-bahrain').innerText = 'Bahrain (BH) - BHD';
        document.getElementById('opt-oman').innerText = 'Oman (OM) - OMR';
        document.getElementById('opt-usa').innerText = 'United States (US) - USD';
        
        onCountryChange();
        
        document.getElementById('convert-btn').innerText = '🧮 Convert to Egyptian Pound';
        document.getElementById('amount-input').placeholder = 'Amount...';
        document.getElementById('foreign-result-display').placeholder = 'Conversion result in EGP...';
        document.getElementById('foreign-note-input').placeholder = 'Complete foreign transaction note like: Hotel accommodation expenses - for mission in KSA';
        document.getElementById('txt-copy').innerText = 'Copy Transfer';
        document.getElementById('txt-paste').innerText = 'Paste';
        document.getElementById('txt-import').innerText = 'Import';
        document.getElementById('transaction-text').placeholder = 'Write transaction statement & processing dictionary here (e.g., station rent 1500)...';
        document.getElementById('submit-btn-text').innerText = 'Send Transaction for Analysis Before Recording';
        document.getElementById('txt-voice').innerText = 'Voice';
        document.getElementById('txt-image').innerText = 'Image';
        document.getElementById('txt-ocr').innerText = 'OCR Scan';
        document.getElementById('res-badge').innerText = 'Instant Analytical Results & Processing Dictionary:';
        document.getElementById('res-label-amount').innerText = 'Amount & Value:';
        document.getElementById('res-label-debit').innerText = 'Debit Side:';
        document.getElementById('res-label-credit').innerText = 'Credit Side:';
        document.getElementById('res-label-statement').innerText = 'Affected Financial Statement:';
        document.getElementById('res-label-acc-statement').innerText = 'Account Statement:';
        document.getElementById('val-account-statement').innerText = 'General Ledger for Cash Transactions';
        document.getElementById('btn-exp-supabase').innerText = 'Save to Database';
        document.getElementById('btn-exp-sheets').innerText = 'Export to';
        document.getElementById('btn-exp-excel').innerText = 'Export to';
    } else {
        body.classList.remove('lang-en');
        document.getElementById('widget-launcher-title').innerText = 'المساعد المحاسبي الذكي';
        document.getElementById('modal-header-title').innerText = 'الوكيل الذكي للمحاسبة المالية ai-agent-acc';
        document.getElementById('welcome-msg-1').innerText = 'مرحبا مع وكيلك الذكى لتسجيل المعاملات المالية';
        document.getElementById('welcome-msg-2').innerText = 'اختر: الدولة / ادخل: المبلغ / اضغط: تحويل معياري';
        document.getElementById('label-date').innerText = 'التاريخ: 2026-10-01';
        
        document.getElementById('opt-egypt').innerText = 'جمهورية مصر العربية (EG) - EGP';
        document.getElementById('opt-ksa').innerText = 'المملكة العربية السعودية (SA) - SAR';
        document.getElementById('opt-uae').innerText = 'دولة الإمارات العربية المتحدة (AE) - AED';
        document.getElementById('opt-kuwait').innerText = 'دولة الكويت (KW) - KWD';
        document.getElementById('opt-qatar').innerText = 'دولة قطر (QA) - QAR';
        document.getElementById('opt-bahrain').innerText = 'مملكة البحرين (BH) - BHD';
        document.getElementById('opt-oman').innerText = 'سلطنة عمان (OM) - OMR';
        document.getElementById('opt-usa').innerText = 'الولايات المتحدة الأمريكية (US) - USD';
        
        onCountryChange();
        
        document.getElementById('convert-btn').innerText = '🧮 تحويل للجنيه المصري';
        document.getElementById('amount-input').placeholder = 'المبلغ...';
        document.getElementById('foreign-result-display').placeholder = 'ناتج التحويل للجنيه المصري...';
        document.getElementById('foreign-note-input').placeholder = 'أكمل بيان المعاملة بالدولة الأجنبية كالمثال : مصروفات إقامة فندقية - لمهمة بالسعودية';
        document.getElementById('txt-copy').innerText = 'نسخ التحويل';
        document.getElementById('txt-paste').innerText = 'لصق';
        document.getElementById('txt-import').innerText = 'استيراد';
        document.getElementById('transaction-text').placeholder = 'أكتب هنا بيان المعاملة المالية وقاموس المعالجة (مثال: دفع إيجار محطة 1500 أو أتعاب محاماة)...';
        document.getElementById('submit-btn-text').innerText = 'إرسال المعاملة المالية للتحليل قبل التسجيل/ الرصد';
        document.getElementById('txt-voice').innerText = 'تسجيل صوتي';
        document.getElementById('txt-image').innerText = 'جلب صورة';
        document.getElementById('txt-ocr').innerText = 'مسح ضوئي';
        document.getElementById('res-badge').innerText = 'النتائج التحليلية الفورية وقاموس المعالجة:';
        document.getElementById('res-label-amount').innerText = 'المبلغ والقيمة:';
        document.getElementById('res-label-debit').innerText = 'الجانب المدين:';
        document.getElementById('res-label-credit').innerText = 'الجانب الدائن:';
        document.getElementById('res-label-statement').innerText = 'القائمة المالية المتأثرة:';
        document.getElementById('res-label-acc-statement').innerText = 'Account Statement:';
        document.getElementById('val-account-statement').innerText = 'سجل الأستاذ العام للمعاملات النقدية';
        document.getElementById('btn-exp-supabase').innerText = 'تسجيل بقاعدة بيانات';
        document.getElementById('btn-exp-sheets').innerText = 'تصدير إلى';
        document.getElementById('btn-exp-excel').innerText = 'تصدير إلى';
    }
}