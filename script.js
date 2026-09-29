/**
 * Inciverse Technical Group - Interactive Features & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Cursor Glow Follower
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    // Close when clicking a link
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // 4. Animated Number Counters
  const counterElements = document.querySelectorAll('.counter');
  let countersStarted = false;

  const animateCounters = () => {
    counterElements.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = counter.getAttribute('data-decimal') !== null;
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = isDecimal ? target.toFixed(1) : target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.getElementById('about');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  // 5. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 6. Contact Form Submission Handler
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending Message...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = '✓ Thank you! Your project inquiry has been received. Our team will contact you shortly.';
        
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 6000);
      }, 1000);
    });
  }

  // 7. File Input label feedback
  const fileInput = document.getElementById('attachment');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const attachText = document.querySelector('.attach-text');
      if (e.target.files.length > 0 && attachText) {
        attachText.textContent = `Attached: ${e.target.files[0].name}`;
        attachText.style.color = 'var(--color-neon)';
      }
    });
  }
});
