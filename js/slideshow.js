// Add this improved slideshow.js code that properly scopes slideshows

document.addEventListener('DOMContentLoaded', function() {
    // Handle standard slideshows (marker-placement page)
    initializeSlideshows('.slideshow-container');
    
    // Handle A-pose slideshow separately
    initializeAposeSlideshows();
    
    // Handle ROM slideshows separately
    initializeRomSlideshows();
});

function initializeSlideshows(containerSelector) {
    const slideshowContainers = document.querySelectorAll(containerSelector);
    
    slideshowContainers.forEach(function(container) {
        // Skip A-pose and ROM slideshows which have their own handlers
        if (container.closest('#a-pose') || container.closest('#rom')) {
            return;
        }
        
        const slides = container.querySelectorAll('.slide');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        
        // Find the parent to get slide texts
        const parentSection = container.closest('.split-left');
        const slideTexts = parentSection ? parentSection.querySelectorAll('.slide-text') : [];
        
        let currentIndex = 0;
        
        function showSlide(n) {
            // Hide all slides
            slides.forEach(slide => slide.style.display = 'none');
            slideTexts.forEach(text => text.style.display = 'none');
            
            // Handle wrapping
            currentIndex = n;
            if (currentIndex >= slides.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = slides.length - 1;
            
            // Show active slide and text
            slides[currentIndex].style.display = 'block';
            if (slideTexts[currentIndex]) {
                slideTexts[currentIndex].style.display = 'block';
            }
        }
        
        // Set up button handlers
        if (prevBtn) {
            prevBtn.onclick = function(e) {
                e.stopPropagation(); // Prevent event bubbling
                showSlide(currentIndex - 1);
            };
        }
        
        if (nextBtn) {
            nextBtn.onclick = function(e) {
                e.stopPropagation(); // Prevent event bubbling
                showSlide(currentIndex + 1);
            };
        }
        
        // Start with first slide
        showSlide(0);
    });
}

// Separate handler for A-pose slideshow
function initializeAposeSlideshows() {
    const container = document.querySelector('#a-pose .slideshow-container');
    if (!container) return;
    
    const slides = container.querySelectorAll('.slide');
    const prevBtn = container.querySelector('.prev');
    const nextBtn = container.querySelector('.next');
    
    let currentIndex = 0;
    
    function showSlide(n) {
        // Hide all slides
        slides.forEach(slide => slide.style.display = 'none');
        
        // Handle wrapping
        currentIndex = n;
        if (currentIndex >= slides.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = slides.length - 1;
        
        // Show active slide
        slides[currentIndex].style.display = 'block';
    }
    
    // Set up button handlers
    if (prevBtn) {
        prevBtn.onclick = function(e) {
            e.stopPropagation();
            showSlide(currentIndex - 1);
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = function(e) {
            e.stopPropagation();
            showSlide(currentIndex + 1);
        };
    }
    
    // Start with first slide
    showSlide(0);
}

// Separate handler for ROM slideshow
function initializeRomSlideshows() {
    const romSlidesContainer = document.querySelector('.rom-slideshow-container');
    
    if (romSlidesContainer) {
        const romSlides = document.querySelectorAll('.rom-slide');
        const romTitles = document.querySelectorAll('.rom-slide-title');
        const romPrevBtn = document.querySelector('.rom-prev');
        const romNextBtn = document.querySelector('.rom-next');
        
        let romCurrentSlide = 0;
        
        // Function to show a specific ROM slide
        function showRomSlide(n) {
            // Hide all slides and deactivate titles
            romSlides.forEach(slide => {
                slide.classList.remove('active');
            });
            romTitles.forEach(title => {
                title.classList.remove('active');
            });
            
            // Handle index wrapping
            romCurrentSlide = n;
            if (romCurrentSlide >= romSlides.length) romCurrentSlide = 0;
            if (romCurrentSlide < 0) romCurrentSlide = romSlides.length - 1;
            
            // Show active slide and highlight title
            romSlides[romCurrentSlide].classList.add('active');
            if (romTitles[romCurrentSlide]) {
                romTitles[romCurrentSlide].classList.add('active');
            }
        }
        
        // Set up title click events
        romTitles.forEach((title, index) => {
            title.addEventListener('click', function() {
                showRomSlide(index);
            });
        });
        
        // Set up navigation buttons
        if (romPrevBtn) {
            romPrevBtn.addEventListener('click', function() {
                showRomSlide(romCurrentSlide - 1);
            });
        }
        
        if (romNextBtn) {
            romNextBtn.addEventListener('click', function() {
                showRomSlide(romCurrentSlide + 1);
            });
        }
        
        // Initialize with the first slide
        showRomSlide(0);
    }
}