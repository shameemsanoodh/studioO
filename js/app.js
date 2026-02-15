/* ============================================================
   STUDIO O PRODUCTION
   Landing + Auth + Guest Carousel + Booking + Review
   ============================================================ */

(function () {
  'use strict';

  // ── DOM ────────────────────────────────────────────────
  const landing = document.getElementById('landing');
  const authScreen = document.getElementById('authScreen');
  const guestScreen = document.getElementById('guestScreen');
  const bookingScreen = document.getElementById('bookingScreen');
  const reviewScreen = document.getElementById('reviewScreen');
  const mask = document.getElementById('spotlightMask');
  const titleO = document.getElementById('titleO');
  const oRing = document.getElementById('oRing');
  const authBack = document.getElementById('authBack');
  const guestBack = document.getElementById('guestBack');
  const bookingBack = document.getElementById('bookingBack');
  const reviewBack = document.getElementById('reviewBack');
  const authTitle = document.getElementById('authTitle');
  const authDesc = document.getElementById('authDesc');
  const authBadge = document.getElementById('authBadge');
  const roleTabs = document.getElementById('roleTabs');
  const fieldName = document.getElementById('fieldName');
  const fieldEmpId = document.getElementById('fieldEmpId');
  const fieldCompany = document.getElementById('fieldCompany');
  const fieldContact = document.getElementById('fieldContact');
  const fieldEmail = document.getElementById('fieldEmail');
  const emailLabel = document.getElementById('emailLabel');
  const fieldPassword = document.getElementById('fieldPassword');
  const submitText = document.getElementById('submitText');
  const authSwitch = document.getElementById('authSwitch');

  // Carousel DOM
  const carouselTrack = document.getElementById('carouselTrack');
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.cdot');
  const TOTAL_CARDS = cards.length;

  // Booking DOM
  const bookingAmbient = document.getElementById('bookingAmbient');
  const bookingHeroImg = document.getElementById('bookingHeroImg');
  const bookingHeroTitle = document.getElementById('bookingHeroTitle');
  const bookingHeroPrice = document.getElementById('bookingHeroPrice');
  const bookingHeroBadge = document.getElementById('bookingHeroBadge');
  const calGrid = document.getElementById('calGrid');
  const calMonth = document.getElementById('calMonth');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const timeSlots = document.getElementById('timeSlots');
  const reviewBtn = document.getElementById('reviewBookingBtn');
  const confirmBtn = document.getElementById('confirmBookBtn');

  // Review DOM
  const reviewCardTitle = document.getElementById('reviewCardTitle');
  const reviewCardImg = document.querySelector('#reviewCardImg img');

  // ── Config ─────────────────────────────────────────────
  const SPOTLIGHT_RADIUS = 250;
  const O_PROXIMITY = 280;
  let mouseX = -9999, mouseY = -9999;
  let targetX = -9999, targetY = -9999;
  let isMouseOnPage = false;
  let landingActive = true;

  // Service data (matches carousel cards)
  const serviceData = [
    { name: 'Photoshoot', price: 4999, unit: '/session', badge: 'Popular', img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=85' },
    { name: 'Video Shoot', price: 9999, unit: '/project', badge: 'Trending', img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&q=85' },
    { name: 'Product Shoot', price: 6999, unit: '/product', badge: 'Premium', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=85' },
    { name: 'Podcast Studio', price: 2499, unit: '/hour', badge: 'New', img: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=85' },
    { name: 'Monthly Package', price: 24999, unit: '/month', badge: 'Best Value', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=85' },
  ];

  let currentBooking = {
    serviceIndex: 0,
    eventName: '',
    dates: [],
    location: '',
    duration: 1,
    members: 1,
    timeSlot: 'morning'
  };

  // ══════════════════════════════════════════════════════════
  // LANDING — Spotlight & O
  // ══════════════════════════════════════════════════════════
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY; isMouseOnPage = true;
  });
  document.addEventListener('mouseleave', () => { isMouseOnPage = false; });
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; isMouseOnPage = true; }
  }, { passive: true });
  document.addEventListener('touchend', () => { isMouseOnPage = false; });

  function checkOProximity() {
    if (!titleO || !landingActive) return;
    const rect = titleO.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(mouseX - cx, mouseY - cy);
    if (dist < O_PROXIMITY) { oRing.classList.add('active'); titleO.classList.add('near'); }
    else { oRing.classList.remove('active'); titleO.classList.remove('near'); }
  }

  // Spotlight radius — can be overridden by the demo fade-out
  let currentSpotlightRadius = SPOTLIGHT_RADIUS;

  function animateLanding() {
    if (!landingActive) return;
    requestAnimationFrame(animateLanding);
    targetX += (mouseX - targetX) * 0.12;
    targetY += (mouseY - targetY) * 0.12;
    if (isMouseOnPage && currentSpotlightRadius > 0) {
      mask.style.background = `radial-gradient(circle ${currentSpotlightRadius}px at ${targetX}px ${targetY}px, transparent 0%, transparent 60%, rgba(0,0,0,0.92) 100%)`;
    } else {
      mask.style.background = 'rgba(0,0,0,1)';
    }
    checkOProximity();
  }

  mask.style.background = 'rgba(0,0,0,1)';
  requestAnimationFrame(animateLanding);

  // ── Auto-demo: cursor wanders for 4s, stops at O, fades out over 1s ──
  (function autoDemoSpotlight() {
    const MOVE_DURATION = 4000;  // 4s of cursor movement
    const FADE_DURATION = 1000;  // 1s fade-out after stopping at O
    const startTime = performance.now();
    let userTookOver = false;
    let phase = 'move'; // 'move' → 'fade' → 'done'
    let fadeStartTime = 0;

    // Stop demo if real user interacts
    const cancelDemo = () => {
      userTookOver = true;
      currentSpotlightRadius = SPOTLIGHT_RADIUS; // restore full radius
    };
    document.addEventListener('mousemove', cancelDemo, { once: true });
    document.addEventListener('touchstart', cancelDemo, { once: true });

    // Waypoints: wander the page, end exactly at the O
    // Last waypoint uses a special "o" flag — resolved to the O element's center at runtime
    const waypoints = [
      { x: 0.12, y: 0.18 },  // top-left
      { x: 0.75, y: 0.15 },  // top-right
      { x: 0.50, y: 0.50 },  // center area
      { x: 0.15, y: 0.80 },  // bottom-left
      { x: 0.85, y: 0.75 },  // bottom-right
      { o: true },            // final: land on the O element
    ];

    function resolveWaypoint(wp) {
      if (wp.o && titleO) {
        const rect = titleO.getBoundingClientRect();
        return {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        };
      }
      return wp;
    }

    function getPosition(t) {
      const segments = waypoints.length - 1;
      const raw = t * segments;
      const idx = Math.min(Math.floor(raw), segments - 1);
      let segT = raw - idx;
      segT = segT * segT * (3 - 2 * segT); // smoothstep

      const from = resolveWaypoint(waypoints[idx]);
      const to = resolveWaypoint(waypoints[idx + 1]);
      return {
        x: from.x + (to.x - from.x) * segT,
        y: from.y + (to.y - from.y) * segT,
      };
    }

    function demoTick(now) {
      if (userTookOver || !landingActive) return;

      if (phase === 'move') {
        const t = Math.min((now - startTime) / MOVE_DURATION, 1);
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const pos = getPosition(t);

        mouseX = vw * pos.x;
        mouseY = vh * pos.y;
        isMouseOnPage = true;
        currentSpotlightRadius = SPOTLIGHT_RADIUS;

        if (t >= 1) {
          // Movement done — cursor is now on the O. Start fade-out.
          phase = 'fade';
          fadeStartTime = now;
        }
        requestAnimationFrame(demoTick);

      } else if (phase === 'fade') {
        const ft = Math.min((now - fadeStartTime) / FADE_DURATION, 1);
        // Ease-out: slow start, accelerate at end
        const easedFt = ft * ft;
        currentSpotlightRadius = SPOTLIGHT_RADIUS * (1 - easedFt);

        // Keep cursor parked on the O
        if (titleO) {
          const rect = titleO.getBoundingClientRect();
          mouseX = rect.left + rect.width / 2;
          mouseY = rect.top + rect.height / 2;
        }
        isMouseOnPage = true;

        if (ft >= 1) {
          // Fade complete — hand back to real mouse
          phase = 'done';
          isMouseOnPage = false;
          mouseX = -9999;
          mouseY = -9999;
          currentSpotlightRadius = SPOTLIGHT_RADIUS; // restore for real mouse
        } else {
          requestAnimationFrame(demoTick);
        }
      }
    }

    // Start after a tiny delay so the page renders first
    setTimeout(() => {
      if (!userTookOver) requestAnimationFrame(demoTick);
    }, 300);
  })();

  // Magnetic buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translateY(-2px) translate(${x * 0.08}px, ${y * 0.1}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // ══════════════════════════════════════════════════════════
  // ROLE-BASED FORM (signup)
  // ══════════════════════════════════════════════════════════
  let currentRole = 'partner';

  function setRole(role) {
    currentRole = role;
    roleTabs.querySelectorAll('.role-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.role === role);
    });
    fieldName.classList.add('hidden-field');
    fieldEmpId.classList.add('hidden-field');
    fieldCompany.classList.add('hidden-field');
    fieldContact.classList.add('hidden-field');

    if (role === 'partner') {
      fieldName.classList.remove('hidden-field');
      emailLabel.textContent = 'Email address';
      fieldEmail.querySelector('input').placeholder = 'Email address';
    } else if (role === 'employee') {
      fieldName.classList.remove('hidden-field');
      fieldEmpId.classList.remove('hidden-field');
      emailLabel.textContent = 'Email address';
      fieldEmail.querySelector('input').placeholder = 'Email address';
    } else if (role === 'business') {
      fieldCompany.classList.remove('hidden-field');
      fieldContact.classList.remove('hidden-field');
      emailLabel.textContent = 'Business mail';
      fieldEmail.querySelector('input').placeholder = 'business@company.com';
    }
  }

  roleTabs.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', () => setRole(tab.dataset.role));
  });

  // ══════════════════════════════════════════════════════════
  // SCREEN TRANSITIONS
  // ══════════════════════════════════════════════════════════
  let currentMode = 'signup';

  function showAuth(mode) {
    currentMode = mode;
    landingActive = false;
    landing.classList.add('hidden');
    authScreen.classList.add('visible');
    updateForm(mode);
  }

  function showGuest() {
    landingActive = false;
    landing.classList.add('hidden');
    guestScreen.classList.add('visible');
    requestAnimationFrame(() => { requestAnimationFrame(() => { goToCard(0); }); });
  }

  function hideAll() {
    landingActive = true;
    authScreen.classList.remove('visible');
    guestScreen.classList.remove('visible');
    bookingScreen.classList.remove('visible');
    reviewScreen.classList.remove('visible');
    landing.classList.remove('hidden');
    requestAnimationFrame(animateLanding);
  }

  function updateForm(mode) {
    if (mode === 'signup') {
      authBadge.textContent = 'Join Studio O';
      authTitle.textContent = 'Sign up account';
      authDesc.textContent = 'Choose how you\'d like to join us';
      roleTabs.classList.remove('hidden-tabs');
      fieldPassword.classList.remove('hidden-field');
      submitText.textContent = 'Sign up';
      authSwitch.innerHTML = 'Already have an account? <a href="#" id="switchLink">Log in</a>';
      setRole('partner');
    } else if (mode === 'member') {
      authBadge.textContent = 'Welcome back';
      authTitle.textContent = 'Member login';
      authDesc.textContent = 'Sign in to access your account and bookings';
      roleTabs.classList.add('hidden-tabs');
      fieldName.classList.add('hidden-field');
      fieldEmpId.classList.add('hidden-field');
      fieldCompany.classList.add('hidden-field');
      fieldContact.classList.add('hidden-field');
      emailLabel.textContent = 'Email address';
      fieldEmail.querySelector('input').placeholder = 'Email address';
      fieldPassword.classList.remove('hidden-field');
      submitText.textContent = 'Login';
      authSwitch.innerHTML = 'Don\'t have an account? <a href="#" id="switchLink">Sign up</a>';
    }

    const link = document.getElementById('switchLink');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const next = currentMode === 'signup' ? 'member' : 'signup';
        currentMode = next;
        updateForm(next);
      });
    }
  }

  // Button clicks
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (action === 'guest') showGuest();
      else showAuth(action);
    });
  });

  authBack.addEventListener('click', hideAll);
  guestBack.addEventListener('click', hideAll);

  // ══════════════════════════════════════════════════════════
  // 3D CAROUSEL — Smooth animated transitions
  // ══════════════════════════════════════════════════════════
  let activeCard = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragDelta = 0;
  let isAnimating = false;

  function getCardStyle(offset) {
    switch (offset) {
      case 0: return { x: 0, z: 60, ry: 0, opacity: 1, filter: 'brightness(1)', zIndex: 10 };
      case 1: return { x: 360, z: -100, ry: -30, opacity: .65, filter: 'brightness(0.5)', zIndex: 5 };
      case -1: return { x: -360, z: -100, ry: 30, opacity: .65, filter: 'brightness(0.5)', zIndex: 5 };
      case 2: return { x: 600, z: -250, ry: -50, opacity: .25, filter: 'brightness(0.3)', zIndex: 2 };
      case -2: return { x: -600, z: -250, ry: 50, opacity: .25, filter: 'brightness(0.3)', zIndex: 2 };
      default: return { x: (offset > 0 ? 800 : -800), z: -400, ry: (offset > 0 ? -60 : 60), opacity: 0, filter: 'brightness(0)', zIndex: 0 };
    }
  }

  function getOffset(cardIndex, active) {
    let offset = cardIndex - active;
    if (offset > Math.floor(TOTAL_CARDS / 2)) offset -= TOTAL_CARDS;
    if (offset < -Math.floor(TOTAL_CARDS / 2)) offset += TOTAL_CARDS;
    return offset;
  }

  function goToCard(index) {
    if (isAnimating) return;
    isAnimating = true;
    activeCard = ((index % TOTAL_CARDS) + TOTAL_CARDS) % TOTAL_CARDS;

    cards.forEach((card, i) => {
      const offset = getOffset(i, activeCard);
      const style = getCardStyle(offset);
      card.style.transform = `translateX(${style.x}px) translateZ(${style.z}px) rotateY(${style.ry}deg)`;
      card.style.opacity = style.opacity;
      card.style.zIndex = style.zIndex;
      card.style.filter = style.filter;
      card.classList.toggle('active-card', offset === 0);
    });

    dots.forEach((dot, i) => dot.classList.toggle('active', i === activeCard));
    setTimeout(() => { isAnimating = false; }, 700);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => goToCard(parseInt(dot.dataset.i)));
  });

  // ── Mouse drag ─────────────────────────────────────────
  const scene = document.getElementById('carouselScene');

  scene.addEventListener('mousedown', (e) => {
    if (isAnimating) return;
    isDragging = true; dragStartX = e.clientX; dragDelta = 0;
    scene.style.cursor = 'grabbing'; e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragDelta = e.clientX - dragStartX;
    cards.forEach((card, i) => {
      const offset = getOffset(i, activeCard);
      const s = getCardStyle(offset);
      card.style.transition = 'none';
      card.style.transform = `translateX(${s.x + dragDelta * 0.3}px) translateZ(${s.z}px) rotateY(${s.ry + dragDelta * 0.02}deg)`;
    });
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false; scene.style.cursor = '';
    cards.forEach(c => { c.style.transition = ''; });
    if (Math.abs(dragDelta) > 60) {
      goToCard(dragDelta < 0 ? activeCard + 1 : activeCard - 1);
    } else {
      goToCard(activeCard);
    }
    dragDelta = 0;
  });

  // ── Touch swipe ────────────────────────────────────────
  let touchStartX = 0, touchDelta = 0;

  scene.addEventListener('touchstart', (e) => {
    if (isAnimating) return;
    touchStartX = e.touches[0].clientX; touchDelta = 0;
  }, { passive: true });

  scene.addEventListener('touchmove', (e) => {
    touchDelta = e.touches[0].clientX - touchStartX;
    cards.forEach((card, i) => {
      const offset = getOffset(i, activeCard);
      const s = getCardStyle(offset);
      card.style.transition = 'none';
      card.style.transform = `translateX(${s.x + touchDelta * 0.3}px) translateZ(${s.z}px) rotateY(${s.ry + touchDelta * 0.02}deg)`;
    });
  }, { passive: true });

  scene.addEventListener('touchend', () => {
    cards.forEach(c => { c.style.transition = ''; });
    if (Math.abs(touchDelta) > 50) {
      goToCard(touchDelta < 0 ? activeCard + 1 : activeCard - 1);
    } else { goToCard(activeCard); }
  }, { passive: true });

  // ── Keyboard nav ───────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (guestScreen.classList.contains('visible')) {
      if (e.key === 'ArrowRight') goToCard(activeCard + 1);
      if (e.key === 'ArrowLeft') goToCard(activeCard - 1);
      if (e.key === 'Escape') hideAll();
    }
    if (bookingScreen.classList.contains('visible') && e.key === 'Escape') {
      bookingScreen.classList.remove('visible');
      guestScreen.classList.add('visible');
    }
    if (reviewScreen.classList.contains('visible') && e.key === 'Escape') {
      reviewScreen.classList.remove('visible');
      bookingScreen.classList.add('visible');
    }
  });

  // ── Subtle float on active card ────────────────────────
  let floatPhase = 0;
  function floatActiveCard() {
    requestAnimationFrame(floatActiveCard);
    if (!guestScreen.classList.contains('visible') || isDragging || isAnimating) return;
    floatPhase += 0.015;
    const floatY = Math.sin(floatPhase) * 6;
    cards.forEach((card, i) => {
      if (i === activeCard) {
        const s = getCardStyle(0);
        card.style.transition = 'none';
        card.style.transform = `translateX(${s.x}px) translateZ(${s.z}px) rotateY(${s.ry}deg) translateY(${floatY}px)`;
      }
    });
  }
  floatActiveCard();

  // ══════════════════════════════════════════════════════════
  // BOOK BUTTON → BOOKING PAGE
  // ══════════════════════════════════════════════════════════
  document.querySelectorAll('.card-book').forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openBooking(i);
    });
  });

  function openBooking(serviceIndex) {
    const svc = serviceData[serviceIndex];
    currentBooking.serviceIndex = serviceIndex;
    currentBooking.dates = [];
    currentBooking.duration = 1;
    currentBooking.members = 1;
    currentBooking.timeSlot = 'morning';

    // Populate hero
    bookingHeroImg.src = svc.img;
    bookingHeroTitle.textContent = svc.name;
    bookingHeroPrice.textContent = `From ₹${svc.price.toLocaleString('en-IN')}`;
    bookingHeroBadge.textContent = svc.badge;

    // Reset form
    document.getElementById('bEventName').value = '';
    document.getElementById('bLocation').value = '';
    document.getElementById('bDuration').textContent = '1';
    document.getElementById('bMembers').textContent = '1';

    // Reset time slots
    timeSlots.querySelectorAll('.time-card').forEach(tc => tc.classList.remove('active'));
    timeSlots.querySelector('[data-time="morning"]').classList.add('active');
    setAmbient('morning');

    // Build calendar
    calViewMonth = new Date().getMonth();
    calViewYear = new Date().getFullYear();
    renderCalendar();

    // Show booking screen
    guestScreen.classList.remove('visible');
    bookingScreen.classList.add('visible');

    // Scroll to top
    document.querySelector('.booking-scroll').scrollTop = 0;
  }

  bookingBack.addEventListener('click', () => {
    bookingScreen.classList.remove('visible');
    guestScreen.classList.add('visible');
  });

  // ══════════════════════════════════════════════════════════
  // CALENDAR
  // ══════════════════════════════════════════════════════════
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let calViewMonth = new Date().getMonth();
  let calViewYear = new Date().getFullYear();

  function renderCalendar() {
    calMonth.textContent = `${MONTHS[calViewMonth]} ${calViewYear}`;
    calGrid.innerHTML = '';

    const firstDay = new Date(calViewYear, calViewMonth, 1).getDay();
    const daysInMonth = new Date(calViewYear, calViewMonth + 1, 0).getDate();
    const daysInPrev = new Date(calViewYear, calViewMonth, 0).getDate();
    const today = new Date();

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const btn = document.createElement('button');
      btn.className = 'cal-day other-month';
      btn.textContent = daysInPrev - i;
      calGrid.appendChild(btn);
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const btn = document.createElement('button');
      btn.className = 'cal-day';
      btn.textContent = d;

      const dateStr = `${calViewYear}-${String(calViewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      // Today marker
      if (calViewYear === today.getFullYear() && calViewMonth === today.getMonth() && d === today.getDate()) {
        btn.classList.add('today');
      }

      // Past days
      const dayDate = new Date(calViewYear, calViewMonth, d);
      if (dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        btn.classList.add('disabled');
      }

      // Selected
      if (currentBooking.dates.includes(dateStr)) {
        btn.classList.add('selected');
      }

      btn.addEventListener('click', () => {
        const idx = currentBooking.dates.indexOf(dateStr);
        if (idx > -1) {
          currentBooking.dates.splice(idx, 1);
          btn.classList.remove('selected');
        } else {
          currentBooking.dates.push(dateStr);
          btn.classList.add('selected');
        }
      });

      calGrid.appendChild(btn);
    }

    // Next month padding
    const totalCells = calGrid.children.length;
    const remainder = totalCells % 7;
    if (remainder > 0) {
      for (let i = 1; i <= 7 - remainder; i++) {
        const btn = document.createElement('button');
        btn.className = 'cal-day other-month';
        btn.textContent = i;
        calGrid.appendChild(btn);
      }
    }
  }

  calPrev.addEventListener('click', () => {
    calViewMonth--;
    if (calViewMonth < 0) { calViewMonth = 11; calViewYear--; }
    renderCalendar();
  });

  calNext.addEventListener('click', () => {
    calViewMonth++;
    if (calViewMonth > 11) { calViewMonth = 0; calViewYear++; }
    renderCalendar();
  });

  // ══════════════════════════════════════════════════════════
  // STEPPERS (Duration & Members)
  // ══════════════════════════════════════════════════════════
  document.querySelectorAll('.stepper-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const dir = parseInt(btn.getAttribute('data-dir'));
      const valEl = document.getElementById(targetId);
      let val = parseInt(valEl.textContent) + dir;
      if (val < 1) val = 1;
      if (val > 99) val = 99;
      valEl.textContent = val;

      if (targetId === 'bDuration') currentBooking.duration = val;
      if (targetId === 'bMembers') currentBooking.members = val;
    });
  });

  // ══════════════════════════════════════════════════════════
  // TIME SLOTS + AMBIENT LIGHTING
  // ══════════════════════════════════════════════════════════
  function setAmbient(time) {
    bookingAmbient.className = 'booking-ambient ambient-' + time;

    // Also add time-specific class to the active time card
    timeSlots.querySelectorAll('.time-card').forEach(tc => {
      tc.classList.remove('active', 'time-morning', 'time-afternoon', 'time-evening', 'time-night');
    });
    const activeTC = timeSlots.querySelector(`[data-time="${time}"]`);
    if (activeTC) {
      activeTC.classList.add('active', 'time-' + time);
    }
  }

  timeSlots.querySelectorAll('.time-card').forEach(tc => {
    tc.addEventListener('click', () => {
      const time = tc.getAttribute('data-time');
      currentBooking.timeSlot = time;
      setAmbient(time);
    });
  });

  // ══════════════════════════════════════════════════════════
  // REVIEW BOOKING
  // ══════════════════════════════════════════════════════════
  reviewBtn.addEventListener('click', () => {
    const svc = serviceData[currentBooking.serviceIndex];

    // Read form values
    currentBooking.eventName = document.getElementById('bEventName').value || svc.name;
    currentBooking.location = document.getElementById('bLocation').value || 'Studio O';

    // Populate review card
    reviewCardTitle.textContent = svc.name;
    reviewCardImg.src = svc.img;

    document.getElementById('rvEvent').textContent = currentBooking.eventName;
    document.getElementById('rvDates').textContent = currentBooking.dates.length > 0
      ? currentBooking.dates.map(d => {
        const dt = new Date(d);
        return `${dt.getDate()} ${MONTHS[dt.getMonth()].slice(0, 3)}`;
      }).join(', ')
      : 'Not selected';
    document.getElementById('rvLocation').textContent = currentBooking.location;
    document.getElementById('rvDuration').textContent = `${currentBooking.duration} hr${currentBooking.duration > 1 ? 's' : ''}`;
    document.getElementById('rvMembers').textContent = `${currentBooking.members} pax`;
    document.getElementById('rvTime').textContent = currentBooking.timeSlot.charAt(0).toUpperCase() + currentBooking.timeSlot.slice(1);

    // Calculate price
    const total = svc.price * currentBooking.duration * (currentBooking.dates.length || 1);
    document.getElementById('rvTotal').textContent = `₹${total.toLocaleString('en-IN')}`;

    // Transition: booking → review card
    bookingScreen.classList.remove('visible');
    reviewScreen.classList.add('visible');
  });

  reviewBack.addEventListener('click', () => {
    reviewScreen.classList.remove('visible');
    bookingScreen.classList.add('visible');
  });

  // ── Final Book confirm ─────────────────────────────────
  confirmBtn.addEventListener('click', () => {
    // Animate confirmation
    confirmBtn.textContent = '✓ Booked!';
    confirmBtn.style.background = '#00ff8c';
    confirmBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      // Reset and go back to carousel
      confirmBtn.textContent = 'Book Now ✓';
      confirmBtn.style.background = '';
      confirmBtn.style.pointerEvents = '';
      reviewScreen.classList.remove('visible');
      guestScreen.classList.add('visible');
    }, 1600);
  });

  // ══════════════════════════════════════════════════════════
  // BENTO GRID — Staggered reveal (auth screen)
  // ══════════════════════════════════════════════════════════
  const bentoTiles = document.querySelectorAll('.bento-tile');
  bentoTiles.forEach((tile, i) => {
    tile.style.opacity = '0';
    tile.style.transform = 'translateY(20px) scale(0.95)';
    tile.style.transition = `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.08}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.08}s`;
  });

  const observer = new MutationObserver(() => {
    if (authScreen.classList.contains('visible')) {
      bentoTiles.forEach(tile => { tile.style.opacity = '1'; tile.style.transform = 'translateY(0) scale(1)'; });
    } else {
      bentoTiles.forEach(tile => { tile.style.opacity = '0'; tile.style.transform = 'translateY(20px) scale(0.95)'; });
    }
  });
  observer.observe(authScreen, { attributes: true, attributeFilter: ['class'] });

  // ── Password toggle ───────────────────────────────────
  const toggleBtn = document.querySelector('.input-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const input = toggleBtn.previousElementSibling;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      toggleBtn.style.color = isPass ? 'var(--green)' : 'var(--white-muted)';
    });
  }

  // Initialize carousel positions
  cards.forEach(card => {
    card.style.transform = 'translateX(0) translateZ(-400px) rotateY(0deg)';
    card.style.opacity = '0';
  });

  // Initial calendar render
  renderCalendar();

})();
