const STORAGE_KEY = "cerdas_finansial_review_polis_v1";
let activeMember = "kepala";
let state = loadState();

const presets = {
  kepala: {
    title: "1. KEPALA KELUARGA", theme: "red", icon:"bi-person-fill", label:"Kepala Keluarga",
    rows: [
      ["red","Asuransi Kesehatan","Proteksi Aset"],
      ["red","Asuransi Penyakit Kritis","Proteksi Income"],
      ["red","Asuransi Jiwa","Proteksi Income"],
      ["red","Asuransi Pendidikan Anak","Pendidikan Anak 1"],
      ["red","Asuransi Pendidikan Anak","Pendidikan Anak 2"],
      ["red","Asuransi Pendidikan Anak","Pendidikan Anak 3"],
      ["red","Asuransi Jiwa","Dana Pensiun Pasangan"],
      ["red","Asuransi Jiwa","Pelunasan Hutang"],
      ["red","Asuransi Jiwa","Biaya Pemakaman"],
      ["green","Asuransi Santunan Harian Rawat Inap","Proteksi Income"],
      ["green","Asuransi Cacat Tetap & Total","Proteksi Income"],
      ["green","Asuransi Kecelakaan","Proteksi Income"],
      ["yellow","Asuransi Jiwa","Biaya Distribusi Aset"],
      ["yellow","Asuransi Jiwa","Warisan"],
      ["blue","Asuransi Dana Pensiun","Persiapan Income Masa Pensiun"]
    ]
  },
  pasangan: {
    title: "2. PASANGAN", theme: "teal", icon:"bi-person-heart", label:"Pasangan",
    rows: [
      ["red","Asuransi Kesehatan","Proteksi Aset"],
      ["red","Asuransi Penyakit Kritis","Proteksi Income"],
      ["green","Asuransi Jiwa","Proteksi Income"],
      ["green","Asuransi Jiwa","Pendidikan Anak"],
      ["green","Asuransi Jiwa","Dana Pensiun Pasangan"],
      ["green","Asuransi Jiwa","Pelunasan Hutang"],
      ["green","Asuransi Jiwa","Biaya Pemakaman"],
      ["green","Asuransi Santunan Harian Rawat Inap","Proteksi Income"],
      ["green","Asuransi Cacat Tetap & Total","Proteksi Income"],
      ["green","Asuransi Kecelakaan","Proteksi Income"],
      ["yellow","Asuransi Jiwa","Biaya Distribusi Aset"],
      ["yellow","Asuransi Jiwa","Warisan"],
      ["blue","Asuransi Dana Pensiun","Persiapan Income Masa Pensiun"]
    ]
  },
  anak1: childPreset("1. ANAK PERTAMA", "green", "Anak Pertama"),
  anak2: childPreset("2. ANAK KEDUA", "blue", "Anak Kedua"),
  anak3: childPreset("3. ANAK KETIGA", "purple", "Anak Ketiga")
};

function childPreset(title, theme, label){
  return {title, theme, icon:"bi-emoji-smile", label, rows:[
    ["red","Asuransi Kesehatan","Proteksi Aset"],
    ["green","Asuransi Penyakit Kritis","Proteksi Income"],
    ["green","Asuransi Jiwa", title.includes("PERTAMA") ? "Biaya Distribusi Aset" : "Proteksi Income"],
    ["blue","Asuransi Dana Pendidikan","Akumulasi Dana Pendidikan"]
  ]};
}

function defaultMember(key){
  return { name:"", policies: presets[key].rows.map(r=>({ punya:false, brand:"", produk:"", manfaat:"", premi:"", masa:"", catatan:"" })) };
}
function defaultState(){
  const s = { family:{kepala:"", pasangan:"", jumlahAnak:3}, members:{} };
  Object.keys(presets).forEach(k=>s.members[k]=defaultMember(k));
  return s;
}
function loadState(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState(); }catch(e){ return defaultState(); }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function money(v){ return v || ""; }

function init(){
  document.getElementById("namaKepala").value = state.family.kepala || "";
  document.getElementById("namaPasangan").value = state.family.pasangan || "";
  document.getElementById("jumlahAnak").value = state.family.jumlahAnak || 3;
  renderFamilyGrid();
  renderMatrix();
}

function simpanKeluarga(){
  state.family.kepala = document.getElementById("namaKepala").value.trim();
  state.family.pasangan = document.getElementById("namaPasangan").value.trim();
  state.family.jumlahAnak = Number(document.getElementById("jumlahAnak").value || 3);
  if(!state.members.kepala.name && state.family.kepala) state.members.kepala.name = state.family.kepala;
  if(!state.members.pasangan.name && state.family.pasangan) state.members.pasangan.name = state.family.pasangan;
  saveState(); renderFamilyGrid(); renderMatrix();
}

function renderFamilyGrid(){
  const grid = document.getElementById("familyGrid");
  const keys = ["kepala","pasangan"];
  for(let i=1;i<=Number(state.family.jumlahAnak||3);i++) keys.push("anak"+i);
  grid.innerHTML = keys.map(k=>{
    const p=presets[k];
    const name = state.members[k]?.name || suggestedName(k);
    return `<div class="family-card ${activeMember===k?'active':''}" onclick="selectMember('${k}')">
      <i class="bi ${p.icon}"></i><h5>${p.label}</h5><p>${name || 'Belum diisi'}</p>
    </div>`;
  }).join("");
}
function suggestedName(k){
  if(k==="kepala") return state.family.kepala;
  if(k==="pasangan") return state.family.pasangan;
  return "";
}
function selectMember(key){ activeMember=key; if(!state.members[key]) state.members[key]=defaultMember(key); renderFamilyGrid(); renderMatrix(); }
function updateCurrentName(value){ state.members[activeMember].name=value; saveState(); renderFamilyGrid(); }

function renderMatrix(){
  const preset = presets[activeMember];
  if(!state.members[activeMember]) state.members[activeMember]=defaultMember(activeMember);
  document.getElementById("matrixTitle").textContent = preset.title + " - INSURANCE MATRIX";
  document.getElementById("matrixTitle").style.color = themeColor(preset.theme);
  document.getElementById("matrixName").value = state.members[activeMember].name || suggestedName(activeMember) || "";
  const body = document.getElementById("matrixBody");
  body.innerHTML = preset.rows.map((row,i)=>{
    const policy = state.members[activeMember].policies[i] || {};
    const punya = !!policy.punya;
    return `<tr>
      <td class="status-cell"><div class="status-band ${row[0]}"></div></td>
      <td class="row-no">${i+1}</td>
      <td class="row-category">${row[1]}</td>
      <td class="row-function">${row[2]}</td>
      <td>${punya ? (policy.brand||'-') : ''}</td>
      <td>${punya ? (policy.produk||'-') : ''}</td>
      <td>${punya ? (policy.manfaat||'-') : ''}</td>
      <td class="check-cell">${punya ? '' : '<span class="status-pill pill-none">Tidak Punya</span>'}</td>
      <td>${policy.catatan||''}</td>
      <td class="check-cell"><button class="edit-btn" onclick="openModal(${i})"><i class="bi bi-pencil-square"></i> Edit</button></td>
    </tr>`;
  }).join("");
  updateSummary();
}
function themeColor(theme){ return {red:'#b60000',teal:'#006f73',blue:'#084b8a',green:'#087b32',purple:'#6b2a8f'}[theme] || '#0b3c5d'; }
function updateSummary(){
  const policies = state.members[activeMember].policies;
  const total = presets[activeMember].rows.length;
  const owned = policies.filter(p=>p.punya).length;
  document.getElementById("sumTotal").textContent=total;
  document.getElementById("sumOwned").textContent=owned;
  document.getElementById("sumNone").textContent=total-owned;
  document.getElementById("sumScore").textContent=Math.round((owned/total)*100)+"%";
}
function openModal(index){
  const row = presets[activeMember].rows[index];
  const p = state.members[activeMember].policies[index] || {};
  document.getElementById("modalTitle").textContent = `${row[1]} - ${row[2]}`;
  document.getElementById("editIndex").value=index;
  document.getElementById("editPunya").value=p.punya?'ya':'tidak';
  document.getElementById("editBrand").value=p.brand||'';
  document.getElementById("editProduk").value=p.produk||'';
  document.getElementById("editManfaat").value=p.manfaat||'';
  document.getElementById("editPremi").value=p.premi||'';
  document.getElementById("editMasa").value=p.masa||'';
  document.getElementById("editCatatan").value=p.catatan||'';
  document.getElementById("editModal").style.display='flex';
}
function closeModal(){ document.getElementById("editModal").style.display='none'; }
function savePolicy(){
  const i = Number(document.getElementById("editIndex").value);
  state.members[activeMember].policies[i] = {
    punya: document.getElementById("editPunya").value === 'ya',
    brand: document.getElementById("editBrand").value.trim(),
    produk: document.getElementById("editProduk").value.trim(),
    manfaat: document.getElementById("editManfaat").value.trim(),
    premi: document.getElementById("editPremi").value.trim(),
    masa: document.getElementById("editMasa").value.trim(),
    catatan: document.getElementById("editCatatan").value.trim()
  };
  saveState(); closeModal(); renderMatrix();
}
function resetReview(){
  if(confirm('Reset semua data Review Polis?')){ localStorage.removeItem(STORAGE_KEY); state=defaultState(); activeMember='kepala'; init(); }
}

document.addEventListener('DOMContentLoaded', init);
