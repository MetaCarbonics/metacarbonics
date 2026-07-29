(function () {
  function closeAll(except) {
    document.querySelectorAll(".nav-dropdown.open").forEach((dropdown) => {
      if (dropdown !== except) dropdown.classList.remove("open");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".nav-dropdown-trigger").forEach((trigger) => {
      const dropdown = trigger.closest(".nav-dropdown");
      if (!dropdown) return;

      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        const willOpen = !dropdown.classList.contains("open");
        closeAll(dropdown);
        dropdown.classList.toggle("open", willOpen);
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".nav-dropdown")) closeAll();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAll();
    });
  });
})();
