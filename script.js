// --- العناصر الرئيسية ---
const displayArea = document.getElementById('displayArea');
const addBtn = document.getElementById('addBtn');

// --- تحميل الحجوزات عند فتح الصفحة ---
async function loadData() {
    displayArea.innerHTML = '<p class="no-reservations">Veuillez patienter...</p>'; // مؤشر تحميل بسيط
    const res = await fetch('/api/reservations');
    const data = await res.json();
    displayArea.innerHTML = ''; // مسح منطقة العرض

    if (data.length === 0) {
        displayArea.innerHTML = '<p class="no-reservations">Aucune réservation pour le moment.</p>';
    } else {
        // إنشاء واجهة تفاعلية لكل حجز
        data.forEach(item => {
            const reservationItem = `
                <div class="reservation-item">
                    <div class="reservation-details">
                        <h4>🍽️ ${item.nom}</h4>
                        <p>Nombre de convives: <strong>${item.convives}</strong></p>
                    </div>
                    <div class="reservation-meta">
                        <p><strong>${item.date}</strong></p>
                        <p>à <strong>${item.heure}</strong></p>
                    </div>
                </div>
            `;
            displayArea.innerHTML += reservationItem;
        });
    }
}

// --- التعامل مع حدث إضافة حجز جديد ---
addBtn.addEventListener('click', async () => {
    // الحصول على القيم من المدخلات
    const nom = document.getElementById('nom').value;
    const date = document.getElementById('date').value;
    const heure = document.getElementById('heure').value;
    const convives = document.getElementById('convives').value;

    // التحقق من أن جميع المدخلات موجودة (تحقق أساسي)
    if (nom === '' || date === '' || heure === '' || convives === '') {
        alert('Veuillez remplir tous les champs !'); // تنبيه بسيط
        return;
    }

    // إعداد البيانات للإرسال
    const reservation = {
        nom: nom,
        date: date,
        heure: heure,
        convives: convives
    };

    // إرسال البيانات للسيرفر
    addBtn.innerText = 'Envoi...'; // تغيير نص الزر بشكل مؤقت
    addBtn.disabled = true; // تعطيل الزر

    const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservation)
    });

    // استعادة حالة الزر وتحديث الواجهة
    addBtn.innerText = 'Confirmer la Réservation';
    addBtn.disabled = false;

    if (res.status === 201) {
        // تنبيه نجاح (بدلاً من إعادة تحميل الصفحة الكاملة)
        alert('Réservation confirmée pour ' + nom);
        // إعادة تعيين الحقول
        document.getElementById('nom').value = '';
        document.getElementById('date').value = '';
        document.getElementById('heure').value = '';
        document.getElementById('convives').value = '';
        loadData(); // إعادة تحميل البيانات لتحديث القائمة
    } else {
        alert('Une erreur est survenue lors de la réservation.');
    }
});

loadData(); // تحميل البيانات عند بدء التشغيل