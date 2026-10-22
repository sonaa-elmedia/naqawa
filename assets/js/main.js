(function () {
  'use strict';

  var WA_NUMBER = '966559540098';
  var form = document.getElementById('orderForm');
  var errorBox = document.getElementById('formError');
  var header = document.querySelector('.header');

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Header shadow on scroll
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Date: no past dates
  var dateInput = form.elements.date;
  var today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.min = today.toISOString().slice(0, 10);

  // Pre-select package / occasion from CTA buttons
  document.querySelectorAll('[data-package]').forEach(function (el) {
    el.addEventListener('click', function () { form.elements.package.value = el.dataset.package; });
  });
  document.querySelectorAll('[data-occasion]').forEach(function (el) {
    el.addEventListener('click', function () { form.elements.occasion.value = el.dataset.occasion; });
  });

  // Normalize Arabic-Indic digits to Latin
  function toLatin(str) {
    return String(str).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; })
                      .replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 1776; });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var phone = toLatin(f.phone.value).replace(/[^\d+]/g, '');
    var required = [f.name, f.phone, f.package, f.guests, f.date];
    var ok = true;

    required.forEach(function (el) {
      var bad = !String(el.value).trim();
      if (el === f.phone) bad = phone.replace(/\D/g, '').length < 9;
      el.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });

    errorBox.hidden = ok;
    if (!ok) {
      (form.querySelector('.is-invalid') || form).focus();
      return;
    }

    var lines = [
      'السلام عليكم، حاب أطلب عرض سعر لخدمة الكاترنج والطبخ المباشر 🍽️',
      '',
      '• الاسم: ' + f.name.value.trim(),
      '• الجوال: ' + phone,
      '• الباقة: ' + f.package.value,
      f.occasion.value ? '• نوع المناسبة: ' + f.occasion.value : '',
      '• عدد الضيوف: ' + toLatin(f.guests.value),
      '• التاريخ: ' + f.date.value,
      f.location.value.trim() ? '• الموقع: ' + f.location.value.trim() : '',
      f.notes.value.trim() ? '• ملاحظات: ' + f.notes.value.trim() : ''
    ].filter(function (l, i) { return l !== '' || i === 1; });

    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });

  // Clear invalid state on input
  form.addEventListener('input', function (e) { e.target.classList.remove('is-invalid'); });
})();
