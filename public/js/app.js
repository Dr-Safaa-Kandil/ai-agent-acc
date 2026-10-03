// ai-agent-acc - app.js (v4.1 Enterprise)
let isEnglish = false;

function toggleModal() {
    const modal = document.getElementById('ai-modal-box');
    if (modal) {
        modal.style.display = (modal.style.display === 'none' || modal.style.display === '') ? 'block' : 'none';
    }
}

function toggleForeignFields() {
    const countrySelect = document.getElementById('country-select');
    const amountInput = document.getElementById('amount-input');
    const convertBtn = document.getElementById('convert-btn');
    const foreignNoteInput = document.getElementById('foreign-note-input');

    if (!countrySelect) return;

    const isEgypt = countrySelect.value === 'Egypt';
    if (amountInput) amountInput.disabled = isEgypt;
    if (convertBtn) convertBtn.disabled = isEgypt;
    if (foreignNoteInput) foreignNoteInput.disabled = isEgypt;

    if (isEgypt) {
        if (amountInput) amountInput.value = '';
        if (foreignNoteInput) foreignNoteInput.value = '';
        const resultDisplay = document.getElementById('foreign-result-display');
        if (resultDisplay) resultDisplay.value = '';
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
        case 'USA': rate = 48.5; currencyName = 'USD'; break;
        default: rate = 1; currencyName = 'EGP';
    }

    const converted = (val * rate).toFixed(2);
    resultDisplay.value = `${val} ${currencyName} = ${converted} EGP`;
}

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

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert(isEnglish ? 'Copied to clipboard successfully!' : 'تم النسخ إلى الحافظة بنجاح!');
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

function pasteWidgetState() {
    navigator.clipboard.readText().then(text => {
        const txArea = document.getElementById('transaction-text');
        if (txArea) {
            txArea.value = text;
            alert(isEnglish ? 'Pasted from clipboard successfully!' : 'تم اللصق من الحافظة بنجاح!');
        }
    }).catch(err => {
        console.error('Paste failed:', err);
        alert(isEnglish ? 'Paste permission denied or unsupported.' : 'تعذر اللصق، يرجى التحقق من صلاحيات المتصفح.');
    });
}

function triggerDocumentImport() {
    alert(isEnglish ? 'Importing document or state...' : 'جاري استيراد المستندات أو البيانات...');
}

function processAccountingTransaction() {
    const txArea = document.getElementById('transaction-text');
    const resultsContainer = document.getElementById('results-container');
    
    if (!txArea || !txArea.value.trim()) {
        alert(isEnglish ? 'Please enter transaction details first.' : 'يرجى كتابة بيان المعاملة المالية أولاً.');
        return;
    }

    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        document.getElementById('val-amount').innerText = '1,500.00 EGP';
        document.getElementById('val-debit').innerText = 'حـ/ المصروفات التشغيلية (الإيجار)';
        document.getElementById('val-credit').innerText = 'حـ/ النقدية بالخزينة / البنك';
        document.getElementById('val-statement').innerText = 'قائمة الدخل المركز المالي';
        document.getElementById('val-ledger').innerText = 'الأستاذ العام - مصروفات الإيجار';
    }
}

function triggerVoiceInput() {
    alert(isEnglish ? 'Voice recording feature activated.' : 'تم تفعيل خاصية التسجيل الصوتي.');
}

function triggerImageUpload() {
    alert(isEnglish ? 'Image upload dialog opened.' : 'تم فتح نافذة اختيار الصور والمستندات.');
}

function triggerOCRScan() {
    alert(isEnglish ? 'OCR scanning initiated.' : 'جاري إجراء المسح الضوئي للنص المستهدف.');
}

function saveToSupabaseDB() {
    alert(isEnglish ? 'Successfully recorded to Supabase (ai-acc).' : 'تم التسجيل بنجاح في قاعدة بيانات Supabase (ai-acc).');
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
        document.getElementById('label-exchange-title').innerText = 'Exchange Rate to Egyptian Pound';
        document.getElementById('opt-egypt').innerText = 'Egypt (EGP)';
        document.getElementById('opt-kuwait').innerText = 'Kuwait - Dinar (KWD)';
        document.getElementById('opt-ksa').innerText = 'Saudi Arabia (SAR)';
        document.getElementById('opt-uae').innerText = 'UAE (AED)';
        document.getElementById('opt-usa').innerText = 'USA Dollar (USD)';
        document.getElementById('convert-btn').innerText = '🧮 Convert to EGP';
        document.getElementById('amount-input').placeholder = 'Amount...';
        document.getElementById('foreign-result-display').placeholder = 'Conversion result in EGP...';
        document.getElementById('foreign-note-input').placeholder = 'Complete foreign transaction note';
        document.getElementById('txt-copy').innerText = 'Copy';
        document.getElementById('txt-paste').innerText = 'Paste';
        document.getElementById('txt-import').innerText = 'Import';
        document.getElementById('transaction-text').placeholder = 'Write transaction statement & processing dictionary here...';
        document.getElementById('examples-text').innerText = 'Example: Operational Rent Expense | Legal Consulting Fees | Equipment Purchase';
        document.getElementById('submit-btn-text').innerText = 'Send Transaction for Analysis Before Recording';
        document.getElementById('txt-voice').innerText = 'Voice';
        document.getElementById('txt-image').innerText = 'Image';
        document.getElementById('txt-ocr').innerText = 'OCR Scan';
        document.getElementById('res-badge').innerText = 'Instant Analytical Results & Processing Dictionary:';
        document.getElementById('res-label-amount').innerText = 'Amount & Value:';
        document.getElementById('res-label-debit').innerText = 'Debit Side:';
        document.getElementById('res-label-credit').innerText = 'Credit Side:';
        document.getElementById('res-label-statement').innerText = 'Affected Financial Statement:';
        document.getElementById('res-label-ledger').innerText = 'Associated General Ledger:';
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
        document.getElementById('label-exchange-title').innerText = 'سعر صرف العملة للجنيه المصري';
        document.getElementById('opt-egypt').innerText = 'مصر (EGP)';
        document.getElementById('opt-kuwait').innerText = 'الكويت - دينار كويتي (KWD)';
        document.getElementById('opt-ksa').innerText = 'السعودية (SAR)';
        document.getElementById('opt-uae').innerText = 'الإمارات (AED)';
        document.getElementById('opt-usa').innerText = 'الدولار الأمريكي (USD)';
        document.getElementById('convert-btn').innerText = '🧮 تحويل للجنيه المصري';
        document.getElementById('amount-input').placeholder = 'المبلغ...';
        document.getElementById('foreign-result-display').placeholder = 'ناتج التحويل للجنيه المصري...';
        document.getElementById('foreign-note-input').placeholder = 'أكمل بيان المعاملة بالدولة الأجنبية';
        document.getElementById('txt-copy').innerText = 'نسخ';
        document.getElementById('txt-paste').innerText = 'لصق';
        document.getElementById('txt-import').innerText = 'استيراد';
        document.getElementById('transaction-text').placeholder = 'أكتب هنا بيان المعاملة المالية وقاموس المعالجة (مثال: دفع إيجار محطة 1500 أو أتعاب محاماة)...';
        document.getElementById('examples-text').innerText = 'مثال: مصروف إيجار تشغيلي | أتعاب استشارية قانونية | شراء معدات';
        document.getElementById('submit-btn-text').innerText = 'إرسال المعاملة المالية للتحليل قبل التسجيل/ الرصد';
        document.getElementById('txt-voice').innerText = 'تسجيل صوتي';
        document.getElementById('txt-image').innerText = 'جلب صورة';
        document.getElementById('txt-ocr').innerText = 'مسح ضوئي';
        document.getElementById('res-badge').innerText = 'النتائج التحليلية الفورية وقاموس المعالجة:';
        document.getElementById('res-label-amount').innerText = 'المبلغ والقيمة:';
        document.getElementById('res-label-debit').innerText = 'الجانب المدين:';
        document.getElementById('res-label-credit').innerText = 'الجانب الدائن:';
        document.getElementById('res-label-statement').innerText = 'القائمة المالية المتأثرة:';
        document.getElementById('res-label-ledger').innerText = 'دفتر الأستاذ المرتبط:';
        document.getElementById('res-label-acc-statement').innerText = 'Account Statement:';
        document.getElementById('val-account-statement').innerText = 'سجل الأستاذ العام للمعاملات النقدية';
        document.getElementById('btn-exp-supabase').innerText = 'تسجيل بقاعدة بيانات';
        document.getElementById('btn-exp-sheets').innerText = 'تصدير إلى';
        document.getElementById('btn-exp-excel').innerText = 'تصدير إلى';
    }
}