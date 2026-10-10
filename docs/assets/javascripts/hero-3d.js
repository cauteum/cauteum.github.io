// SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
// SPDX-License-Identifier: Apache-2.0

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js";

const stage = document.querySelector("[data-mascot-stage]");
if (!stage) {
  // This module is loaded only on the landing page.
} else {
  try {
    const canvas = stage.querySelector("canvas");
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-6, 6, 1.65, -1.65, 0.1, 40);
    camera.position.set(0, 3.15, 10);
    camera.lookAt(0, 1.05, 0);

    scene.add(new THREE.HemisphereLight(0xc9e7ff, 0x17121b, 2.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
    keyLight.position.set(-3.8, 7, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x4e91ff, 2.3);
    rimLight.position.set(4, 3, -4);
    scene.add(rimLight);
    const warmLight = new THREE.PointLight(0xff9849, 36, 8);
    warmLight.position.set(0, 0.35, 2.6);
    scene.add(warmLight);

    const mat = (color, roughness = 0.68, metalness = 0) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });
    const hoodie = mat(0x171922, 0.82);
    const hoodieEdge = mat(0x292c36, 0.8);
    const blue = mat(0x0879ff, 0.34);
    const blueShade = mat(0x0755c7, 0.42);
    const white = mat(0xf5f7ff, 0.34);
    const black = mat(0x080a10, 0.4);
    const orange = mat(0xff642b, 0.43);
    const skin = mat(0xffbd83, 0.58);
    const laptopMat = mat(0x20232c, 0.35, 0.22);

    function sphere(parent, material, position, scale, segments = 24) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, segments, Math.max(12, Math.floor(segments * 0.7))),
        material,
      );
      mesh.position.set(position[0], position[1], position[2]);
      mesh.scale.set(scale[0], scale[1], scale[2]);
      parent.add(mesh);
      return mesh;
    }

    function capsule(parent, material, radius, length, position) {
      const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 5, 14), material);
      mesh.position.set(position[0], position[1], position[2]);
      parent.add(mesh);
      return mesh;
    }

    const mascot = new THREE.Group();
    scene.add(mascot);
    const body = new THREE.Group();
    mascot.add(body);

    // Hood and face are separate rounded volumes, so the silhouette keeps depth while running.
    capsule(body, hoodie, 0.39, 0.42, [0, 0.84, 0]);
    sphere(body, hoodie, [0, 1.68, -0.03], [0.72, 0.76, 0.61], 32);
    sphere(body, hoodieEdge, [-0.68, 1.65, -0.04], [0.19, 0.42, 0.3]);
    sphere(body, hoodieEdge, [0.68, 1.65, -0.04], [0.19, 0.42, 0.3]);
    sphere(body, blue, [-0.66, 2.15, -0.02], [0.18, 0.22, 0.15]);
    sphere(body, blue, [0.66, 2.15, -0.02], [0.18, 0.22, 0.15]);
    sphere(body, blueShade, [-0.66, 2.16, 0.08], [0.105, 0.13, 0.07]);
    sphere(body, blueShade, [0.66, 2.16, 0.08], [0.105, 0.13, 0.07]);
    sphere(body, blue, [0, 1.72, 0.36], [0.55, 0.56, 0.31], 32);
    sphere(body, white, [-0.22, 1.82, 0.605], [0.17, 0.205, 0.075]);
    sphere(body, white, [0.22, 1.82, 0.605], [0.17, 0.205, 0.075]);
    sphere(body, black, [-0.19, 1.81, 0.665], [0.083, 0.105, 0.045]);
    sphere(body, black, [0.25, 1.81, 0.665], [0.083, 0.105, 0.045]);
    sphere(body, white, [-0.215, 1.85, 0.704], [0.027, 0.031, 0.018], 12);
    sphere(body, white, [0.225, 1.85, 0.704], [0.027, 0.031, 0.018], 12);
    sphere(body, black, [0, 1.59, 0.685], [0.105, 0.075, 0.055]);
    sphere(body, skin, [-0.08, 1.52, 0.67], [0.11, 0.09, 0.09]);
    sphere(body, skin, [0.08, 1.52, 0.67], [0.11, 0.09, 0.09]);
    sphere(body, white, [-0.045, 1.405, 0.65], [0.045, 0.1, 0.055]);
    sphere(body, white, [0.045, 1.405, 0.65], [0.045, 0.1, 0.055]);

    const legs = [];
    [-1, 1].forEach((side) => {
      const leg = new THREE.Group();
      leg.position.set(side * 0.21, 0.54, 0.02);
      body.add(leg);
      capsule(leg, hoodie, 0.17, 0.24, [0, -0.2, 0]);
      sphere(leg, hoodieEdge, [0, -0.43, 0.12], [0.2, 0.13, 0.28]);
      sphere(leg, skin, [0, -0.49, 0.24], [0.16, 0.075, 0.17]);
      legs.push(leg);
    });

    const arms = [];
    [-1, 1].forEach((side) => {
      const arm = new THREE.Group();
      arm.position.set(side * 0.34, 1.2, 0.32);
      body.add(arm);
      capsule(arm, hoodieEdge, 0.145, 0.35, [side * 0.1, -0.25, 0.03]);
      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.095, 18), orange);
      cuff.position.set(side * 0.1, -0.43, 0.03);
      arm.add(cuff);
      sphere(arm, skin, [side * 0.1, -0.53, 0.08], [0.145, 0.14, 0.14]);
      arms.push(arm);
    });

    // The gopher carries a real little 3D laptop, marked with the white pixel mascot.
    const laptop = new THREE.Group();
    laptop.position.set(0, 0.97, 0.54);
    body.add(laptop);
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.62, 0.075), laptopMat);
    laptop.add(screen);
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.52, 0.018), mat(0x11141c, 0.28));
    bezel.position.z = 0.046;
    laptop.add(bezel);
    const pixels = [
      [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2],
      [-2, 1], [2, 1], [-2, 0], [2, 0],
      [-3, -1], [-2, -1], [2, -1], [3, -1],
      [-2, -2], [-1, -2], [1, -2], [2, -2],
      [-1, -3], [1, -3], [-1, -4], [1, -4],
    ];
    pixels.forEach(([x, y]) => {
      const pixel = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.055, 0.018), white);
      pixel.position.set(x * 0.065, y * 0.058, 0.06);
      laptop.add(pixel);
    });
    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.075, 0.42), laptopMat);
    keyboard.position.set(0, -0.35, 0.13);
    laptop.add(keyboard);
    const trackpad = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.012, 0.09), hoodieEdge);
    trackpad.position.set(0, -0.305, 0.15);
    laptop.add(trackpad);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1, 40),
      new THREE.MeshBasicMaterial({ color: 0x05070d, transparent: true, opacity: 0.32, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.scale.set(0.8, 0.27, 1);
    shadow.position.y = 0.015;
    scene.add(shadow);

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const clock = new THREE.Clock();
    let running = false;
    let raf = 0;
    let halfWidth = 5;

    function resize() {
      const width = Math.max(1, stage.clientWidth);
      const height = Math.max(1, stage.clientHeight);
      const aspect = width / height;
      camera.left = -1.65 * aspect;
      camera.right = 1.65 * aspect;
      camera.top = 1.65;
      camera.bottom = -1.65;
      camera.updateProjectionMatrix();
      halfWidth = 1.65 * aspect;
      renderer.setSize(width, height, false);
      if (motionPreference.matches) renderStill();
    }

    function renderStill() {
      mascot.position.set(0, 0, 0);
      body.position.y = 0;
      body.rotation.set(0, 0, -0.035);
      legs.forEach((leg) => { leg.rotation.x = 0; leg.rotation.z = 0; });
      arms.forEach((arm) => { arm.rotation.x = 0; arm.rotation.z = 0; });
      shadow.position.x = 0;
      renderer.render(scene, camera);
    }

    function frame() {
      if (!running) return;
      const elapsed = clock.getElapsedTime();
      const period = 7.4;
      const phase = (elapsed % period) / period;
      const edge = Math.max(0.75, halfWidth - 0.7);
      const progress = phase * phase * (3 - 2 * phase);
      const stride = elapsed * 10.5;
      const bounce = Math.abs(Math.sin(stride)) * 0.11;
      mascot.position.x = -edge + progress * edge * 2;
      mascot.position.y = bounce;
      mascot.rotation.y = -0.08 + Math.sin(stride) * 0.035;
      body.rotation.z = -0.055 + Math.sin(stride * 2) * 0.025;
      legs.forEach((leg, index) => {
        const offset = index ? Math.PI : 0;
        leg.rotation.x = Math.sin(stride + offset) * 0.66;
        leg.rotation.z = Math.cos(stride + offset) * 0.08;
      });
      arms.forEach((arm, index) => {
        const offset = index ? 0 : Math.PI;
        arm.rotation.x = Math.sin(stride + offset) * 0.22;
        arm.rotation.z = (index ? -1 : 1) * (0.12 + Math.cos(stride + offset) * 0.3);
      });
      const edgeFade = Math.min(1, phase / 0.055, (1 - phase) / 0.055);
      mascot.visible = edgeFade > 0.01;
      shadow.position.x = mascot.position.x;
      shadow.material.opacity = 0.32 * edgeFade;
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running || !stage.isConnected) return;
      running = true;
      clock.start();
      if (motionPreference.matches) renderStill();
      else raf = window.requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      window.cancelAnimationFrame(raf);
    }

    resize();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);
    else window.addEventListener("resize", resize, { passive: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      }, { threshold: 0.05 }).observe(stage);
    } else start();
    motionPreference.addEventListener("change", () => {
      if (motionPreference.matches) {
        stop();
        renderStill();
      } else if (stage.getBoundingClientRect().bottom > 0) start();
    });
    stage.dataset.mascotReady = "true";
  } catch (error) {
    console.error("Cauteum 3D mascot could not be initialized", error);
    stage.classList.add("ws-hero__mascot-track--fallback");
  }
}
