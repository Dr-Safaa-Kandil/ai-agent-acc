document.addEventListener('DOMContentLoaded', () => {
    const launcherBtn = document.getElementById('ai-launcher-btn');
    const modalBox = document.getElementById('ai-modal-box');
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const textarea = document.getElementById('manual-tx-textarea');
    const submitTextBtn = document.getElementById('submit-text-tx-btn');
    const resultArea = document.getElementById('result-display-area');
    const calcConvertBtn = document.getElementById('calc-convert-btn');
    const foreignInput = document.getElementById('foreign-amount-input');
    let isArabic = true;

    // فتح وإغلاق النافذة
    launcherBtn.addEventListener('click', () => {
        modalBox.style.display = modalBox.style.display === 'none' ? 'flex' : 'none';
    });

    // أدوات المحرر (نسخ، تراجع، لصق)
    document.getElementById('undo-btn').addEventListener('click', () => { textarea.value = ""; });
    document.getElementById('copy-btn').addEventListener('click', () => { navigator.clipboard.writeText(textarea.value); alert("تم النسخ!"); });
    document.getElementById('paste-btn').addEventListener('click', async () => { textarea.value = await navigator.clipboard.readText(); });

    // حساب وتحويل العملات الأجنبية/الخليجية للجنيه المصري
    calcConvertBtn.addEventListener('click', () => {
        let val = parseFloat(foreignInput.value) || 0;
        let currencySelect = document.getElementById('country-currency-select').value;
        let rate = 1.0;
        if (currencySelect === 'SAU') rate = 13.5; // مثال سعر صرف الريال مقابل الجنيه
        else if (currencySelect === 'ARE') rate = 13.8; // مثال سعر الصرف
        else if (currencySelect === 'USD') rate = 50.5; // مثال سعر صرف الدولار

        let totalEGP = val * rate;
        document.getElementById('res-amount').innerText = totalEGP.toFixed(2);
        resultArea.style.display = 'flex';
    });

    // إرسال النص المكتوب أو محاكاة رسائل الواتساب للمعالجة
    submitTextBtn.addEventListener('click', async () => {
        let textData = textarea.value;
        if (!textData) {
            alert("يرجى كتابة أو لصق نص المعاملة أولاً!");
            return;
        }

        // إرسال البيانات لدالة السيرفرليس لمعالجة المعاملة وتحليلها محاسبياً
        let response = await fetch('/api/process_tx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textData, currency: document.getElementById('country-currency-select').value })
        });
        let result = await response.json();
        
        if(result.status === 'success') {
            document.getElementById('res-amount').innerText = result.data.amount;
            document.getElementById('res-debit').innerText = result.data.debit_account;
            document.getElementById('res-credit').innerText = result.data.credit_account;
            resultArea.style.display = 'flex';
        }
    });

    // تبديل اللغات
    langToggleBtn.addEventListener('click', () => {
        isArabic = !isArabic;
        document.documentElement.lang = isArabic ? 'ar' : 'en';
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
        document.getElementById('launcher-text').innerText = isArabic ? 'المساعد المحاسبي' : 'Accounting Assistant';
        document.getElementById('header-title').innerText = isArabic ? 'الوكيل الذكي للمحاسبة المالية' : 'AI Financial Accounting Agent';
    });
});