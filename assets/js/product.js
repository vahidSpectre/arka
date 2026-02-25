document.addEventListener("DOMContentLoaded", function () {
    lucide.createIcons();

    $(window).on("load", function () {
        setTimeout(function () {
            $("#nexus-skeleton-wrapper").css({
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                width: "100%",
            });

            $(".real-content").css({
                display: "block",
                opacity: "0",
            });

            // Fade out skeleton
            $("#nexus-skeleton-wrapper").fadeOut(400, function () {
                // Remove skeleton from DOM
                $(this).remove();

                // Fade in real content
                $(".real-content").animate({ opacity: 1 }, 400);

                // Initialize Swipers or any other plugins
                if (typeof initializeSwipers === "function") {
                    initializeSwipers();
                }
            });
        }, 600);
    });

    // Dynamic Header Height
    const mainHeader = document.getElementById("main-header");
    const updateHeaderHeight = () => {
        const height = mainHeader?.offsetHeight || 0;
        document.documentElement.style.setProperty(
            "--header-height",
            height + "px",
        );
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    // Desktop Swiper Instances
    const thumbsSwiperDesktop = new Swiper(".desktop .thumbs-swiper", {
        spaceBetween: 10,
        slidesPerView: 6,
        watchSlidesProgress: true,
    });

    const mainSwiperDesktop = new Swiper(".desktop .main-swiper", {
      spaceBetween: 10,
      thumbs: { swiper: thumbsSwiperDesktop },
      pagination: {
        el: ".desktop .main-swiper .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".desktop .main-swiper .swiper-button-next",
        prevEl: ".desktop .main-swiper .swiper-button-prev",
      },
    });

    const modalSwiperDesktop = new Swiper("#gallery-modal .modal-swiper", {
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: "#gallery-modal .modal-swiper .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: "#gallery-modal .modal-swiper .swiper-button-next",
        prevEl: "#gallery-modal .modal-swiper .swiper-button-prev",
      },
    });

    // Mobile Swiper Instances
    const thumbsSwiperMobile = new Swiper(".mobile .thumbs-swiper", {
        spaceBetween: 10,
        slidesPerView: 4,
        watchSlidesProgress: true,
    });

    const mainSwiperMobile = new Swiper(".mobile .main-swiper", {
      spaceBetween: 10,
      thumbs: { swiper: thumbsSwiperMobile },
      pagination: {
        el: ".mobile .main-swiper .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".mobile .main-swiper .swiper-button-next",
        prevEl: ".mobile .main-swiper .swiper-button-prev",
      },
    });

    new Swiper(".related-swiper", {
        spaceBetween: 20,
        slidesPerView: 1.5,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            768: { slidesPerView: 3.5 },
            1024: { slidesPerView: 4.5 },
            1280: { slidesPerView: 5.5 },
        },
    });

    const navBtns = document.querySelectorAll("#desktop-sticky-tabs .nav-btn");
    const mobileNavBtns = document.querySelectorAll(
        "#mobile-sticky-tabs .nav-btn",
    );
    const mobileNavWrapper = document.querySelector("#mobile-sticky-tabs");
    const mobileSections = document.querySelectorAll(
        ".mobile-scroll-mt-section",
    );
    const desktopSections = document.querySelectorAll(".scroll-mt-section");

    const mobileSheet = document.querySelector(".mobile-sheet");
    const isMobile = window.innerWidth < 992;
    const mobileGalleryWrapper = document.querySelector(
        "#mobile-gallery-wrapper",
    );

    function calculateSheetMargin() {
        // if (!mobileSheet || !mobileGalleryWrapper) return;
        // const height = mobileGalleryWrapper.getBoundingClientRect().height;
        // mobileSheet.style.marginTop = `${height}px`;
    }

    // Navigation Click Handler
    navBtns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);

            if (!targetSection) return;

            if (!isMobile) {
                const targetPosition =
                    targetSection.getBoundingClientRect().top +
                    window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - 200,
                    behavior: "smooth",
                });
            }

            navBtns.forEach((b) => b.classList.remove("active"));
        });
    });

    // Handle "more specs" button click with same offset
    const moreSpecsBtn = document.querySelector(".more-specs-btn");
    if (moreSpecsBtn) {
        moreSpecsBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);

            if (!targetSection) return;

            const targetPosition =
                targetSection.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: targetPosition - 200,
                behavior: "smooth",
            });

            // Update active nav button
            navBtns.forEach((btn) => {
                btn.classList.toggle(
                    "active",
                    btn.getAttribute("data-target") === targetId,
                );
            });
        });
    }

    const desktopStickyNavsobserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    navBtns.forEach((btn) =>
                        btn.classList.toggle(
                            "active",
                            btn.getAttribute("data-target") === entry.target.id,
                        ),
                    );
                }
            });
        },
        { rootMargin: "-131px 0px -40% 0px", threshold: 0 },
    );

    desktopSections.forEach((section) =>
        desktopStickyNavsobserver.observe(section),
    );

    let isScrolling = false;

    // Click Handler
    mobileNavBtns.forEach((btn) => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("data-target");
            const targetSection = document.getElementById(targetId);

            if (!targetSection) return;

            // Disable observer temporarily
            isScrolling = true;

            // Get header height dynamically
            const headerHeight =
                document.querySelector("header")?.offsetHeight || 0;
            const mobileNavHeight = mobileNavWrapper?.offsetHeight || 0;
            const totalOffset = headerHeight + mobileNavHeight + 10;

            const targetPosition =
                targetSection.getBoundingClientRect().top +
                window.pageYOffset -
                totalOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });

            // Set active immediately
            mobileNavBtns.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");

            // Re-enable observer after scroll completes
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        });
    });

    // Scroll Observer
    const mobileStickyNavsobserver = new IntersectionObserver(
        (entries) => {
            if (isScrolling) return; // Don't update during programmatic scroll

            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    mobileNavBtns.forEach((btn) => {
                        if (
                            btn.getAttribute("data-target") === entry.target.id
                        ) {
                            btn.classList.add("active");
                            btn.scrollIntoView({
                                behavior: "smooth",
                                inline: "center",
                                block: "nearest",
                            });
                        } else {
                            btn.classList.remove("active");
                        }
                    });
                }
            });
        },
        {
            root: null,
            rootMargin: "-80px 0px -100px 0px",
            threshold: [0, 0.3, 0.5, 0.7],
        },
    );

    // Observe all sections including related products
    mobileSections.forEach((section) => {
        if (section) {
            mobileStickyNavsobserver.observe(section);
        }
    });

    const { toGregorian } = jalaali;

    function startCountdownFromDiv(div) {
        const endDateStr = div.dataset.endDate;

        const [datePart, timePart] = endDateStr.split(" ");
        const [jy, jm, jd] = datePart.split("-").map(Number);
        const [hour, minute] = timePart.split(":").map(Number);

        const { gy, gm, gd } = toGregorian(jy, jm, jd);
        const targetDate = new Date(gy, gm - 1, gd, hour, minute);

        const intervalId = setInterval(() => {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                div.textContent = "زمان به پایان رسید!";
                clearInterval(intervalId);
                return;
            }

            const totalSeconds = Math.floor(diff / 1000);
            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            div.textContent = `${days}: ${hours}: ${minutes}: ${seconds}`;
        }, 1000);
    }

    document.querySelectorAll(".countdown").forEach(startCountdownFromDiv);

    // FIXED: Improved Swiper initialization
    function initializeSwipers() {
        const currentIsMobile = window.innerWidth < 992;

        // Track if we're switching between mobile/desktop
        const wasDesktop = !!window.desktopMainSwiper;
        const shouldBeDesktop = !currentIsMobile;

        // Only reinitialize if we're actually switching layouts
        if (wasDesktop === shouldBeDesktop) return;

        // Destroy old instances with proper cleanup
        if (window.mobileThumbsSwiper) {
            window.mobileThumbsSwiper.destroy(true, true);
            window.mobileThumbsSwiper = null;
        }
        if (window.mobileMainSwiper) {
            window.mobileMainSwiper.destroy(true, true);
            window.mobileMainSwiper = null;
        }
        if (window.desktopThumbsSwiper) {
            window.desktopThumbsSwiper.destroy(true, true);
            window.desktopThumbsSwiper = null;
        }
        if (window.desktopMainSwiper) {
            window.desktopMainSwiper.destroy(true, true);
            window.desktopMainSwiper = null;
        }

        // Wait a tick before reinitializing to ensure DOM is clean
        setTimeout(() => {
            const prefix = currentIsMobile ? ".mobile" : ".desktop";

            if (currentIsMobile) {
                window.mobileThumbsSwiper = new Swiper(
                    `${prefix} .thumbs-swiper`,
                    {
                        spaceBetween: 8,
                        slidesPerView: 4,
                        watchSlidesProgress: true,
                        freeMode: true,
                        observer: true,
                        observeParents: true,
                    },
                );

                window.mobileMainSwiper = new Swiper(`${prefix} .main-swiper`, {
                    spaceBetween: 0,
                    thumbs: {
                        swiper: window.mobileThumbsSwiper,
                    },
                    resistanceRatio: 0.5,
                    touchAngle: 45,
                    shortSwipes: false,
                    followFinger: false,
                    observer: true,
                    observeParents: true,
                });
            } else {
                // Desktop swipers
                window.desktopThumbsSwiper = new Swiper(
                    `${prefix} .thumbs-swiper`,
                    {
                        spaceBetween: 10,
                        slidesPerView: 6,
                        watchSlidesProgress: true,
                        observer: true,
                        observeParents: true,
                    },
                );

                window.desktopMainSwiper = new Swiper(
                    `${prefix} .main-swiper`,
                    {
                        spaceBetween: 10,
                        thumbs: {
                            swiper: window.desktopThumbsSwiper,
                        },
                        observer: true,
                        observeParents: true,
                    },
                );
            }
        }, 100);
    }

    // Initialize on load
    initializeSwipers();

    // Reinitialize on resize with debounce
    let resizeTimer;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initializeSwipers, 250);
    });

    // Initialize tech swiper for mobile
    const techSwiper = new Swiper(".tech-swiper", {
        slidesPerView: 2.5,
        spaceBetween: 10,
        navigation: false,
        freeMode: true,
        breakpoints: {
            576: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 4,
            },
        },
    });

    const mediaQuery = window.matchMedia("(max-width: 768px)");

    function handleSheetMargin() {
        if (!mobileSheet) return;

        if (mediaQuery.matches) {
            calculateSheetMargin();
        } else {
            mobileSheet.style.marginTop = "";
        }
    }

    handleSheetMargin();

    window.addEventListener("resize", handleSheetMargin);

    mediaQuery.addEventListener("change", handleSheetMargin);

    const header = document.querySelector("header");
    // const headerHeight = header ? header.offsetHeight : 0;
    const headerHeight =  0;

    const mobileNavigationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    mobileNavWrapper.classList.remove("d-none");
                    mobileNavWrapper.style.marginTop = `${headerHeight}px`;
                } else {
                    mobileNavWrapper.classList.add("d-none");
                }
            });
        },
        {
            root: null,
            rootMargin: "-100px 0px -60% 0px",
            threshold: [0, 0.25, 0.5],
        },
    );

    mobileNavigationObserver.observe(mobileSheet);

    new Swiper(".installment-swiper", {
        slidesPerView: 5,
        spaceBetween: 5,
    });

    // FIXED: Mobile gallery visibility with opacity instead of display
    const mobileGallery = document.getElementById("mobile-gallery-wrapper");

    if (mobileGallery) {
        let ticking = false;

        function updateGalleryVisibility() {
            const scrollY = window.scrollY;

            if (scrollY > 400) {
                // Use opacity instead of display:none to keep element in layout
                mobileGallery.style.opacity = "0";
                mobileGallery.style.pointerEvents = "none";
            } else {
                mobileGallery.style.opacity = "1";
                mobileGallery.style.pointerEvents = "auto";
            }

            ticking = false;
        }

        // Use requestAnimationFrame for better performance
        window.addEventListener("scroll", function () {
            if (!ticking) {
                window.requestAnimationFrame(updateGalleryVisibility);
                ticking = true;
            }
        });

        // FIXED: Corrected classList syntax
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting && window.scrollY > 400) {
                        mobileGallery.classList.add("fade-out"); // Fixed from classList.add =
                    } else {
                        mobileGallery.classList.remove("fade-out"); // Fixed from classList.remove =
                    }
                });
            },
            {
                threshold: 0,
                rootMargin: "0px",
            },
        );

        observer.observe(mobileGallery);
    }

    const productTitle = document.title;
    const productUrl = window.location.href;
    const shareText = "Check out this product!";

    $(document).on("click", ".shareBtn", async function () {
        generateLinks();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: productTitle,
                    text: shareText,
                    url: productUrl,
                });
            } catch (err) {
                console.log("Share cancelled");
            }
        } else {
            const modal = new bootstrap.Modal(
                document.getElementById("shareModal"),
            );
            modal.show();
        }
    });

    function generateLinks() {
        $("#whatsapp").attr(
            "href",
            "https://wa.me/?text=" +
                encodeURIComponent(shareText + " " + productUrl),
        );

        $("#telegram").attr(
            "href",
            "https://t.me/share/url?url=" +
                encodeURIComponent(productUrl) +
                "&text=" +
                encodeURIComponent(shareText),
        );

        $("#twitter").attr(
            "href",
            "https://twitter.com/intent/tweet?url=" +
                encodeURIComponent(productUrl) +
                "&text=" +
                encodeURIComponent(shareText),
        );

        $("#facebook").attr(
            "href",
            "https://www.facebook.com/sharer/sharer.php?u=" +
                encodeURIComponent(productUrl),
        );

        $("#linkedin").attr(
            "href",
            "https://www.linkedin.com/sharing/share-offsite/?url=" +
                encodeURIComponent(productUrl),
        );
    }

    $("#copyLink").on("click", function () {
        navigator.clipboard.writeText(productUrl);
        $(this).text("کپی شد!");
        setTimeout(() => {
            $(this).text("کپی لینک مجصول");
        }, 2000);
    });
});

// Fix for mobile gallery modal
window.openGallery = function (idx) {
    const modal = document.getElementById("gallery-modal");
    if (!modal) return;

    // Initialize modal swiper if not exists
    if (!window.modalSwiper) {
        window.modalSwiper = new Swiper("#gallery-modal .modal-swiper", {
            spaceBetween: 10,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            pagination: {
                el: ".swiper-pagination",
                type: "fraction",
            },
        });
    }

    modal.classList.remove("d-none");
    modal.classList.add("d-flex");
    document.body.style.overflow = "hidden";
    window.modalSwiper.slideTo(idx, 0);
};

window.closeGallery = function () {
    const modal = document.getElementById("gallery-modal");
    if (!modal) return;

    modal.classList.add("d-none");
    modal.classList.remove("d-flex");
    document.body.style.overflow = "";
};
