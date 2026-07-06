const STORAGE_KEY = "cerdasFinansial_reviewPolis_v2";

let state = {
  keluarga: [],
  activeId: null,
  polis: {}
};

const baseMatrixBeforeEducation = [
  { kategori: "ASURANSI KESEHATAN", fungsi: "PROTEKSI ASET", warna: "red" },
  { kategori: "ASURANSI PENYAKIT KRITIS", fungsi: "PROTEKSI INCOME", warna: "red" },
  { kategori: "ASURANSI JIWA", fungsi: "PROTEKSI INCOME", warna: "red" }
];

const baseMatrixAfterEducation = [
  { kategori: "ASURANSI JIWA", fungsi: "DANA PENSIUN PASANGAN", warna: "red" },
  { kategori: "ASURANSI JIWA", fungsi: "PELUNASAN HUTANG", warna: "red" },
  { kategori: "ASURANSI JIWA", fungsi: "BIAYA PEMAKAMAN", warna: "red" },
  { kategori: "ASURANSI SANTUNAN HARIAN RAWAT INAP", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI CACAT TETAP & TOTAL", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI KECELAKAAN", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI JIWA", fungsi: "BIAYA DISTRIBUSI ASET", warna: "yellow" },
  { kategori: "ASURANSI JIWA", fungsi: "WARISAN", warna: "yellow" },
  { kategori: "ASURANSI DANA PENSIUN", fungsi: "PERSIAPAN INCOME MASA PENSIUN", warna: "blue" }
];

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    state = JSON.parse(saved);
  } catch (error) {
    console.error("Gagal membaca data review polis", error);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getJumlahAnak() {
  return state.keluarga.filter(member => member.id.startsWith("anak")).length || 0;
}

function getMatrixTemplate() {
  const educationRows = [];
  for (let i = 1; i <= getJumlahAnak(); i++) {
    educationRows.push({
      kategori: "ASURANSI PENDIDIKAN ANAK",
      fungsi: `PENDIDIKAN ANAK ${i}`,
      warna: "red"
    });
  }
  return [...baseMatrixBeforeEducation, ...educationRows, ...baseMatrixAfterEducation];
}

function createEmptyMatrix() {
  return getMatrixTemplate().map(item => ({
    ...item,
    punya: "tidak",
    brand: "",
    produk: "",
    manfaat: "",
    premi: "",
    masa: "",
    catatan: ""
  }));
}

function simpanKeluarga() {
  const kepala = document.getElementById("namaKepala").value.trim() || "Kepala Keluarga";
  const pasangan = document.getElementById("namaPasangan").value.trim() || "Pasangan";
  const jumlahAnak = parseInt(document.getElementById("jumlahAnak").value || "0", 10);

  const keluarga = [
    { id: "kepala", nama: kepala, peran: "Kepala Keluarga", icon: "bi-person-fill" },
    { id: "pasangan", nama: pasangan, peran: "Pasangan", icon: "bi-person-heart" }
  ];

  for (let i = 1; i <= jumlahAnak; i++) {
    keluarga.push({ id: `anak${i}`, nama: `Anak ${i}`, peran: `Anak ke-${i}`, icon: "bi-person-fill" });
  }

  state.keluarga = keluarga;
  state.activeId = "kepala";
  state.polis = {};

  keluarga.forEach(member => {
    state.polis[member.id] = createEmptyMatrix();
  });

  saveState();
  renderAll();
}

function fillFamilyForm() {
  const kepala = state.keluarga.find(x => x.id === "kepala");
  const pasangan = state.keluarga.find(x => x.id === "pasangan");
  const anakCount = getJumlahAnak();
  if (kepala) document.getElementById("namaKepala").value = kepala.nama;
  if (pasangan) document.getElementById("namaPasangan").value = pasangan.nama;
  document.getElementById("jumlahAnak").value = String(anakCount || 3);
}

function renderFamilyGrid() {
  const grid = document.getElementById("familyGrid");
  if (!state.keluarga.length) {
    grid.innerHTML = `<div class="small-muted">Belum ada data keluarga. Isi data lalu klik <strong>Simpan Data Keluarga</strong>.</div>`;
    return;
  }
  grid.innerHTML = state.keluarga.map(member => `
    <div class="family-card ${member.id === state.activeId ? "active" : ""}" onclick="selectMember('${member.id}')">
      <i class="bi ${member.icon}"></i>
      <h5>${escapeHtml(member.nama)}</h5>
      <p>${escapeHtml(member.peran)}</p>
    </div>
  `).join("");
}

function selectMember(id) {
  state.activeId = id;
  saveState();
  renderAll();
}

function getActiveMember() {
  return state.keluarga.find(x => x.id === state.activeId);
}

function getActiveMatrix() {
  if (!state.activeId) return [];
  if (!state.polis[state.activeId]) state.polis[state.activeId] = createEmptyMatrix();
  return state.polis[state.activeId];
}

function getMemberLabel(member) {
  if (!member) return "INSURANCE MATRIX";
  if (member.id === "kepala") return "1. KEPALA KELUARGA";
  if (member.id === "pasangan") return "2. PASANGAN";
  const n = parseInt(member.id.replace("anak", ""), 10);
  return `${n + 2}. ANAK ${n}`;
}

function renderMatrix() {
  const body = document.getElementById("matrixBody");
  const active = getActiveMember();

  if (!active) {
    document.getElementById("memberMatrixLabel").textContent = "INSURANCE MATRIX";
    document.getElementById("matrixName").value = "";
    body.innerHTML = `<tr><td colspan="10" class="text-center text-muted py-4">Silakan simpan data keluarga terlebih dahulu.</td></tr>`;
    renderSummary();
    return;
  }

  document.getElementById("memberMatrixLabel").textContent = getMemberLabel(active);
  document.getElementById("matrixName").value = active.nama;

  const matrix = getActiveMatrix();
  body.innerHTML = matrix.map((row, index) => `
    <tr>
      <td class="status-cell"><span class="status-band ${row.warna}"></span></td>
      <td class="row-no">${index + 1}</td>
      <td class="row-category">${escapeHtml(row.kategori)}</td>
      <td class="row-function">${escapeHtml(row.fungsi)}</td>
      <td>${row.punya === "ya" ? escapeHtml(row.brand || "-") : "-"}</td>
      <td>${row.punya === "ya" ? escapeHtml(row.produk || "-") : "-"}</td>
      <td>${row.punya === "ya" ? escapeHtml(row.manfaat || "-") : "-"}</td>
      <td class="check-cell">${row.punya === "ya" ? `<span class="status-pill pill-owned"><i class="bi bi-check-circle"></i> Sudah</span>` : `<span class="status-pill pill-none"><i class="bi bi-x-circle"></i> Belum</span>`}</td>
      <td>${renderNotes(row)}</td>
      <td class="text-center"><button class="edit-btn" onclick="openModal(${index})"><i class="bi bi-pencil-square"></i> Edit</button></td>
    </tr>
  `).join("");

  renderSummary();
}

function renderNotes(row) {
  const lines = [];
  if (row.catatan) lines.push(escapeHtml(row.catatan));
  if (row.premi) lines.push(`<div class="small-muted">Premi: ${escapeHtml(row.premi)}</div>`);
  if (row.masa) lines.push(`<div class="small-muted">Masa: ${escapeHtml(row.masa)}</div>`);
  return lines.join("");
}

function renderSummary() {
  const matrix = getActiveMatrix();
  const total = matrix.length;
  const owned = matrix.filter(x => x.punya === "ya").length;
  const none = total - owned;
  const score = total ? Math.round((owned / total) * 100) : 0;
  document.getElementById("sumTotal").textContent = total;
  document.getElementById("sumOwned").textContent = owned;
  document.getElementById("sumNone").textContent = none;
  document.getElementById("sumScore").textContent = `${score}%`;
}

function openModal(index) {
  const row = getActiveMatrix()[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("modalTitle").textContent = `Edit ${row.kategori}`;
  document.getElementById("editPunya").value = row.punya;
  document.getElementById("editBrand").value = row.brand;
  document.getElementById("editProduk").value = row.produk;
  document.getElementById("editManfaat").value = row.manfaat;
  document.getElementById("editPremi").value = row.premi;
  document.getElementById("editMasa").value = row.masa;
  document.getElementById("editCatatan").value = row.catatan;
  document.getElementById("editModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

function savePolicy() {
  const index = parseInt(document.getElementById("editIndex").value, 10);
  const matrix = getActiveMatrix();
  if (!matrix[index]) return;

  matrix[index] = {
    ...matrix[index],
    punya: document.getElementById("editPunya").value,
    brand: document.getElementById("editBrand").value.trim(),
    produk: document.getElementById("editProduk").value.trim(),
    manfaat: document.getElementById("editManfaat").value.trim(),
    premi: document.getElementById("editPremi").value.trim(),
    masa: document.getElementById("editMasa").value.trim(),
    catatan: document.getElementById("editCatatan").value.trim()
  };

  saveState();
  closeModal();
  renderAll();
}

function updateCurrentName(value) {
  const active = getActiveMember();
  if (!active) return;
  active.nama = value.trim() || active.peran;
  saveState();
  renderFamilyGrid();
}

function resetReview() {
  if (!confirm("Reset semua data review polis?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = { keluarga: [], activeId: null, polis: {} };
  document.getElementById("namaKepala").value = "";
  document.getElementById("namaPasangan").value = "";
  document.getElementById("jumlahAnak").value = "3";
  renderAll();
}

function renderAll() {
  fillFamilyForm();
  renderFamilyGrid();
  renderMatrix();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderAll();
});
