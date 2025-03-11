// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items and pages
            menuItems.forEach(i => i.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Show corresponding page
            const pageId = this.getAttribute('data-page');
            document.getElementById(pageId).classList.add('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const slideTexts = document.querySelectorAll('.slide-text');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentSlide = 0;
    
    // Skip if no slideshow present
    if (!slides.length || !prevButton || !nextButton) return;
    
    // Hide all slides except the first one
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        slideTexts.forEach(text => text.classList.remove('active'));
        
        // Show the current slide
        slides[index].classList.add('active');
        slideTexts[index].classList.add('active');
    }
    
    // Next slide
    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }
    
    // Previous slide
    function prevSlide() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
    }
    
    // Event listeners
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // Initialize - ensure first slide and text are active
    showSlide(0);
    
    // Auto-advance slides (optional - uncomment if desired)
    // setInterval(nextSlide, 5000);
});