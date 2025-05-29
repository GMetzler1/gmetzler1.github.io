// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Lightbox configuration
lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'albumLabel': 'Image %1 of %2',
    'fadeDuration': 300,
    'imageFadeDuration': 300
});

// Carousel functionality
class Carousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = Array.from(container.querySelectorAll('.carousel-slide'));
        this.prevButton = container.querySelector('.prev');
        this.nextButton = container.querySelector('.next');
        this.dotsContainer = container.parentElement.querySelector('.carousel-dots');
        
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        
        this.init();
    }
    
    init() {
        // Create dots
        this.createDots();
        
        // Add event listeners
        this.prevButton.addEventListener('click', () => this.slide('prev'));
        this.nextButton.addEventListener('click', () => this.slide('next'));
        
        // Initialize first slide
        this.updateSlide();
        this.loadCurrentImage();
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.container.getBoundingClientRect().top < window.innerHeight &&
                this.container.getBoundingClientRect().bottom > 0) {
                if (e.key === 'ArrowLeft') this.slide('prev');
                if (e.key === 'ArrowRight') this.slide('next');
            }
        });
    }
    
    createDots() {
        for (let i = 0; i < this.slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    slide(direction) {
        if (direction === 'prev') {
            this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.slideCount;
        }
        this.updateSlide();
        this.loadCurrentImage();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlide();
        this.loadCurrentImage();
    }
    
    updateSlide() {
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        this.updateDots();
    }
    
    loadCurrentImage() {
        const currentSlide = this.slides[this.currentIndex];
        const img = currentSlide.querySelector('img');
        
        if (!img.classList.contains('loaded')) {
            currentSlide.classList.add('loading');
            
            const tempImage = new Image();
            tempImage.onload = () => {
                img.classList.add('loaded');
                currentSlide.classList.remove('loading');
            };
            tempImage.onerror = () => {
                currentSlide.classList.remove('loading');
                img.alt = 'Failed to load image';
                img.style.backgroundColor = '#ffebee';
            };
            tempImage.src = img.src;
        }
    }
}

// Initialize carousels when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(container => new Carousel(container));
}); 