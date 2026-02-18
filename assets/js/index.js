document.addEventListener("DOMContentLoaded", function () {
  // ─── Lucide Icons ───────────────────────────────────────────
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // ─── Helper: English → Persian digits ───────────────────────
  function toPersianDigits(n) {
    const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
  }

  // ─── Countdown Logic ────────────────────────────────────────
  function updateCountdown() {
    const countdownElements = document.querySelectorAll("[data-count-down]");
    if (!countdownElements.length) return;

    countdownElements.forEach((element) => {
      const countdownStr = element.getAttribute("data-count-down");

      if (!countdownStr || countdownStr.trim() === "") {
        element.innerHTML = toPersianDigits("0:00:00:00");
        return;
      }

      const parts = countdownStr.split(" ");
      if (parts.length !== 2) {
        element.innerHTML = toPersianDigits("0:00:00:00");
        return;
      }

      const datePart = parts[0].split("-");
      const timePart = parts[1].split(":");

      // Guard: jalaali library must be available
      if (typeof jalaali === "undefined") {
        console.warn("jalaali library not loaded.");
        return;
      }

      const jalaliYear = parseInt(datePart[0]);
      const jalaliMonth = parseInt(datePart[1]);
      const jalaliDay = parseInt(datePart[2]);

      const gregorianDate = jalaali.toGregorian(
        jalaliYear,
        jalaliMonth,
        jalaliDay,
      );

      const targetDate = new Date(
        gregorianDate.gy,
        gregorianDate.gm - 1,
        gregorianDate.gd,
        parseInt(timePart[0]),
        parseInt(timePart[1]),
        parseInt(timePart[2] || 0),
      );

      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        element.innerHTML = "به پایان رسید";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const pad = (n) => n.toString().padStart(2, "0");

      element.innerHTML = toPersianDigits(
        `${days}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
      );
    });
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

 const menuOverlay = document.getElementById("customMobileMenu");
 const menuToggle = document.getElementById("menuToggleTrigger");
 const closeToggle = document.getElementById("closeMenuTrigger");
 const menuLinks = menuOverlay
   ? menuOverlay.querySelectorAll(".menu-link")
   : [];


  if (menuOverlay && menuToggle && closeToggle && typeof gsap !== "undefined") {
    const menuTl = gsap.timeline({ paused: true, reversed: true });

    const getClipOrigin = () => {
      const rect = menuToggle.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      return `${x}px ${y}px`;
    };

    menuTl
      .fromTo(
        menuOverlay,
        {
          clipPath: () => `circle(0% at ${getClipOrigin()})`,
          visibility: "hidden",
        },
        {
          clipPath: () => `circle(150% at ${getClipOrigin()})`,
          visibility: "visible",
          duration: 0.6,
          ease: "power3.inOut",
          onStart: () => (document.body.style.overflow = "hidden"),
          onReverseComplete: () => (document.body.style.overflow = ""),
        },
      )
      .from(
        menuLinks,
        { y: -50, opacity: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
        "-=0.5",
      );

    menuToggle.addEventListener("click", () => {
      if (menuTl.reversed()) {
        menuTl.play();
      } else {
        menuTl.reverse();
      }
    });

    closeToggle.addEventListener("click", () => {
      menuTl.reverse();

      menuTl.eventCallback("onReverseComplete", () => {
        document.body.style.overflow = "scroll";
      });
    });

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuTl.reverse();
        document.body.style.overflow = "scroll";
      });
    });
  }

  // ─── Mega Menu Hover ─────────────────────────────────────────
  const sidebarItems = document.querySelectorAll(".mega-sidebar-item");
  const contentAreas = document.querySelectorAll(".mega-content-area");

  if (sidebarItems.length && contentAreas.length) {
    sidebarItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        sidebarItems.forEach((i) => i.classList.remove("active"));
        contentAreas.forEach((c) => c.classList.remove("active"));

        item.classList.add("active");
        const target = item.getAttribute("data-target");
        const targetEl = target ? document.getElementById(target) : null;
        if (targetEl) targetEl.classList.add("active");
      });
    });
  }

  // ─── Reveal on Scroll ────────────────────────────────────────
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  // ─── Swipers ─────────────────────────────────────────────────
  if (typeof Swiper === "undefined") {
    console.warn("Swiper library not loaded.");
  } else {
    if (document.querySelector(".mainHeroSwiper")) {
      new Swiper(".mainHeroSwiper", {
        loop: true,
        autoplay: { delay: 6000 },
        pagination: {
          el: ".mainHeroSwiper .swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".mainHeroSwiper .swiper-button-next",
          prevEl: ".mainHeroSwiper .swiper-button-prev",
        },
      });
    }

    if (document.querySelector(".specialOffers")) {
      const swiper = new Swiper(".specialOffers", {
        slidesPerView: 1,
        spaceBetween: 10,
        effect: "fade",
        fadeEffect: { crossFade: true },
        loop: true,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: { el: ".swiper-pagination", clickable: true },
      });

      // Animate progress bar for a given slide element
      function animateProgress(slide) {
        const progress = slide.querySelector(".progress-line");
        if (!progress) return;

        progress.style.transition = "none";
        progress.style.transform = "scaleX(0)";
        progress.offsetHeight; // force reflow

        // Animate over autoplay delay
        progress.style.transition = `transform ${swiper.params.autoplay.delay}ms linear`;
        progress.style.transform = "scaleX(1)";
      }

      // Reset all progress bars
      function resetAllProgress() {
        swiper.slides.forEach((slide) => {
          const progress = slide.querySelector(".progress-line");
          if (progress) {
            progress.style.transition = "none";
            progress.style.transform = "scaleX(0)";
          }
        });
      }

      // Start progress on initial active slide
      animateProgress(swiper.slides[swiper.activeIndex]);

      // On each slide change
      swiper.on("slideChangeTransitionStart", () => {
        resetAllProgress();
        animateProgress(swiper.slides[swiper.activeIndex]);
      });
    }

    if (document.querySelector(".discountSwiper")) {
      new Swiper(".discountSwiper", {
        slidesPerView: 2.2,
        spaceBetween: 15,
        pagination: { el: ".swiper-pagination", clickable: true },
        breakpoints: {
          576: { slidesPerView: 2.2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        },
      });
    }

    if (document.querySelector(".popularSwiper")) {
      new Swiper(".popularSwiper", {
        slidesPerView: 2.2,
        spaceBetween: 15,
        breakpoints: {
          576: { slidesPerView: 2.2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        },
      });
    }

    if (document.querySelector(".categoriesSwiper")) {
      new Swiper(".categoriesSwiper", {
        slidesPerView: 2.2,
        spaceBetween: 15,
        breakpoints: {
          576: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 5 },
        },
      });
    }
  }

  // ─── 3D Parallax Tilt Banner ─────────────────────────────────
  const banner = document.getElementById("parallaxBanner");
  if (banner) {
    const glare = banner.querySelector(".tilt-glare");

    banner.addEventListener("mousemove", (e) => {
      const rect = banner.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      banner.style.transform = `rotateX(${((y - centerY) / centerY) * -1}deg) rotateY(${((x - centerX) / centerX) * 1}deg)`;

      if (glare) {
        glare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,255,255,0.3) 0%, transparent 60%)`;
      }
    });

    banner.addEventListener("mouseleave", () => {
      banner.style.transform = "rotateX(0deg) rotateY(0deg)";
      banner.style.transition = "transform 0.5s ease-out";
      setTimeout(() => {
        banner.style.transition = "transform 0.15s ease-out";
      }, 500);
    });

    banner.addEventListener("mouseenter", () => {
      banner.style.transition = "transform 0.1s ease-out";
    });
  }

  // ─── Bootstrap Popovers ──────────────────────────────────────
  if (typeof bootstrap !== "undefined" && bootstrap.Popover) {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]',
    );

    popoverTriggerList.forEach((el) => {
      const popover = new bootstrap.Popover(el, {
        trigger: "manual",
        html: true,
      });

      let hideTimeout;

      el.addEventListener("mouseenter", () => {
        clearTimeout(hideTimeout);
        popover.show();
      });

      el.addEventListener("mouseleave", () => {
        hideTimeout = setTimeout(() => popover.hide(), 150);
      });

      el.addEventListener("shown.bs.popover", () => {
        // Use the specific popover for this trigger, not a global querySelector
        const popoverEl = document.getElementById(
          el.getAttribute("aria-describedby"),
        );
        if (!popoverEl) return;

        popoverEl.addEventListener("mouseenter", () => {
          clearTimeout(hideTimeout);
        });

        popoverEl.addEventListener("mouseleave", () => {
          hideTimeout = setTimeout(() => popover.hide(), 150);
        });
      });
    });
  }

  // ─── Custom Scrollbar ────────────────────────────────────────
  const track = document.querySelector(".custom-scrollbar");
  const thumb = document.querySelector(".custom-scrollbar-thumb");

  if (track && thumb) {
    function updateThumb() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const thumbHeight = Math.max(
        (window.innerHeight / document.documentElement.scrollHeight) * 100,
        10,
      );
      const thumbTop =
        docHeight > 0 ? (scrollTop / docHeight) * (100 - thumbHeight) : 0;

      thumb.style.height = `${thumbHeight}vh`;
      thumb.style.top = `${thumbTop}vh`;
    }

    window.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);
    updateThumb();
  }

  const header = document.querySelector("header");

  const headroom = new Headroom(header);
  headroom.init();
});

// ─── Preloader ───────────────────────────────────────────────
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  preloader.classList.add("fade-zoom-out");

  preloader.addEventListener(
    "transitionend",
    () => {
      preloader.remove();
    },
    { once: true },
  );
});
