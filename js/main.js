/**
 * Moqawel Kuwait - Minimal JavaScript
 * Lightweight, zero dependencies, accessible FAQ accordion & Google Ads call click helper.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accessible FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close other open FAQ items (optional accordion behavior)
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const btn = other.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 2. Google Ads Conversion Tracking (Phone Calls Only)
  const GOOGLE_ADS_CONVERSION_TARGET = 'AW-18406219764/7nr4CIbgz_0cEPS_4shE';

  function reportConversion(eventLabel) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': GOOGLE_ADS_CONVERSION_TARGET,
        'event_category': 'Contact Lead',
        'event_label': eventLabel
      });
      console.log('Google Ads conversion reported:', eventLabel);
    }
  }

  // Detects clicks on phone links (delegated or dynamic)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="tel:"]');
    if (link) {
      reportConversion('Phone Call Click');
    }
  });

  // 3. Decorations & Painting Carousel
  const track = document.getElementById('decorCarouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const counterCurrent = document.getElementById('carouselCounterCurrent');
  const dotsContainer = document.getElementById('carouselDots');
  const slides = track ? Array.from(track.querySelectorAll('.carousel-slide')) : [];

  if (track && slides.length > 0) {
    let currentIndex = 0;
    let autoplayTimer = null;

    // Create dot buttons
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot${idx === 0 ? ' active' : ''}`;
        dot.setAttribute('type', 'button');
        dot.setAttribute('aria-label', `الانتقال إلى الصورة ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];

    function updateActiveState(index) {
      currentIndex = index;
      if (counterCurrent) {
        counterCurrent.textContent = index + 1;
      }
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
    }

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;
      slides[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
      updateActiveState(currentIndex);
    }

    if (prevBtn) {
      // In RTL: Prev button moves backwards
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoplay();
      });
    }

    if (nextBtn) {
      // In RTL: Next button moves forward
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoplay();
      });
    }

    // Scroll listener to update active index on user swipe/scroll
    let scrollDebounce;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        const trackRect = track.getBoundingClientRect();
        let closestIndex = 0;
        let minDiff = Infinity;

        slides.forEach((slide, idx) => {
          const slideRect = slide.getBoundingClientRect();
          const diff = Math.abs(slideRect.right - trackRect.right);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });

        if (closestIndex !== currentIndex) {
          updateActiveState(closestIndex);
        }
      }, 60);
    }, { passive: true });

    // Autoplay logic
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 4000);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('touchstart', stopAutoplay, { passive: true });
    track.addEventListener('touchend', startAutoplay, { passive: true });

    startAutoplay();

    // Keyboard navigation
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        goToSlide(currentIndex - 1);
        resetAutoplay();
      } else if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex + 1);
        resetAutoplay();
      }
    });
  }

  // 4. Lightbox Modal for Gallery and Carousel
  const lightbox = document.getElementById('carouselLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, title, desc) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || 'صورة الديكور والأصباغ';
    if (lightboxTitle) lightboxTitle.textContent = title || '';
    if (lightboxDesc) lightboxDesc.textContent = desc || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-img-src') || trigger.querySelector('img')?.src;
      const title = trigger.getAttribute('data-title') || '';
      const desc = trigger.getAttribute('data-desc') || '';
      if (src) openLightbox(src, title, desc);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
});
