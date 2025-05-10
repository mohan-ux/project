document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...");

  // Register ScrollTrigger plugin first
  gsap.registerPlugin(ScrollTrigger);

  // Initialize core functionality
  initThemeToggle();
  initCursor();
  initParallax();
  initTabSystem();
  initTimelineAnimations();
  initSkillAnimations();
  init3DAvatar();

  /**
   * Initialize custom cursor
   */
  function initCursor() {
    console.log("Initializing cursor...");
    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");

    if (!cursor || !follower) {
      console.warn("Cursor elements not found");
      return;
    }

    document.addEventListener("mousemove", (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });

      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
      });
    });

    // Add hover effect for interactive elements
    const interactives = document.querySelectorAll("a, button, .tab-link");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
        follower.classList.add("active");
      });

      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
        follower.classList.remove("active");
      });
    });
  }

  /**
   * Initialize theme toggle
   */
  function initThemeToggle() {
    console.log("Initializing theme toggle...");
    const themeToggle = document.querySelector(".theme-toggle");
    if (!themeToggle) {
      console.warn("Theme toggle not found");
      return;
    }

    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);

    // Update icon based on current theme
    const themeIcon = themeToggle.querySelector("i");
    if (themeIcon) {
      themeIcon.className =
        currentTheme === "light" ? "fas fa-moon" : "fas fa-sun";
    }

    themeToggle.addEventListener("click", () => {
      const newTheme =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "dark"
          : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);

      // Update icon when theme changes
      if (themeIcon) {
        themeIcon.className =
          newTheme === "light" ? "fas fa-moon" : "fas fa-sun";
      }
    });
  }

  /**
   * Initialize tab system
   */
  function initTabSystem() {
    console.log("Initializing tab system...");
    const tabLinks = document.querySelectorAll(".tab-link");
    const tabContents = document.querySelectorAll(".tab-content");

    if (!tabLinks.length || !tabContents.length) {
      console.warn("Tab elements not found");
      return;
    }

    tabLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const target = link.getAttribute("data-tab");
        console.log(`Switching to tab: ${target}`);

        // Update active states
        tabLinks.forEach((l) => l.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));

        link.classList.add("active");
        const targetContent = document.querySelector(`#${target}`);

        if (targetContent) {
          targetContent.classList.add("active");

          // Animate content
          gsap.fromTo(
            targetContent,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
          );
        }
      });
    });
  }

  /**
   * Initialize timeline animations
   */
  function initTimelineAnimations() {
    console.log("Initializing timeline animations...");
    if (!gsap || !ScrollTrigger) {
      console.error("GSAP or ScrollTrigger not loaded");
      return;
    }

    // Timeline items animation
    const timelineItems = gsap.utils.toArray(".timeline-item");
    if (timelineItems.length === 0) {
      console.warn("No timeline items found");
      return;
    }

    timelineItems.forEach((item, index) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        delay: index * 0.2,
        ease: "power3.out",
      });
    });
  }

  /**
   * Initialize skill animations
   */
  function initSkillAnimations() {
    console.log("Initializing skill animations...");

    // Skills animation
    const skillBars = gsap.utils.toArray(".skill-bar");
    if (skillBars.length === 0) {
      console.warn("No skill bars found");
      return;
    }

    skillBars.forEach((skill, index) => {
      const progressBar = skill.querySelector(".skill-progress-bar");
      if (!progressBar) return;

      const percent = progressBar.getAttribute("data-percent");

      // Set initial width to 0
      gsap.set(progressBar, { width: "0%" });

      gsap.to(progressBar, {
        scrollTrigger: {
          trigger: skill,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
        width: `${percent}%`,
        duration: 1.5,
        delay: index * 0.1,
        ease: "power3.out",
      });
    });
  }

  /**
   * Initialize 3D avatar
   */
  function init3DAvatar() {
    console.log("Initializing 3D avatar...");
    const canvas = document.getElementById("avatar-canvas");
    if (!canvas) {
      console.warn("Avatar canvas not found");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    // Set canvas size
    function resizeCanvas() {
      const container = canvas.parentElement;
      if (!container) return;

      renderer.setSize(container.clientWidth, container.clientWidth);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    }

    // Handle window resize
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Create a geometric avatar (can be replaced with a loaded 3D model later)
    const avatarGeometry = new THREE.IcosahedronGeometry(2, 1);
    const avatarMaterial = new THREE.MeshPhongMaterial({
      color: 0x9966ff,
      wireframe: false,
      flatShading: true,
    });
    const avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);
    scene.add(avatar);

    // Add some particles around the avatar
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Position camera
    camera.position.z = 5;

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Rotate avatar
      avatar.rotation.x += 0.003;
      avatar.rotation.y += 0.005;

      // Slowly rotate particles
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += 0.0005;

      renderer.render(scene, camera);
    }

    animate();
  }

  /**
   * Initialize parallax effects
   */
  function initParallax() {
    console.log("Initializing parallax...");
    const header = document.querySelector(".page-header");
    if (!header) {
      console.warn("Page header not found");
      return;
    }

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      header.style.transform = `translateY(${scrolled * 0.5}px)`;
    });

    window.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      gsap.to(header, {
        x: mouseX * 50,
        y: mouseY * 50,
        duration: 0.5,
      });
    });
  }

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }
});
