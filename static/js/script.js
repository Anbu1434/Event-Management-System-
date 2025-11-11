// script.js

document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const heroLogin = document.getElementById("heroLogin");
    const heroRegister = document.getElementById("heroRegister");
    const ctaRegister = document.getElementById("ctaRegister");

    const loginModal = document.getElementById("loginModal");
    const registerModal = document.getElementById("registerModal");

    const showRegisterLink = document.getElementById("showRegister");
    const showLoginLink = document.getElementById("showLogin");

    const closeButtons = document.querySelectorAll(".close");

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.querySelector(".nav-links");

    // Toggle navbar for mobile
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Open login modal
    [loginBtn, heroLogin].forEach(button => {
        button.addEventListener("click", () => {
            loginModal.classList.add("show");
        });
    });

    // Open register modal
    [registerBtn, heroRegister, ctaRegister].forEach(button => {
        button.addEventListener("click", () => {
            registerModal.classList.add("show");
        });
    });

    // Switch from login to register
    if (showRegisterLink) {
        showRegisterLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginModal.classList.remove("show");
            registerModal.classList.add("show");
        });
    }

    // Switch from register to login
    if (showLoginLink) {
        showLoginLink.addEventListener("click", (e) => {
            e.preventDefault();
            registerModal.classList.remove("show");
            loginModal.classList.add("show");
        });
    }

    // Close modals
    closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener("click", () => {
            loginModal.classList.remove("show");
            registerModal.classList.remove("show");
        });
    });

    // Close modal if clicked outside content
    window.addEventListener("click", (event) => {
        if (event.target === loginModal) {
            loginModal.classList.remove("show");
        } else if (event.target === registerModal) {
            registerModal.classList.remove("show");
        }
    });
});
