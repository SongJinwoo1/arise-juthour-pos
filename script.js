// =========================================
// 1. الإعدادات والذاكرة
// =========================================
const is_premium = true; // غيّر لـ false للنسخة العادية
let appointments = JSON.parse(localStorage.getItem('calm_elite_db')) || [];
let chatStep = 0;
let tempPatient = { name: '', phone: '', clinic: '', symptoms: '', priority: 'عادي' };

const display = document.getElementById('display-messages');
const aiInput = document.getElementById('ai-input');
const sendBtn = document.getElementById('send-btn');

// =========================================
// 2. محرك التشغيل (Initialization)
// =========================================
window.onload = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    
    if (is_premium) {
        document.getElementById('premium-tier').classList.remove('hidden');
        document.body.style.backgroundColor = "#0f172a";
        startBot();
    } else {
        document.getElementById('standard-tier').classList.remove('hidden');
        document.body.style.backgroundColor = "#f1f5f9";
    }
};

// =========================================
// 3. ذكاء البوت (Chatbot Engine)
// =========================================
function addBotMsg(text) {
    const div = document.createElement('div');
    div.style.alignSelf = "flex-start";
    div.style.background = "rgba(14, 165, 233, 0.2)";
    div.style.padding = "10px 15px";
    div.style.borderRadius = "15px 15px 15px 0";
    div.style.maxWidth = "85%";
    div.innerHTML = `<b>🤖 المساعد:</b> ${text}`;
    display.appendChild(div);
    display.scrollTop = display.scrollHeight;
}

function addUserMsg(text) {
    const div = document.createElement('div');
    div.style.alignSelf = "flex-end";
    div.style.background = "rgba(255, 255, 255, 0.1)";
    div.style.padding = "10px 15px";
    div.style.borderRadius = "15px 15px 0 15px";
    div.style.maxWidth = "85%";
    div.innerHTML = `👤 ${text}`;
    display.appendChild(div);
}

function startBot() {
    chatStep = 1;
    addBotMsg("مرحباً بك في عيادة حلول هادئة Elite ✨. أنا مساعدك الطبي الذكي. ما هو اسمك الكريم؟");
}

function handleLogic() {
    const val = aiInput.value.trim();
    if (!val) return;
    
    addUserMsg(val);
    aiInput.value = "";

    switch(chatStep) {
        case 1:
            tempPatient.name = val;
            addBotMsg(`أهلاً بك يا ${val}. ممكن تزوّدنا برقم هاتفك للتواصل؟`);
            chatStep = 2;
            break;
        case 2:
            tempPatient.phone = val;
            addBotMsg("تمام. أي قسم حابب تحجز فيه؟ (أسنان، جلدية، طوارئ)");
            chatStep = 3;
            break;
        case 3:
            tempPatient.clinic = val;
            addBotMsg("أخيراً، اوصف لي الأعراض باختصار عشان نحدد الأولوية.");
            chatStep = 4;
            break;
        case 4:
            tempPatient.symptoms = val;
            // خوارزمية فرز الحالات (Triage)
            const urgentWords = ["دم", "نزيف", "ألم شديد", "كسر", "حادث"];
            if (urgentWords.some(w => val.includes(w)) || tempPatient.clinic.includes("طوارئ")) {
                tempPatient.priority = "عاجل 🔴";
            }
            
            // حفظ الموعد النهائي
            const finalData = { ...tempPatient, date: new Date().toLocaleString('ar-KW') };
            appointments.push(finalData);
            localStorage.setItem('calm_elite_db', JSON.stringify(appointments));
            
            addBotMsg(`🎉 تم الحجز بنجاح!<br>القسم: ${tempPatient.clinic}<br>الأولوية: ${tempPatient.priority}<br>سنتصل بك فوراً.`);
            chatStep = 5;
            break;
        default:
            addBotMsg("حجزك مسجل بالفعل، هل تريد شيئاً آخر؟");
    }
}

sendBtn.onclick = handleLogic;
aiInput.onkeypress = (e) => { if(e.key === 'Enter') handleLogic() };

// =========================================
// 4. لوحة الإدارة (Admin Logic)
// =========================================
document.getElementById('admin-trigger').onclick = () => {
    const pass = prompt("الرقم السري للطبيب:");
    if (pass === "1234") {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById('admin-panel').classList.remove('hidden');
        renderAdmin();
    }
};

function renderAdmin() {
    const body = document.getElementById('table-body');
    body.innerHTML = "";
    let urgentCount = 0;

    appointments.forEach(app => {
        if(app.priority.includes("عاجل")) urgentCount++;
        body.innerHTML += `
            <tr>
                <td>${app.name}</td>
                <td>${app.phone}</td>
                <td>${app.clinic}</td>
                <td style="color:${app.priority.includes('عاجل')?'red':'green'}; font-weight:bold">${app.priority}</td>
                <td>${app.date}</td>
            </tr>
        `;
    });
    document.getElementById('total-count').innerText = appointments.length;
    document.getElementById('urgent-count').innerText = urgentCount;
}

// تصدير البيانات
document.getElementById('export-csv').onclick = () => {
    let csv = "\uFEFFالاسم,الهاتف,العيادة,الأولوية,التاريخ\n";
    appointments.forEach(a => {
        csv += `${a.name},${a.phone},${a.clinic},${a.priority},${a.date}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "مواعيد_العيادة.csv");
    link.click();
};

// =========================================
// 5. نظام الأمان (Advanced Security)
// =========================================
document.addEventListener('keydown', (e) => {
    // حماية F12
    if (e.key === "F12") { e.preventDefault(); alert("🔒 النظام مؤمن بالكامل."); }
    
    // وضع التخفي السري (Alt + H)
    if (e.altKey && (e.key === "h" || e.key === "H" || e.key === "ا")) {
        e.preventDefault();
        const cells = document.querySelectorAll('td');
        cells.forEach(c => {
            c.style.filter = (c.style.filter === "blur(8px)") ? "none" : "blur(8px)";
            c.style.transition = "0.3s";
        });
    }
});
