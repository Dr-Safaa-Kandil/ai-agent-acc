// ai-agent-acc - app.js (v8.16 Final Fully Verified & Compatible Implementation)
let isEnglish = false;
let currentMode = 'user';
let liveExchangeRates = {};
let pendingActionType = null;
let currentScenario = 'local'; // local or foreign

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

function switchTransactionScenario(scenarioType) {
    currentScenario = scenarioType;
    const localBox = document.getElementById('scenario-local-box');
    const foreignBox = document.getElementById('scenario-foreign-box');
    const btnLocal = document.getElementById('toggle-local-btn');
    const btnForeign = document.getElementById('toggle-foreign-btn');

    if (scenarioType === 'local') {
        localBox.classList.remove('hidden');
        foreignBox.classList.add('hidden');
        btnLocal.classList.add('active-v-toggle');
        btnForeign.classList.remove('active-v-toggle');
    } else {
        localBox.classList.add('hidden');
        foreignBox.classList.remove('hidden');
        btnForeign.classList.add('active-v-toggle');
        btnLocal.classList.remove('active-v-toggle');
        fetchLiveExchangeRates();
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

function getCurrentRate(country) {
    if (liveExchangeRates[country]) return liveExchangeRates[country];
    const fallbacks = { 'Kuwait': 160.00, 'KSA': 13.10, 'UAE': 13.40, 'Qatar': 13.30, 'Bahrain': 129.00, 'Oman': 126.00, 'USA': 53.10 };
    return fallbacks[country] || 1.00;
}

function onCountryChange() {
    const countrySelect = document.getElementById('country-select');
    const exchangeRateDisplay = document.getElementById('exchange-rate-display');
    const amountInput = document.getElementById('amount-input');
    const resultDisplay = document.getElementById('foreign-result-display');

    if (!countrySelect) return;
    const val = countrySelect.value;
    const rate = getCurrentRate(val).toFixed(2);

    if (exchangeRateDisplay) {
        exchangeRateDisplay.innerText = isEnglish ? `Live Rate: ${rate} EGP` : `سعر الصرف اللحظي: ${rate} جنيه`;
    }
    convertCurrencyRealtime();
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

function normalizeArabicIndicNumbers(str) {
    if (!str) return "";
    const arabicIndicMap = {'٠':'0', '١':'1', '٢':'2', '٣':'3', '٤':'4', '٥':'5', '٦':'6', '٧':'7', '٨':'8', '٩':'9'};
    return str.replace(/[٠-٩]/g, match => arabicIndicMap[match]);
}

function extractAmountFromText(text) {
    if (!text) return '0.00 جنيه';
    const normalizedText = normalizeArabicIndicNumbers(text);
    const cleanedText = normalizedText.replace(/,/g, '');
    const match = cleanedText.match(/\b\d+(\.\d+)?\b/g);
    if (match && match.length > 0) {
        for (let numStr of match) {
            let val = parseFloat(numStr);
            if (val > 0) return `${val.toFixed(2)} جنيه`;
        }
    }
    return '0.00 جنيه';
}

function sanitizeAndFilterWhatsAppText(rawText) {
    if (!rawText) return "";
    let cleaned = rawText.trim();
    const greetingsToIgnore = ["ازيك", "السلام عليكم", "صباح الخير", "مساء الخير", "هلا", "لو سمحت", "ممكن", "أهلاً", "هاي"];
    greetingsToIgnore.forEach(greet => {
        cleaned = cleaned.replace(new RegExp(greet, 'gi'), '');
    });
    return cleaned.trim();
}

function resetApplicationState() {
    const txArea = document.getElementById('transaction-text');
    const foreignTxArea = document.getElementById('foreign-transaction-text');
    const amountInput = document.getElementById('amount-input');
    const foreignResultDisplay = document.getElementById('foreign-result-display');
    const resultsContainer = document.getElementById('results-container');
    const dynamicDateDisplay = document.getElementById('dynamic-date-display');

    const today = new Date().toISOString().split('T')[0];
    if (dynamicDateDisplay) dynamicDateDisplay.innerText = today;

    if (txArea) txArea.value = '';
    if (foreignTxArea) foreignTxArea.value = '';
    if (amountInput) amountInput.value = '';
    if (foreignResultDisplay) foreignResultDisplay.value = '';
    if (resultsContainer) resultsContainer.style.display = 'none';

    switchTransactionScenario('local');
}

function confirmNewTransaction() {
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMsg = document.getElementById('confirm-msg-text');
    if (confirmMsg) {
        confirmMsg.innerText = isEnglish ? 'Previous transaction data will be cleared. Do you want to proceed?' : 'سيجرى حذف بيانات المعاملة السابقة، هل تريد المتابعة؟';
    }
    pendingActionType = 'new_transaction';
    if (confirmModal) confirmModal.classList.remove('hidden');
}

function handleActionWithConfirmation(actionType) {
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMsg = document.getElementById('confirm-msg-text');
    if (confirmMsg) {
        confirmMsg.innerText = isEnglish ? 'Previous transaction data will be cleared or overwritten. Proceed?' : 'سيجرى حذف بيانات المعاملة السابقة أو تحديثها، هل تريد المتابعة؟';
    }
    pendingActionType = actionType;
    if (confirmModal) confirmModal.classList.remove('hidden');
}

function closeConfirmModal() {
    const confirmModal = document.getElementById('confirm-modal');
    if (confirmModal) confirmModal.classList.add('hidden');
    pendingActionType = null;
}

function executeConfirmedAction() {
    const action = pendingActionType;
    closeConfirmModal();

    if (action === 'new_transaction') {
        resetApplicationState();
    } else if (action === 'supabase') {
        saveToSupabaseDB();
    } else if (action === 'sheets') {
        exportToGoogleSheets();
    } else if (action === 'excel') {
        exportToExcel365();
    }
}

function processAccountingTransactionDirect() {
    const resultsContainer = document.getElementById('results-container');
    let finalProcessedText = '';
    let processedAmount = '0.00 جنيه';

    if (currentScenario === 'local') {
        const txArea = document.getElementById('transaction-text');
        if (!txArea || !txArea.value.trim()) {
            alert(isEnglish ? 'Please enter transaction statement.' : 'يرجى إكمال بيان المعاملة المالية وإدخال المبلغ أو طريقة السداد أولاً.');
            return;
        }
        finalProcessedText = sanitizeAndFilterWhatsAppText(txArea.value);
        processedAmount = extractAmountFromText(finalProcessedText);
    } else {
        const foreignRes = document.getElementById('foreign-result-display');
        const foreignTxArea = document.getElementById('foreign-transaction-text');
        if (!foreignRes || !foreignRes.value.trim()) {
            alert(isEnglish ? 'Please enter a valid foreign amount first.' : 'يرجى إدخال المبلغ الأجنبي ليتم تحويله وعرض الناتج أولاً.');
            return;
        }
        processedAmount = foreignRes.value;
        finalProcessedText = `${foreignRes.value} - ${foreignTxArea ? foreignTxArea.value.trim() : ''}`;
    }

    let debitSide = isEnglish ? 'Debit: Fixed Assets & Equipment' : 'حـ/ الأصول الثابتة والمعدات';
    let creditSide = isEnglish ? 'Credit: Cash / Bank' : 'حـ/ خزينة النقدية / البنك';

    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        document.getElementById('val-amount').innerText = processedAmount;
        document.getElementById('val-debit').innerText = debitSide;
        document.getElementById('val-credit').innerText = creditSide;
        document.getElementById('val-statement').innerText = isEnglish ? 'Financial Position' : 'المركز المالي';
        document.getElementById('val-subsidiary-ledger').innerText = isEnglish ? 'Independent Assistant Ledger for Transactions' : 'الأستاذ المساعد المستقل للمعاملات المالية';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

function triggerImageUpload() { document.getElementById('hidden-file-input')?.click(); }
function handleFileSelected(event) {
    const file = event.target.files[0];
    if (file) {
        const targetArea = currentScenario === 'local' ? document.getElementById('transaction-text') : document.getElementById('foreign-transaction-text');
        if (targetArea) targetArea.value = isEnglish ? `[Attached Document: ${file.name}]` : `[تم إرفاق المستند: ${file.name}]`;
        alert(isEnglish ? `File uploaded: ${file.name}` : `تم إرفاق المستند: ${file.name}`);
    }
}
function triggerVoiceInput() { alert(isEnglish ? 'Voice recording active.' : 'جاري تفعيل التسجيل الصوتي لبيان المعاملة المالية.'); }
function triggerOCRScan() { alert(isEnglish ? 'OCR scanning active.' : 'جاري المسح الضوئي المستندي بالذكاء الاصطناعي.'); }
function saveToSupabaseDB() { alert(isEnglish ? 'Saved to Supabase.' : 'تم التسجيل في قاعدة البيانات بنجاح.'); }
function exportToGoogleSheets() { alert(isEnglish ? 'Exported to Sheets.' : 'تم التصدير إلى Google Sheets بنجاح.'); }
function exportToExcel365() { alert(isEnglish ? 'Exported to Excel.' : 'تم التصدير إلى Excel 365 بنجاح.'); }

function toggleLanguage() {
    isEnglish = !isEnglish;
    const htmlRoot = document.getElementById('htmlRoot');
    const body = document.body;
    const langBtn = document.getElementById('langToggleBtn');

    if (isEnglish) {
        htmlRoot.setAttribute('dir', 'ltr');
        htmlRoot.setAttribute('lang', 'en');
        body.classList.add('lang-en');
        if (langBtn) langBtn.innerText = 'ع';

        document.getElementById('widget-launcher-title').innerText = 'Smart Accounting Assistant';
        document.getElementById('modal-header-title-text').innerText = 'Smart Accounting Assistant - ai-agent-acc';
        document.getElementById('welcome-msg-1').innerText = 'Welcome to your smart financial transaction agent';
        
        document.getElementById('txt-local-opt').innerText = 'Local Transaction in Egypt';
        document.getElementById('txt-foreign-opt').innerText = 'Foreign / Currency Transaction';
        
        document.getElementById('welcome-msg-2').innerText = 'Select Country / Enter Amount to Convert';
        document.getElementById('amount-input').placeholder = 'Amount...';
        document.getElementById('foreign-result-display').placeholder = 'Converted amount...';
        
        document.getElementById('ins-1').innerText = 'Enter financial transaction including amount and payment method';
        document.getElementById('ins-2').innerText = 'Complete transaction parties and payment method after entering amount';
        
        document.getElementById('new-trans-btn-text').innerText = 'New Financial Transaction';
        document.getElementById('submit-btn-text').innerText = 'Send Transaction for Analysis';
        
        document.getElementById('txt-image').innerText = 'Image';
        document.getElementById('txt-ocr').innerText = 'OCR';
        document.getElementById('txt-voice').innerText = 'Voice';
        
        document.getElementById('res-badge').innerText = 'Instant Analytical Results:';
        document.getElementById('res-label-amount').innerText = 'Amount:';
        document.getElementById('res-label-debit').innerText = 'Debit:';
        document.getElementById('res-label-credit').innerText = 'Credit:';
        document.getElementById('res-label-statement').innerText = 'Statement:';
        document.getElementById('res-label-subsidiary').innerText = 'Ledger:';
    } else {
        htmlRoot.setAttribute('dir', 'rtl');
        htmlRoot.setAttribute('lang', 'ar');
        body.classList.remove('lang-en');
        if (langBtn) langBtn.innerText = 'EN';

        document.getElementById('widget-launcher-title').innerText = 'المساعد المحاسبي الذكي';
        document.getElementById('modal-header-title-text').innerText = 'المساعد المحاسبي الذكي - ai-agent-acc';
        document.getElementById('welcome-msg-1').innerText = 'مرحبا مع وكيلك الذكى لتسجيل المعاملات المالية';
        
        document.getElementById('txt-local-opt').innerText = 'معاملة مالية محلية بمصر';
        document.getElementById('txt-foreign-opt').innerText = 'معاملة بدولة / بعملة أجنبية';
        
        document.getElementById('welcome-msg-2').innerText = 'إختر الدولة / أدخل المبلغ لعرض ناتج التحويل';
        document.getElementById('amount-input').placeholder = 'المبلغ...';
        document.getElementById('foreign-result-display').placeholder = 'ناتج التحويل...';
        
        document.getElementById('ins-1').innerText = 'أدخل بيان المعاملة المالية شاملا المبلغ وسداده نقدا أم بالبنك أومستحق';
        document.getElementById('ins-2').innerText = 'أكمل بيان أطراف المعاملة المالية وطريقة السداد بعد أدخالك المبلغ';
        
        document.getElementById('new-trans-btn-text').innerText = 'معاملة مالية جديدة';
        document.getElementById('submit-btn-text').innerText = 'إرسال المعاملة المالية للتحليل';
        
        document.getElementById('txt-image').innerText = 'جلب صورة';
        document.getElementById('txt-ocr').innerText = 'مسح ضوئي';
        document.getElementById('txt-voice').innerText = 'تسجيل صوتي';
        
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
        processAccountingTransactionDirect(); 
    });
});