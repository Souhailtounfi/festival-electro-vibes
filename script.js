// ---- Données du programme ----
const programme = {
  ven: [
    ["18h00", "Kenza Waves", "DJ set d'ouverture"],
    ["19h30", "Atlas Pulse", "Live house"],
    ["21h00", "Nour & The Circuits", "Live synthwave"],
    ["22h30", "Mehdi Voltage", "Techno"]
  ],
  sam: [
    ["16h00", "Atelier beat", "Créer un beat, entrée libre"],
    ["18h00", "Zahra Modular", "Ambient, synthés modulaires"],
    ["20h00", "Bit Sahara", "Électro oriental"],
    ["22h00", "Kenza Waves x Atlas Pulse", "Grand final"]
  ]
};

const lineup = document.getElementById("lineup");
const tabs = document.querySelectorAll(".tabs button");

function showDay(day) {
  lineup.innerHTML = programme[day]
    .map(([h, nom, style]) => `<li><time>${h}</time><div><strong>${nom}</strong><span>${style}</span></div></li>`)
    .join("");
  tabs.forEach(t => t.setAttribute("aria-selected", t.dataset.day === day));
}
tabs.forEach(t => t.addEventListener("click", () => showDay(t.dataset.day)));
showDay("ven");

// ---- Compte à rebours ----
const debut = new Date("2026-12-12T18:00:00");
const pad = n => String(n).padStart(2, "0");

function tick() {
  let diff = Math.max(0, debut - new Date());
  const j = Math.floor(diff / 864e5); diff %= 864e5;
  const hh = Math.floor(diff / 36e5); diff %= 36e5;
  const mm = Math.floor(diff / 6e4);
  const ss = Math.floor((diff % 6e4) / 1000);
  d.textContent = j; h.textContent = pad(hh); m.textContent = pad(mm); s.textContent = pad(ss);
}
tick();
setInterval(tick, 1000);

// ---- Formulaire d'inscription (validation locale) ----
const form = document.getElementById("form");
const result = document.getElementById("result");
const rules = {
  nom: v => v.trim().length >= 3 ? "" : "Saisissez votre nom complet (3 caractères minimum).",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Saisissez une adresse e-mail valide, par exemple nom@mail.com.",
  pass: v => v ? "" : "Choisissez un pass."
};

form.addEventListener("submit", e => {
  e.preventDefault();
  let ok = true;
  for (const champ in rules) {
    const input = form.elements[champ];
    const msg = rules[champ](input.value);
    form.querySelector(`[data-for="${champ}"]`).textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) ok = false;
  }
  result.textContent = ok ? `C'est noté ! Votre pass est réservé, ${form.elements.nom.value.trim()}.` : "";
  if (ok) form.reset();
});

// ---- Onde animée (canvas) ----
const canvas = document.getElementById("wave");
const ctx = canvas.getContext("2d");
const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
let freq = 1, cible = 1, t = 0;

function taille() {
  const r = devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * r;
  canvas.height = canvas.clientHeight * r;
  ctx.setTransform(r, 0, 0, r, 0, 0);
}
addEventListener("resize", () => { taille(); dessiner(); });
addEventListener("pointermove", e => { cible = 1 + (e.clientX / innerWidth) * 3; });

function dessiner() {
  const w = canvas.clientWidth, H = canvas.clientHeight;
  ctx.clearRect(0, 0, w, H);
  const couleurs = ["#FFD84A", "#FF5C7A", "#E6E1FF"];
  couleurs.forEach((c, i) => {
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const y = H * (0.55 + i * 0.1)
        + Math.sin(x / 90 * freq + t + i * 1.3) * (28 + i * 10)
        * Math.sin(x / 400 + t * 0.4);
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = c; ctx.lineWidth = 2.5 - i * 0.5; ctx.globalAlpha = 0.9 - i * 0.25;
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
}
function boucle() {
  freq += (cible - freq) * 0.05;
  t += 0.03;
  dessiner();
  requestAnimationFrame(boucle);
}
taille();
calme ? dessiner() : boucle();
