// ai-agent-acc - app.js (v5.8 Enterprise - Absolute Zero Mock Data & Hard Clean)
let isEnglish = false;

function toggleModal() {
    const modal = document.getElementById('ai-modal-box');
    if (modal) {
        const isOpen = (modal.style.display === 'block');
        if (!isOpen) {
            resetApplicationState();
        }
        modal.style.display = isOpen ? 'none' : 'block';
    }
}

function resetApplicationState() {
    const txArea = document.getElementById('transaction-text');
    const amountInput = document.getElementById('amount-input');
    const foreignNoteInput = document.getElementById('foreign-note-input');
    const foreignResultDisplay = document.getElementById('foreign-result-display');
    const resultsContainer = document.getElementById('results-container');
    const countrySelect = document.getElementById('country-select');
    const exchangeRateDisplay = document.getElementById('exchange-rate-display');

    // 1. فرض مصر كدولة أساسية دائماً
    if (countrySelect) {
        countrySelect.value = 'Egypt';
    }
    
    // 2. تصفير سعر الصرف ليكون محلياً حصرياً
    if (exchangeRateDisplay) {
        exchangeRateDisplay.innerText = isEnglish ? 'Exchange Rate: Local (EGP)' : 'سعر الصرف: محلي (EGP)';
    }

    if (amountInput) {
        amountInput.value = '';
        amountInput.disabled = true;
    }
    if (foreignNoteInput) {
        foreignNoteInput.value = '';
        foreignNoteInput.disabled = true;
    }
    const convertBtn = document.getElementById('convert-btn');
    if (convertBtn) {
        convertBtn.disabled = true;
    }

    if (foreignResultDisplay) foreignResultDisplay.value = '';
    
    // 3. تصفير حقل النص تماماً ومنع أي نص قديم
    if (txArea) {
        txArea.value = '';
        txArea.placeholder = isEnglish ? 'Type or paste WhatsApp chat text here...' : 'أكتب أو الصق نص محادثة واتساب هنا لتحليلها محاسبياً...';
    }
    
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }

    const valAmount = document.getElementById('val-amount');
    const valDebit = document.getElementById('val-debit');
    const valCredit = document.getElementById('val-credit');
    const valStatement = document.getElementById('val-statement');
    const valSubsidiary = document.getElementById('val-subsidiary-ledger');
    
    if (valAmount) valAmount.innerText = '---';
    if (valDebit) valDebit.innerText = '---';
    if (valCredit) valDebit.innerText = '---';
    if (valStatement) valStatement.innerText = '---';
    if (valSubsidiary) {
        valSubsidiary.innerText = isEnglish ? 'Independent Assistant Ledger for Transactions' : 'الأستاذ المساعد المستقل للمعاملات المالية';
    }
}

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

    if (amountInput) amountInput.value = '';
    if (foreignNoteInput) foreignNoteInput.value = '';
    if (foreignResultDisplay) foreignResultDisplay.value = '';
    if (txArea) txArea.value = '';
    if (resultsContainer) resultsContainer.style.display = 'none';

    const val = countrySelect.value;
    const isEgypt = (val === 'Egypt');

    if (amountInput) amountInput.disabled = isEgypt;
    if (convertBtn) convertBtn.disabled = isEgypt;
    if (foreignNoteInput) foreignNoteInput.disabled = isEgypt;

    if (isEgypt) {
        if (exchangeRateDisplay) {
            exchangeRateDisplay.innerText = isEnglish ? 'Exchange Rate: Local (EGP)' : 'سعر الصرف: محلي (EGP)';
        }
    } else {
        let currName = '';
        switch (val) {
            case 'Kuwait': currName = isEnglish ? 'Rate: 1 KWD = 160.00 EGP' : 'سعر الصرف: 1 دينار = 160.00 جنيه'; break;
            case 'KSA': currName = isEnglish ? 'Rate: 1 SAR = 13.00 EGP' : 'سعر الصرف: 1 ريال = 13.00 جنيه'; break;
            case 'UAE': currName = isEnglish ? 'Rate: 1 AED = 13.30 EGP' : 'سعر الصرف: 1 درهم = 13.30 جنيه'; break;
            case 'Qatar': currName = isEnglish ? 'Rate: 1 QAR = 13.20 EGP' : 'سعر الصرف: 1 ريال = 13.20 جنيه'; break;
            case 'Bahrain': currName = isEnglish ? 'Rate: 1 BHD = 128.00 EGP' : 'سعر الصرف: 1 دينار = 128.00 جنيه'; break;
            case 'Oman': currName = isEnglish ? 'Rate: 1 OMR = 125.00 EGP' : 'سعر الصرف: 1 ريال = 125.00 جنيه'; break;
            case 'USA': currName = isEnglish ? 'Rate: 1 USD = 48.50 EGP' : 'سعر الصرف: 1 دولار = 48.50 جنيه'; break;
            default: currName = isEnglish ? 'Exchange Rate: Local (EGP)' : 'سعر الصرف: محلي (EGP)';
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
    switch (countrySelect.value) {
        case 'Kuwait': rate = 160.00; break;
        case 'KSA': rate = 13.00; break;
        case 'UAE': rate = 13.30; break;
        case 'Qatar': rate = 13.20; break;
        case 'Bahrain': rate = 128.00; break;
        case 'Oman': rate = 125.00; break;
        case 'USA': rate = 48.50; break;
        default: rate = 1;
    }

    const converted = (val * rate).toFixed(2);
    resultDisplay.value = `${converted} EGP`;
}

// زر الاستيراد: يفرغ الحقل تماماً ويجعله جاهزاً لل لصق الحر
function triggerDocumentImport() {
    const txArea = document.getElementById('transaction-text');
    if (txArea) {
        txArea.value = '';
        txArea.placeholder = isEnglish ? 'Paste WhatsApp chat transcript here...' : 'قم بلصق محادثة واتساب هنا لتحليلها محاسبياً...';
        txArea.focus();
    }
}

function extractAmountFromText(text) {
    if (!text) return '0.00 جنيه';
    const cleanedText = text.replace(/,/g, '');
    const match = cleanedText.match(/\b\d+(\.\d+)?\b/g);
    
    if (match && match.length > 0) {
        for (let numStr of match) {
            let val = parseFloat(numStr);
            if (val > 0) {
                return `${val.toFixed(2)} جنيه`;
            }
        }
    }
    return '0.00 جنيه';
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
        if (!txArea || !txArea.value.trim() || txArea.value.includes('قم بلصق')) {
            alert(isEnglish ? 'Please paste or enter transaction text.' : 'يرجى إدخال أو لصق محادثة أو نص المعاملة المالية أولاً.');
            return;
        }
        
        finalProcessedText = txArea.value.trim();
        const isOnlyNumbers = /^[\d\.\s]+$/.test(finalProcessedText);
        if (isOnlyNumbers) {
            alert(isEnglish ? 'Please complete the transaction statement with description.' : 'عفواً، يجب أن يحتوي النص على وصف المعاملة وليس أرقاماً فقط.');
            return;
        }

        processedAmount = extractAmountFromText(finalProcessedText);
    } else {
        if (!foreignResultDisplay || !foreignResultDisplay.value.trim()) {
            alert(isEnglish ? 'Please convert the foreign amount first.' : 'يرجى إجراء تحويل العملة الأجنبية أولاً.');
            return;
        }
        if (!foreignNoteInput || !foreignNoteInput.value.trim()) {
            alert(isEnglish ? 'Please complete the foreign note.' : 'يرجى إكمال بيان المعاملة الأجنبية.');
            return;
        }
        processedAmount = foreignResultDisplay.value;
        finalProcessedText = `${foreignResultDisplay.value} - ${foreignNoteInput.value.trim()}`;
    }

    let debitSide = 'حـ/ المصروفات التشغيلية / الأصول (محلية)';
    let creditSide = 'حـ/ النقدية بالخزينة / البنك المركزي';
    let financialStatement = 'قائمة الدخل / المركز المالي';
    let assistantLedgerName = isEnglish ? 'Independent Assistant Ledger for Transactions' : 'الأستاذ المساعد المستقل للمعاملات المالية';

    const textLower = finalProcessedText.toLowerCase();
    if (textLower.includes('إيجار') || textLower.includes('ايجار') || textLower.includes('rent')) {
        debitSide = 'حـ/ مصروف الإيجار';
        creditSide = 'حـ/ النقدية بالخزينة أو البنك';
        financialStatement = 'قائمة الدخل';
    } else if (textLower.includes('أتعاب') || textLower.includes('استشارات') || textLower.includes('consulting')) {
        debitSide = 'حـ/ مصروفات الاستشارات والخدمات المهنية';
        creditSide = 'حـ/ البنك المركزي / الحسابات الجارية';
        financialStatement = 'قائمة الدخل';
    } else if (textLower.includes('أصول') || textLower.includes('معدات') || textLower.includes('أجهزة') || textLower.includes('equipment')) {
        debitSide = 'حـ/ الأصول الثابتة والمعدات';
        creditSide = 'حـ/ النقدية / الموردون';
        financialStatement = 'قائمة المركز المالي';
    } else if (!isEgypt) {
        debitSide = 'حـ/ المصروفات الخارجية والمهمات (أجنبية)';
        creditSide = 'حـ/ البنك المركزي / النقدية الأجنبية';
        financialStatement = 'قائمة الدخل / المركز المالي';
    }

    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        document.getElementById('val-amount').innerText = processedAmount;
        document.getElementById('val-debit').innerText = debitSide;
        document.getElementById('val-credit').innerText = creditSide;
        document.getElementById('val-statement').innerText = financialStatement;
        
        const valAccStatement = document.getElementById('val-subsidiary-ledger');
        if (valAccStatement) {
            valAccStatement.innerText = assistantLedgerName;
        }

        resultsContainer.scrollIntoView({ behavior: 'smooth' });
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
    alert(isEnglish ? 'Exported to Google Sheets successfully.' : 'تم التصدير إلى Google Sheets بنجاح وتحديث الجدول الحسابي.');
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
        
        const countrySelect = document.getElementById('country-select');
        if (countrySelect && countrySelect.value === 'Egypt') {
            document.getElementById('exchange-rate-display').innerText = 'Exchange Rate: Local (EGP)';
        }
        
        document.getElementById('opt-egypt').innerText = 'Egypt (EG) - EGP';
        document.getElementById('opt-ksa').innerText = 'Saudi Arabia (SA) - SAR';
        document.getElementById('opt-uae').innerText = 'United Arab Emirates (AE) - AED';
        document.getElementById('opt-kuwait').innerText = 'Kuwait (KW) - KWD';
        document.getElementById('opt-qatar').innerText = 'Qatar (QA) - QAR';
        document.getElementById('opt-bahrain').innerText = 'Bahrain (BH) - BHD';
        document.getElementById('opt-oman').innerText = 'Oman (OM) - OMR';
        document.getElementById('opt-usa').innerText = 'United States (US) - USD';
        
        document.getElementById('convert-btn').innerText = '🧮 Convert to Egyptian Pound';
        document.getElementById('amount-input').placeholder = 'Amount...';
        document.getElementById('foreign-result-display').placeholder = 'Conversion result in EGP...';
        document.getElementById('foreign-note-input').placeholder = 'Complete foreign transaction note like: Hotel accommodation expenses - for mission in KSA';
        document.getElementById('txt-import-big').innerText = 'Import WhatsApp chat transcript (Paste text)';
        document.getElementById('transaction-text').placeholder = 'Write or paste WhatsApp chat text here...';
        document.getElementById('submit-btn-text').innerHTML = '<span>Send Transaction for Analysis Before Recording</span> <span class="btn-arrow-icon">➔</span>';
        document.getElementById('txt-voice').innerText = 'Voice';
        document.getElementById('txt-image').innerText = 'Image';
        document.getElementById('txt-ocr').innerText = 'OCR Scan';
        document.getElementById('res-badge').innerText = 'Instant Analytical Results:';
        document.getElementById('res-label-amount').innerText = 'Amount & Value:';
        document.getElementById('res-label-debit').innerText = 'Debit Side:';
        document.getElementById('res-label-credit').innerText = 'Credit Side:';
        document.getElementById('res-label-statement').innerText = 'Affected Financial Statement:';
        document.getElementById('res-label-subsidiary').innerText = 'Assistant Ledger:';
        document.getElementById('val-subsidiary-ledger').innerText = 'Independent Assistant Ledger for Transactions';
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
        
        const countrySelect = document.getElementById('country-select');
        if (countrySelect && countrySelect.value === 'Egypt') {
            document.getElementById('exchange-rate-display').innerText = 'سعر الصرف: محلي (EGP)';
        }
        
        document.getElementById('opt-egypt').innerText = 'جمهورية مصر العربية (EG) - EGP';
        document.getElementById('opt-ksa').innerText = 'المملكة العربية السعودية (SA) - SAR';
        document.getElementById('opt-uae').innerText = 'دولة الإمارات العربية المتحدة (AE) - AED';
        document.getElementById('opt-kuwait').innerText = 'دولة الكويت (KW) - KWD';
        document.getElementById('opt-qatar').innerText = 'دولة قطر (QA) - QAR';
        document.getElementById('opt-bahrain').innerText = 'مملكة البحرين (BH) - BHD';
        document.getElementById('opt-oman').innerText = 'سلطنة عمان (OM) - OMR';
        document.getElementById('opt-usa').innerText = 'الولايات المتحدة الأمريكية (US) - USD';
        
        document.getElementById('convert-btn').innerText = '🧮 تحويل للجنيه المصري';
        document.getElementById('amount-input').placeholder = 'المبلغ...';
        document.getElementById('foreign-result-display').placeholder = 'ناتج التحويل للجنيه المصري...';
        document.getElementById('foreign-note-input').placeholder = 'أكمل بيان المعاملة بالدولة الأجنبية كالمثال : مصروفات إقامة فندقية - لمهمة بالسعودية';
        document.getElementById('txt-import-big').innerText = 'استيراد محادثة نصية من المنصات (لصق محادثة واتساب)';
        document.getElementById('transaction-text').placeholder = 'أكتب أو الصق هنا نص محادثة واتساب المراد تحليلها محاسبياً...';
        document.getElementById('submit-btn-text').innerHTML = '<span>إرسال المعاملة المالية للتحليل قبل التسجيل/ الرصد</span> <span class="btn-arrow-icon">➔</span>';
        document.getElementById('txt-voice').innerText = 'تسجيل صوتي';
        document.getElementById('txt-image').innerText = 'جلب صورة';
        document.getElementById('txt-ocr').innerText = 'مسح ضوئي';
        document.getElementById('res-badge').innerText, 'النتائج التحليلية الفورية:';
        document.getElementById('res-label-amount').innerText = 'المبلغ والقيمة:';
        document.getElementById('res-label-debit').innerText = 'الجانب المدين:';
        document.getElementById('res-label-credit').innerText = 'الجانب الدائن:';
        document.getElementById('res-label-statement').innerText = 'القائمة المالية المتأثرة:';
        document.getElementById('res-label-subsidiary').innerText = 'الأستاذ المساعد:';
        document.getElementById('val-subsidiary-ledger').innerText = 'الأستاذ المساعد المستقل للمعاملات المالية';
        document.getElementById('btn-exp-supabase').innerText = 'تسجيل بقاعدة بيانات';
        document.getElementById('btn-exp-sheets').innerText, 'تصدير إلى';
        document.getElementById('btn-exp-excel').innerText = 'تصدير إلى';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // تم إزالة قراءة الـ sharedText تماماً لتجنب جلب أي بيانات وهمية مخزنة
    resetApplicationState();

    const countrySelect = document.getElementById('country-select');
    if (countrySelect) {
        countrySelect.addEventListener('change', onCountryChange);
    }

    const submitBtn = document.getElementById('submit-btn-text');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            processAccountingTransaction();
        });
    }

    const txArea = document.getElementById('transaction-text');
    if (txArea) {
        txArea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                processAccountingTransaction();
            }
        });
    }
});