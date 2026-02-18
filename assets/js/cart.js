document.addEventListener("DOMContentLoaded", () => {
  // Quantity Stepper
  document.querySelectorAll(".quantity-stepper").forEach((stepper) => {
    const input = stepper.querySelector("input");
    const plusBtn = stepper.querySelector(".plus");
    const minusBtn = stepper.querySelector(".minus");

    plusBtn.addEventListener("click", () => {
      input.value = parseInt(input.value) + 1;
    });

    minusBtn.addEventListener("click", () => {
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
      }
    });
  });

  // Remove Item with animation
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const item = e.target.closest(".cart-item");
      item.classList.add("removing");
      setTimeout(() => {
        item.remove();
        // If cart is empty, could refresh or show empty state
      }, 300);
    });
  });

});
