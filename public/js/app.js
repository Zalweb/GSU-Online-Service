/**
 * GSU Online Services – Frontend Form Logic
 * Handles client-side validation and form submission via fetch API.
 * Only runs on pages that contain #requestForm.
 */

(function () {
  'use strict';

  const form = document.getElementById('requestForm');
  if (!form) return; // Exit if not on the request page

  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn__text');
  const btnLoader = submitBtn.querySelector('.btn__loader');

  // ─── Toast Helper ─────────────────────────────────────────────
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast is-visible toast--' + type;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4000);
  }

  // ─── Validation ───────────────────────────────────────────────
  function validateField(id, value, rules) {
    const errorEl = document.getElementById(id + 'Error');
    const inputEl = document.getElementById(id);

    for (const rule of rules) {
      if (!rule.test(value)) {
        errorEl.textContent = rule.msg;
        inputEl.classList.add('is-invalid');
        return false;
      }
    }

    errorEl.textContent = '';
    inputEl.classList.remove('is-invalid');
    return true;
  }

  function validateForm() {
    const data = Object.fromEntries(new FormData(form));
    let valid = true;

    valid = validateField('fullName', data.fullName, [
      { test: v => v && v.trim().length > 0, msg: 'Full name is required.' },
      { test: v => v.trim().length >= 2, msg: 'Name must be at least 2 characters.' },
    ]) && valid;

    valid = validateField('studentId', data.studentId, [
      { test: v => v && v.trim().length > 0, msg: 'Student/Employee ID is required.' },
    ]) && valid;

    valid = validateField('email', data.email, [
      { test: v => v && v.trim().length > 0, msg: 'Email is required.' },
      { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email.' },
    ]) && valid;

    valid = validateField('serviceType', data.serviceType, [
      { test: v => v && v.length > 0, msg: 'Please select a request type.' },
    ]) && valid;

    valid = validateField('submissionDate', data.submissionDate, [
      { test: v => v && v.length > 0, msg: 'Submission date is required.' },
    ]) && valid;

    valid = validateField('description', data.description, [
      { test: v => v && v.trim().length > 0, msg: 'Description is required.' },
      { test: v => v.trim().length >= 10, msg: 'Please provide at least 10 characters.' },
    ]) && valid;

    return valid;
  }

  // ─── Real-time Validation ─────────────────────────────────────
  form.querySelectorAll('.form__input').forEach(input => {
    input.addEventListener('blur', () => validateForm());
  });

  // ─── Submit Handler ───────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // UI: loading state
    submitBtn.disabled = true;
    btnText.hidden = true;
    btnLoader.hidden = false;

    const payload = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        showToast('✅ ' + (result.message || 'Request submitted successfully!'), 'success');
        form.reset();
        // Reset date to today
        document.getElementById('submissionDate').valueAsDate = new Date();
        // Clear validation styles
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        form.querySelectorAll('.form__error').forEach(el => (el.textContent = ''));
      } else {
        showToast('❌ ' + (result.error || 'Submission failed. Please try again.'), 'error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      showToast('❌ Network error. Please check your connection.', 'error');
    } finally {
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnLoader.hidden = true;
    }
  });
})();
