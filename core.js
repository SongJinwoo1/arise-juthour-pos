// 1. تحديد نوع النسخة (is_premium)
// true = نسخة الـ Elite الـ 50 ميزة (باشتراك)
// false = النسخة الـ Standard الـ 20 ميزة (تمليك)
const IS_PREMIUM = true; 

// 2. دالة تشغيل التطبيق (Initialization)
document.addEventListener('DOMContentLoaded', () => {
    console.log("إمبراطورية حلول هادئة جاهزة للعمل... 🚀");
    initApp();
});

function initApp() {
    const renderArea = document.getElementById('render-area');
    const adminBtn = document.getElementById('admin-login-btn');

    // مسح شاشة التحميل (Loader)
    renderArea.innerHTML = '';

    if (IS_PREMIUM) {
        // تفعيل ميزات الـ Elite
        renderEliteUI(renderArea);
        adminBtn.classList.remove('hidden'); // إظهار زر الإدارة للأطباء
    } else {
        // تفعيل النسخة العادية
        renderStandardUI(renderArea);
    }
}

// 3. حقن واجهة النسخة العادية برمجياً (Injection)
function renderStandardUI(container) {
    container.innerHTML = `
        <div class="std-form-card">
            <h2>حجز موعد جديد 🌿</h2>
            <p>يرجى إدخال بياناتك للحجز في النسخة الكلاسيكية.</p>
            <input type="text" placeholder="الاسم بالكامل">
            <input type="tel" placeholder="رقم الهاتف">
            <button class="std-btn">تأكيد الحجز</button>
        </div>
    `;
}

// 4. حقن واجهة نسخة الـ Elite (الذكاء الاصطناعي)
function renderEliteUI(container) {
    container.innerHTML = `
        <div class="elite-chat-wrapper">
            <div id="ai-messages" class="messages-area"></div>
            <div class="elite-input-group">
                <input type="text" id="bot-input" placeholder="تحدث مع مساعدك الطبي الذكي...">
                <button id="bot-send">إرسال</button>
            </div>
        </div>
    `;
}
