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

function hitungUsia(tanggalLahir){
  if(!tanggalLahir) return "";
  const lahir = new Date(tanggalLahir + "T00:00:00");
  if(Number.isNaN(lahir.getTime())) return "";

  const hariIni = new Date();
  let tahun = hariIni.getFullYear() - lahir.getFullYear();
  let bulan = hariIni.getMonth() - lahir.getMonth();

  if(hariIni.getDate() < lahir.getDate()) bulan--;
  if(bulan < 0){
    tahun--;
    bulan += 12;
  }

  if(tahun <= 0){
    return bulan <= 0 ? "0 Bulan" : `${bulan} Bulan`;
  }

  return bulan > 0 ? `${tahun} Tahun ${bulan} Bulan` : `${tahun} Tahun`;
}

function memberAgeText(member){
  const usia = hitungUsia(member?.tglLahir);
  return usia ? `<small>${usia}</small>` : "";
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

function renderChildNameInputs(){
  const box = document.getElementById("childrenNameBox");
  const statusMenikah = document.getElementById("statusMenikah");
  const jumlahAnakEl = document.getElementById("jumlahAnak");
  if(!box || !statusMenikah || !jumlahAnakEl) return;

  const menikah = (statusMenikah.value || "menikah") === "menikah";
  const jumlahAnak = menikah ? parseInt(jumlahAnakEl.value || "0") : 0;

  if(!menikah || jumlahAnak <= 0){
    box.innerHTML = "";
    box.classList.add("d-none");
    return;
  }

  const old = {};
  box.querySelectorAll("[data-child-index]").forEach(input => {
    const idx = input.dataset.childIndex;
    old[idx] = old[idx] || {};
    old[idx][input.dataset.childField] = input.value;
  });

  const html = [];
  html.push(`
    <div class="children-name-title">
      <div><i class="bi bi-people-fill"></i> Data Anak</div>
      <small>Nama, tanggal lahir, dan jenis kelamin anak akan dipakai otomatis di semua modul.</small>
    </div>
    <div class="children-name-grid children-detail-grid">
  `);

  for(let i = 1; i <= jumlahAnak; i++){
    const savedChild = state.keluarga.find(member => member.id === `anak${i}`) || {};
    const nama = old[i]?.nama ?? savedChild.nama ?? "";
    const tgl = old[i]?.tglLahir ?? savedChild.tglLahir ?? "";
    const jk = old[i]?.jenisKelamin ?? savedChild.jenisKelamin ?? "laki";

    html.push(`
      <div class="child-detail-card">
        <div class="child-card-title"><i class="bi bi-person-heart"></i> Anak ${i}</div>
        <div class="child-fields">
          <div class="child-name-field">
            <label class="form-label">Nama Anak ${i}</label>
            <input type="text" id="namaAnakReview${i}" data-child-index="${i}" data-child-field="nama" class="form-control" value="${escapeHtml(nama)}" placeholder="Contoh: Rae">
          </div>
          <div class="child-name-field">
            <label class="form-label">Tanggal Lahir</label>
            <input type="date" id="tglLahirAnakReview${i}" data-child-index="${i}" data-child-field="tglLahir" class="form-control" value="${escapeHtml(tgl)}">
          </div>
          <div class="child-name-field">
            <label class="form-label">Jenis Kelamin</label>
            <select id="jenisKelaminAnakReview${i}" data-child-index="${i}" data-child-field="jenisKelamin" class="form-select">
              <option value="laki" ${jk === "laki" ? "selected" : ""}>Laki-laki</option>
              <option value="perempuan" ${jk === "perempuan" ? "selected" : ""}>Perempuan</option>
            </select>
          </div>
        </div>
      </div>
    `);
  }

  html.push(`</div>`);
  box.innerHTML = html.join("");
  box.classList.remove("d-none");

  box.querySelectorAll("input[data-child-index], select[data-child-index]").forEach(input => {
    input.addEventListener("input", () => {
      setInvalid(input, !String(input.value || "").trim());
      showFamilyError("");
    });
    input.addEventListener("change", () => {
      setInvalid(input, !String(input.value || "").trim());
      showFamilyError("");
    });
  });
}

function validateFamilyForm(){
  const namaKepala = document.getElementById("namaKepala");
  const tglLahirKepala = document.getElementById("tglLahirKepala");
  const statusMenikah = document.getElementById("statusMenikah");
  const namaPasangan = document.getElementById("namaPasangan");
  const tglLahirPasangan = document.getElementById("tglLahirPasangan");
  const statusPasangan = document.getElementById("statusPasangan");
  const jumlahAnak = document.getElementById("jumlahAnak");

  const menikah = (statusMenikah.value || "menikah") === "menikah";
  const fields = menikah
    ? [namaKepala, tglLahirKepala, statusMenikah, namaPasangan, tglLahirPasangan, statusPasangan, jumlahAnak]
    : [namaKepala, tglLahirKepala, statusMenikah];

  [namaKepala, tglLahirKepala, statusMenikah, namaPasangan, tglLahirPasangan, statusPasangan, jumlahAnak].forEach(field => setInvalid(field, false));
  document.querySelectorAll("#childrenNameBox input, #childrenNameBox select").forEach(field => setInvalid(field, false));

  let valid = true;
  fields.forEach(field => {
    const empty = !String(field.value || "").trim();
    setInvalid(field, empty);
    if(empty) valid = false;
  });

  if(menikah){
    const totalAnak = parseInt(jumlahAnak.value || "0");
    for(let i = 1; i <= totalAnak; i++){
      const inputAnak = document.getElementById(`namaAnakReview${i}`);
      const tglAnak = document.getElementById(`tglLahirAnakReview${i}`);
      const jkAnak = document.getElementById(`jenisKelaminAnakReview${i}`);
      [inputAnak, tglAnak, jkAnak].forEach(field => {
        const empty = !String(field?.value || "").trim();
        setInvalid(field, empty);
        if(empty) valid = false;
      });
    }
  }

  if(!valid){
    showFamilyError(menikah
      ? "Data kepala keluarga, pasangan, jumlah anak, nama anak, tanggal lahir anak, dan jenis kelamin wajib diisi lengkap."
      : "Nama kepala keluarga, tanggal lahir, dan status pernikahan wajib diisi."
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
    document.getElementById("tglLahirPasangan").value = "";
    document.getElementById("statusPasangan").value = "kerja";
    document.getElementById("jumlahAnak").value = "0";
    ["namaPasangan", "tglLahirPasangan", "statusPasangan", "jumlahAnak"].forEach(id => setInvalid(document.getElementById(id), false));
  }else if(document.getElementById("jumlahAnak").value === "0"){
    document.getElementById("jumlahAnak").value = "3";
  }

  renderChildNameInputs();
}

function simpanKeluarga(){
  if(!validateFamilyForm()) return;

  const kepala = document.getElementById("namaKepala").value.trim();
  const tglLahirKepala = document.getElementById("tglLahirKepala").value;
  state.statusMenikah = document.getElementById("statusMenikah").value || "menikah";
  const menikah = state.statusMenikah === "menikah";
  const pasangan = menikah ? document.getElementById("namaPasangan").value.trim() : "";
  const tglLahirPasangan = menikah ? document.getElementById("tglLahirPasangan").value : "";
  const jumlahAnak = menikah ? parseInt(document.getElementById("jumlahAnak").value || "0") : 0;
  state.statusPasangan = menikah ? (document.getElementById("statusPasangan").value || "kerja") : "kerja";

  const keluarga = [
    { id:"kepala", nama:kepala, tglLahir:tglLahirKepala, jenisKelamin:"laki", peran: menikah ? "Kepala Keluarga" : "Individu", icon:"bi-person-fill" }
  ];

  if(menikah){
    keluarga.push({ id:"pasangan", nama:pasangan, tglLahir:tglLahirPasangan, jenisKelamin:"perempuan", peran:"Pasangan", icon:"bi-person-heart" });

    for(let i = 1; i <= jumlahAnak; i++){
      const inputAnak = document.getElementById(`namaAnakReview${i}`);
      const tglAnak = document.getElementById(`tglLahirAnakReview${i}`);
      const jkAnak = document.getElementById(`jenisKelaminAnakReview${i}`);
      const namaAnak = String(inputAnak?.value || "").trim();
      const jenisKelamin = String(jkAnak?.value || "laki");
      keluarga.push({
        id:`anak${i}`,
        nama: namaAnak || `Anak ${i}`,
        tglLahir: String(tglAnak?.value || ""),
        jenisKelamin,
        peran:`Anak ${i}`,
        icon: jenisKelamin === "perempuan" ? "bi-person-fill" : "bi-person-fill"
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

  if(kepala){
    document.getElementById("namaKepala").value = kepala.nama || "";
    document.getElementById("tglLahirKepala").value = kepala.tglLahir || "";
  }
  if(pasangan){
    document.getElementById("namaPasangan").value = pasangan.nama || "";
    document.getElementById("tglLahirPasangan").value = pasangan.tglLahir || "";
  }
  document.getElementById("statusMenikah").value = state.statusMenikah || "menikah";
  document.getElementById("statusPasangan").value = state.statusPasangan || "kerja";
  document.getElementById("jumlahAnak").value = anakCount || 3;
  toggleMarriageFields();
  renderChildNameInputs();
}

function renderFamilyList(){
  const list = document.getElementById("familyList");

  if(!state.keluarga.length){
    list.innerHTML = `<div class="small-muted">Belum ada data keluarga.</div>`;
    return;
  }

  list.innerHTML = state.keluarga.map((member, index) => {
    const ageInfo = memberAgeText(member);
    const statusInfo = member.id === "pasangan"
      ? `<small>${state.statusPasangan === "kerja" ? "Kerja / Ada income" : "Tidak kerja / tidak ada income"}</small>`
      : "";

    return `
      <div class="member-card ${member.id === state.activeId ? "active" : ""}" onclick="selectMember('${member.id}')">
        <div class="member-icon"><i class="bi ${member.icon}"></i></div>
        <div>
          <h4>${index + 1}. ${member.peran}</h4>
          <p>${member.nama}</p>
          ${ageInfo}
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


function getPolicyPriorityLevel(row){
  if(row.punya === "ya") return "Sudah Memadai";
  if(row.warna === "red") return "Prioritas Utama";
  if(row.warna === "green") return "Prioritas Sekunder";
  if(row.warna === "yellow") return "Tahap Pengembangan";
  return "Jangka Panjang";
}

function getPolicyStatusText(row){
  if(row.punya === "ya") return "Sudah Dimiliki";
  return "Belum Dimiliki";
}

function getPolicyReason(row){
  const kategori = String(row.kategori || "").toLowerCase();
  const fungsi = String(row.fungsi || "").toLowerCase();

  if(kategori.includes("kesehatan")){
    return "Melindungi aset keluarga dari risiko biaya rumah sakit.";
  }
  if(kategori.includes("penyakit kritis")){
    return "Menjaga stabilitas keuangan saat terjadi penyakit serius.";
  }
  if(kategori.includes("pendidikan") || fungsi.includes("pendidikan")){
    return "Mempersiapkan biaya pendidikan anak agar tujuan pendidikan tetap berjalan.";
  }
  if(kategori.includes("jiwa") && fungsi.includes("income")){
    return "Melindungi biaya hidup keluarga jika pencari nafkah meninggal dunia.";
  }
  if(fungsi.includes("pensiun")){
    return "Membantu menjaga kesiapan dana dan income keluarga di masa pensiun.";
  }
  if(fungsi.includes("hutang")){
    return "Mencegah hutang menjadi beban keluarga jika terjadi risiko pada pencari nafkah.";
  }
  if(fungsi.includes("pemakaman")){
    return "Menyiapkan biaya akhir agar keluarga tidak terbebani secara mendadak.";
  }
  return "Termasuk perlindungan wajib yang perlu diprioritaskan sesuai kondisi keluarga.";
}

function getPolicyRecommendation(row){
  const level = getPolicyPriorityLevel(row);
  if(row.punya === "ya") return "Pertahankan dan review manfaat/UP secara berkala.";
  if(level === "Prioritas Utama") return "Prioritas utama untuk dilengkapi.";
  if(level === "Prioritas Sekunder") return "Lengkapi setelah kebutuhan wajib utama terpenuhi.";
  if(level === "Tahap Pengembangan") return "Dipertimbangkan setelah proteksi dasar keluarga cukup.";
  return "Dipertimbangkan untuk tujuan jangka panjang.";
}

function getMemberSortOrder(member){
  if(member.id === "kepala") return 1;
  if(member.id === "pasangan") return 2;
  if(String(member.id).startsWith("anak")){
    const n = parseInt(String(member.id).replace("anak", "")) || 0;
    return 10 + n;
  }
  return 99;
}

function findPolicyRow(memberId, kategori, fungsi){
  syncMatrixWithTemplate(memberId);
  const matrix = state.polis[memberId] || [];
  const k = String(kategori || "").toLowerCase();
  const f = String(fungsi || "").toLowerCase();

  return matrix.find(row =>
    String(row.kategori || "").toLowerCase() === k &&
    String(row.fungsi || "").toLowerCase() === f
  );
}

function buildRequiredRecommendation(member, kategori, fungsi, alasan, urutan){
  const row = findPolicyRow(member.id, kategori, fungsi) || {
    kategori,
    fungsi,
    warna:"red",
    punya:"tidak"
  };

  return {
    member,
    row,
    urutan,
    alasan: alasan || getPolicyReason(row),
    prioritas: "Prioritas Utama"
  };
}

function getWajibRecommendationsByFamily(limit = 999){
  const rows = [];
  const anakMembers = state.keluarga.filter(member => String(member.id).startsWith("anak"));

  state.keluarga.forEach(member => {
    if(member.id === "kepala"){
      rows.push(buildRequiredRecommendation(member, "ASURANSI KESEHATAN", "PROTEKSI ASET", "Melindungi aset keluarga dari risiko biaya rumah sakit.", 1));
      rows.push(buildRequiredRecommendation(member, "ASURANSI PENYAKIT KRITIS", "PROTEKSI INCOME", "Menjaga stabilitas keuangan saat kepala keluarga terkena penyakit serius.", 2));
      rows.push(buildRequiredRecommendation(member, "ASURANSI JIWA", "PROTEKSI INCOME", "Melindungi biaya hidup keluarga jika pencari nafkah utama meninggal dunia.", 3));

      anakMembers.forEach((anak, index) => {
        rows.push(buildRequiredRecommendation(
          member,
          "ASURANSI PENDIDIKAN ANAK",
          `PENDIDIKAN ANAK ${index + 1}`,
          `Menyiapkan dana pendidikan untuk ${anak.nama || `Anak ${index + 1}`}.`,
          10 + index
        ));
      });
    }

    if(member.id === "pasangan"){
      rows.push(buildRequiredRecommendation(member, "ASURANSI KESEHATAN", "PROTEKSI ASET", "Melindungi aset keluarga dari risiko biaya rumah sakit pasangan.", 4));
      rows.push(buildRequiredRecommendation(member, "ASURANSI PENYAKIT KRITIS", "PROTEKSI INCOME", "Menjaga dana keluarga saat pasangan mengalami penyakit serius.", 5));

      if(state.statusPasangan === "kerja"){
        rows.push(buildRequiredRecommendation(member, "ASURANSI JIWA", "PROTEKSI INCOME", "Karena pasangan memiliki income yang ikut berkontribusi pada keluarga.", 6));
      }
    }

    if(String(member.id).startsWith("anak")){
      rows.push(buildRequiredRecommendation(member, "ASURANSI KESEHATAN", "PROTEKSI ASET", "Melindungi keluarga dari risiko biaya rumah sakit anak.", 7));
    }
  });

  return rows
    .filter(item => item.row.punya !== "ya")
    .sort((a,b) => {
      const pa = a.urutan || 99;
      const pb = b.urutan || 99;
      if(pa !== pb) return pa - pb;
      return getMemberSortOrder(a.member) - getMemberSortOrder(b.member);
    })
    .slice(0, limit);
}

// Nama lama tetap diarahkan ke rekomendasi wajib agar bagian website lama tidak error.
function getFamilyPolicyRoadmap(limit = 999){
  return getWajibRecommendationsByFamily(limit);
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
    const roadmap = getFamilyPolicyRoadmap(8);

    if(roadmap.length){
      list.innerHTML = roadmap.map((item) => `
        <li>
          <strong>${item.member.nama}</strong> — ${item.row.kategori}<br>
          <small>${item.row.fungsi} • ${getPolicyPriorityLevel(item.row)} • ${getPolicyReason(item.row)}</small>
        </li>
      `).join("");
    }else{
      list.innerHTML = `
        <li>
          Polis keluarga sudah lengkap berdasarkan matrix. Lakukan review tahunan agar manfaat polis tetap relevan.
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
  document.getElementById("tglLahirKepala").value = "";
  document.getElementById("statusMenikah").value = "menikah";
  document.getElementById("namaPasangan").value = "";
  document.getElementById("tglLahirPasangan").value = "";
  document.getElementById("statusPasangan").value = "kerja";
  document.getElementById("jumlahAnak").value = "3";
  const childrenBox = document.getElementById("childrenNameBox");
  if(childrenBox) childrenBox.innerHTML = "";
  toggleMarriageFields();
  renderAll();
}

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderAll();
  toggleMarriageFields();

  ["namaKepala", "tglLahirKepala", "statusMenikah", "namaPasangan", "tglLahirPasangan", "statusPasangan", "jumlahAnak"].forEach(id => {
    const el = document.getElementById(id);
    if(el){
      el.addEventListener("input", () => {
        setInvalid(el, !String(el.value || "").trim());
        showFamilyError("");
      });
      el.addEventListener("change", () => {
        if(id === "statusMenikah") toggleMarriageFields();
        if(id === "jumlahAnak") renderChildNameInputs();
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

async function getImageDataUrl(src){
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
    img.src = src;
  });
}

function addInsuranceFunctionImage(doc, imageDataUrl, pageNo, startY = 68){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(248,252,255);
  doc.rect(0,0,pageWidth,pageHeight,"F");
  doc.setFillColor(235,244,250);
  doc.circle(18, 20, 36, "F");
  doc.setFillColor(245,231,204);
  doc.circle(pageWidth - 18, pageHeight - 12, 42, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(11,60,93);
  doc.text("12 JENIS ASURANSI & FUNGSINYA", pageWidth/2, 18, { align:"center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71,85,105);
  doc.text("Gunakan panduan ini sebagai referensi umum saat menyusun perlindungan keluarga.", pageWidth/2, 26, { align:"center" });

  if(imageDataUrl){
    try{
      doc.addImage(imageDataUrl, "PNG", 16, startY - 30, pageWidth - 32, 135, undefined, "FAST");
    }catch(err){
      doc.setTextColor(190,0,0);
      doc.text("Gambar panduan asuransi belum berhasil dimuat.", pageWidth/2, 80, { align:"center" });
    }
  }else{
    doc.setTextColor(190,0,0);
    doc.text("Gambar panduan asuransi belum berhasil dimuat.", pageWidth/2, 80, { align:"center" });
  }

  const ctaX = 18, ctaY = 184, ctaW = pageWidth - 36, ctaH = 16;
  doc.setFillColor(11,60,93);
  doc.setDrawColor(11,60,93);
  doc.roundedRect(ctaX, ctaY, ctaW, ctaH, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.6);
  doc.setTextColor(255,255,255);
  doc.text("Butuh Review Polis Lebih Detail?", ctaX + 7, ctaY + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.4);
  doc.setTextColor(225,239,249);
  doc.text("Diskusikan prioritas polis wajib, UP, limit kesehatan, dan strategi perbaikan bersama Financial Planner.", ctaX + 7, ctaY + 11, { maxWidth: 175 });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.4);
  doc.setTextColor(255,255,255);
  doc.text("Septino, QWP®, CIS®", ctaX + ctaW - 7, ctaY + 6, { align:"right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.4);
  doc.text("WhatsApp: 0811-6946-999", ctaX + ctaW - 7, ctaY + 11, { align:"right" });

  addPdfFooter(doc, pageNo);
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


function addCTAPage(doc, logoDataUrl, pageNo, insuranceImageDataUrl){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const stats = getFamilyReviewStats();
  const rekomendasiWajib = getWajibRecommendationsByFamily(999);

  doc.setFillColor(248,252,255);
  doc.rect(0,0,pageWidth,pageHeight,"F");
  doc.setFillColor(235,244,250);
  doc.circle(18, 20, 36, "F");
  doc.setFillColor(245,231,204);
  doc.circle(pageWidth - 18, pageHeight - 12, 42, "F");

  addLogoToPdf(doc, logoDataUrl, 10, 8, 38, 22);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(11,60,93);
  doc.text("REKOMENDASI POLIS WAJIB SEBAGAI PRIORITAS", pageWidth/2, 19, { align:"center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71,85,105);
  doc.text("Rekomendasi berikut disusun berdasarkan data keluarga dan item polis wajib yang belum dimiliki.", pageWidth/2, 28, { align:"center", maxWidth: pageWidth - 60 });

  const summaryX = 18, summaryY = 38, summaryW = pageWidth - 36, summaryH = 30;
  doc.setFillColor(255,255,255);
  doc.setDrawColor(220,232,242);
  doc.roundedRect(summaryX, summaryY, summaryW, summaryH, 5, 5, "FD");

  const wajibText = rekomendasiWajib.length ? `${rekomendasiWajib.length} item wajib perlu diprioritaskan` : "Semua polis wajib sudah dimiliki";
  const summaryItems = [
    ["Skor Kesiapan", `${stats.score}%`, [46,139,87]],
    ["Sudah Punya", String(stats.owned), [46,139,87]],
    ["Belum Punya", String(stats.missing), [190,0,0]],
    ["Polis Wajib Prioritas", String(rekomendasiWajib.length), [224,0,0]]
  ];

  const cardW = (summaryW - 18) / 4;
  summaryItems.forEach((item, i) => {
    const x = summaryX + 6 + i * cardW;
    doc.setFillColor(248,250,252);
    doc.setDrawColor(226,232,240);
    doc.roundedRect(x, summaryY + 6, cardW - 4, 18, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100,116,139);
    doc.text(item[0], x + (cardW - 4)/2, summaryY + 12, { align:"center" });
    doc.setFontSize(11.5);
    doc.setTextColor(item[2][0], item[2][1], item[2][2]);
    doc.text(item[1], x + (cardW - 4)/2, summaryY + 21, { align:"center" });
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(180,0,0);
  doc.text(wajibText, 18, 78);

  const tableBody = rekomendasiWajib.length ? rekomendasiWajib.map((item, index) => [
    String(index + 1),
    safePdfText(item.member.nama),
    safePdfText(`${item.row.kategori}\n${item.row.fungsi}`),
    safePdfText(getPolicyStatusText(item.row)),
    safePdfText(item.prioritas || "Prioritas Utama"),
    safePdfText(item.alasan || getPolicyReason(item.row))
  ]) : [[
    "-",
    "Keluarga",
    "Polis wajib utama",
    "Sudah Dimiliki",
    "Monitoring Tahunan",
    "Pertahankan polis yang sudah ada dan review manfaat minimal setahun sekali."
  ]];

  doc.autoTable({
    startY: 83,
    head: [["No", "Anggota", "Rekomendasi Polis Wajib", "Status", "Tingkat Prioritas", "Alasan"]],
    body: tableBody,
    theme:"grid",
    margin:{left:18,right:18},
    tableWidth: pageWidth - 36,
    styles:{
      font:"helvetica",
      fontSize:6.4,
      cellPadding:2.1,
      textColor:[51,65,85],
      lineColor:[220,232,242],
      lineWidth:.25,
      valign:"middle"
    },
    headStyles:{
      fillColor:[11,60,93],
      textColor:[255,255,255],
      fontStyle:"bold",
      halign:"center"
    },
    columnStyles:{
      0:{cellWidth:10, halign:"center", fontStyle:"bold"},
      1:{cellWidth:28, fontStyle:"bold"},
      2:{cellWidth:56, fontStyle:"bold"},
      3:{cellWidth:27, halign:"center", fontStyle:"bold"},
      4:{cellWidth:32, halign:"center", fontStyle:"bold"},
      5:{cellWidth: pageWidth - 36 - 10 - 28 - 56 - 27 - 32}
    },
    didParseCell:function(data){
      if(data.section === "body" && data.column.index === 3){
        const txt = String(data.cell.raw || "");
        if(txt.includes("Belum")){
          data.cell.styles.textColor = [190,0,0];
          data.cell.styles.fillColor = [255,240,240];
        }else{
          data.cell.styles.textColor = [0,120,58];
          data.cell.styles.fillColor = [232,247,238];
        }
      }
      if(data.section === "body" && data.column.index === 4){
        data.cell.styles.textColor = [180,0,0];
        data.cell.styles.fillColor = [255,246,230];
      }
    }
  });

  const afterTableY = doc.lastAutoTable?.finalY || 122;
  const infoY = Math.min(afterTableY + 6, 164);
  doc.setFillColor(255,250,242);
  doc.setDrawColor(255,205,150);
  doc.roundedRect(18, infoY, pageWidth - 36, 16, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(180,0,0);
  doc.text("Catatan Prioritas", 24, infoY + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(71,85,105);
  doc.text("Prioritas utama berfokus pada polis wajib: kesehatan, penyakit kritis, proteksi income, dan pendidikan anak sesuai data keluarga.", 68, infoY + 6, { maxWidth: pageWidth - 92 });
  doc.text("Item non-wajib seperti distribusi kekayaan, akumulasi, atau kebutuhan tambahan tetap dapat dipertimbangkan setelah proteksi wajib lebih aman.", 68, infoY + 11, { maxWidth: pageWidth - 92 });

  addPdfFooter(doc, pageNo);

  doc.addPage("a4", "landscape");
  addInsuranceFunctionImage(doc, insuranceImageDataUrl, pageNo + 1, 62);
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
    const insuranceImageDataUrl = await getImageDataUrl("../asset/asuransi-fungsi-landscape.png");

    addCoverPage(doc, logoDataUrl);
    let pageNo = 2;
    state.keluarga.forEach(member => {
      doc.addPage("a4", "landscape");
      addMemberPage(doc, member, logoDataUrl, pageNo);
      pageNo++;
    });

    doc.addPage("a4", "landscape");
    addCTAPage(doc, logoDataUrl, pageNo, insuranceImageDataUrl);

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
