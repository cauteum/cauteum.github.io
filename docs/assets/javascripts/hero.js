// SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
// SPDX-License-Identifier: Apache-2.0

(function () {
  var hero = document.querySelector(".ws-hero");
  if (!hero) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var pending = false;

  function update() {
    pending = false;
    var height = hero.offsetHeight || 1;
    var progress = reduceMotion.matches ? 0 : Math.min(Math.max(window.scrollY / height, 0), 1);
    hero.style.setProperty("--ws-hero-progress", progress.toFixed(3));
    hero.style.setProperty("--ws-wave-rise", Math.round(progress * height * 0.75) + "px");
  }

  function schedule() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
})();
