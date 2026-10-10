// SPDX-FileCopyrightText: Copyright (c) 2026 cautem
// SPDX-License-Identifier: Apache-2.0

(function () {
  var stage = document.querySelector("[data-mascot-stage]");
  var flow = document.querySelector(".ws-flow");
  if (!stage || !flow) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var loaded = false;

  function fallback() {
    stage.classList.add("ws-hero__mascot-track--fallback");
  }

  async function loadScene() {
    if (loaded || reduceMotion.matches) {
      fallback();
      return;
    }
    loaded = true;
    try {
      var THREE = await import("https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js");
      if (reduceMotion.matches) {
        loaded = false;
        fallback();
        return;
      }
      createScene(THREE);
    } catch (error) {
      console.error("cautem 3D mascot could not be loaded", error);
      fallback();
    }
  }

  if ("IntersectionObserver" in window) {
    var loaderObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      loaderObserver.disconnect();
      if ("requestIdleCallback" in window) window.requestIdleCallback(loadScene, { timeout: 1200 });
      else window.setTimeout(loadScene, 350);
    }, { rootMargin: "180px 0px", threshold: 0.01 });
    loaderObserver.observe(stage);
  } else {
    window.setTimeout(loadScene, 800);
  }

  reduceMotion.addEventListener("change", function (event) {
    if (event.matches) fallback();
    else if (!loaded && stage.getBoundingClientRect().top < window.innerHeight) loadScene();
  });

  function createScene(THREE) {
    var canvas = stage.querySelector("canvas");
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (error) {
      fallback();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 3.2, -3.2, 0.1, 40);
    camera.position.set(0, 0, 14);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xd9efff, 0x16121d, 2.0));
    var key = new THREE.DirectionalLight(0xffecd9, 3.1);
    key.position.set(-3.5, 5, 7);
    scene.add(key);
    var rim = new THREE.DirectionalLight(0x278bff, 2.2);
    rim.position.set(3.5, 2.5, -4);
    scene.add(rim);

    function material(color, roughness, metalness) {
      return new THREE.MeshStandardMaterial({
        color: color,
        roughness: roughness === undefined ? 0.58 : roughness,
        metalness: metalness || 0,
      });
    }

    var hood = material(0x151923, 0.76);
    var hoodLight = material(0x262c38, 0.58);
    var sleeve = material(0x252a34, 0.62);
    var blue = material(0x0879ff, 0.34);
    var blueDeep = material(0x064cba, 0.42);
    var white = material(0xf8f8ff, 0.3);
    var pupil = material(0x090b12, 0.22);
    var muzzle = material(0xffc087, 0.55);
    var orange = material(0xff652b, 0.45);

    function addSphere(parent, mat, position, scale, segments) {
      var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, segments || 24, 18), mat,
      );
      mesh.position.set(position[0], position[1], position[2]);
      mesh.scale.set(scale[0], scale[1], scale[2]);
      parent.add(mesh);
      return mesh;
    }

    function addBox(parent, mat, position, scale) {
      var geometry = new THREE.BoxGeometry(scale[0], scale[1], scale[2]);
      var mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(position[0], position[1], position[2]);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    }

    var gopher = new THREE.Group();
    scene.add(gopher);

    var torso = addSphere(gopher, sleeve, [0, -0.72, -0.05], [1.08, 0.94, 0.66], 28);
    addSphere(gopher, hood, [0, -1.24, 0.27], [0.68, 0.18, 0.4], 24);
    addBox(gopher, orange, [-0.54, -0.96, 0.47], [0.24, 0.1, 0.08]);
    addBox(gopher, white, [-0.54, -1.1, 0.47], [0.24, 0.07, 0.08]);
    var restingArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.42, 5, 14), sleeve);
    restingArm.position.set(-0.7, -0.77, 0.39);
    restingArm.rotation.z = 0.28;
    gopher.add(restingArm);
    var restingPaw = new THREE.Group();
    addSphere(restingPaw, muzzle, [0, 0, 0], [0.2, 0.16, 0.14], 18);
    addSphere(restingPaw, muzzle, [0.14, 0.01, 0.045], [0.075, 0.095, 0.07], 16);
    restingPaw.position.set(-0.78, -1.12, 0.62);
    gopher.add(restingPaw);

    var head = new THREE.Group();
    gopher.add(head);
    // A rounded hood frames the blue face; no handheld props are part of this scene.
    addSphere(head, hood, [0, 0, 0], [1.12, 1.05, 0.7], 32);
    addSphere(head, hoodLight, [0, 0.62, 0.11], [0.94, 0.36, 0.59], 28);
    [-1, 1].forEach(function (side) {
      addSphere(head, hood, [side * 0.94, 0.43, -0.01], [0.34, 0.38, 0.29], 22);
      addSphere(head, blue, [side * 0.97, 0.45, 0.12], [0.21, 0.24, 0.12], 20);
      addSphere(head, blueDeep, [side * 0.97, 0.45, 0.22], [0.11, 0.15, 0.04], 16);
    });
    addSphere(head, blue, [0, -0.12, 0.48], [0.87, 0.76, 0.36], 32);

    var markCanvas = document.createElement("canvas");
    markCanvas.width = 96;
    markCanvas.height = 96;
    var markContext = markCanvas.getContext("2d");
    var mark = [
      "001111100", "011111110", "111111111", "110110110", "111111111",
      "011101110", "011101110", "001101100", "001001000",
    ];
    markContext.fillStyle = "#fff";
    mark.forEach(function (row, y) {
      Array.prototype.forEach.call(row, function (pixel, x) {
        if (pixel === "1") markContext.fillRect(x * 10 + 1, y * 10 + 1, 8, 8);
      });
    });
    var markTexture = new THREE.CanvasTexture(markCanvas);
    markTexture.colorSpace = THREE.SRGBColorSpace;
    var logoMark = new THREE.Mesh(
      new THREE.PlaneGeometry(0.54, 0.54),
      new THREE.MeshBasicMaterial({ map: markTexture, transparent: true, toneMapped: false }),
    );
    logoMark.position.set(0, 0.64, 0.69);
    logoMark.rotation.x = -0.1;
    head.add(logoMark);

    var eyes = [];
    var pupils = [];
    var glints = [];
    [-1, 1].forEach(function (side) {
      var eyeX = side * 0.34;
      var eyeY = side > 0 ? 0.22 : 0.27;
      var eye = addSphere(head, white, [eyeX, eyeY, 0.76], [side > 0 ? 0.35 : 0.32, side > 0 ? 0.39 : 0.36, 0.13], 24);
      var eyePupil = addSphere(head, pupil, [eyeX, eyeY, 0.88], [0.14, 0.16, 0.055], 20);
      var glint = addSphere(head, white, [eyeX - 0.04, eyeY + 0.06, 0.93], [0.035, 0.04, 0.018], 12);
      eyes.push(eye);
      pupils.push(eyePupil);
      glints.push(glint);
    });
    addSphere(head, muzzle, [-0.11, -0.12, 0.8], [0.16, 0.12, 0.09], 18);
    addSphere(head, muzzle, [0.11, -0.12, 0.8], [0.16, 0.12, 0.09], 18);
    addSphere(head, pupil, [0, -0.07, 0.89], [0.11, 0.075, 0.06], 20);
    addBox(head, white, [-0.055, -0.29, 0.81], [0.09, 0.2, 0.07]);
    addBox(head, white, [0.055, -0.29, 0.81], [0.09, 0.2, 0.07]);

    var reachArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 1, 5, 16), sleeve);
    var orangeCuff = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.045, 10, 20), orange);
    var whiteCuff = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.035, 10, 20), white);
    var paw = new THREE.Group();
    addSphere(paw, muzzle, [0, 0, 0], [0.19, 0.15, 0.14], 20);
    addSphere(paw, muzzle, [0.13, 0.015, 0.055], [0.07, 0.085, 0.065], 16);
    scene.add(reachArm, orangeCuff, whiteCuff, paw);
    reachArm.visible = false;
    orangeCuff.visible = false;
    whiteCuff.visible = false;
    paw.visible = false;

    var raf = 0;
    var running = false;
    var lastFrame = 0;
    var sceneTime = 0;
    var pointerX = 0;
    var pointerY = 0;
    var motion = null;
    var stageRect = null;
    var flowRect = null;
    var tabRects = [];
    var worldHeight = 6.4;
    var worldWidth = 8;
    var edgeY = -1;

    function clamp(value) { return Math.max(0, Math.min(1, value)); }
    function smooth(value) {
      value = clamp(value);
      return value * value * (3 - 2 * value);
    }
    function worldPoint(x, y) {
      return {
        x: ((x - stageRect.left) / stageRect.width - 0.5) * worldWidth,
        y: worldHeight / 2 - ((y - stageRect.top) / stageRect.height) * worldHeight,
      };
    }

    function measure() {
      var width = Math.max(1, stage.clientWidth);
      var height = Math.max(1, stage.clientHeight);
      stageRect = stage.getBoundingClientRect();
      flowRect = flow.getBoundingClientRect();
      tabRects = Array.prototype.map.call(flow.querySelectorAll("[data-flow-tab]"), function (tab) {
        return tab.getBoundingClientRect();
      });
      worldWidth = worldHeight * width / height;
      camera.left = -worldWidth / 2;
      camera.right = worldWidth / 2;
      camera.top = worldHeight / 2;
      camera.bottom = -worldHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      edgeY = worldPoint(stageRect.left, flowRect.top).y;
    }

    function tabPoint(index) {
      var rect = tabRects[index] || tabRects[0];
      return worldPoint(rect.left + rect.width / 2, rect.top + rect.height * 0.05);
    }

    function animateTap(index, commit) {
      if (reduceMotion.matches || !tabRects.length) {
        if (commit) commit();
        return;
      }
      var point = tabPoint(index);
      motion = {
        start: performance.now(),
        fromX: gopher.position.x,
        targetX: point.x - 0.3,
        targetY: point.y,
        index: index,
        commit: commit,
        committed: false,
      };
    }

    flow.addEventListener("ws-flow:beforechange", function (event) {
      var detail = event.detail || {};
      if ((detail.source === "manual" || detail.source === "auto") && !reduceMotion.matches) {
        animateTap(detail.index, detail.defer());
      }
    });

    var hero = stage.closest(".ws-hero__image");
    if (hero) {
      hero.addEventListener("pointermove", function (event) {
        var bounds = hero.getBoundingClientRect();
        pointerX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
        pointerY = Math.max(-1, Math.min(1, (1 - (event.clientY - bounds.top) / bounds.height) * 2));
      }, { passive: true });
      hero.addEventListener("pointerleave", function () {
        pointerX = 0;
        pointerY = 0;
      });
    }

    function pose(time, now) {
      var progress = motion ? clamp((now - motion.start) / 1500) : 0;
      var rise = motion
        ? smooth(progress / 0.32) * (1 - smooth((progress - 0.74) / 0.26))
        : 0;
      var targetX = motion ? motion.targetX : 0;
      gopher.position.x += (targetX - gopher.position.x) * (motion ? 0.12 : 0.045);
      gopher.position.y = edgeY - 0.1 + rise * 0.8 + Math.sin(time * 2.2) * 0.015;
      gopher.rotation.y += (pointerX * 0.18 - gopher.rotation.y) * 0.08;
      gopher.rotation.z += (-pointerX * 0.025 - gopher.rotation.z) * 0.08;
      head.rotation.x += (pointerY * 0.08 - head.rotation.x) * 0.08;
      head.rotation.y += (pointerX * 0.08 - head.rotation.y) * 0.08;
      head.rotation.z = Math.sin(time * 1.4) * 0.012 - pointerX * 0.025;
      torso.position.y = gopher.position.y - 0.72;

      var reach = motion ? smooth((progress - 0.2) / 0.2) * (1 - smooth((progress - 0.8) / 0.18)) : 0;
      reachArm.visible = reach > 0.02;
      orangeCuff.visible = reach > 0.02;
      whiteCuff.visible = reach > 0.02;
      paw.visible = reach > 0.02;
      if (motion && reach > 0.02) {
        var shoulderPoint = new THREE.Vector3(gopher.position.x + 0.48, gopher.position.y - 0.42, 0.62);
        var press = progress > 0.48 && progress < 0.66
          ? Math.sin(((progress - 0.48) / 0.18) * Math.PI) * 0.16
          : 0;
        var hand = new THREE.Vector3(motion.targetX + 0.3, motion.targetY + 0.2 - press, 0.82);
        var delta = hand.clone().sub(shoulderPoint);
        reachArm.position.copy(shoulderPoint).add(hand).multiplyScalar(0.5);
        reachArm.scale.set(1, delta.length() / 1.34, 1);
        reachArm.rotation.z = Math.atan2(delta.x, delta.y);
        orangeCuff.position.copy(hand).add(delta.clone().normalize().multiplyScalar(-0.15));
        whiteCuff.position.copy(hand).add(delta.clone().normalize().multiplyScalar(-0.25));
        orangeCuff.rotation.set(0, 0, reachArm.rotation.z);
        whiteCuff.rotation.set(0, 0, reachArm.rotation.z);
        paw.position.copy(hand);
        paw.rotation.z = reachArm.rotation.z * 0.25 + (press ? 0.18 : 0);
        if (progress >= 0.56 && !motion.committed) {
          motion.committed = true;
          if (motion.commit) motion.commit();
        }
      }

      if (motion && progress > 0.2 && progress < 0.97) stage.classList.add("ws-hero__mascot-track--foreground");
      else stage.classList.remove("ws-hero__mascot-track--foreground");
      if (motion && progress >= 1) {
        motion = null;
        reachArm.visible = false;
        orangeCuff.visible = false;
        whiteCuff.visible = false;
        paw.visible = false;
        stage.classList.remove("ws-hero__mascot-track--foreground");
      }

      pupils.forEach(function (eye, index) {
        var side = index ? 1 : -1;
        eye.position.x = side * 0.34 + pointerX * 0.07;
        eye.position.y = (side > 0 ? 0.22 : 0.27) + pointerY * 0.05;
        glints[index].position.x = eye.position.x - 0.035;
        glints[index].position.y = eye.position.y + 0.06;
      });
      var blink = Math.max(0, 1 - Math.abs((time % 4.6) - 4.05) / 0.12);
      eyes.forEach(function (eye, index) {
        eye.scale.y = (index ? 0.39 : 0.36) * (1 - blink * 0.85);
        pupils[index].scale.y = 0.16 * (1 - blink * 0.85);
        glints[index].visible = blink < 0.7;
      });
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
      pose(sceneTime, now);
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running || !stage.isConnected || reduceMotion.matches) return;
      running = true;
      lastFrame = 0;
      raf = window.requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      window.cancelAnimationFrame(raf);
    }

    measure();
    pose(0, performance.now());
    renderer.render(scene, camera);
    stage.classList.add("ws-hero__mascot-track--ready");
    if ("ResizeObserver" in window) new ResizeObserver(measure).observe(stage);
    else window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) start();
        else stop();
      }, { threshold: 0.01 }).observe(stage);
    } else start();
    reduceMotion.addEventListener("change", function (event) {
      if (event.matches) {
        stop();
        fallback();
        stage.classList.remove("ws-hero__mascot-track--ready", "ws-hero__mascot-track--foreground");
      } else {
        stage.classList.remove("ws-hero__mascot-track--fallback");
        stage.classList.add("ws-hero__mascot-track--ready");
        start();
      }
    });
  }
})();
