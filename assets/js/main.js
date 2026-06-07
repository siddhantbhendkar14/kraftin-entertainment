/* Kraftin Entertainment — Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initHeroAnimations();
  initScrollReveal();
  initCounters();
  initTestimonials();
  initParallax();
  initContactForm();
  initBlogSearch();
  initCardTilt();
  initMagneticButtons();
  initGalleryFilter();
  initLightbox();
  initWhatsApp();
  initMediaAutoplay();
  initPageHeroParallax();
});

/* Header scroll effect */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Mobile navigation */
function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const close = document.querySelector('.mobile-nav-close');
  const nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;

  const desktopActive = document.querySelector('.nav-desktop a.active');
  if (desktopActive) {
    const href = desktopActive.getAttribute('href');
    nav.querySelectorAll('a').forEach(link => {
      if (link.getAttribute('href') === href) link.classList.add('active');
    });
  }

  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  close?.addEventListener('click', () => setOpen(false));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
  });
}

/* Hero GSAP animations */
function showHeroFallback() {
  const hero = document.querySelector('.hero');
  if (hero) hero.classList.add('hero-ready');
}

function initHeroAnimations() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  if (typeof gsap === 'undefined') {
    showHeroFallback();
    return;
  }

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: showHeroFallback
  });

  tl.to('.hero-logo', {
    opacity: 1,
    y: 0,
    duration: 0.8
  })
  .to('.hero-headline .line', {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.2
  }, '-=0.3')
  .to('.hero-subtitle', { opacity: 1, duration: 0.8 }, '-=0.4')
  .to('.hero-buttons', { opacity: 1, duration: 0.8 }, '-=0.4')
  .to('.scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.2');

  setTimeout(showHeroFallback, 2500);

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      gsap.to(heroBg, {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }
}

/* Scroll reveal animations */
function initScrollReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.timeline-item').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.mentor-card').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      delay: i * 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });
}

/* Animated counters */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  } else {
    counters.forEach(animate);
  }
}

/* Testimonial carousel */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!slides.length) return;

  let current = 0;
  let interval;

  const show = (index) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  const next = () => show(current + 1);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      resetInterval();
    });
  });

  const resetInterval = () => {
    clearInterval(interval);
    interval = setInterval(next, 5000);
  };

  show(0);
  resetInterval();
}

/* Parallax on service cards */
function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.utils.toArray('.service-card').forEach(card => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });
}

/* Contact form — preserves WPForms field structure */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honeypot = form.querySelector('[name="wpforms[fields][2]"]');
    if (honeypot && honeypot.value) return;

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        showFormSuccess(form);
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      const mailtoBody = [
        `Name: ${data.get('wpforms[fields][1][first]')} ${data.get('wpforms[fields][1][last]')}`,
        `Phone: ${data.get('wpforms[fields][5]')}`,
        `Email: ${data.get('wpforms[fields][4]')}`,
        `Message: ${data.get('wpforms[fields][3]')}`
      ].join('%0A');

      window.location.href = `mailto:ke@kraftinentertainment.com?subject=Contact%20Form%20Submission&body=${mailtoBody}`;
    }

    btn.textContent = originalText;
    btn.disabled = false;
  });
}

function showFormSuccess(form) {
  const success = form.querySelector('.form-success');
  if (success) {
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 5000);
  }
}

/* Blog search filter */
function initBlogSearch() {
  const search = document.getElementById('blog-search');
  const cards = document.querySelectorAll('.blog-card');
  if (!search || !cards.length) return;

  search.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? '' : 'none';
    });
  });

  const categoryItems = document.querySelectorAll('.blog-categories li');

  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      categoryItems.forEach(li => li.classList.remove('active'));
      item.classList.add('active');

      const category = item.dataset.category || '';
      if (category === 'all') {
        search.value = '';
        cards.forEach(card => { card.style.display = ''; });
        return;
      }
      const label = item.textContent.trim().toLowerCase();
      cards.forEach(card => {
        const cat = card.querySelector('.blog-category')?.textContent.toLowerCase() || '';
        card.style.display = cat.includes(label) || label.includes(cat.split(' ')[0]) ? '' : 'none';
      });
    });
  });

  categoryItems[0]?.classList.add('active');
}

/* Card tilt on hover */
function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* Magnetic button hover */
function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* Gallery category filter */
function initGalleryFilter() {
  const grid = document.querySelector('.gallery-grid');
  const buttons = document.querySelectorAll('.gallery-filter-btn');
  if (!grid || !buttons.length) return;

  const items = grid.querySelectorAll('.gallery-item');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        const cat = item.dataset.category || '';
        const show = filter === 'all' || cat === filter;
        item.classList.toggle('hidden', !show);

        const video = item.querySelector('video');
        if (video) {
          if (show) {
            window.mediaAutoplayPlay?.(video);
          } else {
            video.pause();
          }
        }

        if (typeof gsap !== 'undefined' && show) {
          gsap.fromTo(item,
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
          );
        }
      });
    });
  });
}

/* Lightbox */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const content = lightbox.querySelector('.lightbox-content');
  const close = lightbox.querySelector('.lightbox-close');

  const open = (el) => {
    content.innerHTML = '';
    const clone = el.cloneNode(true);
    if (clone.tagName === 'VIDEO') {
      clone.controls = true;
      clone.autoplay = true;
    }
    content.appendChild(clone);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    close?.focus();
  };

  const shut = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    content.innerHTML = '';
    document.body.style.overflow = '';
  };

  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.setAttribute('aria-modal', 'true');

  document.querySelectorAll('[data-lightbox]').forEach(item => {
    item.addEventListener('click', () => {
      const media = item.querySelector('img, video');
      if (media) open(media);
    });
  });

  close?.addEventListener('click', shut);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) shut();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') shut();
  });
}

/* WhatsApp floating button */
function initWhatsApp() {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;

  const msg = encodeURIComponent('Hi Kraftin, I would like a quotation for an event.');
  btn.href = `https://wa.me/919158314519?text=${msg}`;
}

/* Viewport-based video autoplay — gallery, highlights, Instagram */
const mediaAutoplayState = {
  reducedMotion: false,
  observer: null,
  observed: new WeakSet()
};

function isAutoplayVisible(video) {
  const parent = video.closest('.gallery-item, .highlight-card, .insta-item');
  return parent && !parent.classList.contains('hidden');
}

function loadAutoplayVideo(video) {
  if (video.dataset.loaded) return;
  video.dataset.loaded = 'true';
  video.load();
}

function playAutoplayVideo(video) {
  if (mediaAutoplayState.reducedMotion || !isAutoplayVisible(video)) return;
  loadAutoplayVideo(video);
  video.play().catch(() => {});
}

function pauseAutoplayVideo(video) {
  video.pause();
}

function prepareAutoplayVideo(video) {
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  if (window.matchMedia('(max-width: 768px)').matches) {
    video.preload = 'none';
  }
}

function registerViewportVideos(videos) {
  const list = Array.from(videos || []);
  if (!list.length) return;

  list.forEach(prepareAutoplayVideo);

  if (mediaAutoplayState.reducedMotion || typeof IntersectionObserver === 'undefined') return;

  if (!mediaAutoplayState.observer) {
    mediaAutoplayState.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          playAutoplayVideo(video);
        } else {
          pauseAutoplayVideo(video);
        }
      });
    }, {
      threshold: window.matchMedia('(max-width: 768px)').matches ? [0, 0.5, 0.7] : [0, 0.35, 0.6],
      rootMargin: window.matchMedia('(max-width: 768px)').matches ? '0px' : '40px'
    });
  }

  list.forEach(video => {
    if (mediaAutoplayState.observed.has(video)) return;
    mediaAutoplayState.observed.add(video);
    mediaAutoplayState.observer.observe(video);
  });
}

function initMediaAutoplay() {
  mediaAutoplayState.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const videos = document.querySelectorAll('.gallery-item video, .highlight-card video, .insta-item video');
  if (!videos.length) return;

  window.mediaAutoplayPlay = playAutoplayVideo;
  window.registerViewportVideos = registerViewportVideos;
  registerViewportVideos(videos);
}

/* Subtle parallax on page heroes with media backgrounds */
function initPageHeroParallax() {
  const heroes = document.querySelectorAll('.page-hero--media .page-hero-bg');
  if (!heroes.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  heroes.forEach(bg => {
    gsap.to(bg, {
      y: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: bg.closest('.page-hero'),
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}
