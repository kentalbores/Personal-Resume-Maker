/**
 * Structured data parsed from kent_data.txt.
 * Each experience and project block has:
 *   - id: unique identifier for NLP indexing
 *   - skills: array of technology/skill names
 *   - tags: semantic labels used for NLP role matching
 *   - highlights: bullet points for the resume
 */

const data = {
  personal: {
    full_name: 'Kent B. Albores',
    email: 'kentalbores143@gmail.com',
    personal_website: 'https://kentalbores.xyz',
    linked_in: 'https://www.linkedin.com/in/kent-albores-145b752b4/',
    phone_num: '09616634280',
    github: 'https://github.com/kentalbores',
    address: 'Alambijud, Argao, Cebu',
  },

  experience: [
    {
      id: 'ncompass-webdev',
      company: 'N-Compass TV',
      period: 'June 2025 – Present',
      title: 'Full-Stack Developer Intern',
      description:
        'Designed UI/UX and developed an internal Inventory System using NextJS, Express, and MySQL with Prisma ORM. Worked in an Agile team with daily Scrums, code reviews, and corporate Git workflows.',
      skills: ['NextJS', 'Express', 'MySQL', 'Prisma', 'Figma', 'Git', 'Agile', 'RBAC', 'Database Design'],
      tags: [
        'frontend', 'backend', 'web development', 'fullstack', 'software developer',
        'ui', 'ux', 'inventory', 'database', 'react', 'javascript', 'nodejs',
      ],
      highlights: [
        'Designed UI/UX pages for an internal Inventory System using Figma',
        'Developed full-stack features with NextJS (frontend) and Express + MySQL/Prisma (backend)',
        'Applied corporate-level Git workflows: rebasing, merge conflicts, pull requests, code reviews',
        'Participated in Agile methodology with daily Scrum meetings',
        'Implemented Role-Based Access Control (RBAC) with careful database schema design',
      ],
    },
    {
      id: 'ncompass-cybersec',
      company: 'N-Compass TV',
      period: 'June 2025 – Present',
      title: 'Cybersecurity Intern',
      description:
        'Performed penetration testing and vulnerability scanning for the company website using Kali Linux tools. Identified and demonstrated a Broken Access Control vulnerability including Horizontal/Vertical Privilege Escalation.',
      skills: ['Kali Linux', 'nmap', 'masscan', 'Burp Suite', 'TCP/IP Networking', 'Web Scraping'],
      tags: [
        'cybersecurity', 'security', 'penetration testing', 'network', 'kali',
        'vulnerability', 'hacking', 'infosec', 'ethical hacking',
      ],
      highlights: [
        'Performed penetration testing and vulnerability scanning on the company\'s official website',
        'Identified Broken Access Control vulnerability by intercepting API endpoints via Burp Suite',
        'Demonstrated Horizontal/Vertical Privilege Escalation from an unprivileged session',
        'Used Kali Linux tools: nmap, masscan, Burp Suite, and web crawlers',
        'Studied TCP 3-Way Handshake, DoS, MITM, XSS, and brute-force attack vectors',
      ],
    },
    {
      id: 'ncompass-n8n',
      company: 'N-Compass TV',
      period: 'June 2025 – Present',
      title: 'Automation Engineer / n8n Developer',
      description:
        'Designed and maintained complex n8n workflow automations integrating AI, Slack, Google APIs, Python scrapers, and third-party services for company-wide operational efficiency.',
      skills: ['n8n', 'Slack API', 'AI Integration', 'Python', 'Playwright', 'Google SerpAPI', 'Synthesia AI', 'ElevenLabs', 'Webhook', 'REST API'],
      tags: [
        'automation', 'ai', 'workflow', 'n8n', 'api integration', 'bot',
        'backend', 'software developer', 'scripting', 'integration',
      ],
      highlights: [
        'Automated attendance logging and intern allowance computation via Slack API integration',
        'Built AI-powered daily reports system with per-department summaries, blocker detection, and solution suggestions',
        'Created GitHub push announcer integrating Slack and ElevenLabs audio AI for office-wide announcements',
        'Developed AI tech newsletter scraper using Playwright + SerpAPI feeding into Synthesia AI video generation',
        'Integrated dynamic presentation layouts into Presenton AI using n8n and React template analysis',
        'Contributed to flyer-to-poster extraction workflow with AI image recognition and error logging via Slack',
      ],
    },
    {
      id: 'ncompass-raspi',
      company: 'N-Compass TV',
      period: 'June 2025 – Present',
      title: 'Systems / Embedded Developer',
      description:
        'Migrated a production project from Raspberry Pi 4 to Pi 5 and built a self-healing failsafe boot system that detects drive corruption, boots from a backup, auto-repairs, and restores the application.',
      skills: ['Raspberry Pi', 'Linux', 'Bash', 'SSH', 'AnyDesk', 'systemd', 'Raspbian OS'],
      tags: [
        'linux', 'systems', 'embedded', 'devops', 'raspberry pi', 'hardware',
        'server', 'sysadmin', 'infrastructure',
      ],
      highlights: [
        'Migrated a production application from Raspberry Pi 4 to Pi 5 architecture',
        'Built a self-healing failsafe boot system: detects corrupted main drive, boots backup, auto-repairs',
        'System fully recovers even after rm -rf of main drive, restoring all services automatically',
        'Integrated an AI Agent (Zeroclaw) into the Raspberry Pi platform',
      ],
    },
    {
      id: 'ncompass-chronos',
      company: 'N-Compass TV',
      period: 'June 2025 – Present',
      title: 'Backend Developer – Chronos (RFID Attendance System)',
      description:
        'Led backend development for Chronos, an enterprise RFID-based employee time-tracking and HR management system. Responsible for system architecture, API design, database schema, and multi-platform deployment.',
      skills: [
        'Angular', 'FastAPI', 'Python', 'n8n', 'Docker', 'AWS EC2',
        'Auth0', 'Supabase', 'PostgreSQL', 'OpenSearch', 'HuggingFace',
        'Render', 'Jira', 'FileStack', 'Google Cloud Console',
      ],
      tags: [
        'backend', 'fullstack', 'devops', 'cloud', 'authentication',
        'database', 'api', 'software developer', 'angular', 'fastapi',
        'docker', 'aws', 'deployment', 'hr system', 'enterprise',
      ],
      highlights: [
        'Led backend development for the first 3 sprints of an RFID-based employee attendance and HR system',
        'Designed system architecture and database schema collaboratively with the team',
        'Deployed services to AWS EC2, Render (frontend), and HuggingFace (backend model)',
        'Integrated Auth0 for authorization, Supabase for database, OpenSearch for logs and analytics',
        'Used Docker for containerization and managed CI/CD across multiple cloud platforms',
        'Followed Agile methodology with weekly sprint planning and HR department stakeholder meetings',
      ],
    },
  ],

  projects: [
    {
      id: 'chronos',
      category: 'enterprise',
      prestige: 3,
      name: 'Chronos — RFID Employee Attendance System',
      description:
        'Led backend development for an enterprise HR platform with RFID time-in, leave management, and performance tracking. Architected the system and deployed across AWS EC2, Render, and HuggingFace.',
      skills: ['FastAPI', 'Angular', 'Docker', 'AWS EC2', 'Auth0', 'Supabase', 'OpenSearch'],
      tags: [
        'backend', 'fullstack', 'enterprise', 'devops', 'cloud', 'fastapi',
        'angular', 'aws', 'software developer', 'api', 'database', 'authentication',
      ],
      link: null,
    },
    {
      id: 'raspi-failsafe',
      category: 'infrastructure',
      prestige: 3,
      name: 'Raspberry Pi Self-Healing Boot System',
      description:
        'Engineered a failsafe for Pi 5: auto-detects drive corruption, boots from a backup flash drive, repairs the main OS, and restores the full application — surviving even a forced rm -rf.',
      skills: ['Raspberry Pi', 'Linux', 'Bash', 'systemd', 'Embedded Systems'],
      tags: ['linux', 'embedded', 'infrastructure', 'raspberry pi', 'devops', 'systems', 'sysadmin'],
      link: null,
    },
    {
      id: 'ubuntu-server',
      category: 'infrastructure',
      prestige: 3,
      name: 'Personal Self-Hosted Ubuntu Server',
      description:
        'Repurposed a spare ThinkPad as a personal Ubuntu server hosting all personal projects, an n8n instance, and web services via Nginx + Cloudflare.',
      skills: ['Linux', 'Ubuntu', 'Nginx', 'Docker', 'Cloudflare', 'Tailscale'],
      tags: ['linux', 'devops', 'server', 'self-hosting', 'infrastructure', 'cloud', 'sysadmin'],
      link: null,
    },
    {
      id: 'portfolio',
      category: 'web',
      prestige: 2,
      name: 'Personal Portfolio Website',
      description: 'Designed and built a personal portfolio site showcasing projects and experience.',
      skills: ['JavaScript', 'HTML', 'CSS', 'Web Design'],
      tags: ['frontend', 'web development', 'portfolio', 'javascript', 'software developer'],
      link: 'kentalbores.xyz',
    },
    {
      id: 'ecommerce',
      category: 'web',
      prestige: 2,
      name: 'E-Commerce Website – Aming Homemade Torta',
      description: "Built a full e-commerce website for the family's business to expand online sales.",
      skills: ['JavaScript', 'HTML', 'CSS', 'E-commerce'],
      tags: ['frontend', 'web development', 'e-commerce', 'javascript', 'software developer'],
      link: null,
    },
    {
      id: 'telegram-bot',
      category: 'automation',
      prestige: 2,
      name: 'Telegram Expense Tracker Bot',
      description: 'Telegram bot for automated personal expense logging and tracking via chat commands.',
      skills: ['Python', 'Telegram API', 'Bot Development'],
      tags: ['backend', 'bot', 'automation', 'python', 'api', 'scripting'],
      link: null,
    },
    {
      id: 'resume-builder',
      category: 'automation',
      prestige: 3,
      name: 'Dynamic Resume Builder',
      description:
        'NLP-powered resume builder that curates role-specific resumes from personal data using TF-IDF scoring and dynamic HTML templates.',
      skills: ['Node.js', 'JavaScript', 'NLP', 'HTML', 'Automation'],
      tags: ['javascript', 'web development', 'automation', 'software developer', 'frontend', 'nlp'],
      link: null,
    },
    {
      id: 'auto-id',
      category: 'automation',
      prestige: 2,
      name: 'Automatic ID Photo Layout Tool',
      description:
        'Python script that auto-removes backgrounds from ID photos and generates print-ready layouts, replacing a manual Photoshop workflow.',
      skills: ['Python', 'Image Processing', 'Automation', 'Pillow'],
      tags: ['python', 'automation', 'image processing', 'backend', 'scripting'],
      link: null,
    },
    {
      id: 'minecraft',
      category: 'desktop',
      prestige: 2,
      name: 'Minecraft Automation Tool (Java)',
      description:
        'Java desktop app with a UI for autoclicking, directional auto-mining, and auto-fishing using Java AWT Robot and JNativeHook.',
      skills: ['Java', 'Java AWT', 'JNativeHook', 'Swing'],
      tags: ['java', 'automation', 'desktop application', 'software developer'],
      link: null,
    },
    {
      id: 'flappy-bird',
      category: 'game',
      prestige: 1,
      name: 'Flappy Bird Clone (Godot)',
      description: 'Recreated Flappy Bird in Godot with GDScript, implementing game loops and physics.',
      skills: ['Godot', 'GDScript', 'Game Development'],
      tags: ['game development', 'godot', 'software developer'],
      link: null,
    },
    {
      id: 'roguelike',
      category: 'game',
      prestige: 1,
      name: 'Roguelike Shooter Game (Unity)',
      description: 'Top-down roguelike shooter in Unity with procedural level elements and C# gameplay logic.',
      skills: ['Unity', 'C#', 'Game Development'],
      tags: ['game development', 'unity', 'c#', 'software developer'],
      link: null,
    },
    {
      id: 'pokemon-website',
      category: 'web',
      prestige: 1,
      name: 'Pokémon Info Website',
      description:
        'Responsive site consuming PokéAPI to display comprehensive Pokémon stats, moves, and details.',
      skills: ['JavaScript', 'HTML', 'CSS', 'REST API'],
      tags: ['frontend', 'javascript', 'api', 'web development', 'software developer'],
      link: null,
    },
  ],

  skills: {
    frontend:  ['React', 'NextJS', 'Angular', 'HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'Figma'],
    backend:   ['Node.js', 'Express', 'FastAPI', 'Python', 'PHP', 'Java'],
    database:  ['MySQL', 'Prisma ORM', 'Supabase', 'PostgreSQL', 'OpenSearch'],
    devops:    ['Docker', 'AWS EC2', 'Nginx', 'Linux', 'Raspberry Pi', 'Cloudflare', 'SSH', 'Tailscale'],
    tools:     ['Git', 'n8n', 'Auth0', 'Jira', 'Slack API', 'Google Cloud', 'Figma'],
    practices: ['Agile / Scrum', 'RBAC', 'Penetration Testing', 'Websockets', 'Prompt Engineering'],
  },

  education: [
    {
      school: 'Bachelor of Science in Information Technology (Ongoing)',
      period: '2022 – Present',
      details: [
        'Capstone Project: Signifi',
        'Hackathon: HackEstate – Filipino Homes (with Certification)',
        'Hackathon: ICT Congress (with Certification)',
        'ElDroid Certification',
      ],
    },
    {
      school: 'Argao National High School – Senior High School',
      period: 'Graduated with Honors',
      details: ['STEM Strand'],
    },
    {
      school: 'Colawin National High School – Junior High School',
      period: 'Constant with Honors',
      details: ['Consistent Academic Excellence', 'Competition Participant (Math, English, Science)'],
    },
  ],
};

module.exports = data;
