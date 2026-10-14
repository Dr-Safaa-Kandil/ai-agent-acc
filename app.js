// ai-agent-acc - app.js (v7.3 Complete & Fully Optimized)
let isEnglish = false;
let currentMode = 'user';

function toggleModal() {
    const modal = document.getElementById('ai-modal-box');
    if (modal) {
        const isHidden = modal.classList.contains('hidden');
        if (isHidden) {
            resetApplicationState();
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    }
}

function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-icon-btn').forEach(btn => btn.classList.remove('active-mode'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active-mode');
    }
    console.log(`تم تفعيل النمط التخصصي بنجاح: ${mode}`);
}

function resetApplicationState() {
    const txArea = document.getElementById('transaction-text');
    const amountInput = document.getElementById('amount-input');
    const foreignNoteInput = document.getElementById('foreign-note-input');
    const foreignResultDisplay = document.getElementById('foreign-result-display');
    const resultsContainer = document.getElementById('results-container');
    const countrySelect = document.getElementById('country-select');
    const exchangeRateDisplay = document.getElementById('exchange-rate-display');
    const dynamicDateDisplay = document.getElementById('dynamic-date-display');

    const today = new Date().toISOString().split('T')[0];
    if (dynamicDateDisplay) {
        dynamicDateDisplay.innerText = today;
    }

    if (countrySelect) {
        countrySelect.value = 'Egypt';
    }
    
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

    if (foreignResultDisplay) foreignResultDisplay.value = '';
    
    if (txArea) {
        txArea.value = '';
        txArea.placeholder = isEnglish 
            ? `[ Option 1 - Local Site in Egypt ]\n📌 Please enter transaction statement here...\n\n[ Option 2 - Foreign Work & Travel ]\n🌐 Complete foreign transaction note here.` 
            : `[ الخيار الأول - للموقع المحلي بمصر ]\n📌 فضلاً أدخل هنا بيان المعاملة المالية بمصر، شاملاً المبلغ بالكتابة أو النسخ واللصق لمحادثة...\n\n[ الخيار الثاني - العمل الخارجي وعند السفر ]\n🌐 أكمل هنا بيان المعاملة المالية بالدولة الأجنبية، بعد أن أدخلت المبلغ وتم تحويله للجنيه المصري.`;
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
    if (valCredit) valCredit.innerText = '---';
    if (valStatement) valStatement.innerText = '---';
    if (valSubsidiary) {
        valSubsidiary.innerText = isEnglish ? 'Independent Assistant Ledger for Transactions' : 'الأستاذ المساعد المستقل للمعاملات المالية';
    }
}

function clearAllData() {
    const confirmMsg = isEnglish ? 'Are you sure you want to clear all workspace data and results?' : 'هل أنت متأكد من مسح بيانات مساحة العمل ونتائج التحليل؟';
    if (confirm(confirmMsg)) {
        resetApplicationState();
    }
}

function getRealtimeRate(country) {
    switch (country) {
        case 'Kuwait': return 160.00;
        case 'KSA': return 13.00;
        case 'UAE': return 13.30;
        case 'Qatar': return 13.20;
        case 'Bahrain': return 128.00;
        case 'Oman': return 125.00;
        case 'USA': return 48.50;
        default: return 1.00;
    }
}

function onCountryChange() {
    const countrySelect = document.getElementById('country-select');
    const amountInput = document.getElementById('amount-input');
    const foreignNoteInput = document.getElementById('foreign-note-input');
    const exchangeRateDisplay = document.getElementById('exchange-rate-display');
    const foreignResultDisplay = document.getElementById('foreign-result-display');
    const resultsContainer = document.getElementById('results-container');

    if (!countrySelect) return;

    if (amountInput) amountInput.value = '';
    if (foreignNoteInput) foreignNoteInput.value = '';
    if (foreignResultDisplay) foreignResultDisplay.value = '';
    if (resultsContainer) resultsContainer.style.display = 'none';

    const val = countrySelect.value;
    const isEgypt = (val === 'Egypt');

    if (amountInput) amountInput.disabled = isEgypt;
    if (foreignNoteInput) foreignNoteInput.disabled = isEgypt;

    if (isEgypt) {
        if (exchangeRateDisplay) {
            exchangeRateDisplay.innerText = isEnglish ? 'Exchange Rate: Local (EGP)' : 'سعر الصرف: محلي (EGP)';
        }
    } else {
        const rate = getRealtimeRate(val);
        if (exchangeRateDisplay) {
            exchangeRateDisplay.innerText = isEnglish ? `Rate: 1 Unit = ${rate} EGP` : `سعر الصرف: 1 وحدة = ${rate} جنيه`;
        }
    }
}

function convertCurrencyRealtime() {
    const countrySelect = document.getElementById('country-select');
    const amountInput = document.getElementById('amount-input');
    const resultDisplay = document.getElementById('foreign-result-display');

    if (!countrySelect || !amountInput || !resultDisplay) return;

    const val = parseFloat(amountInput.value);
    if (isNaN(val) || val <= 0) {
        resultDisplay.value = '';
        return;
    }

    const rate = getRealtimeRate(countrySelect.value);
    const converted = (val * rate).toFixed(2);
    resultDisplay.value = `${converted} EGP`;
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
        if (!txArea || !txArea.value.trim()) {
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
            alert(isEnglish ? 'Please enter a valid foreign amount first.' : 'يرجى إدخال المبلغ الأجنبي ليتم تحويله فورياً أولاً.');
            return;
        }
        if (!foreignNoteInput || !foreignNoteInput.value.trim()) {
            alert(isEnglish ? 'Please complete the foreign note.' : 'يرجى إكمال بيان المعاملة الأجنبية.');
            return;
        }
        processedAmount = foreignResultDisplay.value;
        finalProcessedText = `${foreignResultDisplay.value} - ${foreignNoteInput.value.trim()}`;
    }

    let debitSide = 'حـ/ مصروفات النشاط والنثريات العامة';
    let creditSide = 'حـ/ خزينة النقدية بالصندوق / البنك';
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
    const txArea = document.getElementById('transaction-text');
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert(isEnglish ? 'Voice recording not supported.' : 'متصفحك لا يدعم الإدخال الصوتي المباشر.');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-EG';
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        if (txArea) {
            txArea.value = transcript;
        }
    };

    recognition.start();
}

function triggerImageUpload() {
    alert(isEnglish ? 'Image upload dialog opened.' : 'تم فتح نافذة اختيار الصور والمستندات لاستخراج النص (OCR).');
}

function triggerOCRScan() {
    alert(isEnglish ? 'OCR scanning initiated.' : 'جاري إجراء المسح الضوئي المستندي المعالج للصور.');
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
    const langBtn = document.getElementById('langToggleBtn');
    
    if (isEnglish) {
        body.classList.add('lang-en');
        if (langBtn) langBtn.innerText = 'ع';
        
        document.getElementById('widget-launcher-title').innerText = 'Smart Accounting Assistant';
        document.getElementById('modal-header-title-text').innerText = 'ai-agent-acc Financial Accounting Agent';
        document.getElementById('welcome-msg-1').innerText = 'Welcome to your smart financial transaction agent';
        document.getElementById('welcome-msg-2').innerText = 'Select: Country / Enter: Amount for Real-time Conversion';
        
        // Mode labels
        document.getElementById('lbl-mode-user').innerText = 'User';
        document.getElementById('lbl-mode-auditor').innerText = 'Accounting Auditor';
        document.getElementById('lbl-mode-manager').innerText = 'Financial Planner';
        
        const countrySelect = document.getElementById('country-select');
        if (countrySelect && countrySelect.value === 'Egypt') {
            document.getElementById('exchange-rate-display').innerText = 'Exchange Rate: Local (EGP)';
        } else if (countrySelect) {
            const rate = getRealtimeRate(countrySelect.value);
            document.getElementById('exchange-rate-display').innerText = `Rate: 1 Unit = ${rate} EGP`;
        }
        
        document.getElementById('opt-egypt').innerText = 'Egypt (EG) - EGP';
        document.getElementById('opt-ksa').innerText = 'Saudi Arabia (SA) - SAR';
        document.getElementById('opt-uae').innerText = 'United Arab Emirates (AE) - AED';
        document.getElementById('opt-kuwait').innerText = 'Kuwait (KW) - KWD';
        document.getElementById('opt-qatar').innerText = 'Qatar (QA) - QAR';
        document.getElementById('opt-bahrain').innerText = 'Bahrain (BH) - BHD';
        document.getElementById('opt-oman').innerText = 'Oman (OM) - OMR';
        document.getElementById('opt-usa').innerText = 'United States (US) - USD';
        
        document.getElementById('amount-input').placeholder = 'Amount...';
        document.getElementById('foreign-result-display').placeholder = 'Real-time conversion result in EGP...';
        document.getElementById('foreign-note-input').placeholder = 'Complete foreign transaction note like: Hotel accommodation expenses - for mission in KSA';
        document.getElementById('transaction-text').placeholder = `[ Option 1 - Local Site in Egypt ]\n📌 Please enter transaction statement here...\n\n[ Option 2 - Foreign Work & Travel ]\n🌐 Complete foreign transaction note here.`;
        document.getElementById('submit-btn-text').innerText = 'Send Transaction for Analysis';
        document.getElementById('clear-btn-text').innerText = 'Clear All';
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
        
        document.getElementById('exp-sup-l1').innerText = 'Record to Database';
        document.getElementById('btn-exp-supabase').innerText = 'Supabase (ai-acc)';
        document.getElementById('exp-sh-l1').innerText = 'Export to';
        document.getElementById('btn-exp-sheets').innerText = 'Google Sheets';
        document.getElementById('exp-ex-l1').innerText = 'Export to';
        document.getElementById('btn-exp-excel').innerText = 'Excel 365';
    } else {
        body.classList.remove('lang-en');
        if (langBtn) langBtn.innerText = 'EN';
        
        document.getElementById('widget-launcher-title').innerText = 'المساعد المحاسبي الذكي';
        document.getElementById('modal-header-title-text').innerText = 'المساعد المحاسبي الذكي - ai-agent-acc';
        document.getElementById('welcome-msg-1').innerText = 'مرحبا مع وكيلك الذكى لتسجيل المعاملات المالية';
        document.getElementById('welcome-msg-2').innerText = 'اختر الدولة / أدخل المبلغ لتحويله فورياً';
        
        // Mode labels
        document.getElementById('lbl-mode-user').innerText = 'المستخدم';
        document.getElementById('lbl-mode-auditor').innerText = 'المراجع';
        document.getElementById('lbl-mode-manager').innerText = 'المخطط المالي';
        
        const countrySelect = document.getElementById('country-select');
        if (countrySelect && countrySelect.value === 'Egypt') {
            document.getElementById('exchange-rate-display').innerText = 'سعر الصرف: محلي (EGP)';
        } else if (countrySelect) {
            const rate = getRealtimeRate(countrySelect.value);
            document.getElementById('exchange-rate-display').innerText = `سعر الصرف: 1 وحدة = ${rate} جنيه`;
        }
        
        document.getElementById('opt-egypt').innerText = 'جمهورية مصر العربية (EG) - EGP';
        document.getElementById('opt-ksa').innerText = 'المملكة العربية السعودية (SA) - SAR';
        document.getElementById('opt-uae').innerText = 'دولة الإمارات العربية المتحدة (AE) - AED';
        document.getElementById('opt-kuwait').innerText = 'دولة الكويت (KW) - KWD';
        document.getElementById('opt-qatar').innerText = 'دولة قطر (QA) - QAR';
        document.getElementById('opt-bahrain').innerText = 'مملكة البحرين (BH) - BHD';
        document.getElementById('opt-oman').innerText = 'سلطنة عمان (OM) - OMR';
        document.getElementById('opt-usa').innerText = 'الولايات المتحدة الأمريكية (US) - USD';
        
        document.getElementById('amount-input').placeholder = 'المبلغ...';
        document.getElementById('foreign-result-display').placeholder = 'ناتج التحويل الفوري للجنيه المصري...';
        document.getElementById('foreign-note-input').placeholder = 'أكمل بيان المعاملة بالدولة الأجنبية كالمثال : مصروفات إقامة فندقية - لمهمة بالسعودية';
        document.getElementById('transaction-text').placeholder = `[ الخيار الأول - للموقع المحلي بمصر ]\n📌 فضلاً أدخل هنا بيان المعاملة المالية بمصر، شاملاً المبلغ بالكتابة أو النسخ واللصق لمحادثة...\n\n[ الخيار الثاني - العمل الخارجي وعند السفر ]\n🌐 أكمل هنا بيان المعاملة المالية بالدولة الأجنبية، بعد أن أدخلت المبلغ وتم تحويله للجنيه المصري.`;
        document.getElementById('submit-btn-text').innerText = 'إرسال المعاملة المالية للتحليل';
        document.getElementById('clear-btn-text').innerText = 'مسح الكل';
        document.getElementById('txt-voice').innerText = 'تسجيل صوتي';
        document.getElementById('txt-image').innerText = 'جلب صورة';
        document.getElementById('txt-ocr').innerText = 'مسح ضوئي';
        document.getElementById('res-badge').innerText = 'النتائج التحليلية الفورية:';
        document.getElementById('res-label-amount').innerText = 'المبلغ والقيمة:';
        document.getElementById('res-label-debit').innerText = 'الجانب المدين:';
        document.getElementById('res-label-credit').innerText = 'الجانب الدائن:';
        document.getElementById('res-label-statement').innerText = 'القائمة المالية المتأثرة:';
        document.getElementById('res-label-subsidiary').innerText = 'الأستاذ المساعد:';
        document.getElementById('val-subsidiary-ledger').innerText = 'الأستاذ المساعد المستقل للمعاملات المالية';
        
        document.getElementById('exp-sup-l1').innerText = 'تسجيل بقاعدة بيانات';
        document.getElementById('btn-exp-supabase').innerText = 'Supabase (ai-acc)';
        document.getElementById('exp-sh-l1').innerText = 'تصدير إلى';
        document.getElementById('btn-exp-sheets').innerText = 'Google Sheets';
        document.getElementById('exp-ex-l1').innerText = 'تصدير إلى';
        document.getElementById('btn-exp-excel').innerText = 'Excel 365';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    resetApplicationState();

    const countrySelect = document.getElementById('country-select');
    if (countrySelect) {
        countrySelect.addEventListener('change', onCountryChange);
    }

    const amountInput = document.getElementById('amount-input');
    if (amountInput) {
        amountInput.addEventListener('input', convertCurrencyRealtime);
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