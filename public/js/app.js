/* ─── State ───────────────────────────────────────────────────────────────── */
let scale       = 1;
let photoBase64 = null; // base64 data-URL of the uploaded photo

/* ─── DOM References ──────────────────────────────────────────────────────── */
const jobRoleInput   = document.getElementById('jobRole');
const generateBtn    = document.getElementById('generateBtn');
const exportBtn      = document.getElementById('exportBtn');
const exportSection  = document.getElementById('exportSection');
const scorePanel     = document.getElementById('scorePanel');
const scoreList      = document.getElementById('scoreList');
const previewLabel   = document.getElementById('previewLabel');
const editHint       = document.getElementById('editHint');

const emptyState     = document.getElementById('emptyState');
const loadingState   = document.getElementById('loadingState');
const resumeWrapper  = document.getElementById('resumeWrapper');
const resumeFrame    = document.getElementById('resumeFrame');

const zoomIn         = document.getElementById('zoomIn');
const zoomOut        = document.getElementById('zoomOut');
const zoomReset      = document.getElementById('zoomReset');
const scaleValue     = document.getElementById('scaleValue');

const photoInput     = document.getElementById('photoInput');
const photoPreview   = document.getElementById('photoPreview');
const photoPreviewImg = document.getElementById('photoPreviewImg');
const photoPlaceholder = document.getElementById('photoPlaceholder');
const photoRemove    = document.getElementById('photoRemove');

/* ─── Photo Upload ────────────────────────────────────────────────────────── */
photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    photoBase64 = ev.target.result; // "data:image/jpeg;base64,..."
    photoPreviewImg.src = photoBase64;
    photoPlaceholder.style.display = 'none';
    photoPreview.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

photoRemove.addEventListener('click', (e) => {
  e.preventDefault();
  photoBase64 = null;
  photoInput.value = '';
  photoPreview.style.display = 'none';
  photoPlaceholder.style.display = 'flex';
});

/* ─── Preset Buttons ──────────────────────────────────────────────────────── */
document.querySelectorAll('.preset-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    jobRoleInput.value = btn.dataset.role;
    jobRoleInput.focus();
  });
});

/* ─── Generate ────────────────────────────────────────────────────────────── */
generateBtn.addEventListener('click', generateResume);
jobRoleInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') generateResume(); });

async function generateResume() {
  const jobRole = jobRoleInput.value.trim();

  showState('loading');
  generateBtn.disabled = true;
  previewLabel.textContent = jobRole ? `Preview — ${jobRole}` : 'Preview — General Resume';

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobRole, photoBase64 }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();

    // Write HTML into the iframe
    const doc = resumeFrame.contentDocument || resumeFrame.contentWindow.document;
    doc.open();
    doc.write(data.html);
    doc.close();

    // Wait for iframe to finish rendering, then enable editing
    resumeFrame.onload = () => enableEditing(doc);
    // Also call immediately in case onload already fired
    setTimeout(() => enableEditing(doc), 120);

    showState('resume');
    exportSection.style.display = 'block';
    editHint.style.display = 'block';

    if (data.scores && data.scores.length) {
      renderScores(data.scores);
      scorePanel.style.display = 'block';
    }
  } catch (err) {
    showState('empty');
    alert('Failed to generate resume: ' + err.message);
  } finally {
    generateBtn.disabled = false;
  }
}

/* ─── Inline Editing ──────────────────────────────────────────────────────── */

// Selectors for every text node that should be editable
const EDIT_SELECTORS = [
  '.full-name', '.role-label',
  '.summary-text',
  '.exp-company', '.exp-title', '.exp-period',
  '.exp-highlights li',
  '.proj-name', '.proj-desc', '.proj-link',
  '.pill',
  '.skill-cat-label',
  '.edu-school', '.edu-period', '.edu-details li',
  '.ci-val',
];

function enableEditing(frameDoc) {
  EDIT_SELECTORS.forEach((sel) => {
    frameDoc.querySelectorAll(sel).forEach((el) => {
      el.contentEditable = 'true';
      el.spellcheck = false;
    });
  });

  // Inject subtle hover/focus styles — tagged so we can strip before PDF
  if (!frameDoc.getElementById('__edit_styles__')) {
    const s = frameDoc.createElement('style');
    s.id = '__edit_styles__';
    s.textContent = `
      [contenteditable] { cursor: text; border-radius: 2px; }
      [contenteditable]:hover  { outline: 1px dashed rgba(26,43,74,0.22); }
      [contenteditable]:focus  { outline: 2px solid rgba(74,124,255,0.55);
                                  background: rgba(74,124,255,0.04); }
    `;
    frameDoc.head.appendChild(s);
  }
}

/* ─── Capture edited HTML (strips editing artifacts before PDF export) ────── */
function captureEditedHtml(frameDoc) {
  // Remove edit styles temporarily
  const editStyle = frameDoc.getElementById('__edit_styles__');
  if (editStyle) editStyle.remove();

  // Strip contenteditable attributes
  frameDoc.querySelectorAll('[contenteditable]').forEach((el) => {
    el.removeAttribute('contenteditable');
  });

  const html = '<!DOCTYPE html>\n' + frameDoc.documentElement.outerHTML;

  // Restore editing for continued use
  enableEditing(frameDoc);

  return html;
}

/* ─── NLP Score Visualisation ─────────────────────────────────────────────── */
function renderScores(scores) {
  const maxScore = Math.max(...scores.map((s) => s.score), 1);

  scoreList.innerHTML = scores
    .slice(0, 12)
    .map((s) => {
      const pct        = Math.round((s.score / maxScore) * 100);
      const badgeClass = s.type === 'experience' ? 'badge-exp' : 'badge-proj';
      const badgeLabel = s.type === 'experience' ? 'EXP' : 'PROJ';
      const shortName  = String(s.id).replace(/-/g, ' ').replace(/ncompass /i, '').slice(0, 22);

      return `
        <div class="score-item">
          <span class="score-badge ${badgeClass}">${badgeLabel}</span>
          <span class="score-name" title="${s.id}">${shortName}</span>
          <div class="score-bar-wrap">
            <div class="score-bar" style="width:${pct}%"></div>
          </div>
          <span class="score-val">${s.score.toFixed(1)}</span>
        </div>`;
    })
    .join('');
}

/* ─── Export PDF ──────────────────────────────────────────────────────────── */
exportBtn.addEventListener('click', async () => {
  const frameDoc = resumeFrame.contentDocument || resumeFrame.contentWindow.document;
  if (!frameDoc || !frameDoc.body) return;

  exportBtn.disabled = true;
  exportBtn.innerHTML = '<span class="btn-icon">⏳</span> Generating PDF…';

  try {
    // Capture current (possibly edited) HTML
    const html = captureEditedHtml(frameDoc);

    const res = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    });

    if (!res.ok) throw new Error(`PDF error: ${res.status}`);

    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'kent-albores-resume.pdf';
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('PDF export failed: ' + err.message);
  } finally {
    exportBtn.disabled = false;
    exportBtn.innerHTML = '<span class="btn-icon">⬇</span> Export PDF <span class="pdf-size">8.5 × 13 in</span>';
  }
});

/* ─── Zoom Controls ───────────────────────────────────────────────────────── */
function applyScale(newScale) {
  scale = Math.min(Math.max(newScale, 0.3), 2.0);
  resumeWrapper.style.transform = `scale(${scale})`;
  scaleValue.textContent = `${Math.round(scale * 100)}%`;

  const frameH = 13 * 96;
  resumeWrapper.style.marginBottom = `${frameH * (scale - 1)}px`;
}

zoomIn.addEventListener('click',    () => applyScale(scale + 0.1));
zoomOut.addEventListener('click',   () => applyScale(scale - 0.1));
zoomReset.addEventListener('click', () => applyScale(1));

window.addEventListener('resize', autoFitScale);
function autoFitScale() {
  const pane = document.getElementById('previewScroll');
  if (!pane) return;
  const available = pane.clientWidth - 80;
  const frameW    = 8.5 * 96;
  applyScale(Math.min(available / frameW, 1));
}

/* ─── State Switcher ──────────────────────────────────────────────────────── */
function showState(state) {
  emptyState.style.display    = state === 'empty'   ? 'flex'  : 'none';
  loadingState.style.display  = state === 'loading' ? 'flex'  : 'none';
  resumeWrapper.style.display = state === 'resume'  ? 'flex'  : 'none';
  editHint.style.display      = state === 'resume'  ? 'block' : 'none';

  if (state === 'resume') setTimeout(autoFitScale, 50);
}

/* ─── Init ────────────────────────────────────────────────────────────────── */
showState('empty');
setTimeout(autoFitScale, 100);
