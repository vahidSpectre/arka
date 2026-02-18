// Only form validation and password show/hide, as requested
(function () {
  // Helper: show tooltip error
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
    // Arrow
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

  // Add * for required fields
  function addRequiredAsterisk(id) {
    const label = document.querySelector('label[for="' + id + '"]');
    if (label && !label.innerHTML.includes('<span class="req-star">*</span>')) {
      label.innerHTML += ' <span class="req-star">*</span>';
    }
  }
  [
    "signup-name",
    "signup-email",
    "signup-phone",
    "signup-password",
    "signup-password-confirm",
    "login-id",
    "login-password",
  ].forEach(addRequiredAsterisk);

  // Password show/hide (eye icon)
  function addEye(id) {
    const input = document.getElementById(id);
    if (!input) return;
    const wrapper = input.parentElement;
    if (wrapper.querySelector(".eye-icon")) return;

    let visible = false;

    function renderIcon() {
      // Remove old icon if exists
      const old = wrapper.querySelector(".eye-icon");
      if (old) old.remove();

      const eye = document.createElement("i");
      eye.className = "eye-icon";
      eye.setAttribute("data-lucide", visible ? "eye" : "eye-off");
      eye.style.cssText = "width:20px;height:20px;cursor:pointer;";
      wrapper.style.position = "relative";
      wrapper.appendChild(eye);
      lucide.createIcons({ nodes: [eye] });
    }

    renderIcon();

    // Delegate click to wrapper, check if click target is inside .eye-icon
    wrapper.addEventListener("click", function (e) {
      const icon = wrapper.querySelector(".eye-icon");
      if (icon && icon.contains(e.target)) {
        visible = !visible;
        input.type = visible ? "text" : "password";
        renderIcon();
      }
    });
  }

  addEye("signup-password");
  addEye("signup-password-confirm");
  addEye("login-password");

  // Persian only for name
  const nameInput = document.getElementById("signup-name");
  if (nameInput) {
    nameInput.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/[^\u0600-\u06FF\s]/g, "");
      removeTooltip(nameInput);
    });
  }

  // Signup form validation
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      let errors = {};
      const name = nameInput.value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const phone = document.getElementById("signup-phone").value.trim();
      const password = document.getElementById("signup-password").value;
      const confirm = document.getElementById("signup-password-confirm").value;
      if (!name) errors.name = "نام الزامی است";
      else if (!/^([\u0600-\u06FF\s]+)$/.test(name))
        errors.name = "نام فقط باید فارسی باشد";
      if (!email) errors.email = "ایمیل الزامی است";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.email = "ایمیل معتبر نیست";
      if (!/^09\d{9}$/.test(phone))
        errors.phone = "شماره موبایل معتبر وارد کنید";
      if (!password || password.length < 8)
        errors.password = "رمز عبور حداقل ۸ کاراکتر";
      if (password !== confirm) errors.confirm = "تکرار رمز عبور مطابقت ندارد";
      showTooltip(nameInput, errors.name || "");
      showTooltip(document.getElementById("signup-email"), errors.email || "");
      showTooltip(document.getElementById("signup-phone"), errors.phone || "");
      showTooltip(
        document.getElementById("signup-password"),
        errors.password || "",
      );
      showTooltip(
        document.getElementById("signup-password-confirm"),
        errors.confirm || "",
      );
      if (Object.keys(errors).length) {
        e.preventDefault();
      }
    });
    // Remove tooltip on input
    [
      "signup-name",
      "signup-email",
      "signup-phone",
      "signup-password",
      "signup-password-confirm",
    ].forEach((id) => {
      const inp = document.getElementById(id);
      if (inp) inp.addEventListener("input", () => removeTooltip(inp));
    });
  }

  // Update button class names in forms
  // Signup
  if (signupForm) {
    const btn = signupForm.querySelector('button[type="submit"]');
    if (btn) btn.classList.remove("btn");
    if (btn) btn.classList.add("auth-btn");
    const outlineBtn = signupForm.querySelector(".btn-outline");
    if (outlineBtn) outlineBtn.classList.remove("btn-outline");
    if (outlineBtn) outlineBtn.classList.add("auth-btn-outline");
  }
  // Login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const btn = loginForm.querySelector('button[type="submit"]');
    if (btn) btn.classList.remove("btn");
    if (btn) btn.classList.add("auth-btn");
    const outlineBtn = loginForm.querySelector(".btn-outline");
    if (outlineBtn) outlineBtn.classList.remove("btn-outline");
    if (outlineBtn) outlineBtn.classList.add("auth-btn-outline");
  }

  // Login form validation
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      let errors = {};
      const id = document.getElementById("login-id").value.trim();
      const pw = document.getElementById("login-password").value;
      if (!id) errors.id = "ایمیل یا شماره موبایل الزامی است";
      else if (id.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id))
        errors.id = "ایمیل معتبر نیست";
      else if (!id.includes("@") && !/^09\d{9}$/.test(id))
        errors.id = "شماره موبایل معتبر نیست";
      if (!pw || pw.length < 6) errors.pw = "رمز عبور حداقل ۶ کاراکتر";
      showTooltip(document.getElementById("login-id"), errors.id || "");
      showTooltip(document.getElementById("login-password"), errors.pw || "");
      if (Object.keys(errors).length) {
        e.preventDefault();
      }
    });
    ["login-id", "login-password"].forEach((id) => {
      const inp = document.getElementById(id);
      if (inp) inp.addEventListener("input", () => removeTooltip(inp));
    });
  }

  // OTP form validation
  const otpForm = document.getElementById("otp-form");
  if (otpForm) {
    otpForm.addEventListener("submit", function (e) {
      const codeInputs = Array.from(document.querySelectorAll(".otp-input"));
      const code = codeInputs.map((i) => i.value).join("");
      let error = "";
      if (!/^\d{6}$/.test(code)) error = "کد تایید باید ۶ رقم باشد";
      codeInputs.forEach((inp) => removeTooltip(inp));
      if (error) {
        showTooltip(codeInputs[0], error);
        e.preventDefault();
      }
    });
  }

  // OTP input UX: focus, auto-next, auto-back
  const otpInputs = document.querySelectorAll(".otp-input");
  if (otpInputs.length) {
    otpInputs[0].focus();
    otpInputs.forEach((inp, idx) => {
      inp.addEventListener("input", function (e) {
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 1);
        if (this.value && otpInputs[idx + 1]) otpInputs[idx + 1].focus();
      });
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !this.value && otpInputs[idx - 1]) {
          otpInputs[idx - 1].focus();
        }
        if (
          (e.key === "ArrowLeft" || e.key === "ArrowUp") &&
          otpInputs[idx - 1]
        ) {
          otpInputs[idx - 1].focus();
        }
        if (
          (e.key === "ArrowRight" || e.key === "ArrowDown") &&
          otpInputs[idx + 1]
        ) {
          otpInputs[idx + 1].focus();
        }
      });
      inp.addEventListener("paste", function (e) {
        const text = (e.clipboardData || window.clipboardData).getData("text");
        const nums = text
          .replace(/\D/g, "")
          .slice(0, otpInputs.length)
          .split("");
        if (nums.length) {
          e.preventDefault();
          otpInputs.forEach((i, idx2) => (i.value = nums[idx2] || ""));
          if (nums.length < otpInputs.length && otpInputs[nums.length]) {
            otpInputs[nums.length].focus();
          }
        }
      });
    });
  }

  // Add error border and tooltip styles
  const style = document.createElement("style");
  style.innerHTML = `
   
  `;
  document.head.appendChild(style);
})();
