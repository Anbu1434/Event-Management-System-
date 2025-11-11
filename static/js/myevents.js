document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuToggle.querySelector('i').classList.toggle('fa-bars');
      mobileMenuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
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
        mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
      }
    });
  }

  // Search Bar Functionality (for home page)
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

  // Event Registration (for home page)
  const registerButtons = document.querySelectorAll('.btn-register');
  registerButtons.forEach(button => {
    button.addEventListener('click', () => {
      const eventCard = button.closest('.event-card');
      const eventTitle = eventCard.getAttribute('data-title');
      const eventData = {
        title: eventTitle,
        date: eventCard.querySelector('p:nth-child(2)').textContent.replace(/.*?\|\s*/, ''),
        location: eventCard.querySelector('p:nth-child(3)').textContent.replace(/.*?\|\s*/, ''),
        category: eventCard.querySelector('p:nth-child(4)').textContent.replace(/.*?\|\s*/, ''),
        image: eventCard.querySelector('.event-image').style.backgroundImage
      };

      // Save to localStorage (mock backend)
      let registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
      if (!registeredEvents.some(event => event.title === eventTitle)) {
        registeredEvents.push(eventData);
        localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
      }

      button.textContent = 'Registered!';
      button.style.backgroundColor = 'var(--success)';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = 'Register Now';
        button.style.backgroundColor = 'var(--primary)';
        button.disabled = false;
      }, 2000);
      alert(`Successfully registered for ${eventTitle}!`);
    });
  });

  // My Events Page: Display Registered Events
  const myEventsGrid = document.getElementById('myEventsGrid');
  const noEventsMessage = document.getElementById('noEventsMessage');

  if (myEventsGrid && noEventsMessage) {
    const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');

    if (registeredEvents.length === 0) {
      noEventsMessage.style.display = 'block';
    } else {
      noEventsMessage.style.display = 'none';
      registeredEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card animate__animated animate__fadeInUp';
        eventCard.setAttribute('data-title', event.title);
        eventCard.innerHTML = `
          <div class="event-image" role="img" aria-label="${event.title}" style="${event.image}"></div>
          <div class="event-details">
            <h4>${event.title}</h4>
            <p><i class="fas fa-calendar-day"></i> ${event.date}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p><i class="fas fa-tag"></i> ${event.category}</p>
            <button class="btn-unregister" aria-label="Unregister from ${event.title}">Unregister</button>
          </div>
        `;
        myEventsGrid.appendChild(eventCard);

        // Unregister Functionality
        eventCard.querySelector('.btn-unregister').addEventListener('click', () => {
          let updatedEvents = registeredEvents.filter(e => e.title !== event.title);
          localStorage.setItem('registeredEvents', JSON.stringify(updatedEvents));
          eventCard.remove();
          if (updatedEvents.length === 0) {
            noEventsMessage.style.display = 'block';
          }
          alert(`Unregistered from ${event.title}!`);
        });
      });
    }
  }
});