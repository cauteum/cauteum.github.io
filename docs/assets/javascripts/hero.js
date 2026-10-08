// SPDX-FileCopyrightText: Copyright (c) 2026 whaleshell
// SPDX-License-Identifier: Apache-2.0

(function () {
  var flow = document.querySelector(".ws-flow");
  if (!flow) return;

  var tabs = Array.prototype.slice.call(flow.querySelectorAll("[data-flow-tab]"));
  var panels = Array.prototype.slice.call(flow.querySelectorAll("[data-flow-panel]"));
  var progress = Array.prototype.slice.call(flow.querySelectorAll(".ws-flow__progress span"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var timers = [];
  var manual = false;
  var visible = false;

  function clearTimers() {
    timers.forEach(window.clearTimeout);
    timers = [];
  }

  function activate(index, animate) {
    clearTimers();
    flow.classList.toggle("ws-flow--playing", animate);
    tabs.forEach(function (tab, tabIndex) {
      var selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(function (panel, panelIndex) {
      panel.hidden = panelIndex !== index;
      panel.querySelectorAll(".ws-flow__line").forEach(function (line) {
        line.classList.remove("is-visible");
      });
    });
    progress.forEach(function (bar, barIndex) {
      bar.classList.toggle("is-complete", barIndex <= index);
    });

    if (!animate) return;
    var lines = panels[index].querySelectorAll(".ws-flow__line");
    lines.forEach(function (line, lineIndex) {
      timers.push(window.setTimeout(function () {
        line.classList.add("is-visible");
      }, 180 + lineIndex * 620));
    });
    timers.push(window.setTimeout(function () {
      if (visible && !manual && !reduceMotion.matches) {
        activate((index + 1) % panels.length, true);
      }
    }, 4900));
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      manual = true;
      activate(index, false);
    });
    tab.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      var next = (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
      tabs[next].focus();
      tabs[next].click();
    });
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !manual && !reduceMotion.matches) activate(0, true);
      if (!visible) {
        clearTimers();
        flow.classList.remove("ws-flow--playing");
      }
    }, { threshold: 0.25 }).observe(flow);
  } else if (!reduceMotion.matches) {
    visible = true;
    activate(0, true);
  }
})();
