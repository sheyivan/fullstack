// Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all slide-up elements
document.querySelectorAll('.slide-up').forEach(el => {
    observer.observe(el);
});

// Module accordion
function toggleModule(index) {
    const modules = document.querySelectorAll('.module-item');
    const currentModule = modules[index];
    const isActive = currentModule.classList.contains('active');
    
    // Close all modules
    modules.forEach(module => {
        module.classList.remove('active');
    });
    
    // Open clicked module if it wasn't active
    if (!isActive) {
        currentModule.classList.add('active');
    }
}

// Testimonials carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-slide');
const indicators = document.querySelectorAll('.indicator');

function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    // Remove active from all indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show selected testimonial
    testimonials[index].classList.add('active');
    indicators[index].classList.add('active');
    
    currentTestimonial = index;
}

// Auto-rotate testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Pricing countdown
function updateCountdown() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3); // 3 days from now
    
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    function updateTimer() {
        const now = new Date().getTime();
        const timeLeft = endDate.getTime() - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
            countdownElement.innerHTML = 'Oferta expirada';
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Plan selection
function selectPlan(plan) {
    const planSelect = document.getElementById('plan');
    if (planSelect) {
        const options = {
            'basico': 'basico',
            'premium': 'premium',
            'vip': 'vip'
        };
        planSelect.value = options[plan];
        scrollToSection('inscripcion');
    }
}

// Form validation
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');

// Real-time validation
const validators = {
    nombre: (value) => {
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        return '';
    },
    
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'El correo electrónico es requerido';
        if (!emailRegex.test(value)) return 'Ingresa un correo electrónico válido';
        return '';
    },
    
    telefono: (value) => {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!value.trim()) return 'El teléfono es requerido';
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Ingresa un teléfono válido';
        return '';
    },
    
    experiencia: (value) => {
        if (!value) return 'Selecciona tu nivel de experiencia';
        return '';
    },
    
    plan: (value) => {
        if (!value) return 'Selecciona un plan';
        return '';
    },
    
    terminos: (checked) => {
        if (!checked) return 'Debes aceptar los términos y condiciones';
        return '';
    }
};

function validateField(fieldName, value) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.getElementById(fieldName);
    
    let error = '';
    
    if (fieldName === 'terminos') {
        error = validators[fieldName](value);
    } else {
        error = validators[fieldName] ? validators[fieldName](value) : '';
    }
    
    if (error) {
        errorElement.textContent = error;
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
        return false;
    } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        inputElement.classList.remove('error');
        return true;
    }
}

// Add real-time validation to form fields
Object.keys(validators).forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
        if (field.type === 'checkbox') {
            field.addEventListener('change', (e) => {
                validateField(fieldName, e.target.checked);
            });
        } else {
            field.addEventListener('blur', (e) => {
                validateField(fieldName, e.target.value);
            });
            
            field.addEventListener('input', (e) => {
                // Clear error on input
                const errorElement = document.getElementById(`${fieldName}-error`);
                if (errorElement.style.display === 'block') {
                    validateField(fieldName, e.target.value);
                }
            });
        }
    }
});

// Form submission
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        let isValid = true;
        Object.keys(validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            let value = field.type === 'checkbox' ? field.checked : field.value;
            if (!validateField(fieldName, value)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Scroll to first error
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success modal
            showModal('successModal');
            form.reset();
            
            // Track conversion (you can integrate with your analytics here)
            console.log('Conversion tracked:', data);
            
        } catch (error) {
            alert('Hubo un error al procesar tu inscripción. Por favor intenta de nuevo.');
            console.error('Form submission error:', error);
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function openModal(type) {
    // Handle different modal types
    console.log(`Opening ${type} modal`);
    // You can implement specific modals for terms, privacy, etc.
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
        document.body.style.overflow = '';
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    
    // Add loading animation to code preview
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.1}s`;
        line.classList.add('fade-in');
    });
    
    // Initialize first testimonial as active
    if (testimonials.length > 0) {
        showTestimonial(0);
    }
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}