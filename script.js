(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const hour = new Date().getHours();
  const isNightTime = hour >= 19 || hour < 7;
  const stored = localStorage.getItem('napped-theme');

  function setTheme(mode) {
    document.body.classList.toggle('night', mode === 'night');
    localStorage.setItem('napped-theme', mode);
  }

  // Initialize theme
  if (stored === 'night' || stored === 'day') {
    setTheme(stored);
  } else {
    setTheme(prefersDark || isNightTime ? 'night' : 'day');
  }

  // Toggle button
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isNight = document.body.classList.contains('night');
      setTheme(isNight ? 'day' : 'night');
      // Ripple-esque feedback on the knob
      try {
        const knob = toggle.querySelector('.knob');
        if (knob) {
          knob.animate([
            { transform: knob.style.transform || 'translateX(0)' },
            { transform: (knob.style.transform || '') + ' scale(0.94)' },
            { transform: knob.style.transform || 'translateX(0)' },
          ], { duration: 220, easing: 'ease-out' });
        }
      } catch (_) {}
    });
  }
  
  // Ensure Twitter embeds render when the script is ready
  (function ensureTwitterEmbedsRender() {
    let triesRemaining = 20;
    const attempt = () => {
      if (window.twttr && window.twttr.widgets && typeof window.twttr.widgets.load === 'function') {
        try { window.twttr.widgets.load(); } catch (_) {}
        return;
      }
      if (--triesRemaining > 0) setTimeout(attempt, 500);
    };
    attempt();
  })();
  
  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || '0s';
        el.style.transitionDelay = delay;
        el.classList.add('is-visible');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));
})();


