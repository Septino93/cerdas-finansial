const STORAGE_KEY = "cerdasFinansial_reviewPolis_v11";

let state = {
  keluarga: [],
  activeId: null,
  statusMenikah: "menikah",
  statusPasangan: "kerja",
  polis: {}
};

const matrixKepalaBeforeEducation = [
  { kategori: "ASURANSI KESEHATAN", fungsi: "PROTEKSI ASET", warna: "red" },
  { kategori: "ASURANSI PENYAKIT KRITIS", fungsi: "PROTEKSI INCOME", warna: "red" },
  { kategori: "ASURANSI JIWA", fungsi: "PROTEKSI INCOME", warna: "red" }
];

const matrixKepalaAfterEducation = [
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


const matrixIndividuBelumMenikah = [
  { kategori: "ASURANSI KESEHATAN", fungsi: "PROTEKSI ASET", warna: "red" },
  { kategori: "ASURANSI PENYAKIT KRITIS", fungsi: "PROTEKSI INCOME", warna: "red" },
  { kategori: "ASURANSI JIWA", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI JIWA", fungsi: "DANA PENSIUN", warna: "green" },
  { kategori: "ASURANSI JIWA", fungsi: "PELUNASAN HUTANG", warna: "green" },
  { kategori: "ASURANSI JIWA", fungsi: "BIAYA PEMAKAMAN", warna: "red" },
  { kategori: "ASURANSI SANTUNAN HARIAN RAWAT INAP", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI CACAT TETAP & TOTAL", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI KECELAKAAN", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI JIWA", fungsi: "BIAYA DISTRIBUSI ASET", warna: "yellow" },
  { kategori: "ASURANSI JIWA", fungsi: "WARISAN", warna: "yellow" },
  { kategori: "ASURANSI DANA PENSIUN", fungsi: "PERSIAPAN INCOME MASA PENSIUN", warna: "blue" }
];

const matrixPasanganTidakKerja = [
  { kategori: "ASURANSI KESEHATAN", fungsi: "PROTEKSI ASET", warna: "red" },
  { kategori: "ASURANSI PENYAKIT KRITIS", fungsi: "PROTEKSI INCOME", warna: "red" },
  { kategori: "ASURANSI JIWA", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI JIWA", fungsi: "PENDIDIKAN ANAK", warna: "green" },
  { kategori: "ASURANSI JIWA", fungsi: "DANA PENSIUN PASANGAN", warna: "green" },
  { kategori: "ASURANSI JIWA", fungsi: "PELUNASAN HUTANG", warna: "green" },
  { kategori: "ASURANSI JIWA", fungsi: "BIAYA PEMAKAMAN", warna: "green" },
  { kategori: "ASURANSI SANTUNAN HARIAN RAWAT INAP", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI CACAT TETAP & TOTAL", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI KECELAKAAN", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI JIWA", fungsi: "BIAYA DISTRIBUSI ASET", warna: "yellow" },
  { kategori: "ASURANSI JIWA", fungsi: "WARISAN", warna: "yellow" },
  { kategori: "ASURANSI DANA PENSIUN", fungsi: "PERSIAPAN INCOME MASA PENSIUN", warna: "blue" }
];

const matrixAnak = [
  { kategori: "ASURANSI KESEHATAN", fungsi: "PROTEKSI ASET", warna: "red" },
  { kategori: "ASURANSI PENYAKIT KRITIS", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI JIWA", fungsi: "PROTEKSI INCOME", warna: "green" },
  { kategori: "ASURANSI DANA PENDIDIKAN", fungsi: "AKUMULASI DANA PENDIDIKAN", warna: "blue" }
];

function loadState(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    try{ state = JSON.parse(saved); }catch(e){ saveState(); }
  }
  if(!state.statusMenikah) state.statusMenikah = "menikah";
  if(!state.statusPasangan) state.statusPasangan = "kerja";
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getJumlahAnak(){
  return state.keluarga.filter(member => member.id.startsWith("anak")).length || 0;
}

function getMatrixKepalaTemplate(){
  const jumlahAnak = getJumlahAnak();
  const educationRows = [];

  for(let i = 1; i <= jumlahAnak; i++){
    educationRows.push({
      kategori: "ASURANSI PENDIDIKAN ANAK",
      fungsi: `PENDIDIKAN ANAK ${i}`,
      warna: "red"
    });
  }

  return [...matrixKepalaBeforeEducation, ...educationRows, ...matrixKepalaAfterEducation];
}

function getMatrixTemplate(memberId = state.activeId){
  if(memberId === "kepala" && state.statusMenikah === "belum_menikah"){
    return matrixIndividuBelumMenikah;
  }

  if(memberId && memberId.startsWith("anak")){
    const nomorAnak = parseInt(memberId.replace("anak", ""));
    return matrixAnak.map((row, index) => {
      if(index === 2 && nomorAnak === 1){
        return { ...row, fungsi: "BIAYA DISTRIBUSI ASET" };
      }
      if(index === 3 && nomorAnak === 2){
        return { ...row, fungsi: "PENDIDIKAN ANAK" };
      }
      return row;
    });
  }

  if(memberId === "pasangan" && state.statusPasangan === "tidak_kerja"){
    return matrixPasanganTidakKerja;
  }

  return getMatrixKepalaTemplate();
}

function createEmptyMatrix(memberId = state.activeId){
  return getMatrixTemplate(memberId).map(item => ({
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

function sameRow(a, b){
  return a.kategori === b.kategori && a.fungsi === b.fungsi && a.warna === b.warna;
}

function syncMatrixWithTemplate(memberId){
  const template = getMatrixTemplate(memberId);
  const existing = state.polis[memberId] || [];

  state.polis[memberId] = template.map(item => {
    const old = existing.find(row => sameRow(row, item));
    return old ? { ...item, ...old, kategori:item.kategori, fungsi:item.fungsi, warna:item.warna } : {
      ...item,
      punya:"tidak",
      brand:"",
      produk:"",
      manfaat:"",
      premi:"",
      masa:"",
      catatan:""
    };
  });
}

function setInvalid(el, isInvalid){
  if(!el) return;
  el.classList.toggle("input-invalid", isInvalid);
}

function showFamilyError(message){
  const box = document.getElementById("familyError");
  if(!box) return;
  if(message){
    box.textContent = message;
    box.classList.remove("d-none");
  }else{
    box.textContent = "";
    box.classList.add("d-none");
  }
}

function validateFamilyForm(){
  const namaKepala = document.getElementById("namaKepala");
  const statusMenikah = document.getElementById("statusMenikah");
  const namaPasangan = document.getElementById("namaPasangan");
  const statusPasangan = document.getElementById("statusPasangan");
  const jumlahAnak = document.getElementById("jumlahAnak");

  const menikah = (statusMenikah.value || "menikah") === "menikah";
  const fields = menikah
    ? [namaKepala, statusMenikah, namaPasangan, statusPasangan, jumlahAnak]
    : [namaKepala, statusMenikah];

  [namaKepala, statusMenikah, namaPasangan, statusPasangan, jumlahAnak].forEach(field => setInvalid(field, false));

  let valid = true;
  fields.forEach(field => {
    const empty = !String(field.value || "").trim();
    setInvalid(field, empty);
    if(empty) valid = false;
  });

  if(!valid){
    showFamilyError(menikah
      ? "Data kepala keluarga, pasangan, status pasangan, dan jumlah anak wajib diisi lengkap."
      : "Nama kepala keluarga dan status pernikahan wajib diisi."
    );
    return false;
  }

  showFamilyError("");
  return true;
}

function toggleMarriageFields(){
  const statusMenikah = document.getElementById("statusMenikah");
  if(!statusMenikah) return;

  const menikah = (statusMenikah.value || "menikah") === "menikah";
  document.querySelectorAll(".spouse-field").forEach(el => {
    el.classList.toggle("d-none", !menikah);
  });

  if(!menikah){
    document.getElementById("namaPasangan").value = "";
    document.getElementById("statusPasangan").value = "kerja";
    document.getElementById("jumlahAnak").value = "0";
    ["namaPasangan", "statusPasangan", "jumlahAnak"].forEach(id => setInvalid(document.getElementById(id), false));
  }else if(document.getElementById("jumlahAnak").value === "0"){
    document.getElementById("jumlahAnak").value = "3";
  }
}

function simpanKeluarga(){
  if(!validateFamilyForm()) return;

  const kepala = document.getElementById("namaKepala").value.trim();
  state.statusMenikah = document.getElementById("statusMenikah").value || "menikah";
  const menikah = state.statusMenikah === "menikah";
  const pasangan = menikah ? document.getElementById("namaPasangan").value.trim() : "";
  const jumlahAnak = menikah ? parseInt(document.getElementById("jumlahAnak").value || "0") : 0;
  state.statusPasangan = menikah ? (document.getElementById("statusPasangan").value || "kerja") : "kerja";

  const keluarga = [
    { id:"kepala", nama:kepala, peran: menikah ? "Kepala Keluarga" : "Individu", icon:"bi-person-fill" }
  ];

  if(menikah){
    keluarga.push({ id:"pasangan", nama:pasangan, peran:"Pasangan", icon:"bi-person-heart" });

    for(let i = 1; i <= jumlahAnak; i++){
      const oldChild = state.keluarga.find(x => x.id === `anak${i}`);
      keluarga.push({
        id:`anak${i}`,
        nama: oldChild?.nama || `Anak ${i}`,
        peran:`Anak ${i}`,
        icon:"bi-person-fill"
      });
    }
  }

  const oldPolis = state.polis || {};
  state.keluarga = keluarga;
  state.activeId = state.activeId && keluarga.some(x => x.id === state.activeId) ? state.activeId : "kepala";
  state.polis = oldPolis;

  keluarga.forEach(member => syncMatrixWithTemplate(member.id));

  saveState();
  renderAll();
}

function renderAll(){
  fillFamilyForm();
  renderFamilyList();
  renderMatrix();
  renderSummary();
  toggleBottomActions();
}

function fillFamilyForm(){
  const kepala = state.keluarga.find(x => x.id === "kepala");
  const pasangan = state.keluarga.find(x => x.id === "pasangan");
  const anakCount = state.keluarga.filter(x => x.id.startsWith("anak")).length;

  if(kepala) document.getElementById("namaKepala").value = kepala.nama;
  if(pasangan) document.getElementById("namaPasangan").value = pasangan.nama;
  document.getElementById("statusMenikah").value = state.statusMenikah || "menikah";
  document.getElementById("statusPasangan").value = state.statusPasangan || "kerja";
  document.getElementById("jumlahAnak").value = anakCount || 3;
  toggleMarriageFields();
}

function renderFamilyList(){
  const list = document.getElementById("familyList");

  if(!state.keluarga.length){
    list.innerHTML = `<div class="small-muted">Belum ada data keluarga.</div>`;
    return;
  }

  list.innerHTML = state.keluarga.map((member, index) => {
    const statusInfo = member.id === "pasangan"
      ? `<small>${state.statusPasangan === "kerja" ? "Kerja / Ada income" : "Tidak kerja / tidak ada income"}</small>`
      : "";

    return `
      <div class="member-card ${member.id === state.activeId ? "active" : ""}" onclick="selectMember('${member.id}')">
        <div class="member-icon"><i class="bi ${member.icon}"></i></div>
        <div>
          <h4>${index + 1}. ${member.peran}</h4>
          <p>${member.nama}</p>
          ${statusInfo}
        </div>
      </div>
    `;
  }).join("");
}

function selectMember(id){
  state.activeId = id;
  syncMatrixWithTemplate(id);
  saveState();
  renderAll();
}

function getActiveMember(){
  return state.keluarga.find(x => x.id === state.activeId);
}

function getActiveMatrix(){
  if(!state.activeId) return [];
  syncMatrixWithTemplate(state.activeId);
  return state.polis[state.activeId];
}

function namaUrutanAnak(nomor){
  const daftar = ["PERTAMA", "KEDUA", "KETIGA", "KEEMPAT", "KELIMA"];
  return daftar[nomor - 1] || `KE-${nomor}`;
}

function getMemberNumber(active){
  if(!active) return "INSURANCE MATRIX";
  if(active.id === "kepala") return state.statusMenikah === "belum_menikah" ? "1. INDIVIDU" : "1. KEPALA KELUARGA";
  if(active.id === "pasangan") return "2. PASANGAN";
  const nomorAnak = parseInt(active.id.replace("anak", ""));
  return `${nomorAnak}. ANAK ${namaUrutanAnak(nomorAnak)}`;
}

function renderMatrix(){
  const active = getActiveMember();
  const body = document.getElementById("matrixBody");

  if(!active){
    document.getElementById("memberMatrixLabel").textContent = "REVIEW POLIS";
    document.getElementById("matrixName").value = "";
    body.innerHTML = `<tr><td colspan="10" class="text-center text-muted py-4">Silakan isi dan simpan data keluarga terlebih dahulu.</td></tr>`;
    return;
  }

  document.getElementById("memberMatrixLabel").textContent = getMemberNumber(active);
  document.getElementById("matrixName").value = active.nama;
  const sheet = document.querySelector(".matrix-sheet");
  sheet.classList.remove("pasangan-sheet", "anak1-sheet", "anak2-sheet", "anak3-sheet", "anak4-sheet", "anak5-sheet");
  if(active.id === "pasangan") sheet.classList.add("pasangan-sheet");
  if(active.id.startsWith("anak")) sheet.classList.add(`${active.id}-sheet`);

  const matrix = getActiveMatrix();
  body.innerHTML = matrix.map((row, index) => `
    <tr>
      <td class="status-cell"><div class="status-band ${row.warna}"></div></td>
      <td class="row-no">${index + 1}</td>
      <td class="row-category">${row.kategori}</td>
      <td class="row-function">${row.fungsi}</td>
      <td class="text-center">${row.punya === "ya" ? row.brand || "-" : "-"}</td>
      <td class="text-center">${row.punya === "ya" ? row.produk || "-" : "-"}</td>
      <td class="text-center">${row.punya === "ya" ? row.manfaat || "-" : "-"}</td>
      <td class="check-cell">
        ${row.punya === "ya" ? `<span class="status-pill pill-owned"><i class="bi bi-check-circle-fill"></i> Sudah</span>` : `<span class="status-pill pill-none"><i class="bi bi-x-circle-fill"></i> Belum</span>`}
      </td>
      <td class="text-center">
        ${row.catatan || "-"}
        ${row.premi ? `<div class="small-muted">Premi: ${row.premi}</div>` : ""}
        ${row.masa ? `<div class="small-muted">Masa: ${row.masa}</div>` : ""}
      </td>
      <td class="text-center"><button class="edit-btn" onclick="openModal(${index})"><i class="bi bi-pencil-square"></i> Edit</button></td>
    </tr>
  `).join("");
}

function getCategorySummary(matrix, warna){
  const rows = matrix.filter(row => row.warna === warna);
  const owned = rows.filter(row => row.punya === "ya").length;
  const total = rows.length;
  const percent = total ? Math.round((owned / total) * 100) : 0;
  return { owned, total, percent };
}

function setSummaryCard(id, textId, summary){
  const main = document.getElementById(id);
  const text = document.getElementById(textId);
  if(main) main.textContent = `${summary.owned}/${summary.total}`;
  if(text) text.textContent = `${summary.percent}% terpenuhi`;
}

function renderSummary(){
  const matrix = getActiveMatrix();

  setSummaryCard("sumWajib", "sumWajibText", getCategorySummary(matrix, "red"));
  setSummaryCard("sumKebutuhan", "sumKebutuhanText", getCategorySummary(matrix, "green"));
  setSummaryCard("sumDistribusi", "sumDistribusiText", getCategorySummary(matrix, "yellow"));
  setSummaryCard("sumAkumulasi", "sumAkumulasiText", getCategorySummary(matrix, "blue"));
}

function toggleBottomActions(){
  const actions = document.getElementById("bottomActions");
  if(!actions) return;
  actions.classList.toggle("d-none", !state.keluarga.length);
}

function openModal(index){
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

function closeModal(){
  document.getElementById("editModal").style.display = "none";
}

function savePolicy(){
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

function updateCurrentName(value){
  const active = getActiveMember();
  if(!active) return;
  active.nama = value.trim() || active.peran;
  saveState();
  renderFamilyList();
}

function resetReview(){
  if(!confirm("Reset semua data review polis?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = { keluarga: [], activeId: null, statusMenikah:"menikah", statusPasangan:"kerja", polis: {} };
  document.getElementById("namaKepala").value = "";
  document.getElementById("statusMenikah").value = "menikah";
  document.getElementById("namaPasangan").value = "";
  document.getElementById("statusPasangan").value = "kerja";
  document.getElementById("jumlahAnak").value = "3";
  toggleMarriageFields();
  renderAll();
}

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderAll();
  toggleMarriageFields();

  ["namaKepala", "statusMenikah", "namaPasangan", "statusPasangan", "jumlahAnak"].forEach(id => {
    const el = document.getElementById(id);
    if(el){
      el.addEventListener("input", () => {
        setInvalid(el, !String(el.value || "").trim());
        showFamilyError("");
      });
      el.addEventListener("change", () => {
        if(id === "statusMenikah") toggleMarriageFields();
        setInvalid(el, !String(el.value || "").trim());
        showFamilyError("");
      });
    }
  });
});
