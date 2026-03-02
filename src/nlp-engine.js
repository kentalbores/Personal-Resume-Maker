/**
 * NLP Engine — Pipeline overview:
 *
 * 1. PREPROCESSING  — Tokenise → strip stop words → Porter-stem
 *                     "developing / developer / developed" → all become "develop"
 *
 * 2. INDEXING       — Every experience + project block becomes a TF-IDF document.
 *                     TF-IDF weights rare, specific terms higher than common ones.
 *
 * 3. QUERY EXPANSION — "software developer" → expanded with ~15 related terms
 *                     via a hand-tuned role thesaurus.
 *
 * 4. SCORING        — sum(TF-IDF[term, doc]) + tag bonus + skill bonus
 *                     Projects also get a prestige multiplier (1–3×).
 *
 * 5. BULLET SELECTION — For each selected experience, re-score its individual
 *                     bullet points against the query and pick the top 4 in
 *                     their original narrative order.
 *
 * 6. DIVERSITY       — Projects are selected with category diversity so the
 *                     resume doesn't surface four web projects or four games.
 */

const natural = require('natural');

const TfIdf     = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();
const stemmer   = natural.PorterStemmer;

// ── Stop words ────────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'a','an','the','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','can','need',
  'to','of','in','on','at','by','for','with','from','as','into','through',
  'and','but','or','nor','so','yet','both','either','neither','not','only',
  'just','i','me','my','we','our','you','your','he','his','she','her','it','its',
  'they','their','this','that','these','those','then','also','very','s','t',
]);

// ── Role thesaurus ────────────────────────────────────────────────────────────
const ROLE_THESAURUS = {
  software:     ['developer', 'programmer', 'engineer', 'coder', 'build'],
  developer:    ['development', 'programming', 'engineer', 'build', 'web', 'app'],
  engineer:     ['development', 'developer', 'build', 'design', 'architecture'],
  fullstack:    ['frontend', 'backend', 'react', 'nodejs', 'express', 'database', 'api', 'web'],
  'full-stack': ['frontend', 'backend', 'react', 'nodejs', 'express', 'database', 'api', 'web'],
  full:         ['fullstack', 'frontend', 'backend'],
  stack:        ['fullstack', 'frontend', 'backend'],
  frontend:     ['react', 'nextjs', 'angular', 'html', 'css', 'javascript', 'ui', 'ux', 'figma'],
  backend:      ['nodejs', 'express', 'fastapi', 'python', 'api', 'server', 'database', 'rest'],
  web:          ['html', 'css', 'javascript', 'react', 'nextjs', 'frontend', 'backend', 'api'],
  cybersecurity:['security', 'penetration', 'testing', 'vulnerability', 'network', 'kali', 'burpsuite'],
  security:     ['cybersecurity', 'penetration', 'vulnerability', 'network', 'kali', 'infosec'],
  infosec:      ['cybersecurity', 'security', 'penetration', 'vulnerability', 'kali'],
  devops:       ['docker', 'deployment', 'cloud', 'aws', 'nginx', 'linux', 'server', 'infrastructure'],
  cloud:        ['aws', 'docker', 'deployment', 'nginx', 'server', 'devops'],
  automation:   ['n8n', 'workflow', 'bot', 'script', 'automate', 'webhook', 'api'],
  game:         ['unity', 'godot', 'gdscript', 'csharp', 'game', 'development'],
  data:         ['database', 'sql', 'mysql', 'supabase', 'opensearch', 'analytics', 'schema'],
  java:         ['spring', 'backend', 'oop', 'desktop', 'awt'],
  python:       ['fastapi', 'flask', 'django', 'scripting', 'automation', 'ml'],
  embedded:     ['raspberry', 'pi', 'linux', 'iot', 'hardware', 'system', 'bash'],
  systems:      ['linux', 'server', 'bash', 'devops', 'infrastructure', 'embedded'],
};

// ── Text utilities ─────────────────────────────────────────────────────────────

function preprocess(text) {
  const tokens = tokenizer.tokenize((text || '').toLowerCase()) || [];
  return tokens
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
    .map((t) => stemmer.stem(t));
}

function expandQuery(jobRole) {
  const tokens = tokenizer.tokenize((jobRole || '').toLowerCase()) || [];
  const expanded = new Set(tokens);

  for (const token of tokens) {
    const synonyms = ROLE_THESAURUS[token];
    if (synonyms) synonyms.forEach((s) => expanded.add(s));

    for (const [key, list] of Object.entries(ROLE_THESAURUS)) {
      if (key.includes(token) || token.includes(key)) {
        list.forEach((s) => expanded.add(s));
      }
    }
  }

  return [...expanded];
}

// ── Per-bullet scoring ────────────────────────────────────────────────────────

/**
 * Score each bullet point in `highlights` against the job role and return the
 * top `max` bullets in their original narrative order.
 * Falls back to first `max` bullets when no role is given.
 */
function selectBullets(jobRole, highlights, max = 4) {
  if (!highlights || !highlights.length) return [];
  if (!jobRole || !jobRole.trim()) return highlights.slice(0, max);

  const queryTerms = expandQuery(jobRole).map((t) => stemmer.stem(t));

  // Build a mini TF-IDF index over just these bullet points
  const tfidf = new TfIdf();
  highlights.forEach((h) => tfidf.addDocument(preprocess(h).join(' ')));

  const scored = highlights.map((text, i) => {
    const score = queryTerms.reduce((sum, term) => sum + tfidf.tfidf(term, i), 0);
    return { text, score, index: i };
  });

  // Pick top-scoring, then restore original order for natural reading flow
  const top = scored
    .slice()
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, max);

  top.sort((a, b) => a.index - b.index);
  return top.map((b) => b.text);
}

// ── Main engine ───────────────────────────────────────────────────────────────

class NLPEngine {
  constructor(resumeData) {
    this.data      = resumeData;
    this.tfidf     = new TfIdf();
    this.documents = [];
    this._buildCorpus();
  }

  _buildCorpus() {
    const index = (item, type) => {
      const raw = [
        item.title || item.name || '',
        item.description || '',
        (item.skills  || []).join(' '),
        (item.tags    || []).join(' '),
        (item.highlights || []).join(' '),
      ].join(' ');

      this.tfidf.addDocument(preprocess(raw).join(' '));
      this.documents.push({ type, item, raw });
    };

    this.data.experience.forEach((e) => index(e, 'experience'));
    this.data.projects.forEach((p)   => index(p, 'project'));
  }

  /** Score all documents against a job-role query. */
  score(jobRole) {
    if (!jobRole || !jobRole.trim()) {
      // For the default case, rank projects by prestige
      return this.documents
        .map((doc) => ({
          ...doc,
          score: doc.type === 'project' ? (doc.item.prestige || 1) : 1,
        }))
        .sort((a, b) => b.score - a.score);
    }

    const queryTerms  = expandQuery(jobRole);
    const stemmed     = queryTerms.map((t) => stemmer.stem(t));
    const roleLower   = jobRole.toLowerCase();
    const roleTokens  = tokenizer.tokenize(roleLower) || [];

    return this.documents.map((doc, i) => {
      // Base: TF-IDF sum over all query terms
      let score = stemmed.reduce((sum, term) => sum + this.tfidf.tfidf(term, i), 0);

      // Tag bonus
      const tagBonus = (doc.item.tags || []).filter((tag) =>
        roleTokens.some((t) => tag.includes(t) || t.includes(tag.split(' ')[0]))
      ).length * 6;

      // Skill match bonus
      const skillBonus = (doc.item.skills || []).filter((skill) =>
        roleTokens.some((t) => skill.toLowerCase().includes(t))
      ).length * 3;

      // Prestige multiplier for projects (1–3×)
      const prestige = doc.type === 'project' ? (doc.item.prestige || 1) : 1;

      return { ...doc, score: (score + tagBonus + skillBonus) * prestige };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * Select up to `maxCount` projects with category diversity.
   * Ensures the resume doesn't show 4 web projects or 4 games.
   * Max 2 projects from any single category.
   */
  _selectDiverseProjects(scoredProjects, maxCount) {
    const selected = [];
    const categoryCounts = {};

    for (const proj of scoredProjects) {
      if (selected.length >= maxCount) break;
      const cat = proj.item.category || 'other';
      const count = categoryCounts[cat] || 0;
      if (count < 2) {
        selected.push(proj);
        categoryCounts[cat] = count + 1;
      }
    }

    // Fill remaining slots if diversity consumed some options
    if (selected.length < maxCount) {
      for (const proj of scoredProjects) {
        if (selected.length >= maxCount) break;
        if (!selected.includes(proj)) selected.push(proj);
      }
    }

    return selected;
  }

  /**
   * Main public method: returns curated experiences + projects
   * with NLP-selected bullet points for each experience.
   */
  curate(jobRole) {
    const scored = this.score(jobRole);

    const scoredExp  = scored.filter((d) => d.type === 'experience');
    const scoredProj = scored.filter((d) => d.type === 'project');

    // 3 experience blocks with NLP-selected bullets
    const topExps  = scoredExp.slice(0, 3);

    // 4 diverse projects
    const topProjs = this._selectDiverseProjects(scoredProj, 4);

    return {
      experiences: topExps.map((d) => ({
        ...d.item,
        // Replace highlights with NLP-selected top-4 bullets for this role
        highlights: selectBullets(jobRole, d.item.highlights, 4),
      })),
      projects: topProjs.map((d) => d.item),
      debugScores: scored.map((d) => ({
        id:    d.item.id || d.item.name,
        type:  d.type,
        score: Math.round(d.score * 100) / 100,
      })),
    };
  }
}

module.exports = { NLPEngine, preprocess, expandQuery, selectBullets };
