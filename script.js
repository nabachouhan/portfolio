// ===== MOBILE MENU TOGGLE =====
document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
    document.querySelector('.nav-links').classList.toggle('active');
    this.querySelector('i').classList.toggle('fa-bars');
    this.querySelector('i').classList.toggle('fa-times');
});

// ===== EXPANDABLE EXPERIENCE ITEMS =====
document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const details = this.previousElementSibling;
        const isExpanded = details.classList.toggle('expanded');
        this.classList.toggle('active');

        if (isExpanded) {
            this.innerHTML = `Read Less <i class="fas fa-chevron-down"></i>`;
        } else {
            this.innerHTML = `Read More <i class="fas fa-chevron-down"></i>`;
        }
    });
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    icon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');

    if (isDark) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// ===== CLOSE MOBILE MENU ON LINK CLICK =====
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
        document.querySelector('.mobile-menu-btn i').classList.remove('fa-times');
        document.querySelector('.mobile-menu-btn i').classList.add('fa-bars');
    });
});

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll('.fade-in');
const experienceItems = document.querySelectorAll('.experience-item');

const animateOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;

    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < triggerBottom) {
            element.classList.add('visible');
        }
    });

    experienceItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        if (itemTop < triggerBottom) {
            item.classList.add('visible');
        }
    });
};

window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// ===== ACTIVE NAV HIGHLIGHT (IntersectionObserver) =====
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${id}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// ===== PAGE LOAD INITIALIZATIONS =====
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.hero-text').style.animationDelay = '0.2s';
    document.querySelector('.hero-image').style.animationDelay = '0.4s';

    document.querySelectorAll('.stat-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.experience-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
    });

    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});

// ===== LOAD PROJECTS FROM JSON =====
let globalProjectsData = [];

async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();
        globalProjectsData = projects;

        const container = document.getElementById('projects-container');
        if (!container) return;
        container.innerHTML = '';

        projects.forEach(project => {
            const customIcon = project.id === 1 ? 'fa-map-marked-alt' : project.id === 2 ? 'fa-database' : 'fa-satellite';

            const techTags = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

            const html = `
                <div class="project-card fade-in visible" style="transition-delay: 0.1s;">
                    <div class="project-img-container">
                        <img src="${project.image}" alt="${project.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tech">
                            ${techTags}
                        </div>
                        <button class="view-more-btn" onclick="openProjectModal(${project.id})">View More <i class="fas fa-arrow-right"></i></button>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        const container = document.getElementById('projects-container');
        if (container) container.innerHTML = '<p>Error loading projects data.</p>';
    }
}

// ===== PROJECT MODAL =====
const modal = document.getElementById('projectModal');
const closeModalBtn = document.getElementsByClassName('close-modal')[0];

function openProjectModal(id) {
    const project = globalProjectsData.find(p => p.id === id);
    if (!project) return;

    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDate').textContent = project.date;
    if (Array.isArray(project.details)) {
        const detailsHtml = '<ul class="modal-details-list">' + project.details.map(d => `<li>${d}</li>`).join('') + '</ul>';
        document.getElementById('modalDesc').innerHTML = detailsHtml;
    } else {
        document.getElementById('modalDesc').textContent = project.details;
    }

    if (project.image) {
        document.getElementById('modalImg').src = project.image;
        document.getElementById('modalImg').style.display = 'block';
    } else {
        document.getElementById('modalImg').style.display = 'none';
    }

    const techHtml = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    document.getElementById('modalTech').innerHTML = techHtml;

    const modalLink = document.getElementById('modalLink');
    if (project.link && project.link.trim() !== '') {
        modalLink.href = project.link;
        modalLink.style.display = 'inline-flex';
    } else {
        modalLink.style.display = 'none';
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

if (closeModalBtn) {
    closeModalBtn.onclick = function () {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
};

// ===== CONTACT FORM (EmailJS) =====
// Initialize EmailJS — replace 'YOUR_PUBLIC_KEY' with your EmailJS public key
emailjs.init({ publicKey: 'YByXT_HQPAOAQLc1s' });

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your EmailJS IDs
        emailjs.sendForm('service_fxzm0yd', 'template_o7ab5bj', this)
            .then(() => {
                alert('Message sent successfully! I will get back to you soon.');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                alert('Failed to send message. Please try again or email me directly at nabakkrr@gmail.com');
            })
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
    });
}

// ===== LOAD SKILLS FROM JSON =====
async function loadSkills() {
    try {
        const response = await fetch('skills.json');
        const categories = await response.json();

        const container = document.getElementById('arsenal-container');
        if (!container) return;
        container.innerHTML = '';

        categories.forEach(category => {
            const skillItems = category.skills.map(skill =>
                `<div class="arsenal-item"><i class="${skill.icon}"></i> <span>${skill.name}</span></div>`
            ).join('');

            const html = `
                <div class="arsenal-card fade-in visible">
                    <div class="arsenal-card-header">
                        <div class="arsenal-icon"><i class="${category.icon}"></i></div>
                        <h3>${category.title}</h3>
                    </div>
                    <div class="arsenal-items">
                        ${skillItems}
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    loadProjects();
});
