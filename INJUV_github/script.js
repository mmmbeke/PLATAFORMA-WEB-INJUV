// Search functionality (solo si los elementos existen)
const searchToggle = document.querySelector('.search-toggle');
const searchBar = document.getElementById('searchBar');
const searchClose = document.querySelector('.search-close');
const searchInput = document.querySelector('.search-input');
const searchSubmit = document.querySelector('.search-submit');

// Toggle search bar (solo si existe)
if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', () => {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active') && searchInput) {
            searchInput.focus();
        }
    });
}

if (searchClose && searchBar) {
    searchClose.addEventListener('click', () => {
        searchBar.classList.remove('active');
    });
}

// Search functionality (solo si los elementos existen)
if (searchSubmit && searchInput) {
    searchSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });
}

function performSearch(query) {
    // Simulate search functionality
    showSearchResults(query);
}

function showSearchResults(query) {
    // Create search results modal
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Resultados de búsqueda para: "${query}"</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="search-results">
                    <div class="search-result-item">
                        <h4>Programa de Voluntariado Internacional</h4>
                        <p>Oportunidades de voluntariado en más de 140 países</p>
                        <span class="result-type">INJUV</span>
                    </div>
                    <div class="search-result-item">
                        <h4>Trámites INJUV</h4>
                        <p>Accede a todos los trámites disponibles para jóvenes</p>
                        <span class="result-type">Servicio</span>
                    </div>
                    <div class="search-result-item">
                        <h4>Participación Ciudadana</h4>
                        <p>Espacios de participación y compromiso social</p>
                        <span class="result-type">Programa</span>
                    </div>
                </div>
                <div class="search-footer">
                    <button class="btn-primary">Ver todos los resultados</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Mobile menu toggle (solo si los elementos existen)
document.addEventListener('click', (event) => {
    const menuToggleButton = event.target.closest('.menu-toggle');
    if (menuToggleButton) {
        const nav = document.querySelector('.main-nav');
        if (nav) {
            const shouldOpen = !menuToggleButton.classList.contains('active');
            menuToggleButton.classList.toggle('active', shouldOpen);
            nav.classList.toggle('active', shouldOpen);
            menuToggleButton.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        }
        return;
    }

    const dropdownToggle = event.target.closest('.nav-item.dropdown > .nav-link');
    if (dropdownToggle && window.innerWidth <= 1024) {
        event.preventDefault();
        const parentItem = dropdownToggle.parentElement;
        const isOpen = parentItem.classList.contains('open');

        document.querySelectorAll('.nav-item.dropdown.open').forEach((item) => {
            if (item !== parentItem) {
                item.classList.remove('open');
            }
        });

        parentItem.classList.toggle('open', !isOpen);
        return;
    }

    const navLink = event.target.closest('.main-nav a');
    if (navLink && window.innerWidth <= 1024) {
        const nav = document.querySelector('.main-nav');
        const toggle = document.querySelector('.menu-toggle');
        if (nav && toggle && toggle.classList.contains('active')) {
            nav.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
        document.querySelectorAll('.nav-item.dropdown.open').forEach((item) => {
            item.classList.remove('open');
        });
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        const nav = document.querySelector('.main-nav');
        const toggle = document.querySelector('.menu-toggle');
        if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
        if (nav) {
            nav.classList.remove('active');
        }
        document.querySelectorAll('.nav-item.dropdown.open').forEach((item) => {
            item.classList.remove('open');
        });
    }
});

// Smooth scrolling for navigation links (usando event delegation para links dinámicos)
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }
});

// También mantener el código original para compatibilidad
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Search functionality
const searchBtn = document.querySelector('.search-btn');
const regionSelect = document.getElementById('region');
const tematicaSelect = document.getElementById('tematica');
const dateStartInput = document.getElementById('date-start');
const dateEndInput = document.getElementById('date-end');

if (searchBtn && regionSelect && tematicaSelect) {
    searchBtn.addEventListener('click', () => {
        const region = regionSelect.value;
        const tematica = tematicaSelect.value;
        const dateStart = dateStartInput ? dateStartInput.value : '';
        const dateEnd = dateEndInput ? dateEndInput.value : '';
        
        if (region || tematica || dateStart || dateEnd) {
            // Simulate search functionality
            showSearchResults(region, tematica, dateStart, dateEnd);
        } else {
            showNotification('Por favor, completa al menos un campo de búsqueda', 'warning');
        }
    });
}

function showSearchResults(region, tematica, dateStart, dateEnd) {
    // Create a simple search results modal
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    const dateRange = dateStart && dateEnd ? `${dateStart} - ${dateEnd}` : (dateStart || dateEnd || 'Cualquier fecha');
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Resultados de búsqueda</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Región:</strong> ${region || 'Cualquier región'}</p>
                <p><strong>Temática:</strong> ${tematica || 'Cualquier temática'}</p>
                <p><strong>Rango de fechas:</strong> ${dateRange}</p>
                <div class="search-results">
                    <p>Se encontraron 15 oportunidades que coinciden con tu búsqueda.</p>
                    <button class="btn-primary">Ver oportunidades</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// Show country opportunities
function showCountryOpportunities(countryName) {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Oportunidades en ${countryName}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="country-opportunities">
                    <div class="opportunity-item">
                        <h4>Proyecto de Conservación</h4>
                        <p>Ayuda en la conservación de la biodiversidad local</p>
                        <span class="opportunity-type">Eco-turismo</span>
                    </div>
                    <div class="opportunity-item">
                        <h4>Enseñanza de Idiomas</h4>
                        <p>Enseña inglés a niños y adultos en comunidades rurales</p>
                        <span class="opportunity-type">Educación</span>
                    </div>
                    <div class="opportunity-item">
                        <h4>Desarrollo Comunitario</h4>
                        <p>Participa en proyectos de desarrollo sostenible</p>
                        <span class="opportunity-type">Comunidad</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary">Ver todas las oportunidades</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Animate elements on scroll
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.step, .opportunity-card, .testimonial-card, .feature-card, .country-card, .pricing-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Form validation
function validateForm() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ef4444';
                    isValid = false;
                } else {
                    input.style.borderColor = '#d1d5db';
                }
            });
            
            if (isValid) {
                showNotification('¡Formulario enviado correctamente!', 'success');
            } else {
                showNotification('Por favor, completa todos los campos requeridos', 'warning');
            }
        });
    });
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', validateForm);

// Add CSS for modals and notifications
const style = document.createElement('style');
style.textContent = `
    .search-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }
    
    .modal-content {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
    }
    
    .search-results {
        margin-top: 1.5rem;
        text-align: center;
    }
    
    .country-opportunities {
        margin-bottom: 1.5rem;
    }
    
    .opportunity-item {
        padding: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        margin-bottom: 1rem;
        transition: all 0.3s ease;
    }
    
    .opportunity-item:hover {
        background: #f8fafc;
        border-color: #2563eb;
    }
    
    .opportunity-item h4 {
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    
    .opportunity-item p {
        color: #6b7280;
        margin-bottom: 0.5rem;
    }
    
    .opportunity-type {
        background: #2563eb;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .modal-footer {
        text-align: center;
        margin-top: 1.5rem;
    }
    
    .pricing-card.selected {
        border-color: #10b981;
        background: #f0fdf4;
    }
    
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 1rem 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        z-index: 1500;
        animation: slideIn 0.3s ease;
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-warning {
        border-left: 4px solid #f59e0b;
    }
    
    .notification-info {
        border-left: 4px solid #3b82f6;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification-success i {
        color: #10b981;
    }
    
    .notification-warning i {
        color: #f59e0b;
    }
    
    .notification-info i {
        color: #3b82f6;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .nav-menu.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border-top: 1px solid #e5e7eb;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;

document.head.appendChild(style);

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.opportunity-card, .testimonial-card, .feature-card, .country-card, .pricing-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Country card click functionality
    const countryCards = document.querySelectorAll('.country-card');
    countryCards.forEach(card => {
        card.addEventListener('click', () => {
            const countryName = card.querySelector('h3').textContent;
            showCountryOpportunities(countryName);
        });
    });

    // Pricing card selection
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            pricingCards.forEach(c => c.classList.remove('selected'));
            // Add active class to clicked card
            card.classList.add('selected');
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn-primary, .btn-secondary, .btn-outline {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

document.head.appendChild(rippleStyle);

// Carrusel - Versión simplificada y robusta
window.currentSlideIndex = 0;
window.carouselInterval = null;
window.carouselAutoPlayDelay = 7000; // 7 segundos entre cambios
window.carouselPaused = false;
window.progressBarPaused = false;
window.progressBarStartTime = null;
window.progressBarElapsed = 0;

function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!track || !slides || slides.length === 0) {
        console.log('Elementos del carrusel no encontrados');
        return;
    }
    
    // Cambiar índice
    if (direction === 'next') {
        window.currentSlideIndex = (window.currentSlideIndex + 1) % slides.length;
    } else if (direction === 'prev') {
        window.currentSlideIndex = (window.currentSlideIndex - 1 + slides.length) % slides.length;
    } else if (typeof direction === 'number') {
        window.currentSlideIndex = direction;
    }
    
    // Calcular posición
    const translateX = -window.currentSlideIndex * 100;
    
    // Aplicar transformación
    track.style.transform = 'translateX(' + translateX + '%)';
    track.style.webkitTransform = 'translateX(' + translateX + '%)';
    track.style.MozTransform = 'translateX(' + translateX + '%)';
    track.style.msTransform = 'translateX(' + translateX + '%)';
    
    // Actualizar indicadores
    indicators.forEach(function(indicator, index) {
        if (index === window.currentSlideIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    console.log('Carrusel movido a slide', window.currentSlideIndex + 1);
    
    // Reiniciar la barra de progreso después de cada cambio
    resetProgressBar();
}

// Función para iniciar el auto-play del carrusel
function startCarouselAutoPlay(resetBar = true) {
    // Limpiar intervalo existente si hay uno
    if (window.carouselInterval) {
        clearInterval(window.carouselInterval);
        window.carouselInterval = null;
    }
    
    window.carouselPaused = false;
    
    // Reiniciar la barra de progreso solo si se solicita
    if (resetBar) {
        resetProgressBar();
    } else {
        resumeProgressBar();
    }
    
    // Crear nuevo intervalo
    window.carouselInterval = setInterval(function() {
        if (!window.carouselPaused) {
            console.log('Auto-play: cambiando al siguiente slide');
            moveCarousel('next');
        }
    }, window.carouselAutoPlayDelay);
    
    console.log('Auto-play iniciado, intervalo:', window.carouselAutoPlayDelay, 'ms');
}

// Función para animar la barra de progreso
function resetProgressBar() {
    const progressFill = document.querySelector('.carousel-progress-fill');
    if (progressFill) {
        window.progressBarPaused = false;
        window.progressBarElapsed = 0;
        window.progressBarStartTime = Date.now();
        
        // Detener cualquier animación en curso
        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        
        // Forzar reflow para aplicar el cambio inmediatamente
        void progressFill.offsetWidth;
        
        // Pequeño delay para asegurar que el reset se aplique
        setTimeout(function() {
            // Iniciar nueva animación
            progressFill.style.transition = 'width ' + (window.carouselAutoPlayDelay / 1000) + 's linear';
            progressFill.style.width = '100%';
            window.progressBarStartTime = Date.now();
        }, 10);
    }
}

// Función para pausar la barra de progreso
function pauseProgressBar() {
    const progressFill = document.querySelector('.carousel-progress-fill');
    if (progressFill && !window.progressBarPaused) {
        window.progressBarPaused = true;
        const computedStyle = getComputedStyle(progressFill);
        const currentWidth = parseFloat(computedStyle.width) || 0;
        const containerWidth = progressFill.parentElement.offsetWidth;
        const percentage = (currentWidth / containerWidth) * 100;
        
        // Calcular tiempo transcurrido
        if (window.progressBarStartTime) {
            const elapsed = Date.now() - window.progressBarStartTime;
            window.progressBarElapsed = (percentage / 100) * window.carouselAutoPlayDelay;
        }
        
        // Pausar la animación
        progressFill.style.transition = 'none';
        progressFill.style.width = percentage + '%';
    }
}

// Función para reanudar la barra de progreso
function resumeProgressBar() {
    const progressFill = document.querySelector('.carousel-progress-fill');
    if (progressFill && window.progressBarPaused) {
        window.progressBarPaused = false;
        const computedStyle = getComputedStyle(progressFill);
        const currentWidth = parseFloat(computedStyle.width) || 0;
        const containerWidth = progressFill.parentElement.offsetWidth;
        const percentage = (currentWidth / containerWidth) * 100;
        
        // Calcular tiempo restante
        const remainingTime = window.carouselAutoPlayDelay - window.progressBarElapsed;
        
        if (remainingTime > 0 && percentage < 100) {
            // Forzar reflow
            void progressFill.offsetWidth;
            
            // Continuar desde donde estaba
            progressFill.style.transition = 'width ' + (remainingTime / 1000) + 's linear';
            progressFill.style.width = '100%';
            window.progressBarStartTime = Date.now() - window.progressBarElapsed;
        } else {
            // Si ya pasó el tiempo o está completa, reiniciar
            resetProgressBar();
        }
    }
}

// Función para detener el auto-play
function stopCarouselAutoPlay() {
    if (window.carouselInterval) {
        clearInterval(window.carouselInterval);
        window.carouselInterval = null;
    }
    window.carouselPaused = true;
    pauseProgressBar();
}

// Función para reiniciar el auto-play (útil después de interacciones manuales)
function resetCarouselAutoPlay() {
    stopCarouselAutoPlay();
    startCarouselAutoPlay();
}

// Inicializar carrusel cuando el DOM esté listo
function initCarouselButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    const carouselContainer = document.querySelector('.carousel-container');
    
    // Botón anterior
    if (prevBtn) {
        prevBtn.onclick = function() {
            resetCarouselAutoPlay();
            moveCarousel('prev');
            return false;
        };
        console.log('Botón anterior configurado');
    }
    
    // Botón siguiente
    if (nextBtn) {
        nextBtn.onclick = function() {
            resetCarouselAutoPlay();
            moveCarousel('next');
            return false;
        };
        console.log('Botón siguiente configurado');
    }
    
    // Indicadores
    indicators.forEach(function(indicator, index) {
        indicator.onclick = function() {
            resetCarouselAutoPlay();
            moveCarousel(index);
            return false;
        };
    });
    
    if (indicators.length > 0) {
        console.log('Indicadores configurados:', indicators.length);
    }
    
    // No pausar al hacer hover - el carrusel sigue funcionando normalmente
    
    // Inicializar posición
    moveCarousel(0);
    
    // Iniciar auto-play
    startCarouselAutoPlay();
}

// Inicializar el carrusel cuando el DOM esté listo
(function() {
    'use strict';
    let carouselInitialized = false;

    function tryInitCarousel() {
        if (!carouselInitialized) {
            const track = document.getElementById('carouselTrack');
            if (track) {
                initCarouselButtons();
                carouselInitialized = true;
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInitCarousel);
    } else {
        tryInitCarousel();
    }
})();
