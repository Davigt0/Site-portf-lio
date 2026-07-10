const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".nav-links a");
const cursorGlow = document.querySelector(".cursor-glow");

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }, { passive: true });

  const renderGlow = () => {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    requestAnimationFrame(renderGlow);
  };

  renderGlow();
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 8, 5) * 55}ms`;
  revealObserver.observe(element);
});

const parallaxItems = document.querySelectorAll(".parallax-layer");
let ticking = false;

const updateParallax = () => {
  const scrollY = window.scrollY;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0);
    item.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
  });
  ticking = false;
};

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

document.querySelectorAll(".ripple").forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const dot = document.createElement("span");
    dot.className = "ripple-dot";
    dot.style.left = `${event.clientX - rect.left}px`;
    dot.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove());
  });
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const testimonials = [...document.querySelectorAll(".testimonial")];
const prevButton = document.querySelector("[data-slider-prev]");
const nextButton = document.querySelector("[data-slider-next]");
let testimonialIndex = 0;

const showTestimonial = (index) => {
  testimonials[testimonialIndex].classList.remove("active");
  testimonialIndex = (index + testimonials.length) % testimonials.length;
  testimonials[testimonialIndex].classList.add("active");
};

prevButton.addEventListener("click", () => showTestimonial(testimonialIndex - 1));
nextButton.addEventListener("click", () => showTestimonial(testimonialIndex + 1));
setInterval(() => showTestimonial(testimonialIndex + 1), 6200);

const countUp = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1700;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(target * eased).toLocaleString("pt-BR");
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const metricsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.querySelectorAll("[data-count]").forEach(countUp);
    entry.target.querySelectorAll("[data-progress]").forEach((bar) => {
      bar.style.width = `${bar.dataset.progress}%`;
    });
    metricsObserver.unobserve(entry.target);
  });
}, { threshold: 0.35 });

const results = document.querySelector("#resultados");
if (results) metricsObserver.observe(results);

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const current = button.closest(".faq-item");
    const isActive = current.classList.contains("active");

    document.querySelectorAll(".faq-item").forEach((item) => {
      item.classList.remove("active");
      item.querySelector("button").setAttribute("aria-expanded", "false");
      item.querySelector(".faq-content").style.maxHeight = null;
    });

    if (!isActive) {
      current.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      const content = current.querySelector(".faq-content");
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  });
});

document.querySelectorAll(".faq-item.active .faq-content").forEach((content) => {
  content.style.maxHeight = `${content.scrollHeight}px`;
});
