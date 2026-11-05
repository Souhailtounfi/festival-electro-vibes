/* ===== 1. Mode sombre / clair ===== */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function getSavedTheme() {
  try {
    return localStorage.getItem('theme');
  } catch (e) {
    return null;
  }
}

const initialTheme =
  getSavedTheme() ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(initialTheme);

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {
    /* stockage indisponible : on ignore */
  }
});

/* ===== 2. Filtre des projets par catégorie ===== */
const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    projects.forEach((project) => {
      const match = filter === 'all' || project.dataset.category === filter;
      project.classList.toggle('hidden', !match);
    });
  });
});

/* ===== 3. Menu mobile ===== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ===== 4. Validation du formulaire de contact ===== */
const form = document.getElementById('contactForm');
const statusBox = document.getElementById('formStatus');

function setError(id, message) {
  document.getElementById(id).textContent = message;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  statusBox.textContent = '';
  statusBox.classList.remove('success');

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let valid = true;

  setError('nameError', '');
  setError('emailError', '');
  setError('messageError', '');

  if (name.length < 2) {
    setError('nameError', 'Veuillez saisir votre nom.');
    valid = false;
  }
  if (!emailPattern.test(email)) {
    setError('emailError', 'Adresse email invalide.');
    valid = false;
  }
  if (message.length < 10) {
    setError('messageError', 'Le message doit contenir au moins 10 caractères.');
    valid = false;
  }

  if (valid) {
    /* Démonstration : à relier à un service (Formspree, EmailJS, API...) */
    statusBox.textContent = 'Merci ! Votre message a bien été préparé.';
    statusBox.classList.add('success');
    form.reset();
  }
});

/* ===== 5. Année dynamique dans le pied de page ===== */
document.getElementById('year').textContent = new Date().getFullYear();
