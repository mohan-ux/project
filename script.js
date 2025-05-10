/**
 * Main JavaScript File
 * Handles global functionality including theme toggling
 */

// Global state management
const state = {
    isMenuOpen: false,
    currentTheme: localStorage.getItem('theme') || 'light'
};

// Simple theme toggle function
function toggleTheme() {
    const root = document.documentElement;
    const themeIcon = document.querySelector('.theme-toggle i');
    
    // Toggle theme
    const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    
    // Update theme
    root.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    
    // Update icon
    if (themeIcon) {
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
}

// Simple mobile menu toggle
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    
    // Set initial icon
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Add event listeners
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
});
