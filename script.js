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



// Dedicated lesson pages for modules 1-6, with a custom illustrative diagram per lesson.
const moduleLessons = {
1:{title:"Hardware & PC",subtitle:"Kenali komponen utama komputer dan bagaimana semuanya bekerja bersama.",intro:"Komputer terdiri dari komponen fisik (hardware) yang saling terhubung. Memahami fungsi setiap komponen membantu saat merakit, merawat, atau mendiagnosis masalah PC.",topics:["CPU — menjalankan instruksi dan perhitungan.","Motherboard — jalur komunikasi antarkomponen.","RAM — menyimpan data sementara saat program berjalan.","SSD/HDD — menyimpan sistem operasi dan berkas.","Power supply — mengubah dan menyalurkan daya ke komponen."],practice:"Matikan komputer dan cabut kabel listrik sebelum memeriksa bagian dalam. Cocokkan komponen yang terlihat dengan fungsi di atas; jangan membuka power supply.",tip:"RAM bersifat sementara: data di dalamnya hilang saat listrik mati. File di SSD tetap tersimpan.",art:`<svg viewBox="0 0 520 270" role="img" aria-label="Ilustrasi komponen komputer"><rect x="145" y="25" width="230" height="220" rx="15" fill="#102d46" stroke="#54e6ff" stroke-width="2"/><rect x="205" y="66" width="110" height="100" rx="8" fill="#0a1728" stroke="#6fe8ff" stroke-width="2"/><rect x="226" y="86" width="68" height="60" rx="5" fill="#164e63" stroke="#54e6ff"/><text x="260" y="120" fill="#e7f7ff" font-size="17" text-anchor="middle" font-weight="700">CPU</text><rect x="166" y="52" width="24" height="120" rx="4" fill="#1d6178"/><text x="178" y="112" fill="#e7f7ff" font-size="10" text-anchor="middle" transform="rotate(-90 178 112)">RAM</text><rect x="327" y="70" width="30" height="70" rx="4" fill="#1d6178"/><text x="342" y="108" fill="#e7f7ff" font-size="9" text-anchor="middle" transform="rotate(-90 342 108)">SSD</text><path d="M190 185 H330 M190 198 H300 M190 211 H320" stroke="#2d7f98" stroke-width="3"/><text x="260" y="15" fill="#54e6ff" font-size="12" text-anchor="middle">MOTHERBOARD</text><path d="M140 90 H78 V66" stroke="#54e6ff" stroke-width="2" fill="none"/><text x="74" y="53" fill="#d9f7ff" font-size="12" text-anchor="middle">RAM</text><path d="M375 120 H438 V95" stroke="#54e6ff" stroke-width="2" fill="none"/><text x="438" y="82" fill="#d9f7ff" font-size="12" text-anchor="middle">SSD</text><text x="260" y="263" fill="#9cb8d3" font-size="11" text-anchor="middle">Ilustrasi sederhana — posisi komponen bisa berbeda</text></svg>`},
2:{title:"Jaringan Dasar",subtitle:"Pelajari bagaimana komputer terhubung dan mengirimkan data.",intro:"Jaringan komputer memungkinkan perangkat bertukar data dan berbagi koneksi. Topologi adalah gambaran hubungan perangkat, sementara alamat IP membantu mengenali perangkat di jaringan.",topics:["LAN — jaringan lokal di rumah, lab, atau kantor.","Switch — menghubungkan perangkat dalam satu jaringan lokal.","Router — menghubungkan jaringan yang berbeda.","IP address — alamat logis sebuah perangkat.","Kabel UTP dan Wi-Fi — media untuk menghubungkan perangkat."],practice:"Buat topologi kecil: internet → router → switch → dua PC. Untuk latihan, gunakan contoh jaringan privat 192.168.1.0/24 dan alamat host berbeda seperti 192.168.1.10 serta 192.168.1.11.",tip:"Dua perangkat pada jaringan yang sama tidak boleh menggunakan alamat IP yang sama.",art:`<svg viewBox="0 0 520 270" role="img" aria-label="Diagram topologi jaringan"><g stroke="#54e6ff" stroke-width="3" fill="none"><path d="M260 65 V105 M260 145 V170 M260 170 H105 V196 M260 170 H415 V196"/></g><rect x="200" y="20" width="120" height="45" rx="10" fill="#123a54" stroke="#54e6ff"/><text x="260" y="47" fill="#e7f7ff" font-size="14" text-anchor="middle" font-weight="700">INTERNET</text><rect x="200" y="105" width="120" height="40" rx="9" fill="#164e63" stroke="#54e6ff"/><text x="260" y="130" fill="#e7f7ff" font-size="14" text-anchor="middle">ROUTER</text><rect x="190" y="170" width="140" height="34" rx="8" fill="#123a54" stroke="#54e6ff"/><text x="260" y="192" fill="#e7f7ff" font-size="13" text-anchor="middle">SWITCH</text><rect x="45" y="196" width="120" height="48" rx="8" fill="#102d46" stroke="#4c9bb3"/><text x="105" y="216" fill="#e7f7ff" font-size="13" text-anchor="middle">PC 01</text><text x="105" y="232" fill="#85dff5" font-size="10" text-anchor="middle">192.168.1.10</text><rect x="355" y="196" width="120" height="48" rx="8" fill="#102d46" stroke="#4c9bb3"/><text x="415" y="216" fill="#e7f7ff" font-size="13" text-anchor="middle">PC 02</text><text x="415" y="232" fill="#85dff5" font-size="10" text-anchor="middle">192.168.1.11</text></svg>`},
3:{title:"Sistem Operasi",subtitle:"Pahami peran Windows dan Linux dalam mengelola komputer.",intro:"Sistem operasi menjadi penghubung antara pengguna, aplikasi, dan perangkat keras. Sistem ini mengatur proses, memori, file, akun, perangkat, serta izin akses.",topics:["Desktop dan aplikasi — tempat pengguna menjalankan program.","File system — menyusun folder dan berkas.","User account — memisahkan akses pengguna.","Driver — membantu OS berkomunikasi dengan perangkat.","Update — memperbaiki bug dan menutup celah keamanan."],practice:"Buat folder bernama Latihan-TKJ, tambahkan subfolder Dokumen dan Gambar, lalu periksa ekstensi file. Jangan menghapus file sistem jika belum tahu fungsinya.",tip:"Gunakan akun standar untuk aktivitas harian; akses administrator hanya saat diperlukan.",art:`<svg viewBox="0 0 520 270" role="img" aria-label="Ilustrasi desktop dan sistem operasi"><rect x="100" y="22" width="320" height="190" rx="12" fill="#102d46" stroke="#54e6ff" stroke-width="2"/><rect x="113" y="36" width="294" height="160" rx="5" fill="#0a1728"/><rect x="113" y="36" width="294" height="24" rx="5" fill="#164e63"/><circle cx="128" cy="48" r="4" fill="#ff7b86"/><circle cx="141" cy="48" r="4" fill="#f8c96b"/><circle cx="154" cy="48" r="4" fill="#67e8a5"/><rect x="133" y="77" width="70" height="94" rx="6" fill="#123a54" stroke="#286c85"/><text x="168" y="119" fill="#54e6ff" font-size="24" text-anchor="middle">▣</text><text x="168" y="143" fill="#e7f7ff" font-size="10" text-anchor="middle">FILES</text><rect x="220" y="77" width="166" height="94" rx="6" fill="#102d46" stroke="#286c85"/><path d="M238 98 H366 M238 119 H350 M238 140 H360" stroke="#54e6ff" stroke-width="4" stroke-linecap="round"/><path d="M235 212 V229 H285 M285 229 H315 M315 229 H365 V212" stroke="#4c9bb3" stroke-width="5" fill="none"/><text x="260" y="255" fill="#9cb8d3" font-size="12" text-anchor="middle">Pengguna → Sistem Operasi → Hardware</text></svg>`},
4:{title:"Keamanan Digital",subtitle:"Lindungi akun, perangkat, dan data dari ancaman digital.",intro:"Keamanan digital adalah kebiasaan dan teknologi untuk menjaga kerahasiaan serta keamanan informasi. Banyak insiden bermula dari tautan palsu, kata sandi lemah, atau perangkat yang tidak diperbarui.",topics:["Kata sandi panjang dan unik untuk setiap akun.","Autentikasi dua faktor menambah lapisan perlindungan.","Phishing menyamar sebagai pihak tepercaya untuk mencuri data.","Periksa domain, pengirim, dan konteks pesan.","Perbarui aplikasi dan buat cadangan file penting."],practice:"Amati pesan contoh sebelum mengeklik: apakah alamat pengirim cocok, apakah tautan menuju domain resmi, dan apakah pesan memaksa kamu bertindak cepat? Jangan masukkan kata sandi di halaman yang meragukan.",tip:"Bank, sekolah, atau layanan resmi tidak seharusnya meminta kata sandi atau kode OTP melalui pesan tak terduga.",art:`<svg viewBox="0 0 520 270" role="img" aria-label="Ilustrasi perisai keamanan digital"><path d="M260 22 L355 55 V123 C355 177 317 214 260 244 C203 214 165 177 165 123 V55 Z" fill="#123a54" stroke="#54e6ff" stroke-width="3"/><path d="M260 43 L335 69 V123 C335 164 306 192 260 218 C214 192 185 164 185 123 V69 Z" fill="#0a2638" stroke="#287b96" stroke-width="2"/><rect x="225" y="108" width="70" height="56" rx="9" fill="#164e63" stroke="#7cecff" stroke-width="2"/><path d="M239 108 V91 A21 21 0 0 1 281 91 V108" fill="none" stroke="#7cecff" stroke-width="6"/><circle cx="260" cy="131" r="6" fill="#e7f7ff"/><path d="M260 137 V148" stroke="#e7f7ff" stroke-width="4"/><text x="95" y="99" fill="#d9f7ff" font-size="12" text-anchor="middle">PASSWORD</text><path d="M130 103 L170 117" stroke="#54e6ff" stroke-width="2"/><text x="420" y="99" fill="#d9f7ff" font-size="12" text-anchor="middle">2FA</text><path d="M390 103 L350 117" stroke="#54e6ff" stroke-width="2"/><text x="260" y="263" fill="#9cb8d3" font-size="11" text-anchor="middle">Berhenti • Periksa • Baru klik</text></svg>`},
5:{title:"Pemrograman Web",subtitle:"Buat halaman website dengan HTML, CSS, dan JavaScript.",intro:"Website dibangun dari struktur, tampilan, dan interaksi. Ketiga teknologi dasar ini saling melengkapi untuk menghasilkan halaman yang informatif dan mudah digunakan.",topics:["HTML — memberi struktur seperti judul, paragraf, gambar, dan tautan.","CSS — mengatur warna, jarak, ukuran, dan layout.","JavaScript — menangani klik tombol dan perubahan konten.","Browser membaca kode dan menampilkan halaman.","Debugging membantu menemukan dan memperbaiki kesalahan."],practice:"Coba buat file index.html berisi h1 dan p. Tambahkan CSS untuk mengubah warna judul, lalu buat tombol dengan JavaScript yang mengubah isi paragraf saat ditekan.",tip:"Simpan file dengan ekstensi .html, lalu buka di browser. Perubahan kode perlu disimpan dan halaman dimuat ulang.",art:`<svg viewBox="0 0 520 270" role="img" aria-label="Ilustrasi kode HTML CSS JavaScript"><rect x="35" y="35" width="450" height="200" rx="12" fill="#0a1728" stroke="#2a4d6b" stroke-width="2"/><rect x="35" y="35" width="450" height="32" rx="10" fill="#123a54"/><circle cx="53" cy="51" r="4" fill="#ff7b86"/><circle cx="67" cy="51" r="4" fill="#f8c96b"/><circle cx="81" cy="51" r="4" fill="#67e8a5"/><text x="60" y="94" fill="#ffb86b" font-size="14" font-family="monospace">&lt;h1&gt;</text><text x="118" y="94" fill="#e7f7ff" font-size="14" font-family="monospace">Halo, TKJ!</text><text x="240" y="94" fill="#ffb86b" font-size="14" font-family="monospace">&lt;/h1&gt;</text><text x="60" y="130" fill="#7cecff" font-size="14" font-family="monospace">h1 { color:</text><text x="171" y="130" fill="#a8f0c6" font-size="14" font-family="monospace">cyan;</text><text x="222" y="130" fill="#7cecff" font-size="14" font-family="monospace">}</text><text x="60" y="166" fill="#c5a8ff" font-size="14" font-family="monospace">button.onclick =</text><text x="220" y="166" fill="#e7f7ff" font-size="14" font-family="monospace">showMessage</text><rect x="60" y="188" width="400" height="29" rx="6" fill="#10354b"/><text x="260" y="207" fill="#7cecff" font-size="12" text-anchor="middle">HTML + CSS + JavaScript = Website</text></svg>`},
6:{title:"Server & Troubleshooting",subtitle:"Kenali layanan server dan telusuri masalah dengan langkah teratur.",intro:"Server adalah komputer atau perangkat lunak yang menyediakan layanan untuk client. Troubleshooting berarti mengumpulkan gejala, menguji kemungkinan penyebab, lalu mencatat solusi secara sistematis.",topics:["Web server melayani permintaan halaman website.","File server menyediakan penyimpanan bersama.","DNS menerjemahkan nama domain menjadi alamat IP.","Mulai diagnosis dari hal paling sederhana dan aman.","Ubah satu hal dalam satu waktu dan catat hasilnya."],practice:"Kasus: satu PC tidak bisa membuka situs. Periksa apakah perangkat lain bisa internet, cek Wi-Fi/kabel, periksa alamat IP dan gateway, lalu uji DNS. Catat hasil setiap langkah.",tip:"Jangan langsung mereset server atau mengubah banyak pengaturan sekaligus. Pastikan kamu memiliki izin sebelum mengubah perangkat jaringan.",art:`<svg viewBox="0 0 520 270" role="img" aria-label="Ilustrasi server dan troubleshooting"><g><rect x="55" y="35" width="155" height="190" rx="12" fill="#102d46" stroke="#54e6ff" stroke-width="2"/><text x="132" y="24" fill="#d9f7ff" font-size="12" text-anchor="middle">SERVER RACK</text><g fill="#123a54" stroke="#2b7890"><rect x="72" y="53" width="121" height="42" rx="6"/><rect x="72" y="105" width="121" height="42" rx="6"/><rect x="72" y="157" width="121" height="42" rx="6"/></g><g fill="#67e8a5"><circle cx="85" cy="67" r="4"/><circle cx="85" cy="119" r="4"/><circle cx="85" cy="171" r="4"/></g><g stroke="#54e6ff" stroke-width="3"><path d="M100 68 H177 M100 120 H177 M100 172 H177"/></g><path d="M210 130 H290" stroke="#54e6ff" stroke-width="3"/><path d="M280 121 L291 130 L280 139" stroke="#54e6ff" stroke-width="3" fill="none"/><rect x="300" y="54" width="165" height="150" rx="12" fill="#0a2638" stroke="#4c9bb3" stroke-width="2"/><circle cx="382" cy="88" r="18" fill="#164e63" stroke="#54e6ff" stroke-width="2"/><path d="M382 78 V90 L392 96" stroke="#e7f7ff" stroke-width="3" fill="none"/><text x="382" y="126" fill="#e7f7ff" font-size="13" text-anchor="middle">DIAGNOSIS</text><text x="382" y="148" fill="#9cb8d3" font-size="11" text-anchor="middle">Periksa gejala</text><text x="382" y="165" fill="#9cb8d3" font-size="11" text-anchor="middle">Uji penyebab</text><text x="382" y="182" fill="#9cb8d3" font-size="11" text-anchor="middle">Catat solusi</text></g></svg>`}
};
const modulePage = document.querySelector('#modulePage');
const modulePageContent = document.querySelector('#modulePageContent');
const modulesSection = document.querySelector('#materi');
function showModule(id) {
  const m = moduleLessons[id]; if (!m || !modulePageContent) return;
  modulePageContent.innerHTML = `<div class="lesson-header"><div><span class="lesson-eyebrow">SYAHRULPROJECT / MODULE ${String(id).padStart(2,'0')}</span><h2>${m.title}</h2><p>${m.subtitle}</p><div class="lesson-tip">${m.tip}</div></div><div class="lesson-art">${m.art}</div></div><div class="lesson-columns"><article class="lesson-section"><h3>📘 Penjelasan materi</h3><p>${m.intro}</p><h4>Poin penting</h4><ul>${m.topics.map(x=>`<li>${x}</li>`).join('')}</ul></article><article class="lesson-section"><h3>🧰 Contoh praktik</h3><p>${m.practice}</p><h4>Tujuan belajar</h4><p>Setelah mempelajari modul ini, kamu diharapkan dapat menjelaskan konsep utama, mengenali komponen atau proses terkait, dan mencoba langkah latihan dasar dengan aman.</p></article></div><article class="lesson-section"><h3>🪜 Cara belajar bertahap</h3><div class="lesson-steps"><div class="lesson-step"><b>Pahami konsep</b>Baca fungsi dan istilah penting pada modul ini.</div><div class="lesson-step"><b>Amati contoh</b>Gunakan ilustrasi untuk melihat hubungan antarbagian.</div><div class="lesson-step"><b>Coba praktik</b>Kerjakan latihan sederhana dan catat hasilnya.</div></div><div class="lesson-actions"><button class="button button-primary" type="button" id="lessonComplete">✓ Tandai modul selesai</button><button class="button button-secondary" type="button" id="lessonNext">Modul berikutnya →</button></div></article>`;
  modulePage.hidden = false;
  modulesSection.hidden = true;
  document.querySelector('#lab').hidden = true;
  document.querySelector('#tentang').hidden = true;
  document.querySelector('#progres').hidden = true;
  document.querySelector('#karier').hidden = true;
  document.querySelector('#kontak').hidden = true;
  modulePage.dataset.current = String(id);
  window.scrollTo({top:0,behavior:'smooth'});
  document.querySelector('#lessonComplete')?.addEventListener('click',()=>{
    const key = ['hardware','network','os','security','coding','trouble'][id-1];
    const check = document.querySelector(`.progress-check[data-progress="${key}"]`);
    if(check){check.checked=true;updateProgress();}
    const btn=document.querySelector('#lessonComplete'); if(btn) btn.textContent='✓ Modul ditandai selesai';
  });
  document.querySelector('#lessonNext')?.addEventListener('click',()=>showModule(id===6?1:id+1));
}
function backToModules(){
  modulePage.hidden=true; modulesSection.hidden=false;
  ['#lab','#tentang','#progres','#karier','#kontak'].forEach(sel=>{const el=document.querySelector(sel);if(el)el.hidden=false;});
  modulesSection.scrollIntoView({behavior:'smooth',block:'start'});
}
document.querySelectorAll('.open-module').forEach(button=>button.addEventListener('click',()=>showModule(Number(button.dataset.module))));
document.querySelector('#backModules')?.addEventListener('click',backToModules);
