/* ============================================================
   REUSABLE INTERACTIVE TOOL — "Which channel is right for my business?"
   ============================================================
   Mount anywhere with: <div class="social-tool" data-variant="a|b|c"></div>
   Renders one of three headline/copy variants but shares identical
   logic, styling and scoring everywhere it appears.
   ============================================================ */
(function () {
  var VARIANTS = {
    a: {
      headline: 'Which Social Media Should I Use for My Business?',
      sub: 'Facebook, Instagram, TikTok, WhatsApp or Google? Answer 5 quick questions and we\'ll show you where we\'d start.',
      button: 'Find Out'
    },
    b: {
      headline: 'Where Should I Market My Business Online?',
      sub: 'You don\'t need to be everywhere. Tell us about your business and we\'ll show you where we\'d start.',
      button: 'Show Me Where to Start'
    },
    c: {
      headline: 'Which One Is Right for My Business?',
      sub: 'Facebook, Instagram, TikTok, WhatsApp or Google? Answer 5 quick questions and find out.',
      button: 'Find Out'
    }
  };

  var QUESTIONS = [
    {
      q: 'What type of business do you do?',
      key: 'type',
      options: ['Restaurant / Takeaway', 'Shop / Retail', 'Fashion', 'Beauty', 'Hotel / Accommodation', 'Tourism / Safari', 'Professional Services', 'Lawyer / Law Firm', 'Real Estate', 'School / Education', 'Construction / Hardware', 'B2B / Business Services', 'Other']
    },
    {
      q: 'Where do you serve your customers?',
      key: 'area',
      options: ['Mostly around my area', 'In my town / city', 'Across Uganda', 'Outside Uganda', 'Online / anywhere']
    },
    {
      q: 'What do you want the internet to do for your business?',
      key: 'goal',
      options: ['Help more people know my business', 'Bring me more customers', 'Help me make more sales', 'Bring me enquiries / leads', 'Help people find my business', 'Send people to my WhatsApp', 'Send people to my website', 'Build trust in my business']
    },
    {
      q: 'How do people usually find your business today?',
      key: 'current',
      options: ['Word of mouth', 'Google / Google Maps', 'WhatsApp', 'Facebook', 'Instagram', 'TikTok', 'From my physical location', 'Other', 'I\'m not sure']
    },
    {
      q: 'Who are you trying to reach?',
      key: 'audience',
      options: ['People near my business', 'People across Uganda', 'Young people', 'Families', 'Working professionals', 'Other businesses', 'Tourists / international customers', 'Students', 'A specific type of customer', 'Anyone who needs what I sell']
    }
  ];

  var CHANNEL_INFO = {
    google: { name: 'Google / Google Business Profile', why: 'useful when people need to find a local business — especially through Google Search and Google Maps.', link: 'services/google-business-profile', linkText: 'Learn more about Google Business Profile' },
    website: { name: 'A website', why: 'useful for giving people detailed information, building trust, and turning interest into an actual enquiry or sale.', link: 'services/website-development', linkText: 'Learn more about Website Development' },
    whatsapp: { name: 'WhatsApp', why: 'useful for direct conversations, quick questions, and closing enquiries one-on-one.', link: 'services/digital-marketing', linkText: 'Learn more about Digital Marketing' },
    instagram: { name: 'Instagram', why: 'useful for visually presenting products, food, fashion or beauty work.', link: 'services/digital-marketing', linkText: 'Learn more about Digital Marketing' },
    tiktok: { name: 'TikTok', why: 'useful for discovery and reaching people through short, engaging video.', link: 'services/digital-marketing', linkText: 'Learn more about Digital Marketing' },
    facebook: { name: 'Facebook', why: 'useful for reach, community and staying visible to a broad local audience.', link: 'services/digital-marketing', linkText: 'Learn more about Digital Marketing' }
  };

  function score(answers) {
    var s = { google: 0, website: 0, whatsapp: 0, instagram: 0, tiktok: 0, facebook: 0 };

    var typeMap = {
      'Restaurant / Takeaway': ['instagram', 'whatsapp', 'facebook'],
      'Shop / Retail': ['instagram', 'facebook', 'whatsapp'],
      'Fashion': ['instagram', 'tiktok'],
      'Beauty': ['instagram', 'tiktok', 'whatsapp'],
      'Hotel / Accommodation': ['website', 'google', 'instagram'],
      'Tourism / Safari': ['website', 'instagram', 'google'],
      'Professional Services': ['website', 'google'],
      'Lawyer / Law Firm': ['website', 'google'],
      'Real Estate': ['website', 'facebook', 'google'],
      'School / Education': ['website', 'facebook', 'google'],
      'Construction / Hardware': ['website', 'google'],
      'B2B / Business Services': ['website', 'google'],
      'Other': ['website', 'google']
    };
    (typeMap[answers.type] || []).forEach(function (c, i) { s[c] += (3 - i); });

    if (answers.area === 'Mostly around my area' || answers.area === 'In my town / city') { s.google += 3; s.facebook += 1; }
    if (answers.area === 'Across Uganda' || answers.area === 'Outside Uganda' || answers.area === 'Online / anywhere') { s.website += 2; s.instagram += 1; s.tiktok += 1; }

    var goalMap = {
      'Help more people know my business': ['facebook', 'tiktok', 'instagram'],
      'Bring me more customers': ['google', 'website'],
      'Help me make more sales': ['website', 'whatsapp', 'instagram'],
      'Bring me enquiries / leads': ['website', 'whatsapp', 'google'],
      'Help people find my business': ['google', 'website'],
      'Send people to my WhatsApp': ['whatsapp'],
      'Send people to my website': ['website'],
      'Build trust in my business': ['website', 'google']
    };
    (goalMap[answers.goal] || []).forEach(function (c) { s[c] += 2; });

    var currentMap = { 'Google / Google Maps': 'google', 'WhatsApp': 'whatsapp', 'Facebook': 'facebook', 'Instagram': 'instagram', 'TikTok': 'tiktok' };
    if (currentMap[answers.current]) s[currentMap[answers.current]] += 1;
    if (answers.current === 'I\'m not sure' || answers.current === 'Word of mouth') { s.google += 2; s.website += 1; }

    var audienceMap = {
      'People near my business': ['google', 'facebook'],
      'People across Uganda': ['website', 'facebook'],
      'Young people': ['tiktok', 'instagram'],
      'Families': ['facebook', 'whatsapp'],
      'Working professionals': ['website', 'google'],
      'Other businesses': ['website', 'google'],
      'Tourists / international customers': ['website', 'instagram'],
      'Students': ['tiktok', 'instagram'],
      'A specific type of customer': ['website'],
      'Anyone who needs what I sell': ['google', 'facebook']
    };
    (audienceMap[answers.audience] || []).forEach(function (c) { s[c] += 2; });

    return s;
  }

  function topChannels(s) {
    return Object.keys(s).sort(function (a, b) { return s[b] - s[a]; }).slice(0, 3).filter(function (c) { return s[c] > 0; });
  }

  function render(mount) {
    var variant = VARIANTS[mount.getAttribute('data-variant')] || VARIANTS.a;
    var answers = {};
    var step = 0;

    mount.innerHTML =
      '<div class="social-tool-card">' +
        '<div class="social-tool-intro">' +
          '<h3>' + variant.headline + '</h3>' +
          '<p>' + variant.sub + '</p>' +
          '<button type="button" class="btn-primary social-tool-start">' + variant.button + '</button>' +
        '</div>' +
        '<div class="social-tool-flow" style="display:none;"></div>' +
      '</div>';

    var intro = mount.querySelector('.social-tool-intro');
    var flow = mount.querySelector('.social-tool-flow');
    var startBtn = mount.querySelector('.social-tool-start');

    function renderStep() {
      if (step >= QUESTIONS.length) return renderResult();
      var q = QUESTIONS[step];
      var dots = QUESTIONS.map(function (_, i) {
        return '<span class="social-tool-dot' + (i === step ? ' is-active' : '') + (i < step ? ' is-done' : '') + '"></span>';
      }).join('');
      flow.innerHTML =
        '<div class="social-tool-dots">' + dots + '</div>' +
        '<p class="social-tool-q">' + q.q + '</p>' +
        '<div class="social-tool-options">' +
          q.options.map(function (opt) { return '<button type="button" class="social-tool-opt" data-value="' + opt.replace(/"/g, '&quot;') + '">' + opt + '</button>'; }).join('') +
        '</div>';

      flow.querySelectorAll('.social-tool-opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          answers[q.key] = btn.getAttribute('data-value');
          step++;
          renderStep();
        });
      });
    }

    function renderResult() {
      var s = score(answers);
      var top = topChannels(s);
      if (!top.length) top = ['google', 'website'];

      flow.innerHTML =
        '<p class="social-tool-result-label">Here\'s where we\'d start</p>' +
        '<div class="social-tool-results">' +
          top.map(function (c) {
            var info = CHANNEL_INFO[c];
            return '<div class="social-tool-result-item">' +
              '<h4>' + info.name + '</h4>' +
              '<p>' + info.why + '</p>' +
              '<a href="' + info.link + '">' + info.linkText + ' →</a>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<button type="button" class="social-tool-restart">Start again</button>';

      flow.querySelector('.social-tool-restart').addEventListener('click', function () {
        answers = {}; step = 0; renderStep();
      });
    }

    startBtn.addEventListener('click', function () {
      intro.style.display = 'none';
      flow.style.display = 'block';
      renderStep();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.social-tool').forEach(render);
  });
})();
