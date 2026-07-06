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


const WHATSAPP_QR_IMAGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAkACQAAD/4QECRXhpZgAATU0AKgAAAAgABwEOAAIAAAALAAAAYgESAAMAAAABAAEAAAEaAAUAAAABAAAAbgEbAAUAAAABAAAAdgEoAAMAAAABAAIAAAEyAAIAAAAUAAAAfodpAAQAAAABAAAAkgAAAABTY3JlZW5zaG90AAAAAACQAAAAAQAAAJAAAAABMjAyNjowNzowNiAxOTo0NzozNQAABZADAAIAAAAUAAAA1JKGAAcAAAASAAAA6KABAAMAAAAB//8AAKACAAQAAAABAAACs6ADAAQAAAABAAACcwAAAAAyMDI2OjA3OjA2IDE5OjQ3OjM1AEFTQ0lJAAAAU2NyZWVuc2hvdP/tAG5QaG90b3Nob3AgMy4wADhCSU0EBAAAAAAANhwBWgADGyVHHAIAAAIAAhwCeAAKU2NyZWVuc2hvdBwCPAAGMTk0NzM1HAI3AAgyMDI2MDcwNjhCSU0EJQAAAAAAEI3yckSmNWJzTxMplawrqoX/4gIoSUNDX1BST0ZJTEUAAQEAAAIYYXBwbAQAAABtbnRyUkdCIFhZWiAH5gABAAEAAAAAAABhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAADBjcHJ0AAABLAAAAFB3dHB0AAABfAAAABRyWFlaAAABkAAAABRnWFlaAAABpAAAABRiWFlaAAABuAAAABRyVFJDAAABzAAAACBjaGFkAAAB7AAAACxiVFJDAAABzAAAACBnVFJDAAABzAAAACBtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABQAAAAcAEQAaQBzAHAAbABhAHkAIABQADNtbHVjAAAAAAAAAAEAAAAMZW5VUwAAADQAAAAcAEMAbwBwAHkAcgBpAGcAaAB0ACAAQQBwAHAAbABlACAASQBuAGMALgAsACAAMgAwADIAMlhZWiAAAAAAAAD21QABAAAAANMsWFlaIAAAAAAAAIPfAAA9v////7tYWVogAAAAAAAASr8AALE3AAAKuVhZWiAAAAAAAAAoOAAAEQsAAMi5cGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltzZjMyAAAAAAABDEIAAAXe///zJgAAB5MAAP2Q///7ov///aMAAAPcAADAbv/AABEIAnMCswMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAICAgICAgMCAgMFAwMDBQYFBQUFBggGBgYGBggKCAgICAgICgoKCgoKCgoMDAwMDAwODg4ODg8PDw8PDw8PDw//2wBDAQIDAwQEBAcEBAcQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/3QAEACz/2gAMAwEAAhEDEQA/AP38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/0P38ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo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/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//V/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//W/fyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z";

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
  const kepala = state.keluarga.find(m => m.id === "kepala") || {};
  const pasangan = state.keluarga.find(m => m.id === "pasangan") || {};
  const jumlahAnak = state.keluarga.filter(m => String(m.id).startsWith("anak")).length;
  const tanggal = new Date().toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric" });

  // Background putih bersih + aksen lembut
  doc.setFillColor(255,255,255);
  doc.rect(0,0,pageWidth,pageHeight,"F");
  doc.setFillColor(236,246,253);
  doc.circle(20, 18, 54, "F");
  doc.setFillColor(252,242,220);
  doc.circle(pageWidth - 15, pageHeight - 18, 48, "F");

  // Red wave footer, dibuat lebih rendah agar tidak menabrak note
  doc.setFillColor(185,0,0);
  doc.triangle(0, pageHeight - 30, pageWidth, pageHeight - 14, 0, pageHeight, "F");
  doc.setFillColor(210,0,0);
  doc.triangle(0, pageHeight - 22, pageWidth, pageHeight - 6, 0, pageHeight, "F");
  doc.setFillColor(150,0,0);
  doc.triangle(0, pageHeight - 12, pageWidth, pageHeight, 0, pageHeight, "F");
  doc.setDrawColor(216,168,44);
  doc.setLineWidth(0.35);
  doc.line(8, pageHeight - 24, pageWidth - 8, pageHeight - 10);

  // Logo dan judul
  addLogoToPdf(doc, logoDataUrl, pageWidth/2 - 24, 15, 48, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(33);
  doc.setTextColor(185,0,0);
  doc.text("INSURANCE MATRIX", pageWidth/2, 68, { align:"center" });
  doc.setFontSize(16);
  doc.setTextColor(32,38,46);
  doc.text("Laporan Review Polis Keluarga", pageWidth/2, 83, { align:"center" });

  // Data keluarga card
  const cardW = 152;
  const cardH = 62;
  const cardX = (pageWidth - cardW) / 2;
  const cardY = 96;
  doc.setFillColor(255,255,255);
  doc.setDrawColor(235,120,120);
  doc.setLineWidth(0.28);
  doc.roundedRect(cardX, cardY, cardW, cardH, 4, 4, "FD");

  const rows = [
    ["Kepala Keluarga", kepala.nama || "-"],
    ["Status", state.statusMenikah === "menikah" ? "Sudah Menikah" : "Belum Menikah"],
    ["Pasangan", pasangan.nama || "-"],
    ["Jumlah Anak", String(jumlahAnak)],
    ["Tanggal Review", tanggal]
  ];

  rows.forEach((row, i) => {
    const y = cardY + 12 + i * 11;
    doc.setFillColor(190,0,0);
    doc.circle(cardX + 15, y - 1.4, 4.2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.2);
    doc.setTextColor(24,24,27);
    doc.text(row[0], cardX + 27, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.2);
    doc.text(":", cardX + 86, y);
    doc.text(safePdfText(row[1]), cardX + 91, y, { maxWidth: cardW - 98 });
  });

  // Note khusus cover, posisinya tidak menyentuh wave/footer
  const noteX = (pageWidth - 174) / 2;
  const noteY = 162;
  const noteW = 174;
  const noteH = 20;
  doc.setFillColor(255,240,240);
  doc.setDrawColor(255,190,190);
  doc.setLineWidth(0.28);
  doc.roundedRect(noteX, noteY, noteW, noteH, 4, 4, "FD");
  doc.setFillColor(190,0,0);
  doc.circle(noteX + 16, noteY + noteH/2, 5.2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255,255,255);
  doc.text("!", noteX + 16, noteY + noteH/2 + 4, { align:"center" });
  doc.setFontSize(9.8);
  doc.setTextColor(190,0,0);
  doc.text("Table ini harus di-review kembali setiap tahun agar", noteX + 30, noteY + 8);
  doc.text("manfaat polis masih sesuai dengan fungsi dan tujuan keuangan.", noteX + 30, noteY + 15);

  // Footer cover di atas wave merah
  doc.setDrawColor(255,255,255);
  doc.setLineWidth(0.18);
  doc.line(12, pageHeight - 18, pageWidth - 12, pageHeight - 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.setTextColor(255,255,255);
  doc.text("Cerdas Finansial | Insurance Matrix Report", 12, pageHeight - 10);
  doc.text("Halaman 1", pageWidth - 12, pageHeight - 10, { align:"right" });
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
  doc.setTextColor(255,255,255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.text(text, x + 5, y + 6.7, { align:"center" });
}

function cfExecInfoCard(doc, x, y, w, title, value, color, icon){
  cfExecRoundRect(doc, x, y, w, 22, 4, [255,255,255], [220,232,242]);
  cfExecDrawIconBox(doc, x + 5, y + 6, color, icon);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.7);
  doc.setTextColor(100,116,139);
  doc.text(title.toUpperCase(), x + 18, y + 8.3, { maxWidth:w - 20 });
  doc.setFontSize(9.5);
  doc.setTextColor(11,60,93);
  doc.text(cfExecSafeText(value), x + 18, y + 16.3, { maxWidth:w - 20 });
}

function cfExecStatCard(doc, x, y, w, value, title, subtitle, color, icon){
  cfExecRoundRect(doc, x, y, w, 29, 4.5, [255,255,255], [220,232,242]);
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(x, y, w, 2.6, 1.4, 1.4, "F");
  cfExecDrawIconBox(doc, x + 8, y + 9.5, color, icon);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18.5);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(String(value), x + w/2 + 10, y + 14.5, { align:"center" });
  doc.setFontSize(7.7);
  doc.setTextColor(15,23,42);
  doc.text(title, x + w/2 + 10, y + 22, { align:"center", maxWidth:w - 22 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(71,85,105);
  doc.text(subtitle, x + w/2 + 10, y + 26.6, { align:"center", maxWidth:w - 22 });
}

function cfExecProgress(doc, x, y, w, label, percent, color){
  const barX = x + 34;
  const barW = w - 52;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15,23,42);
  doc.text(label, x, y + 2.6);
  doc.setFillColor(230,237,246);
  doc.roundedRect(barX, y, barW, 4.7, 2.3, 2.3, "F");
  if(percent > 0){
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(barX, y, Math.max(3, barW * percent / 100), 4.7, 2.3, 2.3, "F");
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(`${percent}%`, x + w, y + 3.2, { align:"right" });
}

function addExecutiveSummaryPage(doc, logoDataUrl, pageNo){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const data = getExecutiveSummaryData();
  const tanggal = new Date().toLocaleDateString("id-ID", { day:"2-digit", month:"long", year:"numeric" });

  // Base
  doc.setFillColor(255,255,255);
  doc.rect(0,0,pageWidth,pageHeight,"F");
  doc.setFillColor(241,248,253);
  doc.circle(-8, -4, 44, "F");
  doc.setFillColor(253,241,215);
  doc.circle(pageWidth + 18, pageHeight + 10, 48, "F");
  doc.setFillColor(11,60,93);
  doc.triangle(pageWidth - 24, 0, pageWidth, 0, pageWidth, 24, "F");
  doc.setFillColor(242,190,84);
  doc.triangle(pageWidth - 44, 0, pageWidth - 31, 0, pageWidth, 31, "F");

  // Header card
  cfExecRoundRect(doc, 10, 9, pageWidth - 20, 28, 5, [255,255,255], [220,232,242]);
  if(logoDataUrl){
    try{ doc.addImage(logoDataUrl, "PNG", 25, 13, 24, 18, undefined, "FAST"); }catch(e){}
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.setTextColor(11,60,93);
  doc.text("EXECUTIVE SUMMARY", pageWidth/2, 20.3, { align:"center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.2);
  doc.setTextColor(51,65,85);
  doc.text("Review Polis Keluarga", pageWidth/2 - 6, 28, { align:"right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0,105,180);
  doc.text("Cerdas Finansial", pageWidth/2 - 4, 28);
  doc.setFillColor(201,154,54);
  doc.roundedRect(pageWidth - 52, 16, 34, 5.2, 2.6, 2.6, "F");
  doc.setTextColor(255,255,255);
  doc.setFontSize(5.2);
  doc.text("CONFIDENTIAL", pageWidth - 35, 19.6, { align:"center" });

  // Family info cards - no KG/PS/etc
  const infoY = 43;
  const gap = 3;
  const infoW = (pageWidth - 20 - gap*4) / 5;
  const infoItems = [
    {title:"Kepala Keluarga", value:data.kepala?.nama || "-", color:[11,60,93], icon:"KK"},
    {title:"Pasangan", value:data.pasangan?.nama || "-", color:[124,58,237], icon:"P"},
    {title:"Anak", value:`${data.anak.length} Orang`, color:[0,105,180], icon:"A"},
    {title:"Tanggal Review", value:tanggal, color:[201,154,54], icon:"T"},
    {title:"Financial Planner", value:"Septino, QWP®, CIS®", color:[11,60,93], icon:"FP"}
  ];
  infoItems.forEach((item, i) => cfExecInfoCard(doc, 10 + i*(infoW+gap), infoY, infoW, item.title, item.value, item.color, item.icon));

  // KPI cards
  const statY = 72;
  const statGap = 4;
  const statW = (pageWidth - 20 - statGap*3) / 4;
  cfExecStatCard(doc, 10, statY, statW, `${data.stats.score}%`, "Skor Kesiapan", "Perlindungan keluarga", [11,60,93], "S");
  cfExecStatCard(doc, 10 + (statW+statGap), statY, statW, data.stats.total, "Kebutuhan Polis", "Total kebutuhan", [0,105,180], "P");
  cfExecStatCard(doc, 10 + (statW+statGap)*2, statY, statW, data.stats.owned, "Sudah Dimiliki", "Polis tersedia", [0,166,81], "OK");
  cfExecStatCard(doc, 10 + (statW+statGap)*3, statY, statW, data.stats.missing, "Perlu Dilengkapi", "Gap perlindungan", [224,0,0], "!");

  // Main panels - keep all above bottom conclusion to avoid overlap
  const panelY = 109;
  const panelH = 68;
  const leftX = 10;
  const leftW = 137;
  const rightX = 154;
  const rightW = pageWidth - rightX - 10;

  // Protection panel
  cfExecRoundRect(doc, leftX, panelY, leftW, panelH, 4, [255,255,255], [220,232,242]);
  cfExecDrawIconBox(doc, leftX + 6, panelY + 7, [11,60,93], "CF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.6);
  doc.setTextColor(11,60,93);
  doc.text("KONDISI PERLINDUNGAN", leftX + 19, panelY + 13.5);
  doc.setDrawColor(226,232,240);
  doc.line(leftX + 19, panelY + 17, leftX + leftW - 8, panelY + 17);
  let py = panelY + 30;
  data.categories.forEach(cat => {
    cfExecProgress(doc, leftX + 9, py, leftW - 18, cat.label, cat.progress.percent, cat.color);
    py += 10.6;
  });

  // Findings panel
  cfExecRoundRect(doc, rightX, panelY, rightW, 38, 4, [255,255,255], [220,232,242]);
  cfExecDrawIconBox(doc, rightX + 6, panelY + 7, [11,60,93], "!");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.6);
  doc.setTextColor(11,60,93);
  doc.text("TEMUAN UTAMA", rightX + 19, panelY + 13.5);
  doc.setDrawColor(226,232,240);
  doc.line(rightX + 19, panelY + 17, pageWidth - 17, panelY + 17);
  const findings = data.categories.map(cat => {
    if(cat.progress.percent >= 80) return { sign:"✓", color:[0,166,81], text:`${cat.label} keluarga sudah baik.` };
    if(cat.progress.percent > 0) return { sign:"!", color:[230,142,0], text:`${cat.label} masih perlu dilengkapi.` };
    return { sign:"!", color:[230,142,0], text:`${cat.label} belum tersedia.` };
  });
  let fy = panelY + 26;
  findings.slice(0,5).forEach((f, i) => {
    doc.setFillColor(f.color[0], f.color[1], f.color[2]);
    doc.circle(rightX + 9, fy - 1.7, 2.2, "F");
    doc.setTextColor(255,255,255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4.5);
    doc.text(f.sign, rightX + 9, fy, { align:"center" });
    doc.setTextColor(15,23,42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.15);
    doc.text(cfExecSafeText(f.text), rightX + 14, fy, { maxWidth:rightW - 21 });
    if(i < 4){ doc.setDrawColor(226,232,240); doc.line(rightX + 14, fy + 3.1, pageWidth - 16, fy + 3.1); }
    fy += 6.2;
  });

  // Priorities panel
  const prY = panelY + 42;
  cfExecRoundRect(doc, rightX, prY, rightW, 26, 4, [255,255,255], [220,232,242]);
  cfExecDrawIconBox(doc, rightX + 6, prY + 6.5, [11,60,93], "★");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.4);
  doc.setTextColor(11,60,93);
  doc.text("3 PRIORITAS TERATAS", rightX + 19, prY + 12.5);
  const priorities = (data.priorities && data.priorities.length ? data.priorities : ["Review Polis Wajib", "Lengkapi Proteksi", "Review Tahunan"]).slice(0,3);
  const pW = (rightW - 25) / 3;
  const pColors = [[224,0,0],[230,142,0],[0,105,180]];
  priorities.forEach((item, i) => {
    const bx = rightX + 19 + i*(pW + 3);
    const by = prY + 15.3;
    doc.setFillColor(pColors[i][0], pColors[i][1], pColors[i][2]);
    doc.roundedRect(bx, by, pW, 8, 2.2, 2.2, "F");
    doc.setFillColor(255,255,255);
    doc.circle(bx + 5, by + 4, 2.6, "F");
    doc.setTextColor(pColors[i][0], pColors[i][1], pColors[i][2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.text(String(i+1), bx + 5, by + 5.8, { align:"center" });
    doc.setTextColor(255,255,255);
    doc.setFontSize(6.3);
    doc.text(cfExecSafeText(item), bx + 11, by + 5.3, { maxWidth:pW - 12 });
  });

  // Conclusion bottom, no overlap
  const conclY = 184;
  cfExecRoundRect(doc, 10, conclY, pageWidth - 20, 15, 4, [245,250,255], [220,232,242]);
  cfExecDrawIconBox(doc, 16, conclY + 3, [11,60,93], "FP");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(11,60,93);
  doc.text("KESIMPULAN FINANCIAL PLANNER", 29, conclY + 6.2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.05);
  doc.setTextColor(30,41,59);
  const conclusion = `Skor kesiapan perlindungan keluarga saat ini ${data.stats.score}%. Fokus utama adalah melengkapi proteksi wajib terlebih dahulu, kemudian menyiapkan dana pendidikan dan dana pensiun secara bertahap.`;
  doc.text(conclusion, 29, conclY + 11.2, { maxWidth:pageWidth - 100, lineHeightFactor:1.05 });
  doc.setDrawColor(148,163,184);
  doc.line(pageWidth - 67, conclY + 3, pageWidth - 67, conclY + 12);
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(10.5);
  doc.setTextColor(11,60,93);
  doc.text("Septino, QWP®, CIS®", pageWidth - 39, conclY + 7.2, { align:"center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.text("Financial Planner", pageWidth - 39, conclY + 12, { align:"center" });

  drawPdfFooter(doc, pageNo || 2);
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

  // Catatan tahunan hanya ditampilkan di halaman cover agar halaman matrix lebih bersih.
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



/* v21: PDF dibuat lebih sederhana: tanpa Executive Summary, tanpa timeline/roadmap, tanpa infografis 12 jenis */
function drawSimplePdfBackground(doc){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(248,252,255);
  doc.rect(0,0,pageWidth,pageHeight,"F");
  doc.setFillColor(232,242,250);
  doc.circle(14, 18, 34, "F");
  doc.setFillColor(246,230,198);
  doc.circle(pageWidth - 16, pageHeight - 8, 38, "F");
}

function drawSimplePageTitle(doc, logoDataUrl, title, subtitle){
  const pageWidth = doc.internal.pageSize.getWidth();
  drawSimplePdfBackground(doc);
  addLogoToPdf(doc, logoDataUrl, 14, 9, 32, 22);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(11,60,93);
  doc.text(title, pageWidth/2, 18, { align:"center" });
  if(subtitle){
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71,85,105);
    doc.text(subtitle, pageWidth/2, 27, { align:"center", maxWidth:220 });
  }
}

function drawGapStatCard(doc, x, y, w, title, value, subtitle, color){
  doc.setFillColor(255,255,255);
  doc.setDrawColor(220,232,242);
  doc.roundedRect(x, y, w, 22, 4, 4, "FD");
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(x, y, 3, 22, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(color[0], color[1], color[2]);
  doc.text(String(value), x + 9, y + 11);
  doc.setFontSize(7.2);
  doc.setTextColor(11,60,93);
  doc.text(title, x + 27, y + 8.2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.setTextColor(100,116,139);
  doc.text(subtitle, x + 27, y + 15.2, { maxWidth:w - 30 });
}

function drawGapMemberCard(doc, member, items, x, y, w, h){
  const isPasangan = member.id === "pasangan";
  const isAnak = String(member.id).startsWith("anak");
  const theme = isPasangan ? [126,58,164] : (isAnak ? [13,101,183] : [11,60,93]);

  doc.setFillColor(255,255,255);
  doc.setDrawColor(208,222,235);
  doc.roundedRect(x, y, w, h, 4, 4, "FD");

  doc.setFillColor(theme[0], theme[1], theme[2]);
  doc.roundedRect(x, y, w, 17, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255,255,255);
  doc.text(safePdfText(member.nama || member.label || "-"), x + 7, y + 7.2, { maxWidth:w - 14 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.1);
  doc.setTextColor(235,245,255);
  doc.text(getMemberRoleLabel(member), x + 7, y + 13.2, { maxWidth:w - 14 });

  let cy = y + 25;
  if(!items.length){
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(46,139,87);
    doc.text("Polis wajib utama sudah lengkap.", x + 7, cy);
    return;
  }

  const shown = items.slice(0,5);
  shown.forEach((item, idx) => {
    const color = getRoadmapColor(item);
    drawTinyIcon(doc, getRoadmapIconType(item), x + 8.5, cy - 1.5, color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(getRoadmapShortTitle(item), x + 15, cy - 2.8, { maxWidth:w - 22 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.6);
    doc.setTextColor(30,41,59);
    doc.text(getRoadmapShortReason(item), x + 15, cy + 3.0, { maxWidth:w - 22 });
    if(idx < shown.length - 1){
      doc.setDrawColor(226,232,240);
      doc.line(x + 7, cy + 8.2, x + w - 7, cy + 8.2);
    }
    cy += 14.5;
  });

  if(items.length > shown.length){
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.2);
    doc.setTextColor(100,116,139);
    doc.text(`+${items.length - shown.length} kebutuhan lain`, x + 7, y + h - 6);
  }
}

function drawGapMemberFullRow(doc, group, x, y, w){
  const member = group.member;
  const items = group.items || [];
  const isPasangan = member.id === "pasangan";
  const isAnak = String(member.id).startsWith("anak");
  const theme = isPasangan ? [126,58,164] : (isAnak ? [13,101,183] : [11,60,93]);
  const headerH = 11;
  const itemH = 9.6;
  const h = Math.max(24, headerH + 7 + Math.max(1, items.length) * itemH);

  doc.setFillColor(255,255,255);
  doc.setDrawColor(208,222,235);
  doc.roundedRect(x, y, w, h, 4, 4, "FD");

  // Header member
  doc.setFillColor(theme[0], theme[1], theme[2]);
  doc.roundedRect(x, y, w, headerH, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.6);
  doc.setTextColor(255,255,255);
  doc.text(safePdfText(member.nama || member.label || "-"), x + 7, y + 7.2, { maxWidth:70 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.4);
  doc.setTextColor(235,245,255);
  doc.text(getMemberRoleLabel(member), x + 78, y + 7.2, { maxWidth:w - 86 });

  if(!items.length){
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    doc.setTextColor(46,139,87);
    doc.text("Polis wajib utama sudah lengkap.", x + 7, y + headerH + 11);
    return h;
  }

  let cy = y + headerH + 7.5;
  items.forEach((item, idx) => {
    const color = getRoadmapColor(item);
    drawTinyIcon(doc, getRoadmapIconType(item), x + 9, cy - 1.8, color);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.9);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(getRoadmapShortTitle(item), x + 17, cy - 2.8, { maxWidth:78 });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    doc.setTextColor(30,41,59);
    doc.text(getRoadmapShortReason(item), x + 104, cy - 2.8, { maxWidth:w - 112 });

    if(idx < items.length - 1){
      doc.setDrawColor(232,238,245);
      doc.line(x + 7, cy + 4.0, x + w - 7, cy + 4.0);
    }
    cy += itemH;
  });

  return h;
}

function addGapPriorityPage(doc, logoDataUrl, pageNo){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const stats = getFamilyReviewStats();
  const allItems = getWajibRecommendationsByFamily(999);

  drawSimplePageTitle(
    doc,
    logoDataUrl,
    "YANG HARUS DILENGKAPI",
    "Ringkasan kebutuhan polis wajib berdasarkan data keluarga dan hasil review matrix."
  );

  // Stat card dibuat lebih compact agar ruang daftar prioritas lebih lega.
  const statY = 36;
  const statW = (pageWidth - 30 - 9) / 4;
  drawGapStatCard(doc, 15, statY, statW, "Skor Kesiapan", `${stats.score}%`, "Kelengkapan proteksi keluarga", [11,60,93]);
  drawGapStatCard(doc, 15 + (statW + 3), statY, statW, "Total Kebutuhan", stats.total, "Item dalam matrix keluarga", [13,101,183]);
  drawGapStatCard(doc, 15 + (statW + 3)*2, statY, statW, "Sudah Dimiliki", stats.owned, "Polis tersedia", [0,166,81]);
  drawGapStatCard(doc, 15 + (statW + 3)*3, statY, statW, "Belum Dimiliki", stats.missing, "Gap perlindungan", [220,0,0]);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(180,0,0);
  doc.text(`${allItems.length || 0} item polis wajib perlu diprioritaskan`, 15, 67);

  const grouped = state.keluarga
    .slice()
    .sort((a,b) => getMemberSortOrder(a) - getMemberSortOrder(b))
    .map(member => ({ member, items: allItems.filter(item => item.member.id === member.id) }))
    .filter(group => group.items.length > 0);

  if(!grouped.length){
    doc.setFillColor(240,253,244);
    doc.setDrawColor(187,247,208);
    doc.roundedRect(15, 76, pageWidth - 30, 42, 5, 5, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(22,101,52);
    doc.text("Seluruh polis wajib utama sudah lengkap.", pageWidth/2, 95, { align:"center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Lakukan review berkala setiap tahun agar manfaat polis tetap sesuai kebutuhan keluarga.", pageWidth/2, 105, { align:"center" });
    addPdfFooter(doc, pageNo);
    return pageNo;
  }

  // Layout baru: 1 orang = 1 baris full width, sehingga tidak pecah/berantakan seperti 2 kolom.
  const x = 15;
  const w = pageWidth - 30;
  let y = 74;
  grouped.forEach((group) => {
    const itemH = 9.6;
    const estimatedH = Math.max(24, 11 + 7 + Math.max(1, group.items.length) * itemH);
    if(y + estimatedH > pageHeight - 18){
      addPdfFooter(doc, pageNo);
      doc.addPage("a4", "landscape");
      pageNo++;
      drawSimplePageTitle(doc, logoDataUrl, "YANG HARUS DILENGKAPI", "Lanjutan daftar kebutuhan polis wajib keluarga.");
      y = 42;
    }
    const h = drawGapMemberFullRow(doc, group, x, y, w);
    y += h + 4.2;
  });

  addPdfFooter(doc, pageNo);
  return pageNo;
}

function buildPlannerAnalysisText(){
  const stats = getFamilyReviewStats();
  const wajib = getWajibRecommendationsByFamily(999);
  const anakCount = state.keluarga.filter(m => String(m.id).startsWith("anak")).length;
  const pasangan = state.keluarga.find(m => m.id === "pasangan");
  const kepala = state.keluarga.find(m => m.id === "kepala");

  const kondisi = [];
  kondisi.push(`Data keluarga ${kepala?.nama || "klien"} sudah tersusun dan dapat digunakan sebagai dasar review polis.`);
  if(stats.missing > 0) kondisi.push(`Masih terdapat ${stats.missing} item perlindungan yang belum dimiliki atau belum tercatat.`);
  else kondisi.push("Seluruh item perlindungan utama sudah tercatat dalam matrix.");
  if(pasangan && state.statusPasangan === "kerja") kondisi.push("Pasangan memiliki income, sehingga proteksi income pasangan perlu ikut diperhatikan.");
  if(anakCount > 0) kondisi.push(`Terdapat ${anakCount} anak sehingga kebutuhan kesehatan anak dan persiapan pendidikan perlu menjadi bagian dari review.`);

  const rekom = [];
  const hasHealth = wajib.some(i => getRoadmapIconType(i) === "health");
  const hasCritical = wajib.some(i => getRoadmapIconType(i) === "critical");
  const hasLife = wajib.some(i => getRoadmapIconType(i) === "life");
  const hasEducation = wajib.some(i => getRoadmapIconType(i) === "education");
  if(hasHealth) rekom.push("Lengkapi perlindungan kesehatan untuk anggota keluarga yang belum memiliki perlindungan memadai.");
  if(hasCritical) rekom.push("Tambahkan proteksi penyakit kritis agar dana keluarga tidak terganggu saat terjadi risiko penyakit serius.");
  if(hasLife) rekom.push("Pastikan pencari nafkah memiliki uang pertanggungan jiwa yang cukup untuk menjaga biaya hidup keluarga.");
  if(hasEducation) rekom.push("Mulai persiapkan dana pendidikan anak secara bertahap setelah perlindungan dasar terpenuhi.");
  if(!rekom.length) rekom.push("Pertahankan perlindungan yang sudah ada dan lakukan review ulang minimal satu kali setahun.");

  const kesimpulan = stats.score < 60
    ? "Berdasarkan hasil review, kesiapan perlindungan keluarga masih perlu diperkuat. Fokus utama adalah melengkapi polis wajib terlebih dahulu agar keluarga memiliki fondasi perlindungan yang lebih aman."
    : "Berdasarkan hasil review, perlindungan keluarga sudah mulai terbentuk. Langkah berikutnya adalah menyempurnakan gap yang masih ada dan memastikan manfaat polis tetap sesuai tujuan keuangan keluarga.";

  return { kondisi, rekom, kesimpulan };
}

function drawAnalysisSection(doc, title, lines, x, y, w){
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(11,60,93);
  doc.text(title, x, y);
  doc.setDrawColor(220,228,238);
  doc.line(x, y + 4, x + w, y + 4);
  let cy = y + 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.setTextColor(30,41,59);
  lines.forEach(line => {
    doc.setFillColor(0,166,81);
    doc.circle(x + 2.5, cy - 2, 1.6, "F");
    const wrapped = doc.splitTextToSize(line, w - 10);
    doc.text(wrapped, x + 7, cy);
    cy += Math.max(8, wrapped.length * 4.5 + 3);
  });
  return cy;
}

function addPlannerAnalysisPage(doc, logoDataUrl, pageNo){
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const waUrl = "https://wa.me/628116946999";

  // Background bersih, senada dengan cover
  doc.setFillColor(255,255,255);
  doc.rect(0,0,pageWidth,pageHeight,"F");
  doc.setFillColor(236,246,253);
  doc.circle(12, 10, 54, "F");
  doc.setFillColor(252,242,220);
  doc.circle(pageWidth - 18, pageHeight - 18, 48, "F");

  // Wave footer merah
  doc.setFillColor(185,0,0);
  doc.triangle(0, pageHeight - 29, pageWidth, pageHeight - 13, 0, pageHeight, "F");
  doc.setFillColor(210,0,0);
  doc.triangle(0, pageHeight - 22, pageWidth, pageHeight - 6, 0, pageHeight, "F");
  doc.setFillColor(150,0,0);
  doc.triangle(0, pageHeight - 11, pageWidth, pageHeight, 0, pageHeight, "F");
  doc.setDrawColor(216,168,44);
  doc.setLineWidth(0.35);
  doc.line(10, pageHeight - 23, pageWidth - 10, pageHeight - 10);

  // Header
  addLogoToPdf(doc, logoDataUrl, pageWidth/2 - 17, 9, 34, 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(185,0,0);
  doc.text("ANALISA FINANCIAL PLANNER", pageWidth/2, 43, { align:"center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.2);
  doc.setTextColor(71,85,105);
  doc.text("Kesimpulan singkat berdasarkan hasil Review Polis Cerdas Finansial.", pageWidth/2, 52, { align:"center" });

  // Card utama
  const cardX = 28;
  const cardY = 62;
  const cardW = pageWidth - 56;
  const cardH = 98;
  doc.setFillColor(255,255,255);
  doc.setDrawColor(235,120,120);
  doc.setLineWidth(0.35);
  doc.roundedRect(cardX, cardY, cardW, cardH, 5, 5, "FD");

  // Bagian ringkasan
  doc.setFillColor(11,60,93);
  doc.circle(cardX + 24, cardY + 23, 13, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255,255,255);
  doc.text("✓", cardX + 24, cardY + 28, { align:"center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(11,60,93);
  doc.text("Hasil Review Polis", cardX + 45, cardY + 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.6);
  doc.setTextColor(30,41,59);
  const paragraph = "Laporan ini merupakan hasil analisis awal berdasarkan data yang telah diinput. Hasil review ini dapat digunakan sebagai referensi untuk melihat kondisi perlindungan keluarga saat ini.";
  doc.text(doc.splitTextToSize(paragraph, cardW - 72), cardX + 45, cardY + 27);

  doc.setDrawColor(230,150,150);
  doc.setLineWidth(0.25);
  doc.line(cardX + 16, cardY + 48, cardX + cardW - 16, cardY + 48);

  // Bagian CTA WhatsApp
  const ctaTop = cardY + 58;
  const leftX = cardX + 22;
  const qrSize = 37;
  const qrX = cardX + cardW - 62;
  const qrY = ctaTop - 8;
  const dividerX = qrX - 16;

  doc.setFillColor(0,166,81);
  doc.circle(leftX + 13, ctaTop + 12, 13, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255,255,255);
  doc.text("WA", leftX + 13, ctaTop + 16, { align:"center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.2);
  doc.setTextColor(185,0,0);
  doc.text("Butuh Penjelasan Lebih Detail?", leftX + 35, ctaTop + 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.6);
  doc.setTextColor(30,41,59);
  const ctaText = "Silakan scan QR Code atau hubungi WhatsApp untuk mendapatkan penjelasan dan rekomendasi yang lebih sesuai dengan kondisi keluarga Anda.";
  doc.text(doc.splitTextToSize(ctaText, dividerX - leftX - 43), leftX + 35, ctaTop + 13);

  doc.setDrawColor(235,120,120);
  doc.setLineWidth(0.25);
  doc.line(dividerX, ctaTop - 10, dividerX, ctaTop + 34);

  // QR Code WhatsApp
  try{
    doc.addImage(WHATSAPP_QR_IMAGE, "JPEG", qrX, qrY, qrSize, qrSize, undefined, "FAST");
    doc.link(qrX, qrY, qrSize, qrSize, { url: waUrl });
  }catch(e){
    doc.setDrawColor(0,0,0);
    doc.rect(qrX, qrY, qrSize, qrSize);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(0,0,0);
    doc.text("QR WhatsApp", qrX + qrSize/2, qrY + qrSize/2, { align:"center" });
  }

  doc.setFillColor(185,0,0);
  doc.roundedRect(qrX + 2, qrY + qrSize + 3, qrSize - 4, 7.5, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255,255,255);
  doc.text("Scan untuk Chat", qrX + qrSize/2, qrY + qrSize + 8, { align:"center" });
  doc.link(qrX + 2, qrY + qrSize + 3, qrSize - 4, 7.5, { url: waUrl });

  // Nomor WhatsApp di dalam card, tidak keluar border
  const phoneY = cardY + cardH - 13;
  doc.setFillColor(255,244,244);
  doc.setDrawColor(245,210,210);
  doc.roundedRect(cardX + 61, phoneY - 5, 118, 12, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(11,60,93);
  doc.text("WhatsApp:", cardX + 80, phoneY + 2, { align:"right" });
  doc.setFontSize(13);
  doc.setTextColor(185,0,0);
  doc.text("0811-6946-999", cardX + 85, phoneY + 2);
  doc.link(cardX + 61, phoneY - 5, 118, 12, { url: waUrl });

  // Signature / Planner
  const sigY = 176;
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(14);
  doc.setTextColor(11,60,93);
  doc.text("Septino, QWP®, CIS®", pageWidth/2, sigY, { align:"center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.6);
  doc.setTextColor(71,85,105);
  doc.text("Financial Planner", pageWidth/2, sigY + 7, { align:"center" });
  doc.setDrawColor(216,168,44);
  doc.setLineWidth(0.4);
  doc.line(pageWidth/2 - 12, sigY + 12, pageWidth/2 + 12, sigY + 12);

  // Footer di atas wave
  doc.setDrawColor(255,255,255);
  doc.setLineWidth(0.18);
  doc.line(12, pageHeight - 18, pageWidth - 12, pageHeight - 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.setTextColor(255,255,255);
  doc.text("Cerdas Finansial | Insurance Matrix Report", 12, pageHeight - 10);
  doc.text(`Halaman ${pageNo}`, pageWidth - 12, pageHeight - 10, { align:"right" });
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

    let pageNo = 1;
    addCoverPage(doc, logoDataUrl);

    // Halaman matrix per anggota keluarga.
    state.keluarga.forEach(member => {
      pageNo++;
      doc.addPage("a4", "landscape");
      addMemberPage(doc, member, logoDataUrl, pageNo);
    });

    // Halaman penutup: Analisa Financial Planner + CTA WhatsApp.
    // Halaman Yang Harus Dilengkapi / Executive Summary / Timeline / Roadmap / Infografis dihapus agar PDF lebih singkat.
    pageNo++;
    doc.addPage("a4", "landscape");
    addPlannerAnalysisPage(doc, logoDataUrl, pageNo);

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
