// SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
// SPDX-License-Identifier: Apache-2.0

(function () {
  var stage = document.querySelector("[data-mascot-stage]");
  if (!stage) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var loaded = false;

  // Keep the static mascot visible until the 3D scene is near the viewport and ready.
  async function loadScene() {
    if (loaded || reducedMotion.matches) return;
    loaded = true;
    try {
      var THREE = await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js");
      createScene(THREE);
    } catch (error) {
      console.error("Cauteum 3D mascot could not be loaded", error);
      stage.classList.remove("ws-hero__mascot-track--ready");
    }
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      if ("requestIdleCallback" in window) window.requestIdleCallback(loadScene, { timeout: 1400 });
      else window.setTimeout(loadScene, 450);
    }, { rootMargin: "180px 0px", threshold: 0.01 });
    observer.observe(stage);
  } else {
    window.setTimeout(loadScene, 1200);
  }

  reducedMotion.addEventListener("change", function (event) {
    if (!event.matches && stage.getBoundingClientRect().top < window.innerHeight) loadScene();
  });

  function createScene(THREE) {
    var canvas = stage.querySelector("canvas");
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-6, 6, 1.8, -1.8, 0.1, 50);
    camera.position.set(0, 3.7, 11);
    camera.lookAt(0, 1.05, 0);

    scene.add(new THREE.HemisphereLight(0xcfe7ff, 0x17121c, 1.75));
    var keyLight = new THREE.DirectionalLight(0xfff2df, 3.2);
    keyLight.position.set(-3.8, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0003;
    scene.add(keyLight);

    var rimLight = new THREE.DirectionalLight(0x4f8cff, 2.5);
    rimLight.position.set(4, 3.5, -4);
    scene.add(rimLight);
    var portalLight = new THREE.PointLight(0x63d8ff, 0, 7, 2);
    portalLight.position.set(2.05, 1.2, 0.1);
    scene.add(portalLight);

    var mat = function (color, roughness, metalness, emissive, intensity) {
      return new THREE.MeshStandardMaterial({
        color: color,
        roughness: roughness === undefined ? 0.65 : roughness,
        metalness: metalness || 0,
        emissive: emissive || 0x000000,
        emissiveIntensity: intensity || 0,
      });
    };
    var hoodie = mat(0x11141c, 0.82);
    var trim = mat(0x292e3a, 0.68);
    var blue = mat(0x0879ff, 0.34);
    var blueShade = mat(0x064fbe, 0.42);
    var white = mat(0xf5f7ff, 0.35);
    var black = mat(0x080a10, 0.36);
    var orange = mat(0xff642b, 0.42);
    var skin = mat(0xffbd83, 0.56);
    var seam = mat(0x4a5361, 0.72);
    var boot = mat(0x151923, 0.4, 0.08);
    var brass = mat(0xc78d45, 0.3, 0.72);
    var boxMat = mat(0x202532, 0.42, 0.38);
    var magicMat = mat(0x54dcff, 0.2, 0, 0x138dff, 2.1);

    function add(parent, geometry, material, position, scale) {
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(position[0], position[1], position[2]);
      if (scale) mesh.scale.set(scale[0], scale[1], scale[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function sphere(parent, material, position, scale, segments) {
      return add(parent, new THREE.SphereGeometry(1, segments || 24, 18), material, position, scale);
    }

    function capsule(parent, material, radius, length, position) {
      return add(parent, new THREE.CapsuleGeometry(radius, length, 5, 14), material, position);
    }

    var floor = add(scene, new THREE.PlaneGeometry(40, 30), mat(0x17131e, 0.96), [0, -0.04, -3]);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    var mascot = new THREE.Group();
    scene.add(mascot);
    var body = new THREE.Group();
    mascot.add(body);

    // The black hood, blue face and orange/white sleeve marks follow the supplied mascot.
    capsule(body, hoodie, 0.39, 0.42, [0, 0.84, 0]);
    // Small tailored details keep the hoodie readable at the hero's compact scale.
    capsule(body, trim, 0.075, 0.24, [0, 0.87, 0.41]);
    sphere(body, seam, [-0.16, 0.78, 0.405], [0.13, 0.055, 0.035], 16);
    sphere(body, seam, [0.16, 0.78, 0.405], [0.13, 0.055, 0.035], 16);
    sphere(body, blue, [0, 0.96, 0.425], [0.105, 0.08, 0.04], 16);
    sphere(body, hoodie, [0, 1.68, -0.03], [0.72, 0.76, 0.61], 32);
    sphere(body, trim, [-0.68, 1.65, -0.04], [0.19, 0.42, 0.3]);
    sphere(body, trim, [0.68, 1.65, -0.04], [0.19, 0.42, 0.3]);
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

    // A tiny stitched pixel mark anchors the hood to the app icon.
    var hoodMark = [
      [-1, 2], [0, 2], [1, 2], [-1, 1], [1, 1], [-2, 0], [2, 0],
      [-1, -1], [1, -1], [-1, -2], [1, -2],
    ];
    hoodMark.forEach(function (point) {
      add(body, new THREE.BoxGeometry(0.055, 0.055, 0.025), white,
        [point[0] * 0.06, 2.34 + point[1] * 0.055, 0.53]);
    });

    var legs = [];
    [-1, 1].forEach(function (side) {
      var hip = new THREE.Group();
      hip.position.set(side * 0.21, 0.54, 0.02);
      body.add(hip);
      capsule(hip, hoodie, 0.155, 0.23, [0, -0.15, 0]);
      var knee = new THREE.Group();
      knee.position.y = -0.23;
      hip.add(knee);
      sphere(knee, trim, [0, 0, 0.015], [0.145, 0.14, 0.15], 18);
      capsule(knee, hoodie, 0.125, 0.18, [0, -0.13, 0]);
      var foot = new THREE.Group();
      foot.position.set(0, -0.25, 0.015);
      knee.add(foot);
      sphere(foot, boot, [0, -0.015, 0.075], [0.18, 0.105, 0.27], 20);
      sphere(foot, skin, [0, -0.035, 0.245], [0.145, 0.065, 0.13], 18);
      sphere(foot, seam, [0, 0.065, 0.07], [0.14, 0.025, 0.13], 16);
      legs.push({ hip: hip, knee: knee, foot: foot });
    });

    var arms = [];
    [-1, 1].forEach(function (side) {
      var arm = new THREE.Group();
      arm.position.set(side * 0.34, 1.2, 0.32);
      body.add(arm);
      capsule(arm, trim, 0.145, 0.35, [side * 0.1, -0.25, 0.03]);
      var whiteBand = add(arm, new THREE.CylinderGeometry(0.15, 0.15, 0.065, 18), white,
        [side * 0.1, -0.385, 0.03]);
      var orangeBand = add(arm, new THREE.CylinderGeometry(0.15, 0.15, 0.095, 18), orange,
        [side * 0.1, -0.465, 0.03]);
      whiteBand.castShadow = true;
      orangeBand.castShadow = true;
      sphere(arm, skin, [side * 0.1, -0.55, 0.08], [0.145, 0.14, 0.14]);
      arms.push(arm);
    });

    // The Pandora box is a separate hinged 3D prop with brass corners and a glowing core.
    var boxX = 2.05;
    var box = new THREE.Group();
    box.position.x = boxX;
    scene.add(box);
    add(box, new THREE.BoxGeometry(1.12, 0.78, 0.92), boxMat, [0, 0.4, 0]);
    add(box, new THREE.BoxGeometry(1.18, 0.07, 0.98), brass, [0, 0.82, 0]);
    [-1, 1].forEach(function (x) {
      [-1, 1].forEach(function (z) {
        add(box, new THREE.BoxGeometry(0.09, 0.82, 0.09), brass,
          [x * 0.53, 0.41, z * 0.43]);
      });
    });
    add(box, new THREE.BoxGeometry(0.34, 0.22, 0.035), brass, [0, 0.52, 0.48]);
    add(box, new THREE.BoxGeometry(0.17, 0.1, 0.045), boxMat, [0, 0.52, 0.51]);
    var latch = add(box, new THREE.SphereGeometry(0.055, 16, 12), magicMat, [0, 0.52, 0.55]);

    var lidPivot = new THREE.Group();
    lidPivot.position.set(0, 0.84, -0.43);
    box.add(lidPivot);
    add(lidPivot, new THREE.BoxGeometry(1.15, 0.13, 0.9), boxMat, [0, 0.045, 0.43]);
    add(lidPivot, new THREE.BoxGeometry(1.02, 0.035, 0.77), brass, [0, 0.125, 0.43]);
    add(lidPivot, new THREE.BoxGeometry(0.92, 0.025, 0.67), boxMat, [0, 0.15, 0.43]);
    var lidMark = [
      [-1, 2], [0, 2], [1, 2], [-1, 1], [1, 1], [-2, 0], [2, 0],
      [-1, -1], [1, -1], [-1, -2], [1, -2],
    ];
    lidMark.forEach(function (point) {
      add(lidPivot, new THREE.BoxGeometry(0.06, 0.03, 0.06), magicMat,
        [point[0] * 0.07, 0.17, 0.43 + point[1] * 0.07]);
    });

    var core = add(box, new THREE.SphereGeometry(0.3, 24, 16), magicMat, [0, 1.0, 0]);
    core.scale.set(0.34, 0.05, 0.34);
    core.material.transparent = true;
    core.material.opacity = 0.8;

    var sparks = [];
    for (var i = 0; i < 9; i += 1) {
      var spark = add(scene, new THREE.OctahedronGeometry(0.055 + (i % 3) * 0.015),
        i % 2 ? magicMat : brass, [boxX, 1, 0]);
      sparks.push({ mesh: spark, phase: i * 0.73, radius: 0.24 + (i % 4) * 0.13 });
    }

    var shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1, 40),
      new THREE.MeshBasicMaterial({ color: 0x05070d, transparent: true, opacity: 0.24, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.scale.set(0.82, 0.29, 1);
    shadow.position.y = 0.012;
    scene.add(shadow);

    var clock = new THREE.Clock();
    var running = false;
    var raf = 0;
    var halfWidth = 5;
    var period = 12;
    var targetX = boxX - 1.05;
    var lastFrame = 0;

    function smooth(value) {
      value = Math.max(0, Math.min(1, value));
      return value * value * (3 - 2 * value);
    }

    function resize() {
      var width = Math.max(1, stage.clientWidth);
      var height = Math.max(1, stage.clientHeight);
      var aspect = width / height;
      camera.left = -1.8 * aspect;
      camera.right = 1.8 * aspect;
      camera.top = 1.8;
      camera.bottom = -1.8;
      camera.updateProjectionMatrix();
      halfWidth = 1.8 * aspect;
      renderer.setSize(width, height, false);
    }

    function pose(time) {
      var t = time % period;
      var edge = Math.max(2.7, halfWidth - 0.85);
      var startX = -edge;
      var walkingIn = t < 3.7;
      var walkingOut = t >= 9.1 && t < 11.15;
      var walkInProgress = smooth(t / 3.7);
      var walkOutProgress = smooth((t - 9.1) / 2.05);
      var stride = time * 10.5;

      if (walkingIn) mascot.position.x = startX + (targetX - startX) * walkInProgress;
      else if (walkingOut) mascot.position.x = targetX + (-edge - 1.2 - targetX) * walkOutProgress;
      else mascot.position.x = targetX;

      mascot.visible = t < 11.2;
      var walking = walkingIn || walkingOut;
      var reach = smooth((t - 4.1) / 1.1);
      var open = smooth((t - 5.05) / 1.55);
      var magic = Math.min(open, smooth((9.3 - t) / 1.1));
      var surprise = smooth((t - 6.35) / 0.8) * (1 - smooth((t - 8.3) / 0.8));

      mascot.position.y = walking ? 0.025 + Math.sin(stride * 2) * 0.018 : surprise * Math.max(0, Math.sin((t - 6.3) * 7)) * 0.1;
      // Face into the path while moving, then turn toward the viewer at the box.
      var facingViewer = 0.48;
      if (walkingOut) mascot.rotation.y = facingViewer + (-1.03 - facingViewer) * walkOutProgress;
      else if (walkingIn) mascot.rotation.y = 1.03;
      else mascot.rotation.y = 1.03 + (facingViewer - 1.03) * smooth((t - 3.3) / 0.9);
      body.rotation.z = walking
        ? -0.075 + Math.sin(stride) * 0.035
        : -0.04 - reach * 0.1 + surprise * Math.sin(t * 5) * 0.025;
      body.rotation.x = walking ? 0.075 : -reach * 0.13;

      legs.forEach(function (leg, index) {
        var offset = index ? Math.PI : 0;
        var phase = stride + offset;
        var step = Math.sin(phase);
        leg.hip.rotation.x = walking ? step * 0.72 : -surprise * 0.12;
        leg.hip.rotation.z = walking ? Math.cos(phase) * 0.035 : 0;
        leg.knee.rotation.x = walking ? Math.max(0, step) * 0.8 : 0;
        leg.foot.rotation.x = walking ? -Math.max(0, step) * 0.34 : 0;
      });
      arms.forEach(function (arm, index) {
        var side = index ? 1 : -1;
        var offset = index ? 0 : Math.PI;
        arm.rotation.x = walking ? Math.sin(stride + offset) * 0.43 : -reach * 0.58;
        arm.rotation.z = walking
          ? side * (0.035 + Math.cos(stride + offset) * 0.055)
          : side * (0.12 + reach * (index ? 0.75 : 0.45));
      });

      lidPivot.rotation.x = -open * 1.28;
      portalLight.intensity = magic * 42;
      core.scale.set(0.34 + magic * 0.32, 0.05 + magic * 0.72, 0.34 + magic * 0.32);
      core.material.opacity = 0.35 + magic * 0.65;
      latch.material.emissiveIntensity = 0.3 + magic * 4;
      sparks.forEach(function (spark) {
        var orbit = time * 1.6 + spark.phase;
        spark.mesh.visible = magic > 0.08;
        spark.mesh.position.set(
          boxX + Math.cos(orbit) * spark.radius * magic,
          0.88 + magic * (0.55 + Math.sin(orbit * 1.25) * 0.42),
          Math.sin(orbit) * spark.radius * magic,
        );
        spark.mesh.rotation.set(orbit, orbit * 0.7, orbit * 0.4);
        spark.mesh.scale.setScalar(0.15 + magic * 0.85);
      });
      shadow.position.x = mascot.position.x;
      shadow.material.opacity = walking ? 0.2 : 0.28;
    }

    function frame() {
      if (!running) return;
      var now = performance.now();
      if (now - lastFrame < 33) {
        raf = window.requestAnimationFrame(frame);
        return;
      }
      lastFrame = now;
      pose(clock.getElapsedTime());
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running || !stage.isConnected) return;
      running = true;
      clock.start();
      raf = window.requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      window.cancelAnimationFrame(raf);
    }

    resize();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);
    else window.addEventListener("resize", resize, { passive: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) start();
        else stop();
      }, { threshold: 0.05 }).observe(stage);
    } else start();
    stage.classList.add("ws-hero__mascot-track--ready");
  }
})();
