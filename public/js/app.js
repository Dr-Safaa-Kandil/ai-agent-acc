// إدارة تفاعلات واجهة المساعد الذكي وتبديل اللغات
document.addEventListener('DOMContentLoaded', () => {
    const launcherBtn = document.getElementById('ai-launcher-btn');
    const modalBox = document.getElementById('ai-modal-box');
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    let isArabic = true;

    // فتح وإغلاق النافذة وتحريك الترحيب للأسفل
    launcherBtn.addEventListener('click', () => {
        if (modalBox.style.display === 'none') {
            modalBox.style.display = 'flex';
        } else {
            modalBox.style.display = 'none';
        }
    });

    // زر التبديل بين اللغات (عربي / إنجليزي)
    langToggleBtn.addEventListener('click', () => {
        isArabic = !isArabic;
        document.documentElement.lang = isArabic ? 'ar' : 'en';
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
        document.getElementById('launcher-text').innerText = isArabic ? 'المساعد المحاسبي' : 'Accounting Assistant';
        document.getElementById('header-title').innerText = isArabic ? 'الوكيل الذكي للمحاسبة المالية' : 'AI Financial Accounting Agent';
    });
});