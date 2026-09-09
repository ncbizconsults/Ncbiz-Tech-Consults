/* ============================================================
   PROJECT INQUIRY FORM — email delivery via Web3Forms
   ============================================================
   Web3Forms lets a static site (no custom backend) deliver form
   submissions straight to an inbox. It was chosen over
   alternatives because:
   - Netlify Forms only works on Netlify hosting (this site is on Vercel)
   - Formspree/EmailJS work too, but require a full account signup
   - Web3Forms only needs an email-verified "access key" — faster
     to set up, free tier is generous, no backend code required

   SETUP (one-time, ~2 minutes) — do this yourself, not through chat:
   1. Go to https://web3forms.com
   2. Enter info@ncbizconsults.com and click "Create Access Key"
   3. Check that inbox and confirm the verification email
   4. Copy the access key you're given
   5. Paste it as the value of the hidden "access_key" input in
      contact.html (search for name="access_key")

   Until that key is added, the form will show a clear error
   instead of silently failing or pretending to succeed.
   ============================================================ */
(function () {
  var form = document.getElementById('inquiry-form');
  if (!form) return;

  var statusEl = document.getElementById('inquiry-status');
  var submitBtn = document.getElementById('inquiry-submit');

  function showStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    statusEl.style.color = isError ? '#e0745c' : 'var(--gold)';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var accessKeyInput = form.querySelector('input[name="access_key"]');
    if (!accessKeyInput || !accessKeyInput.value) {
      showStatus('This form is not fully set up yet — please reach out via WhatsApp or phone above instead, or email info@ncbizconsults.com directly.', true);
      return;
    }

    var honeypot = form.querySelector('input[name="botcheck"]');
    if (honeypot && honeypot.checked) return; // bot submission — silently drop

    submitBtn.disabled = true;
    var originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    showStatus('Sending your enquiry…', false);

    var formData = new FormData(form);
    var payload = {};
    formData.forEach(function (value, key) { payload[key] = value; });

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          showStatus('Thank you — your enquiry has been sent. We\'ll be in touch shortly.', false);
          form.reset();
        } else {
          showStatus('Something went wrong sending your enquiry. Please try WhatsApp or phone above, or email info@ncbizconsults.com directly.', true);
        }
      })
      .catch(function () {
        showStatus('Something went wrong sending your enquiry. Please try WhatsApp or phone above, or email info@ncbizconsults.com directly.', true);
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
  });
})();
