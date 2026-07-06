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


function getFamilyCategoryProgress(keywordList){
  let total = 0;
  let owned = 0;
  const keys = keywordList.map(k => String(k).toLowerCase());

  state.keluarga.forEach(member => {
    syncMatrixWithTemplate(member.id);
    const matrix = state.polis[member.id] || [];
    matrix.forEach(row => {
      const text = `${row.kategori || ""} ${row.fungsi || ""}`.toLowerCase();
      if(keys.some(k => text.includes(k))){
        total++;
        if(row.punya === "ya") owned++;
      }
    });
  });

  return {
    total,
    owned,
    missing: Math.max(total - owned, 0),
    percent: total ? Math.round((owned / total) * 100) : 0
  };
}

function getExecutiveSummaryData(){
  const stats = getFamilyReviewStats();
  const anak = state.keluarga.filter(m => String(m.id).startsWith("anak"));
  const kepala = state.keluarga.find(m => m.id === "kepala");
  const pasangan = state.keluarga.find(m => m.id === "pasangan");

  const categories = [
    { label:"Kesehatan", key:"health", color:[0,166,81], progress:getFamilyCategoryProgress(["kesehatan"]) },
    { label:"Jiwa", key:"life", color:[11,60,93], progress:getFamilyCategoryProgress(["jiwa proteksi income", "proteksi income"]) },
    { label:"Penyakit Kritis", key:"critical", color:[224,0,0], progress:getFamilyCategoryProgress(["penyakit kritis"]) },
    { label:"Dana Pendidikan", key:"education", color:[230,142,0], progress:getFamilyCategoryProgress(["pendidikan"]) },
    { label:"Dana Pensiun", key:"retirement", color:[0,105,180], progress:getFamilyCategoryProgress(["pensiun"]) }
  ];

  let categoryLabel = "Perlu Ditingkatkan";
  if(stats.score >= 80) categoryLabel = "Sangat Baik";
  else if(stats.score >= 60) categoryLabel = "Cukup Baik";
  else if(stats.score >= 40) categoryLabel = "Perlu Dilengkapi";

  const topPriorities = getFamilyPolicyRoadmap(8)
    .filter(item => item.row && item.row.warna === "red")
    .map(item => getRoadmapShortTitle(item));

  const uniquePriorities = [];
  topPriorities.forEach(item => {
    if(!uniquePriorities.includes(item)) uniquePriorities.push(item);
  });

  const fallback = getFamilyPolicyRoadmap(8).map(item => getRoadmapShortTitle(item));
  fallback.forEach(item => {
    if(uniquePriorities.length < 3 && !uniquePriorities.includes(item)) uniquePriorities.push(item);
  });

  return {
    stats,
    kepala,
    pasangan,
    anak,
    categories,
    categoryLabel,
    priorities: uniquePriorities.slice(0,3)
  };
}





function cfExecSafeText(value){
  return safePdfText(value == null || value === "" ? "-" : String(value));
}

function cfExecRoundRect(doc, x, y, w, h, r, fill, stroke){
  if(fill) doc.setFillColor(fill[0], fill[1], fill[2]);
  if(stroke) doc.setDrawColor(stroke[0], stroke[1], stroke[2]);
  doc.roundedRect(x, y, w, h, r, r, fill && stroke ? "FD" : fill ? "F" : "S");
}

function cfExecDrawIconBox(doc, x, y, color, text){
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(x, y, 10, 10, 2.2, 2.2, "F");
  // Biarkan kotak icon bersih tanpa huruf KG/PS/AK/TG/FP agar tampilan PDF lebih rapi.
  if(text){
    doc.setTextColor(255,255,255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.2);
    doc.text(text, x + 5, y + 6.5, { align:"center" });
  }
}

function cfExecInfoCard(doc, x, y, w, title, value, color, icon){
  cfExecRoundRect(doc, x, y, w, 20, 4, [255,255,255], [220,232,242]);
  cfExecDrawIconBox(doc, x + 5, y + 5, color, icon || "");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(100,116,139);
  doc.text(title.toUpperCase(), x + 18, y + 7.2, { maxWidth:w - 20 });
  doc.setFontSize(9);
  doc.setTextColor(11,60,93);
  doc.text(cfExecSafeText(value), x + 18, y + 15.2, { maxWidth:w - 20 });
}

function cfExecStatCard(doc, x, y, w, value, title, subtitle, color, icon){
  cfExecRoundRect(doc, x, y, w, 26, 4.5, [255,255,255], [220,232,242]);
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(x, y, w, 2.3, 1.2, 1.2, "F");
  cfExecDrawIconBox(doc, x + 7, y + 8.5, color, icon || "");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(String(value), x + w/2 + 10, y + 13.4, { align:"center" });
  doc.setFontSize(7.3);
  doc.setTextColor(15,23,42);
  doc.text(title, x + w/2 + 10, y + 20.3, { align:"center", maxWidth:w - 22 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.setTextColor(71,85,105);
  doc.text(subtitle, x + w/2 + 10, y + 24.2, { align:"center", maxWidth:w - 22 });
}

function cfExecProgress(doc, x, y, w, label, percent, color){
  const barX = x + 36;
  const barW = w - 54;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(15,23,42);
  doc.text(label, x, y + 2.6);
  doc.setFillColor(230,237,246);
  doc.roundedRect(barX, y, barW, 4.5, 2.2, 2.2, "F");
  if(percent > 0){
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(barX, y, Math.max(3, barW * percent / 100), 4.5, 2.2, 2.2, "F");
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.1);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(`${percent}%`, x + w, y + 3.1, { align:"right" });
}

function addExecutiveSummaryPage(doc, logoDataUrl, pageNo){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const data = getExecutiveSummaryData();
  const tanggal = new Date().toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric" });

  const navy = [11,60,93];
  const blue = [0,105,180];
  const green = [0,166,81];
  const red = [224,0,0];
  const gold = [201,154,54];
  const orange = [230,142,0];
  const line = [220,232,242];
  const pale = [248,252,255];

  doc.setFillColor(255,255,255);
  doc.rect(0,0,pageWidth,pageHeight,"F");

  // Dekorasi lembut
  doc.setFillColor(241,248,253);
  doc.circle(-8, -4, 42, "F");
  doc.setFillColor(253,241,215);
  doc.circle(pageWidth + 18, pageHeight + 10, 45, "F");
  doc.setFillColor(...navy);
  doc.triangle(pageWidth - 25, 0, pageWidth, 0, pageWidth, 24, "F");
  doc.setFillColor(242,190,84);
  doc.triangle(pageWidth - 45, 0, pageWidth - 31, 0, pageWidth, 31, "F");

  // HEADER lebih compact
  cfExecRoundRect(doc, 10, 7, pageWidth - 20, 23, 5, [255,255,255], line);
  if(logoDataUrl){
    try{ doc.addImage(logoDataUrl, "PNG", 22, 10, 23, 16, undefined, "FAST"); }catch(e){}
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...navy);
  doc.text("EXECUTIVE SUMMARY", pageWidth/2, 17.5, { align:"center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.1);
  doc.setTextColor(51,65,85);
  doc.text("Review Polis Keluarga", pageWidth/2 - 6, 24.5, { align:"right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...blue);
  doc.text("Cerdas Finansial", pageWidth/2 - 4, 24.5);
  doc.setFillColor(...gold);
  doc.roundedRect(pageWidth - 51, 14.3, 32, 5, 2.5, 2.5, "F");
  doc.setTextColor(255,255,255);
  doc.setFontSize(5);
  doc.text("CONFIDENTIAL", pageWidth - 35, 17.7, { align:"center" });

  // INFO KELUARGA
  const infoY = 34;
  const infoGap = 3;
  const infoW = (pageWidth - 20 - infoGap*4) / 5;
  const infoItems = [
    {title:"Kepala Keluarga", value:data.kepala?.nama || "-", color:navy},
    {title:"Pasangan", value:data.pasangan?.nama || "-", color:[124,58,237]},
    {title:"Anak", value:`${data.anak.length} Orang`, color:blue},
    {title:"Tanggal Review", value:tanggal, color:gold},
    {title:"Financial Planner", value:"Septino, QWP®, CIS®", color:navy}
  ];
  infoItems.forEach((item, i) => {
    const x = 10 + i*(infoW+infoGap);
    cfExecRoundRect(doc, x, infoY, infoW, 17, 4, [255,255,255], line);
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.roundedRect(x + 4, infoY + 4.5, 8, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.4);
    doc.setTextColor(100,116,139);
    doc.text(item.title.toUpperCase(), x + 16, infoY + 7.0, { maxWidth:infoW - 19 });
    doc.setFontSize(7.1);
    doc.setTextColor(11,60,93);
    const lines = doc.splitTextToSize(cfExecSafeText(item.value), infoW - 19);
    doc.text(lines.slice(0,2), x + 16, infoY + 13.1, { lineHeightFactor:0.9 });
  });

  // KPI Cards
  const statY = 55;
  const statGap = 3.2;
  const statW = (pageWidth - 20 - statGap*3) / 4;
  cfExecStatCard(doc, 10, statY, statW, `${data.stats.score}%`, "Skor Kesiapan", "Perlindungan keluarga", navy, "");
  cfExecStatCard(doc, 10 + (statW+statGap), statY, statW, data.stats.total, "Kebutuhan Polis", "Total kebutuhan", blue, "");
  cfExecStatCard(doc, 10 + (statW+statGap)*2, statY, statW, data.stats.owned, "Sudah Dimiliki", "Polis tersedia", green, "");
  cfExecStatCard(doc, 10 + (statW+statGap)*3, statY, statW, data.stats.missing, "Perlu Dilengkapi", "Gap perlindungan", red, "");

  // Panel utama dinaikkan dan diperbesar secukupnya agar semua progress masuk
  const panelY = 85;
  const panelH = 61;
  const leftX = 10;
  const leftW = 138;
  const rightX = 155;
  const rightW = pageWidth - rightX - 10;

  // KONDISI PERLINDUNGAN
  cfExecRoundRect(doc, leftX, panelY, leftW, panelH, 4, [255,255,255], line);
  doc.setFillColor(...navy);
  doc.roundedRect(leftX + 6, panelY + 6, 9, 9, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.6);
  doc.setTextColor(...navy);
  doc.text("KONDISI PERLINDUNGAN", leftX + 20, panelY + 12.1);
  doc.setDrawColor(226,232,240);
  doc.line(leftX + 20, panelY + 15.5, leftX + leftW - 8, panelY + 15.5);

  let py = panelY + 25.0;
  data.categories.forEach(cat => {
    const labelX = leftX + 9;
    const barX = leftX + 52;
    const barW = leftW - 73;
    const percentX = leftX + leftW - 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.7);
    doc.setTextColor(15,23,42);
    doc.text(cat.label, labelX, py + 2.5);
    doc.setFillColor(230,237,246);
    doc.roundedRect(barX, py, barW, 4.0, 2, 2, "F");
    if(cat.progress.percent > 0){
      doc.setFillColor(cat.color[0], cat.color[1], cat.color[2]);
      doc.roundedRect(barX, py, Math.max(3, barW * cat.progress.percent / 100), 4.0, 2, 2, "F");
    }
    doc.setFontSize(6.7);
    doc.setTextColor(cat.color[0], cat.color[1], cat.color[2]);
    doc.text(`${cat.progress.percent}%`, percentX, py + 2.9, { align:"right" });
    py += 8.9;
  });

  // TEMUAN UTAMA
  cfExecRoundRect(doc, rightX, panelY, rightW, panelH, 4, [255,255,255], line);
  doc.setFillColor(...navy);
  doc.roundedRect(rightX + 6, panelY + 6, 9, 9, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.6);
  doc.setTextColor(...navy);
  doc.text("TEMUAN UTAMA", rightX + 20, panelY + 12.1);
  doc.setDrawColor(226,232,240);
  doc.line(rightX + 20, panelY + 15.5, pageWidth - 17, panelY + 15.5);

  const findings = data.categories.map(cat => {
    if(cat.progress.percent >= 80) return { sign:"✓", color:green, text:`${cat.label} keluarga sudah baik.` };
    if(cat.progress.percent > 0) return { sign:"!", color:orange, text:`${cat.label} masih perlu dilengkapi.` };
    return { sign:"!", color:orange, text:`${cat.label} belum tersedia.` };
  });
  let fy = panelY + 24.5;
  findings.slice(0,5).forEach((f, i) => {
    doc.setFillColor(f.color[0], f.color[1], f.color[2]);
    doc.circle(rightX + 9, fy - 1.7, 2.1, "F");
    doc.setTextColor(255,255,255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4.2);
    doc.text(f.sign, rightX + 9, fy - 0.1, { align:"center" });
    doc.setTextColor(15,23,42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.45);
    doc.text(cfExecSafeText(f.text), rightX + 14, fy, { maxWidth:rightW - 22 });
    if(i < 4){ doc.setDrawColor(226,232,240); doc.line(rightX + 14, fy + 3.2, pageWidth - 16, fy + 3.2); }
    fy += 7.7;
  });

  // PRIORITAS TERATAS - dinaikkan dan dibuat full width
  const prY = 151;
  const prH = 18;
  cfExecRoundRect(doc, 10, prY, pageWidth - 20, prH, 4, [255,255,255], line);
  doc.setFillColor(...navy);
  doc.roundedRect(16, prY + 4.8, 9, 9, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.4);
  doc.setTextColor(...navy);
  doc.text("3 PRIORITAS TERATAS", 30, prY + 10.7);

  const priorities = (data.priorities && data.priorities.length ? data.priorities : ["Review Polis Wajib", "Lengkapi Proteksi", "Review Tahunan"]).slice(0,3);
  const pColors = [red, orange, blue];
  const pStartX = 82;
  const pGap = 5;
  const pW = (pageWidth - pStartX - 18 - pGap*2) / 3;
  priorities.forEach((item, i) => {
    const bx = pStartX + i*(pW + pGap);
    const by = prY + 4.5;
    doc.setFillColor(pColors[i][0], pColors[i][1], pColors[i][2]);
    doc.roundedRect(bx, by, pW, 9.4, 2.4, 2.4, "F");
    doc.setFillColor(255,255,255);
    doc.circle(bx + 6, by + 4.7, 2.6, "F");
    doc.setTextColor(pColors[i][0], pColors[i][1], pColors[i][2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.2);
    doc.text(String(i+1), bx + 6, by + 6.4, { align:"center" });
    doc.setTextColor(255,255,255);
    doc.setFontSize(5.8);
    doc.text(cfExecSafeText(item), bx + 13, by + 6.0, { maxWidth:pW - 15 });
  });

  // KESIMPULAN FINANCIAL PLANNER - naik, tidak menempel footer
  const conclY = 175;
  const conclH = 18;
  cfExecRoundRect(doc, 10, conclY, pageWidth - 20, conclH, 4, [245,250,255], line);
  doc.setFillColor(...navy);
  doc.roundedRect(16, conclY + 4.8, 8, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(...navy);
  doc.text("KESIMPULAN FINANCIAL PLANNER", 29, conclY + 7.0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.1);
  doc.setTextColor(30,41,59);
  const conclusion = `Skor kesiapan perlindungan keluarga saat ini ${data.stats.score}%. Fokus utama adalah melengkapi proteksi wajib terlebih dahulu, kemudian menyiapkan dana pendidikan dan dana pensiun secara bertahap.`;
  doc.text(conclusion, 29, conclY + 11.0, { maxWidth:pageWidth - 102, lineHeightFactor:1.05 });
  doc.setDrawColor(148,163,184);
  doc.line(pageWidth - 67, conclY + 3.0, pageWidth - 67, conclY + conclH - 3.0);
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(7.8);
  doc.setTextColor(...navy);
  doc.text("Septino, QWP®, CIS®", pageWidth - 39, conclY + 8.0, { align:"center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5);
  doc.text("Financial Planner", pageWidth - 39, conclY + 13.0, { align:"center" });

  addPdfFooter(doc, pageNo || 2);
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



function drawTinyIcon(doc, type, x, y, color){
  const c = color || [220,0,0];
  doc.setFillColor(c[0], c[1], c[2]);
  doc.circle(x, y, 3.2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(4.8);
  doc.setTextColor(255,255,255);
  const label = type === "education" ? "ED" : (type === "critical" ? "CI" : (type === "life" ? "UP" : "+"));
  doc.text(label, x, y + 1.5, { align:"center" });
}

function getRoadmapIconType(item){
  const text = `${item?.row?.kategori || ""} ${item?.row?.fungsi || ""}`.toLowerCase();
  if(text.includes("pendidikan")) return "education";
  if(text.includes("penyakit kritis")) return "critical";
  if(text.includes("jiwa")) return "life";
  return "health";
}

function getRoadmapColor(item){
  return getRoadmapIconType(item) === "education" ? [230,142,0] : [220,0,0];
}

function getRoadmapShortTitle(item){
  const text = `${item?.row?.kategori || ""} ${item?.row?.fungsi || ""}`.toLowerCase();
  if(text.includes("pendidikan")) return "Dana Pendidikan";
  if(text.includes("penyakit kritis")) return "Penyakit Kritis";
  if(text.includes("jiwa") && text.includes("income")) return "Jiwa Proteksi Income";
  if(text.includes("kesehatan")) return "Asuransi Kesehatan";
  return safePdfText(item?.row?.kategori || "Rekomendasi Polis");
}

function getRoadmapShortReason(item){
  const type = getRoadmapIconType(item);
  const nama = item?.member?.nama || "anggota keluarga";
  if(type === "education") return `Menyiapkan dana pendidikan untuk ${nama}.`;
  if(type === "critical") return "Menjaga stabilitas keuangan bila terkena penyakit kritis.";
  if(type === "life") return "Menjaga keberlangsungan biaya hidup keluarga.";
  return "Melindungi aset keluarga dari risiko biaya rumah sakit.";
}

function getMemberRoleLabel(member){
  if(member.id === "kepala") return "Kepala Keluarga";
  if(member.id === "pasangan") return state.statusPasangan === "kerja" ? "Pasangan (Ada Income)" : "Pasangan";
  if(String(member.id).startsWith("anak")) return `Anak ${String(member.id).replace("anak", "")}`;
  return "Anggota";
}

function addRoadmapPage(doc, logoDataUrl, pageNo){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const startPageIndex = doc.internal.getNumberOfPages();
  const stats = getFamilyReviewStats();
  const allItems = getWajibRecommendationsByFamily(999);
  const utamaItems = allItems.filter(item => getRoadmapIconType(item) !== "education");
  const berikutItems = allItems.filter(item => getRoadmapIconType(item) === "education");
  const kepala = state.keluarga.find(m => m.id === "kepala");
  const pasangan = state.keluarga.find(m => m.id === "pasangan");
  const anakList = state.keluarga.filter(m => String(m.id).startsWith("anak"));

  function drawBackground(){
    doc.setFillColor(248,252,255);
    doc.rect(0,0,pageWidth,pageHeight,"F");
    doc.setFillColor(232,242,250);
    doc.circle(12, 18, 34, "F");
    doc.setFillColor(246,230,198);
    doc.circle(pageWidth - 15, pageHeight - 5, 38, "F");
  }

  function drawHeader(){
    drawBackground();
    doc.setFillColor(11,60,93);
    doc.circle(14, 16, 5.5, "F");
    doc.setDrawColor(255,255,255);
    doc.setLineWidth(1.1);
    doc.line(11.8, 16, 13.8, 18.1);
    doc.line(13.8, 18.1, 17, 13.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(11,60,93);
    doc.text("ROADMAP PERLINDUNGAN KELUARGA", 24, 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(30,41,59);
    doc.text("Berdasarkan data keluarga dan review polis, berikut prioritas perlindungan yang disarankan.", 24, 22, { maxWidth: 145 });

    const boxX = 190, boxY = 7, boxW = pageWidth - boxX - 12, boxH = 27;
    doc.setFillColor(255,255,255);
    doc.setDrawColor(198,218,238);
    doc.roundedRect(boxX, boxY, boxW, boxH, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.2);
    doc.setTextColor(11,60,93);
    doc.text("KELUARGA ANDA", boxX + 7, boxY + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.7);
    doc.setTextColor(15,23,42);
    doc.text(`Kepala Keluarga : ${kepala?.nama || "-"}`, boxX + 7, boxY + 14);
    doc.text(`Pasangan        : ${pasangan ? (pasangan.nama || "-") : "-"}${pasangan ? (state.statusPasangan === "kerja" ? " (Ada Income)" : "") : ""}`, boxX + 7, boxY + 20);
    doc.text(`Anak            : ${anakList.length ? anakList.map(a => a.nama || a.label || "Anak").join(", ") + ` (${anakList.length} Anak)` : "-"}`, boxX + 7, boxY + 26, { maxWidth: boxW - 12 });
  }

  function drawStatCard(x, y, w, color, number, title, subtitle){
    doc.setFillColor(255,255,255);
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(.35);
    doc.roundedRect(x, y, w, 21, 4, 4, "FD");
    doc.setFillColor(color[0], color[1], color[2]);
    doc.circle(x + 11, y + 10.5, 7.8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(String(number), x + 25, y + 11.5);
    doc.setFontSize(7.8);
    doc.setTextColor(11,60,93);
    doc.text(title, x + 43, y + 8.2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.3);
    doc.setTextColor(30,41,59);
    doc.text(subtitle, x + 43, y + 15.2, { maxWidth: w - 48 });
  }

  function drawMemberCard(member, items, x, y, w, h){
    const isPasangan = member.id === "pasangan";
    const isAnak = String(member.id).startsWith("anak");
    const theme = isPasangan ? [126,58,164] : (isAnak ? [13,101,183] : [11,60,93]);
    doc.setFillColor(255,255,255);
    doc.setDrawColor(208,222,235);
    doc.roundedRect(x, y, w, h, 4, 4, "FD");

    // Header card dibuat solid agar nama dan status terlihat jelas di PDF.
    doc.setFillColor(theme[0], theme[1], theme[2]);
    doc.rect(x, y, w, 17, "F");
    doc.setFillColor(255,255,255);
    doc.circle(x + 8.5, y + 8.5, 5.4, "F");
    doc.setFillColor(theme[0], theme[1], theme[2]);
    doc.circle(x + 8.5, y + 8.5, 3.7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.6);
    doc.setTextColor(255,255,255);
    doc.text(safePdfText(member.nama || member.label || "-"), x + 16, y + 7.1, { maxWidth: w - 18 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.3);
    doc.setTextColor(236,245,255);
    doc.text(getMemberRoleLabel(member), x + 16, y + 13.1, { maxWidth: w - 18 });

    let cy = y + 24;
    if(!items.length){
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.2);
      doc.setTextColor(46,139,87);
      doc.text("Polis wajib utama sudah lengkap", x + 8, cy);
      return;
    }

    items.slice(0,3).forEach((item, idx) => {
      const color = getRoadmapColor(item);
      drawTinyIcon(doc, getRoadmapIconType(item), x + 9, cy - 1.5, color);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.8);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(getRoadmapShortTitle(item), x + 16, cy - 2.8, { maxWidth: w - 20 });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.8);
      doc.setTextColor(15,23,42);
      doc.text(getRoadmapShortReason(item), x + 16, cy + 3.2, { maxWidth: w - 20 });
      if(idx < items.slice(0,3).length - 1){
        doc.setDrawColor(226,232,240);
        doc.line(x + 8, cy + 9.5, x + w - 8, cy + 9.5);
      }
      cy += 17.5;
    });
  }

  drawHeader();

  drawStatCard(12, 40, 86, [13,101,183], allItems.length, "KEBUTUHAN POLIS", "Total kebutuhan berdasarkan data keluarga");
  drawStatCard(105, 40, 86, [220,0,0], utamaItems.length, "PRIORITAS UTAMA", "Perlindungan wajib segera dilengkapi");
  drawStatCard(198, 40, 86, [230,142,0], berikutItems.length, "PRIORITAS BERIKUTNYA", "Perlindungan yang disiapkan selanjutnya");

  doc.setDrawColor(180,192,205);
  doc.line(12, 70, pageWidth - 12, 70);
  doc.setFillColor(220,0,0);
  doc.roundedRect(pageWidth/2 - 48, 66, 96, 10, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.4);
  doc.setTextColor(255,255,255);
  doc.text("YANG HARUS SEGERA DILENGKAPI", pageWidth/2, 72.8, { align:"center" });

  const grouped = state.keluarga
    .slice()
    .sort((a,b) => getMemberSortOrder(a) - getMemberSortOrder(b))
    .map(member => ({ member, items: allItems.filter(item => item.member.id === member.id) }));

  const cardGap = 4;
  const cols = Math.min(grouped.length || 1, 5);
  const cardW = (pageWidth - 24 - cardGap * (cols - 1)) / cols;
  const cardH = 76;
  let x = 12;
  let y = 80;
  grouped.forEach((g, idx) => {
    if(idx > 0 && idx % cols === 0){
      y += cardH + 7;
      x = 12;
    }
    if(y + cardH > 172){
      addPdfFooter(doc, pageNo + (doc.internal.getNumberOfPages() - startPageIndex));
      doc.addPage("a4", "landscape");
      drawHeader();
      y = 42;
      x = 12;
    }
    drawMemberCard(g.member, g.items, x, y, cardW, cardH);
    x += cardW + cardGap;
  });

  const bottomY = 166;
  doc.setFillColor(239,247,255);
  doc.setDrawColor(198,218,238);
  doc.roundedRect(12, bottomY, 130, 28, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(11,60,93);
  doc.text("CATATAN FINANCIAL PLANNER", 22, bottomY + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.4);
  doc.setTextColor(15,23,42);
  doc.text("• Prioritas utama adalah memastikan seluruh anggota keluarga memiliki perlindungan dasar: kesehatan, penyakit kritis, dan jiwa bagi pencari nafkah.", 22, bottomY + 14, { maxWidth: 112 });
  doc.text("• Setelah perlindungan dasar terpenuhi, lanjutkan ke dana pendidikan, dana pensiun, distribusi aset, warisan, dan kebutuhan lain.", 22, bottomY + 22, { maxWidth: 112 });

  doc.setFillColor(255,250,242);
  doc.setDrawColor(242,190,120);
  doc.roundedRect(146, bottomY, pageWidth - 158, 28, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(204,102,0);
  doc.text("PRIORITAS BERIKUTNYA", 216, bottomY + 7, { align:"center" });
  const nextItems = [
    { label:"Dana Pensiun", color:[0,105,180], note:"Fungsi Akumulasi" },
    { label:"Distribusi Aset", color:[255,196,0], note:"Distribusi Kekayaan" },
    { label:"Warisan", color:[255,196,0], note:"Distribusi Kekayaan" },
    { label:"Pelunasan Hutang", color:[0,166,81], note:"Sesuai Kebutuhan" }
  ];
  nextItems.forEach((item, i) => {
    const nx = 158 + i * 31;
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.circle(nx + 10, bottomY + 12.2, 4.4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.4);
    doc.setTextColor(item.color[0], item.color[1], item.color[2]);
    doc.text(item.label, nx + 10, bottomY + 20.2, { align:"center", maxWidth:28 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.8);
    doc.setTextColor(82,96,112);
    doc.text(item.note, nx + 10, bottomY + 25, { align:"center", maxWidth:29 });
  });

  addPdfFooter(doc, pageNo + (doc.internal.getNumberOfPages() - startPageIndex));

  // Halaman CTA penutup, tanpa infografis 12 jenis asuransi agar PDF tetap fokus pada action plan.
  doc.addPage("a4", "landscape");
  const finalPageNo = pageNo + (doc.internal.getNumberOfPages() - startPageIndex);
  drawBackground();
  if(logoDataUrl){
    try{ doc.addImage(logoDataUrl, "PNG", pageWidth/2 - 34, 18, 68, 48, undefined, "FAST"); }catch(e){}
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(11,60,93);
  doc.text("Langkah Selanjutnya", pageWidth/2, 80, { align:"center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51,65,85);
  doc.text("Gunakan roadmap ini sebagai dasar diskusi untuk menentukan prioritas, budget, dan strategi perbaikan polis keluarga.", pageWidth/2, 91, { align:"center", maxWidth: 210 });

  doc.setFillColor(11,60,93);
  doc.roundedRect(48, 112, pageWidth - 96, 42, 8, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255,255,255);
  doc.text("Butuh Review Polis Lebih Detail?", 60, 127);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.3);
  doc.setTextColor(225,239,249);
  doc.text("Diskusikan gap polis, UP, limit kesehatan, dan urutan prioritas bersama Financial Planner.", 60, 137, { maxWidth: 145 });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255,255,255);
  doc.text("Septino, QWP®, CIS®", pageWidth - 60, 128, { align:"right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.text("WhatsApp: 0811-6946-999", pageWidth - 60, 138, { align:"right" });
  addPdfFooter(doc, finalPageNo);
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

    doc.addPage("a4", "landscape");
    addExecutiveSummaryPage(doc, logoDataUrl, 2);

    let pageNo = 3;
    state.keluarga.forEach(member => {
      doc.addPage("a4", "landscape");
      addMemberPage(doc, member, logoDataUrl, pageNo);
      pageNo++;
    });

    doc.addPage("a4", "landscape");
    addRoadmapPage(doc, logoDataUrl, pageNo);

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
