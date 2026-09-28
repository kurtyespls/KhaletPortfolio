      // ---------- Scroll Reveal ----------
      const revealEls = document.querySelectorAll(
        ".fade-up, .fade-left, .fade-right, .scale-in",
      );
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { root: null, threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
      );
      revealEls.forEach((el) => revealObserver.observe(el));

      // ---------- Navbar scroll state & Back to top ----------
      const navbar = document.getElementById("navbar");
      const backToTop = document.getElementById("backToTop");

      function onScroll() {
        const y = window.scrollY;
        navbar.classList.toggle("scrolled", y > 24);
        backToTop.classList.toggle("show", y > 600);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      // ---------- Scroll progress bar ----------
      const progressBar = document.getElementById("scrollProgress");

      function updateProgress() {
        const total =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
        progressBar.style.width = pct + "%";
      }
      window.addEventListener("scroll", updateProgress, { passive: true });
      window.addEventListener("resize", updateProgress);
      updateProgress();

      // ---------- Scroll-spy ----------
      const spySections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-links a");
      const spyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute("id");
              navLinks.forEach((a) => {
                const isActive = a.getAttribute("href") === "#" + id;
                a.classList.toggle("active", isActive);
                if (isActive) {
                  a.setAttribute("aria-current", "true");
                } else {
                  a.removeAttribute("aria-current");
                }
              });
            }
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
      );
      spySections.forEach((s) => spyObserver.observe(s));

      // ---------- Mobile navigation ----------
      const navToggle = document.getElementById("navToggle");
      const navMenu = document.getElementById("navLinks");

      function toggleMenu(forceClose) {
        const willOpen = forceClose
          ? false
          : !navMenu.classList.contains("open");
        navMenu.classList.toggle("open", willOpen);
        navToggle.classList.toggle("open", willOpen);
        navToggle.setAttribute("aria-expanded", String(willOpen));
      }

      navToggle.addEventListener("click", () => toggleMenu(false));
      navMenu
        .querySelectorAll("a")
        .forEach((a) => a.addEventListener("click", () => toggleMenu(true)));

      document.addEventListener("click", (e) => {
        if (
          navMenu.classList.contains("open") &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)
        ) {
          toggleMenu(true);
        }
      });

      // ---------- Experience Modal (pop-out cards) ----------
      const expCards = document.querySelectorAll(".exp-card");

      function openExperienceModal(card) {
        const titleGroup = card.querySelector(".exp-card-title-group");
        const bodyInner = card.querySelector(".exp-body-inner");

        const dialog = document.createElement("dialog");
        dialog.className = "exp-modal";
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute(
          "aria-label",
          titleGroup.querySelector("h3").textContent.trim(),
        );

        // Modal header: cloned title + badge, plus a close button
        const modalHeader = document.createElement("div");
        modalHeader.className = "exp-modal-header";
        modalHeader.appendChild(titleGroup.cloneNode(true));

        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "exp-modal-close";
        closeBtn.setAttribute("aria-label", "Close details");
        closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        modalHeader.appendChild(closeBtn);

        // Modal body: cloned experience content
        const modalBody = document.createElement("div");
        modalBody.className = "exp-modal-body";
        modalBody.appendChild(bodyInner.cloneNode(true));

        dialog.appendChild(modalHeader);
        dialog.appendChild(modalBody);

        document.body.appendChild(dialog);
        document.body.classList.add("modal-open");

        function closeModal() {
          if (dialog.classList.contains("closing")) return;
          dialog.classList.add("closing");
          setTimeout(() => dialog.close(), 220);
        }

        closeBtn.addEventListener("click", closeModal);

        // Clicking the blurred backdrop (outside the card) closes the modal
        dialog.addEventListener("click", (e) => {
          if (e.target === dialog) closeModal();
        });

        // Escape key closes with the same animated exit
        dialog.addEventListener("cancel", (e) => {
          e.preventDefault();
          closeModal();
        });

        // Clean up once the dialog has fully closed
        dialog.addEventListener("close", () => {
          document.body.classList.remove("modal-open");
          dialog.remove();
        });

        dialog.showModal();
      }

      expCards.forEach((card) => {
        const header = card.querySelector(".exp-card-header");
        header.addEventListener("click", () => openExperienceModal(card));
      });

      // ---------- Back to top ----------
      backToTop.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" }),
      );

      // ---------- Animated counters ----------
      function animateCounter(el) {
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }

      const countObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 },
      );
      document
        .querySelectorAll("[data-count]")
        .forEach((el) => countObserver.observe(el));


      // ---------- Copy Email to Clipboard ----------
      document.querySelectorAll(".copy-email-btn").forEach((copyEmailBtn) => {
        copyEmailBtn.addEventListener("click", async () => {
          const email = copyEmailBtn.dataset.email || "bucao527@gmail.com";
          try {
            await navigator.clipboard.writeText(email);
          } catch (err) {
            const tempInput = document.createElement("input");
            tempInput.value = email;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
          }
          const icon = copyEmailBtn.querySelector("i");
          const text = copyEmailBtn.querySelector(".copy-text");
          const prevIconClass = icon ? icon.className : "";
          const prevText = text ? text.textContent : "";

          copyEmailBtn.classList.add("copied");
          if (icon) icon.className = "fa-solid fa-check";
          if (text) text.textContent = "Copied!";

          setTimeout(() => {
            copyEmailBtn.classList.remove("copied");
            if (icon) icon.className = prevIconClass;
            if (text) text.textContent = prevText;
          }, 2000);
        });
      });
