const TARGETS = {
  sd:{label:'SD Swasta',usia:6,lama:6},
  smp:{label:'SMP Swasta',usia:12,lama:3},
  sma:{label:'SMA Swasta',usia:15,lama:3},
  s1dn:{label:'S1 Dalam Negeri',usia:18,lama:4},
  s1ln:{label:'S1 Luar Negeri',usia:18,lama:4},
  kedokteran:{label:'Kedokteran',usia:18,lama:6},
  s2dn:{label:'S2 Dalam Negeri',usia:22,lama:2},
  s2ln:{label:'S2 Luar Negeri',usia:22,lama:2},
  custom:{label:'Custom',usia:'',lama:''}
};

const FP = {
  whatsapp:'628116946999',
  phone:'0811-6946-999',
  email:'septinogao@gmail.com',
  ig:'@septino.gao',
  instagram:'https://instagram.com/septino.gao',
  name:'Septino, QWP®, CIS®',
  title:'Financial Planner & Insurance Consultant'
};

let last = null;
let refs = {};

function $(id){ return document.getElementById(id); }
function q(sel){ return document.querySelector(sel); }
function qa(sel){ return [...document.querySelectorAll(sel)]; }

function initRefs(){
  const ids = [
    'simulasiForm','tahunSekarang','namaAyah','usiaAyah','namaIbu','usiaIbu','usiaPensiun',
    'namaAnak','usiaAnak','targetPendidikan','usiaMasuk','lamaStudi','biayaSaatIni','inflasi',
    'danaAda','catatan','periodePersiapan','periodeInfo','customTahunBox','customTahun','pensionWarning',
    'sisaWaktu','danaDibutuhkan','kekuranganDana','setoranBulanan','ringkasanText','insightOrtu',
    'tabelDana','ctaSection','readinessScore','readinessBar','readinessText','readinessChecklist'
  ];
  ids.forEach(id => refs[id] = $(id));
}

function bersih(v){ return Number(String(v ?? '').replace(/\D/g,'')) || 0; }
function rupiah(n){ return Number(n || 0).toLocaleString('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}); }
function formatIfMoney(el){
  if(!el || !el.classList.contains('money-input')) return;
  const raw = String(el.value || '').trim();
  if(raw === '') return;
  el.value = bersih(raw).toLocaleString('id-ID');
}
function formatTahun(v){
  const num = Number(v || 0);
  if(!isFinite(num) || num <= 0) return '0 Tahun';
  const y = Math.floor(num);
  const m = Math.round((num-y)*12);
  if(y <= 0 && m > 0) return `${m} Bulan`;
  return y + (m ? ` Tahun ${m} Bulan` : ' Tahun');
}
function strategiLabel(){
  const v = rate();
  if(v === 0.02) return 'Konservatif (1–2%)';
  if(v === 0.06) return 'Agresif (6% ke atas)';
  return 'Moderat (3–5%)';
}
function rate(){ return Number(q('input[name="strategiInvestasi"]:checked')?.value || 0.04); }
function inflasiNum(){ return Number(refs.inflasi?.value || 0)/100; }

function allInputs(){ return qa('#simulasiForm input,#simulasiForm select'); }

function applyTarget(){
  const t = TARGETS[refs.targetPendidikan.value];
  if(!t) return;
  if(t.usia !== '') refs.usiaMasuk.value = t.usia;
  if(t.lama !== '') refs.lamaStudi.value = t.lama;
}

function getBatas(){
  const usiaA = Number(refs.usiaAyah.value || 0);
  const usiaI = Number(refs.usiaIbu.value || 0);
  const pens = Number(refs.usiaPensiun.value || 0);
  const usia = Number(refs.usiaAnak.value || 0);
  const masuk = Number(refs.usiaMasuk.value || 0);
  const sisaKuliah = masuk - usia;
  const batas = [];
  if(usiaA && pens) batas.push(pens - usiaA);
  if(usiaI && pens) batas.push(pens - usiaI);
  if(sisaKuliah > 0) batas.push(sisaKuliah);
  const max = batas.length ? Math.min(...batas) : 0;
  return {max, sisaKuliah};
}

function hidePensionWarning(){
  refs.pensionWarning.innerHTML = '';
  refs.pensionWarning.classList.add('d-none');
}
function showPensionWarning(message){
  refs.pensionWarning.innerHTML = message;
  refs.pensionWarning.classList.remove('d-none');
}

function updatePeriode(){
  const prev = refs.periodePersiapan.value;
  const {max, sisaKuliah} = getBatas();
  refs.periodePersiapan.innerHTML = '';
  hidePensionWarning();

  if(!isFinite(max) || max <= 0){
    refs.periodePersiapan.innerHTML = '<option value="">Lengkapi data dahulu</option>';
    refs.periodeInfo.innerText = 'Isi usia orang tua, usia anak, dan usia masuk pendidikan.';
    refs.customTahunBox.classList.add('d-none');
    refs.customTahun.removeAttribute('required');
    return;
  }

  [3,5,8,10].forEach(y => {
    if(y <= max) refs.periodePersiapan.innerHTML += `<option value="${y}">${y} Tahun</option>`;
  });

  if(sisaKuliah > 0 && sisaKuliah <= max){
    refs.periodePersiapan.innerHTML += `<option value="kuliah">Sampai Anak Masuk Pendidikan (${formatTahun(sisaKuliah)})</option>`;
  }

  if(max >= 1){ refs.periodePersiapan.innerHTML += '<option value="custom">Custom / Tentukan Sendiri</option>'; }
  if([...refs.periodePersiapan.options].some(o => o.value === prev)) refs.periodePersiapan.value = prev;

  refs.customTahun.max = Math.max(1, Math.floor(max));
  refs.customTahunBox.classList.toggle('d-none', refs.periodePersiapan.value !== 'custom');
  if(refs.periodePersiapan.value === 'custom'){
    refs.customTahun.setAttribute('required','required');
    refs.customTahun.placeholder = `Maksimal ${Math.floor(max)} tahun`;
  }else{
    refs.customTahun.removeAttribute('required');
    refs.customTahun.classList.remove('is-invalid');
  }

  refs.periodeInfo.innerText = `Periode maksimum yang disarankan: ${formatTahun(max)}, berdasarkan sisa waktu pendidikan dan usia pensiun orang tua.`;
}

function validatePeriodeCustom(){
  if(refs.periodePersiapan.value !== 'custom'){
    refs.customTahun.classList.remove('is-invalid');
    hidePensionWarning();
    return true;
  }
  const {max} = getBatas();
  const value = Number(refs.customTahun.value || 0);
  const maxTahun = Math.floor(max);
  if(!value){
    refs.customTahun.classList.remove('is-invalid');
    showPensionWarning(`ℹ️ Masukkan periode custom. Maksimal yang disarankan adalah <strong>${formatTahun(max)}</strong>.`);
    return false;
  }
  if(value > max || value <= 0){
    refs.customTahun.classList.add('is-invalid');
    showPensionWarning(`⚠️ Periode custom harus 1 sampai <strong>${maxTahun} tahun</strong>.`);
    return false;
  }
  refs.customTahun.classList.remove('is-invalid');
  hidePensionWarning();
  return true;
}

function getPeriode(){
  const {max, sisaKuliah} = getBatas();
  const val = refs.periodePersiapan.value;
  if(val === 'kuliah') return Math.min(sisaKuliah, max);
  if(val === 'custom') return Number(refs.customTahun.value || 0);
  return Math.min(Number(val || 0), max);
}

function valid(){
  let ok = true;
  qa('[required]').forEach(el => {
    let inv = !String(el.value ?? '').trim();
    if(el.id === 'customTahun' && refs.periodePersiapan.value !== 'custom') inv = false;
    el.classList.toggle('is-invalid', inv);
    if(inv) ok = false;
  });
  if(Number(refs.usiaMasuk.value) <= Number(refs.usiaAnak.value)){
    refs.usiaMasuk.classList.add('is-invalid');
    ok = false;
  }
  if(!validatePeriodeCustom()) ok = false;
  return ok;
}

function data(){
  const key = refs.targetPendidikan.value;
  return {
    namaAyah: refs.namaAyah.value.trim(),
    usiaAyah: Number(refs.usiaAyah.value),
    namaIbu: refs.namaIbu.value.trim(),
    usiaIbu: Number(refs.usiaIbu.value),
    usiaPensiun: Number(refs.usiaPensiun.value),
    namaAnak: refs.namaAnak.value.trim(),
    usiaAnak: Number(refs.usiaAnak.value),
    targetLabel: TARGETS[key]?.label || '-',
    usiaMasuk: Number(refs.usiaMasuk.value),
    lama: Number(refs.lamaStudi.value),
    biaya: bersih(refs.biayaSaatIni.value),
    inflasi: inflasiNum(),
    tahun: Number(refs.tahunSekarang.value),
    danaAda: bersih(refs.danaAda.value),
    catatan: refs.catatan.value.trim(),
    rate: rate(),
    strategi: strategiLabel(),
    periode: getPeriode(),
    sisa: Number(refs.usiaMasuk.value) - Number(refs.usiaAnak.value)
  };
}

function calcSetor(k,p,r){
  if(k <= 0 || p <= 0) return 0;
  const n = Math.round(p*12);
  const m = r/12;
  if(m <= 0) return k/n;
  return k*m/(Math.pow(1+m,n)-1);
}

function kosongkan(){
  refs.sisaWaktu.innerText = '0 Tahun';
  refs.danaDibutuhkan.innerText = 'Rp0';
  refs.kekuranganDana.innerText = 'Rp0';
  refs.setoranBulanan.innerText = 'Rp0';
  refs.ringkasanText.innerText = 'Lengkapi semua data wajib untuk melihat hasil simulasi.';
  refs.insightOrtu.innerText = 'Lengkapi data orang tua untuk melihat analisis kesiapan sebelum masa pensiun.';
  refs.tabelDana.innerHTML = '';
  refs.ctaSection.classList.add('d-none');
  last = null;
}

function hitung(){
  if(!valid()){ kosongkan(); return; }
  const d = data();
  if(d.sisa <= 0 || d.biaya <= 0 || d.inflasi < 0 || d.periode <= 0){ kosongkan(); return; }
  const target = d.biaya * Math.pow(1+d.inflasi,d.sisa);
  const kurang = Math.max(target-d.danaAda,0);
  const setor = calcSetor(kurang,d.periode,d.rate);
  last = {...d,target,kurang,setor};
  refs.sisaWaktu.innerText = formatTahun(d.sisa);
  refs.danaDibutuhkan.innerText = rupiah(target);
  refs.kekuranganDana.innerText = rupiah(kurang);
  refs.setoranBulanan.innerText = rupiah(setor)+' / bulan';
  refs.ringkasanText.innerHTML = `Target <strong>${d.targetLabel}</strong> untuk ${d.namaAnak} membutuhkan estimasi dana sebesar <strong>${rupiah(target)}</strong> dalam ${formatTahun(d.sisa)}. Dana yang sudah ada ${rupiah(d.danaAda)}, sehingga kekurangan dana sekitar <strong>${rupiah(kurang)}</strong>.`;
  insight(d);
  timeline(d);
  readiness(last);
  refs.ctaSection.classList.remove('d-none');
}

function insight(d){
  const aKul=d.usiaAyah+d.sisa, iKul=d.usiaIbu+d.sisa, aFin=d.usiaAyah+d.periode, iFin=d.usiaIbu+d.periode;
  refs.insightOrtu.innerHTML = `Saat ${d.namaAnak} masuk ${d.targetLabel}, ${d.namaAyah} diperkirakan berusia <strong>${aKul} tahun</strong> dan ${d.namaIbu} <strong>${iKul} tahun</strong>.<br>Dengan periode persiapan ${formatTahun(d.periode)}, usia saat dana ditargetkan terkumpul: ${d.namaAyah} <strong>${aFin.toFixed(0)} tahun</strong>, ${d.namaIbu} <strong>${iFin.toFixed(0)} tahun</strong>.`;
}

function timeline(d){
  let html='';
  for(let i=0;i<=d.sisa;i++){
    const dana = d.biaya*Math.pow(1+d.inflasi,i);
    const naik = ((dana-d.biaya)/d.biaya)*100;
    html += `<tr><td>${d.tahun+i}</td><td>${d.usiaAnak+i} Tahun</td><td>${rupiah(dana)}</td><td>${naik.toFixed(1)}%</td></tr>`;
  }
  refs.tabelDana.innerHTML = html;
}

function getReadinessState(d){
  const checks = [
    {ok:d.target > 0, text:'Sudah mengetahui kebutuhan dana'},
    {ok:d.periode > 0, text:'Sudah memiliki target waktu'},
    {ok:d.setor >= 0 && !!d.strategi, text:'Strategi pendanaan sudah disusun'},
    {ok:d.danaAda >= d.target, text:d.danaAda >= d.target ? 'Dana awal sudah mencukupi' : 'Dana awal belum mencukupi'}
  ];
  const score = checks.filter(i=>i.ok).length * 25;
  let message = 'Perencanaan baru dimulai, masih banyak aspek yang perlu dipersiapkan.';
  if(score === 100) message = 'Perencanaan sangat baik, pertahankan strategi dan lakukan evaluasi berkala.';
  else if(score >= 75) message = 'Perencanaan sudah baik, fokus pada konsistensi mencapai target.';
  else if(score >= 50) message = 'Perencanaan sudah berjalan, namun masih perlu penyempurnaan.';
  return {score,message,items:checks};
}
function readiness(d){
  const r = getReadinessState(d);
  refs.readinessScore.innerText = r.score + '%';
  refs.readinessBar.style.width = r.score + '%';
  refs.readinessText.innerText = r.message;
  refs.readinessChecklist.innerHTML = r.items.map(item => `<div class="readiness-item ${item.ok ? 'checked' : ''}"><span>${item.ok ? '✓' : ''}</span><strong>${item.text}</strong></div>`).join('');
}

function konsultasiWhatsApp(){
  if(!last) return;
  const d=last;
  const msg = `Halo Pak Septino,\n\nSaya baru menggunakan aplikasi Cerdas Finansial dan ingin berkonsultasi mengenai hasil simulasi dana pendidikan.\n\nNama Anak: ${d.namaAnak}\nTarget Pendidikan: ${d.targetLabel}\nDana Dibutuhkan: ${rupiah(d.target)}\nDana Saat Ini: ${rupiah(d.danaAda)}\nKekurangan Dana: ${rupiah(d.kurang)}\nEstimasi Setoran: ${rupiah(d.setor)} / bulan\nPeriode Persiapan: ${formatTahun(d.periode)}\n\nMohon dibantu membuatkan strategi yang sesuai. Terima kasih.`;
  window.open(`https://wa.me/${FP.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank');
}
function konsultasiEmail(){ location.href = `mailto:${FP.email}?subject=${encodeURIComponent('Konsultasi Dana Pendidikan')}`; }
function konsultasiInstagram(){ window.open(FP.instagram,'_blank'); }

function resetForm(){
  refs.simulasiForm.reset();
  refs.tahunSekarang.value = new Date().getFullYear();
  const defaultRadio = q('input[name="strategiInvestasi"][value="0.04"]');
  if(defaultRadio) defaultRadio.checked = true;
  updatePeriode();
  kosongkan();
}

function exportPDF(){
  try{
    if(!last){ alert('Lengkapi data terlebih dahulu.'); return; }
    if(!window.jspdf || !window.jspdf.jsPDF){
      alert('Library PDF belum terbaca. Pastikan koneksi internet aktif dan file pendidikan.html memuat jsPDF.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const d = last;
    const doc = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 12;
    const today = new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
    const C = {
      navy:[6,43,79], gold:[197,151,64], green:[46,139,87], red:[196,47,50],
      ink:[25,37,56], muted:[96,111,130], line:[220,229,239], soft:[248,251,254], white:[255,255,255], paleGold:[255,248,232]
    };
    const cleanName = String(d.namaAnak || 'Simulasi').replace(/[^a-z0-9_\-]+/gi,'_');
    const fmt = n => rupiah(Math.round(Number(n || 0)));
    const periodeText = () => `${formatTahun(d.periode)} (${Math.round(d.periode*12)} Bulan)`;

    function color(c){ doc.setTextColor(...c); }
    function font(size, style='normal', c=C.ink){ doc.setFont('helvetica',style); doc.setFontSize(size); color(c); }
    function fill(c){ doc.setFillColor(...c); }
    function stroke(c){ doc.setDrawColor(...c); }
    function rect(x,y,w,h,r=4,fc=C.white,sc=C.line){ fill(fc); stroke(sc); doc.setLineWidth(.35); doc.roundedRect(x,y,w,h,r,r,'FD'); }
    function textWrap(t,x,y,w,size=7,style='normal',c=C.ink,lineH=4){ font(size,style,c); const lines=doc.splitTextToSize(String(t),w); doc.text(lines,x,y); return y + lines.length*lineH; }
    function fit(t,x,y,w,max=13,min=7,c=C.ink,style='bold',align='center'){
      let s=max; doc.setFont('helvetica',style); doc.setFontSize(s);
      while(s>min && doc.getTextWidth(String(t))>w){ s-=.3; doc.setFontSize(s); }
      font(s,style,c); doc.text(String(t),x,y,{align});
    }
    function header(title, sub, page){
      fill(C.white); doc.rect(0,0,W,28,'F');
      font(10,'bold',C.navy); doc.text('CERDAS',M,12);
      font(10,'bold',C.gold); doc.text('FINANSIAL',M,20);
      font(12,'bold',C.navy); doc.text(title,70,12);
      font(7,'normal',C.muted); doc.text(sub,70,20);
      font(7,'bold',C.navy); doc.text('Tanggal Simulasi',W-M-42,11);
      font(7,'normal',C.ink); doc.text(today,W-M-42,19);
      stroke(C.gold); doc.setLineWidth(.5); doc.line(M,26,W-M,26);
    }
    function footer(page){
      const y = H-13;
      stroke(C.line); doc.setLineWidth(.35); doc.line(M,y-4,W-M,y-4);
      font(6,'normal',C.muted); doc.text('Disusun oleh:',M,y);
      font(6.2,'bold',C.ink); doc.text(FP.name,M+19,y);
      font(5.8,'normal',C.muted); doc.text(`${FP.phone}  •  ${FP.email}  •  ${FP.ig}`,92,y);
      font(6,'bold',C.navy); doc.text(`Halaman ${page} dari 2`,W-M,y,{align:'right'});
    }
    function metric(x,y,w,h,label,value,note,c=C.navy){
      rect(x,y,w,h,4,C.white,C.line);
      fill(c); doc.roundedRect(x,y,w,2.2,1,1,'F');
      font(6.7,'bold',C.navy); doc.text(label,x+w/2,y+10,{align:'center',maxWidth:w-6});
      fit(value,x+w/2,y+23,w-8,11.5,7,c,'bold');
      textWrap(note,x+6,y+32,w-12,5.7,'normal',C.muted,3);
    }

    // PAGE 1
    header('LAPORAN SIMULASI DANA PENDIDIKAN','Perencanaan Masa Depan Anak',1);
    rect(M,38,116,46,6,C.white,C.line);
    font(8,'bold',C.navy); doc.text('DATA ANAK',M+8,49);
    const rows = [
      ['Nama Anak', d.namaAnak], ['Usia Saat Ini', `${d.usiaAnak} tahun`], ['Target Pendidikan', d.targetLabel],
      ['Biaya Saat Ini', fmt(d.biaya)], ['Inflasi Pendidikan', `${(d.inflasi*100).toFixed(1).replace('.0','')}% / tahun`], ['Strategi', d.strategi]
    ];
    let yy = 59; rows.forEach(([a,b]) => { font(6.4,'normal',C.muted); doc.text(a,M+8,yy); font(6.4,'bold',C.ink); doc.text(String(b),M+55,yy,{maxWidth:64}); yy+=5.8; });

    rect(140,38,W-M-140,46,8,C.navy,C.navy);
    font(10,'bold',C.white); doc.text('KEBUTUHAN DANA SAAT USIA '+d.usiaMasuk+' TAHUN',218,51,{align:'center'});
    fit(fmt(d.target),218,68,W-M-150,18,9,C.gold,'bold');
    font(6.3,'normal',C.white); doc.text('Estimasi kebutuhan saat target pendidikan dimulai.',218,77,{align:'center'});

    font(9,'bold',C.navy); doc.text('RINGKASAN HASIL SIMULASI',M,99);
    const sw=(W-M*2-15)/4;
    metric(M,108,sw,38,'TOTAL KEBUTUHAN DANA',fmt(d.target),'Estimasi kebutuhan saat target pendidikan dimulai.',C.navy);
    metric(M+sw+5,108,sw,38,'DANA YANG SUDAH ADA',fmt(d.danaAda),'Dana pendidikan yang sudah tersedia saat ini.',C.green);
    metric(M+(sw+5)*2,108,sw,38,'KEKURANGAN DANA',fmt(d.kurang),'Selisih dana yang perlu dipersiapkan.',C.red);
    metric(M+(sw+5)*3,108,sw,38,'SETORAN BULANAN',fmt(d.setor),'Estimasi dana yang disiapkan setiap bulan.',C.gold);

    rect(M,156,132,32,6,C.soft,C.line);
    font(8,'bold',C.navy); doc.text('CATATAN SINGKAT',M+8,167);
    const notes=['Mulai lebih awal memberi peluang pertumbuhan dana lebih optimal.','Evaluasi biaya pendidikan dan inflasi setiap 6–12 bulan.','Konsistensi menabung menjadi kunci utama keberhasilan.'];
    yy=176; notes.forEach(n=>{ fill(C.gold); doc.circle(M+8,yy-2,2,'F'); textWrap(n,M+14,yy,112,5.8,'normal',C.ink,3); yy+=7; });

    rect(152,156,W-M-152,32,6,C.paleGold,C.gold);
    font(8,'bold',C.navy); doc.text('KOMPOSISI DANA',160,167);
    const percent = d.target > 0 ? Math.min(100,(d.danaAda/d.target)*100) : 0;
    font(18,'bold',C.gold); doc.text(`${Math.round(percent)}%`,202,179,{align:'center'});
    font(6,'normal',C.muted); doc.text('Dana sudah tersedia',202,185,{align:'center'});
    font(6.2,'bold',C.ink); doc.text(`Dana Ada: ${fmt(d.danaAda)}`,230,172);
    font(6.2,'bold',C.red); doc.text(`Kekurangan: ${fmt(d.kurang)}`,230,181);
    footer(1);

    // PAGE 2
    doc.addPage();
    header('REKOMENDASI FINANCIAL PLANNER','Langkah strategis untuk masa depan pendidikan anak Anda',2);
    font(9,'bold',C.navy); doc.text('1  RINGKASAN RENCANA',M,43);
    const rw=(W-M*2-14)/3;
    metric(M,52,rw,42,'TARGET DANA USIA '+d.usiaMasuk+' TAHUN',fmt(d.target),'Total kebutuhan saat target pendidikan dimulai.',C.navy);
    metric(M+rw+7,52,rw,42,'JANGKA WAKTU PERSIAPAN',periodeText(),'Sesuai periode persiapan yang dipilih.',C.green);
    metric(M+(rw+7)*2,52,rw,42,'DANA DISIAPKAN PER BULAN',fmt(d.setor),'Estimasi komitmen dana setiap bulan.',C.gold);

    font(9,'bold',C.navy); doc.text('2  LANGKAH STRATEGIS',M,112);
    const strategies=[
      ['1','Investasi Jangka Panjang','Pilih instrumen investasi sesuai profil risiko dan jangka waktu.'],
      ['2','Proteksi','Lindungi rencana pendidikan dari risiko yang tidak terduga.'],
      ['3','Konsistensi','Lakukan setoran rutin dan evaluasi berkala.']
    ];
    yy=124; strategies.forEach(([no,t,desc])=>{ fill(C.navy); doc.circle(M+5,yy-2,4,'F'); font(6,'bold',C.white); doc.text(no,M+5,yy,{align:'center'}); font(7,'bold',C.navy); doc.text(t,M+15,yy-2); textWrap(desc,M+15,yy+5,118,6,'normal',C.ink,3); yy+=18; });

    font(9,'bold',C.navy); doc.text('3  ACTION PLAN',154,112);
    const acts=['Mulai investasi sedini mungkin.','Sisihkan dana rutin setiap bulan.','Tingkatkan nominal saat pendapatan meningkat.','Review rencana minimal 1 tahun sekali.','Lindungi income orang tua dengan asuransi jiwa.'];
    yy=124; acts.forEach(a=>{ fill(C.green); doc.circle(158,yy-2,2.5,'F'); textWrap(a,164,yy,108,6.2,'normal',C.ink,3); yy+=10; });

    rect(M,170,W-M*2,22,6,C.paleGold,C.gold);
    font(7.5,'bold',C.navy); doc.text('Butuh Bantuan Menyusun Strategi?',M+8,180);
    textWrap('Konsultasikan rencana pendidikan secara personal agar strategi sesuai kebutuhan keluarga.',M+8,187,130,5.8,'normal',C.ink,3);
    font(7,'bold',C.ink); doc.text(FP.name,W-M-95,178);
    font(5.8,'normal',C.muted); doc.text(FP.title,W-M-95,184);
    font(5.8,'normal',C.ink); doc.text(`WA ${FP.phone}  |  ${FP.email}  |  ${FP.ig}`,W-M-95,190,{maxWidth:86});
    footer(2);

    doc.save(`Laporan_Dana_Pendidikan_${cleanName}.pdf`);
  }catch(err){
    console.error(err);
    alert('Export PDF gagal. Buka Console untuk melihat error: ' + (err.message || err));
  }
}

function initApp(){
  initRefs();
  if(!refs.simulasiForm) return;
  refs.tahunSekarang.value = new Date().getFullYear();
  allInputs().forEach(el => el.addEventListener('input', () => { formatIfMoney(el); updatePeriode(); hitung(); }));
  refs.targetPendidikan.addEventListener('change', () => { applyTarget(); updatePeriode(); hitung(); });
  refs.periodePersiapan.addEventListener('change', () => { refs.customTahunBox.classList.toggle('d-none', refs.periodePersiapan.value !== 'custom'); hitung(); });
  qa('input[name="strategiInvestasi"]').forEach(r => r.addEventListener('change', hitung));
  updatePeriode();
  kosongkan();
}

document.addEventListener('DOMContentLoaded', initApp);

window.exportPDF = exportPDF;
window.resetForm = resetForm;
window.konsultasiWhatsApp = konsultasiWhatsApp;
window.konsultasiEmail = konsultasiEmail;
window.konsultasiInstagram = konsultasiInstagram;
