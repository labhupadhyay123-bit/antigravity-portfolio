const qid = id => document.getElementById(id);

// Typing Effect for Subtitle
const words = ['AI & Machine Learning Engineer', 'Creative Developer', 'Debugging Enthusiast', 'Tech Innovator'];
let i = 0, j = 0, isDeleting = false;
const typedText = document.getElementById('typed-text');

function typeEffect() {
    if(!typedText) return;
    const currentWord = words[i];
    
    if (isDeleting) {
        typedText.textContent = currentWord.substring(0, j - 1);
        j--;
    } else {
        typedText.textContent = currentWord.substring(0, j + 1);
        j++;
    }

    let speed = isDeleting ? 40 : 80;
    
    if (!isDeleting && j === currentWord.length) {
        speed = 2500; // Pause at the end of word
        isDeleting = true;
    } else if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % words.length;
        speed = 500; // Pause before new word
    }
    setTimeout(typeEffect, speed);
}
// Start typing effect
typeEffect();

// Background Particle Graphics (Moving network nodes effect)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];
let w, h;

function initCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', initCanvas);
initCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.size = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = (w * h) / 10000; // Responsive amount
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Lines
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(17, 17, 17, ${1 - dist/120})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// 3D Tilt Effect on Dynamic Cards
const interactiveCards = document.querySelectorAll('.glass-card');
interactiveCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
});

// Custom Magnetic Cursor Logic
const cDot = document.createElement('div');
cDot.className = 'cursor-dot';
document.body.appendChild(cDot);

const cOutline = document.createElement('div');
cOutline.className = 'cursor-outline';
document.body.appendChild(cOutline);

window.addEventListener('mousemove', function(e) {
    const x = e.clientX;
    const y = e.clientY;
    
    cDot.style.left = `${x}px`;
    cDot.style.top = `${y}px`;
    
    cOutline.animate({
        left: `${x}px`,
        top: `${y}px`
    }, { duration: 400, fill: "forwards" });
});

// Magnetic scaling effect
const magneticTargets = document.querySelectorAll('.magnetic-target, .btn, a, .image-wrapper, .cert-image-wrapper');
magneticTargets.forEach(target => {
    target.addEventListener('mouseenter', () => cOutline.classList.add('cursor-grow'));
    target.addEventListener('mouseleave', () => cOutline.classList.remove('cursor-grow'));
});

// Layout Adjustments - Scroll Animation Staggers and Intersection Observers
document.querySelectorAll('.page-section').forEach(section => {
    const items = section.querySelectorAll('.section-title, .glass-card, .skill-card, .timeline-item, .hero-content > *, .image-wrapper, .project-card');
    items.forEach((item, index) => {
        item.classList.add('stagger-item');
        // Add varying translation delays via transition delays based on index
        const delay = Math.min(index * 0.1, 0.4);
        item.style.transitionDelay = `${delay}s, ${delay}s`;
    });
});

// Trigger scroll animations continuously
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.stagger-item').forEach(item => {
    observer.observe(item);
});


// Shrink Nav on scroll
const mainNav = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        mainNav.style.padding = '15px 60px';
    } else {
        mainNav.style.padding = '25px 60px';
    }
});


// Automatic highlighted Nav items based on Scroll spy
const sections = document.querySelectorAll('.page-section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active-nav');
        }
    });
});

// Smooth Scroll Links
document.querySelectorAll('.page-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Modals and uploads removed as requested.

// Glowing Click Ripples
document.addEventListener('click', function(e) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 700);
});
