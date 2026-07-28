/* ==========================================================================
   DS WEB STORE - INTERACTIVE LANDING SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     0. NAVY DARK MODE THEME TOGGLE
     -------------------------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function updateThemeIcon(isDark) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (icon) {
      if (isDark) {
        icon.className = 'fa-solid fa-sun';
        themeToggle.title = 'Switch to Light Mode';
      } else {
        icon.className = 'fa-solid fa-moon';
        themeToggle.title = 'Switch to Navy Dark Mode';
      }
    }
  }

  // Load saved preference or browser setting
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme === 'dark');
    });
  }

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
     4. INSTANT QUOTE ESTIMATOR CALCULATOR WITH TABS
     -------------------------------------------------------------------------- */
  const calcTabs = document.querySelectorAll('.calc-tab-btn');
  const calcCategoryContents = document.querySelectorAll('.calc-category-content');
  const calcTotalPrice = document.getElementById('calcTotalPrice');
  const calcTurnaround = document.getElementById('calcTurnaround');
  const calcSelectedTabBadge = document.getElementById('calcSelectedTabBadge');
  const btnOrderQuote = document.getElementById('btnOrderQuote');

  let basePrice = 1999;
  let baseTime = '2-3 Days';
  let selectedType = 'Website - Portfolio';

  function updateCalculator() {
    const activeCategoryContent = document.querySelector('.calc-category-content.active') || document.getElementById('calcCategoryWebsite');
    if (!activeCategoryContent) return;

    const selectedCard = activeCategoryContent.querySelector('.calc-type-card.selected');
    if (selectedCard) {
      basePrice = parseInt(selectedCard.getAttribute('data-price'), 10) || 0;
      baseTime = selectedCard.getAttribute('data-time') || '';
      selectedType = selectedCard.getAttribute('data-type') || selectedCard.querySelector('span').textContent;
    }

    let total = basePrice;
    const checkboxes = activeCategoryContent.querySelectorAll('.addon-checkbox');
    checkboxes.forEach(chk => {
      if (chk.checked) {
        total += parseInt(chk.value, 10);
      }
    });

    if (calcTotalPrice) calcTotalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
    if (calcTurnaround) {
      if (baseTime.toLowerCase().includes('monthly')) {
        calcTurnaround.textContent = `Billing Cycle: ${baseTime}`;
      } else {
        calcTurnaround.textContent = `Estimated Delivery: ${baseTime}`;
      }
    }
  }

  // Handle Tab Switching
  calcTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      calcTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-tab');

      // Update badge text
      if (calcSelectedTabBadge) {
        if (targetTab === 'website') calcSelectedTabBadge.textContent = 'Website Solution';
        else if (targetTab === 'mobile') calcSelectedTabBadge.textContent = 'Mobile App Solution';
        else if (targetTab === 'marketing') calcSelectedTabBadge.textContent = 'Digital Marketing Solution';
      }

      // Show target content container
      calcCategoryContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
      });

      let targetContent = null;
      if (targetTab === 'website') targetContent = document.getElementById('calcCategoryWebsite');
      else if (targetTab === 'mobile') targetContent = document.getElementById('calcCategoryMobile');
      else if (targetTab === 'marketing') targetContent = document.getElementById('calcCategoryMarketing');

      if (targetContent) {
        targetContent.style.display = 'block';
        targetContent.classList.add('active');

        // Ensure at least one card is selected in newly opened tab
        if (!targetContent.querySelector('.calc-type-card.selected')) {
          const firstCard = targetContent.querySelector('.calc-type-card');
          if (firstCard) firstCard.classList.add('selected');
        }
      }

      updateCalculator();
    });
  });

  // Handle Card Selection within category contents
  document.querySelectorAll('.calc-type-card').forEach(card => {
    card.addEventListener('click', () => {
      const parentContainer = card.closest('.calc-category-content');
      if (parentContainer) {
        parentContainer.querySelectorAll('.calc-type-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        updateCalculator();
      }
    });
  });

  // Handle Add-on Checkbox Changes
  document.querySelectorAll('.addon-checkbox').forEach(chk => {
    chk.addEventListener('change', updateCalculator);
  });

  // Initial calculation on load
  updateCalculator();

  /* --------------------------------------------------------------------------
     5. DEPENDENT SERVICE DROPDOWNS LOGIC
     -------------------------------------------------------------------------- */
  const serviceCategorySelect = document.getElementById('serviceCategory');
  const serviceTypeSelect = document.getElementById('serviceType');

  const serviceOptionsMap = {
    website: [
      'Business Website',
      'E-Commerce Website',
      'School / College Website',
      'Hospital / Clinic Website',
      'Portfolio Website',
      'Custom Web Application'
    ],
    mobile: [
      'Android App',
      'iOS App',
      'Cross-Platform App',
      'Business Mobile App',
      'E-Commerce Mobile App',
      'Custom Mobile Application'
    ],
    marketing: [
      'Search Engine Optimization (SEO)',
      'Social Media Marketing',
      'Google Ads Management',
      'Meta Ads Management (Facebook & Instagram)',
      'Content Marketing',
      'Email Marketing',
      'WhatsApp Marketing',
      'Google Business Profile Optimization'
    ]
  };

  function updateServiceTypes(category, preselectedType = null) {
    if (!serviceTypeSelect) return;

    // Reset options
    serviceTypeSelect.innerHTML = '<option value="" disabled selected>Select a Service</option>';

    if (category && serviceOptionsMap[category]) {
      serviceOptionsMap[category].forEach(optionText => {
        const opt = document.createElement('option');
        opt.value = optionText;
        opt.textContent = optionText;
        if (preselectedType && optionText.toLowerCase().includes(preselectedType.toLowerCase())) {
          opt.selected = true;
        }
        serviceTypeSelect.appendChild(opt);
      });

      serviceTypeSelect.disabled = false;
      serviceTypeSelect.classList.remove('select-disabled');
      
      // Trigger smooth re-animation transition
      serviceTypeSelect.classList.remove('select-active');
      void serviceTypeSelect.offsetWidth; // Force reflow
      serviceTypeSelect.classList.add('select-active');
    } else {
      serviceTypeSelect.disabled = true;
      serviceTypeSelect.classList.add('select-disabled');
      serviceTypeSelect.classList.remove('select-active');
    }
  }

  if (serviceCategorySelect) {
    serviceCategorySelect.addEventListener('change', () => {
      const selectedCategory = serviceCategorySelect.value;
      updateServiceTypes(selectedCategory);
    });
  }

  // Pre-select category & type when clicking sub-card buttons
  document.querySelectorAll('a[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      const type = btn.getAttribute('data-type');
      if (serviceCategorySelect && category) {
        serviceCategorySelect.value = category;
        updateServiceTypes(category, type);
      }
    });
  });

  if (btnOrderQuote) {
    btnOrderQuote.addEventListener('click', () => {
      let targetCategory = 'website';
      const cleanType = selectedType.replace(/Website - |Mobile App - |Digital Marketing - /g, '');

      if (selectedType.toLowerCase().includes('mobile')) {
        targetCategory = 'mobile';
      } else if (selectedType.toLowerCase().includes('marketing')) {
        targetCategory = 'marketing';
      }

      if (serviceCategorySelect) {
        serviceCategorySelect.value = targetCategory;
        updateServiceTypes(targetCategory, cleanType);
      }

      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }

      showToast(`Selected ${selectedType} package (${calcTotalPrice ? calcTotalPrice.textContent : ''}). Fill out details to submit!`, 'info');
    });
  }

  /* --------------------------------------------------------------------------
     6. CONTACT FORM SUBMISSION & TOAST SYSTEM
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
      const categoryText = serviceCategorySelect && serviceCategorySelect.options[serviceCategorySelect.selectedIndex] ? serviceCategorySelect.options[serviceCategorySelect.selectedIndex].text : '';
      const typeText = serviceTypeSelect ? serviceTypeSelect.value : '';
      const message = document.getElementById('userMessage').value;

      // Format clean message for WhatsApp
      const whatsappText = `Hello DS Infotech!\n\n*Name:* ${name}\n*Email:* ${email}\n*Category:* ${categoryText}\n*Service Type:* ${typeText}\n*Project Details:* ${message}`;
      const encodedText = encodeURIComponent(whatsappText);

      // Open WhatsApp directly to +91 8260054398
      const whatsappUrl = `https://wa.me/918260054398?text=${encodedText}`;
      window.open(whatsappUrl, '_blank');

      showToast('Opening WhatsApp to send your inquiry...');
      contactForm.reset();
      updateServiceTypes('');
    });
  }

});
