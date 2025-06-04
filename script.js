// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeCounters();
    initializeCountdown();
    initializeSubmissionForm();
    initializeScheduleFilters();
    initializeScrollEffects();
    initializeContactForm();
    initializeAnimations();
});

// Theme Toggle Functionality
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Navigation Functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');
    
    // Hamburger menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'var(--glass-bg)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animated Counters
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Countdown Timer
function initializeCountdown() {
    const countdownElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };
    
    // Set target date (example: 90 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 90);
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElements.days.textContent = days.toString().padStart(2, '0');
            countdownElements.hours.textContent = hours.toString().padStart(2, '0');
            countdownElements.minutes.textContent = minutes.toString().padStart(2, '0');
            countdownElements.seconds.textContent = seconds.toString().padStart(2, '0');
        } else {
            Object.values(countdownElements).forEach(el => el.textContent = '00');
        }
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Multi-step Submission Form
function initializeSubmissionForm() {
    const form = document.getElementById('submissionForm');
    const steps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressFill = document.getElementById('progressFill');
    const currentStepSpan = document.getElementById('currentStep');
    
    let currentStep = 1;
    const totalSteps = 4;
    
    const updateFormProgress = () => {
        const progressPercent = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progressPercent}%`;
        currentStepSpan.textContent = currentStep;
        
        // Update button states
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    };
    
    const showStep = (stepNumber) => {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepNumber - 1);
        });
        updateFormProgress();
    };
    
    const validateCurrentStep = () => {
        const currentStepElement = document.getElementById(`step${currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                field.focus();
                field.style.borderColor = '#ff006e';
                setTimeout(() => {
                    field.style.borderColor = '';
                }, 2000);
                return false;
            }
        }
        return true;
    };
    
    nextBtn.addEventListener('click', () => {
        if (validateCurrentStep() && currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateCurrentStep()) return;
        
        // Add loading state
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        form.classList.add('loading');
        
        // Simulate form submission
        setTimeout(() => {
            alert('Film submission successful! We\'ll review your submission and get back to you soon.');
            form.reset();
            currentStep = 1;
            showStep(currentStep);
            submitBtn.textContent = 'Submit Film';
            submitBtn.disabled = false;
            form.classList.remove('loading');
        }, 2000);
    });
    
    // File upload handling
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const label = e.target.nextElementSibling;
            const fileName = e.target.files[0]?.name || 'No file selected';
            const span = label.querySelector('span');
            span.textContent = fileName;
        });
    });
    
    // Initialize form
    showStep(currentStep);
}

// Schedule Filters
function initializeScheduleFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const scheduleItems = document.querySelectorAll('.schedule-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter schedule items
            scheduleItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'grid';
                    item.style.animation = 'slideIn 0.3s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Add to calendar functionality
    const calendarBtns = document.querySelectorAll('.add-calendar');
    calendarBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Simple calendar event creation (would normally integrate with calendar APIs)
            const scheduleItem = btn.closest('.schedule-item');
            const title = scheduleItem.querySelector('h3').textContent;
            const venue = scheduleItem.querySelector('.venue').textContent;
            
            // Create a simple ICS file content
            const eventDetails = `Event: ${title}\nVenue: ${venue}\nAdded to your calendar reminder!`;
            alert(eventDetails);
            
            // Visual feedback
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.color = '#00f5ff';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-calendar-plus"></i>';
                btn.style.color = '';
            }, 2000);
        });
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const formData = new FormData(contactForm);
        
        // Validate form
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ff006e';
                isValid = false;
                setTimeout(() => {
                    field.style.borderColor = '';
                }, 2000);
            }
        });
        
        if (!isValid) return;
        
        // Submit form
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Message sent successfully! We\'ll get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Scroll Effects and Animations
function initializeScrollEffects() {
    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.wave-animation');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translate(-50%, -50%) rotate(${scrolled * speed}deg)`;
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.feature-card, .filmmaker-card, .news-item, .schedule-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Additional Animations and Interactions
function initializeAnimations() {
    // Filmmaker card play button functionality
    const playBtns = document.querySelectorAll('.play-btn');
    playBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Simulate video play (would normally open video modal/player)
            btn.innerHTML = '<i class="fas fa-pause"></i>';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-play"></i>';
            }, 2000);
        });
    });
    
    // News item click handling
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('h3').textContent;
            alert(`Opening article: "${title}"\n\nThis would normally navigate to the full article.`);
        });
    });
    
    // CTA button interactions
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.textContent.includes('Submit')) {
                document.getElementById('submissions').scrollIntoView({ behavior: 'smooth' });
            } else if (btn.textContent.includes('Tickets')) {
                alert('Ticket purchasing would be handled here!\n\nThis would normally redirect to a ticketing platform.');
            }
        });
    });
    
    // Progress ring animation for submissions
    const progressCircle = document.getElementById('progressCircle');
    if (progressCircle) {
        const animateProgressRing = () => {
            const circumference = 2 * Math.PI * 90; // r = 90
            const progress = 0.51; // 51% (247 out of ~485 target)
            const offset = circumference - (progress * circumference);
            
            progressCircle.style.strokeDasharray = circumference;
            progressCircle.style.strokeDashoffset = offset;
            progressCircle.style.transition = 'stroke-dashoffset 2s ease-in-out';
        };
        
        // Animate when element comes into view
        const ringObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressRing();
                    ringObserver.unobserve(entry.target);
                }
            });
        });
        
        ringObserver.observe(progressCircle);
    }
    
    // Social media link handling
    const socialLinks = document.querySelectorAll('.social-links a, .footer-social a, .filmmaker-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = link.querySelector('i').className;
            let platformName = 'Social Media';
            
            if (platform.includes('instagram')) platformName = 'Instagram';
            else if (platform.includes('twitter')) platformName = 'Twitter';
            else if (platform.includes('facebook')) platformName = 'Facebook';
            else if (platform.includes('youtube')) platformName = 'YouTube';
            else if (platform.includes('globe')) platformName = 'Website';
            
            alert(`This would open the ${platformName} page.\n\nNormally this would redirect to the actual social media profile.`);
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Performance optimization - lazy loading images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});
