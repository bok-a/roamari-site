/* Roamari — site script (menu, booking form, quick availability bar) */
(function () {
  /* ===== EDIT HERE ===== */
  var SITE = {
    web3formsKey: "e84d14a2-3d21-4f42-88ff-c85c09f81296",   // Web3Forms access key (public, send-only). Bookings go to the form's recipient email.
    formEndpoint: ""    // alternative: a Formspree endpoint, e.g. "https://formspree.io/f/xxxx"
  };
  /* ===================== */

  var base = document.body.getAttribute('data-base') || '';

  // mobile menu
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-toggle-nav]');
    if (t) { var open = document.body.classList.toggle('nav-open'); t.setAttribute('aria-expanded', open); }
    var a = e.target.closest('.nav a, header nav a');
    if (a) document.body.classList.remove('nav-open');
  });

  // quick availability bar (home) → booking form, carrying the choices
  var q = document.getElementById('quick');
  if (q) q.addEventListener('submit', function (e) {
    e.preventDefault();
    var g = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
    var qs = new URLSearchParams({ stay: g('q-stay'), in: g('q-in'), out: g('q-out'), g: g('q-g') });
    location.href = base + 'stay-with-us/?' + qs.toString() + '#reserve';
  });

  var f = document.getElementById('enquiry');
  if (!f) return;
  var $ = function (id) { return document.getElementById(id); };
  var today = new Date().toISOString().slice(0, 10);
  var inp = $('f-in'), out = $('f-out');
  inp.min = today; out.min = today;
  inp.addEventListener('change', function () { if (inp.value) { out.min = inp.value; if (out.value && out.value <= inp.value) out.value = ''; } });

  // prefill from the quick bar
  var P = new URLSearchParams(location.search);
  if (P.get('stay')) $('f-stay').value = P.get('stay');
  if (P.get('in') && P.get('in') >= today) inp.value = P.get('in');
  if (P.get('out') && P.get('out') > (inp.value || today)) out.value = P.get('out');
  if (P.get('g')) $('f-guests').value = P.get('g');

  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var err = $('f-err'), done = $('f-done'), btn = f.querySelector('.f-submit');
    var v = function (id) { return $(id).value.trim(); };
    var problem = '';
    if (!v('f-in') || !v('f-out')) problem = 'Add your check-in and check-out dates.';
    else if (v('f-out') <= v('f-in')) problem = 'Check-out needs to be after check-in.';
    else if (!v('f-name')) problem = 'Add your name so we know who to reply to.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('f-email'))) problem = 'Add an email address we can reply to.';
    else if (!$('f-consent').checked) problem = 'Tick the box so we can use your details to reply.';
    if (problem) { err.textContent = problem; err.hidden = false; return; }
    err.hidden = true;
    var nights = Math.round((new Date(v('f-out')) - new Date(v('f-in'))) / 864e5);
    var summary = v('f-stay') + ', ' + v('f-in') + ' to ' + v('f-out') + ' (' + nights + ' night' + (nights === 1 ? '' : 's') + '), ' + v('f-guests') + ' guest' + (v('f-guests') === '1' ? '' : 's') + ($('f-car').checked ? ', with the hybrid vehicle' : '');
    function ok() { done.innerHTML = '<strong>Thank you. Your request is with us.</strong> We\'ll reply to ' + v('f-email') + ' with availability and a price.'; done.hidden = false; f.reset(); btn.disabled = false; btn.textContent = 'Check Dates'; }
    function fail() { err.textContent = 'That didn\'t send. Please try again in a moment.'; err.hidden = false; btn.disabled = false; btn.textContent = 'Check Dates'; }
    if (f.botcheck && f.botcheck.checked) { ok(); return; }            // spam trap
    if (!SITE.web3formsKey && !SITE.formEndpoint) {
      done.innerHTML = '<strong>The booking form isn\'t connected yet.</strong> Add the Web3Forms key in site.js to start receiving requests.';
      done.hidden = false; return;
    }
    var data = new FormData(f), url = SITE.formEndpoint;
    data.delete('botcheck');
    if (SITE.web3formsKey) {
      url = 'https://api.web3forms.com/submit';
      data.append('access_key', SITE.web3formsKey);
      data.append('subject', 'Booking request: ' + summary);
      data.append('from_name', 'Roamari website');
    }
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(url, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === false) throw 0; ok(); }); })
      .catch(fail);
  });
})();
