const express = require('express');
const router = express.Router();
const fs = require('fs');
const healthService = require('../services/healthService');
const upload = require('../middlewares/uploadConfig');

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const reply = await healthService.getResponse(message); // 🔥 FIXED

    res.json({ reply });

  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({
      error: "Something went wrong"
    });
  }
});

router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file format' });
    }

    // Log the file details to the console
    console.log('File successfully uploaded:', req.file);

    // Call extraction
    const extractedData = await healthService.extractReportData(req.file.path, req.file.mimetype);

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.json({ success: true, data: extractedData });
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Something went wrong during upload' });
  }
});

module.exports = router;