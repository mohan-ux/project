/**
 * contact.js - Handles contact form functionality
 * For Mohan's Portfolio Website
 */
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  
  if (!contactForm || !formStatus) {
    console.error("Required form elements not found");
    return;
  }
  
  async function submitForm(event) {
    event.preventDefault();
    
    // Get form data
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    
    // Validate form data (client-side)
    if (!name || !email || !subject || !message) {
      formStatus.textContent = "All fields are required";
      formStatus.className = "error";
      return;
    }
    
    // Disable button and show sending state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.textContent = "Sending your message...";
    formStatus.className = "";
    
    try {
      // Log the API URL we're attempting to use (for debugging)
      console.log("Sending to:", window.location.origin + "/api/contact");
      
      // Create the request
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });
      
      console.log("Response status:", response.status);
      
      const text = await response.text();
      console.log("Raw response:", text);
      
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        throw new Error("Invalid response from server");
      }
      
      if (response.ok) {
        // Success case
        formStatus.textContent = "Message sent successfully!";
        formStatus.className = "success";
        contactForm.reset();
      } else {
        // Error from server
        throw new Error(result?.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      formStatus.textContent = error.message || "Failed to send message. Please try again.";
      formStatus.className = "error";
    } finally {
      // Re-enable button
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  }
  
  // Add form submit listener
  contactForm.addEventListener("submit", submitForm);
  
  // Rest of your existing code (theme toggle, etc.)
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  
  // Check for saved theme preference or respect OS preference
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  
  // Apply theme
  if (savedTheme === "dark" || (!savedTheme && prefersDarkMode)) {
    body.classList.add("dark-mode");
  }
  
  // Theme toggle button click handler
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      body.classList.toggle("dark-mode");
      localStorage.setItem(
        "theme",
        body.classList.contains("dark-mode") ? "dark" : "light"
      );
    });
  }
  
  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("active");
    });
  }
});
