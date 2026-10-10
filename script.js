const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const backToTop = document.querySelector("#backToTop");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Buka menu");
    });
  });
}

if (backToTop) {
  const updateBackToTop = () => {
    backToTop.classList.toggle("visible", window.scrollY > 450);
  };
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
