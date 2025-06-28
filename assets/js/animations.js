// Handle mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    nav.classList.toggle('active');
    menuBtn.classList.toggle('fa-bars');
    menuBtn.classList.toggle('fa-times');
}

// Close mobile menu when clicking a link
function closeMobileMenu() {
    const nav = document.querySelector('nav');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuBtn.classList.add('fa-bars');
        menuBtn.classList.remove('fa-times');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Handle header scroll effect
    const header = document.querySelector('header');
    let lastScroll = 0;

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav ul li a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        header.classList.toggle('scrolled', currentScroll > 50);
        lastScroll = currentScroll;
        updateActiveNavLink();
    });

    // Initial call to set active link
    updateActiveNavLink();

    // Add click event to navigation links for mobile menu and smooth scroll
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    // Fade in sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Staggered animation for portfolio items
    const portfolioObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.6s ease-out ${index * 0.2}s forwards`;
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                portfolioObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    document.querySelectorAll('.portfolio-item').forEach(item => {
        portfolioObserver.observe(item);
    });
});