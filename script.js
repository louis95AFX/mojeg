document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close the menu when a link is clicked
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // --- 2. Smooth Scroll Effect (Revised) ---
    // Note: The smooth scroll logic needs to be outside the general scroll listener 
    // to function correctly on the initial click.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default hash jump
            e.preventDefault(); 
            
            const targetId = this.getAttribute('href');
            // Ignore links to just the hash symbol or if target is not found
            if (targetId === '#' || targetId === '' || !document.querySelector(targetId)) return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adjust for fixed header height
                const headerHeight = document.querySelector('header').offsetHeight;
                // Calculate position relative to the top, then adjust for the header
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. Simple Fade-in Animations (Intersection Observer) ---
    const hiddenElements = document.querySelectorAll('.hidden');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 
    });

    hiddenElements.forEach(element => {
        observer.observe(element);
    });
    
    // --- 4. Quote Modal Logic ---
    const quoteModal = document.getElementById("quoteModal");
    const quoteCloseBtn = document.querySelector("#quoteModal .close-btn");
    const quoteForm = document.getElementById("quoteForm");
    
    // Function to close the modal (used internally and by submit)
    function closeQuoteModal() {
        quoteModal.style.display = "none";
        quoteForm.reset(); // Also reset the form on close
    }
    
    // Assign global function to window for inline HTML calls (onclick="openQuoteModal()")
    window.openQuoteModal = function(serviceName) {
        document.getElementById("modalServiceName").textContent = serviceName;
        document.getElementById("serviceType").value = serviceName;
        quoteModal.style.display = "block";
    }

    // Close the modal when the user clicks on the close button (x)
    quoteCloseBtn.addEventListener('click', closeQuoteModal);

    // Handle form submission to create WhatsApp link
    quoteForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const serviceType = document.getElementById("serviceType").value;
        const userName = document.getElementById("userName").value;
        const userLocation = document.getElementById("userLocation").value;
        const userPhone = document.getElementById("userPhone").value;
        const serviceDetails = document.getElementById("serviceDetails").value;

        // Build the predefined message (using standard URL encoding)
        const message = encodeURIComponent(
            `*QUOTE REQUEST (Website)*\n\n` +
            `*Service:* ${serviceType}\n` +
            `*Name:* ${userName}\n` +
            `*Location:* ${userLocation}\n` +
            `*Contact:* ${userPhone}\n` +
            `*Details:* ${serviceDetails}\n\n` +
            `Please provide me with a quote and availability. Thank you!`
        );

        // Target WhatsApp Number (Using Goitse's number for consistency)
        const targetNumber = '27810462730'; 
        
        // Construct the WhatsApp API link
        const whatsappLink = `https://wa.me/${targetNumber}?text=${message}`;

        // Close modal and open WhatsApp
        closeQuoteModal();
        window.open(whatsappLink, '_blank');
    });

    // --- 5. Review Modal Logic (NEW) ---
    const reviewModal = document.getElementById('reviewModal');
    const openReviewModalBtn = document.getElementById('openReviewModalBtn');
    const reviewCloseBtn = document.querySelector('#reviewModal .review-close-btn');
    const reviewForm = document.getElementById('reviewForm');
    
    // Function to close the review modal (used internally and by submit)
    function closeReviewModal() {
        reviewModal.style.display = "none";
        reviewForm.reset(); 
    }

    // Open the review modal
    if (openReviewModalBtn) {
        openReviewModalBtn.addEventListener('click', function() {
            reviewModal.style.display = "block";
        });
    }

    // Close the review modal
    if (reviewCloseBtn) {
        reviewCloseBtn.addEventListener('click', closeReviewModal);
    }
    
    // Handle Review Submission (sends data via a mailto link)
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('reviewName').value;
            const service = document.getElementById('reviewService').value;
            const rating = document.getElementById('reviewRating').value;
            const text = document.getElementById('reviewText').value;
            
            // --- IMPORTANT: Replace with your actual email address ---
            const recipientEmail = 'mojeg.reviews@yourdomain.com'; // Placeholder
            // -----------------------------------------------------

            const subject = encodeURIComponent(`New Customer Review Submission: ${name}`);
            
            const body = encodeURIComponent(
                `Reviewer Name: ${name}\n` +
                `Service Used: ${service}\n` +
                `Rating: ${rating} / 5\n\n` +
                `Review Text:\n"${text}"`
            );

            // Open email client
            window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

            // Optional: Provide feedback and close the modal
            setTimeout(() => {
                closeReviewModal();
                alert("Thank you! Your email client should open now with the review pre-filled. Please click send to submit your review.");
            }, 100); 
        });
    }

    // --- 6. Global Click Handlers for Modals ---
    window.addEventListener('click', function(event) {
        // Close Quote Modal
        if (event.target == quoteModal) {
            closeQuoteModal();
        }
        // Close Review Modal
        if (event.target == reviewModal) {
            closeReviewModal();
        }
    });

});