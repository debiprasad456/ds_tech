/* ==========================================================================
   DS TECH - INTERACTIVE LANDING SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. STICKY HEADER SCROLL EFFECT
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Link Highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     2. MOBILE MENU TOGGLE
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. TECH STACK TAB FILTERING
     -------------------------------------------------------------------------- */
  const techTabBtns = document.querySelectorAll('.tech-tab-btn');
  const techCards = document.querySelectorAll('.tech-card');

  techTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      techTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      techCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     4. INSTANT QUOTE ESTIMATOR CALCULATOR
     -------------------------------------------------------------------------- */
  const calcTypeCards = document.querySelectorAll('.calc-type-card');
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
  const calcTotalPrice = document.getElementById('calcTotalPrice');
  const calcTurnaround = document.getElementById('calcTurnaround');
  const btnOrderQuote = document.getElementById('btnOrderQuote');

  let basePrice = 199;
  let baseTime = '2-3 Days';
  let selectedType = 'Portfolio';

  function updateCalculator() {
    let total = basePrice;
    addonCheckboxes.forEach(chk => {
      if (chk.checked) {
        total += parseInt(chk.value, 10);
      }
    });

    if (calcTotalPrice) calcTotalPrice.textContent = `$${total}`;
    if (calcTurnaround) calcTurnaround.textContent = `Estimated Delivery: ${baseTime}`;
  }

  calcTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      calcTypeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      basePrice = parseInt(card.getAttribute('data-price'), 10);
      baseTime = card.getAttribute('data-time');
      selectedType = card.querySelector('span').textContent;

      updateCalculator();
    });
  });

  addonCheckboxes.forEach(chk => {
    chk.addEventListener('change', updateCalculator);
  });

  if (btnOrderQuote) {
    btnOrderQuote.addEventListener('click', () => {
      const serviceSelect = document.getElementById('serviceSelect');
      if (serviceSelect) {
        // Find matching option or set select
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes(selectedType.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Scroll to contact form smoothly
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }

      showToast(`Selected ${selectedType} package ($${calcTotalPrice.textContent.replace('$', '')}). Fill out details to submit!`, 'info');
    });
  }

  /* --------------------------------------------------------------------------
     5. CONTACT FORM SUBMISSION & TOAST SYSTEM
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--accent-gold); font-size: 1.2rem;"></i> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName').value;
      const email = document.getElementById('userEmail').value;
      const service = document.getElementById('serviceSelect').value;

      showToast(`Thank you, ${name}! Your request for "${service}" has been received. We will contact you at ${email} shortly.`, 'success');
      contactForm.reset();
    });
  }

});
