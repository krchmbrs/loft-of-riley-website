/* ============================================================
   LOFT OF RILEY — site.js
   Vanilla JS. No dependencies.
   - Sticky nav with scroll detection
   - Mobile hamburger menu
   - Gallery lightbox with keyboard nav
   - Hero bg Ken Burns on load
   - Scroll-triggered fade-in animations
   ============================================================ */

(function () {
  'use strict';

  /* ---------- NAV: scroll state + hamburger ---------- */
  const nav = document.getElementById('site-nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    });
    // Close on mobile link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ---------- HERO: kick off Ken Burns scale ---------- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    // Pre-load the hero image, then animate in
    const heroImg = new Image();
    heroImg.onload = () => heroBg.classList.add('loaded');
    heroImg.src = heroBg.style.backgroundImage.replace(/url\(['"]?([^'"]+)['"]?\)/, '$1');
  }

  /* ---------- LIGHTBOX ---------- */
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  const lightbox = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentIndex = -1;

  function openLightbox(index) {
    const item = galleryItems[index];
    if (!item) return;
    const img = item.querySelector('img');
    if (!img) return;
    currentIndex = index;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.caption || img.alt;
    lightbox.classList.add('open');
    lightboxBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    currentIndex = -1;
  }

  function prevPhoto() {
    if (currentIndex <= 0) openLightbox(galleryItems.length - 1);
    else openLightbox(currentIndex - 1);
  }

  function nextPhoto() {
    if (currentIndex >= galleryItems.length - 1) openLightbox(0);
    else openLightbox(currentIndex + 1);
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', item.dataset.caption || 'View photo');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevPhoto);
  if (lightboxNext) lightboxNext.addEventListener('click', nextPhoto);

  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  });

  // Swipe support for mobile
  let touchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 50) dx < 0 ? nextPhoto() : prevPhoto();
    }, { passive: true });
  }

  /* ---------- SCROLL FADE-IN ---------- */
  // Mark body so CSS knows JS is active (prevents flash of invisible content)
  document.body.classList.add('js-ready');

  const fadeEls = document.querySelectorAll(
    '.amenity-card, .review-card, .experience-text, .experience-photos, .location-text, .location-photos, .stat'
  );
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  /* ---------- SMOOTH SCROLL for older browsers ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
