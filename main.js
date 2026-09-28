// Page fade-in
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-loaded");

  // Subtle page transitions on internal nav clicks (skips same-page anchors)
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

  // Gallery lightbox (used on work.html). Each [data-gallery] section is its
  // own group of photos; clicking one opens the modal scoped to that group.
  const modal = document.getElementById("image-modal");
  if (modal) {
    const modalImg = modal.querySelector("img");
    const closeBtn = modal.querySelector(".close");
    const prevBtn = modal.querySelector(".modal-prev");
    const nextBtn = modal.querySelector(".modal-next");

    let currentGroup = [];
    let currentIndex = 0;

    document.querySelectorAll("[data-gallery]").forEach((galleryEl) => {
      const links = Array.from(galleryEl.querySelectorAll("a.tile"));
      const items = links.map((link) => {
        const img = link.querySelector("img");
        return { src: link.getAttribute("href"), alt: img ? img.alt : "" };
      });

      links.forEach((link, index) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          currentGroup = items;
          openModalAt(index);
        });
      });
    });

    function setModalImage(index) {
      if (!modalImg || !currentGroup.length) return;
      const safeIndex = (index + currentGroup.length) % currentGroup.length;
      currentIndex = safeIndex;
      modalImg.src = currentGroup[safeIndex].src;
      modalImg.alt = currentGroup[safeIndex].alt || "";
    }

    function openModalAt(index) {
      if (!currentGroup.length) return;
      setModalImage(index);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      const showNav = currentGroup.length > 1;
      if (prevBtn) prevBtn.style.display = showNav ? "" : "none";
      if (nextBtn) nextBtn.style.display = showNav ? "" : "none";
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (modalImg) {
        modalImg.src = "";
        modalImg.alt = "";
      }
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (prevBtn) prevBtn.addEventListener("click", () => openModalAt(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => openModalAt(currentIndex + 1));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
      if (!modal.classList.contains("is-open")) return;
      if (event.key === "ArrowLeft") openModalAt(currentIndex - 1);
      if (event.key === "ArrowRight") openModalAt(currentIndex + 1);
    });
  }
});
