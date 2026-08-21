/**
 * AMAN GUPT - PORTFOLIO INTERACTIVE CONTROLLER
 * Functions: Navigation scrollspy, sticky header behavior, project filtering,
 * Cosmeera product showcase carousel, contact form handling, resume triggers,
 * GitHub integration, animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initScrollspy();
    initMobileMenu();
    initProjectFilters();
    initContactForm();
    initResumeDownload();
    initGitHubActivity();
    initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. STICKY HEADER & SCROLL BEHAVIOR
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
    const topHeader = document.querySelector('.top-header');
    if (!topHeader) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            topHeader.classList.add('scrolled');
        } else {
            topHeader.classList.remove('scrolled');
        }
    });
}

/* --------------------------------------------------------------------------
   2. SCROLLSPY ACTIVE NAVIGATION INDICATOR
   -------------------------------------------------------------------------- */
function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const headerLinks = document.querySelectorAll('.header-nav a[href^="#"]');

    if (!sections.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                updateActiveLinks(currentId);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    function updateActiveLinks(activeId) {
        headerLinks.forEach(link => {
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

/* --------------------------------------------------------------------------
   3. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const headerNav = document.querySelector('.header-nav');
    const navLinks = document.querySelectorAll('.header-nav a');

    if (!toggleBtn || !headerNav) return;

    toggleBtn.addEventListener('click', () => {
        headerNav.classList.toggle('mobile-active');
        toggleBtn.setAttribute('aria-expanded', headerNav.classList.contains('mobile-active'));
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            headerNav.classList.remove('mobile-active');
        });
    });
}

/* --------------------------------------------------------------------------
   4. PROJECT FILTER SYSTEM
   -------------------------------------------------------------------------- */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = (card.getAttribute('data-category') || '').toLowerCase().split(' ');
                if (filterValue === 'all' || categories.includes(filterValue.toLowerCase())) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });
}



/* --------------------------------------------------------------------------
   6. CONTACT FORM VALIDATION & HANDLING
   -------------------------------------------------------------------------- */
function initContactForm() {
    const contactForm = document.getElementById('portfolioContactForm');
    const alertBox = document.getElementById('formStatusAlert');

    if (!contactForm || !alertBox) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('senderName')?.value.trim();
        const email = document.getElementById('senderEmail')?.value.trim();
        const message = document.getElementById('senderMessage')?.value.trim();

        if (!name || !email || !message) {
            showAlert('Please fill in all required fields.', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showAlert('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate successful form submission
        showAlert('Thank you, Aman has received your message and will respond shortly!', 'success');
        contactForm.reset();
    });

    function showAlert(msg, type) {
        alertBox.textContent = msg;
        alertBox.className = `form-status-alert ${type}`;
        setTimeout(() => {
            alertBox.className = 'form-status-alert';
        }, 6000);
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

/* --------------------------------------------------------------------------
   7. RESUME DOWNLOAD HANDLER
   -------------------------------------------------------------------------- */
function initResumeDownload() {
    const resumeButtons = document.querySelectorAll('.download-resume-btn');

    resumeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Aman Gupt's Resume: Requesting download for Aman_Gupt_Resume.pdf");
        });
    });
}

/* --------------------------------------------------------------------------
   8. GITHUB ACTIVITY INTEGRATION WITH FALLBACK
   -------------------------------------------------------------------------- */
function initGitHubActivity() {
    const reposContainer = document.getElementById('githubReposGrid');
    if (!reposContainer) return;

    const fallbackRepos = [
        {
            name: "Cosmeera-Ecommerce",
            description: "Full-fledged e-commerce platform for cosmetics built with HTML, CSS, JavaScript, and Firebase.",
            language: "JavaScript",
            stargazers_count: 5,
            forks_count: 2,
            html_url: "https://github.com/Its-aman18"
        },
        {
            name: "code.scriet-platform",
            description: "Official student community web portal for code.scriet technical club at CCS University.",
            language: "JavaScript",
            stargazers_count: 8,
            forks_count: 3,
            html_url: "https://github.com/Its-aman18"
        },
        {
            name: "Holly-Game-Interactive",
            description: "Interactive browser-based game created as part of international conference technical showcase.",
            language: "HTML/CSS",
            stargazers_count: 4,
            forks_count: 1,
            html_url: "https://github.com/Its-aman18"
        }
    ];

    fetch('https://api.github.com/users/Its-aman18/repos?sort=updated&per_page=3')
        .then(response => {
            if (!response.ok) throw new Error('GitHub API response not OK');
            return response.json();
        })
        .then(repos => {
            if (Array.isArray(repos) && repos.length > 0) {
                renderRepos(repos);
            } else {
                renderRepos(fallbackRepos);
            }
        })
        .catch(() => {
            renderRepos(fallbackRepos);
        });

    function renderRepos(repos) {
        reposContainer.innerHTML = repos.map(repo => `
            <div class="github-repo-card">
                <div class="repo-card-title">
                    <span>📦</span>
                    <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
                </div>
                <div class="repo-card-desc">${repo.description || 'Public repository by Aman Gupt.'}</div>
                <div class="project-tech-tags">
                    <span class="project-tech-tag">⚡ ${repo.language || 'Web'}</span>
                    <span class="project-tech-tag">⭐ ${repo.stargazers_count || 0} stars</span>
                    <span class="project-tech-tag">🍴 ${repo.forks_count || 0} forks</span>
                </div>
            </div>
        `).join('');
    }
}

/* --------------------------------------------------------------------------
   9. SCROLL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
}
