/**
 * AMAN GUPT - PORTFOLIO INTERACTIVE CONTROLLER
 * Functions:
 * 1. Sticky Institutional Header & Scroll State
 * 2. Scrollspy Navigation Indicator
 * 3. Mobile Navigation Drawer
 * 4. Project Filters (All, Web, App, Game, E-Commerce)
 * 5. Achievements & Newspaper Lightbox with Zoom & Drag Controls
 * 6. Contact Form Validation, Anti-Spam & Backend Delivery
 * 7. Resume Download Verification & Management
 * 8. Real-time GitHub Activity with Resilient Fallback
 * 9. Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initScrollspy();
    initMobileMenu();
    initProjectFilters();
    initAchievementsGallery();
    initLightbox();
    initImageLoadStates();
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

    if (!sections.length || !headerLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                headerLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
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
            toggleBtn.setAttribute('aria-expanded', 'false');
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

            const filterValue = (btn.getAttribute('data-filter') || 'all').toLowerCase();

            projectCards.forEach(card => {
                const categories = (card.getAttribute('data-category') || '').toLowerCase().split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
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
   5. ACHIEVEMENTS & NEWSPAPER CUTTING LIGHTBOX CONTROLLER
   -------------------------------------------------------------------------- */
const NEWSPAPER_GALLERY = [
    {
        src: "https://i.pinimg.com/736x/f6/c7/6b/f6c76bab8160cadaf8a6ffe9ce821ac1.jpg",
        tag: "Hindustan National Daily · Press Feature",
        title: "रोबोट उखाड़ेगा खरपतवार और कोस्मीरा बढ़ाएगा कारोबार",
        desc: "Featured in Hindustan newspaper for startup innovation at Sir Chhotu Ram Institute of Engineering & Technology (SCRIET). Highlights Aman Gupt as CEO of Cosmeera revolutionizing local digital commerce and customer delivery."
    },
    {
        src: "https://i.pinimg.com/736x/e1/aa/a7/e1aaa7c75574c1d6d28d9bd3a9c30bd8.jpg",
        tag: "Daily Press Coverage · Innovation Challenge",
        title: "सेवा फर्स्ट इनोवेशन चैलेंज में विद्यार्थियों ने पेश किए मॉडल और विचार, मिली सराहना",
        desc: "Press coverage of the Seva First Innovation Challenge at CCS University. Showcases student tech innovators demonstrating smart road safety solutions and the code.scriet technical community's full-stack infrastructure model."
    },
    {
        src: "https://i.pinimg.com/736x/c3/ac/6a/c3ac6a9fc140c5969292420515a7e0db.jpg",
        tag: "Institutional Felicitation · CCS University",
        title: "Aarambh '26 University Leadership Felicitation Ceremony",
        desc: "Grand stage felicitation ceremony at Chaudhary Charan Singh University / SCRIET during Aarambh '26 in the presence of university leadership, faculty coordinators, and student innovators."
    },
    {
        src: "https://i.pinimg.com/736x/7f/85/df/7f85dfe6669771ce4c1f5c36365b75bd.jpg",
        tag: "Director's Recognition · Oct 26, 2026",
        title: "Certificate of Appreciation — Founding Cosmeera",
        desc: "Proudly awarded to Aman Gupt by Director SCRIET Prof. (Dr.) Niraj Singhal for founding Cosmeera, empowering small local shops in Gorakhpur and Maharajganj, and single-handedly designing, developing and launching the platform."
    }
];

const HONORS_GALLERY = [
    {
        src: "assets/memento.jpg",
        tag: "Institutional Honor · SCRIET & Unnat Bharat Abhiyan",
        title: "Student Volunteer Recognition Memento",
        desc: "Presented at the International Conference on Scientific Collaboration on Research Innovation, Education and Technology (SCRIET) & Unnat Bharat Abhiyan (March 11–12, 2026)."
    },
    {
        src: "assets/newspaper.jpg",
        tag: "Press Coverage · City Halchal / Dainik Bhilwara",
        title: "Newspaper & Press Coverage",
        desc: "Featured in local press ('सिटी हलचल') for active participation and technical demonstrations in the international conference on health and data science."
    }
];

let activeGallery = NEWSPAPER_GALLERY;
let currentLightboxIdx = 0;
let currentZoom = 1.0;
let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;

function initAchievementsGallery() {
    // 1. Newspaper cuttings gallery cards (Items 0 to 3)
    const newspaperCards = document.querySelectorAll('.newspaper-grid [data-gallery-index]');
    newspaperCards.forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.getAttribute('data-gallery-index'), 10);
            if (!isNaN(idx) && idx >= 0 && idx < NEWSPAPER_GALLERY.length) {
                activeGallery = NEWSPAPER_GALLERY;
                openLightbox(idx);
            }
        });
    });

    // 2. Preserved Institutional Honors cards (Items 4 and 5 in HTML, mapped to 0 and 1 in HONORS_GALLERY)
    const honorCards = document.querySelectorAll('.achievements-grid [data-gallery-index]');
    honorCards.forEach((card, i) => {
        card.addEventListener('click', () => {
            if (i >= 0 && i < HONORS_GALLERY.length) {
                activeGallery = HONORS_GALLERY;
                openLightbox(i);
            }
        });
    });
}

function initImageLoadStates() {
    const wrappers = document.querySelectorAll('.newspaper-media-wrapper');
    wrappers.forEach(wrapper => {
        const img = wrapper.querySelector('.newspaper-img');
        if (!img) return;

        function markLoaded() {
            wrapper.classList.add('loaded');
        }

        function markError() {
            wrapper.classList.remove('loaded');
            if (!wrapper.querySelector('.media-error-badge')) {
                const errBox = document.createElement('div');
                errBox.className = 'media-error-badge';
                errBox.innerHTML = `
                    <span>⚠️ Unable to load cutting</span>
                    <button type="button" class="btn-retry-image">Retry</button>
                `;
                const retryBtn = errBox.querySelector('.btn-retry-image');
                retryBtn?.addEventListener('click', (e) => {
                    e.stopPropagation();
                    errBox.remove();
                    const clean = img.src.split('?')[0];
                    img.src = `${clean}?t=${Date.now()}`;
                });
                wrapper.appendChild(errBox);
            }
        }

        if (img.complete && img.naturalWidth > 0) {
            markLoaded();
        } else {
            img.addEventListener('load', markLoaded);
            img.addEventListener('error', markError);
        }
    });
}

function initLightbox() {
    const lightbox = document.getElementById('mediaLightbox');
    const closeBtn = document.getElementById('lightboxClose');
    const backdrop = document.getElementById('lightboxBackdrop');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const zoomInBtn = document.getElementById('lightboxZoomIn');
    const zoomOutBtn = document.getElementById('lightboxZoomOut');
    const zoomResetBtn = document.getElementById('lightboxZoomReset');
    const canvas = document.getElementById('lightboxCanvas');
    const viewport = document.getElementById('lightboxViewport');

    if (!lightbox) return;

    // Close actions
    closeBtn?.addEventListener('click', closeLightbox);
    backdrop?.addEventListener('click', closeLightbox);

    // Nav actions
    prevBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
    });
    nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
    });

    // Zoom controls
    zoomInBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        setZoom(currentZoom + 0.35);
    });
    zoomOutBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        setZoom(currentZoom - 0.35);
    });
    zoomResetBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        resetZoom();
    });

    // Double-click toggle zoom
    canvas?.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (currentZoom > 1.05) {
            resetZoom();
        } else {
            setZoom(2.0);
        }
    });

    // Mouse wheel zoom
    viewport?.addEventListener('wheel', (e) => {
        if (!lightbox.classList.contains('active')) return;
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.2 : -0.2;
        setZoom(currentZoom + delta);
    }, { passive: false });

    // Drag / Pan implementation
    if (canvas) {
        canvas.addEventListener('mousedown', (e) => {
            if (currentZoom <= 1.0) return;
            e.preventDefault();
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            canvas.classList.add('dragging');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            applyTransform();
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                canvas.classList.remove('dragging');
            }
        });

        // Touch support (Drag & Pinch)
        let initialDistance = 0;
        let initialScale = 1.0;

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1 && currentZoom > 1.0) {
                isDragging = true;
                startX = e.touches[0].clientX - translateX;
                startY = e.touches[0].clientY - translateY;
            } else if (e.touches.length === 2) {
                isDragging = false;
                initialDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                initialScale = currentZoom;
            }
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            if (isDragging && e.touches.length === 1) {
                translateX = e.touches[0].clientX - startX;
                translateY = e.touches[0].clientY - startY;
                applyTransform();
            } else if (e.touches.length === 2 && initialDistance > 0) {
                const currentDistance = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                const scale = initialScale * (currentDistance / initialDistance);
                setZoom(scale);
            }
        }, { passive: true });

        canvas.addEventListener('touchend', () => {
            isDragging = false;
            initialDistance = 0;
        });
    }

    // Keyboard support
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
            case '+':
            case '=':
                setZoom(currentZoom + 0.35);
                break;
            case '-':
            case '_':
                setZoom(currentZoom - 0.35);
                break;
            case '0':
                resetZoom();
                break;
        }
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('mediaLightbox');
    if (!lightbox) return;

    currentLightboxIdx = index;
    updateLightboxContent();
    resetZoom();

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('mediaLightbox');
    if (!lightbox) return;

    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetZoom();
}

function navigateLightbox(step) {
    currentLightboxIdx = (currentLightboxIdx + step + activeGallery.length) % activeGallery.length;
    resetZoom();
    updateLightboxContent();
}

function updateLightboxContent() {
    const item = activeGallery[currentLightboxIdx];
    if (!item) return;

    const img = document.getElementById('lightboxImg');
    const tag = document.getElementById('lightboxTag');
    const title = document.getElementById('lightboxTitle');
    const desc = document.getElementById('lightboxDesc');
    const currentIdxEl = document.getElementById('lightboxCurrentIdx');
    const totalCountEl = document.getElementById('lightboxTotalCount');

    if (img) {
        img.src = item.src;
        img.alt = item.title;
    }
    if (tag) tag.textContent = item.tag;
    if (title) title.textContent = item.title;
    if (desc) desc.textContent = item.desc;
    if (currentIdxEl) currentIdxEl.textContent = currentLightboxIdx + 1;
    if (totalCountEl) totalCountEl.textContent = activeGallery.length;
}

function setZoom(scale) {
    currentZoom = Math.min(Math.max(scale, 1.0), 3.5);
    const canvas = document.getElementById('lightboxCanvas');
    const zoomLevelEl = document.getElementById('lightboxZoomLevel');

    if (currentZoom <= 1.0) {
        translateX = 0;
        translateY = 0;
        canvas?.classList.remove('zoomed');
    } else {
        canvas?.classList.add('zoomed');
    }

    if (zoomLevelEl) {
        zoomLevelEl.textContent = `${Math.round(currentZoom * 100)}%`;
    }

    applyTransform();
}

function resetZoom() {
    currentZoom = 1.0;
    translateX = 0;
    translateY = 0;
    const canvas = document.getElementById('lightboxCanvas');
    const zoomLevelEl = document.getElementById('lightboxZoomLevel');

    canvas?.classList.remove('zoomed');
    if (zoomLevelEl) zoomLevelEl.textContent = '100%';
    applyTransform();
}

function applyTransform() {
    const canvas = document.getElementById('lightboxCanvas');
    if (canvas) {
        canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    }
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM: VALIDATION, ANTI-SPAM & EMAIL DELIVERY
   -------------------------------------------------------------------------- */
function initContactForm() {
    const contactForm = document.getElementById('portfolioContactForm');
    const alertBox = document.getElementById('formStatusAlert');
    const submitBtn = document.getElementById('contactSubmitBtn');

    if (!contactForm) return;

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const subjectInput = document.getElementById('senderSubject');
    const messageInput = document.getElementById('senderMessage');
    const honeypotInput = document.getElementById('formHoneypot');

    // Real-time error clearance
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup) formGroup.classList.remove('has-error');
            const errorSpan = formGroup?.querySelector('.field-error-msg');
            if (errorSpan) errorSpan.classList.remove('visible');
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear existing alerts
        hideAlert();

        const nameVal = nameInput?.value.trim() || '';
        const emailVal = emailInput?.value.trim() || '';
        const subjectVal = subjectInput?.value.trim() || '';
        const messageVal = messageInput?.value.trim() || '';
        const honeypotVal = honeypotInput?.value.trim() || '';

        // Validation flags
        let hasErrors = false;

        if (!nameVal || nameVal.length < 2) {
            showFieldError(nameInput, 'Please enter your full name (at least 2 characters).');
            hasErrors = true;
        }

        if (!emailVal || !isValidEmail(emailVal)) {
            showFieldError(emailInput, 'Please enter a valid email address.');
            hasErrors = true;
        }

        if (!subjectVal || subjectVal.length < 2) {
            showFieldError(subjectInput, 'Please provide a subject for your message.');
            hasErrors = true;
        }

        if (!messageVal || messageVal.length < 5) {
            showFieldError(messageInput, 'Please enter a message of at least 5 characters.');
            hasErrors = true;
        }

        if (hasErrors) return;

        // Anti-spam check (honeypot field)
        if (honeypotVal) {
            showAlert("Thank you for reaching out! Your message has been sent successfully. I'll get back to you soon.", 'success');
            contactForm.reset();
            return;
        }

        // Set Loading State
        setLoadingState(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: nameVal,
                    email: emailVal,
                    subject: subjectVal,
                    message: messageVal,
                    _gotcha: honeypotVal
                })
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok && data.success) {
                showAlert("Thank you for reaching out! Your message has been sent successfully. I'll get back to you soon.", 'success');
                contactForm.reset();
            } else {
                const errorMsg = data.error || "Sorry, your message couldn't be sent. Please try again or contact me directly by email.";
                showAlert(errorMsg, 'error');
                // Note: user entered data is preserved!
            }
        } catch (networkError) {
            console.error('Contact form transmission error:', networkError);
            showAlert("Sorry, your message couldn't be sent. Please try again or contact me directly by email.", 'error');
            // Entered data is preserved
        } finally {
            setLoadingState(false);
        }
    });

    function showFieldError(inputEl, msg) {
        if (!inputEl) return;
        const group = inputEl.closest('.form-group');
        if (group) group.classList.add('has-error');
        const errSpan = group?.querySelector('.field-error-msg');
        if (errSpan) {
            errSpan.textContent = msg;
            errSpan.classList.add('visible');
        }
    }

    function showAlert(msg, type) {
        if (!alertBox) return;
        alertBox.textContent = msg;
        alertBox.className = `form-status-alert ${type}`;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideAlert() {
        if (!alertBox) return;
        alertBox.className = 'form-status-alert';
        alertBox.textContent = '';
    }

    function setLoadingState(isLoading) {
        if (!submitBtn) return;
        const btnText = submitBtn.querySelector('.btn-text');

        if (isLoading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Sending Message...';
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = 'Send Message';
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

/* --------------------------------------------------------------------------
   7. RESUME DOWNLOAD AUDIT & HANDLER
   -------------------------------------------------------------------------- */
function initResumeDownload() {
    const resumeButtons = document.querySelectorAll('.download-resume-btn');
    const RESUME_PATH = 'assets/Aman_Gupt_Resume.pdf';

    resumeButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();

            try {
                // Check if the resume file actually exists on the server
                const checkResponse = await fetch(RESUME_PATH, { method: 'HEAD' });

                if (checkResponse.ok) {
                    // Trigger actual clean native file download
                    const tempLink = document.createElement('a');
                    tempLink.href = RESUME_PATH;
                    tempLink.download = 'Aman_Gupt_Resume.pdf';
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                } else {
                    showResumeModal();
                }
            } catch (err) {
                showResumeModal();
            }
        });
    });

    function showResumeModal() {
        const message = "Resume PDF (assets/Aman_Gupt_Resume.pdf) is currently being updated. You can email Aman directly at amangupt7373@gmail.com, or upload the resume PDF to assets/Aman_Gupt_Resume.pdf.";
        alert(message);
    }
}

/* --------------------------------------------------------------------------
   8. GITHUB ACTIVITY INTEGRATION WITH FALLBACK
   -------------------------------------------------------------------------- */
function initGitHubActivity() {
    const reposContainer = document.getElementById('githubReposGrid');
    if (!reposContainer) return;

    const fallbackRepos = [
        {
            name: "portfolio",
            description: "Personal developer portfolio website featuring projects, press recognition, and serverless contact API.",
            language: "JavaScript",
            stargazers_count: 5,
            forks_count: 2,
            html_url: "https://github.com/Its-aman18/portfolio"
        },
        {
            name: "nifty50_predictor",
            description: "Streamlit-based Machine Learning app for 7-day stock forecasts with risk analysis and real-time feeds.",
            language: "Python",
            stargazers_count: 4,
            forks_count: 1,
            html_url: "https://github.com/Its-aman18/nifty50_predictor"
        },
        {
            name: "zero-one",
            description: "Full-stack developer platform built with TypeScript, modern tooling and modular architecture.",
            language: "TypeScript",
            stargazers_count: 3,
            forks_count: 1,
            html_url: "https://github.com/Its-aman18/zero-one"
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
