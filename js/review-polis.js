const STORAGE_KEY = "cerdasFinansial_reviewPolis";
let state = {
  keluarga: [],
  activeId: null,
  polis: {}
};

const matrixTemplate = [
  { kategori: "Asuransi Jiwa", fungsi: "Menjaga income keluarga jika pencari nafkah meninggal dunia", warna: "red" },
  { kategori: "Asuransi Penyakit Kritis", fungsi: "Menjaga income dan biaya hidup saat terkena penyakit kritis", warna: "red" },
  { kategori: "Asuransi Kesehatan", fungsi: "Menanggung biaya rumah sakit dan perawatan medis", warna: "red" },
  { kategori: "Asuransi Kecelakaan", fungsi: "Perlindungan risiko cacat atau meninggal akibat kecelakaan", warna: "green" },
  { kategori: "Dana Pendidikan", fungsi: "Menyiapkan biaya pendidikan anak", warna: "blue" },
  { kategori: "Dana Pensiun", fungsi: "Menyiapkan penghasilan saat usia pensiun", warna: "blue" },
  { kategori: "Warisan / Legacy", fungsi: "Distribusi kekayaan kepada keluarga atau ahli waris", warna: "yellow" },
  { kategori: "Investasi / Unit Link", fungsi: "Akumulasi dana jangka menengah dan panjang", warna: "blue" }
];

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    state = JSON.parse(saved);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function simpanKeluarga() {
  const kepala = document.getElementById("namaKepala").value.trim() || "Kepala Keluarga";
  const pasangan = document.getElementById("namaPasangan").value.trim() || "Pasangan";
  const jumlahAnak = parseInt(document.getElementById("jumlahAnak").value || "0");

  const keluarga = [
    { id: "kepala", nama: kepala, peran: "Kepala Keluarga", icon: "bi-person-fill" },
    { id: "pasangan", nama: pasangan, peran: "Pasangan", icon: "bi-person-heart" }
  ];

  for (let i = 1; i <= jumlahAnak; i++) {
    keluarga.push({
      id: `anak${i}`,
      nama: `Anak ${i}`,
      peran: `Anak ke-${i}`,
      icon: "bi-person"
    });
  }

  state.keluarga = keluarga;
  state.activeId = "kepala";

  keluarga.forEach(member => {
    if (!state.polis[member.id]) {
      state.polis[member.id] = createEmptyMatrix();
    }
  });

  saveState();
  renderAll();
}

function createEmptyMatrix() {
  return matrixTemplate.map(item => ({
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

function renderAll() {
  renderFamilyGrid();
  renderMatrix();
  renderSummary();
  fillFamilyForm();
}

function fillFamilyForm() {
  const kepala = state.keluarga.find(x => x.id === "kepala");
  const pasangan = state.keluarga.find(x => x.id === "pasangan");
  const anakCount = state.keluarga.filter(x => x.id.startsWith("anak")).length;

  if (kepala) document.getElementById("namaKepala").value = kepala.nama;
  if (pasangan) document.getElementById("namaPasangan").value = pasangan.nama;
  if (anakCount) document.getElementById("jumlahAnak").value = anakCount;
}

function renderFamilyGrid() {
  const grid = document.getElementById("familyGrid");

  if (!state.keluarga.length) {
    grid.innerHTML = `
      <div class="small-muted">
        Belum ada data keluarga. Isi nama keluarga lalu klik <strong>Simpan Data Keluarga</strong>.
      </div>
    `;
    return;
  }

  grid.innerHTML = state.keluarga.map(member => `
    <div class="family-card ${member.id === state.activeId ? "active" : ""}" onclick="selectMember('${member.id}')">
      <i class="bi ${member.icon}"></i>
      <h5>${member.nama}</h5>
      <p>${member.peran}</p>
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
  if (!state.polis[state.activeId]) {
    state.polis[state.activeId] = createEmptyMatrix();
  }
  return state.polis[state.activeId];
}

function renderMatrix() {
  const body = document.getElementById("matrixBody");
  const active = getActiveMember();

  if (!active) {
    document.getElementById("matrixName").value = "";
    document.getElementById("matrixTitle").textContent = "INSURANCE MATRIX";
    body.innerHTML = `
      <tr>
        <td colspan="10" class="text-center text-muted py-4">
          Silakan simpan data keluarga terlebih dahulu.
        </td>
      </tr>
    `;
    return;
  }

  document.getElementById("matrixName").value = active.nama;
  document.getElementById("matrixTitle").textContent = `INSURANCE MATRIX - ${active.peran.toUpperCase()}`;

  const matrix = getActiveMatrix();

  body.innerHTML = matrix.map((row, index) => `
    <tr>
      <td class="status-cell"><div class="status-band ${row.warna}"></div></td>
      <td class="row-no">${index + 1}</td>
      <td class="row-category">${row.kategori}</td>
      <td class="row-function">${row.fungsi}</td>
      <td>${row.punya === "ya" ? row.brand || "-" : "-"}</td>
      <td>${row.punya === "ya" ? row.produk || "-" : "-"}</td>
      <td>${row.punya === "ya" ? row.manfaat || "-" : "-"}</td>
      <td class="check-cell">
        ${
          row.punya === "ya"
            ? `<span class="status-pill pill-owned"><i class="bi bi-check-circle"></i> Sudah</span>`
            : `<span class="status-pill pill-none"><i class="bi bi-x-circle"></i> Belum</span>`
        }
      </td>
      <td>
        ${row.catatan || ""}
        ${row.premi ? `<div class="small-muted mt-1">Premi: ${row.premi}</div>` : ""}
        ${row.masa ? `<div class="small-muted">Masa: ${row.masa}</div>` : ""}
      </td>
      <td>
        <button class="edit-btn" onclick="openModal(${index})">
          <i class="bi bi-pencil-square"></i> Edit
        </button>
      </td>
    </tr>
  `).join("");
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
  const index = parseInt(document.getElementById("editIndex").value);
  const matrix = getActiveMatrix();

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
  const yakin = confirm("Reset semua data review polis?");
  if (!yakin) return;

  localStorage.removeItem(STORAGE_KEY);
  state = {
    keluarga: [],
    activeId: null,
    polis: {}
  };

  document.getElementById("namaKepala").value = "";
  document.getElementById("namaPasangan").value = "";
  document.getElementById("jumlahAnak").value = "3";

  renderAll();
}

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderAll();
});