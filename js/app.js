/* ============================================================
   PROBOT — Your Creative Partner
   Homepage Interactions & Animations
   ============================================================ */
(function () {
  'use strict';

  // ── DOM References ──────────────────────────────────────
  const nav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const navHamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const mask = document.getElementById('spotlightMask');
  const heroSection = document.getElementById('hero');
  const scrollIndicator = document.getElementById('scrollIndicator');

  // ══════════════════════════════════════════════════════════
  // SPOTLIGHT — Mouse-follow ambient reveal on hero
  // (only runs on pages with the spotlight mask element)
  // ══════════════════════════════════════════════════════════
  const SPOTLIGHT_RADIUS = 280;
  let mouseX = -9999, mouseY = -9999;
  let targetX = -9999, targetY = -9999;
  let isMouseOnPage = false;
  let currentSpotlightRadius = SPOTLIGHT_RADIUS;
  let heroInView = true;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY; isMouseOnPage = true;
  });
  document.addEventListener('mouseleave', () => { isMouseOnPage = false; });
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY;
      isMouseOnPage = true;
    }
  }, { passive: true });
  document.addEventListener('touchend', () => { isMouseOnPage = false; });

  if (mask) {
    function animateSpotlight() {
      requestAnimationFrame(animateSpotlight);
      if (!heroInView) {
        mask.style.background = 'rgba(0,0,0,1)';
        return;
      }
      targetX += (mouseX - targetX) * 0.1;
      targetY += (mouseY - targetY) * 0.1;
      if (isMouseOnPage && currentSpotlightRadius > 0) {
        mask.style.background = `radial-gradient(circle ${currentSpotlightRadius}px at ${targetX}px ${targetY}px, transparent 0%, transparent 55%, rgba(0,0,0,0.94) 100%)`;
      } else {
        mask.style.background = 'rgba(0,0,0,1)';
      }
    }

    mask.style.background = 'rgba(0,0,0,1)';
    requestAnimationFrame(animateSpotlight);

    // ── Auto-demo spotlight (runs once on load) ──
    (function autoDemoSpotlight() {
      const MOVE_DURATION = 4500, FADE_DURATION = 1200;
      const startTime = performance.now();
      let userTookOver = false, phase = 'move', fadeStartTime = 0;

      const cancelDemo = () => { userTookOver = true; currentSpotlightRadius = SPOTLIGHT_RADIUS; };
      document.addEventListener('mousemove', cancelDemo, { once: true });
      document.addEventListener('touchstart', cancelDemo, { once: true });

      const waypoints = [
        { x: .15, y: .2 }, { x: .7, y: .15 }, { x: .5, y: .45 },
        { x: .2, y: .75 }, { x: .8, y: .7 }, { x: .5, y: .5 }
      ];

      function getPosition(t) {
        const seg = waypoints.length - 1, raw = t * seg;
        const idx = Math.min(Math.floor(raw), seg - 1);
        let st = raw - idx;
        st = st * st * (3 - 2 * st); // smoothstep
        const from = waypoints[idx], to = waypoints[idx + 1];
        return { x: from.x + (to.x - from.x) * st, y: from.y + (to.y - from.y) * st };
      }

      function demoTick(now) {
        if (userTookOver || !heroInView) return;
        if (phase === 'move') {
          const t = Math.min((now - startTime) / MOVE_DURATION, 1);
          const pos = getPosition(t);
          mouseX = window.innerWidth * pos.x;
          mouseY = window.innerHeight * pos.y;
          isMouseOnPage = true;
          currentSpotlightRadius = SPOTLIGHT_RADIUS;
          if (t >= 1) { phase = 'fade'; fadeStartTime = now; }
          requestAnimationFrame(demoTick);
        } else if (phase === 'fade') {
          const ft = Math.min((now - fadeStartTime) / FADE_DURATION, 1);
          currentSpotlightRadius = SPOTLIGHT_RADIUS * (1 - ft * ft);
          isMouseOnPage = true;
          if (ft >= 1) {
            phase = 'done';
            isMouseOnPage = false;
            mouseX = -9999; mouseY = -9999;
            currentSpotlightRadius = SPOTLIGHT_RADIUS;
          } else {
            requestAnimationFrame(demoTick);
          }
        }
      }
      setTimeout(() => { if (!userTookOver) requestAnimationFrame(demoTick); }, 400);
    })();
  } // end if (mask)


  // ══════════════════════════════════════════════════════════
  // HERO — Line reveal animation (staggered)
  // ══════════════════════════════════════════════════════════
  const heroLines = document.querySelectorAll('.reveal-line');
  heroLines.forEach((line, i) => {
    setTimeout(() => {
      line.classList.add('visible');
    }, 600 + i * 350);
  });


  // ══════════════════════════════════════════════════════════
  // NAVIGATION
  // ══════════════════════════════════════════════════════════

  // Scroll → frosted glass
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    lastScroll = y;
  }, { passive: true });

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
          // Track hero in view for spotlight
          if (id === 'hero') heroInView = true;
        }
      });
    }, { threshold: 0.2, rootMargin: '-80px 0px 0px 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Hero out-of-view detector
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      heroInView = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  }

  // Smooth scroll for same-page hash links only
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          navHamburger.classList.remove('open');
        }
      }
    });
  });

  // Hamburger menu
  if (navHamburger) {
    navHamburger.addEventListener('click', () => {
      navHamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // Scroll indicator — scroll to cinematic footer
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const cfWrapper = document.getElementById('cfWrapper');
      if (cfWrapper) {
        cfWrapper.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    });
  }


  // ══════════════════════════════════════════════════════════
  // SCROLL REVEAL — Intersection Observer
  // ══════════════════════════════════════════════════════════
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-el').forEach(el => revealObserver.observe(el));


  // ══════════════════════════════════════════════════════════
  // ANIMATED STAT COUNTERS
  // ══════════════════════════════════════════════════════════
  const statValues = document.querySelectorAll('.stat-value[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.textContent.replace(/[\d,]/g, '').replace(target.toString(), '');
    const prefix = el.textContent.match(/^[^\d]*/)?.[0] || '';
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = Math.round(target * eased);
      el.textContent = el.dataset.original.replace(target.toString(), current.toString());
      if (t < 1) requestAnimationFrame(tick);
    }

    el.dataset.original = el.textContent;
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => counterObserver.observe(el));


  // ══════════════════════════════════════════════════════════
  // ECO CARDS — Magnetic hover
  // ══════════════════════════════════════════════════════════
  document.querySelectorAll('.eco-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.04;
      const y = (e.clientY - r.top - r.height / 2) * 0.04;
      card.style.transform = `translateY(-6px) translate(${x}px, ${y}px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ══════════════════════════════════════════════════════════
  // WHO TAGS — Subtle shuffle animation on hover
  // ══════════════════════════════════════════════════════════
  document.querySelectorAll('.who-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = `translateY(-2px) rotate(${(Math.random() - .5) * 3}deg)`;
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.transform = '';
    });
  });


  // ══════════════════════════════════════════════════════════
  // PARALLAX-LITE — Subtle shift on brand hero sections
  // ══════════════════════════════════════════════════════════
  const brandHeroes = document.querySelectorAll('.brand-hero');

  window.addEventListener('scroll', () => {
    brandHeroes.forEach(hero => {
      const r = hero.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        const progress = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        const shift = (progress - 0.5) * 30;
        hero.style.backgroundPositionY = `${50 + shift}%`;
      }
    });
  }, { passive: true });


  // ══════════════════════════════════════════════════════════
  // CINEMATIC FOOTER — GSAP ScrollTrigger Animations
  // ══════════════════════════════════════════════════════════
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const cfWrapper = document.getElementById('cfWrapper');
    const cfGiantText = document.getElementById('cfGiantText');
    const cfHeading = document.getElementById('cfHeading');
    const cfLinks = document.getElementById('cfLinks');

    if (cfWrapper && cfGiantText) {
      // Giant background text parallax
      gsap.fromTo(cfGiantText,
        { y: '15vh', scale: 0.75, opacity: 0 },
        {
          y: '0vh', scale: 1, opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: cfWrapper,
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 1
          }
        }
      );

      // Staggered content reveal
      if (cfHeading && cfLinks) {
        gsap.fromTo(
          [cfHeading, cfLinks],
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cfWrapper,
              start: 'top 40%',
              end: 'bottom bottom',
              scrub: 1
            }
          }
        );
      }
    }
  }


  // ══════════════════════════════════════════════════════════
  // MAGNETIC BUTTONS — Mouse-follow with elastic snap-back
  // ══════════════════════════════════════════════════════════
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const hW = rect.width / 2;
      const hH = rect.height / 2;
      const x = e.clientX - rect.left - hW;
      const y = e.clientY - rect.top - hH;

      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          rotationX: -y * 0.1,
          rotationY: x * 0.1,
          scale: 1.05,
          ease: 'power2.out',
          duration: 0.4
        });
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, {
          x: 0, y: 0,
          rotationX: 0, rotationY: 0,
          scale: 1,
          ease: 'elastic.out(1, 0.3)',
          duration: 1.2
        });
      }
    });
  });


  // ══════════════════════════════════════════════════════════
  // BACK TO TOP BUTTON
  // ══════════════════════════════════════════════════════════
  const cfBackToTop = document.getElementById('cfBackToTop');
  if (cfBackToTop) {
    cfBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
