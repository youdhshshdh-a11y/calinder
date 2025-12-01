// تعريف العناصر من الصفحة
const grid = document.getElementById("calendarGrid"); // شبكة الأيام
const title = document.getElementById("monthYear");   // عنوان الشهر والسنة
const modal = document.getElementById("eventModal");  // نافذة الحدث المنبثقة
const input = document.getElementById("eventInput");  // حقل إدخال نص الحدث

let date = new Date(), key = ""; // التاريخ الحالي + مفتاح اليوم المحدد لتخزين الحدث

// دالة عرض التقويم
function render() {
  grid.innerHTML = ""; // تفريغ الشبكة قبل إعادة البناء

  const y = date.getFullYear(), m = date.getMonth(); // استخراج السنة والشهر
  const d = new Date(y, m, 1).getDay();              // اليوم الأول من الشهر (0 = الأحد)
  const days = new Date(y, m + 1, 0).getDate();      // عدد أيام الشهر الحالي
  const today = new Date();                          // تاريخ اليوم الحالي

  const monthNames = [                               // أسماء الأشهر بالعربي
    "يناير","فبراير","مارس","أبريل","مايو","يونيو",
    "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
  ];

  title.textContent = `${monthNames[m]} ${y}`;       // عرض اسم الشهر والسنة في العنوان

  // إضافة فراغات قبل أول يوم في الشهر
  [...Array(d)].forEach(() => grid.appendChild(document.createElement("div")));

  // توليد الأيام داخل الشبكة
  for (let i = 1; i <= days; i++) {
    const box = document.createElement("div");       // إنشاء عنصر يوم
    const k = `${y}-${m + 1}-${i}`;                  // مفتاح اليوم لتخزين الحدث في LocalStorage
    box.textContent = i;                             // عرض رقم اليوم داخل العنصر

    if (localStorage[k]) box.classList.add("has-event"); // إذا فيه حدث، نضيف له تنسيق خاص

    if (i === today.getDate() && m === today.getMonth() && y === today.getFullYear()) {
      box.classList.add("today");                    // إذا هو اليوم الحالي، نميّزه بلون خاص
    }

    box.onclick = () => {                            // عند الضغط على اليوم:
      key = k;                                       // نحفظ المفتاح
      input.value = localStorage[k] || "";           // نعرض الحدث الموجود (إن وجد)
      modal.style.display = "flex";                  // نفتح النافذة المنبثقة
    };

    grid.appendChild(box);                           // نضيف اليوم إلى الشبكة
  }
}

// التنقل إلى الشهر السابق
document.getElementById("prevMonth").onclick = () => {
  date.setMonth(date.getMonth() - 1); // نقص الشهر
  render();                           // إعادة عرض التقويم
};

// التنقل إلى الشهر التالي
document.getElementById("nextMonth").onclick = () => {
  date.setMonth(date.getMonth() + 1); // زد الشهر
  render();                           // إعادة عرض التقويم
};

// إغلاق النافذة المنبثقة
document.getElementById("closeModal").onclick = () => modal.style.display = "none";

// حفظ الحدث عند الضغط على زر "حفظ"
document.getElementById("saveEvent").onclick = () => {
  if (input.value.trim())            // إذا فيه نص داخل الحقل
    localStorage[key] = input.value.trim(); // خزّنه في LocalStorage
  else
    localStorage.removeItem(key);   // إذا فارغ، احذف الحدث

  modal.style.display = "none";     // أغلق النافذة
  render();                         // أعد عرض التقويم لتحديث الشكل
};

// حذف الحدث عند الضغط على زر "حذف"
document.getElementById("deleteEvent").onclick = () => {
  localStorage.removeItem(key);     // احذف الحدث من التخزين
  modal.style.display = "none";     // أغلق النافذة
  render();                         // أعد عرض التقويم
};

// إغلاق النافذة عند الضغط خارجها
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

// عرض التقويم عند أول تحميل للصفحة
render();