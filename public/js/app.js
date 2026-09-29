document.addEventListener('DOMContentLoaded', () => {
    const launcherBtn = document.getElementById('ai-launcher-btn');
    const modalBox = document.getElementById('ai-modal-box');
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const textarea = document.getElementById('manual-tx-textarea');
    const submitTextBtn = document.getElementById('submit-text-tx-btn');
    const resultArea = document.getElementById('result-display-area');
    const countrySelect = document.getElementById('country-currency-select');
    const foreignInput = document.getElementById('foreign-amount-input');
    const calcConvertBtn = document.getElementById('calc-convert-btn');
    const exchangeRateDisplay = document.getElementById('exchange-rate-display');
    const hiddenFileInput = document.getElementById('hidden-file-input');
    const selectImageBtn = document.getElementById('select-image-btn');
    let isArabic = true;

    // فتح وإغلاق النافذة
    launcherBtn.addEventListener('click', () => {
        modalBox.style.display = modalBox.style.display === 'none' ? 'flex' : 'none';
    });

    // التحكم في حالة الدولة وسعر الصرف اللحظي
    countrySelect.addEventListener('change', (e) => {
        let val = e.target.value;
        if (val === 'EGY') {
            foreignInput.disabled = true;
            foreignInput.value = '';
            exchangeRateDisplay.innerText = 'سعر الصرف اللحظي: محلي (بدون تحويل)';
        } else {
            foreignInput.disabled = false;
            let rate = val === 'USD' ? '50.50' : (val === 'SAU' ? '13.50' : '13.80');
            exchangeRateDisplay.innerText = `سعر الصرف اللحظي: ${rate} جنيه`;
        }
    });

    // تفريغ مساحة النتائج فوراً عند وضع المؤشر أو بدء الإدخال
    const resetResults = () => {
        resultArea.style.display = 'none';
        document.getElementById('res-amount').innerText = '0.00';
        document.getElementById('res-debit').innerText = '--';
        document.getElementById('res-credit').innerText = '--';
        document.getElementById('res-financial-statement').innerText = '--';
        document.getElementById('res-statement-account').innerText = '--';
    };

    textarea.addEventListener('focus', resetResults);
    document.getElementById('record-audio-btn').addEventListener('click', resetResults);
    selectImageBtn.addEventListener('click', () => { resetResults(); hiddenFileInput.click(); });

    // أدوات المحرر النصي
    document.getElementById('undo-btn').addEventListener('click', () => { textarea.value = ""; });
    document.getElementById('delete-all-btn').addEventListener('click', () => { textarea.value = ""; resetResults(); });
    document.getElementById('copy-btn').addEventListener('click', () => { navigator.clipboard.writeText(textarea.value); alert("تم النسخ بنجاح!"); });
    document.getElementById('paste-btn').addEventListener( 'click', async () => { textarea.value = await navigator.clipboard.readText(); });

    // حساب وتحويل العملات الأجنبية للجنيه المصري
    calcConvertBtn.addEventListener('click', () => {
        let val = parseFloat(foreignInput.value) || 0;
        let currency = countrySelect.value;
        let rate = currency === 'USD' ? 50.50 : (currency === 'SAU' ? 13.50 : 13.80);
        let totalEGP = val * rate;
        document.getElementById('res-amount').innerText = totalEGP.toFixed(2);
        resultArea.style.display = 'flex';
    });

    // إرسال النص للمعالجة المحاسبية الفورية
    submitTextBtn.addEventListener('click', async () => {
        let textData = textarea.value;
        if (!textData) {
            alert("يرجى كتابة أو لصق المعاملة المالية أولاً!");
            return;
        }

        let response = await fetch('/api/process_tx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textData, currency: countrySelect.value })
        });
        let result = await response.json();
        
        if(result.status === 'success') {
            document.getElementById('res-amount').innerText = result.data.amount;
            document.getElementById('res-debit').innerText = result.data.debit_account;
            document.getElementById('res-credit').innerText = result.data.credit_account;
            document.getElementById('res-financial-statement').innerText = result.data.financial_statement;
            document.getElementById('res-statement-account').innerText = result.data.statement_account;
            resultArea.style.display = 'flex';
        }
    });

    // تبديل لغات الواجهة
    langToggleBtn.addEventListener('click', () => {
        isArabic = !isArabic;
        document.documentElement.lang = isArabic ? 'ar' : 'en';
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
        document.getElementById('launcher-text').innerText = isArabic ? 'المساعد المحاسبي' : 'Accounting Assistant';
        document.getElementById('header-title').innerText = isArabic ? 'الوكيل الذكي للمحاسبة المالية' : 'AI Financial Accounting Agent';
    });
});