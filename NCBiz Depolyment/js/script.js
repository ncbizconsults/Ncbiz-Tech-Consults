// ============================================================
// NCBIZ CONSULTS — CORE SCRIPT
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Pre-fill Contact form service dropdown from ?service= URL parameter ---- */
  var serviceSelect = document.getElementById('f-service');
  if (serviceSelect) {
    var params = new URLSearchParams(window.location.search);
    var requested = params.get('service');
    if (requested) {
      // Map specific sub-service/package slugs up to their parent dropdown category
      var parentMap = {
        'basic-website':'website-development','standard-website':'website-development',
        'premium-website':'website-development','web-application':'website-development',
        'google-business-profile':'seo-google-visibility',
        'facebook-marketing':'digital-marketing','instagram-marketing':'digital-marketing',
        'tiktok-marketing':'digital-marketing','linkedin-marketing':'digital-marketing',
        'email-marketing':'digital-marketing','online-advertising':'digital-marketing',
        'marketplace-marketing':'digital-marketing',
        'ecommerce-website':'ecommerce','online-store':'ecommerce','online-selling-strategy':'ecommerce',
        'social-media-graphics':'graphics-advertising','digital-brand-assets':'graphics-advertising',
        'campaign-visuals':'graphics-advertising','advertising-creatives':'graphics-advertising',
        'application-redesign':'application-development'
      };
      var targetValue = parentMap[requested] || requested;
      var matched = false;
      for (var i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value === targetValue) {
          serviceSelect.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched) {
        for (var j = 0; j < serviceSelect.options.length; j++) {
          if (serviceSelect.options[j].value === 'other') { serviceSelect.selectedIndex = j; break; }
        }
      }
    }
  }

  /* ---- Services dropdown (desktop) — click/keyboard support alongside hover ---- */
  var ddWrap = document.querySelector('.nav-item-dropdown');
  if (ddWrap) {
    var ddTrigger = ddWrap.querySelector('a');
    ddTrigger.addEventListener('click', function (e) {
      // Only intercept as a toggle on devices where hover isn't available (touch);
      // on hover-capable desktops the link still navigates normally on click.
      if (window.matchMedia('(hover: none)').matches) {
        e.preventDefault();
        var isOpen = ddWrap.classList.toggle('dd-open');
        ddTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
    document.addEventListener('click', function (e) {
      if (!ddWrap.contains(e.target)) {
        ddWrap.classList.remove('dd-open');
        ddTrigger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ddWrap.classList.contains('dd-open')) {
        ddWrap.classList.remove('dd-open');
        ddTrigger.setAttribute('aria-expanded', 'false');
        ddTrigger.focus();
      }
    });
  }

  /* ---- Mobile nav ---- */
  var burger = document.querySelector('.nav-burger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.setAttribute('aria-expanded', 'false');
    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
      burger.setAttribute('aria-expanded', 'false');
    }
    burger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        var firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
        burger.focus();
      }
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) openItem.classList.remove('open');
      });
      item.classList.toggle('open', !wasOpen);
    });
  });

  /* ---- Featured Work carousel: auto-advance + dot navigation ---- */
  var portTrack = document.querySelector('.port-carousel-track');
  var portDots = document.querySelectorAll('.port-carousel-dot');
  if (portTrack && portDots.length) {
    var portCards = portTrack.querySelectorAll('.port-card');
    var portIndex = 0;
    var portTimer = null;

    function cardsPerView() {
      var w = window.innerWidth;
      if (w >= 980) return 3;
      if (w >= 640) return 2;
      return 1;
    }

    function maxIndex() {
      return Math.max(0, portCards.length - cardsPerView());
    }

    function goToPortSlide(i) {
      var max = maxIndex();
      portIndex = Math.max(0, Math.min(i, max));
      var card = portCards[0];
      var cardWidth = card.getBoundingClientRect().width;
      var gap = 18;
      var offset = portIndex * (cardWidth + gap);
      portTrack.style.transform = 'translateX(-' + offset + 'px)';
      portDots.forEach(function (dot, idx) {
        dot.classList.toggle('is-active', idx === portIndex);
      });
    }

    portDots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        goToPortSlide(idx);
        resetPortTimer();
      });
    });

    function advancePortSlide() {
      var next = portIndex + 1;
      if (next > maxIndex()) next = 0;
      goToPortSlide(next);
    }

    function resetPortTimer() {
      if (portTimer) clearInterval(portTimer);
      if (!prefersReducedMotion) {
        portTimer = setInterval(advancePortSlide, 4200);
      }
    }

    window.addEventListener('resize', function () { goToPortSlide(portIndex); });
    goToPortSlide(0);
    resetPortTimer();
  }

  /* ---- Hero stats: count-up on load + sequential active-card highlight ---- */
  var heroStatCards = document.querySelectorAll('.hero-stat-card');

  if (heroStatCards.length) {
    // Count-up effect for numeric stats ("8" and "4"); UG gets a fade/reveal instead
    heroStatCards.forEach(function (card, idx) {
      var numEl = card.querySelector('.hero-stat-num');
      if (!numEl) return;
      var raw = numEl.textContent.trim();
      var target = parseInt(raw, 10);
      var isPureNumber = !isNaN(target) && String(target) === raw;

      if (isPureNumber && !prefersReducedMotion) {
        var current = 0;
        numEl.textContent = '0';
        var countInterval = setInterval(function () {
          current++;
          numEl.textContent = current;
          if (current >= target) clearInterval(countInterval);
        }, 130);
      } else if (!prefersReducedMotion) {
        // Non-numeric stat (e.g. "UG"): subtle fade/reveal instead of counting
        numEl.style.opacity = '0';
        numEl.style.transition = 'opacity .7s ease';
        setTimeout(function () { numEl.style.opacity = '1'; }, 200 + idx * 80);
      }
    });

    // Sequential active-card highlight: card 1 -> 2 -> 3 -> repeat
    if (!prefersReducedMotion) {
      var activeIndex = 0;
      function cycleActiveStat() {
        heroStatCards.forEach(function (card) { card.classList.remove('is-active'); });
        heroStatCards[activeIndex].classList.add('is-active');
        activeIndex = (activeIndex + 1) % heroStatCards.length;
      }
      cycleActiveStat();
      setInterval(cycleActiveStat, 2600);
    }
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Active nav link highlight (based on current page) ---- */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu > a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});

/* ---- Event tracking helper (safe to call before GA4 loads) ---- */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
function trackEvent(name, params) {
  if (typeof gtag !== 'undefined') gtag('event', name, params || {});
}

/* ---- GA4 measurement ID — NOT YET CONFIRMED ----
   No analytics script loads until a verified ID is supplied.
   To activate: set GA_MEASUREMENT_ID below to the confirmed ID,
   nothing else in this file needs to change. */
var GA_MEASUREMENT_ID = null; // e.g. 'G-XXXXXXXXXX' once confirmed

function loadGA4() {
  if (!GA_MEASUREMENT_ID) return; // tracking calls above still work locally, just don't send anywhere
  var s = document.createElement('script');
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  s.async = true;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}
if (document.readyState === 'complete') {
  loadGA4();
} else {
  window.addEventListener('load', loadGA4);
}
