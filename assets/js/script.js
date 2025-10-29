/**
 * Progressive Image Loading with Blur Effect
 * Smoothly loads images with a blur-to-sharp transition
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    rootMargin: '50px',
    threshold: 0.01,
    blurAmount: 20,
    transitionDuration: 800
  };

  /**
   * Load image with blur effect
   */
  function loadImage(img) {
    // Add loading class
    img.classList.add('loading');

    // Create a new image to preload
    const imageLoader = new Image();

    imageLoader.onload = function() {
      // Wait a tiny bit to ensure smooth transition
      setTimeout(() => {
        img.src = imageLoader.src;
        img.classList.remove('loading');
        img.classList.add('loaded');
      }, 100);
    };

    imageLoader.onerror = function() {
      // Handle error - remove loading state
      img.classList.remove('loading');
      img.classList.add('error');
    };

    // Start loading the image
    imageLoader.src = img.src;
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
    images.forEach(img => {
      // Check if image is already loaded (cached)
      if (img.complete && img.naturalHeight !== 0) {
        img.classList.add('loaded');
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
   * Mobile horizontal scroll enhancements
   */
  function initMobileScrolling() {
    if (window.innerWidth > 968) return; // Desktop only

    const gallery = document.querySelector('.gallery');
    const postImages = document.querySelector('.post-images');
    const scrollContainer = gallery || postImages;

    if (!scrollContainer) return;

    // Hide scroll indicator after first interaction
    let interacted = false;
    const hideIndicator = () => {
      if (!interacted) {
        interacted = true;
        scrollContainer.style.setProperty('--show-indicator', 'none');
      }
    };

    scrollContainer.addEventListener('scroll', hideIndicator, { once: true });
    scrollContainer.addEventListener('touchstart', hideIndicator, { once: true });

    // Smooth scroll snap for better UX
    scrollContainer.addEventListener('touchend', () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const itemWidth = scrollContainer.children[0]?.offsetWidth || window.innerWidth * 0.9;
      const targetIndex = Math.round(scrollLeft / itemWidth);
      const targetScroll = targetIndex * itemWidth;

      scrollContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    });
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
   * Initialize all functionality
   */
  function init() {
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
