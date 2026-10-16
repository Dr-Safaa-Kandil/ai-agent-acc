// ==========================================
// ai-agent-acc - app.js (النظام البرمجي الرئيسي)
// ==========================================

let currentScenario = 'local';
let isEnglish = false;

const exchangeRates = {
    'KSA': { rate: 13.50, nameAr: 'ريال سعودي', nameEn: 'SAR' },
    'UAE': { rate: 13.80, nameAr: 'درهم إماراتي', nameEn: 'AED' },
    'Kuwait': { rate: 165.00, nameAr: 'دينار كويتي', nameEn: 'KWD' },
    'Qatar': { rate: 14.00, nameAr: 'ريال قطري', nameEn: 'QAR' },
    'Bahrain': { rate: 134.00, nameAr: 'دينار بحريني', nameEn: 'BHD' },
    'Oman': { rate: 131.00, nameAr: 'ريال عماني', nameEn: 'OMR' },
    'USA': { rate: 50.50, nameAr: 'دولار أمريكي', nameEn: 'USD' }
};

function toggleModal() {
    const modal = document.getElementById('smart-modal');
    modal.classList.toggle('hidden');
}

function switchTransactionScenario(scenario) {
    currentScenario = scenario;
    const localBtn = document.getElementById('toggle-local-btn');
    const foreignBtn = document.getElementById('toggle-foreign-btn');
    const localBox = document.getElementById('scenario-local-box');
    const foreignBox = document.getElementById('scenario-foreign-box');

    if (scenario === 'local') {
        localBtn.classList.add('active-v-toggle');
        foreignBtn.classList.remove('active-v-toggle');
        localBox.classList.remove('hidden');
        foreignBox.classList.add('hidden');
    } else {
        foreignBtn.classList.add('active-v-toggle');
        localBtn.classList.remove('active-v-toggle');
        foreignBox.classList.remove('hidden');
        localBox.classList.add('hidden');
        onCountryChange();
    }
}

function openAddClientModal() {
    const modal = document.getElementById('add-client-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeAddClientModal() {
    const modal = document.getElementById('add-client-modal');
    if (modal) modal.classList.add('hidden');
    document.getElementById('new-client-ar').value = '';
    document.getElementById('new-client-en').value = '';
}

function saveNewClientToDictionary() {
    const arInput = document.getElementById('new-client-ar').value;
    const enInput = document.getElementById('new-client-en').value;

    if (!arInput || !enInput) {
        alert(isEnglish ? 'Please enter both Arabic and English names.' : 'يرجى إدخال اسم العميل بالعربية والإنجليزية.');
        return;
    }

    let success = accountingDictionary.addNewClientDynamic(arInput, enInput);
    if (success) {
        alert(isEnglish ? 'Client added successfully to the dictionary!' : 'تم إضافة العميل بنجاح إلى القاموس المحاسبي!');
        closeAddClientModal();
    }
}

function onCountryChange() {
    const countrySelect = document.getElementById('country-select');
    const rateDisplay = document.getElementById('exchange-rate-display');
    if (!countrySelect || !rateDisplay) return;

    const selectedCountry = countrySelect.value;
    const countryData = exchangeRates[selectedCountry];

    if (countryData) {
        rateDisplay.innerText = isEnglish ? 
            `1 ${countryData.nameEn} = ${countryData.rate} EGP` : 
            `سعر صرف الوحدة: 1 ${countryData.nameAr} = ${countryData.rate} جنيه`;
    }
    convertCurrencyRealtime();
}

function convertCurrencyRealtime() {
    const amountInput = document.getElementById('amount-input');
    const resultDisplay = document.getElementById('foreign-result-display');
    const countrySelect = document.getElementById('country-select');
    
    if (!amountInput || !resultDisplay || !countrySelect) return;

    let amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        resultDisplay.value = '';
        return;
    }

    const countryData = exchangeRates[countrySelect.value];
    if (countryData) {
        let totalEGP = amount * countryData.rate;
        resultDisplay.value = isEnglish ? 
            `${totalEGP.toFixed(2)} EGP` : 
            `${totalEGP.toFixed(2)} جنيه مصري`;
    }
}

function sanitizeAndFilterWhatsAppText(text) {
    return text ? text.replace(/[\r\n]+/g, ' ').trim() : '';
}

function extractAmountFromText(text) {
    const match = text.match(/\d+(\.\d+)?/);
    if (match) {
        return isEnglish ? `${match[0]} EGP` : `${match[0]} جنيه`;
    }
    return isEnglish ? '0.00 EGP' : '0.00 جنيه';
}

function processAccountingTransactionDirect() {
    const resultsContainer = document.getElementById('results-container');
    let rawInputText = '';
    let processedAmount = isEnglish ? '0.00 EGP' : '0.00 جنيه';

    if (currentScenario === 'local') {
        const txArea = document.getElementById('transaction-text');
        if (!txArea || !txArea.value.trim()) {
            alert(isEnglish ? 'Please enter transaction statement first.' : 'يرجى إكمال بيان المعاملة المالية أولاً.');
            return;
        }
        rawInputText = txArea.value;
    } else {
        const foreignRes = document.getElementById('foreign-result-display');
        const foreignTxArea = document.getElementById('foreign-transaction-text');
        if (!foreignRes || !foreignRes.value.trim()) {
            alert(isEnglish ? 'Please enter foreign amount first.' : 'يرجى إدخال المبلغ الأجنبي أولاً.');
            return;
        }
        processedAmount = foreignRes.value;
        rawInputText = foreignTxArea ? foreignTxArea.value : '';
    }

    const analysisResult = accountingDictionary.processTextAnalysis(rawInputText, isEnglish);
    let finalCleanText = sanitizeAndFilterWhatsAppText(analysisResult.translatedStatement);
    if (currentScenario === 'local') {
        processedAmount = extractAmountFromText(finalCleanText);
    }

    if (resultsContainer) {
        resultsContainer.style.display = 'block';
        document.getElementById('val-amount').innerText = processedAmount;
        document.getElementById('val-debit').innerText = analysisResult.debit;
        document.getElementById('val-credit').innerText = analysisResult.credit;
        document.getElementById('val-statement').innerText = analysisResult.statement;
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

function resetTransactionForm() {
    document.getElementById('transaction-text').value = '';
    document.getElementById('amount-input').value = '';
    document.getElementById('foreign-result-display').value = '';
    document.getElementById('foreign-transaction-text').value = '';
    const resCont = document.getElementById('results-container');
    if (resCont) resCont.style.display = 'none';
}

function exportData(type) {
    alert(isEnglish ? `Exporting transaction report as ${type.toUpperCase()}...` : `جاري تنفيذ العملية المطلوبة بتنسيق ${type.toUpperCase()}...`);
}

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
        document.getElementById('modal-header-title-text').innerText = 'Smart Accounting Assistant';
        document.getElementById('welcome-msg-1').innerText = 'Welcome to your smart financial transaction agent';
        
        document.getElementById('txt-local-l1').innerText = 'Financial';
        document.getElementById('txt-local-l2').innerText = 'Transaction';
        document.getElementById('txt-foreign-l1').innerText = 'Foreign';
        document.getElementById('txt-foreign-l2').innerText = 'Country Tx';
        document.getElementById('txt-btn-add-client').innerText = 'Add Client';
        
        document.getElementById('welcome-msg-2').innerText = 'Select Country / Enter Amount to Convert';
        document.getElementById('amount-input').placeholder = 'Amount...';
        document.getElementById('foreign-result-display').placeholder = 'Converted amount...';
        
        document.getElementById('ins-1').innerText = 'Enter financial transaction including amount and payment method';
        document.getElementById('ins-2').innerText = 'Complete transaction parties and payment method after entering amount';
        
        document.getElementById('new-trans-btn-text').innerText = 'Clear All';
        document.getElementById('submit-btn-text').innerText = 'Send Transaction for Analysis';
        
        document.getElementById('txt-image').innerText = 'Image';
        document.getElementById('txt-ocr').innerText = 'OCR';
        document.getElementById('txt-voice').innerText = 'Voice';

        document.getElementById('modal-client-title').innerText = 'Add New Client / Company to Dictionary';
        document.getElementById('new-client-ar').placeholder = 'Arabic Name (e.g., Nile Co.)';
        document.getElementById('new-client-en').placeholder = 'English Name (e.g., Nile Co.)';
        document.getElementById('btn-save-client').innerText = 'Save & Add';
        document.getElementById('btn-cancel-client').innerText = 'Cancel';

        document.getElementById('res-badge').innerText = 'Instant Analytical Results:';
        document.getElementById('res-label-amount').innerText = 'Amount & Value:';
        document.getElementById('res-label-debit').innerText = 'Debit Side:';
        document.getElementById('res-label-credit').innerText = 'Credit Side:';
        document.getElementById('res-label-statement').innerText = 'Affected Financial Statement:';
        document.getElementById('res-label-subsidiary').innerText = 'Assistant Ledger:';
        document.getElementById('val-subsidiary-ledger').innerText = 'Independent Assistant Ledger for Transactions';
    } else {
        htmlRoot.setAttribute('dir', 'rtl');
        htmlRoot.setAttribute('lang', 'ar');
        body.classList.remove('lang-en');
        if (langBtn) langBtn.innerText = 'EN';

        document.getElementById('widget-launcher-title').innerText = 'المساعد المحاسبي الذكي';
        document.getElementById('modal-header-title-text').innerText = 'المساعد المحاسبي الذكي';
        document.getElementById('welcome-msg-1').innerText = 'مرحبا مع وكيلك الذكى لتسجيل المعاملات المالية';
        
        document.getElementById('txt-local-l1').innerText = 'معاملة مالية';
        document.getElementById('txt-local-l2').innerText = 'محلية بمصر';
        document.getElementById('txt-foreign-l1').innerText = 'معاملة مالية';
        document.getElementById('txt-foreign-l2').innerText = 'بدولة أجنبية';
        document.getElementById('txt-btn-add-client').innerText = 'إضافة عميل';
        
        document.getElementById('welcome-msg-2').innerText = 'اختر الدولة / أدخل المبلغ لعرض ناتج التحويل';
        document.getElementById('amount-input').placeholder = 'المبلغ...';
        document.getElementById('foreign-result-display').placeholder = 'ناتج التحويل...';
        
        document.getElementById('ins-1').innerText = 'أدخل بيان المعاملة المالية شاملا المبلغ وسداده نقدا أم بالبنك أومستحق';
        document.getElementById('ins-2').innerText = 'أكمل بيان أطراف المعاملة المالية وطريقة السداد بعد أدخالك المبلغ';
        
        document.getElementById('new-trans-btn-text').innerText = 'مسح الكل';
        document.getElementById('submit-btn-text').innerText = 'إرسال معاملة إلى التحليل';
        
        document.getElementById('txt-image').innerText = 'جلب صورة';
        document.getElementById('txt-ocr').innerText = 'مسح ضوئي';
        document.getElementById('txt-voice').innerText = 'تسجيل صوتي';

        document.getElementById('modal-client-title').innerText = 'إضافة عميل أو شركة جديدة للقاموس';
        document.getElementById('new-client-ar').placeholder = 'اسم العميل بالعربية (مثال: شركة النيل)';
        document.getElementById('new-client-en').placeholder = 'اسم العميل بالإنجليزية (مثال: Nile Co.)';
        document.getElementById('btn-save-client').innerText = 'حفظ وإضافة';
        document.getElementById('btn-cancel-client').innerText = 'إلغاء';

        document.getElementById('res-badge').innerText = 'النتائج التحليلية الفورية:';
        document.getElementById('res-label-amount').innerText = 'المبلغ والقيمة:';
        document.getElementById('res-label-debit').innerText = 'الجانب المدين:';
        document.getElementById('res-label-credit').innerText = 'الجانب الدائن:';
        document.getElementById('res-label-statement').innerText = 'القائمة المالية المتأثرة:';
        document.getElementById('res-label-subsidiary').innerText = 'الأستاذ المساعد:';
        document.getElementById('val-subsidiary-ledger').innerText = 'الأستاذ المساعد المستقل للمعاملات المالية';
    }
    onCountryChange();
}