const { NLPEngine } = require('./nlp-engine');
const data = require('./data');

// ─── Professional Summary Templates ────────────────────────────────────────────

function generateSummary(jobRole, experiences) {
  if (!jobRole || !jobRole.trim()) {
    return `Versatile and passionate developer with hands-on experience spanning full-stack web development, workflow automation, cybersecurity, and cloud infrastructure. Skilled in building complete systems from design to deployment using modern technologies including NextJS, Express, FastAPI, Docker, and AWS. Experienced in Agile environments and collaborative team development with a strong drive for continuous learning.`;
  }

  const r = jobRole.toLowerCase();
  const topSkills = [...new Set(experiences.flatMap((e) => e.skills))].slice(0, 5).join(', ');

  if (r.includes('cybersecurity') || r.includes('security') || r.includes('infosec') || r.includes('pentest')) {
    return `Dedicated cybersecurity practitioner with hands-on experience in penetration testing, vulnerability assessment, and network security analysis. Identified and demonstrated a Broken Access Control vulnerability including Horizontal/Vertical Privilege Escalation by intercepting API endpoints with Burp Suite. Proficient with Kali Linux tools (nmap, masscan, Burp Suite) and knowledgeable in TCP/IP fundamentals, XSS, DoS, MITM, and brute-force attack vectors.`;
  }

  if (r.includes('devops') || r.includes('cloud') || r.includes('infrastructure') || r.includes('sysadmin')) {
    return `Resourceful DevOps practitioner with experience in containerization, cloud deployment, and self-hosted infrastructure. Deployed production systems on AWS EC2, HuggingFace, and Render. Managed Docker containers, Nginx reverse proxies, Raspberry Pi embedded systems, and self-hosted Ubuntu servers. Skilled with Cloudflare, Tailscale, cron jobs, and automated failsafe systems.`;
  }

  if (r.includes('automation') || r.includes('n8n') || r.includes('workflow')) {
    return `Creative automation engineer specializing in n8n workflow automation and AI integrations. Designed and maintained complex multi-system workflows including AI-powered daily reporting, automated tech newsletter generation with Synthesia AI video production, GitHub announcement bots via Slack, and intelligent flyer data extraction pipelines. Adept at connecting APIs, building scrapers, and wiring AI services into real business processes.`;
  }

  if ((r.includes('frontend') || r.includes('front-end') || r.includes('ui') || r.includes('ux')) && !r.includes('backend')) {
    return `Detail-oriented frontend developer with experience building responsive, modern web interfaces using React, NextJS, and Angular. Designed and prototyped UI/UX for enterprise internal tools using Figma. Proficient in clean, accessible markup, component-based architecture, and translating design mockups into polished, production-ready applications.`;
  }

  if ((r.includes('backend') || r.includes('back-end') || r.includes('api')) && !r.includes('frontend')) {
    return `Proficient backend developer with experience building scalable REST APIs and server-side applications using Node.js (Express) and Python (FastAPI). Designed and managed relational and NoSQL databases including MySQL, Supabase, and OpenSearch. Led backend development for a full-scale enterprise HR time-tracking system deployed on AWS EC2 with Auth0 and Docker containerization.`;
  }

  if (r.includes('game') || r.includes('unity') || r.includes('godot')) {
    return `Enthusiastic game developer with hands-on experience building games in Unity (C#) and Godot (GDScript). Created a roguelike top-down shooter and a Flappy Bird clone, with strong fundamentals in game loops, collision systems, and player mechanics. Also experienced in Java AWT automation tools, bridging programming skills across gaming and application domains.`;
  }

  if (r.includes('java') || r.includes('android')) {
    return `Experienced Java developer with a foundation in object-oriented programming, desktop application development, and game development. Built Minecraft automation tools using Java AWT Robot and JNativeHook for low-level input handling. Strong grasp of OOP principles and cross-platform Java development.`;
  }

  if (r.includes('python') || r.includes('data') || r.includes('ml') || r.includes('ai')) {
    return `Versatile Python developer experienced in automation scripting, API integration, and AI-powered workflows. Built Python tools for image background removal, mass web scraping with Playwright, and n8n workflow integrations. Familiar with REST APIs, data pipelines, and integrating generative AI services such as ElevenLabs and Synthesia into production workflows.`;
  }

  // General software developer / catch-all
  return `Passionate and resourceful software developer with hands-on industry experience building full-stack web applications, REST APIs, automation systems, and cloud-deployed services. Proficient in ${topSkills}. Built and shipped multiple production systems at N-Compass TV including an internal inventory system, an enterprise RFID attendance platform, and numerous AI workflow automations. Strong foundation in Agile methodology, Git best practices, and collaborative development.`;
}

// ─── Skill Category Selector ───────────────────────────────────────────────────

function buildSkillsForRole(jobRole) {
  const r = (jobRole || '').toLowerCase();
  const s = data.skills;

  if (r.includes('cybersecurity') || r.includes('security') || r.includes('infosec')) {
    return [
      { label: 'Security Tools', items: ['Kali Linux', 'Burp Suite', 'nmap', 'masscan', 'Web Crawlers'] },
      { label: 'Networking', items: ['TCP/IP', 'HTTP/S Protocols', 'DNS', 'Port Scanning', 'Traffic Analysis'] },
      { label: 'Attack Vectors', items: ['XSS', 'DoS', 'MITM', 'Brute Force', 'Privilege Escalation', 'Broken Access Control'] },
      { label: 'Other Technical', items: [...s.backend.slice(0, 3), ...s.devops.slice(0, 3)] },
    ];
  }

  if (r.includes('devops') || r.includes('cloud') || r.includes('infrastructure')) {
    return [
      { label: 'DevOps & Cloud', items: s.devops },
      { label: 'Backend', items: s.backend },
      { label: 'Database', items: s.database },
      { label: 'Tools', items: s.tools },
    ];
  }

  if (r.includes('frontend') && !r.includes('backend')) {
    return [
      { label: 'Frontend', items: s.frontend },
      { label: 'Tools & Design', items: ['Figma', 'Git', 'Jira', 'Vite', 'npm'] },
      { label: 'Backend (Familiar)', items: s.backend.slice(0, 4) },
      { label: 'Other', items: s.other },
    ];
  }

  if (r.includes('backend') && !r.includes('frontend')) {
    return [
      { label: 'Backend', items: s.backend },
      { label: 'Database', items: s.database },
      { label: 'DevOps & Deployment', items: s.devops },
      { label: 'Tools', items: s.tools },
    ];
  }

  // Default / fullstack / general
  return [
    { label: 'Frontend', items: s.frontend },
    { label: 'Backend',  items: s.backend },
    { label: 'Database', items: s.database },
    { label: 'DevOps',   items: s.devops.slice(0, 6) },
    { label: 'Tools',    items: s.tools },
    { label: 'Other',    items: s.other.slice(0, 5) },
  ];
}

// ─── HTML Helpers ──────────────────────────────────────────────────────────────

function escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pillsHtml(items, colorClass = 'pill-blue') {
  return items
    .map((s) => `<span class="pill ${colorClass}">${escape(s)}</span>`)
    .join('');
}

function experienceBlockHtml(exp) {
  const highlights = (exp.highlights || [])
    .map((h) => `<li>${escape(h)}</li>`)
    .join('');
  const skills = pillsHtml(exp.skills || [], 'pill-blue');

  return `
    <div class="exp-block">
      <div class="exp-header">
        <div class="exp-left">
          <span class="exp-company">${escape(exp.company)}</span>
          <span class="exp-title"> &mdash; ${escape(exp.title)}</span>
        </div>
        <span class="exp-period">${escape(exp.period)}</span>
      </div>
      <ul class="exp-highlights">${highlights}</ul>
      <div class="pills-row">${skills}</div>
    </div>`;
}

function projectBlockHtml(proj) {
  const linkHtml = proj.link
    ? `<span class="proj-link">${escape(proj.link)}</span>`
    : '';
  const skills = pillsHtml(proj.skills || [], 'pill-green');

  return `
    <div class="proj-block">
      <div class="proj-header">
        <span class="proj-name">${escape(proj.name)}</span>
        ${linkHtml}
      </div>
      <p class="proj-desc">${escape(proj.description)}</p>
      <div class="pills-row">${skills}</div>
    </div>`;
}

// Skills rendered as compact inline rows: "FRONTEND  React · NextJS · Angular…"
// Placed inside a .skills-grid-2col wrapper in the template
function skillsInlineHtml(categories) {
  return categories
    .map((cat) => `
      <div class="skill-row">
        <span class="skill-label">${escape(cat.label)}</span>
        <span class="skill-items">${cat.items.map(escape).join(' · ')}</span>
      </div>`)
    .join('');
}

function educationHtml(edu) {
  const details = (edu.details || [])
    .map((d) => `<li>${escape(d)}</li>`)
    .join('');

  return `
    <div class="edu-block">
      <div class="edu-school">${escape(edu.school)}</div>
      <div class="edu-period">${escape(edu.period)}</div>
      ${details ? `<ul class="edu-details">${details}</ul>` : ''}
    </div>`;
}

// ─── Main HTML Builder ─────────────────────────────────────────────────────────

function buildResumeHTML(jobRole, curated, photoBase64) {
  const { experiences, projects } = curated;
  const p = data.personal;
  const summary = generateSummary(jobRole, experiences);
  const skillCategories = buildSkillsForRole(jobRole);

  const roleLabel = jobRole && jobRole.trim()
    ? jobRole.trim()
    : 'General Resume';

  const experiencesHtml     = experiences.map(experienceBlockHtml).join('');
  const projectsHtml        = projects.map(projectBlockHtml).join('');
  const skillsHtml          = skillsInlineHtml(skillCategories);
  // Drop junior high to save space (per user note)
  const educationSectionHtml = data.education.slice(0, 2).map(educationHtml).join('');

  // Strip protocol from URLs for print-friendly display
  const website  = p.personal_website.replace(/^https?:\/\//, '');
  const linkedin = p.linked_in.replace(/^https?:\/\//, '');
  const github   = p.github.replace(/^https?:\/\//, '');

  const photoHtml = photoBase64
    ? `<div class="header-photo"><img src="${photoBase64}" alt="Profile Photo" /></div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escape(p.full_name)} — Resume</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      width: 8.5in;
      font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
      font-size: 9pt;
      color: #2a2a2a;
      background: #fff;
      line-height: 1.45;
    }

    /* ── HEADER ────────────────────────────────── */
    .resume-header {
      background: #1a2b4a;
      color: #fff;
      padding: 18px 30px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .header-photo { flex-shrink: 0; width: 72px; height: 72px; }
    .header-photo img {
      width: 72px; height: 72px;
      object-fit: cover;
      border-radius: 6px;
      border: 2px solid rgba(255,255,255,0.2);
      display: block;
    }
    .header-name  { flex: 1; min-width: 0; }
    .full-name {
      font-size: 21pt; font-weight: 700;
      letter-spacing: -0.3px; line-height: 1.1;
    }
    .role-label {
      margin-top: 5px; font-size: 9pt;
      color: #80aad8; font-weight: 500;
    }
    .header-contact {
      flex-shrink: 0; display: flex;
      flex-direction: column; gap: 4px; min-width: 220px;
    }
    .ci-row {
      display: flex; align-items: baseline;
      gap: 7px; font-size: 7.6pt;
      color: #c0d0e8; line-height: 1.35;
    }
    .ci-val   { color: #dde8f5; }
    .ci-icon  { font-size: 7.8pt; color: #6a90c0; width: 12px; text-align: center; flex-shrink: 0; }
    .ci-tag   {
      font-size: 6.2pt; font-weight: 700;
      background: rgba(255,255,255,0.14); color: #a8c4e0;
      border-radius: 2px; padding: 1px 4px;
      letter-spacing: 0.3px; flex-shrink: 0; line-height: 1.5;
    }

    /* ── BODY ──────────────────────────────────── */
    .resume-body { padding: 0 30px 22px; }

    /* ── Section ── */
    .section { margin-top: 14px; }
    .section-title {
      font-size: 7.5pt; font-weight: 700;
      text-transform: uppercase; letter-spacing: 1.7px;
      color: #1a2b4a;
      border-bottom: 1.5px solid #1a2b4a;
      padding-bottom: 3px; margin-bottom: 9px;
    }

    /* ── Summary ── */
    .summary-text { font-size: 8.8pt; color: #444; line-height: 1.55; }

    /* ── Experience ── */
    .exp-block { margin-bottom: 12px; }
    .exp-block + .exp-block {
      border-top: 1px solid #edf1f8;
      padding-top: 12px;
    }
    .exp-header {
      display: flex; justify-content: space-between;
      align-items: baseline; flex-wrap: wrap; gap: 4px;
    }
    .exp-left { min-width: 0; }
    .exp-company { font-weight: 700; font-size: 9.5pt; color: #1a2b4a; }
    .exp-title   { font-size: 8.5pt; color: #555; }
    .exp-period  { font-size: 7.8pt; color: #999; white-space: nowrap; flex-shrink: 0; }
    .exp-highlights { list-style: none; margin: 6px 0 5px; }
    .exp-highlights li {
      font-size: 8.6pt; color: #333;
      padding-left: 13px; position: relative;
      margin-bottom: 3px; line-height: 1.4;
    }
    .exp-highlights li::before {
      content: '▸'; position: absolute; left: 0;
      color: #3a6baa; font-size: 7.5pt; top: 1px;
    }

    /* ── Projects — 2-column grid ── */
    .projects-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 18px;
    }
    .proj-header {
      display: flex; justify-content: space-between;
      align-items: baseline; flex-wrap: wrap; gap: 3px;
    }
    .proj-name { font-weight: 700; font-size: 9pt; color: #1a2b4a; }
    .proj-link { font-size: 7.2pt; color: #4a7cbf; }
    .proj-desc { font-size: 8.2pt; color: #555; margin: 3px 0 5px; line-height: 1.4; }

    /* ── Pills ── */
    .pills-row { display: flex; flex-wrap: wrap; gap: 4px; }
    .pill {
      padding: 2px 7px; border-radius: 9px;
      font-size: 7.2pt; font-weight: 600; white-space: nowrap;
    }
    .pill-blue  { background: #e4ecf8; color: #1a2b4a; }
    .pill-green { background: #e3f4ea; color: #185c2a; }

    /* ── Skills — two-column inline grid ── */
    .skills-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px 28px;
    }
    .skill-row {
      display: flex; align-items: baseline;
      gap: 7px; line-height: 1.35;
    }
    .skill-label {
      font-size: 7.2pt; font-weight: 700;
      color: #1a2b4a; text-transform: uppercase;
      letter-spacing: 0.5px; min-width: 60px; flex-shrink: 0;
    }
    .skill-items { font-size: 7.8pt; color: #444; }

    /* ── Education ── */
    .edu-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 24px;
    }
    .edu-block {}
    .edu-school { font-weight: 700; font-size: 8.5pt; color: #1a2b4a; line-height: 1.3; }
    .edu-period { font-size: 7.5pt; color: #888; margin-top: 1px; }
    .edu-details { list-style: none; margin-top: 4px; }
    .edu-details li {
      font-size: 7.8pt; color: #555;
      padding-left: 11px; position: relative;
      margin-bottom: 2px; line-height: 1.35;
    }
    .edu-details li::before { content: '·'; position: absolute; left: 2px; color: #aaa; }
  </style>
</head>
<body>

  <!-- ═══ HEADER ═══ -->
  <header class="resume-header">
    ${photoHtml}
    <div class="header-name">
      <div class="full-name">${escape(p.full_name)}</div>
      <div class="role-label">${escape(roleLabel)}</div>
    </div>
    <div class="header-contact">
      <div class="ci-row"><span class="ci-icon">✉</span><span class="ci-val">${escape(p.email)}</span></div>
      <div class="ci-row"><span class="ci-icon">✆</span><span class="ci-val">${escape(p.phone_num)}</span></div>
      <div class="ci-row"><span class="ci-icon">⊕</span><span class="ci-val">${escape(website)}</span></div>
      <div class="ci-row"><span class="ci-tag">in</span><span class="ci-val">${escape(linkedin)}</span></div>
      <div class="ci-row"><span class="ci-tag">gh</span><span class="ci-val">${escape(github)}</span></div>
      <div class="ci-row"><span class="ci-icon">⊙</span><span class="ci-val">${escape(p.address)}</span></div>
    </div>
  </header>

  <div class="resume-body">

    <!-- Summary -->
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <p class="summary-text">${escape(summary)}</p>
    </div>

    <!-- Experience -->
    <div class="section">
      <div class="section-title">Work Experience</div>
      ${experiencesHtml}
    </div>

    <!-- Projects -->
    <div class="section">
      <div class="section-title">Projects</div>
      <div class="projects-grid">${projectsHtml}</div>
    </div>

    <!-- Skills — 2-col inline -->
    <div class="section">
      <div class="section-title">Technical Skills</div>
      <div class="skills-grid-2col">${skillsHtml}</div>
    </div>

    <!-- Education — 2-col -->
    <div class="section">
      <div class="section-title">Education</div>
      <div class="edu-grid">${educationSectionHtml}</div>
    </div>

  </div>
</body>
</html>`;
}

// ─── Public API ────────────────────────────────────────────────────────────────

function generateResume(jobRole, photoBase64) {
  const engine = new NLPEngine(data);
  const curated = engine.curate(jobRole);
  const html = buildResumeHTML(jobRole, curated, photoBase64 || null);

  return { html, debugScores: curated.debugScores };
}

module.exports = { generateResume };
