// =========================================
// 1. المتغير المحوري (The Core Variable)
// =========================================
// غير هذه القيمة إلى false لتشغيل النسخة العادية التمليك، أو true لتشغيل نسخة Elite
const is_premium = true;

// =========================================
// 2. جلب العناصر من الـ HTML (DOM Elements)
// =========================================
const standardTier = document.getElementById('standard-tier');
const premiumTier = document.getElementById('premium-tier');
const adminPanel = document.getElementById('admin-panel');
const displayMessages = document.getElementById('display-messages');
const aiInput = document.getElementById('ai-input');
const sendBtn = document.getElementById('send-btn');
const dataTable = document.getElementById('data-table');
const adminTrigger = document.getElementById('admin-trigger');

// مصفوفة لتخزين المواعيد (محاكاة لقاعدة البيانات باستخدام التخزين المحلي)
let appointments = JSON.parse(localStorage.getItem('calm_appointments')) || [];

// =========================================
// 3. دالة التهيئة (Initialization)
// =========================================
function initApp() {
    // إخفاء كل حاويات العرض أولاً
    document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));

    if (is_premium) {
        premiumTier.classList.remove('hidden'); // إظهار الزجاجي
        startAIBot(); // تشغيل البوت
        // منع النقر الأيمن كحماية مبدئية
        document.addEventListener('contextmenu', event => event.preventDefault());
    } else {
        standardTier.classList.remove('hidden'); // إظهار الكلاسيكي
    }
}

// =========================================
// 4. النسخة العادية (Standard Submit)
// =========================================
// دالة بسيطة تعمل فقط لو النسخة العادية هي اللي شغالة
window.submitStandard = function() {
    const name = document.getElementById('std-name').value;
    const phone = document.getElementById('std-phone').value;
    if(name.length > 2 && phone.length >= 8) {
        alert('تم الحجز بنجاح بالنسخة الكلاسيكية! سنتواصل معك قريباً.');
    } else {
        alert('يرجى التأكد من إدخال الاسم ورقم الهاتف بشكل صحيح (8 أرقام على الأقل).');
    }
}

// =========================================
// 5. عقل الذكاء الاصطناعي (AI Chatbot)
// =========================================
let chatStep = 0; // آلة الحالة لتتبع مكاننا في المحادثة
let currentPatient = { name: '', phone: '', specialty: '', symptoms: '', priority: 'عادي' };

// دالة لطباعة الرسائل في الشاشة
function appendMsg(sender, text, isError = false) {
    const msgDiv = document.createElement('div');
    msgDiv.style.padding = '10px 15px';
    msgDiv.style.borderRadius = '15px';
    msgDiv.style.maxWidth = '80%';
    msgDiv.style.marginBottom = '10px';
    msgDiv.style.color = '#fff';
    msgDiv.style.lineHeight = '1.5';
    
    if (sender === 'bot') {
        msgDiv.style.background = isError ? 'rgba(220, 53, 69, 0.9)' : 'rgba(14, 165, 233, 0.9)';
        msgDiv.style.alignSelf = 'flex-start';
        msgDiv.style.borderBottomRightRadius = '0';
        msgDiv.innerHTML = `🤖 <b>المساعد:</b> ${text}`;
    } else {
        msgDiv.style.background = 'rgba(255, 255, 255, 0.2)';
        msgDiv.style.alignSelf = 'flex-end';
        msgDiv.style.borderBottomLeftRadius = '0';
        msgDiv.innerHTML = `🧑 <b>أنت:</b> ${text}`;
    }
    displayMessages.appendChild(msgDiv);
    displayMessages.scrollTop = displayMessages.scrollHeight; // التمرير التلقائي للأسفل
}

// دالة لمحاكاة تأخير التفكير للذكاء الاصطناعي
function botTyping(text, delay = 1000, isError = false) {
    aiInput.disabled = true;
    sendBtn.disabled = true;
    setTimeout(() => {
        appendMsg('bot', text, isError);
        aiInput.disabled = false;
        sendBtn.disabled = false;
        aiInput.focus();
    }, delay);
}

// دالة بداية الشات والترحيب
function startAIBot() {
    displayMessages.innerHTML = ''; // تنظيف الشات
    const savedData = localStorage.getItem('calm_patient_memory');
    
    if (savedData) {
        // لو المريض مسجل قبل كده، اسأله لو عاوز يكرر الحجز
        const oldPatient = JSON.parse(savedData);
        botTyping(`أهلاً بعودتك يا ${oldPatient.name}! هل تود حجز موعد جديد في قسم (${oldPatient.specialty})؟ (اكتب: نعم / لا)`);
        chatStep = 99;
    } else {
        botTyping('مرحباً بك في حلول هادئة Elite ✨. أنا مساعدك الرقمي. ما هو اسمك الكريم لكي أبدأ في حجز موعدك؟');
        chatStep = 1;
    }
}

// دالة معالجة ردود المريض
function handleChat() {
    const text = aiInput.value.trim();
    if (!text) return; // لو المربع فاضي متعملش حاجة
    
    appendMsg('user', text); // اظهر رسالة المستخدم
    aiInput.value = ''; // فضي مربع الكتابة

    switch (chatStep) {
        case 1: // خطوة الاسم
            if (text.length < 3) {
                botTyping('الاسم قصير جداً. يرجى إدخال اسمك الحقيقي.', 500, true);
            } else {
                currentPatient.name = text;
                botTyping(`تشرفنا يا ${text}. ما هو رقم هاتفك؟ (8 أرقام على الأقل)`);
                chatStep = 2;
            }
            break;
            
        case 2: // خطوة الهاتف
            if (text.length < 8 || isNaN(text)) {
                botTyping('رقم غير صالح. يرجى إدخال أرقام فقط.', 500, true);
            } else {
                currentPatient.phone = text;
                botTyping('ممتاز. ما هو التخصص الذي ترغب بزيارته؟ (مثال: أسنان، جلدية، أطفال)');
                chatStep = 3;
            }
            break;
            
        case 3: // خطوة التخصص
            currentPatient.specialty = text;
            botTyping('مفهوم. يرجى وصف حالتك أو الأعراض باختصار لمساعدة الطبيب.');
            chatStep = 4;
            break;
            
        case 4: // خطوة الأعراض (خوارزمية الفرز - Triage)
            currentPatient.symptoms = text;
            const urgentKeywords = ['دم', 'نزيف', 'ألم شديد', 'طوارئ', 'كسر', 'حادث'];
            const isUrgent = urgentKeywords.some(kw => text.includes(kw));
            
            if (isUrgent) {
                currentPatient.priority = 'طوارئ 🔴';
                botTyping('الحالة تتطلب تدخلاً سريعاً! تم تصنيفها كـ "طوارئ" وسنقوم بتجهيز العيادة فوراً.', 1000);
            } else {
                botTyping('تم تسجيل الأعراض بشكل آمن. جاري تأكيد الموعد...', 1000);
            }

            // إنهاء الحجز وحفظه في الإدارة
            setTimeout(() => {
                botTyping(`🎉 تم تأكيد حجزك بنجاح! <br>الاسم: ${currentPatient.name} <br>التخصص: ${currentPatient.specialty}`);
                
                // حفظ ذاكرة المريض للمرات القادمة
                localStorage.setItem('calm_patient_memory', JSON.stringify(currentPatient));
                
                // إضافة الموعد لجدول الإدارة
                currentPatient.date = new Date().toLocaleDateString('ar-KW'); // تاريخ اليوم بالكويت
                appointments.push({...currentPatient});
                localStorage.setItem('calm_appointments', JSON.stringify(appointments));
                
                chatStep = 5; // قفل الشات
            }, 2500);
            break;
            
        case 99: // إعادة الحجز السريع
            if (text === 'نعم') {
                const oldPatient = JSON.parse(localStorage.getItem('calm_patient_memory'));
                oldPatient.date = new Date().toLocaleDateString('ar-KW');
                appointments.push({...oldPatient});
                localStorage.setItem('calm_appointments', JSON.stringify(appointments));
                
                botTyping(`تم تجديد حجزك أوتوماتيكياً بنجاح في قسم ${oldPatient.specialty}. نتمنى لك دوام الصحة.`);
                chatStep = 5;
            } else {
                botTyping('حسناً، لنبدأ من جديد. ما هو التخصص الذي تحتاجه هذه المرة؟');
                chatStep = 3; // ارجع لخطوة التخصص
            }
            break;
            
        default:
            botTyping('تم إنجاز الحجز بالفعل. يمكنك التحدث للإدارة لأي استفسار آخر.');
    }
}

// تفعيل زر الإرسال وزر الـ Enter
if(sendBtn) sendBtn.addEventListener('click', handleChat);
if(aiInput) aiInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleChat(); });

// =========================================
// 6. لوحة الإدارة (Admin Dashboard)
// =========================================
if(adminTrigger) {
    adminTrigger.addEventListener('click', () => {
        // كود مرور وهمي للتجربة
        const password = prompt("أدخل كود المرور الخاص بالطبيب (للتجربة اكتب 1234):");
        
        if (password === '1234') {
            // إخفاء كل حاويات العرض وإظهار الإدارة
            document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
            adminPanel.classList.remove('hidden');
            renderTable(); // رسم الجدول
        } else {
            alert('❌ كود خاطئ! تم تسجيل محاولة الدخول غير المصرح بها.');
        }
    });
}

// دالة رسم المواعيد في الجدول
function renderTable() {
    dataTable.innerHTML = `
        <tr>
            <th>التاريخ</th>
            <th>الاسم</th>
            <th>الهاتف</th>
            <th>التخصص</th>
            <th>الأولوية</th>
        </tr>
    `;
    
    if (appointments.length === 0) {
        dataTable.innerHTML += `<tr><td colspan="5" style="text-align:center;">لا يوجد مواعيد مسجلة حتى الآن</td></tr>`;
        return;
    }

    // لفة على كل المواعيد لرسمها
    appointments.forEach(app => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${app.date || '-'}</td>
            <td>${app.name}</td>
            <td>${app.phone}</td>
            <td>${app.specialty}</td>
            <td style="color: ${app.priority.includes('طوارئ') ? 'red' : 'green'}; font-weight: bold;">
                ${app.priority}
            </td>
        `;
        dataTable.appendChild(tr);
    });
}

// دالة تصدير إكسيل (CSV Export)
const exportBtn = document.querySelector('.premium-feature');
if(exportBtn) {
    exportBtn.addEventListener('click', () => {
        if(appointments.length === 0) return alert('لا يوجد مواعيد لتصديرها!');
        
        // تجهيز ملف الـ CSV ووضع صيغة UTF-8 لدعم العربي
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + "التاريخ,الاسم,الهاتف,التخصص,الاعراض,الأولوية\n";
        
        appointments.forEach(app => {
            csvContent += `${app.date},${app.name},${app.phone},${app.specialty},${app.symptoms || '-'},${app.priority}\n`;
        });
        
        // إنشاء رابط وهمي وتنزيل الملف
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "مواعيد_حلول_هادئة.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// =========================================
// 7. تشغيل النظام عند تحميل الصفحة
// =========================================
window.onload = initApp;
