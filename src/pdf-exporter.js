const puppeteer = require('puppeteer');

/**
 * Converts a resume HTML string into a PDF buffer using Puppeteer (headless Chromium).
 * Page size: 8.5 × 13 inches (Folio / F4 paper).
 *
 * @param {string} html  Full HTML string of the rendered resume
 * @returns {Promise<Buffer>}  PDF as a Node.js Buffer
 */
async function exportPdf(html) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfData = await page.pdf({
      width: '8.5in',
      height: '13in',
      printBackground: true,
      margin: {
        top: '0in',
        right: '0in',
        bottom: '0in',
        left: '0in',
      },
    });

    // Puppeteer v22+ returns Uint8Array — convert to Buffer for Express
    return Buffer.from(pdfData);
  } finally {
    await browser.close();
  }
}

module.exports = { exportPdf };
