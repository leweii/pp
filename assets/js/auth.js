/**
 * Simple Password Protection for Jekyll Site
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    // SHA-256 hash of your password
    // To generate: Open browser console and run: crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourpassword')).then(h => console.log(Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('')))
    // Default password is "password" - CHANGE THIS!
    passwordHash: '1acb376ca3328d3d2abf6aad46fa892d359b4b16673987d54e5ac532d895d779',
    sessionKey: 'siteAuthToken',
    sessionDuration: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  };

  /**
   * Hash password using SHA-256
   */
  async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Check if user is authenticated
   */
  function isAuthenticated() {
    const authData = localStorage.getItem(CONFIG.sessionKey);
    if (!authData) return false;

    try {
      const { hash, timestamp } = JSON.parse(authData);
      const now = new Date().getTime();
      
      // Check if session is still valid
      if (now - timestamp > CONFIG.sessionDuration) {
        localStorage.removeItem(CONFIG.sessionKey);
        return false;
      }

      return hash === CONFIG.passwordHash;
    } catch (e) {
      return false;
    }
  }

  /**
   * Set authentication
   */
  function setAuthentication(hash) {
    const authData = {
      hash: hash,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(CONFIG.sessionKey, JSON.stringify(authData));
  }

  /**
   * Show login form
   */
  function showLoginForm() {
    // Ensure body exists
    if (!document.body) {
      setTimeout(showLoginForm, 10);
      return;
    }

    // Hide main content container instead of body
    const container = document.querySelector('.container');
    if (container) {
      container.style.display = 'none';
    }
    
    // Ensure body is visible
    document.body.style.display = '';
    document.body.style.opacity = '1';

    // Create login overlay
    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.innerHTML = `
      <div class="auth-container">
        <div class="auth-box">
          <h1 class="auth-title">🔒 Protected Content</h1>
          <p class="auth-description">Please enter the password to access this site</p>
          <form id="auth-form">
            <input 
              type="password" 
              id="auth-password" 
              placeholder="Enter password"
              autocomplete="current-password"
              required
            >
            <button type="submit" id="auth-submit">Unlock</button>
          </form>
          <p id="auth-error" class="auth-error" style="display: none;">Incorrect password. Please try again.</p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #auth-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .auth-container {
        width: 100%;
        max-width: 400px;
        padding: 20px;
      }

      .auth-box {
        background: white;
        border-radius: 16px;
        padding: 40px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        text-align: center;
      }

      .auth-title {
        font-size: 28px;
        font-weight: 600;
        margin: 0 0 10px 0;
        color: #1a1a1a;
      }

      .auth-description {
        font-size: 14px;
        color: #666;
        margin: 0 0 30px 0;
        line-height: 1.6;
      }

      #auth-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      #auth-password {
        width: 100%;
        padding: 14px 16px;
        font-size: 15px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        outline: none;
        transition: border-color 0.3s ease;
        font-family: inherit;
        box-sizing: border-box;
      }

      #auth-password:focus {
        border-color: #667eea;
      }

      #auth-submit {
        width: 100%;
        padding: 14px 16px;
        font-size: 15px;
        font-weight: 600;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        font-family: inherit;
      }

      #auth-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
      }

      #auth-submit:active {
        transform: translateY(0);
      }

      .auth-error {
        color: #f44336;
        font-size: 13px;
        margin: 10px 0 0 0;
        animation: shake 0.5s;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }

      @media (max-width: 480px) {
        .auth-box {
          padding: 30px 20px;
        }

        .auth-title {
          font-size: 24px;
        }
      }
    `;
    document.head.appendChild(style);

    // Handle form submission
    const form = document.getElementById('auth-form');
    const passwordInput = document.getElementById('auth-password');
    const errorMsg = document.getElementById('auth-error');

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const password = passwordInput.value;
      const hash = await hashPassword(password);

      if (hash === CONFIG.passwordHash) {
        setAuthentication(hash);
        overlay.remove();
        
        // Show the main content container
        const container = document.querySelector('.container');
        if (container) {
          container.style.display = '';
        }
        
        errorMsg.style.display = 'none';
      } else {
        errorMsg.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        passwordInput.style.borderColor = '#f44336';
        setTimeout(() => {
          passwordInput.style.borderColor = '#e0e0e0';
        }, 2000);
      }
    });

    // Focus on password input
    setTimeout(() => passwordInput.focus(), 100);
  }

  /**
   * Initialize authentication
   */
  function init() {
    // Ensure body exists before checking authentication
    if (!document.body) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        setTimeout(init, 10);
      }
      return;
    }

    const authenticated = isAuthenticated();
    console.log('Authentication check:', authenticated);

    if (!authenticated) {
      console.log('Not authenticated, showing login form');
      showLoginForm();
    } else {
      console.log('Already authenticated');
    }
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
