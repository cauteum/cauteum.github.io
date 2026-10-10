// SPDX-FileCopyrightText: Copyright (c) 2026 cauteum
// SPDX-License-Identifier: Apache-2.0

(function () {
  var stage = document.querySelector("[data-mascot-stage]");
  if (!stage) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var staticLabel = stage.getAttribute("aria-label");
  var loaded = false;

  // Keep the static mascot visible until the 3D scene is near the viewport and ready.
  async function loadScene() {
    if (loaded || reducedMotion.matches) return;
    loaded = true;
    try {
      var THREE = await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js");
      if (reducedMotion.matches) { loaded = false; return; }
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
    portalLight.position.set(1.35, 1.2, 0.1);
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

    function shapedPanel(parent, material, shape, depth, position, bevel) {
      return add(parent, new THREE.ExtrudeGeometry(shape, {
        depth: depth, bevelEnabled: true, bevelThickness: bevel,
        bevelSize: bevel, bevelSegments: 4, curveSegments: 12,
      }), material, position);
    }

    function roundedPanel(parent, material, width, height, depth, radius, position) {
      var x = -width / 2;
      var y = -height / 2;
      var shape = new THREE.Shape();
      shape.moveTo(x + radius, y);
      shape.lineTo(x + width - radius, y);
      shape.quadraticCurveTo(x + width, y, x + width, y + radius);
      shape.lineTo(x + width, y + height - radius);
      shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      shape.lineTo(x + radius, y + height);
      shape.quadraticCurveTo(x, y + height, x, y + height - radius);
      shape.lineTo(x, y + radius);
      shape.quadraticCurveTo(x, y, x + radius, y);
      return shapedPanel(parent, material, shape, depth, position,
        Math.min(0.075, radius * 0.25));
    }

    var mascot = new THREE.Group();
    scene.add(mascot);
    var body = new THREE.Group();
    mascot.add(body);

    // The silhouette follows the supplied reference: backpack, chunky hoodie,
    // rounded blue face, exposed ears, orange cuff and a small screen in hand.
    roundedPanel(body, trim, 0.63, 0.82, 0.24, 0.19, [-0.42, 0.94, -0.4]);
    sphere(body, orange, [-0.67, 1.25, -0.18], [0.18, 0.05, 0.09], 18);
    sphere(body, hoodie, [0, 0.87, -0.02], [0.53, 0.59, 0.41], 32);
    sphere(body, trim, [0, 0.53, 0.02], [0.46, 0.1, 0.34], 24);
    capsule(body, seam, 0.035, 0.23, [0, 0.94, 0.405]);
    sphere(body, blue, [0, 1.05, 0.42], [0.085, 0.065, 0.03], 16);

    var head = new THREE.Group();
    head.position.y = 1.68;
    body.add(head);
    sphere(head, blue, [-0.66, 0.64, -0.12], [0.2, 0.23, 0.16], 24);
    sphere(head, blue, [0.66, 0.64, -0.12], [0.2, 0.23, 0.16], 24);
    sphere(head, blueShade, [-0.66, 0.64, 0.025], [0.115, 0.13, 0.035], 18);
    sphere(head, blueShade, [0.66, 0.64, 0.025], [0.115, 0.13, 0.035], 18);
    var hoodShape = new THREE.Shape();
    hoodShape.moveTo(-0.4, -0.7);
    hoodShape.bezierCurveTo(-0.7, -0.69, -0.82, -0.45, -0.76, -0.13);
    hoodShape.bezierCurveTo(-0.82, 0.15, -0.68, 0.53, -0.47, 0.67);
    hoodShape.bezierCurveTo(-0.25, 0.78, 0.29, 0.78, 0.5, 0.66);
    hoodShape.bezierCurveTo(0.75, 0.51, 0.82, 0.14, 0.75, -0.14);
    hoodShape.bezierCurveTo(0.82, -0.45, 0.66, -0.69, 0.37, -0.7);
    hoodShape.bezierCurveTo(0.1, -0.75, -0.15, -0.74, -0.4, -0.7);
    shapedPanel(head, hoodie, hoodShape, 0.42, [0, 0, -0.25], 0.075);

    var faceShape = new THREE.Shape();
    faceShape.moveTo(-0.37, -0.5);
    faceShape.bezierCurveTo(-0.63, -0.48, -0.68, -0.25, -0.63, -0.02);
    faceShape.bezierCurveTo(-0.67, 0.22, -0.55, 0.45, -0.33, 0.51);
    faceShape.bezierCurveTo(-0.13, 0.57, 0.2, 0.56, 0.39, 0.49);
    faceShape.bezierCurveTo(0.6, 0.4, 0.69, 0.16, 0.64, -0.06);
    faceShape.bezierCurveTo(0.7, -0.29, 0.58, -0.5, 0.35, -0.51);
    faceShape.bezierCurveTo(0.12, -0.56, -0.13, -0.55, -0.37, -0.5);
    shapedPanel(head, blue, faceShape, 0.1, [0, -0.04, 0.24], 0.065);
    var eyes = [];
    var pupils = [];
    var glints = [];
    [-1, 1].forEach(function (side) {
      eyes.push(sphere(head, white, [side * 0.255, 0.12, 0.44], [0.205, 0.23, 0.065], 24));
      pupils.push(sphere(head, black, [side * 0.255, 0.105, 0.506], [0.085, 0.1, 0.04], 20));
      glints.push(sphere(head, white, [side * 0.255 - 0.026, 0.145, 0.541], [0.023, 0.025, 0.012], 12));
    });
    sphere(head, skin, [-0.095, -0.19, 0.468], [0.11, 0.09, 0.055], 18);
    sphere(head, skin, [0.095, -0.19, 0.468], [0.11, 0.09, 0.055], 18);
    sphere(head, black, [0, -0.15, 0.53], [0.105, 0.065, 0.055], 20);
    sphere(head, white, [-0.052, -0.29, 0.485], [0.052, 0.09, 0.035], 16);
    sphere(head, white, [0.052, -0.29, 0.485], [0.052, 0.09, 0.035], 16);

    var hoodMark = [
      [-1, 2], [0, 2], [1, 2], [-1, 1], [1, 1], [-2, 0], [2, 0],
      [-1, -1], [1, -1], [-1, -2], [1, -2],
    ];
    hoodMark.forEach(function (point) {
      add(head, new THREE.BoxGeometry(0.055, 0.055, 0.025), white,
        [point[0] * 0.06, 0.67 + point[1] * 0.05, 0.31]);
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
      arm.position.set(side * 0.39, 1.18, 0.3);
      body.add(arm);
      capsule(arm, hoodie, 0.17, 0.32, [side * 0.07, -0.25, 0.03]);
      var whiteBand = add(arm, new THREE.CylinderGeometry(0.15, 0.15, 0.065, 18), white,
        [side * 0.07, -0.385, 0.03]);
      var orangeBand = add(arm, new THREE.CylinderGeometry(0.15, 0.15, 0.095, 18), orange,
        [side * 0.07, -0.465, 0.03]);
      whiteBand.castShadow = true;
      orangeBand.castShadow = true;
      sphere(arm, skin, [side * 0.07, -0.54, 0.08], [0.14, 0.14, 0.14]);
      arms.push(arm);
    });

    var tablet = new THREE.Group();
    tablet.position.set(0, 0.82, 0.66);
    tablet.rotation.z = -0.06;
    body.add(tablet);
    roundedPanel(tablet, hoodie, 0.82, 0.63, 0.07, 0.09, [0, 0, 0]);
    roundedPanel(tablet, trim, 0.69, 0.5, 0.018, 0.06, [0, 0, 0.105]);
    hoodMark.forEach(function (point) {
      add(tablet, new THREE.BoxGeometry(0.035, 0.035, 0.013), white,
        [point[0] * 0.037, point[1] * 0.036, 0.17]);
    });

    // The Pandora box is a separate hinged 3D prop with brass corners and a glowing core.
    var boxX = 1.35;
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
    var boxShadow = shadow.clone();
    boxShadow.material = shadow.material.clone();
    boxShadow.material.opacity = 0.18;
    boxShadow.scale.set(0.72, 0.37, 1);
    boxShadow.position.x = boxX;
    scene.add(boxShadow);

    var running = false;
    var raf = 0;
    var halfWidth = 2.5;
    var targetX = -0.65;
    var lastFrame = 0;
    var sceneTime = 0;
    var lookX = 0;
    var lookY = 0;
    var pointerX = 0;
    var pointerY = 0;
    var activationAt = -100;
    var tabReactionAt = -100;
    var tabIndex = 0;

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

    var hero = stage.closest(".ws-hero") || stage;
    hero.addEventListener("pointermove", function (event) {
      var bounds = hero.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      pointerY = Math.max(-1, Math.min(1, 1 - (event.clientY - bounds.top) / bounds.height * 2));
    }, { passive: true });
    hero.addEventListener("pointerleave", function () { pointerX = 0; pointerY = 0; });

    function activate() {
      if (reducedMotion.matches) return;
      activationAt = performance.now() / 1000 + Math.max(0, 2.8 - sceneTime);
    }
    stage.addEventListener("click", activate);
    stage.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      activate();
    });
    hero.querySelectorAll("[data-flow-tab]").forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabIndex = Number(tab.dataset.flowTab);
        tabReactionAt = performance.now() / 1000;
        if (tabIndex === 0) activate();
      });
    });

    function pose(time) {
      var entering = time < 2.8;
      var progress = smooth(time / 2.8);
      var stride = time * 8.4;
      var gait = entering ? Math.sin(progress * Math.PI) : 0;
      var now = performance.now() / 1000;
      var age = now - activationAt;
      var open = age >= 0 ? smooth(age / 0.55) * (1 - smooth((age - 3.45) / 0.7)) : 0;
      var reaction = Math.max(0, 1 - (now - tabReactionAt) / 1.3);
      var delight = open * (0.06 + Math.sin(time * 8) * 0.018);

      lookX += (pointerX - lookX) * 0.09;
      lookY += (pointerY - lookY) * 0.09;
      mascot.position.x = -Math.max(2.25, halfWidth - 0.15) +
        (targetX + Math.max(2.25, halfWidth - 0.15)) * progress;
      mascot.position.y = entering
        ? 0.02 + Math.abs(Math.sin(stride)) * 0.03 * gait
        : Math.sin(time * 2) * 0.012 + delight;
      mascot.rotation.y = entering ? 0.9 - 0.82 * smooth((time - 2.0) / 0.8) : 0.08 + lookX * 0.18;
      body.rotation.z = entering ? -0.055 + Math.sin(stride) * 0.035 * gait
        : Math.sin(time * 1.45) * 0.012 + reaction * (tabIndex === 1 ? 0.04 : -0.025);
      body.rotation.x = entering ? 0.065 : Math.sin(time * 1.1) * 0.012;
      head.rotation.y = lookX * 0.14;
      head.rotation.x = -lookY * 0.09;
      head.rotation.z = -lookX * 0.04 + reaction * 0.025;
      var blinkPhase = time % 4.7;
      var blink = Math.max(0, 1 - Math.abs(blinkPhase - 4.15) / 0.13);
      eyes.forEach(function (eye, index) {
        eye.scale.y = 0.23 * (1 - blink * 0.9);
        pupils[index].scale.y = 0.1 * (1 - blink * 0.9);
        pupils[index].position.x = (index ? 1 : -1) * 0.255 + lookX * 0.05;
        pupils[index].position.y = 0.105 + lookY * 0.045;
        glints[index].position.x = pupils[index].position.x - 0.026;
        glints[index].position.y = pupils[index].position.y + 0.04;
        glints[index].visible = blink < 0.75;
      });

      legs.forEach(function (leg, index) {
        var offset = index ? Math.PI : 0;
        var phase = stride + offset;
        var step = Math.sin(phase);
        leg.hip.rotation.x = step * 0.62 * gait;
        leg.hip.rotation.z = Math.cos(phase) * 0.03 * gait;
        leg.knee.rotation.x = Math.max(0, step) * 0.72 * gait;
        leg.foot.rotation.x = -Math.max(0, step) * 0.3 * gait;
      });
      arms.forEach(function (arm, index) {
        var side = index ? 1 : -1;
        var offset = index ? 0 : Math.PI;
        arm.rotation.x = entering ? Math.sin(stride + offset) * 0.38 * gait
          : -0.55 - (index ? reaction * 0.28 : 0);
        arm.rotation.z = entering ? side * 0.055 : side * 0.07;
      });
      tablet.scale.setScalar(smooth((time - 2.35) / 0.55));
      tablet.rotation.z = -0.06 + Math.sin(time * 2) * 0.012 + reaction * 0.08;

      lidPivot.rotation.x = -open * 1.28;
      portalLight.intensity = open * 42;
      core.scale.set(0.34 + open * 0.32, 0.05 + open * 0.72, 0.34 + open * 0.32);
      core.material.opacity = 0.35 + open * 0.65;
      latch.material.emissiveIntensity = 0.3 + open * 4;
      sparks.forEach(function (spark) {
        var orbit = time * 1.6 + spark.phase;
        spark.mesh.visible = open > 0.08;
        spark.mesh.position.set(
          boxX + Math.cos(orbit) * spark.radius * open,
          0.88 + open * (0.55 + Math.sin(orbit * 1.25) * 0.42),
          Math.sin(orbit) * spark.radius * open,
        );
        spark.mesh.rotation.set(orbit, orbit * 0.7, orbit * 0.4);
        spark.mesh.scale.setScalar(0.15 + open * 0.85);
      });
      shadow.position.x = mascot.position.x;
      shadow.material.opacity = entering ? 0.2 : 0.28;
    }

    function frame() {
      if (!running) return;
      var now = performance.now();
      if (now - lastFrame < 33) {
        raf = window.requestAnimationFrame(frame);
        return;
      }
      sceneTime += lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0.033;
      lastFrame = now;
      pose(sceneTime);
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running || !stage.isConnected) return;
      running = true;
      lastFrame = 0;
      raf = window.requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      window.cancelAnimationFrame(raf);
    }

    resize();
    pose(0);
    renderer.render(scene, camera);
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);
    else window.addEventListener("resize", resize, { passive: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !reducedMotion.matches) start();
        else stop();
      }, { threshold: 0.05 }).observe(stage);
    } else start();
    reducedMotion.addEventListener("change", function (event) {
      if (event.matches) {
        stop();
        stage.classList.remove("ws-hero__mascot-track--ready");
        stage.setAttribute("role", "img");
        stage.setAttribute("aria-label", staticLabel);
        stage.removeAttribute("tabindex");
      } else {
        stage.classList.add("ws-hero__mascot-track--ready");
        stage.setAttribute("role", "button");
        stage.setAttribute("aria-label", stage.dataset.actionLabel);
        stage.tabIndex = 0;
        if (stage.getBoundingClientRect().top < window.innerHeight) start();
      }
    });
    stage.setAttribute("role", "button");
    stage.setAttribute("aria-label", stage.dataset.actionLabel);
    stage.tabIndex = 0;
    stage.classList.add("ws-hero__mascot-track--ready");
  }
})();
