// تبديل الوضع الداكن والساطع (Theme Toggler)
const themeBtn = document.getElementById('theme-toggler');
const htmlTag = document.documentElement;

themeBtn.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // تغيير السمة في الـ HTML
    htmlTag.setAttribute('data-theme', newTheme);
    
    // حفظ التفضيل في ذاكرة المتصفح (localStorage)
    localStorage.setItem('calm-theme', newTheme);
});

// استعادة الثيم المفضل عند فتح الموقع
const savedTheme = localStorage.getItem('calm-theme');
if (savedTheme) {
    htmlTag.setAttribute('data-theme', savedTheme);
}
