// Portfolio JS — Dharmendra Singh

// ---- THEME ----
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('portfolioTheme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
else document.documentElement.setAttribute('data-theme', 'dark');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('portfolioTheme', next);
});

// ---- NAVBAR ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

// ---- MOBILE NAV ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ---- SCROLL REVEAL ----
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    // Stagger siblings in the same parent
    const parent = entry.target.closest('.projects-grid, .skills-layout, .cert-grid, .act-grid, .about-stats, .extra-exp-grid, .edu-ladder, .timeline-wrap, .contact-layout');
    if (parent) {
      const siblings = [...parent.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), Math.max(0, idx * 90));
    } else {
      entry.target.classList.add('visible');
    }
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ---- SKILL BAR ANIMATION ----
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach((fill, i) => {
        setTimeout(() => fill.classList.add('animated'), i * 100);
      });
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.skill-col').forEach(col => barObs.observe(col));

// ---- ACTIVE NAV HIGHLIGHT ----
const sections = document.querySelectorAll('section[id]');
const anchors = document.querySelectorAll('.nav-links a');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      anchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => sectionObs.observe(s));

// ---- CONTACT FORM ----
const form = document.getElementById('contactForm');
const formOk = document.getElementById('formOk');
form.addEventListener('submit', (e) => {
  const btn = form.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" style="animation:spin 0.8s linear infinite"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Sending...';
  btn.disabled = true;
});

// ---- HERO ENTRANCE ----
window.addEventListener('load', () => {
  const heroEls = document.querySelectorAll('.hero-right .reveal, .hero-left .reveal');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 150 + i * 130);
  });
});

// ---- LOGO SCROLL TOP ----
document.querySelector('.nav-logo')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Add spin keyframe dynamically for loading state
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);

// ---- GITHUB REPOS & STATS ----
async function loadGitHubData() {
  const username = 'dharmendra293';
  const reposContainer = document.getElementById('ghRepos');
  const repoCountEl = document.getElementById('repoCount');
  const starCountEl = document.getElementById('starCount');
  const followerCountEl = document.getElementById('followerCount');

  try {
    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) throw new Error('Failed to fetch user data');
    const userData = await userResponse.json();

    // Update stats
    repoCountEl.textContent = userData.public_repos;
    followerCountEl.textContent = userData.followers;

    // Fetch repos
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`);
    if (!reposResponse.ok) throw new Error('Failed to fetch repos');
    const repos = await reposResponse.json();

    // Calculate total stars
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    starCountEl.textContent = totalStars;

    // Clear placeholder
    reposContainer.innerHTML = '';

    // Create repo cards
    repos.forEach(repo => {
      const repoCard = document.createElement('div');
      repoCard.className = 'gh-repo-card';
      repoCard.innerHTML = `
        <div class="gh-repo-header">
          <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
          <div class="gh-repo-stats">
            <span class="gh-repo-stat">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
              </svg>
              ${repo.stargazers_count}
            </span>
            <span class="gh-repo-stat">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v6.689a.75.75 0 01-1.5 0V5.372A2.25 2.25 0 015 5.372v2.122z"/>
              </svg>
              ${repo.forks_count}
            </span>
          </div>
        </div>
        <p class="gh-repo-desc">${repo.description || 'No description available.'}</p>
        <div class="gh-repo-lang">
          <span class="gh-repo-lang-dot" style="background-color: ${getLanguageColor(repo.language)}"></span>
          ${repo.language || 'Unknown'}
        </div>
      `;
      reposContainer.appendChild(repoCard);
    });
  } catch (error) {
    console.error('Error loading GitHub data:', error);
    reposContainer.innerHTML = `
      <div class="gh-repo-placeholder">
        <i data-lucide="alert-triangle"></i>
        <p>Failed to load repositories. Please try again later.</p>
        <a href="https://github.com/${username}" target="_blank" class="btn btn-outline" style="margin-top:1rem">Visit GitHub Profile</a>
      </div>
    `;
  }
}

function getLanguageColor(lang) {
  const colors = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Java: '#b07219',
    'C++': '#f34b7d',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    TypeScript: '#2b7489'
  };
  return colors[lang] || '#586069';
}

// Load GitHub data on page load
window.addEventListener('load', loadGitHubData);
