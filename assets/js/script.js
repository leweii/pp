/**
 * Progressive Image Loading with Blur Effect
 * Smoothly loads images with a blur-to-sharp transition
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    rootMargin: '200px',
    threshold: 0.01,
    blurAmount: 20,
    transitionDuration: 800
  };

  /**
   * Load image with blur effect
   */
  function loadImage(img) {
    const imageSrc = img.getAttribute('src');
    const container = img.closest('.image-container, .gallery-item');
    
    // If image already has src and is loaded, mark as loaded
    if (img.complete && img.naturalHeight !== 0) {
      img.classList.remove('loading');
      img.classList.add('loaded');
      if (container) container.classList.add('loaded');
      return;
    }

    // Add loading class
    img.classList.add('loading');
    
    // Simple approach: just mark as loaded when image loads
    img.onload = function() {
      img.classList.remove('loading');
      img.classList.add('loaded');
      if (container) container.classList.add('loaded');
    };
    
    img.onerror = function() {
      img.classList.remove('loading');
      img.classList.add('error');
      if (container) container.classList.add('error');
      console.error('Failed to load image:', imageSrc);
    };
    
    // If src is not set, set it now
    if (!img.src || img.src === '') {
      img.src = imageSrc;
    }
  }

  /**
   * Initialize Intersection Observer for lazy loading
   */
  function initLazyLoading() {
    const images = document.querySelectorAll('.lazy-image');

    // If no Intersection Observer support, load all images immediately
    if (!('IntersectionObserver' in window)) {
      images.forEach(img => loadImage(img));
      return;
    }

    // Create intersection observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: config.rootMargin,
      threshold: config.threshold
    });

    // Observe all lazy images
    images.forEach((img, index) => {
      // Check if image is already loaded (cached)
      if (img.complete && img.naturalHeight !== 0) {
        img.classList.add('loaded');
        const container = img.closest('.image-container, .gallery-item');
        if (container) container.classList.add('loaded');
        return;
      }

      // Load first 2-3 images immediately (above the fold)
      if (index < 3) {
        loadImage(img);
      } else {
        imageObserver.observe(img);
      }
    });
  }

  /**
   * Add smooth scroll behavior
   */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Handle active navigation state
   */
  function initNavigation() {
    const navLinks = document.querySelectorAll('.project-list a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Fade in content on page load
   */
  function initPageTransition() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';

    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 50);
    });
  }

  /**
   * Mobile scroll enhancements (vertical scrolling for content)
   */
  function initMobileScrolling() {
    if (window.innerWidth > 968) return; // Desktop only

    // Mobile now uses vertical scrolling for images
    // Smooth scrolling is handled by CSS -webkit-overflow-scrolling: touch
    // No additional JavaScript needed for vertical scroll
  }

  /**
   * Scroll active tab into view on mobile
   */
  function scrollActiveTabIntoView() {
    if (window.innerWidth > 968) return;

    const activeLink = document.querySelector('.project-list a.active');
    if (activeLink) {
      setTimeout(() => {
        activeLink.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }, 100);
    }
  }

  /**
   * Register Service Worker for image caching
   */
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/pp/sw.js')
          .then((registration) => {
            console.log('Service Worker registered successfully:', registration.scope);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }

  /**
   * Default background configuration
   */
  const defaultBgConfig = {
    targetArea: 800,        // Increased for better performance (was 70)
    colorProb: 0.008,
    gridSize: 5,            // Increased for better performance (was 3)
    strokeWidth: 0.3,
    minOpacity: 0.015,
    maxOpacity: 0.04,
    coloredOpacity: 0.05,
    relaxationIterations: 2, // Lloyd's relaxation iterations for uniform areas
    minEdges: 4,            // Minimum polygon edges
    maxEdges: 8             // Maximum polygon edges
  };

  /**
   * Generate Voronoi diagram for Chinese celadon crackle pattern
   * 使用泰森多边形算法生成中国青瓷开片纹理
   * With Lloyd's relaxation for uniform cell areas
   */
  function generateVoronoiPattern(width, height, numSites, config = defaultBgConfig) {
    // Generate random sites (seed points)
    let sites = [];
    for (let i = 0; i < numSites; i++) {
      sites.push({
        x: Math.random() * width,
        y: Math.random() * height
      });
    }

    // Apply Lloyd's relaxation to make areas more uniform
    for (let iteration = 0; iteration < config.relaxationIterations; iteration++) {
      const cellPoints = assignPointsToSites(sites, width, height, config.gridSize);

      // Move each site to the centroid of its cell
      sites = sites.map((site, index) => {
        const points = cellPoints.get(index);
        if (!points || points.length === 0) return site;

        const centroid = calculateCentroid(points);
        return {
          x: Math.max(0, Math.min(width, centroid.x)),
          y: Math.max(0, Math.min(height, centroid.y))
        };
      });
    }

    // Vibrant random colors for colored blocks - more aggressive!
    const deepColors = [
      // Traditional deep tones
      'rgba(15, 23, 42, 0.045)',      // Deep slate
      'rgba(30, 41, 59, 0.045)',      // Midnight blue

      // Jewel tones - 宝石色系
      'rgba(0, 71, 171, 0.055)',      // Sapphire blue 宝石蓝
      'rgba(0, 104, 183, 0.05)',      // Royal blue
      'rgba(88, 28, 135, 0.05)',      // Deep purple amethyst
      'rgba(107, 33, 168, 0.045)',    // Rich purple

      // Red tones - 红色系
      'rgba(127, 29, 29, 0.06)',      // Dark burgundy 猪肝红
      'rgba(153, 27, 27, 0.055)',     // Deep crimson
      'rgba(185, 28, 28, 0.05)',      // Rich red
      'rgba(220, 38, 38, 0.045)',     // Bright red

      // Emerald & jade - 翡翠绿
      'rgba(5, 122, 85, 0.05)',       // Deep emerald
      'rgba(16, 185, 129, 0.045)',    // Jade green
      'rgba(6, 95, 70, 0.055)',       // Forest emerald

      // Amber & gold - 琥珀金
      'rgba(180, 83, 9, 0.05)',       // Deep amber
      'rgba(217, 119, 6, 0.045)',     // Rich gold
      'rgba(202, 138, 4, 0.05)',      // Golden yellow

      // Pink & rose - 粉红玫瑰
      'rgba(190, 24, 93, 0.05)',      // Deep rose
      'rgba(219, 39, 119, 0.045)',    // Magenta
      'rgba(157, 23, 77, 0.055)',     // Wine red

      // Teal & cyan - 青色系
      'rgba(13, 148, 136, 0.05)',     // Deep teal
      'rgba(20, 184, 166, 0.045)',    // Bright teal
      'rgba(8, 145, 178, 0.05)',      // Ocean blue

      // Orange & coral - 橙珊瑚
      'rgba(234, 88, 12, 0.05)',      // Vivid orange
      'rgba(249, 115, 22, 0.045)',    // Bright orange
      'rgba(251, 146, 60, 0.045)',    // Coral

      // Indigo & navy - 靛蓝
      'rgba(55, 48, 163, 0.05)',      // Deep indigo
      'rgba(67, 56, 202, 0.045)',     // Rich indigo
      'rgba(30, 27, 75, 0.055)',      // Navy indigo
    ];

    // Create SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // Generate final Voronoi cells
    const pixels = assignPointsToSites(sites, width, height, config.gridSize);

    // Draw polygons
    pixels.forEach((points, siteIndex) => {
      if (points.length < 3) return;

      // Calculate convex hull of points to form polygon
      const hull = convexHull(points);
      if (hull.length < 3) return;

      // Filter by edge count - skip if outside configured range
      if (config.minEdges && hull.length < config.minEdges) return;
      if (config.maxEdges && hull.length > config.maxEdges) return;

      // Determine color - configurable chance for vibrant colors!
      const isColored = Math.random() < config.colorProb;
      let fillColor, strokeColor;

      if (isColored) {
        // Use vibrant color with configured opacity
        const baseColor = deepColors[Math.floor(Math.random() * deepColors.length)];
        // Extract RGB and apply config opacity
        const match = baseColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),/);
        if (match) {
          fillColor = `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${config.coloredOpacity})`;
        } else {
          fillColor = baseColor;
        }
        strokeColor = 'rgba(100, 116, 139, 0.1)';
      } else {
        const opacity = config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity);
        fillColor = `rgba(148, 163, 184, ${opacity})`;
        strokeColor = `rgba(100, 116, 139, ${opacity * 1.5})`;
      }

      // Create polygon path
      const pathData = hull.map((p, i) =>
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
      ).join(' ') + ' Z';

      svg += `<path d="${pathData}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${config.strokeWidth}"/>`;
    });

    svg += '</svg>';
    return svg;
  }

  /**
   * Assign pixels to nearest sites (Voronoi tessellation)
   */
  function assignPointsToSites(sites, width, height, gridSize) {
    const pixels = new Map();

    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        let minDist = Infinity;
        let nearestSite = 0;

        for (let i = 0; i < sites.length; i++) {
          const dx = x - sites[i].x;
          const dy = y - sites[i].y;
          const dist = dx * dx + dy * dy;

          if (dist < minDist) {
            minDist = dist;
            nearestSite = i;
          }
        }

        if (!pixels.has(nearestSite)) {
          pixels.set(nearestSite, []);
        }
        pixels.get(nearestSite).push({x, y});
      }
    }

    return pixels;
  }

  /**
   * Calculate centroid (center of mass) of a set of points
   */
  function calculateCentroid(points) {
    if (points.length === 0) return {x: 0, y: 0};

    let sumX = 0;
    let sumY = 0;

    for (let p of points) {
      sumX += p.x;
      sumY += p.y;
    }

    return {
      x: sumX / points.length,
      y: sumY / points.length
    };
  }

  /**
   * Calculate convex hull using gift wrapping algorithm
   */
  function convexHull(points) {
    if (points.length < 3) return points;

    // Find leftmost point
    let leftmost = points[0];
    for (let p of points) {
      if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) {
        leftmost = p;
      }
    }

    const hull = [];
    let current = leftmost;

    do {
      hull.push(current);
      let next = points[0];

      for (let p of points) {
        if (p === current) continue;

        const cross = (next.x - current.x) * (p.y - current.y) -
                     (next.y - current.y) * (p.x - current.x);

        if (next === current || cross < 0 ||
            (cross === 0 && distance(current, p) > distance(current, next))) {
          next = p;
        }
      }

      current = next;
    } while (current !== leftmost && hull.length < points.length);

    return hull;
  }

  function distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Apply Voronoi pattern as background
   */
  function initRandomBackground(customConfig = null) {
    // Load saved config or use default
    let config = { ...defaultBgConfig };

    if (customConfig) {
      config = { ...config, ...customConfig };
    } else {
      // Try to load from localStorage
      try {
        const saved = localStorage.getItem('backgroundConfig');
        if (saved) {
          config = { ...config, ...JSON.parse(saved) };
          console.log('📂 Loaded saved background configuration');
        }
      } catch (e) {
        console.warn('Failed to load saved config:', e);
      }
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Calculate number of cells based on configured target area
    const numSites = Math.floor((width * height) / config.targetArea);

    // Generate pattern for body
    const bodySvg = generateVoronoiPattern(width, height, numSites, config);
    const bodyDataUrl = 'data:image/svg+xml;base64,' + btoa(bodySvg);

    document.body.style.backgroundImage = `url("${bodyDataUrl}")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';

    // Generate pattern for sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const sidebarWidth = sidebar.offsetWidth || 400;
      const sidebarSites = Math.floor((sidebarWidth * height) / config.targetArea);
      const sidebarSvg = generateVoronoiPattern(sidebarWidth, height, sidebarSites, config);
      const sidebarDataUrl = 'data:image/svg+xml;base64,' + btoa(sidebarSvg);

      sidebar.style.backgroundImage = `url("${sidebarDataUrl}")`;
      sidebar.style.backgroundSize = 'cover';
      sidebar.style.backgroundPosition = 'center';
      sidebar.style.backgroundRepeat = 'no-repeat';
    }

    console.log('🎨 Voronoi celadon crackle pattern generated with', numSites, 'cells');
    console.log('⚙️ Config:', config);
  }

  /**
   * Expose to global for debug panel
   */
  window.applyBackgroundConfig = function(config) {
    initRandomBackground(config);
  };

  /**
   * Initialize all functionality
   */
  function init() {
    // Generate random background immediately
    // Now with Lloyd's relaxation and optimized defaults
    initRandomBackground();

    // Register service worker for caching
    registerServiceWorker();

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initLazyLoading();
        initSmoothScroll();
        initNavigation();
        initPageTransition();
        initMobileScrolling();
        scrollActiveTabIntoView();
      });
    } else {
      initLazyLoading();
      initSmoothScroll();
      initNavigation();
      initPageTransition();
      initMobileScrolling();
      scrollActiveTabIntoView();
    }
  }

  // Start
  init();

})();
