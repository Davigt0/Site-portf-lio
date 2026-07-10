// ===========================
// HELPERS
// ===========================
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ===========================
// MENU MOBILE
// ===========================
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

const closeMenu = () => {
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuBtn.textContent = "☰";
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Abrir menu");
};

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuBtn.textContent = isOpen ? "×" : "☰";
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// ===========================
// NAV, SCROLL PROGRESS & PARALLAX
// ===========================
const navbar = document.getElementById("navbar");
const parallaxItems = document.querySelectorAll(".parallax-item");
let latestScrollY = window.scrollY;
let ticking = false;

const updateScrollEffects = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (latestScrollY / maxScroll) * 100 : 0;

  navbar.classList.toggle("scrolled", latestScrollY > 20);
  document.documentElement.style.setProperty(
    "--scroll-progress",
    `${progress}%`,
  );
  document.documentElement.style.setProperty(
    "--scroll-progress-num",
    progress.toFixed(2),
  );

  if (!prefersReducedMotion) {
    parallaxItems.forEach((item) => {
      const depth = Number(item.dataset.depth || 0.06);
      const rect = item.getBoundingClientRect();
      const viewportOffset =
        rect.top + rect.height / 2 - window.innerHeight / 2;
      item.style.setProperty("--parallax-y", `${viewportOffset * depth}px`);
      item.style.transform = `translate3d(0, ${viewportOffset * depth}px, 0)`;
    });
  }

  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    latestScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  },
  { passive: true },
);

updateScrollEffects();

// ===========================
// REVEAL ON SCROLL
// ===========================
const revealElements = document.querySelectorAll(".reveal, .timeline-item");
const skillBars = document.querySelectorAll(".skill-bar");
const counters = document.querySelectorAll("[data-count]");

revealElements.forEach((el) => {
  const delay = el.dataset.delay || 0;
  el.style.setProperty("--delay", `${delay}ms`);
});

const animateCounter = (element) => {
  if (element.dataset.animated === "true") return;
  element.dataset.animated = "true";

  const target = Number(element.dataset.count);
  const duration = 1300;
  const start = performance.now();

  const step = (now) => {
    const progress = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = `${target}+`;
    }
  };

  window.requestAnimationFrame(step);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      if (entry.target.matches(".skill-card")) {
        const bar = entry.target.querySelector(".skill-bar");
        if (bar) {
          bar.style.setProperty("--level", `${bar.dataset.level}%`);
          bar.classList.add("filled");
        }
      }

      entry.target.querySelectorAll?.("[data-count]").forEach(animateCounter);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
);

revealElements.forEach((el) => revealObserver.observe(el));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.45 },
);

counters.forEach((counter) => counterObserver.observe(counter));

skillBars.forEach((bar) => {
  bar.style.setProperty("--level", `${bar.dataset.level}%`);
});

// ===========================
// ACTIVE NAV LINK
// ===========================
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");
      navAnchors.forEach((anchor) => {
        anchor.classList.toggle(
          "active",
          anchor.getAttribute("href") === `#${id}`,
        );
      });
    });
  },
  { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 },
);

sections.forEach((section) => sectionObserver.observe(section));

// ===========================
// PREMIUM HOVER: MOUSE FOLLOW + TILT
// ===========================
const interactiveCards = document.querySelectorAll(
  ".skill-card, .project-card, .contact-form",
);
const tiltCards = document.querySelectorAll(".tilt-card");

interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  });
});

if (!prefersReducedMotion) {
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = clamp(y * -10, -8, 8);
      const rotateY = clamp(x * 10, -8, 8);

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

// ===========================
// CONTACT FORM FEEDBACK
// ===========================
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

const showFormFeedback = (message, status) => {
  formFeedback.classList.remove("is-success", "is-error", "is-visible");

  // Força o reflow para permitir que a animação rode novamente em envios seguidos
  void formFeedback.offsetWidth;

  formFeedback.textContent = message;
  formFeedback.classList.add(
    "is-visible",
    status === "success" ? "is-success" : "is-error",
  );
};

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const formData = new FormData(contactForm);

  submitBtn.disabled = true;
  showFormFeedback("Enviando sua mensagem...", "success");
  formFeedback.classList.remove("is-success", "is-error");

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      showFormFeedback(
        "Mensagem enviada com sucesso! Em breve entrarei em contato.",
        "success",
      );
      contactForm.reset();
    } else {
      showFormFeedback(
        "Não foi possível enviar. Tente novamente em instantes.",
        "error",
      );
    }
  } catch (error) {
    showFormFeedback(
      "Falha na conexão. Verifique sua internet e tente novamente.",
      "error",
    );
  } finally {
    submitBtn.disabled = false;
  }
});
