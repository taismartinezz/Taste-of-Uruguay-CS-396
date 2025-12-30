
(() => {
  const carousel = document.querySelector('.carousel-wrapper');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');
  const thumbs = Array.from(document.querySelectorAll('.thumb'));
  const viewport = document.getElementById('carousel-viewport');

  let current = 0;
  let autoTimer = null;
  const AUTO_MS = 5000;

  function showSlide(index, userTriggered = false) {
    index = (index + slides.length) % slides.length;

    slides.forEach((s, i) => {
      const hidden = i !== index;
      s.setAttribute('aria-hidden', hidden ? 'true' : 'false');
      s.style.opacity = hidden ? '0' : '1';
      s.style.zIndex = hidden ? 1 : 2;
    });

    thumbs.forEach((t, i) => {
      t.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    current = index;

    if (userTriggered || document.activeElement.closest('.carousel-wrapper')) {
      const live =
        document.getElementById('carousel-live') ||
        (() => {
          const div = document.createElement('div');
          div.id = 'carousel-live';
          div.setAttribute('aria-live', 'polite');
          div.className = 'sr-only';
          document.body.appendChild(div);
          return div;
        })();

      const title =
        slides[index].querySelector('.slide-caption')?.textContent ||
        `Slide ${index + 1}`;
      live.textContent = `Slide ${index + 1}: ${title}`;
    }
  }

  function next() {
    showSlide(current + 1, true);
  }
  function prev() {
    showSlide(current - 1, true);
  }

  nextBtn.addEventListener('click', () => {
    next();
    restartAuto();
  });
  prevBtn.addEventListener('click', () => {
    prev();
    restartAuto();
  });

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prev();
      e.preventDefault();
    }
    if (e.key === 'ArrowRight') {
      next();
      e.preventDefault();
    }
  });

  thumbs.forEach((btn) => {
    btn.addEventListener('click', () =>
      showSlide(Number(btn.dataset.index), true)
    );
    btn.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      showSlide(current + 1);
    }, AUTO_MS);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  ['mouseenter', 'focusin'].forEach((evt) =>
    carousel.addEventListener(evt, stopAuto)
  );
  ['mouseleave', 'focusout'].forEach((evt) =>
    carousel.addEventListener(evt, startAuto)
  );

  showSlide(0);
  startAuto();

  const form = document.getElementById('signup-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = form.querySelector('#email').value.trim();
      if (!email) {
        alert('Please provide a valid email address.');
        form.querySelector('#email').focus();
        return;
      }

      const selected = Array.from(
        form.querySelectorAll('input[type="checkbox"]:checked')
      ).map((cb) => cb.value);

      const prefsText =
        selected.length > 0 ? selected.join(', ') : 'no preferences selected';

      alert(
        `Thanks for joining, ${email}!\nYou selected: ${prefsText}. We'll be in touch soon!`
      );

      form.reset();
    });
  }

  [prevBtn, nextBtn, ...thumbs].forEach((el) => {
    el.addEventListener('focus', () => {
      el.setAttribute('aria-describedby', 'carousel-live');
    });
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('show-focus');
    }
  });
})();