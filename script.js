/* ─────────────────────────────────────────
   Panti Asuhan Cahaya Harapan — script.js
   ───────────────────────────────────────── */

// Inisialisasi Lucide Icons
if (typeof lucide !== "undefined") {
  lucide.createIcons();
}

/* ── NAVIGASI MOBILE (Sidebar kanan) ── */
const navToggle    = document.getElementById("navToggle");
const mobileSidebar= document.getElementById("mobileSidebar");
const navOverlay   = document.getElementById("navOverlay");
const sidebarClose = document.getElementById("sidebarClose");

function openNav() {
  if (mobileSidebar) mobileSidebar.classList.add("open");
  if (navOverlay) navOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeNav() {
  if (mobileSidebar) mobileSidebar.classList.remove("open");
  if (navOverlay) navOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Buka via Hamburger menu
if (navToggle) {
  navToggle.addEventListener("click", openNav);
}

// Tutup via tombol Close "X" di dalam sidebar
if (sidebarClose) {
  sidebarClose.addEventListener("click", closeNav);
}

// Tutup saat klik overlay (di luar sidebar)
if (navOverlay) {
  navOverlay.addEventListener("click", closeNav);
}

// Tutup saat klik link di dalam sidebar
if (mobileSidebar) {
  mobileSidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });
}

/* ── TOMBOL NOMINAL DONASI ── */
const amountButtons = document.querySelectorAll(".amount-btn");
let selectedAmount  = "Rp 100.000"; // default

amountButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    amountButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedAmount = btn.dataset.amount || btn.textContent.trim();
  });
});

/* ── MODAL DONASI ── */
const donasiBtn  = document.getElementById("donasiBtn");
const modal      = document.getElementById("donasiModal");
const modalClose = document.getElementById("modalClose");
const modalAmount = document.getElementById("modalAmount");

function openModal() {
  if (!modal) return;
  modalAmount.textContent = selectedAmount;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

if (donasiBtn) donasiBtn.addEventListener("click", openModal);
if (modalClose) modalClose.addEventListener("click", closeModal);

// Tutup saat klik overlay (di luar modal box)
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

// Tutup dengan tombol Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ── COPY NOMOR REKENING ── */
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const textToCopy = btn.dataset.copy;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check"></i> Tersalin!';
        btn.classList.add("copied");
        if (typeof lucide !== "undefined") lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove("copied");
          if (typeof lucide !== "undefined") lucide.createIcons();
        }, 2000);
      })
      .catch(() => {
        // Fallback untuk browser lama
        const textarea   = document.createElement("textarea");
        textarea.value   = textToCopy;
        textarea.style.position = "fixed";
        textarea.style.opacity  = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check"></i> Tersalin!';
        btn.classList.add("copied");
        if (typeof lucide !== "undefined") lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove("copied");
          if (typeof lucide !== "undefined") lucide.createIcons();
        }, 2000);
      });
  });
});

/* ── FORM SUBMIT (Redirect WhatsApp) ── */
const formSubmit = document.getElementById("formSubmit");
if (formSubmit) {
  formSubmit.addEventListener("click", () => {
    const nama   = document.getElementById("namaInput")?.value.trim() || "";
    const email  = document.getElementById("emailInput")?.value.trim() || "";
    const subjek = document.getElementById("subjekInput")?.value.trim() || "";
    const pesan  = document.getElementById("pesanInput")?.value.trim() || "";

    // Berikan feedback visual singkat
    formSubmit.disabled = true;
    formSubmit.innerHTML = '<i data-lucide="loader"></i> Memproses...';
    if (typeof lucide !== "undefined") lucide.createIcons();

    // Susun pesan WhatsApp
    let waText = `Halo, %0A%0A`;
    if (nama) waText += `*Nama:* ${nama}%0A`;
    if (email) waText += `*Email:* ${email}%0A`;
    if (subjek) waText += `*Subjek:* ${subjek}%0A%0A`;
    if (pesan) waText += `*Pesan:*%0A${pesan}`;

    // Arahkan ke WhatsApp API + Kembalikan state tombol (jika tab kembali)
    setTimeout(() => {
      window.open(`https://wa.me/6285122649886?text=${waText}`, "_blank");
      
      formSubmit.disabled = false;
      formSubmit.innerHTML = '<i data-lucide="send"></i> Kirim Pesan';
      if (typeof lucide !== "undefined") lucide.createIcons();
    }, 600);
  });
}

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll(
  ".program-card, .pillar, .gallery-item, .contact-item, .about-card-main, .stat-item"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = "1";
        entry.target.style.transform  = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => {
  el.style.opacity   = "0";
  el.style.transform = "translateY(22px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

/* ── NAVBAR SHADOW ON SCROLL ── */
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.style.boxShadow = window.scrollY > 30
      ? "0 4px 24px rgba(26,92,58,0.12)"
      : "0 2px 16px rgba(26,92,58,0.06)";
  });
}
