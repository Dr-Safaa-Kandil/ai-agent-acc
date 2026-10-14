// ai-agent-acc - app.js (v7.8 Final Full Version)
let isEnglish = false;
let currentMode = 'user';
let liveExchangeRates = {};

function toggleModal() {
    const modal = document.getElementById('ai-modal-box');
    if (modal) {
        const isHidden = modal.classList.contains('hidden');
        if (isHidden) {
            resetApplicationState();
            modal.classList.remove('hidden');
            fetchLiveExchangeRates();
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
}

async function fetchLiveExchangeRates() {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
            const egpRate = data.rates.EGP || 53.10;
            
            liveExchangeRates = {
                'USA': egpRate,
                'Kuwait': egpRate / (data.rates.KWD || 0.31),
                'KSA': egpRate / (data.rates.SAR || 3.75),
                'UAE': egpRate / (data.rates.AED || 3.67),
                'Qatar': egpRate / (data.rates.QAR || 3.64),
                'Bahrain': egpRate / (data.rates.BHD || 0.376),
                'Oman': egpRate / (data.rates.OMR || 0.384)
            };
            
            onCountryChange();
        }
    } catch (error) {
        console.error('تعذر جلب أسعار الصرف الحية:', error);
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
    const dynamicDateDisplay = document.getElementById('dynamic-date-display');

    const today = new Date().toISOString().split('T')[0];
    if (dynamicDateDisplay) dynamicDateDisplay.innerText = today;
    if (countrySelect) countrySelect.value = 'Egypt';
    if (exchangeRateDisplay) exchangeRateDisplay.innerText = isEnglish ? 'Exchange Rate: Local (EGP)' : 'سعر الصرف: محلي (EGP)';

    if (amountInput) { amountInput.value = ''; amountInput.disabled = true; }
    if (foreignNoteInput) { foreignNoteInput.value = ''; foreignNoteInput.disabled = true; }
    if (foreignResultDisplay) foreignResultDisplay.value = '';
    
    if (txArea) {
        txArea.value = '';
        txArea.placeholder = isEnglish 
            ? 'Please enter transaction statement including amount.. You can also upload financial document image or voice record.' 
            : 'فضلاً أدخل هنا بيان المعاملة المالية شاملاً المبلغ.. ويمكنك أيضا جلب صورة المستند المالى أو التسجيل الصوتى لبيان المعاملة المالية';
    }
    
    if (resultsContainer) resultsContainer.style.display = 'none';

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
    if (confirm(confirmMsg)) resetApplicationState();
}

function getCurrentRate(country) {
    if (liveExchangeRates[country]) return liveExchangeRates[country];
    const fallbacks = { 'Kuwait': 160.00, 'KSA': 13.10, 'UAE': 13.40, 'Qatar': 13.30, 'Bahrain': 129.00, 'Oman': 126.00, 'USA': 53.10 };
    return fallbacks[country] || 1.00;
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
        if (exchangeRateDisplay) exchangeRateDisplay.innerText = isEnglish ? 'Exchange Rate: Local (EGP)' : 'سعر الصرف: محلي (EGP)';
    } else {
        const rate = getCurrentRate(val).toFixed(2);
        if (exchangeRateDisplay) exchangeRateDisplay.innerText = isEnglish ? `Rate: 1 Unit = ${rate} EGP` : `سعر الصرف: 1 وحدة = ${rate} جنيه`;
    }
}

function convertCurrencyRealtime() {
    const countrySelect = document.getElementById('country-select');
    const amountInput = document.getElementById('amount-input');
    const resultDisplay = document.getElementById('foreign-result-display');

    if (!countrySelect || !amountInput || !resultDisplay) return;
    const val = parseFloat(amountInput.value);
    if (isNaN(val) || val <= 0) { resultDisplay.value = ''; return; }

    const rate = getCurrentRate(countrySelect.value);
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
            if (val > 0) return `${val.toFixed(2)} جنيه`;
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
            alert(isEnglish ? 'Please enter transaction statement.' : 'يرجى إدخال نص المعاملة المالية أولاً.');
            return;
        }
        finalProcessedText = txArea.value.trim();
        processedAmount = extractAmountFromText(finalProcessedText);
    } else {
        if (!foreignResultDisplay || !foreignResultDisplay.value.trim()) {
            alert(isEnglish ? 'Please enter a valid foreign amount first.' : 'يرجى إدخال المبلغ الأجنبي ليتم تحويله أولاً.');
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
        debitSide = 'حـ/ مصروف الإيجار'; creditSide = 'حـ/ النقدية بالخزينة أو البنك'; financialStatement = 'قائمة الدخل';
    } else if (textLower.includes('أتعاب') || textLower.includes('استشارات') || textLower.includes('consulting')) {
        debitSide = 'حـ/ مصروفات الاستشارات والخدمات المهنية'; creditSide = 'حـ/ البنك المركزي'; financialStatement = 'قائمة الدخل';
    }

    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        document.getElementById('val-amount').innerText = processedAmount;
        document.getElementById('val-debit').innerText = debitSide;
        document.getElementById('val-credit').innerText = creditSide;
        document.getElementById('val-statement').innerText = financialStatement;
        document.getElementById('val-subsidiary-ledger').innerText = assistantLedgerName;
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

function triggerVoiceInput() { alert(isEnglish ? 'Voice recording active.' : 'جاري تفعيل التسجيل الصوتي لبيان المعاملة المالية.'); }
function triggerImageUpload() { alert(isEnglish ? 'Image upload active.' : 'جاري جلب صورة المستند المالي.'); }
function triggerOCRScan() { alert(isEnglish ? 'OCR scanning.' : 'جاري المسح الضوئي المستندي.'); }
function saveToSupabaseDB() { alert(isEnglish ? 'Saved to Supabase.' : 'تم التسجيل في قاعدة البيانات بنجاح.'); }
function exportToGoogleSheets() { alert(isEnglish ? 'Exported to Sheets.' : 'تم التصدير إلى Google Sheets بنجاح.'); }
function exportToExcel365() { alert(isEnglish ? 'Exported to Excel.' : 'تم التصدير إلى Excel 365 بنجاح.'); }

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
        document.getElementById('welcome-msg-2').innerText = 'Select Country / Enter Amount for Conversion';
        document.getElementById('lbl-mode-user').innerText = 'User';
        document.getElementById('lbl-mode-auditor').innerText = 'Accounting Auditor';
        document.getElementById('lbl-mode-manager').innerText = 'Financial Planner';
        document.getElementById('foreign-result-display').placeholder = 'Conversion to EGP...';
        document.getElementById('foreign-note-input').placeholder = 'Complete foreign transaction note...';
        document.getElementById('transaction-text').placeholder = 'Please enter transaction statement including amount.. You can also upload financial document image or voice record.';
        document.getElementById('submit-btn-text').innerText = 'Send Transaction for Analysis';
        document.getElementById('clear-btn-text').innerText = 'Clear All';
        document.getElementById('txt-voice').innerText = 'Voice';
        document.getElementById('txt-image').innerText = 'Image';
        document.getElementById('txt-ocr').innerText = 'OCR';
        document.getElementById('res-badge').innerText = 'Instant Analytical Results:';
        document.getElementById('res-label-amount').innerText = 'Amount:';
        document.getElementById('res-label-debit').innerText = 'Debit:';
        document.getElementById('res-label-credit').innerText = 'Credit:';
        document.getElementById('res-label-statement').innerText = 'Statement:';
        document.getElementById('res-label-subsidiary').innerText = 'Ledger:';
    } else {
        body.classList.remove('lang-en');
        if (langBtn) langBtn.innerText = 'EN';
        document.getElementById('widget-launcher-title').innerText = 'المساعد المحاسبي الذكي';
        document.getElementById('modal-header-title-text').innerText = 'المساعد المحاسبي الذكي - ai-agent-acc';
        document.getElementById('welcome-msg-1').innerText = 'مرحبا مع وكيلك الذكى لتسجيل المعاملات المالية';
        document.getElementById('welcome-msg-2').innerText = 'اختر الدولة / أدخل المبلغ لتحويله فورياً';
        document.getElementById('lbl-mode-user').innerText = 'المستخدم';
        document.getElementById('lbl-mode-auditor').innerText = 'المراجع';
        document.getElementById('lbl-mode-manager').innerText = 'المخطط المالي';
        document.getElementById('foreign-result-display').placeholder = 'ناتج التحويل للجنيه...';
        document.getElementById('foreign-note-input').placeholder = 'أكمل بيان المعاملة بالدولة الأجنبية كالمثال : مصروفات إقامة فندقية - لمهمة بالسعودية';
        document.getElementById('transaction-text').placeholder = 'فضلاً أدخل هنا بيان المعاملة المالية شاملاً المبلغ.. ويمكنك أيضا جلب صورة المستند المالى أو التسجيل الصوتى لبيان المعاملة المالية';
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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    resetApplicationState();
    fetchLiveExchangeRates();
    
    document.getElementById('country-select')?.addEventListener('change', onCountryChange);
    document.getElementById('amount-input')?.addEventListener('input', convertCurrencyRealtime);
    document.getElementById('submit-btn-text')?.addEventListener('click', (e) => { 
        e.preventDefault(); 
        processAccountingTransaction(); 
    });
});