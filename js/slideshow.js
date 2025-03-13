document.addEventListener('DOMContentLoaded', function() {
    // Function to set up any slideshow on the page
    function setupSlideshow(container) {
        // Find all elements for this specific slideshow
        const slides = container.querySelectorAll('.slide');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        
        // Find the parent section to get related slide-text elements
        const parentSection = container.closest('.split-left');
        const slideTexts = parentSection ? parentSection.querySelectorAll('.slide-text') : [];
        
        // Initialize the slide index
        let currentSlideIndex = 0;
        
        // Function to show a specific slide
        function showSlide(n) {
            // Hide all slides and texts
            for (let i = 0; i < slides.length; i++) {
                slides[i].classList.remove('active');
                if (slideTexts[i]) {
                    slideTexts[i].classList.remove('active');
                }
            }
            
            // Handle index wrapping
            currentSlideIndex = n;
            if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
            if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;
            
            // Show the active slide and corresponding text
            slides[currentSlideIndex].classList.add('active');
            if (slideTexts[currentSlideIndex]) {
                slideTexts[currentSlideIndex].classList.add('active');
            }
        }
        
        // Event listener for previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                showSlide(currentSlideIndex - 1);
            });
        }
        
        // Event listener for next button
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                showSlide(currentSlideIndex + 1);
            });
        }
        
        // Initialize with the first slide
        showSlide(0);
    }
    
    // =============================================================
    // Set up regular slideshows (Marker Placement and A-pose)
    // =============================================================
    const slideshowContainers = document.querySelectorAll('.slideshow-container');
    slideshowContainers.forEach(function(container) {
        setupSlideshow(container);
    });
    
    // =============================================================
    // Set up ROM slideshow specifically
    // =============================================================
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
});