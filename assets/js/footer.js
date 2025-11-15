// Footer JavaScript for University App
// Handles newsletter subscription, back-to-top functionality, and dynamic elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize footer functionality
    initializeFooter();
});

function initializeFooter() {
    // Set current year in copyright
    setCurrentYear();

    // Initialize back-to-top button
    initializeBackToTop();

    // Initialize newsletter form
    initializeNewsletter();

    // Initialize animations if supported
    initializeAnimations();
}

/**
 * Sets the current year in the copyright notice
 */
function setCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

/**
 * 
 * 
 * Initializes the back-to-top button functionality
 */
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Smooth scroll to top when clicked
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToTop();
    });
}



/**
 * Smoothly scrolls to the top of the page
 */
function scrollToTop() {
    // Check if smooth scrolling is supported
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        // Fallback for browsers that don't support smooth scrolling
        const scrollStep = -window.pageYOffset / (500 / 15);
        const scrollInterval = setInterval(function() {
            if (window.pageYOffset !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    }
}

/**
 * Initializes the newsletter subscription form
 */
function initializeNewsletter() {
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');

    if (!form || !emailInput) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleNewsletterSubmission(emailInput);
    });

    // Real-time validation
    emailInput.addEventListener('input', function() {
        validateEmail(emailInput);
    });

    // Clear validation on focus
    emailInput.addEventListener('focus', function() {
        clearValidation(emailInput);
    });
}

/**
 * Handles newsletter form submission
 * @param {HTMLInputElement} emailInput - The email input element
 */
function handleNewsletterSubmission(emailInput) {
    const email = emailInput.value.trim();

    // Validate email
    if (!validateEmail(emailInput)) {
        showError(emailInput, 'Please enter a valid email address.');
        return;
    }

    // Simulate API call (replace with actual implementation)
    simulateSubscription(email)
        .then(function(response) {
            showSuccess('Thank you for subscribing! Check your email for confirmation.');
            emailInput.value = '';
        })
        .catch(function(error) {
            showError(emailInput, 'Subscription failed. Please try again.');
        });
}

/**
 * Validates email format
 * @param {HTMLInputElement} input - The input element to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') {
        clearValidation(input);
        return false;
    }

    if (!emailRegex.test(email)) {
        showError(input, 'Please enter a valid email address.');
        return false;
    }

    showSuccess(input, 'Email looks good!');
    return true;
}

/**
 * Simulates newsletter subscription API call
 * @param {string} email - The email address to subscribe
 * @returns {Promise} - Promise that resolves on success
 */
function simulateSubscription(email) {
    return new Promise(function(resolve, reject) {
        // Simulate network delay
        setTimeout(function() {
            // Simulate random success/failure (90% success rate)
            if (Math.random() > 0.1) {
                resolve({ success: true, message: 'Subscribed successfully' });
            } else {
                reject({ error: 'Subscription failed' });
            }
        }, 1000);
    });
}

/**
 * Shows validation error for input
 * @param {HTMLInputElement} input - The input element
 * @param {string} message - The error message
 */
function showError(input, message) {
    clearValidation(input);
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-message error-message';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');

    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

/**
 * Shows validation success for input
 * @param {HTMLInputElement} input - The input element
 * @param {string} message - The success message
 */
function showSuccess(input, message) {
    clearValidation(input);
    input.classList.add('success');

    // Create success message element
    const successElement = document.createElement('div');
    successElement.className = 'validation-message success-message';
    successElement.textContent = message;

    input.parentNode.insertBefore(successElement, input.nextSibling);
}

/**
 * Shows a general success message (e.g., for subscription confirmation)
 * @param {string} message - The success message
 */
function showSuccess(message) {
    showPopup(message, 'success');
}

/**
 * Shows a general error message
 * @param {HTMLInputElement} input - The input element (optional)
 * @param {string} message - The error message
 */
function showError(input, message) {
    if (input) {
        showError(input, message);
    } else {
        showPopup(message, 'error');
    }
}

/**
 * Shows a popup message
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success' or 'error')
 */
function showPopup(message, type) {
    // Remove existing popup
    const existingPopup = document.querySelector('.popup-message');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create popup element
    const popup = document.createElement('div');
    popup.className = `popup-message ${type}`;
    popup.setAttribute('role', 'alert');
    popup.innerHTML = `
        <div class="popup-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="popup-close" aria-label="Close message">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add to page
    document.body.appendChild(popup);

    // Show popup with animation
    setTimeout(function() {
        popup.classList.add('show');
    }, 10);

    // Auto-hide after 5 seconds
    setTimeout(function() {
        hidePopup(popup);
    }, 5000);

    // Close on click
    const closeBtn = popup.querySelector('.popup-close');
    closeBtn.addEventListener('click', function() {
        hidePopup(popup);
    });
}

/**
 * Hides a popup message
 * @param {HTMLElement} popup - The popup element to hide
 */
function hidePopup(popup) {
    popup.classList.remove('show');
    setTimeout(function() {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 300);
}

/**
 * Clears validation messages and classes
 * @param {HTMLInputElement} input - The input element
 */
function clearValidation(input) {
    input.classList.remove('error', 'success');
    input.removeAttribute('aria-invalid');

    const message = input.parentNode.querySelector('.validation-message');
    if (message) {
        message.remove();
    }
}

/**
 * Initializes animations for footer elements
 */
function initializeAnimations() {
    // Add intersection observer for fade-in animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe footer sections
        const footerSections = document.querySelectorAll('.footer-section');
        footerSections.forEach(function(section) {
            observer.observe(section);
        });
    }
}

// Additional CSS for validation messages and popups (to be added to footer.css if not present)
const additionalStyles = `
<style>
.validation-message {
    font-size: 0.8rem;
    margin-top: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

.error-message {
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
}

.success-message {
    color: #51cf66;
    background: rgba(81, 207, 102, 0.1);
}

.popup-message {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
}

.popup-message.show {
    opacity: 1;
    transform: translateX(0);
}

.popup-content {
    background: var(--primary-gradient, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 400px;
}

.popup-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    margin-left: auto;
    opacity: 0.7;
    transition: opacity 0.2s ease;
}

.popup-close:hover {
    opacity: 1;
}

.animate-in {
    animation: fadeInUp 0.6s ease-out;
}

@media (max-width: 768px) {
    .popup-message {
        left: 20px;
        right: 20px;
        top: 20px;
    }

    .popup-content {
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
    }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);
