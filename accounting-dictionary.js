// ==========================================================================
// ai-agent-acc - accounting-dictionary.js (القاموس الشامل وإدارة العملاء)
// ==========================================================================

const accountingDictionary = {

    customClientsAndCompanies: {
        "شركة الأفق": { en: "Al-Afaq Company", ar: "شركة الأفق للتجارة" },
        "مؤسسة النور": { en: "Al-Noor Establishment", ar: "مؤسسة النور" },
        "شركة النيل": { en: "Nile Trading Co.", ar: "شركة النيل للتجارة والدعاية" }
    },

    addNewClientDynamic: function(nameAr, nameEn) {
        if (!nameAr || !nameEn) return false;
        this.customClientsAndCompanies[nameAr.trim()] = {
            ar: nameAr.trim(),
            en: nameEn.trim()
        };
        return true;
    },

    terms: {
        "شراء معدات": { en: "Purchase of equipment", debitAr: "حـ/ الأصول الثابتة والمعدات", debitEn: "Debit: Fixed Assets & Equipment" },
        "أجهزة": { en: "Equipment / Devices", debitAr: "حـ/ الأصول الثابتة والمعدات", debitEn: "Debit: Fixed Assets & Equipment" },
        "سيارة": { en: "Car / Vehicle", debitAr: "حـ/ الأصول الثابتة والمعدات", debitEn: "Debit: Fixed Assets & Equipment" },
        "أثاث": { en: "Furniture", debitAr: "حـ/ الأصول الثابتة والمعدات", debitEn: "Debit: Fixed Assets & Equipment" },
        "أصل معنوي": { en: "Intangible Asset", debitAr: "حـ/ الأصول غير المادية (المعنوية)", debitEn: "Debit: Intangible Assets" },
        "شهرة": { en: "Goodwill", debitAr: "حـ/ شهرة المحل (أصل معنوي)", debitEn: "Debit: Goodwill" },
        "إيجار": { en: "Rent", debitAr: "حـ/ المصروفات العمومية والإدارية (إيجار)", debitEn: "Debit: Administrative Expenses (Rent)" },
        "كهرباء": { en: "Electricity", debitAr: "حـ/ المصروفات العمومية (فواتير المرافق)", debitEn: "Debit: General Expenses (Utilities)" },
        "مياه": { en: "Water Bill", debitAr: "حـ/ المصروفات العمومية (فواتير المياه)", debitEn: "Debit: General Expenses (Water)" },
        "فواتير": { en: "Bills", debitAr: "حـ/ المصروفات العمومية والإدارية", debitEn: "Debit: General & Administrative Expenses" },
        "صيانة": { en: "Maintenance", debitAr: "حـ/ مصروفات الصيانة والتشغيل", debitEn: "Debit: Maintenance & Operating Expenses" },
        "رواتب": { en: "Salaries", debitAr: "حـ/ الرواتب والأجور", debitEn: "Debit: Salaries & Wages" },
        "أجور": { en: "Wages", debitAr: "حـ/ الرواتب والأجور", debitEn: "Debit: Salaries & Wages" },
        "تسويق": { en: "Marketing & Advertising", debitAr: "حـ/ مصروفات الدعاية والإعلان والتسويق", debitEn: "Debit: Marketing & Advertising Expenses" },
        "إعلان": { en: "Advertising", debitAr: "حـ/ مصروفات الدعاية والإعلان", debitEn: "Debit: Advertising Expenses" },
        "استشارات": { en: "Consulting Fees", debitAr: "حـ/ مصروفات الاستشارات المهنية", debitEn: "Debit: Professional Consulting Fees" },
        "نقل": { en: "Transportation & Shipping", debitAr: "حـ/ مصروفات النقل والشحن والتوصيل", debitEn: "Debit: Transportation & Shipping Expenses" },
        "مبيعات": { en: "Sales Revenue", debitAr: "حـ/ إيرادات المبيعات", debitEn: "Debit / Credit: Sales Revenue" },
        "خدمات": { en: "Service Revenue", debitAr: "حـ/ إيرادات تقديم الخدمات التدريبية والتقنية", debitEn: "Debit / Credit: Services Revenue" },
        "عمولة": { en: "Commission Revenue", debitAr: "حـ/ إيرادات العمولات والوكالات", debitEn: "Debit / Credit: Commission Revenue" },
        "إيراد متنوع": { en: "Miscellaneous Revenue", debitAr: "حـ/ الإيرادات المتنوعة الأخرى", debitEn: "Debit / Credit: Miscellaneous Revenue" }
    },

    analyzePaymentMethod: function(text, isEnglish) {
        let t = text.toLowerCase();
        
        if (t.includes("إنستاباي") || t.includes("instapay")) {
            if (t.includes("محفظة") || t.includes("رقم")) {
                return isEnglish ? "Credit: E-Wallets via Instapay" : "حـ/ نقدية المحافظ الإلكترونية (عبر إنستاباي)";
            } else {
                return isEnglish ? "Credit: Commercial Bank (via Instapay)" : "حـ/ البنك التجاري (عبر إنستاباي)";
            }
        } else if (t.includes("محفظة") || t.includes("فودافون") || t.includes("كاش") || t.includes("انستا")) {
            return isEnglish ? "Credit: E-Wallets Cash" : "حـ/ نقدية المحافظ الإلكترونية";
        } else if (t.includes("بنك") || t.includes("تحويل") || t.includes("شيك") || t.includes("إيداع")) {
            return isEnglish ? "Credit: Commercial Bank Account" : "حـ/ البنك التجاري";
        } else if (t.includes("مستحق") || t.includes("على الحساب") || t.includes("أجل") || t.includes("دين")) {
            return isEnglish ? "Credit: Accounts Payable" : "حـ/ الدائنون والموردون (أجل / مستحق)";
        } else {
            return isEnglish ? "Credit: Cash in Safe" : "حـ/ خزينة النقدية بالصندوق";
        }
    },

    processTextAnalysis: function(rawText, isEnglish) {
        if (!rawText || !rawText.trim()) return null;
        let text = rawText.trim();
        
        let matchedDebit = isEnglish ? "Debit: General & Administrative Expenses" : "حـ/ المصروفات العمومية والإدارية";
        let translatedText = text;
        let detectedClient = "";

        for (let clientKey in this.customClientsAndCompanies) {
            if (text.includes(clientKey)) {
                let clientObj = this.customClientsAndCompanies[clientKey];
                detectedClient = isEnglish ? clientObj.en : clientObj.ar;
                break;
            }
        }

        for (let key in this.terms) {
            if (text.includes(key)) {
                let item = this.terms[key];
                matchedDebit = isEnglish ? item.debitEn : item.debitAr;
                translatedText = isEnglish ? text.replace(key, item.en) : text;
                break;
            }
        }

        if (detectedClient) {
            matchedDebit = isEnglish ? `Debit: Receivable / Client (${detectedClient})` : `حـ/ العميل / الشركة المخصصة: (${detectedClient})`;
        }

        let matchedCredit = this.analyzePaymentMethod(text, isEnglish);
        
        // استخدام الترجمة الأكاديمية والمهنية الكاملة لمعايير IFRS
        let financialStatement = isEnglish ? "Statement of Financial Position" : "قائمة المركز المالي";

        return {
            translatedStatement: translatedText,
            debit: matchedDebit,
            credit: matchedCredit,
            statement: financialStatement
        };
    }
};