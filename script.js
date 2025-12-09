document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close the menu when a link is clicked (for smooth scroll effect)
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // 2. Smooth Scroll Effect (Implemented natively via CSS `scroll-behavior: smooth;`
    // but this JS adds a fallback and ensures correct behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adjust for fixed header height
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Simple Fade-in Animations (Intersection Observer)
    const hiddenElements = document.querySelectorAll('.hidden');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'visible' class to trigger the CSS transition
                entry.target.classList.add('visible');
                // Stop observing once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Options: Trigger when 10% of the element is visible
        threshold: 0.1 
    });

    hiddenElements.forEach(element => {
        observer.observe(element);
    });
});

// Get the modal
const modal = document.getElementById("quoteModal");
// Get the <span> element that closes the modal
const closeBtn = document.querySelector(".close-btn");
// Get the form
const quoteForm = document.getElementById("quoteForm");

// Function to open the modal
function openQuoteModal(serviceName) {
    // Set the service name in the modal title and hidden input
    document.getElementById("modalServiceName").textContent = serviceName;
    document.getElementById("serviceType").value = serviceName;
    modal.style.display = "block";
}

// Function to close the modal
function closeQuoteModal() {
    modal.style.display = "none";
}

// Close the modal when the user clicks on the close button (x)
closeBtn.onclick = function() {
    closeQuoteModal();
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target == modal) {
        closeQuoteModal();
    }
}

// Handle form submission to create WhatsApp link
quoteForm.onsubmit = function(event) {
    event.preventDefault(); // Prevent default form submission

    const serviceType = document.getElementById("serviceType").value;
    const userName = document.getElementById("userName").value;
    const userLocation = document.getElementById("userLocation").value;
    const userPhone = document.getElementById("userPhone").value;
    const serviceDetails = document.getElementById("serviceDetails").value;

    // Build the predefined message
    const message = `*QUOTE REQUEST (Website)*%0A%0A` +
                    `*Service:* ${serviceType}%0A` +
                    `*Name:* ${userName}%0A` +
                    `*Location:* ${userLocation}%0A` +
                    `*Contact:* ${userPhone}%0A` +
                    `*Details:* ${serviceDetails}%0A%0A` +
                    `Please provide me with a quote and availability. Thank you!`;

    // Target WhatsApp Number (Using Goitse's number for consistency)
    const targetNumber = '27810462730'; 
    
    // Construct the WhatsApp API link
    const whatsappLink = `https://wa.me/${targetNumber}?text=${message}`;

    // Close modal and open WhatsApp
    closeQuoteModal();
    window.open(whatsappLink, '_blank');
};