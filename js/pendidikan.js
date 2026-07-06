const TARGETS={sd:{label:'SD Swasta',usia:6,lama:6},smp:{label:'SMP Swasta',usia:12,lama:3},sma:{label:'SMA Swasta',usia:15,lama:3},s1dn:{label:'S1 Dalam Negeri',usia:18,lama:4},s1ln:{label:'S1 Luar Negeri',usia:18,lama:4},kedokteran:{label:'Kedokteran',usia:18,lama:6},s2dn:{label:'S2 Dalam Negeri',usia:22,lama:2},s2ln:{label:'S2 Luar Negeri',usia:22,lama:2},custom:{label:'Custom',usia:'',lama:''}};
const FP={whatsapp:'628116946999',phone:'0811-6946-999',email:'septinogao@gmail.com',instagram:'https://instagram.com/septino.gao',ig:'@septino.gao',name:'Septino, QWP®, CIS®',title:'Financial Planner & Insurance Consultant'};
let last=null;

document.addEventListener('DOMContentLoaded',()=>{
  bindElements();
  if(window.tahunSekarang) tahunSekarang.value=new Date().getFullYear();
  allInputs().forEach(el=>el.addEventListener('input',()=>{formatIfMoney(el);updateTarget();updatePeriode();hitung();}));
  if(window.targetPendidikan) targetPendidikan.addEventListener('change',()=>{applyTarget();updatePeriode();hitung();});
  if(window.periodePersiapan) periodePersiapan.addEventListener('change',()=>{customTahunBox?.classList.toggle('d-none',periodePersiapan.value!=='custom');hitung();});
  document.querySelectorAll('input[name="strategiInvestasi"]').forEach(r=>r.addEventListener('change',hitung));
  updatePeriode();
  kosongkan();
});

function bindElements(){
  window.exportPDF = exportPDF;
  window.resetForm = resetForm;
  window.konsultasiWhatsApp = konsultasiWhatsApp;
  window.konsultasiEmail = konsultasiEmail;
  window.konsultasiInstagram = konsultasiInstagram;
}

function byId(id){return document.getElementById(id);} 
function allInputs(){return [...document.querySelectorAll('#simulasiForm input,#simulasiForm select')];}
function bersih(v){return Number(String(v||'').replace(/\D/g,''));}
function rupiah(n){return Number(n||0).toLocaleString('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});}
function formatIfMoney(el){if(!el.classList.contains('money-input'))return;let raw=String(el.value||'').trim();let n=bersih(raw);el.value=raw!==''?n.toLocaleString('id-ID'):'';}
function formatTahun(v){if(!isFinite(v)||v<=0)return '0 Tahun';let y=Math.floor(v),m=Math.round((v-y)*12);return y+(m?` Tahun ${m} Bulan`:' Tahun');}
function safeText(v){return String(v??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
function cleanName(txt){return String(txt||'Simulasi').replace(/[^a-z0-9_\-]+/gi,'_');}

function applyTarget(){const t=TARGETS[targetPendidikan.value];if(!t)return;if(t.usia!=='')usiaMasuk.value=t.usia;if(t.lama!=='')lamaStudi.value=t.lama;}
function updateTarget(){/* reserved */}
function getBatas(){const usiaA=Number(usiaAyah?.value||0),usiaI=Number(usiaIbu?.value||0),pens=Number(usiaPensiun?.value||0),usia=Number(usiaAnak?.value||0),masuk=Number(usiaMasuk?.value||0);const sisaKuliah=masuk-usia;let b=[];if(usiaA&&pens)b.push(pens-usiaA);if(usiaI&&pens)b.push(pens-usiaI);if(sisaKuliah>0)b.push(sisaKuliah);let max=b.length?Math.min(...b):0;return {max,sisaKuliah};}
function updatePeriode(){
  if(!window.periodePersiapan) return;
  const prev=periodePersiapan.value;
  const {max,sisaKuliah}=getBatas();
  periodePersiapan.innerHTML='';
  hidePensionWarning();
  if(!isFinite(max)||max<=0){
    periodePersiapan.innerHTML='<option value="">Lengkapi data dahulu</option>';
    if(window.periodeInfo) periodeInfo.innerText='Isi usia orang tua, usia anak, dan usia masuk pendidikan.';
    customTahunBox?.classList.add('d-none');
    customTahun?.removeAttribute('required');
    return;
  }
  [3,5,8,10].forEach(y=>{if(y<=max)periodePersiapan.innerHTML+=`<option value="${y}">${y} Tahun</option>`;});
  if(sisaKuliah>0&&sisaKuliah<=max){periodePersiapan.innerHTML+=`<option value="kuliah">Sampai Anak Masuk Pendidikan (${formatTahun(sisaKuliah)})</option>`;}
  if(max>=10){periodePersiapan.innerHTML+='<option value="custom">Custom / Tentukan Sendiri</option>';}
  if(!periodePersiapan.innerHTML){let y=Math.max(1,Math.floor(max));periodePersiapan.innerHTML=`<option value="${y}">${y} Tahun</option>`;}
  if([...periodePersiapan.options].some(o=>o.value===prev)) periodePersiapan.value=prev;
  if(window.customTahun){
    customTahun.max=Math.floor(max);
    customTahunBox?.classList.toggle('d-none',periodePersiapan.value!=='custom');
    if(periodePersiapan.value==='custom'){
      customTahun.setAttribute('required','required');
      customTahun.placeholder=`Maksimal ${Math.floor(max)} tahun`;
    }else{
      customTahun.removeAttribute('required');
      customTahun.classList.remove('is-invalid');
    }
  }
  if(window.periodeInfo) periodeInfo.innerText=`Periode maksimum yang disarankan: ${formatTahun(max)}, berdasarkan sisa waktu pendidikan dan usia pensiun orang tua.`;
  validatePeriodeCustom();
}
function showPensionWarning(message){if(!window.pensionWarning)return;pensionWarning.innerHTML=message;pensionWarning.classList.remove('d-none');}
function hidePensionWarning(){if(!window.pensionWarning)return;pensionWarning.innerHTML='';pensionWarning.classList.add('d-none');}
function validatePeriodeCustom(){
  if(!window.periodePersiapan||!window.customTahun) return true;
  const {max}=getBatas();
  if(periodePersiapan.value!=='custom'){customTahun.classList.remove('is-invalid');hidePensionWarning();return true;}
  const value=Number(customTahun.value||0),maxTahun=Math.floor(max);
  if(!value){customTahun.classList.remove('is-invalid');showPensionWarning(`ℹ️ Masukkan periode custom. Maksimal yang disarankan adalah <strong>${formatTahun(max)}</strong>.`);return false;}
  if(value>max){customTahun.classList.add('is-invalid');showPensionWarning(`⚠️ Periode custom <strong>${value} tahun</strong> melebihi batas aman. Maksimum periode persiapan yang disarankan adalah <strong>${formatTahun(max)}</strong>. Silakan isi maksimal <strong>${maxTahun} tahun</strong>.`);return false;}
  if(value<=0){customTahun.classList.add('is-invalid');showPensionWarning('⚠️ Periode custom harus lebih dari 0 tahun.');return false;}
  customTahun.classList.remove('is-invalid');hidePensionWarning();return true;
}
function getPeriode(){const {max,sisaKuliah}=getBatas();let val=periodePersiapan?.value;if(val==='kuliah')return Math.min(sisaKuliah,max);if(val==='custom')return Number(customTahun?.value||0);return Math.min(Number(val||0),max);}
function inflasiNum(){return Number(inflasi?.value||0)/100;}
function rate(){return Number(document.querySelector('input[name="strategiInvestasi"]:checked')?.value||0.04);}
function strategiLabel(){let v=rate();return v===0.02?'Konservatif (1–2%)':v===0.06?'Agresif (6% ke atas)':'Moderat (3–5%)';}
function valid(){
  let ok=true;
  document.querySelectorAll('[required]').forEach(el=>{let inv=!String(el.value||'').trim();if(el.id==='customTahun'&&periodePersiapan?.value!=='custom')inv=false;el.classList.toggle('is-invalid',inv);if(inv)ok=false;});
  if(Number(usiaMasuk?.value)<=Number(usiaAnak?.value)){usiaMasuk?.classList.add('is-invalid');ok=false;}
  if(!validatePeriodeCustom())ok=false;
  return ok;
}
function kosongkan(){
  if(window.sisaWaktu)sisaWaktu.innerText='0 Tahun';
  if(window.danaDibutuhkan)danaDibutuhkan.innerText='Rp0';
  if(window.kekuranganDana)kekuranganDana.innerText='Rp0';
  if(window.setoranBulanan)setoranBulanan.innerText='Rp0';
  if(window.ringkasanText)ringkasanText.innerText='Lengkapi semua data wajib untuk melihat hasil simulasi.';
  if(window.insightOrtu)insightOrtu.innerText='Lengkapi data orang tua untuk melihat analisis kesiapan sebelum masa pensiun.';
  if(window.tabelDana)tabelDana.innerHTML='';
  if(window.ctaSection)ctaSection.classList.add('d-none');
  last=null;
}
function hitung(){
  if(!valid()){kosongkan();return;}
  let d=data();
  if(d.sisa<=0||d.biaya<=0||d.inflasi<0||d.periode<=0){kosongkan();return;}
  let target=d.biaya*Math.pow(1+d.inflasi,d.sisa);
  let kurang=Math.max(target-d.danaAda,0);
  let setor=calcSetor(kurang,d.periode,d.rate);
  last={...d,target,kurang,setor};
  if(window.sisaWaktu)sisaWaktu.innerText=formatTahun(d.sisa);
  if(window.danaDibutuhkan)danaDibutuhkan.innerText=rupiah(target);
  if(window.kekuranganDana)kekuranganDana.innerText=rupiah(kurang);
  if(window.setoranBulanan)setoranBulanan.innerText=rupiah(setor)+' / bulan';
  if(window.ringkasanText)ringkasanText.innerHTML=`Target <strong>${d.targetLabel}</strong> untuk ${d.namaAnak} membutuhkan estimasi dana sebesar <strong>${rupiah(target)}</strong> dalam ${formatTahun(d.sisa)}. Dana yang sudah ada ${rupiah(d.danaAda)}, sehingga kekurangan dana sekitar <strong>${rupiah(kurang)}</strong>.`;
  insight(d);timeline(d);readiness(d);
  if(window.ctaSection)ctaSection.classList.remove('d-none');
}
function data(){let key=targetPendidikan?.value;return{namaAyah:namaAyah?.value.trim()||'Orang Tua',usiaAyah:Number(usiaAyah?.value||0),namaIbu:namaIbu?.value.trim()||'Orang Tua',usiaIbu:Number(usiaIbu?.value||0),usiaPensiun:Number(usiaPensiun?.value||0),namaAnak:namaAnak?.value.trim()||'Anak',usiaAnak:Number(usiaAnak?.value||0),targetLabel:TARGETS[key]?.label||'-',usiaMasuk:Number(usiaMasuk?.value||0),lama:Number(lamaStudi?.value||0),biaya:bersih(biayaSaatIni?.value),inflasi:inflasiNum(),tahun:Number(tahunSekarang?.value||new Date().getFullYear()),danaAda:bersih(danaAda?.value),catatan:catatan?.value.trim()||'',rate:rate(),strategi:strategiLabel(),periode:getPeriode(),sisa:Number(usiaMasuk?.value||0)-Number(usiaAnak?.value||0)}}
function calcSetor(k,p,r){if(k<=0||p<=0)return 0;let n=Math.round(p*12),m=r/12;if(m<=0)return k/n;return k*m/(Math.pow(1+m,n)-1);}
function insight(d){if(!window.insightOrtu)return;let aKul=d.usiaAyah+d.sisa,iKul=d.usiaIbu+d.sisa,aFin=d.usiaAyah+d.periode,iFin=d.usiaIbu+d.periode;let warn=(aFin>d.usiaPensiun||iFin>d.usiaPensiun)?'<div class="warning-box">⚠️ Periode persiapan dana melewati usia pensiun. Sistem membatasi pilihan periode agar lebih aman.</div>':'';insightOrtu.innerHTML=`Saat ${d.namaAnak} masuk ${d.targetLabel}, ${d.namaAyah} diperkirakan berusia <strong>${aKul} tahun</strong> dan ${d.namaIbu} <strong>${iKul} tahun</strong>.<br>Dengan periode persiapan ${formatTahun(d.periode)}, usia saat dana ditargetkan terkumpul: ${d.namaAyah} <strong>${aFin.toFixed(0)} tahun</strong>, ${d.namaIbu} <strong>${iFin.toFixed(0)} tahun</strong>. ${warn}`;}
function timeline(d){if(!window.tabelDana)return;let html='';for(let i=0;i<=d.sisa;i++){let dana=d.biaya*Math.pow(1+d.inflasi,i),naik=((dana-d.biaya)/d.biaya)*100;html+=`<tr><td>${d.tahun+i}</td><td>${d.usiaAnak+i} Tahun</td><td>${rupiah(dana)}</td><td>${naik.toFixed(1)}%</td></tr>`;}tabelDana.innerHTML=html;}
function getReadinessState(d){const items=[d.target>0,d.periode>0,d.setor>=0&&d.strategi,d.danaAda>=d.target];let terpenuhi=items.filter(Boolean).length;let score=terpenuhi*25;let status='Awal',message='Perencanaan baru dimulai, masih banyak aspek yang perlu dipersiapkan.';if(score===100){status='Sangat Baik';message='Perencanaan sangat baik, pertahankan strategi dan lakukan evaluasi berkala.';}else if(score>=75){status='Baik';message='Perencanaan sudah baik, fokus pada konsistensi mencapai target.';}else if(score>=50){status='Cukup';message='Perencanaan sudah berjalan, namun masih perlu penyempurnaan.';}return{score,terpenuhi,status,message,items:[{ok:items[0],text:'Sudah mengetahui kebutuhan dana'},{ok:items[1],text:'Sudah memiliki target waktu'},{ok:items[2],text:'Strategi pendanaan sudah disusun'},{ok:items[3],text:items[3]?'Dana awal sudah mencukupi':'Dana awal belum mencukupi'}]};}
function readiness(d){if(!window.readinessScore)return;const r=getReadinessState(d);readinessScore.innerText=r.score+'%';readinessBar.style.width=r.score+'%';readinessText.innerText=r.message;readinessChecklist.innerHTML=r.items.map(item=>`<div class="readiness-item ${item.ok?'checked':''}"><span>${item.ok?'✓':''}</span><strong>${item.text}</strong></div>`).join('');}
function konsultasiWhatsApp(){if(!last)return;let d=last,msg=`Halo Pak Septino,\n\nSaya baru menggunakan aplikasi Cerdas Finansial dan ingin berkonsultasi mengenai hasil simulasi dana pendidikan.\n\nNama Anak: ${d.namaAnak}\nTarget Pendidikan: ${d.targetLabel}\nDana Dibutuhkan: ${rupiah(d.target)}\nDana Saat Ini: ${rupiah(d.danaAda)}\nKekurangan Dana: ${rupiah(d.kurang)}\nEstimasi Setoran: ${rupiah(d.setor)} / bulan\nPeriode Persiapan: ${formatTahun(d.periode)}\n\nMohon dibantu membuatkan strategi yang sesuai. Terima kasih.`;window.open(`https://wa.me/${FP.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank');}
function konsultasiEmail(){location.href=`mailto:${FP.email}?subject=${encodeURIComponent('Konsultasi Dana Pendidikan')}`;}
function konsultasiInstagram(){window.open(FP.instagram,'_blank');}

function ensureHtml2Pdf(){
  return new Promise((resolve,reject)=>{
    if(window.html2pdf) return resolve();
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    s.onload=()=>resolve();
    s.onerror=()=>reject(new Error('Library html2pdf gagal dimuat. Pastikan koneksi internet aktif.'));
    document.head.appendChild(s);
  });
}

function exportPDF(){
  if(!last){alert('Lengkapi data terlebih dahulu.');return;}
  ensureHtml2Pdf().then(()=>{
    const d=last;
    const el=document.createElement('div');
    el.className='cf-pdf-export-wrapper';
    el.innerHTML=pdfTemplate(d);
    document.body.appendChild(el);
    const opt={
      margin:0,
      filename:`Laporan_Dana_Pendidikan_${cleanName(d.namaAnak)}.pdf`,
      image:{type:'jpeg',quality:0.98},
      html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff',scrollY:0},
      jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},
      pagebreak:{mode:['css','legacy'],before:'.pdf-page-break'}
    };
    html2pdf().set(opt).from(el).save().then(()=>el.remove()).catch(err=>{el.remove();alert('Export PDF gagal: '+err.message);});
  }).catch(err=>alert('Export PDF gagal: '+err.message));
}

function pdfTemplate(d){
  const today=new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
  const pct=d.target>0?Math.min(100,(d.danaAda/d.target)*100):0;
  const kurangPct=Math.max(0,100-pct);
  const periode=`${formatTahun(d.periode)} (${Math.round(d.periode*12)} Bulan)`;
  const circleStyle=`conic-gradient(#c89b3c 0 ${pct}%, #dbe6f1 ${pct}% 100%)`;
  const esc=safeText;
  return `
  <style>
    .cf-pdf-export-wrapper{position:fixed;left:-99999px;top:0;background:#fff;color:#102033;font-family:Arial,Helvetica,sans-serif;}
    .cf-page{width:210mm;min-height:297mm;padding:14mm 14mm 12mm;background:#fff;box-sizing:border-box;position:relative;overflow:hidden;}
    .cf-page-break{break-before:page;page-break-before:always;}
    .cf-header{display:grid;grid-template-columns:48mm 1fr 38mm;align-items:start;gap:8mm;border-bottom:1.4px solid #c89b3c;padding-bottom:6mm;margin-bottom:7mm;}
    .cf-logo{display:flex;gap:3mm;align-items:flex-start;}
    .cf-logo-mark{font-weight:900;letter-spacing:1mm;font-size:15pt;color:#052d50;line-height:1}.cf-logo-mark span{color:#c89b3c}.cf-logo-text{font-weight:900;font-size:11pt;line-height:1.12;color:#052d50}.cf-logo-text span{display:block;color:#c89b3c}.cf-title h1{font-size:16pt;line-height:1.15;margin:0;color:#052d50}.cf-title p{font-size:9.5pt;margin:2mm 0 0;color:#4f627a}.cf-date{text-align:right;font-size:7.8pt;color:#526274;font-weight:700}.cf-date strong{display:block;margin-top:2mm;color:#102033;font-size:8pt}
    .section-title{font-size:11.5pt;font-weight:900;color:#052d50;margin:0 0 4mm;display:flex;align-items:center;gap:2mm}.section-title:before{content:'';width:6mm;height:6mm;border-radius:2mm;background:#052d50;display:inline-block}.gold-line{width:24mm;height:1.5mm;border-radius:1mm;background:#c89b3c;margin-top:1.5mm}.card{border:1px solid #d6e1ec;border-radius:5mm;background:#fff;box-sizing:border-box;}.soft{background:#f8fbfe}.gold-soft{background:#fff8e8;border-color:#e5c575}.green-soft{background:#eef8f1;border-color:#a9d1b8}.navy-card{background:linear-gradient(135deg,#07365f,#041f3c);color:#fff;border:0}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:7mm}.grid4{display:grid;grid-template-columns:1fr 1fr;gap:5mm}.grid3{display:grid;grid-template-columns:1fr;gap:4mm}.data-card{padding:7mm 8mm;min-height:66mm}.data-row{display:grid;grid-template-columns:43% 1fr;margin-bottom:3.2mm;font-size:9.3pt}.data-row b{color:#052d50}.hero-number{text-align:center;padding:13mm 8mm;min-height:66mm}.hero-number .edu{width:16mm;height:16mm;border-radius:50%;background:#c89b3c;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;margin:0 auto 6mm}.hero-number h2{font-size:13.5pt;line-height:1.25;margin:0 0 6mm;color:#fff}.hero-number .value{font-size:24pt;font-weight:900;color:#d9a42f;line-height:1.1}.hero-number p{font-size:8.4pt;line-height:1.35;margin:4mm 0 0;color:#eef5fb}.summary-card{padding:7mm;min-height:45mm;border-top:2mm solid #052d50}.summary-card.green{border-top-color:#2b8b55}.summary-card.red{border-top-color:#c53235}.summary-card.gold{border-top-color:#c89b3c}.summary-card h3{font-size:8.3pt;line-height:1.25;color:#5b6b82;margin:0 0 5mm;text-transform:uppercase}.summary-card .money{font-size:16pt;font-weight:900;color:#052d50;line-height:1.1;word-break:break-word}.summary-card.green .money{color:#2b8b55}.summary-card.red .money{color:#c53235}.summary-card.gold .money{color:#c89b3c}.summary-card p{font-size:8.2pt;line-height:1.35;color:#465873;margin:4mm 0 0}.lower-row{display:grid;grid-template-columns:1fr 1fr;gap:7mm;margin-top:7mm}.donut-card,.note-card{padding:7mm;min-height:75mm}.donut-layout{display:grid;grid-template-columns:42mm 1fr;gap:8mm;align-items:center}.donut{width:42mm;height:42mm;border-radius:50%;background:${circleStyle};display:flex;align-items:center;justify-content:center;position:relative}.donut:after{content:'';position:absolute;width:25mm;height:25mm;border-radius:50%;background:#fff}.donut strong{position:relative;z-index:2;font-size:17pt;color:#052d50}.legend-line{display:flex;gap:3mm;align-items:flex-start;margin-bottom:4mm;font-size:8.6pt;line-height:1.25}.dot{width:4mm;height:4mm;border-radius:1mm;background:#052d50;flex:0 0 auto}.dot.gold{background:#c89b3c}.note-list{list-style:none;margin:0;padding:0}.note-list li{display:grid;grid-template-columns:6mm 1fr;gap:3mm;font-size:8.7pt;line-height:1.35;margin-bottom:4mm}.check{color:#c89b3c;font-weight:900;font-size:13pt;line-height:1}.info-box{display:grid;grid-template-columns:10mm 1fr;gap:4mm;align-items:center;margin-top:7mm;padding:5mm 6mm;border-radius:4mm;border:1px solid #d6e1ec;background:#f3f8fd;font-size:8.3pt;line-height:1.35}.info-icon{width:9mm;height:9mm;border-radius:50%;background:#052d50;color:white;display:flex;align-items:center;justify-content:center;font-weight:900}.cf-footer{position:absolute;left:14mm;right:14mm;bottom:8mm;border-top:1px solid #c89b3c;padding-top:3mm;display:grid;grid-template-columns:1fr auto;align-items:end;font-size:7pt;color:#53657c}.cf-footer b{display:block;color:#102033;font-size:7.5pt}.page-no{background:#fff8e8;border:1px solid #e5c575;color:#052d50;border-radius:3mm;padding:2mm 4mm;font-weight:800}.spacer-footer{height:13mm}.recommend-card{padding:7mm;min-height:42mm;text-align:center}.recommend-card h3{font-size:8pt;color:#052d50;margin:0 0 4mm;text-transform:uppercase}.recommend-card .money{font-size:17pt;font-weight:900;color:#052d50;line-height:1.1}.recommend-card .green-money{color:#2b8b55}.recommend-card .gold-money{color:#c89b3c}.recommend-card p{font-size:8pt;color:#44566e;line-height:1.35;margin:4mm 0 0}.strategy-box{padding:6mm;margin-bottom:4mm;display:grid;grid-template-columns:10mm 1fr 34mm;gap:4mm;align-items:center}.num{width:8mm;height:8mm;border-radius:50%;background:#052d50;color:#fff;font-weight:900;font-size:8pt;display:flex;align-items:center;justify-content:center}.num.green{background:#2b8b55}.num.gold{background:#c89b3c}.strategy-box h4{margin:0 0 1.5mm;font-size:9pt;color:#052d50}.strategy-box p{margin:0;font-size:8pt;line-height:1.35;color:#44566e}.goal{background:#f3f7fb;border-radius:3mm;padding:3mm;font-size:7.2pt;text-align:center;color:#052d50;font-weight:700}.action-list{display:grid;grid-template-columns:1fr;gap:3mm}.action-list div{display:grid;grid-template-columns:7mm 1fr;gap:3mm;font-size:8.6pt;line-height:1.35}.mini-check{width:5mm;height:5mm;border-radius:50%;background:#052d50;color:#fff;font-size:7pt;font-weight:900;display:flex;align-items:center;justify-content:center}.cta-card{margin-top:6mm;padding:7mm;border:1.2px solid #c89b3c;border-radius:5mm;background:#fff8e8;display:grid;grid-template-columns:1fr 58mm;gap:7mm;align-items:center}.cta-card h3{margin:0 0 3mm;font-size:12pt;color:#052d50}.cta-card p{margin:0;font-size:8.5pt;line-height:1.45;color:#26384f}.contact h4{margin:0 0 1mm;font-size:10pt;color:#052d50}.contact p{margin:0 0 2mm;font-size:7.8pt;color:#506177}.contact .line{font-size:8pt;margin-top:1.6mm;color:#102033}.page-2-layout{display:grid;grid-template-columns:1fr;gap:5mm}.two-col{display:grid;grid-template-columns:1.08fr .92fr;gap:7mm;margin-top:5mm}.page-title-small{font-size:11pt;font-weight:900;color:#052d50;margin:0 0 4mm}.small-muted{font-size:7.7pt;color:#5c6d82;line-height:1.35}.mt6{margin-top:6mm}.mb6{margin-bottom:6mm}
  </style>
  <section class="cf-page">
    ${pdfHeader('LAPORAN SIMULASI DANA PENDIDIKAN','Perencanaan Masa Depan Anak',today)}
    <div class="grid2">
      <div>
        <h2 class="section-title">DATA ANAK</h2>
        <div class="card data-card">
          ${row('Nama Anak',d.namaAnak)}${row('Usia Saat Ini',d.usiaAnak+' tahun')}${row('Target Pendidikan',d.targetLabel)}${row('Biaya Saat Ini',rupiah(d.biaya))}${row('Inflasi Pendidikan',(d.inflasi*100).toFixed(1).replace('.0','')+'% / tahun')}${row('Strategi',d.strategi)}
        </div>
      </div>
      <div class="card navy-card hero-number">
        <div class="edu">EDU</div>
        <h2>KEBUTUHAN DANA<br>SAAT USIA ${d.usiaMasuk} TAHUN</h2>
        <div class="value">${rupiah(d.target)}</div>
        <p>Estimasi kebutuhan saat target pendidikan dimulai.</p>
      </div>
    </div>
    <div class="mt6">
      <h2 class="section-title">RINGKASAN HASIL SIMULASI</h2><div class="gold-line"></div>
      <div class="grid4 mt6">
        ${summaryCard('TOTAL KEBUTUHAN DANA',rupiah(d.target),'Estimasi kebutuhan saat target pendidikan dimulai.','')}
        ${summaryCard('DANA YANG SUDAH ADA',rupiah(d.danaAda),'Dana pendidikan yang sudah tersedia saat ini.','green')}
        ${summaryCard('KEKURANGAN DANA',rupiah(d.kurang),'Selisih dana yang perlu dipersiapkan.','red')}
        ${summaryCard('SETORAN BULANAN',rupiah(d.setor),'Estimasi dana yang disiapkan setiap bulan.','gold')}
      </div>
    </div>
    <div class="lower-row">
      <div class="card donut-card">
        <h2 class="page-title-small">KOMPOSISI DANA</h2>
        <div class="donut-layout">
          <div class="donut"><strong>${Math.round(pct)}%</strong></div>
          <div>
            <div class="legend-line"><span class="dot"></span><div><b>Dana Sudah Ada</b><br>${pct.toFixed(1).replace('.0','')}% (${rupiah(d.danaAda)})</div></div>
            <div class="legend-line"><span class="dot gold"></span><div><b>Kekurangan Dana</b><br>${kurangPct.toFixed(1).replace('.0','')}% (${rupiah(d.kurang)})</div></div>
          </div>
        </div>
      </div>
      <div class="card note-card gold-soft">
        <h2 class="page-title-small">CATATAN SINGKAT</h2>
        <ul class="note-list"><li><span class="check">✓</span><span>Mulai lebih awal memberi peluang pertumbuhan dana lebih optimal.</span></li><li><span class="check">✓</span><span>Evaluasi biaya pendidikan dan inflasi setiap 6–12 bulan.</span></li><li><span class="check">✓</span><span>Konsistensi menabung menjadi kunci utama keberhasilan.</span></li><li><span class="check">✓</span><span>Sesuaikan nominal setoran saat penghasilan meningkat.</span></li></ul>
      </div>
    </div>
    <div class="info-box"><div class="info-icon">i</div><div>Perhitungan ini merupakan estimasi berdasarkan target dana pendidikan, jangka waktu persiapan, asumsi inflasi, dan estimasi hasil investasi yang dimasukkan.</div></div>
    <div class="spacer-footer"></div>${pdfFooter(1)}
  </section>
  <section class="cf-page cf-page-break">
    ${pdfHeader('REKOMENDASI FINANCIAL PLANNER','Langkah strategis untuk masa depan pendidikan anak Anda',today)}
    <div class="page-2-layout">
      <div><h2 class="section-title">RINGKASAN RENCANA</h2><div class="grid3">
        <div class="card recommend-card"><h3>TARGET DANA USIA ${d.usiaMasuk} TAHUN</h3><div class="money">${rupiah(d.target)}</div><p>Total kebutuhan saat target pendidikan dimulai.</p></div>
        <div class="card recommend-card green-soft"><h3>JANGKA WAKTU PERSIAPAN</h3><div class="money green-money">${periode}</div><p>Sesuai periode persiapan yang dipilih.</p></div>
        <div class="card recommend-card gold-soft"><h3>DANA DISIAPKAN PER BULAN</h3><div class="money gold-money">${rupiah(d.setor)}</div><p>Estimasi komitmen dana setiap bulan.</p></div>
      </div></div>
      <div class="info-box"><div class="info-icon">i</div><div>Perhitungan ini perlu dievaluasi berkala mengikuti perubahan biaya pendidikan, kemampuan menabung, dan kondisi investasi.</div></div>
      <div class="two-col">
        <div>
          <h2 class="section-title">LANGKAH STRATEGIS</h2>
          ${strategy(1,'Investasi Jangka Panjang','Pilih instrumen investasi sesuai profil risiko dan jangka waktu.','Pertumbuhan Dana','')}
          ${strategy(2,'Proteksi','Lindungi rencana pendidikan dari risiko yang tidak terduga.','Menjaga Rencana','green')}
          ${strategy(3,'Konsistensi','Lakukan setoran rutin dan evaluasi berkala.','Tujuan Pendidikan','gold')}
        </div>
        <div>
          <h2 class="section-title">ACTION PLAN</h2>
          <div class="action-list"><div><span class="mini-check">✓</span><span>Mulai investasi sedini mungkin.</span></div><div><span class="mini-check">✓</span><span>Sisihkan dana rutin setiap bulan.</span></div><div><span class="mini-check">✓</span><span>Tingkatkan nominal saat pendapatan meningkat.</span></div><div><span class="mini-check">✓</span><span>Review rencana minimal 1 tahun sekali.</span></div><div><span class="mini-check">✓</span><span>Lindungi income orang tua dengan asuransi jiwa.</span></div></div>
        </div>
      </div>
      <div class="cta-card"><div><h3>Masa depan anak dimulai dari perencanaan hari ini.</h3><p>Konsultasikan rencana pendidikan secara personal agar strategi yang dipilih sesuai kebutuhan dan kondisi keuangan keluarga.</p></div><div class="contact"><h4>${FP.name}</h4><p>${FP.title}</p><div class="line">WA ${FP.phone}</div><div class="line">${FP.email}</div><div class="line">${FP.ig}</div></div></div>
    </div>
    <div class="spacer-footer"></div>${pdfFooter(2)}
  </section>`;

  function pdfHeader(title,sub,date){return `<header class="cf-header"><div class="cf-logo"><div class="cf-logo-mark">C <span>F</span></div><div class="cf-logo-text">CERDAS<span>FINANSIAL</span></div></div><div class="cf-title"><h1>${esc(title)}</h1><p>${esc(sub)}</p></div><div class="cf-date">Tanggal Simulasi<strong>${esc(date)}</strong></div></header>`;}
  function pdfFooter(page){return `<footer class="cf-footer"><div><b>Cerdas Finansial © 2026</b>${FP.name} • ${FP.phone} • ${FP.email}</div><div class="page-no">Halaman ${page} / 2</div></footer>`;}
  function row(a,b){return `<div class="data-row"><span>${esc(a)}</span><b>: ${esc(b)}</b></div>`;}
  function summaryCard(t,v,n,cls){return `<div class="card summary-card ${cls}"><h3>${esc(t)}</h3><div class="money">${esc(v)}</div><p>${esc(n)}</p></div>`;}
  function strategy(n,title,text,goal,cls){return `<div class="card strategy-box"><div class="num ${cls}">${n}</div><div><h4>${esc(title)}</h4><p>${esc(text)}</p></div><div class="goal">Tujuan:<br>${esc(goal)}</div></div>`;}
}

function resetForm(){
  simulasiForm?.reset();
  if(window.tahunSekarang) tahunSekarang.value=new Date().getFullYear();
  const r=document.querySelector('input[name="strategiInvestasi"][value="0.04"]');
  if(r) r.checked=true;
  updatePeriode();
  kosongkan();
}
