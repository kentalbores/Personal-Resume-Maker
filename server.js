const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateResume } = require('./src/resume-builder');
const { exportPdf } = require('./src/pdf-exporter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * POST /api/generate
 * Body: { jobRole: string }
 * Returns the rendered resume HTML + NLP debug scores.
 */
app.post('/api/generate', (req, res) => {
  try {
    const jobRole = (req.body.jobRole || '').trim();
    const photoBase64 = req.body.photoBase64 || null;
    const result = generateResume(jobRole, photoBase64);
    res.json({ html: result.html, scores: result.debugScores });
  } catch (err) {
    console.error('[/api/generate]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/export-pdf
 * Body: { html: string }
 * Returns a PDF file download (8.5 × 13 in).
 */
app.post('/api/export-pdf', async (req, res) => {
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: 'html is required' });

    const pdfBuffer = await exportPdf(html);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="kent-albores-resume.pdf"',
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('[/api/export-pdf]', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  NLP Resume Builder running at http://localhost:${PORT}\n`);
});
