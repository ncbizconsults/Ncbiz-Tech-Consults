/* ============================================================
   MEMBERSHIP ENQUIRY FORM
   Separate from the general Project Inquiry form (js/contact-form.js),
   which is not touched. Uses the same Web3Forms delivery set-up as the
   existing form (same access key and endpoint), so enquiries go to the
   inbox that key is registered to.
   Also preselects the membership package from ?package=visibility |
   authority | not-sure, or from any [data-package] link on the page.
   ============================================================ */
(function () {
  var form = document.getElementById('membership-form');
  if (!form) return;

  var select = document.getElementById('m-package');
  var statusEl = document.getElementById('membership-status');
  var submitBtn = document.getElementById('membership-submit');
  var MAP = { visibility: 'Visibility', authority: 'Authority', 'not-sure': 'Not Sure', notsure: 'Not Sure' };

  function setPackage(key) {
    var v = MAP[String(key || '').toLowerCase()];
    if (v && select) select.value = v;
  }

  // Preselect from the URL (works when arriving from another page or a package button)
  try { setPackage(new URLSearchParams(window.location.search).get('package')); } catch (e) {}

  // Preselect when a package button on this same page is clicked
  document.querySelectorAll('[data-package]').forEach(function (el) {
    el.addEventListener('click', function () { setPackage(el.getAttribute('data-package')); });
  });

  function showStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    statusEl.style.color = isError ? '#e0745c' : 'var(--gold)';
  }

  function fieldError(field, message) {
    var err = document.getElementById(field.id + '-err');
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      if (err) { err.textContent = message; err.style.display = 'block'; }
    } else {
      field.removeAttribute('aria-invalid');
      if (err) { err.textContent = ''; err.style.display = 'none'; }
    }
  }

  function validate() {
    var first = null;
    var checks = [
      ['m-name', function (v) { return v.trim() ? '' : 'Please enter your full name.'; }],
      ['m-business', function (v) { return v.trim() ? '' : 'Please enter your business or organisation.'; }],
      ['m-email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid business email address.'; }],
      ['m-phone', function (v) { return v.replace(/[^0-9]/g, '').length >= 7 ? '' : 'Please enter a phone or WhatsApp number.'; }],
      ['m-package', function (v) { return v ? '' : 'Please choose an option, or select Not Sure.'; }],
      ['m-objective', function (v) { return v.trim() ? '' : 'Please tell us briefly what you would like to achieve.'; }]
    ];
    checks.forEach(function (c) {
      var f = document.getElementById(c[0]);
      var msg = c[1](f.value || '');
      fieldError(f, msg);
      if (msg && !first) first = f;
    });
    if (first) first.focus();
    return !first;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var honeypot = form.querySelector('input[name="botcheck"]');
    if (honeypot && honeypot.checked) return; // bot submission — silently drop

    if (!validate()) { showStatus('Please check the highlighted fields and try again.', true); return; }

    var accessKeyInput = form.querySelector('input[name="access_key"]');
    if (!accessKeyInput || !accessKeyInput.value) {
      showStatus('This form is not fully set up yet — please email info@ncbizconsults.com directly.', true);
      return;
    }

    submitBtn.disabled = true;
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    showStatus('Sending your enquiry…', false);

    var payload = {};
    new FormData(form).forEach(function (value, key) { payload[key] = value; });
    payload.page = window.location.href;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showStatus('Thank you — your membership enquiry has been sent. We’ll be in touch using your preferred contact method. This enquiry is not a membership agreement or a payment commitment.', false);
          form.reset();
          form.querySelectorAll('[aria-invalid]').forEach(function (f) { fieldError(f, ''); });
        } else {
          showStatus('Something went wrong sending your enquiry. Please try again, or email info@ncbizconsults.com directly.', true);
        }
      })
      .catch(function () {
        showStatus('Something went wrong sending your enquiry. Please try again, or email info@ncbizconsults.com directly.', true);
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
  });
})();
