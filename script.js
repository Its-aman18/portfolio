function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("active");
    document.getElementById("menuToggle").classList.toggle("active");
}

function closeMenu() {
    document.getElementById("navLinks").classList.remove("active");
    document.getElementById("menuToggle").classList.remove("active");
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href"))
            .scrollIntoView({ behavior: "smooth" });
    });
});

const scrollTopBtn = document.getElementById("scrollTop");
window.addEventListener("scroll", () => {
    scrollTopBtn.classList.toggle("visible", window.scrollY > 300);
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
