document.addEventListener("DOMContentLoaded", () => {
    // 1. Rok w stopce
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. LIGHTBOX GALERII
    const galleryImages = Array.from(
        document.querySelectorAll("#projects .project-card img")
    );
    let currentIndex = -1;

    if (galleryImages.length > 0) {
        const lightbox = document.createElement("div");
        lightbox.className = "lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-hidden", "true");

        lightbox.innerHTML = `
      <div class="lightbox-inner">
        <button class="lightbox-close" type="button" aria-label="Zamknij podgląd">&times;</button>
        <img class="lightbox-image" src="" alt="">
        <p class="lightbox-caption"></p>
        <div class="lightbox-controls">
          <button class="lightbox-prev" type="button" aria-label="Poprzednie zdjęcie">&#10094;</button>
          <button class="lightbox-next" type="button" aria-label="Następne zdjęcie">&#10095;</button>
        </div>
      </div>
    `;

        document.body.appendChild(lightbox);

        const imgEl = lightbox.querySelector(".lightbox-image");
        const captionEl = lightbox.querySelector(".lightbox-caption");
        const closeBtn = lightbox.querySelector(".lightbox-close");
        const prevBtn = lightbox.querySelector(".lightbox-prev");
        const nextBtn = lightbox.querySelector(".lightbox-next");

        function updateLightbox(index) {
            const img = galleryImages[index];
            imgEl.src = img.src;
            imgEl.alt = img.alt || "";
            const figcaption = img.closest("figure")?.querySelector("figcaption");
            captionEl.textContent = figcaption ? figcaption.textContent.trim() : "";
        }

        function openLightbox(index) {
            currentIndex = index;
            updateLightbox(currentIndex);
            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");
        }

        function closeLightbox() {
            lightbox.classList.remove("is-open");
            lightbox.setAttribute("aria-hidden", "true");
        }

        function showNext(delta) {
            if (currentIndex === -1) return;
            const total = galleryImages.length;
            currentIndex = (currentIndex + delta + total) % total;
            updateLightbox(currentIndex);
        }

        galleryImages.forEach((img, index) => {
            img.style.cursor = "zoom-in";
            img.addEventListener("click", () => openLightbox(index));
        });

        closeBtn.addEventListener("click", closeLightbox);

        // zamknięcie po kliknięciu w tło
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        prevBtn.addEventListener("click", () => showNext(-1));
        nextBtn.addEventListener("click", () => showNext(1));

        // klawiatura: ESC / strzałki
        document.addEventListener("keydown", (event) => {
            if (!lightbox.classList.contains("is-open")) return;
            if (event.key === "Escape") {
                closeLightbox();
            } else if (event.key === "ArrowRight") {
                showNext(1);
            } else if (event.key === "ArrowLeft") {
                showNext(-1);
            }
        });
    }

    // 3. ANIMACJA POJAWIANIA SIĘ (SCROLL REVEAL)
    const revealElements = document.querySelectorAll(
        ".section, .info-card, .service-card, .project-card, .review-card"
    );

    revealElements.forEach((el) => el.classList.add("reveal"));

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal--visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        revealElements.forEach((el) => revealObserver.observe(el));
    } else {
        // fallback dla starych przeglądarek
        revealElements.forEach((el) => el.classList.add("reveal--visible"));
    }

    // 4. SCROLL-SPY W MENU
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');

    const navById = {};
    navLinks.forEach((link) => {
        const id = link.getAttribute("href").slice(1);
        navById[id] = link;
    });

    if ("IntersectionObserver" in window) {
        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.id;
                    const link = navById[id];
                    if (!link) return;
                    if (entry.isIntersecting) {
                        navLinks.forEach((l) => l.classList.remove("nav-link--active"));
                        link.classList.add("nav-link--active");
                    }
                });
            },
            {
                threshold: 0.4,
            }
        );

        sections.forEach((section) => navObserver.observe(section));
    }

    // 5. PRZYCISK "DO GÓRY"
    const backToTopBtn = document.querySelector(".back-to-top");
    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add("is-visible");
            } else {
                backToTopBtn.classList.remove("is-visible");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
    }
});
