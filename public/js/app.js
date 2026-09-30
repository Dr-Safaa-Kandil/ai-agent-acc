document.addEventListener('DOMContentLoaded', function() {
    const launcherBtn = document.getElementById('ai-launcher-btn');
    const modalBox = document.getElementById('ai-modal-box');
    const submitBtn = document.getElementById('submit-text-tx-btn');
    const textarea = document.getElementById('manual-tx-textarea');
    const resultArea = document.getElementById('result-display-area');
    
    const resAmount = document.getElementById('res-amount');
    const resDebit = document.getElementById('res-debit');
    const resCredit = document.getElementById('res-credit');
    const resFinancial = document.getElementById('res-financial-statement');
    const resStatement = document.getElementById('res-statement-account');
    
    const countrySelect = document.getElementById('country-currency-select');
    const foreignInput = document.getElementById('foreign-amount-input');
    const convertedAmountInput = document.getElementById('res-converted-amount');
    const foreignStatementInput = document.getElementById('foreign-statement-input');
    const calcBtn = document.getElementById('calc-convert-btn');

    // أزرار التحرير العامة المستقلة
    const undoBtn = document.getElementById('undo-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const copyBtn = document.getElementById('copy-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const selectAllBtn = document.getElementById('select-all-btn');

    // 1. فتح وإغلاق النافذة التفاعلية
    if (launcherBtn && modalBox) {
        launcherBtn.addEventListener('click', function() {
            modalBox.style.display = (modalBox.style.display === 'none' || modalBox.style.display === '') ? 'block' : 'none';
        });
    }

    // 2. التحكم الذكي بحقول الدولة والعملة والقيد على خانة مصر
    if (countrySelect && foreignInput && textarea) {
        countrySelect.addEventListener('change', function() {
            if (this.value === 'EGY') {
                foreignInput.disabled = true;
                foreignInput.value = '';
                if (convertedAmountInput) convertedAmountInput.value = '';
                textarea.disabled = false;
                textarea.placeholder = "أكتب هنا المعاملة المالية بمصر موضحا المبلغ بالجنيه المصرى والبيان..";
            } else {
                foreignInput.disabled = false;
                textarea.disabled = true;
                textarea.value = "";
                textarea.placeholder = "مؤمن: تم اختيار دولة أجنبية، استخدم حقل المعاملة الخارجية أدناه..";
            }
        });
    }

    // 3. محرك تحويل العملات بجدول أسعار استقرار معتمد (بدون عرض كلمة لحظي)
    if (calcBtn) {
        calcBtn.addEventListener('click', function() {
            const val = parseFloat(foreignInput.value) || 0;
            const currency = countrySelect.value;
            let rate = 1.0;

            // جدول الأسعار المعتمد وفق استقرار اليوم
            switch (currency) {
                case 'SAU': rate = 13.50; break; // ريال سعودي
                case 'ARE': rate = 13.80; break; // درهم إماراتي
                case 'KWT': rate = 160.00; break; // دينار كويتي
                case 'USD': rate = 50.50; break; // دولار أمريكي
                case 'EUR': rate = 55.00; break; // يورو
                case 'CNY': rate = 7.10; break;  // يوان صيني
                default: rate = 1.0;
            }

            const total = val * rate;
            if (convertedAmountInput) {
                convertedAmountInput.value = total.toFixed(2) + ' جنيه مصري';
            }
        });
    }

    // 4. تفعيل أزرار التحرير العامة المستقلة لتعديل أو مسح النصوص بحرية قبل الإرسال
    let activeField = textarea;
    ['focusin', 'input'].forEach(evt => {
        if (textarea) textarea.addEventListener(evt, () => activeField = textarea);
        if (foreignStatementInput) foreignStatementInput.addEventListener(evt, () => activeField = foreignStatementInput);
    });

    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', () => { if (activeField) activeField.value = ''; });
    }
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (activeField && activeField.value) {
                navigator.clipboard.writeText(activeField.value);
                alert('تم نسخ النص بنجاح.');
            }
        });
    }
    if (pasteBtn) {
        pasteBtn.addEventListener('click', async () => {
            if (activeField) {
                try {
                    const text = await navigator.clipboard.readText();
                    activeField.value += text;
                } catch (e) {
                    alert('تعذر اللصق تلقائياً، يرجى الاستخدام اليدوي.');
                }
            }
        });
    }
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => { if (activeField) activeField.select(); });
    }
    if (undoBtn) {
        undoBtn.addEventListener('click', () => { if (activeField) activeField.value = ''; });
    }

    // 5. زر إرسال المعاملة المالية للتحليل وتفعيل القاموس اللغوي المحاسبي
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            let textContent = '';
            let amount = '0.00';

            // التحقق مما إذا كانت المعاملة محلية أو أجنبية
            if (countrySelect.value === 'EGY') {
                textContent = textarea ? textarea.value.trim() : '';
            } else {
                const convVal = convertedAmountInput ? convertedAmountInput.value : '';
                const stmtVal = foreignStatementInput ? foreignStatementInput.value.trim() : '';
                textContent = `${stmtVal} بقيمة ${convVal}`;
                amount = convVal.replace(/[^0-9.]/g, '');
            }

            if (!textContent) {
                alert('الرجاء إدخال تفاصيل المعاملة المالية أولاً.');
                return;
            }

            // استخراج الأرقام إذا كانت المعاملة محلية
            if (countrySelect.value === 'EGY') {
                const numbers = textContent.match(/\d+(\.\d+)?/g);
                amount = numbers ? numbers[numbers.length - 1] : '0.00';
            }

            // القاموس اللغوي للغة الشائعة (البيع، الشراء، المصروفات، وطرق الدفع)
            let debit = 'حساب المصروفات العامة / المخزون';
            let credit = 'حساب الخزينة / النقدية';
            let statement = 'قائمة المركز المالي وقائمة الدخل';
            let accountRef = 'أستاذ المشتريات والمصروفات العامة';

            const lowerText = textContent.toLowerCase();

            if (lowerText.includes('شراء') || lowerText.includes('اشترى') || lowerText.includes('فاتورة') || lowerText.includes('دفع') || lowerText.includes('صرف')) {
                debit = 'حساب المخزون / الأصول أو المصروفات';
                accountRef = 'دفتر أستاذ الموردين والمشتريات';
                
                if (lowerText.includes('آجل') || lowerText.includes('على الحساب')) {
                    credit = 'حساب الموردين / الدائنون';
                } else if (lowerText.includes('بنك') || lowerText.includes('تحويل')) {
                    credit = 'حساب البنك التجاري';
                } else {
                    credit = 'حساب الخزينة / النقدية بالصندوق';
                }
            } else if (lowerText.includes('بيع') || lowerText.includes('باع') || lowerText.includes('إيراد')) {
                debit = lowerText.includes('آجل') ? 'حساب العملاء (مدينون)' : 'حساب الخزينة / النقدية بالصندوق';
                credit = 'حساب إيرادات المبيعات';
                statement = 'قائمة الدخل وقائمة المركز المالي';
                accountRef = 'دفتر أستاذ العملاء والمبيعات';
            }

            // تعبئة النتائج التحليلية الفورية
            if (resAmount) resAmount.textContent = amount;
            if (resDebit) resDebit.textContent = debit;
            if (resCredit) resCredit.textContent = credit;
            if (resFinancial) resFinancial.textContent = statement;
            if (resStatement) resStatement.textContent = accountRef;

            // إظهار قسم النتائج بصورة فعلية
            if (resultArea) {
                resultArea.style.display = 'block';
            }
        });
    }
});