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
  renderCTA();
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

function getFamilyReviewStats(){
  let total = 0;
  let owned = 0;
  let missing = 0;
  let wajibTotal = 0;
  let wajibMissing = 0;
  const missingRows = [];

  state.keluarga.forEach(member => {
    syncMatrixWithTemplate(member.id);
    const matrix = state.polis[member.id] || [];

    matrix.forEach(row => {
      total++;
      if(row.punya === "ya"){
        owned++;
      }else{
        missing++;
        missingRows.push({ member, row });
        if(row.warna === "red") wajibMissing++;
      }
      if(row.warna === "red") wajibTotal++;
    });
  });

  const score = total ? Math.round((owned / total) * 100) : 0;
  const wajibScore = wajibTotal ? Math.round(((wajibTotal - wajibMissing) / wajibTotal) * 100) : 0;

  return { total, owned, missing, wajibTotal, wajibMissing, score, wajibScore, missingRows };
}

function getCTAStatus(score){
  if(score >= 85){
    return {
      title:"Proteksi Keluarga Sangat Baik",
      desc:"Sebagian besar kebutuhan proteksi sudah tersedia. Tetap lakukan review tahunan agar manfaat polis selalu sesuai dengan tujuan keuangan keluarga."
    };
  }
  if(score >= 60){
    return {
      title:"Proteksi Cukup Baik, Masih Ada Gap",
      desc:"Beberapa area proteksi masih perlu disempurnakan. Prioritaskan perlindungan wajib terlebih dahulu sebelum masuk ke kebutuhan tambahan."
    };
  }
  return {
    title:"Perlu Review Polis Lebih Serius",
    desc:"Masih banyak area proteksi yang belum lengkap. Segera susun prioritas agar risiko besar tidak mengganggu kondisi keuangan keluarga."
  };
}

function renderCTA(){
  if(!state.keluarga.length) return;

  const stats = getFamilyReviewStats();
  const status = getCTAStatus(stats.score);

  const ctaTitle = document.getElementById("ctaTitle");
  const ctaDescription = document.getElementById("ctaDescription");
  const ctaScore = document.getElementById("ctaScore");
  const ctaProgressBar = document.getElementById("ctaProgressBar");
  const ctaOwned = document.getElementById("ctaOwned");
  const ctaMissing = document.getElementById("ctaMissing");
  const ctaPriority = document.getElementById("ctaPriority");
  const list = document.getElementById("ctaRecommendationList");

  if(ctaTitle) ctaTitle.textContent = status.title;
  if(ctaDescription) ctaDescription.textContent = status.desc;
  if(ctaScore) ctaScore.textContent = `${stats.score}%`;
  if(ctaProgressBar) ctaProgressBar.style.width = `${stats.score}%`;
  if(ctaOwned) ctaOwned.textContent = stats.owned;
  if(ctaMissing) ctaMissing.textContent = stats.missing;
  if(ctaPriority) ctaPriority.textContent = stats.wajibMissing;

  if(list){
    const priority = stats.missingRows
      .filter(item => item.row.warna === "red")
      .slice(0, 5);

    if(priority.length){
      list.innerHTML = priority.map(item => `
        <li>
          <strong>${item.member.nama}</strong> — ${item.row.kategori}<br>
          <small>${item.row.fungsi}</small>
        </li>
      `).join("");
    }else if(stats.missing > 0){
      list.innerHTML = `
        <li>
          Proteksi wajib sudah lengkap. Lanjut review bagian sesuai kebutuhan, distribusi kekayaan, dan fungsi akumulasi.
        </li>
      `;
    }else{
      list.innerHTML = `
        <li>
          Semua item dalam matrix sudah terisi. Lakukan review tahunan untuk memastikan manfaat polis tetap relevan.
        </li>
      `;
    }
  }
}

function konsultasiReviewWhatsApp(){
  const kepala = state.keluarga.find(x => x.id === "kepala");
  const stats = getFamilyReviewStats();
  const nama = kepala?.nama || "";
  const message = `Halo Ko Septino, saya ingin konsultasi Review Polis Cerdas Finansial.%0A%0ANama: ${encodeURIComponent(nama)}%0ASkor Review: ${stats.score}%25%0ABelum Dimiliki: ${stats.missing}%0APrioritas Wajib: ${stats.wajibMissing}%0A%0AMohon bantu review polis keluarga saya.`;
  window.open(`https://wa.me/628116946999?text=${message}`, "_blank");
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


/* v14: Export PDF keluarga langsung download, tidak lewat printer */
function escapeHtml(value){
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function rupiahOrDash(value){
  const text = String(value || "").trim();
  return text || "-";
}

function safePdfText(value){
  return String(value ?? "-").replace(/\s+/g, " ").trim() || "-";
}

function getPdfFileName(){
  const kepala = state.keluarga.find(x => x.id === "kepala");
  const nama = (kepala?.nama || "Keluarga").replace(/[^a-z0-9\s-]/gi, "").trim() || "Keluarga";
  return `Insurance Matrix - ${nama}.pdf`;
}

async function getLogoDataUrl(){
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try{
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      }catch(err){
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = "../asset/logo-cerdas-finansial.png";
  });
}

function addPdfFooter(doc, pageNo){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(220, 228, 238);
  doc.setLineWidth(0.2);
  doc.line(10, pageHeight - 9, pageWidth - 10, pageHeight - 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Cerdas Finansial | Insurance Matrix Report", 10, pageHeight - 5);
  doc.text(`Halaman ${pageNo}`, pageWidth - 10, pageHeight - 5, { align:"right" });
}

function addLogoToPdf(doc, logoDataUrl, x, y, w, h){
  if(!logoDataUrl) return;
  try{
    doc.addImage(logoDataUrl, "PNG", x, y, w, h, undefined, "FAST");
  }catch(err){
    // Logo dilewati jika browser membatasi canvas/CORS.
  }
}

function drawSummaryBox(doc, x, y, w, title, value, subtitle, color){
  doc.setFillColor(255,255,255);
  doc.setDrawColor(224,232,240);
  doc.roundedRect(x, y, w, 17, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(100,116,139);
  doc.text(title, x + 3, y + 5);
  doc.setFontSize(13);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(value, x + 3, y + 11.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(100,116,139);
  doc.text(subtitle, x + 3, y + 15);
}

function addCoverPage(doc, logoDataUrl){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const kepala = state.keluarga.find(x => x.id === "kepala");
  const pasangan = state.keluarga.find(x => x.id === "pasangan");
  const jumlahAnak = state.keluarga.filter(x => x.id.startsWith("anak")).length;
  const tanggal = new Date().toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric" });

  doc.setFillColor(248,252,255);
  doc.rect(0,0,pageWidth,pageHeight,"F");
  doc.setFillColor(235,244,250);
  doc.circle(25, 25, 42, "F");
  doc.setFillColor(245,231,204);
  doc.circle(pageWidth - 20, pageHeight - 15, 45, "F");

  addLogoToPdf(doc, logoDataUrl, pageWidth/2 - 36, 25, 72, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(180, 0, 0);
  doc.text("INSURANCE MATRIX", pageWidth/2, 84, { align:"center" });
  doc.setFontSize(14);
  doc.setTextColor(11,60,93);
  doc.text("Laporan Review Polis Keluarga", pageWidth/2, 96, { align:"center" });

  const cardX = 34, cardY = 113, cardW = pageWidth - 68, cardH = 48;
  doc.setFillColor(255,255,255);
  doc.setDrawColor(220,232,242);
  doc.roundedRect(cardX, cardY, cardW, cardH, 5, 5, "FD");

  const infos = [
    ["Kepala Keluarga", kepala?.nama || "-"],
    ["Status", state.statusMenikah === "menikah" ? "Sudah Menikah" : "Belum Menikah"],
    ["Pasangan", pasangan?.nama || "-"],
    ["Jumlah Anak", String(jumlahAnak)],
    ["Tanggal Review", tanggal]
  ];

  const colW = cardW / infos.length;
  infos.forEach((item, i) => {
    const x = cardX + i * colW;
    if(i > 0){
      doc.setDrawColor(226,232,240);
      doc.line(x, cardY + 8, x, cardY + cardH - 8);
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100,116,139);
    doc.text(item[0], x + colW/2, cardY + 18, { align:"center" });
    doc.setFontSize(11);
    doc.setTextColor(11,60,93);
    doc.text(safePdfText(item[1]), x + colW/2, cardY + 31, { align:"center", maxWidth: colW - 8 });
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100,116,139);
  doc.text("Dokumen ini membantu keluarga melihat kelengkapan polis, fungsi perlindungan, dan area yang perlu ditinjau kembali setiap tahun.", pageWidth/2, 177, { align:"center", maxWidth: pageWidth - 60 });
  addPdfFooter(doc, 1);
}

function addMemberPage(doc, member, logoDataUrl, pageNo){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  syncMatrixWithTemplate(member.id);
  const matrix = state.polis[member.id] || [];

  doc.setFillColor(255,255,255);
  doc.rect(0,0,pageWidth,pageHeight,"F");

  const barColor = member.id === "anak1" ? [0, 166, 81] : member.id === "anak2" ? [0, 139, 210] : member.id === "anak3" ? [107,42,143] : [192,0,0];
  doc.setFillColor(...barColor);
  doc.roundedRect(10, 9, pageWidth - 20, 18, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255,255,255);
  doc.text(getMemberNumber(member), 14, 21);
  doc.setFontSize(10);
  doc.text("Nama:", pageWidth - 76, 21);
  doc.setFillColor(255,255,255);
  doc.roundedRect(pageWidth - 62, 13, 49, 10, 2, 2, "F");
  doc.setFontSize(9);
  doc.setTextColor(20,24,31);
  doc.text(safePdfText(member.nama), pageWidth - 38, 20, { align:"center", maxWidth:46 });

  const legendY = 34;
  const legend = [
    [[224,0,0], "Wajib Dimiliki"],
    [[0,166,81], "Sesuai Kebutuhan / Tidak Wajib"],
    [[255,214,0], "Distribusi Kekayaan"],
    [[0,139,210], "Fungsi Akumulasi"]
  ];
  legend.forEach((item, i) => {
    const x = 11 + (i * 58);
    doc.setFillColor(...item[0]);
    doc.roundedRect(x, legendY, 8, 5, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(17,24,39);
    doc.text(item[1], x + 10, legendY + 4);
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(180,0,0);
  doc.text("INSURANCE MATRIX", pageWidth/2, 49, { align:"center" });
  addLogoToPdf(doc, logoDataUrl, pageWidth - 55, 30, 42, 24);

  const wajib = getCategorySummary(matrix, "red");
  const kebutuhan = getCategorySummary(matrix, "green");
  const distribusi = getCategorySummary(matrix, "yellow");
  const akumulasi = getCategorySummary(matrix, "blue");
  const sumY = 55;
  const boxW = (pageWidth - 24 - 9) / 4;
  drawSummaryBox(doc, 10, sumY, boxW, "Wajib Dimiliki", `${wajib.owned}/${wajib.total}`, `${wajib.percent}% terpenuhi`, [180,0,0]);
  drawSummaryBox(doc, 10 + (boxW + 3), sumY, boxW, "Sesuai Kebutuhan", `${kebutuhan.owned}/${kebutuhan.total}`, `${kebutuhan.percent}% terpenuhi`, [0,128,61]);
  drawSummaryBox(doc, 10 + (boxW + 3)*2, sumY, boxW, "Distribusi Kekayaan", `${distribusi.owned}/${distribusi.total}`, `${distribusi.percent}% terpenuhi`, [160,118,0]);
  drawSummaryBox(doc, 10 + (boxW + 3)*3, sumY, boxW, "Fungsi Akumulasi", `${akumulasi.owned}/${akumulasi.total}`, `${akumulasi.percent}% terpenuhi`, [0,105,180]);

  const body = matrix.map((row, index) => [
    { content:"", styles:{ fillColor: row.warna === "red" ? [224,0,0] : row.warna === "green" ? [0,166,81] : row.warna === "yellow" ? [255,214,0] : [0,139,210] } },
    String(index + 1),
    safePdfText(row.kategori),
    safePdfText(row.fungsi),
    row.punya === "ya" ? safePdfText(row.brand || "-") : "-",
    row.punya === "ya" ? safePdfText(row.produk || "-") : "-",
    row.punya === "ya" ? safePdfText(row.manfaat || "-") : "-",
    row.punya === "ya" ? "Sudah" : "Belum",
    safePdfText([row.catatan, row.premi ? `Premi: ${row.premi}` : "", row.masa ? `Masa: ${row.masa}` : ""].filter(Boolean).join(" | ") || "-")
  ]);

  doc.autoTable({
    startY: 76,
    margin: { left:10, right:10, bottom:14 },
    tableWidth: pageWidth - 20,
    head: [["Status", "No", "Kategori", "Fungsi Keuangan", "Brand", "Jenis Produk Dasar", "Manfaat", "Tidak Punya", "Keterangan Tambahan"]],
    body,
    theme: "grid",
    rowPageBreak: "avoid",
    pageBreak: "avoid",
    styles: {
      font: "helvetica",
      fontSize: 6.7,
      cellPadding: 1.35,
      overflow: "linebreak",
      valign: "middle",
      lineColor: [230, 90, 90],
      lineWidth: 0.12,
      textColor: [17,24,39]
    },
    headStyles: {
      fillColor: [255,245,245],
      textColor: [17,24,39],
      fontStyle: "bold",
      halign: "center",
      fontSize: 6.8
    },
    columnStyles: {
      0: { cellWidth: 11, halign:"center" },
      1: { cellWidth: 8, halign:"center", fontStyle:"bold" },
      2: { cellWidth: 38, fontStyle:"bold" },
      3: { cellWidth: 45, fontStyle:"bold" },
      4: { cellWidth: 28, halign:"center" },
      5: { cellWidth: 34, halign:"center" },
      6: { cellWidth: 35, halign:"center" },
      7: { cellWidth: 20, halign:"center" },
      8: { cellWidth: pageWidth - 20 - 11 - 8 - 38 - 45 - 28 - 34 - 35 - 20 }
    },
    didParseCell: function(data){
      if(data.section === "body" && [2,3].includes(data.column.index)){
        data.cell.styles.fontStyle = "bold";
      }
      if(data.section === "body" && data.column.index === 7){
        const txt = String(data.cell.raw || "");
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = txt === "Sudah" ? [0,120,58] : [190,0,0];
        data.cell.styles.fillColor = txt === "Sudah" ? [232,247,238] : [255,240,240];
      }
    }
  });

  const noteY = Math.min((doc.lastAutoTable?.finalY || 165) + 5, pageHeight - 20);
  doc.setFillColor(255,240,240);
  doc.setDrawColor(255,210,210);
  doc.roundedRect(10, noteY, pageWidth - 20, 9, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(192,0,0);
  doc.text("Table ini harus di-review kembali setiap tahun agar manfaat polis masih sesuai dengan fungsi dan tujuan keuangan.", pageWidth/2, noteY + 5.8, { align:"center" });
  addPdfFooter(doc, pageNo);
}


function addCTAPage(doc, logoDataUrl, pageNo){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const stats = getFamilyReviewStats();
  const status = getCTAStatus(stats.score);
  const priority = stats.missingRows.filter(item => item.row.warna === "red").slice(0, 8);

  doc.setFillColor(248,252,255);
  doc.rect(0,0,pageWidth,pageHeight,"F");
  doc.setFillColor(235,244,250);
  doc.circle(18, 20, 36, "F");
  doc.setFillColor(245,231,204);
  doc.circle(pageWidth - 18, pageHeight - 12, 42, "F");

  addLogoToPdf(doc, logoDataUrl, 10, 8, 42, 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(180,0,0);
  doc.text("RINGKASAN & REKOMENDASI", pageWidth/2, 22, { align:"center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(11,60,93);
  doc.text(safePdfText(status.title), pageWidth/2, 36, { align:"center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(71,85,105);
  doc.text(safePdfText(status.desc), pageWidth/2, 45, { align:"center", maxWidth: pageWidth - 56 });

  const scoreX = 24, scoreY = 60, scoreW = 70, scoreH = 70;
  doc.setFillColor(255,255,255);
  doc.setDrawColor(220,232,242);
  doc.roundedRect(scoreX, scoreY, scoreW, scoreH, 5, 5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100,116,139);
  doc.text("SKOR KESIAPAN", scoreX + scoreW/2, scoreY + 14, { align:"center" });
  doc.setFontSize(31);
  doc.setTextColor(46,139,87);
  doc.text(`${stats.score}%`, scoreX + scoreW/2, scoreY + 39, { align:"center" });
  doc.setFillColor(226,232,240);
  doc.roundedRect(scoreX + 12, scoreY + 50, scoreW - 24, 5, 2, 2, "F");
  doc.setFillColor(46,139,87);
  doc.roundedRect(scoreX + 12, scoreY + 50, (scoreW - 24) * stats.score / 100, 5, 2, 2, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100,116,139);
  doc.text("Semakin tinggi skor, semakin lengkap proteksi keluarga.", scoreX + scoreW/2, scoreY + 63, { align:"center", maxWidth: scoreW - 12 });

  const gapX = 105, gapY = 60, gapW = pageWidth - 129, gapH = 70;
  doc.setFillColor(255,255,255);
  doc.setDrawColor(220,232,242);
  doc.roundedRect(gapX, gapY, gapW, gapH, 5, 5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(11,60,93);
  doc.text("Ringkasan GAP Keluarga", gapX + 6, gapY + 12);

  const statCards = [
    ["Sudah Punya", String(stats.owned), [46,139,87]],
    ["Belum Punya", String(stats.missing), [190,0,0]],
    ["Prioritas Wajib", String(stats.wajibMissing), [224,0,0]],
    ["Total Item", String(stats.total), [11,60,93]]
  ];
  const cW = (gapW - 18) / 4;
  statCards.forEach((c, i) => {
    const x = gapX + 6 + i * cW;
    doc.setFillColor(248,250,252);
    doc.setDrawColor(226,232,240);
    doc.roundedRect(x, gapY + 20, cW - 4, 32, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(100,116,139);
    doc.text(c[0], x + (cW - 4)/2, gapY + 30, { align:"center" });
    doc.setFontSize(18);
    doc.setTextColor(c[2][0], c[2][1], c[2][2]);
    doc.text(c[1], x + (cW - 4)/2, gapY + 44, { align:"center" });
  });

  const recX = 24, recY = 145, recW = pageWidth - 48, recH = 42;
  doc.setFillColor(255,255,255);
  doc.setDrawColor(220,232,242);
  doc.roundedRect(recX, recY, recW, recH, 5, 5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(11,60,93);
  doc.text("Rekomendasi Prioritas", recX + 6, recY + 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.6);
  doc.setTextColor(71,85,105);

  if(priority.length){
    const lines = priority.map((item, idx) => `${idx+1}. ${item.member.nama} - ${item.row.kategori} (${item.row.fungsi})`);
    doc.text(lines.map(safePdfText), recX + 7, recY + 20, { maxWidth: recW - 14, lineHeightFactor: 1.35 });
  }else if(stats.missing > 0){
    doc.text("Proteksi wajib sudah lengkap. Lanjut review bagian sesuai kebutuhan, distribusi kekayaan, dan fungsi akumulasi.", recX + 7, recY + 21, { maxWidth: recW - 14 });
  }else{
    doc.text("Semua item matrix sudah terisi. Lakukan review tahunan agar manfaat polis tetap relevan dengan tujuan keuangan keluarga.", recX + 7, recY + 21, { maxWidth: recW - 14 });
  }

  doc.setFillColor(11,60,93);
  doc.roundedRect(24, 135, pageWidth - 48, 0.1, 0, 0, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(180,0,0);
  doc.text("Langkah Berikutnya", 24, 138);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.setTextColor(71,85,105);
  doc.text("Diskusikan hasil review ini untuk memastikan manfaat polis, UP, limit kesehatan, dan rencana dana masa depan sudah sesuai kebutuhan keluarga.", 72, 138, { maxWidth: pageWidth - 96 });

  addPdfFooter(doc, pageNo);
}

async function exportFamilyPDF(){
  if(!state.keluarga.length){
    showFamilyError("Isi dan simpan data keluarga terlebih dahulu sebelum export PDF.");
    window.scrollTo({ top:0, behavior:"smooth" });
    return;
  }

  if(!window.jspdf || !window.jspdf.jsPDF){
    alert("Library PDF belum berhasil dimuat. Pastikan koneksi internet aktif, lalu refresh halaman.");
    return;
  }

  state.keluarga.forEach(member => syncMatrixWithTemplate(member.id));
  saveState();

  const btn = document.querySelector(".btn-export-pdf");
  const oldText = btn ? btn.innerHTML : "";
  if(btn){
    btn.disabled = true;
    btn.innerHTML = `<i class="bi bi-hourglass-split"></i> Membuat PDF...`;
  }

  try{
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:"landscape", unit:"mm", format:"a4", compress:true });
    const logoDataUrl = await getLogoDataUrl();

    addCoverPage(doc, logoDataUrl);
    let pageNo = 2;
    state.keluarga.forEach(member => {
      doc.addPage("a4", "landscape");
      addMemberPage(doc, member, logoDataUrl, pageNo);
      pageNo++;
    });

    doc.addPage("a4", "landscape");
    addCTAPage(doc, logoDataUrl, pageNo);

    doc.save(getPdfFileName());
  }catch(err){
    console.error(err);
    alert("PDF belum berhasil dibuat. Coba refresh halaman lalu export ulang.");
  }finally{
    if(btn){
      btn.disabled = false;
      btn.innerHTML = oldText;
    }
  }
}
