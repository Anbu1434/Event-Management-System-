document.addEventListener("DOMContentLoaded", function () {
    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const navLinks = document.getElementById("navLinks");
    
    // Mobile menu toggle
    mobileMenuToggle.addEventListener("click", function() {
        mobileMenuToggle.classList.toggle("active");
        navLinks.classList.toggle("active");
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains("active")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinkElements = navLinks.querySelectorAll(".nav-link");
    navLinkElements.forEach(link => {
        link.addEventListener("click", function() {
            mobileMenuToggle.classList.remove("active");
            navLinks.classList.remove("active");
            document.body.style.overflow = "";
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener("click", function(event) {
        if (!mobileMenuToggle.contains(event.target) && !navLinks.contains(event.target)) {
            mobileMenuToggle.classList.remove("active");
            navLinks.classList.remove("active");
            document.body.style.overflow = "";
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            mobileMenuToggle.classList.remove("active");
            navLinks.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    const form = document.getElementById("registerForm");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const strengthMeter = document.getElementById("strengthMeter");
    const strengthText = document.getElementById("strengthText");
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
    const submitBtn = document.querySelector(".register-btn");

    // Password toggle functionality
    function togglePasswordVisibility(input, button) {
        button.addEventListener("click", function() {
            const type = input.getAttribute("type") === "password" ? "text" : "password";
            input.setAttribute("type", type);
            
            const icon = button.querySelector("i");
            icon.classList.toggle("fa-eye");
            icon.classList.toggle("fa-eye-slash");
        });
    }

    togglePasswordVisibility(passwordInput, togglePassword);
    togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);

    // Password strength checker
    passwordInput.addEventListener("input", function () {
        const value = passwordInput.value;
        let strength = 0;
        let feedback = [];

        // Check length
        if (value.length >= 8) {
            strength++;
        } else {
            feedback.push("At least 8 characters");
        }

        // Check for uppercase
        if (/[A-Z]/.test(value)) {
            strength++;
        } else {
            feedback.push("One uppercase letter");
        }

        // Check for lowercase
        if (/[a-z]/.test(value)) {
            strength++;
        } else {
            feedback.push("One lowercase letter");
        }

        // Check for numbers
        if (/[0-9]/.test(value)) {
            strength++;
        } else {
            feedback.push("One number");
        }

        // Check for special characters
        if (/[^A-Za-z0-9]/.test(value)) {
            strength++;
        } else {
            feedback.push("One special character");
        }

        // Update strength meter
        strengthMeter.className = "strength-meter";
        
        if (strength <= 1) {
            strengthMeter.classList.add("weak");
            strengthText.textContent = "Weak";
            strengthText.style.color = "#dc3545";
        } else if (strength <= 2) {
            strengthMeter.classList.add("fair");
            strengthText.textContent = "Fair";
            strengthText.style.color = "#ffc107";
        } else if (strength <= 3) {
            strengthMeter.classList.add("good");
            strengthText.textContent = "Good";
            strengthText.style.color = "#28a745";
        } else {
            strengthMeter.classList.add("strong");
            strengthText.textContent = "Strong";
            strengthText.style.color = "#20c997";
        }
    });

    // Real-time validation
    function validateField(field, validationRules) {
        const value = field.value.trim();
        const errorElement = document.getElementById(field.id + "-error");
        
        for (let rule of validationRules) {
            if (!rule.test(value)) {
                showError(field, errorElement, rule.message);
                return false;
            }
        }
        
        hideError(field, errorElement);
        return true;
    }

    function showError(field, errorElement, message) {
        field.style.borderColor = "#dc3545";
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add("show");
        }
    }

    function hideError(field, errorElement) {
        field.style.borderColor = "#e1e5e9";
        if (errorElement) {
            errorElement.classList.remove("show");
        }
    }

    // Validation rules
    const validations = {
        firstName: [
            { test: (value) => value.length > 0, message: "First name is required" },
            { test: (value) => value.length >= 2, message: "First name must be at least 2 characters" }
        ],
        lastName: [
            { test: (value) => value.length > 0, message: "Last name is required" },
            { test: (value) => value.length >= 2, message: "Last name must be at least 2 characters" }
        ],
        email: [
            { test: (value) => value.length > 0, message: "Email is required" },
            { test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: "Please enter a valid email address" }
        ],
        password: [
            { test: (value) => value.length >= 8, message: "Password must be at least 8 characters" },
            { test: (value) => /[A-Z]/.test(value), message: "Password must contain at least one uppercase letter" },
            { test: (value) => /[a-z]/.test(value), message: "Password must contain at least one lowercase letter" },
            { test: (value) => /[0-9]/.test(value), message: "Password must contain at least one number" }
        ],
        confirmPassword: [
            { test: (value) => value === passwordInput.value, message: "Passwords do not match" }
        ],
        university: [
            { test: (value) => value !== "", message: "Please select a university" }
        ]
    };

    // Add real-time validation listeners
    Object.keys(validations).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener("blur", () => {
                validateField(field, validations[fieldId]);
            });
            
            field.addEventListener("input", () => {
                if (field.style.borderColor === "rgb(220, 53, 69)") {
                    validateField(field, validations[fieldId]);
                }
            });
        }
    });

    // Special handling for confirm password
    confirmPasswordInput.addEventListener("input", () => {
        if (confirmPasswordInput.style.borderColor === "rgb(220, 53, 69)" || confirmPasswordInput.value.length > 0) {
            validateField(confirmPasswordInput, validations.confirmPassword);
        }
    });

    // Form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        Object.keys(validations).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !validateField(field, validations[fieldId])) {
                isValid = false;
            }
        });

        // Check terms
        const termsChecked = document.getElementById("terms").checked;
        if (!termsChecked) {
            const termsError = document.getElementById("terms-error");
            termsError.textContent = "You must agree to the terms and conditions";
            termsError.classList.add("show");
            isValid = false;
        } else {
            const termsError = document.getElementById("terms-error");
            termsError.classList.remove("show");
        }

        if (!isValid) {
            // Scroll to first error
            const firstError = document.querySelector(".error-message.show");
            if (firstError) {
                firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        // Show loading state
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

        // Submit form
        form.submit();
    });

    // Auto-hide errors on input
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            const errorElement = document.getElementById(input.id + "-error");
            if (errorElement && errorElement.classList.contains("show")) {
                hideError(input, errorElement);
            }
        });
    });

    // Focus management for accessibility
    const focusableElements = form.querySelectorAll('input, select, button, a');
    focusableElements.forEach((element, index) => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && element.tagName !== 'BUTTON' && element.type !== 'submit') {
                e.preventDefault();
                const nextElement = focusableElements[index + 1];
                if (nextElement) {
                    nextElement.focus();
                }
            }
        });
    });
});
