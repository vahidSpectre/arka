document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("contact-name");
  const phoneInput = document.getElementById("contact-phone");
  const messageInput = document.getElementById("contact-message");

  // Replicate tooltip helpers from auth.js
  function showTooltip(input, msg) {
    removeTooltip(input);
    if (!msg) {
      input.classList.remove("input-error-border");
      return;
    }
    input.classList.add("input-error-border");
    const tooltip = document.createElement("div");
    tooltip.className = "input-tooltip-error";
    tooltip.innerHTML = msg;

    const arrow = document.createElement("div");
    arrow.className = "input-tooltip-arrow";
    tooltip.appendChild(arrow);

    input.parentElement.style.position = "relative";
    input.parentElement.appendChild(tooltip);
  }

  function removeTooltip(input) {
    input.classList.remove("input-error-border");
    const t = input.parentElement.querySelector(".input-tooltip-error");
    if (t) t.remove();
  }

  // Persian only for name
  if (nameInput) {
    nameInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^\u0600-\u06FF\s]/g, "");
      removeTooltip(nameInput);
    });
  }

  // Digits only for phone
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
      removeTooltip(phoneInput);
    });
  }

  if (messageInput) {
    messageInput.addEventListener("input", () => removeTooltip(messageInput));
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      let hasError = false;

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const message = messageInput.value.trim();

      if (!name) {
        showTooltip(nameInput, "نام الزامی است");
        hasError = true;
      }
      if (!/^09\d{9}$/.test(phone)) {
        showTooltip(phoneInput, "شماره موبایل معتبر (۱۱ رقم) وارد کنید");
        hasError = true;
      }
      if (message.length < 10) {
        showTooltip(messageInput, "پیام باید حداقل ۱۰ کاراکتر باشد");
        hasError = true;
      }

      if (hasError) {
        e.preventDefault();
      } else {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML =
          '<span class="spinner-border spinner-border-sm me-2"></span> در حال ارسال...';

        // Mock success
        setTimeout(() => {
          alert("پیام شما با موفقیت دریافت شد. به زودی با شما تماس می‌گیریم.");
          contactForm.reset();
          btn.disabled = false;
          btn.innerText = "ارسال پیام";
        }, 1500);
      }
    });
  }
});
