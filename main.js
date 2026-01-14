// Page fade-in
window.addEventListener("DOMContentLoaded", () => {
  // Fixed header: offset page content by nav height.
  const nav = document.querySelector(".nav");
  if (nav) {
    const setNavOffset = () => {
      document.body.style.paddingTop = `${nav.offsetHeight}px`;
    };
    setNavOffset();
    window.addEventListener("resize", setNavOffset);
  }

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

  // Project modal (gallery + hero; only runs if modal exists)
  const modal = document.getElementById("image-modal");
  if (modal) {
    const modalImg = modal.querySelector("img");
    const closeBtn = modal.querySelector(".close");
    const galleryLinks = document.querySelectorAll("#gallery .tile");
    const heroLink = document.querySelector(".project-hero-modal");
    const prevBtn = modal.querySelector(".modal-prev");
    const nextBtn = modal.querySelector(".modal-next");
    const items = [];
    let currentIndex = 0;

    const heroImg = heroLink ? heroLink.querySelector("img") : null;
    if (heroLink) {
      items.push({
        src: heroLink.getAttribute("href"),
        alt: heroImg ? heroImg.alt : ""
      });
    }
    galleryLinks.forEach((link) => {
      const img = link.querySelector("img");
      items.push({
        src: link.getAttribute("href"),
        alt: img ? img.alt : ""
      });
    });

    const setModalImage = (index) => {
      if (!modalImg || !items.length) return;
      const safeIndex = (index + items.length) % items.length;
      currentIndex = safeIndex;
      modalImg.src = items[safeIndex].src;
      modalImg.alt = items[safeIndex].alt || "";
    };

    const openModalAt = (index) => {
      if (!items.length) return;
      setModalImage(index);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      if (prevBtn && nextBtn) {
        const showNav = items.length > 1;
        prevBtn.style.display = showNav ? "" : "none";
        nextBtn.style.display = showNav ? "" : "none";
      }
    };

    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (modalImg) {
        modalImg.src = "";
        modalImg.alt = "";
      }
    };

    galleryLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const src = link.getAttribute("href");
        const index = items.findIndex((item) => item.src === src);
        openModalAt(index === -1 ? 0 : index);
      });
    });

    if (heroLink) {
      heroLink.addEventListener("click", (event) => {
        event.preventDefault();
        openModalAt(0);
      });
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        openModalAt(currentIndex - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        openModalAt(currentIndex + 1);
      });
    }
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

// Spotify Iframe API
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const element = document.getElementById("spotify-player");
  if (!element) return;

  const options = {
    uri: "spotify:playlist:YOUR_PLAYLIST_ID",
    width: "100%",
    height: "152", // compact + elegant
  };

  IFrameAPI.createController(element, options, (controller) => {
    // Optional: you can control playback here later
    // controller.play();
  });
};

const options = {
  uri: "spotify:track:",
  width: "100%",
  height: "152",
};
