document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = navLinks.classList.toggle('active');
      document.body.style.overflow = isExpanded ? 'hidden' : '';
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
      mobileMenuToggle.querySelector('i').classList.toggle('fa-bars');
      mobileMenuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
      }
    });

    // Close mobile menu with Escape key
    navLinks.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        mobileMenuToggle.focus();
      }
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
        document.body.style.overflow = '';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
      }
    });
  }

  // Search Bar Functionality
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
        const title = card.getAttribute('data-title').toLowerCase();
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
      });
    }
  }

  // Notification Badge
  const notificationIcon = document.getElementById('notificationIcon');
  const notificationBadge = document.getElementById('notificationBadge');

  if (notificationIcon && notificationBadge) {
    notificationIcon.addEventListener('click', () => {
      const currentCount = parseInt(notificationBadge.textContent);
      if (currentCount > 0) {
        notificationBadge.textContent = '0';
        notificationBadge.style.display = 'none';
        alert('Notifications cleared!');
      }
    });
  }
});