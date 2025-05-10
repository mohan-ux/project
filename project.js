/**
 * Enhanced Projects Page JavaScript
 * Features smooth animations, advanced filtering, and interactive modals
 */

document.addEventListener("DOMContentLoaded", () => {
  // Core elements
  const projectCards = document.querySelectorAll(".project-card");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const modal = document.getElementById("project-modal");
  const modalContent = modal ? modal.querySelector(".modal-content") : null;
  const closeModalBtn = modal ? modal.querySelector(".close-modal") : null;
  const modalBody = modal ? modal.querySelector(".modal-body") : null;

  // Initialize theme toggle
  initThemeToggle();

  // Initialize other functionality
  initProjectCards();
  initFilters();
  initModalSystem();
  initProjectsHeaderCanvas();
  initParallaxEffects();

  /**
   * Initialize theme toggle functionality
   */
  function initThemeToggle() {
    const themeToggle = document.querySelector(".theme-toggle");
    const themeIcon = document.querySelector(".theme-toggle i");

    if (!themeToggle || !themeIcon) return;

    let currentTheme = localStorage.getItem("theme") || "light";

    // Apply theme to both document element and body
    document.documentElement.setAttribute("data-theme", currentTheme);
    document.body.setAttribute("data-theme", currentTheme);

    // Set initial icon
    themeIcon.className =
      currentTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

    themeToggle.addEventListener("click", () => {
      currentTheme = currentTheme === "light" ? "dark" : "light";

      // Update both document element and body
      document.documentElement.setAttribute("data-theme", currentTheme);
      document.body.setAttribute("data-theme", currentTheme);

      // Update icon
      themeIcon.className =
        currentTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

      // Save to localStorage
      localStorage.setItem("theme", currentTheme);

      // Reinitialize 3D scene if it exists
      if (typeof initThreeScene === "function") {
        initThreeScene();
      }
    });
  }

  /**
   * Initialize project cards with staggered reveal animation
   */
  function initProjectCards() {
    // Add entrance animation with staggered delay
    projectCards.forEach((card, index) => {
      // Set initial state
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";

      // Staggered animation timing
      setTimeout(() => {
        card.style.transition = "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 100 * index);

      // Add enhanced hover effect
      addHoverEffect(card);

      // Add click event for project card
      addCardClickEvent(card);
    });
  }

  /**
   * Add interactive hover effect to project cards
   * @param {HTMLElement} card - Project card element
   */
  function addHoverEffect(card) {
    // Create and append glare effect element
    const glareElement = document.createElement("div");
    glareElement.classList.add("card-glare");
    card.appendChild(glareElement);

    // Mouse movement tracking for 3D tilt effect
    card.addEventListener("mousemove", (e) => {
      const cardRect = card.getBoundingClientRect();

      // Calculate mouse position relative to card center
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Calculate rotation values (max 8 degrees)
      const rotateY = ((mouseX - cardCenterX) / (cardRect.width / 2)) * 8;
      const rotateX = -((mouseY - cardCenterY) / (cardRect.height / 2)) * 8;

      // Apply 3D transformation
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

      // Update glare position
      const glareX = ((mouseX - cardRect.left) / cardRect.width) * 100;
      const glareY = ((mouseY - cardRect.top) / cardRect.height) * 100;
      glareElement.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%)`;
    });

    // Reset transform on mouse leave
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      glareElement.style.background = "none";
    });
  }

  /**
   * Initialize filter system with smooth transitions
   */
  function initFilters() {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Update active state
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");
        filterProjects(filter);
      });
    });
  }

  /**
   * Filter projects with animated transitions
   * @param {string} filter - Category to filter by
   */
  function filterProjects(filter) {
    const projectsGrid = document.querySelector(".projects-grid");

    // Apply filtering with staggered animation
    projectCards.forEach((card, index) => {
      const category = card.getAttribute("data-category");
      const categories = category ? category.split(" ") : [];

      // Prepare card for animation
      card.style.transition = "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)";

      if (filter === "all" || categories.includes(filter)) {
        // Card matches filter - show with delay
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1) translateY(0)";
          card.style.display = "block";
          card.style.pointerEvents = "auto";
        }, 50 * index);
      } else {
        // Card doesn't match - hide
        card.style.opacity = "0";
        card.style.transform = "scale(0.9) translateY(20px)";
        card.style.pointerEvents = "none";

        // Hide after animation completes
        setTimeout(() => {
          card.style.display = "none";
        }, 500);
      }
    });

    // Re-layout grid after animations
    setTimeout(() => {
      projectsGrid.style.display = "none";
      requestAnimationFrame(() => {
        projectsGrid.style.display = "grid";
      });
    }, 600);
  }

  /**
   * Add click event handler to project card
   * @param {HTMLElement} card - Project card element
   */
  function addCardClickEvent(card) {
    const viewProjectBtn = card.querySelector(".view-project-btn");

    if (viewProjectBtn) {
      viewProjectBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const projectId = viewProjectBtn.getAttribute("data-project");
        console.log("Clicked project:", projectId); // Debug log

        if (!projectId) {
          console.error("No project ID found on button");
          return;
        }

        openProjectModal(projectId);
      });
    }
  }

  /**
   * Initialize modal system
   */
  function initModalSystem() {
    if (!modal) return;

    // Close modal events
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal);
    }

    // Close when clicking backdrop
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("modal-backdrop")) {
        closeModal();
      }
    });

    // Close with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });
  }

  /**
   * Open project modal with animation
   * @param {string} projectId - ID of the project to display
   */
  function openProjectModal(projectId) {
    if (!modal || !modalBody) {
      console.error("Modal elements not found");
      return;
    }

    // Find project details section
    const projectDetail = document.getElementById(`${projectId}-modal`);

    if (!projectDetail) {
      console.error(`Project detail not found for ID: ${projectId}`);
      return;
    }

    // Debug log
    console.log("Opening modal for project:", projectId);
    console.log("Project detail element:", projectDetail);

    // Reset all project details
    const allDetails = modalBody.querySelectorAll(".project-detail");
    allDetails.forEach((detail) => {
      detail.classList.remove("active");
      detail.style.display = "none";
    });

    // Show the selected project
    projectDetail.style.display = "block";
    projectDetail.classList.add("active");

    // Open modal with animation
    document.body.classList.add("no-scroll");
    modal.classList.add("open");

    // Animate content entry
    requestAnimationFrame(() => {
      projectDetail.style.opacity = "1";
      projectDetail.style.transform = "translateY(0)";
    });

    // Initialize media gallery
    initModalGallery(projectDetail);
  }
  function closeModal() {
    if (!modal) return;

    // Reset all project details
    const allDetails = modalBody.querySelectorAll(".project-detail");
    allDetails.forEach((detail) => {
      detail.classList.remove("active");
      detail.style.display = "none";
    });

    // Animate content exit
    if (modalContent) {
      modalContent.style.opacity = "0";
      modalContent.style.transform = "scale(0.95) translateY(20px)";
    }

    // Close modal after animation
    setTimeout(() => {
      modal.classList.remove("open");
      document.body.classList.remove("no-scroll");
    }, 300);
  }
  /**
   * Initialize media gallery in project modal
   * @param {HTMLElement} projectDetail - Project detail container
   */
  function initModalGallery(projectDetail) {
    if (!projectDetail) return;

    // Find thumbs and media items
    const thumbs = projectDetail.querySelectorAll(".thumb");
    const mediaItems = projectDetail.querySelectorAll(".media-item");
    const videoContainers = projectDetail.querySelectorAll(".video-container");

    // Handle thumbnail clicks
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        // Update active state
        thumbs.forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");

        // Show corresponding media
        const targetId = thumb.getAttribute("data-target");
        mediaItems.forEach((item) => {
          item.classList.remove("active");
          if (item.id === targetId) {
            item.classList.add("active");

            // Smooth fade in animation
            item.style.opacity = "0";
            setTimeout(() => {
              item.style.transition = "opacity 0.4s ease";
              item.style.opacity = "1";
            }, 50);
          }
        });
      });
    });

    // Handle video play/pause with overlay
    videoContainers.forEach((container) => {
      const video = container.querySelector("video");
      const playButton = container.querySelector(".play-button");

      if (video && playButton) {
        playButton.addEventListener("click", () => {
          if (video.paused) {
            video.play();
            container.classList.add("playing");
          } else {
            video.pause();
            container.classList.remove("playing");
          }
        });

        // Update play button on video events
        video.addEventListener("play", () => {
          container.classList.add("playing");
        });

        video.addEventListener("pause", () => {
          container.classList.remove("playing");
        });

        video.addEventListener("ended", () => {
          container.classList.remove("playing");
        });
      }
    });
  }

  /**
   * Initialize particles animation for header background
   */
  function initProjectsHeaderCanvas() {
    const canvas = document.getElementById("projects-header-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const headerContainer = canvas.parentElement;

    // Set canvas dimensions
    function resizeCanvas() {
      canvas.width = headerContainer.offsetWidth;
      canvas.height = headerContainer.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create particles
    const particles = [];
    const particleCount = Math.min(
      100,
      Math.floor((canvas.width * canvas.height) / 10000)
    );

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(
          Math.random() * 100 + 100
        )}, 255, ${Math.random() * 0.5 + 0.2})`,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let mouseRadius = 100;

    headerContainer.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    // Animation loop
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Mouse repulsion
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const force = (mouseRadius - distance) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          particle.x += Math.cos(angle) * force * 2;
          particle.y += Math.sin(angle) * force * 2;
        }

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });

      // Draw connecting lines
      ctx.strokeStyle = "rgba(83, 97, 255, 0.1)";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.globalAlpha = 1 - distance / 120;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      requestAnimationFrame(drawParticles);
    }

    drawParticles();
  }

  /**
   * Initialize parallax effects
   */
  function initParallaxEffects() {
    const header = document.querySelector(".page-header");
    if (!header) return;

    const headerTitle = header.querySelector("h1");
    const headerDesc = header.querySelector("p");

    // Scroll parallax
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset;
      const scrollFactor = Math.min(scrollTop / 500, 1);

      if (headerTitle) {
        headerTitle.style.transform = `translateY(${scrollTop * 0.4}px)`;
        headerTitle.style.opacity = 1 - scrollFactor * 0.8;
      }

      if (headerDesc) {
        headerDesc.style.transform = `translateY(${scrollTop * 0.2}px)`;
        headerDesc.style.opacity = 1 - scrollFactor * 0.8;
      }
    });

    // Mouse move parallax
    header.addEventListener("mousemove", (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      if (headerTitle) {
        headerTitle.style.transform = `translate(${x * 30 - 15}px, ${
          y * 15 - 7.5
        }px)`;
      }

      if (headerDesc) {
        headerDesc.style.transform = `translate(${x * 15 - 7.5}px, ${
          y * 10 - 5
        }px)`;
      }
    });
  }

  // Add custom CSS for dynamic elements
  function addCustomStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* Card hover effects */
      .project-card {
        transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease;
      }
      
      .card-glare {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 3;
        border-radius: inherit;
      }
      
      /* Modal animations */
      .modal {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s ease;
      }
      
      .modal.open {
        opacity: 1;
        pointer-events: auto;
      }
      
      .modal-content {
        transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s ease;
      }
      
      /* Media gallery */
      .media-item {
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      .media-item.active {
        opacity: 1;
        pointer-events: auto;
        position: relative;
      }
      
      /* Video container */
      .video-container {
        position: relative;
        overflow: hidden;
        border-radius: 8px;
      }
      
      .play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 1;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .play-button i {
        color: white;
        font-size: 24px;
      }
      
      .video-container.playing .play-button {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1.5);
      }
      
      .video-container:hover .play-button {
        background: rgba(0, 0, 0, 0.7);
        transform: translate(-50%, -50%) scale(1.1);
      }
      
      /* Thumb hover effect */
      .thumb {
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0.7;
      }
      
      .thumb:hover {
        transform: translateY(-5px);
        opacity: 1;
      }
      
      .thumb.active {
        opacity: 1;
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }
    `;
    document.head.appendChild(style);
  }

  // Add custom styles
  addCustomStyles();
});
