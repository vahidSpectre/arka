document.addEventListener("DOMContentLoaded", function () {
  // ─── Lucide Icons ───────────────────────────────────────────
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // ─── Search Results Paper Logic ─────────────────────────────
  const searchInput = document.getElementById("headerSearchInput");
  const searchPaper = document.getElementById("searchResultsPaper");

  if (searchInput && searchPaper && typeof gsap !== "undefined") {
    // Initial state setup for animation
    gsap.set(searchPaper, {
      opacity: 0,
      visibility: "hidden",
      y: 15,
      scale: 0.98,
    });

    const paperTl = gsap.to(searchPaper, {
      opacity: 1,
      visibility: "visible",
      y: 0,
      scale: 1,
      duration: 0.25,
      ease: "back.out(1.7)",
      paused: true,
    });

    searchInput.addEventListener("focus", () => {
      paperTl.play();
    });

    window.addEventListener("scroll", () => {
      // Check visibility via opacity instead of activeElement (unreliable on scroll)
      const isVisible = gsap.getProperty(searchPaper, "opacity") > 0;
      if (isVisible) {
        paperTl.reverse();
        searchInput.blur();
      }
    });

    // Handle clicks outside to close
    document.addEventListener("click", (e) => {
      const isInside =
        searchInput.contains(e.target) || searchPaper.contains(e.target);
      if (!isInside) {
        paperTl.reverse();
      }
    });

    // Accessibility: Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        paperTl.reverse();
        searchInput.blur();
      }
    });
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

  // All clickable links across both panels
  const menuLinks = menuOverlay
    ? menuOverlay.querySelectorAll(".menu-nav-item, .cat-card")
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
        // Only animate items in the currently active panel
        () =>
          menuOverlay.querySelectorAll(
            ".menu-tab-panel.active .menu-nav-item, .menu-tab-panel.active .cat-card",
          ),
        {
          y: -50,
          opacity: 0,
          stagger: 0.07,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.5",
      );

    // ── Open / Close ───────────────────────────────────────
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

    // ── Tab Switching ──────────────────────────────────────
    const pills = menuOverlay.querySelectorAll(".menu-tab-pill");
    const panels = menuOverlay.querySelectorAll(".menu-tab-panel");

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const target = pill.dataset.tab;

        // Swap active states
        pills.forEach((p) => p.classList.remove("mobile-menu-active"));
        panels.forEach((p) => p.classList.remove("mobile-menu-active"));
        pill.classList.add("mobile-menu-active");

        const activePanel = document.getElementById(target);
        activePanel.classList.add("mobile-menu-active");

        // Re-animate items in the newly revealed panel
        const items = activePanel.querySelectorAll(".menu-nav-item, .cat-card");
        gsap.fromTo(
          items,
          { y: -30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.4,
            ease: "power2.out",
          },
        );
      });
    });
  }

  // ── Submenu toggle ──────────────────────────────────
  document.querySelectorAll(".cat-card").forEach((card) => {
    const submenu = card.nextElementSibling;
    const hasSubmenu = submenu && submenu.classList.contains("cat-submenu");

    if (!hasSubmenu) return;

    card.insertAdjacentHTML(
      "beforeend",
      `<i data-lucide="chevron-left" class="cat-toggle cat-arrow"></i>`,
    );

    lucide.createIcons();

    card.querySelectorAll(".cat-toggle").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();

        const isOpen = card.classList.contains("open");

        document.querySelectorAll(".cat-card.open").forEach((openCard) => {
          openCard.classList.remove("open");
          const openSub = openCard.nextElementSibling;
          if (openSub && openSub.classList.contains("cat-submenu")) {
            openSub.classList.remove("open");
          }
        });

        if (!isOpen) {
          card.classList.add("open");
          submenu.classList.add("open");
        }
      });
    });
  });

  // ── Menu Search ────────────────────────────────────────────────
  const menuSearchInput = document.getElementById("menuSearchInput");
  const menuSearchResults = document.getElementById("menuSearchResults");
  const menuSearchClear = document.getElementById("menuSearchClear");

  if (menuSearchInput && menuSearchResults) {
    // Crawl the entire menu DOM and build an index automatically
    function buildMenuIndex() {
      const index = [];

      // ── Nav items (tab 1) ──────────────────────────
      menuOverlay.querySelectorAll(".menu-nav-item").forEach((el) => {
        const text = el.textContent.trim();
        const href = el.getAttribute("href") || "#";
        const icon =
          el.querySelector(".nav-icon")?.innerHTML ||
          '<i class="bi bi-link"></i>';
        if (text) index.push({ text, href, icon, tag: "منو" });
      });

      // ── Cat cards (tab 2) ──────────────────────────
      menuOverlay.querySelectorAll(".cat-card").forEach((card) => {
        const nameEl = card.querySelector(".cat-name");
        const iconEl = card.querySelector(".cat-icon-box");
        const text = nameEl?.textContent.trim();
        const href =
          nameEl?.getAttribute("href") || card.getAttribute("href") || "#";
        const icon = iconEl?.textContent.trim() || "📦";
        if (text) index.push({ text, href, icon, tag: "دسته‌بندی" });
      });

      // ── Sub items ──────────────────────────────────
      menuOverlay.querySelectorAll(".cat-sub-item").forEach((el) => {
        const text = el.textContent.trim();
        const href = el.getAttribute("href") || "#";
        if (text) index.push({ text, href, icon: "↳", tag: "زیردسته" });
      });

      return index;
    }

    function highlight(text, query) {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
    }

    function renderResults(matches, query) {
      menuSearchResults.innerHTML = "";

      if (!matches.length) {
        menuSearchResults.innerHTML = `<div class="menu-search-empty">نتیجه‌ای یافت نشد</div>`;
        return;
      }

      matches.forEach(({ text, href, icon, tag }) => {
        const item = document.createElement("a");
        item.className = "search-result-item";
        item.href = href;
        item.innerHTML = `
        <span class="search-result-icon">${icon}</span>
        <span class="search-result-label">
          ${highlight(text, query)}
          <span class="search-result-tag">${tag}</span>
        </span>
      `;
        menuSearchResults.appendChild(item);
      });
    }

    function showSearchMode(on) {
      const tabPanels = menuOverlay.querySelectorAll(".menu-tab-panel");
      if (on) {
        tabPanels.forEach((p) => (p.style.display = "none"));
        menuSearchResults.classList.add("active");
      } else {
        menuSearchResults.classList.remove("active");
        tabPanels.forEach((p) => (p.style.display = ""));
      }
    }

    let menuIndex = [];

    menuSearchInput.addEventListener("focus", () => {
      if (!menuIndex.length) menuIndex = buildMenuIndex();
    });

    menuSearchInput.addEventListener("input", () => {
      const query = menuSearchInput.value.trim();

      menuSearchClear.classList.toggle("visible", query.length > 0);

      if (!query) {
        showSearchMode(false);
        return;
      }

      showSearchMode(true);

      const matches = menuIndex.filter(({ text }) => text.includes(query));

      renderResults(matches, query);

      // Animate results in
      gsap.fromTo(
        menuSearchResults.querySelectorAll(".search-result-item"),
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, duration: 0.3, ease: "power2.out" },
      );
    });

    menuSearchClear.addEventListener("click", () => {
      menuSearchInput.value = "";
      menuSearchClear.classList.remove("visible");
      showSearchMode(false);
      menuSearchInput.focus();
    });

    // Reset search when menu closes
    menuToggle.addEventListener("click", () => {
      menuSearchInput.value = "";
      menuSearchClear.classList.remove("visible");
      showSearchMode(false);
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
      const mainSwiper = new Swiper(".mainHeroSwiper", {
        loop: true,
        speed: 900,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: ".mainHeroSwiper .swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".mainHeroSwiper .swiper-button-next",
          prevEl: ".mainHeroSwiper .swiper-button-prev",
        },
      });

      const contentSwiper = new Swiper(".mainHeroSwiperContent", {
        loop: true,
        spaceBetween: 100,
        speed: 900,
        pagination: {
          el: ".mainHeroSwiperContent .swiper-pagination",
          clickable: true,
        },
      });

      mainSwiper.on("slideChange", function () {
        if (contentSwiper.realIndex !== this.realIndex) {
          contentSwiper.slideToLoop(this.realIndex, 0);
        }
      });

      contentSwiper.on("slideChange", function () {
        if (mainSwiper.realIndex !== this.realIndex) {
          mainSwiper.slideToLoop(this.realIndex, 0);
        }
      });

      mainSwiper.on("autoplayStop", () => contentSwiper.autoplay.stop());
      contentSwiper.on("autoplayStop", () => mainSwiper.autoplay.stop());

      mainSwiper.on("autoplayStart", () => contentSwiper.autoplay.start());
      contentSwiper.on("autoplayStart", () => mainSwiper.autoplay.start());
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
        pagination: {
          el: ".specialOffers .swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".specialOffers .swiper-button-next",
          prevEl: ".specialOffers .swiper-button-prev",
        },
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
        pagination: {
          el: ".discountSwiper .swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".discountSwiper .swiper-button-next",
          prevEl: ".discountSwiper .swiper-button-prev",
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
        pagination: {
          el: ".popularSwiper .swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".popularSwiper .swiper-button-next",
          prevEl: ".popularSwiper .swiper-button-prev",
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
          1024: { slidesPerView: 5.2 },
        },
        pagination: {
          el: ".categoriesSwiper .swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".categoriesSwiper .swiper-button-next",
          prevEl: ".categoriesSwiper .swiper-button-prev",
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

  // const header = document.querySelector("header");

  // const headroom = new Headroom(header);
  // headroom.init();
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
