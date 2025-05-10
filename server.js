const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static file serving
// This assumes your HTML/CSS/JS files are in a directory called 'public'
app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ status: "ok" });
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  console.log("Received contact form submission:", req.body);
  
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate incoming data
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Configure email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending to yourself
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    
    // Return success response
    res.json({
      success: true,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message"
    });
  }
});

// Catch-all handler for HTML pages
app.get("*.html", (req, res) => {
  const filePath = path.join(__dirname, 'public', req.path);
  res.sendFile(filePath);
});

// Root path handler
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all 404 handler
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  
  // Check if this is an API request
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `Cannot ${req.method} ${req.url}`
    });
  }
  
  // For non-API requests, try to send the 404 page if it exists
  try {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  } catch (e) {
    // If no 404 page exists, send a simple text response
    res.status(404).send('Page not found');
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("API endpoints: /api/contact, /api/health, /api/test");
  console.log(`Email service configured for ${process.env.EMAIL_USER}`);
});