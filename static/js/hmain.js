document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // Mobile Menu Toggle
  // ============================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');
  const navActions = document.getElementById('navActions');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = navLinks.classList.toggle('active');
      if (navActions) navActions.classList.toggle('active');

      document.body.style.overflow = isExpanded ? 'hidden' : '';
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded);

      const icon = mobileMenuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        !navLinks.contains(e.target) &&
        !mobileMenuToggle.contains(e.target) &&
        !(navActions && navActions.contains(e.target)) &&
        navLinks.classList.contains('active')
      ) {
        navLinks.classList.remove('active');
        if (navActions) navActions.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-times', 'fa-bars');
      }
    });

    // Close mobile menu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (navActions) navActions.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-times', 'fa-bars');
        mobileMenuToggle.focus();
      }
    });

    // Close menu when clicking a nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (navActions) navActions.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-times', 'fa-bars');
      });
    });

    // Swipe gesture for mobile menu
    let touchStartX = 0;
    navLinks.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    navLinks.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (navActions) navActions.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-times', 'fa-bars');
      }
    });
  }

  // ============================================
  // Search Bar Functionality
  // ============================================
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const eventsGrid = document.getElementById('eventsGrid');

  if (searchForm && searchInput && eventsGrid) {
    const eventCards = eventsGrid.querySelectorAll('.event-card');

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      filterEvents();
    });

    searchInput.addEventListener('input', filterEvents);

    function filterEvents() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      eventCards.forEach(card => {
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const details = card.querySelector('.event-details');
        const textContent = details ? details.textContent.toLowerCase() : '';

        card.style.display = (title.includes(searchTerm) || textContent.includes(searchTerm)) ? '' : 'none';
      });
    }
  }

  // ============================================
  // Navbar scroll effect
  // ============================================
  const mainNav = document.querySelector('.main-nav');
  if (mainNav) {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      if (scrollY > 10) {
        mainNav.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.3)';
      } else {
        mainNav.style.boxShadow = '';
      }

      lastScrollY = scrollY;
    }, { passive: true });
  }
});