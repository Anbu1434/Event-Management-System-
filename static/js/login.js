document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberCheckbox = document.getElementById("remember");

    // Auto-fill email if "Remember me" was checked
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberCheckbox.checked = true;
    }

    // Handle form submission
    form.addEventListener("submit", (e) => {
        if (!emailInput.value.trim() || !passwordInput.value.trim()) {
            e.preventDefault();
            showAlert("Please fill in all fields.", "error");
        } else {
            // Save or remove email in localStorage
            if (rememberCheckbox.checked) {
                localStorage.setItem("rememberedEmail", emailInput.value);
            } else {
                localStorage.removeItem("rememberedEmail");
            }
        }
    });

    // Function to show alert
    function showAlert(message, type = "success") {
        const alert = document.createElement("div");
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
            ${message}
        `;
        document.body.appendChild(alert);

        // Auto remove after 3 seconds
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    // Show Django messages if passed from the backe
});
