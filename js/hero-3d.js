/**
 * OPLIORA HERO 3D SCENE (Three.js + Custom GLSL Shader)
 * Art-directed kinetic 3D identity inspired by the upward ascending
 * facets and arrow of the Opliora logo.
 *
 * Features:
 * - Custom GLSL vertex & fragment shaders with dynamic Fresnel rim lighting
 * - Ascending crystalline geometric prisms & beveled arrow form
 * - Responsive pointer parallax with smooth damping (lerp)
 * - Viewport visibility culling (IntersectionObserver)
 * - Tab visibility detection (pauses when hidden)
 * - Clamped DPR (max 1.75) for 60fps performance on high-res displays
 * - Graceful fallback to static high-precision SVG if WebGL unavailable
 */

export class Hero3DScene {
  constructor(containerEl, fallbackEl) {
    this.container = containerEl;
    this.fallback = fallbackEl;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    this.material = null;
    this.accentMaterial = null;
    this.coreGroup = null;
    this.animationFrameId = null;

    // Mouse coordinates & smoothed targets
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isVisible = true;
    this.isPaused = false;
    this.hasWebGL = false;

    this.init();
  }

  checkWebGLSupport() {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch {
      return false;
    }
  }

  init() {
    if (!this.container) return;

    // Reduced motion preference check
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      this.showFallback();
      return;
    }

    if (!window.THREE || !this.checkWebGLSupport()) {
      console.info("✦ WebGL not available or Three.js missing. Using SVG fallback.");
      this.showFallback();
      return;
    }

    this.hasWebGL = true;
    if (this.fallback) {
      this.fallback.style.display = "none";
    }

    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 560;

    // 1. Scene & Clock
    this.scene = new window.THREE.Scene();
    this.clock = new window.THREE.Clock();

    // 2. Camera
    this.camera = new window.THREE.PerspectiveCamera(
      42,
      width / height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 7.5);

    // 3. Renderer with clamped DPR & antialias
    this.renderer = new window.THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(width, height);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(0x000000, 0);

    // Add canvas to container
    this.renderer.domElement.className = "hero__canvas";
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.renderer.domElement.style.pointerEvents = "none";
    this.container.appendChild(this.renderer.domElement);

    // 4. Build Custom Shader Materials
    this.createShaderMaterials();

    // 5. Build Geometric Monogram Model
    this.buildGeometry();

    // 6. Setup Lighting & Ambience
    this.setupLighting();

    // 7. Event Listeners
    this.bindEvents();

    // 8. Start Render Loop
    this.animate();
  }

  createShaderMaterials() {
    // Custom GLSL Shaders for Opliora's translucent ascending prism
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      varying vec2 vUv;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec3 uColorCyan;
      uniform vec3 uColorMint;
      uniform vec3 uColorNavy;

      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vViewPosition;
      varying vec2 vUv;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // Fresnel Rim calculation
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);

        // Vertical ascending shimmer wave
        float wave = sin(vPosition.y * 2.2 - uTime * 1.8) * 0.5 + 0.5;

        // Gradient blend between Opliora Cyan and Mint
        vec3 baseColor = mix(uColorCyan, uColorMint, vPosition.y * 0.35 + 0.5);

        // Shimmer highlight
        vec3 surfaceGlow = mix(baseColor, vec3(1.0, 1.0, 1.0), wave * 0.35);

        // Edge rim light
        vec3 finalColor = mix(uColorNavy, surfaceGlow, 0.45) + (baseColor * fresnel * 1.6);

        float alpha = clamp(0.45 + fresnel * 0.55 + wave * 0.15, 0.0, 0.95);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    this.material = new window.THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColorCyan: { value: new window.THREE.Color("#20C4E4") },
        uColorMint: { value: new window.THREE.Color("#67E6AE") },
        uColorNavy: { value: new window.THREE.Color("#0A1628") },
      },
      transparent: true,
      side: window.THREE.DoubleSide,
      depthWrite: false,
      blending: window.THREE.AdditiveBlending,
    });

    // Accent line/wireframe material for crisp geometric edges
    this.accentMaterial = new window.THREE.MeshBasicMaterial({
      color: 0x67e6ae,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
  }

  buildGeometry() {
    this.coreGroup = new window.THREE.Group();

    // ── Prisms Composition Inspired by Opliora Monogram ──
    // 1. Foundation ascending chevron bar
    const barGeo1 = new window.THREE.BoxGeometry(0.85, 2.4, 0.45);
    const mesh1 = new window.THREE.Mesh(barGeo1, this.material);
    mesh1.position.set(-1.3, -0.6, -0.2);
    mesh1.rotation.z = Math.PI / 5.2; // ~34.6 deg slant
    this.coreGroup.appendChild ? this.coreGroup.add(mesh1) : this.coreGroup.add(mesh1);

    const wire1 = new window.THREE.Mesh(barGeo1, this.accentMaterial);
    mesh1.add(wire1);

    // 2. Middle ascending crystal segment
    const barGeo2 = new window.THREE.BoxGeometry(0.85, 3.2, 0.55);
    const mesh2 = new window.THREE.Mesh(barGeo2, this.material);
    mesh2.position.set(0.1, 0.1, 0.0);
    mesh2.rotation.z = Math.PI / 4.8;
    this.coreGroup.add(mesh2);

    const wire2 = new window.THREE.Mesh(barGeo2, this.accentMaterial);
    mesh2.add(wire2);

    // 3. Prominent Soaring Arrowhead Prism
    const arrowConeGeo = new window.THREE.ConeGeometry(1.2, 2.4, 4); // 4-sided diamond pyramid
    const arrowMesh = new window.THREE.Mesh(arrowConeGeo, this.material);
    arrowMesh.position.set(1.4, 1.4, 0.35);
    arrowMesh.rotation.z = -Math.PI / 6.5;
    arrowMesh.rotation.y = Math.PI / 4;
    this.coreGroup.add(arrowMesh);

    const arrowWire = new window.THREE.Mesh(arrowConeGeo, this.accentMaterial);
    arrowMesh.add(arrowWire);

    // 4. Translucent Floating Orbit Ring (Subtle Gyro Halo)
    const ringGeo = new window.THREE.TorusGeometry(3.0, 0.018, 16, 100);
    const ringMat = new window.THREE.MeshBasicMaterial({
      color: 0x20c4e4,
      transparent: true,
      opacity: 0.25,
    });
    this.orbitRing = new window.THREE.Mesh(ringGeo, ringMat);
    this.orbitRing.rotation.x = Math.PI / 2.3;
    this.orbitRing.rotation.y = -Math.PI / 6.0;
    this.coreGroup.add(this.orbitRing);

    // Position overall group nicely in hero view
    this.coreGroup.position.set(0, 0, 0);
    this.scene.add(this.coreGroup);
  }

  setupLighting() {
    const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const pointLight1 = new window.THREE.PointLight(0x20c4e4, 2.2, 20);
    pointLight1.position.set(3, 4, 4);
    this.scene.add(pointLight1);

    const pointLight2 = new window.THREE.PointLight(0x67e6ae, 1.8, 20);
    pointLight2.position.set(-4, -3, 2);
    this.scene.add(pointLight2);
  }

  bindEvents() {
    this.handleMouseMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Normalize between -1 and 1
      this.mouse.targetX = (clientX / rect.width) * 2 - 1;
      this.mouse.targetY = -(clientY / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", this.handleMouseMove, { passive: true });

    this.handleResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (width === 0 || height === 0) return;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    };

    window.addEventListener("resize", this.handleResize, { passive: true });

    // Culling when hero section scrolls out of view
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    this.observer.observe(this.container);

    // Tab visibility pause
    this.handleVisibilityChange = () => {
      this.isPaused = document.hidden;
    };
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (!this.isVisible || this.isPaused || !this.renderer || !this.scene) {
      return;
    }

    const elapsedTime = this.clock.getElapsedTime();

    // Update uniform time for shader wave effect
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uTime.value = elapsedTime;
    }

    // Smooth lerp mouse coordinates
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    // Organic levitation & subtle continuous rotation
    if (this.coreGroup) {
      // Gentle floating Y oscillation
      this.coreGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.18;

      // Controlled rotational tilt responding to cursor
      this.coreGroup.rotation.y =
        Math.sin(elapsedTime * 0.3) * 0.15 + this.mouse.x * 0.45;
      this.coreGroup.rotation.x =
        Math.cos(elapsedTime * 0.25) * 0.1 - this.mouse.y * 0.35;
      this.coreGroup.rotation.z = Math.sin(elapsedTime * 0.2) * 0.05;
    }

    if (this.orbitRing) {
      this.orbitRing.rotation.z = elapsedTime * 0.12;
    }

    this.renderer.render(this.scene, this.camera);
  }

  showFallback() {
    if (this.fallback) {
      this.fallback.style.display = "block";
    }
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.style.display = "none";
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);

    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}

