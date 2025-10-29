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
   * Initialize all functionality
   */
  function init() {
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
