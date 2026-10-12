const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const backToTop = document.querySelector("#backToTop");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  });
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}
if (backToTop) {
  const update = () => backToTop.classList.toggle("visible", window.scrollY > 450);
  window.addEventListener("scroll", update, {passive:true}); update();
  backToTop.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
}
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// Interactive learning checklist; progress is saved on this browser only.
const progressChecks = [...document.querySelectorAll(".progress-check")];
const progressKey = "syahrulproject-tkj-progress-v1";
function loadProgress() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(progressKey) || "{}"); } catch (_) {}
  progressChecks.forEach(check => { check.checked = Boolean(saved[check.dataset.progress]); });
  updateProgress();
}
function updateProgress() {
  const done = progressChecks.filter(c => c.checked).length;
  const percent = Math.round(done / Math.max(progressChecks.length, 1) * 100);
  const text = document.querySelector("#progressText");
  const bar = document.querySelector("#progressBar");
  const pct = document.querySelector("#progressPercent");
  if (text) text.textContent = `${done} / ${progressChecks.length} selesai`;
  if (bar) bar.style.width = `${percent}%`;
  if (pct) pct.textContent = `${percent}%`;
  const saved = {};
  progressChecks.forEach(c => saved[c.dataset.progress] = c.checked);
  try { localStorage.setItem(progressKey, JSON.stringify(saved)); } catch (_) {}
}
progressChecks.forEach(c => c.addEventListener("change", updateProgress));
document.querySelector("#resetProgress")?.addEventListener("click", () => {
  progressChecks.forEach(c => c.checked = false); updateProgress();
});
loadProgress();

// Lab tabs.
document.querySelectorAll(".lab-tab").forEach(tab => tab.addEventListener("click", () => {
  document.querySelectorAll(".lab-tab").forEach(t => {
    const active = t === tab; t.classList.toggle("active", active);
    t.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".lab-panel").forEach(panel => {
    const active = panel.id === tab.dataset.tab;
    panel.classList.toggle("active", active); panel.hidden = !active;
  });
}));

// Network topology visual demo.
const topologyNodes = document.querySelector("#topologyNodes");
const topologyStatus = document.querySelector("#topologyStatus");
const initialTopology = topologyNodes?.innerHTML || "";
const deviceSymbols = {PC:"▣", SWITCH:"▦", ROUTER:"◈", SERVER:"▤"};
const deviceNames = {PC:"PC Client", SWITCH:"Switch", ROUTER:"Router", SERVER:"Server"};
function refreshTopology() {
  if (!topologyNodes) return;
  const nodes = [...topologyNodes.querySelectorAll(".topology-node")];
  topologyStatus.textContent = `Topologi demo: ${nodes.length} perangkat. Ini hanya visualisasi konsep.`;
}
document.querySelectorAll("[data-device]").forEach(button => button.addEventListener("click", () => {
  const type = button.dataset.device;
  const link = document.createElement("span"); link.className = "topology-link"; link.setAttribute("aria-hidden","true");
  const node = document.createElement("div"); node.className = "topology-node";
  const icon = document.createElement("span"); icon.textContent = deviceSymbols[type];
  const name = document.createElement("b"); name.textContent = deviceNames[type];
  const small = document.createElement("small"); small.textContent = "Demo node";
  node.append(icon,name,small);
  topologyNodes.append(link,node); refreshTopology();
}));
document.querySelector("#resetNetwork")?.addEventListener("click", () => {
  topologyNodes.innerHTML = initialTopology; refreshTopology();
});

// Code playground: user code runs only inside a sandboxed iframe.
const codeInput = document.querySelector("#codeInput");
const codePreview = document.querySelector("#codePreview");
function runCode() {
  if (!codeInput || !codePreview) return;
  codePreview.srcdoc = codeInput.value;
}
document.querySelector("#runCode")?.addEventListener("click", runCode);
runCode();

// Troubleshooting challenge.
const troubleAnswers = document.querySelector("#troubleAnswers");
const troubleFeedback = document.querySelector("#troubleFeedback");
function resetTrouble() {
  if (!troubleAnswers) return;
  troubleAnswers.querySelectorAll("button").forEach(b => {
    b.disabled = false; b.classList.remove("correct","incorrect");
  });
  if (troubleFeedback) troubleFeedback.textContent = "Pilih satu jawaban untuk melihat penjelasan.";
}
troubleAnswers?.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
  troubleAnswers.querySelectorAll("button").forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === "true") b.classList.add("correct");
    else if (b === button) b.classList.add("incorrect");
  });
  troubleFeedback.textContent = button.dataset.correct === "true"
    ? "Benar! Mulai dari memeriksa apakah masalah terjadi pada satu perangkat atau semua perangkat, lalu cek koneksi dan konfigurasi IP."
    : "Belum tepat. Mulailah dengan pemeriksaan yang aman dan bertahap: bandingkan perangkat lain, cek koneksi, lalu periksa konfigurasi IP.";
}));
document.querySelector("#nextTrouble")?.addEventListener("click", resetTrouble);
