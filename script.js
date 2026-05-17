/**
 * Portfolio interactivity:
 *  - Theme toggle (dark / light) with localStorage persistence and
 *    system-preference fallback
 *  - Mobile menu open/close
 *  - Adds .is-scrolled to <nav> after the user scrolls past the hero
 *  - IntersectionObserver-driven reveal animations
 *  - Auto-stamps the current year in any element with id="year"
 *
 * Vanilla JS, zero dependencies.
 */

(function () {
  "use strict";

  /* ---------------- Theme ---------------- */
  const THEME_KEY = "ag-theme";
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") {
    applyTheme(saved);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        const isLight = root.getAttribute("data-theme") === "light";
        const next = isLight ? "dark" : "light";
        applyTheme(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {
          /* localStorage unavailable; ignore */
        }
      });
    }

    /* ---------------- Mobile menu ---------------- */
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (menuBtn && mobileMenu) {
      function setOpen(open) {
        mobileMenu.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      }
      menuBtn.addEventListener("click", function () {
        const isOpen = mobileMenu.classList.contains("open");
        setOpen(!isOpen);
      });
      mobileMenu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          setOpen(false);
        });
      });
    }

    /* ---------------- Scrolled nav border ---------------- */
    const nav = document.getElementById("nav");
    if (nav) {
      const onScroll = function () {
        if (window.scrollY > 16) {
          nav.classList.add("is-scrolled");
        } else {
          nav.classList.remove("is-scrolled");
        }
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---------------- Reveal animations ----------------
     * Only opt into reveal animations when JS is alive AND the OS
     * doesn't ask for reduced motion. Otherwise, content stays
     * visible by default (CSS handles the fallback). */
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length && !prefersReducedMotion && "IntersectionObserver" in window) {
      root.classList.add("js-ready");
      const io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    }

    /* ---------------- Year stamp ---------------- */
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  });
})();
