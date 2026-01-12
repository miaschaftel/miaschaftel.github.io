// Page fade-in
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-loaded");

  // Work filters (only runs if filter UI exists)
  const chips = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll("[data-tags]");

  if (chips.length && items.length) {
    const setActive = (activeChip) => {
      chips.forEach(c => c.classList.toggle("is-active", c === activeChip));
    };

    const applyFilter = (tag) => {
      items.forEach(item => {
        const tags = (item.getAttribute("data-tags") || "")
          .split(",")
          .map(t => t.trim().toLowerCase());

        const show = tag === "all" || tags.includes(tag);
        item.classList.toggle("is-hidden", !show);
      });
    };

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const tag = chip.getAttribute("data-filter");
        setActive(chip);
        applyFilter(tag);
      });
    });

    // Default
    const defaultChip = document.querySelector('[data-filter="all"]');
    if (defaultChip) defaultChip.click();
  }

  // Subtle page transitions on internal nav clicks
  const internalLinks = document.querySelectorAll('a[href$=".html"]');
  internalLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href) return;
      // Let new tabs, modifiers, etc. behave normally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      document.body.classList.remove("is-loaded");
      setTimeout(() => {
        window.location.href = href;
      }, 280);
    });
  });
});
