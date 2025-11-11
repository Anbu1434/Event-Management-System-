document.addEventListener('DOMContentLoaded', function () {
    console.log('Profile.js loaded successfully');
    
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileForm = document.getElementById('editProfileForm');
    const profileDetails = document.getElementById('profileDetails');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.getElementById('navLinks');

    // Toggle profile form visibility
    if (editProfileBtn && editProfileForm && cancelEditBtn && profileDetails) {
        console.log('All profile elements found');
        
        editProfileBtn.addEventListener('click', function () {
            console.log('Edit Profile button clicked');
            editProfileForm.style.display = 'block';
            profileDetails.style.display = 'none';
        });

        cancelEditBtn.addEventListener('click', function () {
            console.log('Cancel button clicked');
            editProfileForm.style.display = 'none';
            profileDetails.style.display = 'block';
        });
    } else {
        console.error('One or more elements not found:', {
            editProfileBtn: !!editProfileBtn,
            editProfileForm: !!editProfileForm,
            cancelEditBtn: !!cancelEditBtn,
            profileDetails: !!profileDetails
        });
    }

    // Toggle mobile navigation
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            navToggle.querySelector('i').classList.toggle('fa-bars');
            navToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // File input preview for profile picture
    const profilePictureInput = document.querySelector('input[name="profile_picture"]');
    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const profilePicture = document.querySelector('.profile-picture');
                    const profilePlaceholder = document.querySelector('.profile-placeholder');
                    
                    if (profilePicture) {
                        profilePicture.src = e.target.result;
                    } else if (profilePlaceholder) {
                        // Replace placeholder with actual image
                        profilePlaceholder.innerHTML = `<img src="${e.target.result}" alt="Profile Picture" class="profile-picture" loading="lazy">`;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
});