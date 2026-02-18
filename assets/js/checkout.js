document.addEventListener("DOMContentLoaded", () => {
  const addressForm = document.getElementById("address-form");
  const goToPaymentBtn = document.getElementById("goToPayment");

  // ── Tooltip helpers ──────────────────────────────────────────────
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

  // ── Live input guards ────────────────────────────────────────────
  const firstNameInput = addressForm?.querySelector('[name="firstName"]');
  const lastNameInput = addressForm?.querySelector('[name="lastName"]');
  const phoneInput = addressForm?.querySelector('[name="phone"]');
  const postalInput = addressForm?.querySelector('[name="postalCode"]');

  // Persian only — block any non-Persian character as user types
  [firstNameInput, lastNameInput].forEach((inp) => {
    if (!inp) return;
    inp.addEventListener("input", () => {
      inp.value = inp.value.replace(/[^\u0600-\u06FF\s]/g, "");
      removeTooltip(inp);
    });
  });

  // Phone: only digits, max 11 chars, must start with 09
  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "").slice(0, 11);
      // Auto-prefix 09 if user starts with something else
      if (phoneInput.value.length >= 2 && !phoneInput.value.startsWith("09")) {
        phoneInput.value =
          "09" + phoneInput.value.replace(/^0*9*/, "").slice(0, 9);
      }
      removeTooltip(phoneInput);
    });
  }

  // Postal code: digits only, max 10 chars
  if (postalInput) {
    postalInput.addEventListener("input", () => {
      postalInput.value = postalInput.value.replace(/[^0-9]/g, "").slice(0, 10);
      removeTooltip(postalInput);
    });
  }

  // ── Validation ───────────────────────────────────────────────────
  function validateAddress(data) {
    const errors = {};

    if (!data.firstName) errors.firstName = "نام الزامی است";
    else if (!/^[\u0600-\u06FF\s]+$/.test(data.firstName))
      errors.firstName = "نام فقط باید فارسی باشد";

    if (!data.lastName) errors.lastName = "نام خانوادگی الزامی است";
    else if (!/^[\u0600-\u06FF\s]+$/.test(data.lastName))
      errors.lastName = "نام خانوادگی فقط باید فارسی باشد";

    if (!data.phone) errors.phone = "شماره موبایل الزامی است";
    else if (!/^09\d{9}$/.test(data.phone))
      errors.phone = "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد";

    if (!data.addressText) errors.addressText = "نشانی پستی الزامی است";
    else if (data.addressText.length < 15)
      errors.addressText = "نشانی باید دقیق‌تر و طولانی‌تر باشد";

    if (!data.postalCode) errors.postalCode = "کد پستی الزامی است";
    else if (!/^\d{10}$/.test(data.postalCode))
      errors.postalCode = "کد پستی باید دقیقا ۱۰ رقم باشد";

    return errors;
  }

  // ── Address Form ─────────────────────────────────────────────────
  if (addressForm) {
    const fields = [
      "firstName",
      "lastName",
      "phone",
      "addressText",
      "postalCode",
    ];

    addressForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(addressForm);
      const data = Object.fromEntries(formData.entries());
      const errors = validateAddress(data);

      fields.forEach((name) => {
        const inp = addressForm.querySelector(`[name="${name}"]`);
        if (inp) showTooltip(inp, errors[name] || "");
      });

      if (Object.keys(errors).length) return;

      const submitBtn = addressForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2"></span> در حال ثبت...';

      setTimeout(() => {
        const modalEl = document.getElementById("addAddressModal");
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance.hide();

        submitBtn.disabled = false;
        submitBtn.innerHTML = "ثبت و استفاده";
        addressForm.reset();
        fields.forEach((name) => {
          const inp = addressForm.querySelector(`[name="${name}"]`);
          if (inp) removeTooltip(inp);
        });
      }, 1200);
    });
  }

  // ── Go To Payment ────────────────────────────────────────────────
  if (goToPaymentBtn) {
    goToPaymentBtn.addEventListener("click", () => {
      goToPaymentBtn.disabled = true;
      goToPaymentBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm ms-2"></span> انتقال به پرداخت...';
      setTimeout(() => {
        window.location.href = "confirmation.html";
      }, 700);
    });
  }
});
