require('dotenv').config();
console.log("🕵️‍♂️ ENV CHECK:", process.env.GEMINI_API_KEY ? "Key is found!" : "KEY IS MISSING!");

const express = require('express');
const cors = require('cors'); // 🔥 ADDED CORS IMPORT
const healthRoutes = require('./routes/health');
const healthService = require('./services/healthService');

const { initEmbeddings } = healthService;

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // 🔥 ADDED CORS MIDDLEWARE (Must be before routes!)
app.use(express.json({ limit: '50mb' })); // 🚀 THE HEAVY UPLOAD FIX
app.use(express.urlencoded({ limit: '50mb', extended: true })); // 🚀 ALSO NEEDED FOR HEAVY FILES

// Root route
app.get('/', (req, res) => {
  res.json({ status: 'Server running' });
});

// Routes
app.use('/api/health', healthRoutes);

// Start server
async function startServer() {
  try {
    console.log("🔥 startServer called");
    await initEmbeddings();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing embeddings:", error);
  }
}

startServer();