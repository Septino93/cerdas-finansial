let CF_LOGO_IMG = null;

function loadCFLogo(){
    CF_LOGO_IMG = new Image();
    CF_LOGO_IMG.crossOrigin = "anonymous";
    CF_LOGO_IMG.src = "../asset/logo-cerdas-finansial.png";
}

document.addEventListener("DOMContentLoaded", loadCFLogo);

const TARGETS={sd:{label:'SD Swasta',usia:6,lama:6},smp:{label:'SMP Swasta',usia:12,lama:3},sma:{label:'SMA Swasta',usia:15,lama:3},s1dn:{label:'S1 Dalam Negeri',usia:18,lama:4},s1ln:{label:'S1 Luar Negeri',usia:18,lama:4},kedokteran:{label:'Kedokteran',usia:18,lama:6},s2dn:{label:'S2 Dalam Negeri',usia:22,lama:2},s2ln:{label:'S2 Luar Negeri',usia:22,lama:2},custom:{label:'Custom',usia:'',lama:''}};
const FP={whatsapp:'628116946999',email:'septinogao@gmail.com',instagram:'https://instagram.com/septino.gao'};let last=null;
document.addEventListener('DOMContentLoaded',()=>{tahunSekarang.value=new Date().getFullYear();allInputs().forEach(el=>el.addEventListener('input',()=>{formatIfMoney(el);updateTarget();updatePeriode();hitung();}));targetPendidikan.addEventListener('change',()=>{applyTarget();updatePeriode();hitung();});periodePersiapan.addEventListener('change',()=>{customTahunBox.classList.toggle('d-none',periodePersiapan.value!=='custom');hitung();});document.querySelectorAll('input[name="strategiInvestasi"]').forEach(r=>r.addEventListener('change',hitung));updatePeriode();kosongkan();});
function allInputs(){return [...document.querySelectorAll('#simulasiForm input,#simulasiForm select')];}
function bersih(v){return Number(String(v||'').replace(/\D/g,''));}function rupiah(n){return Number(n||0).toLocaleString('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});}function formatIfMoney(el){
    if(!el.classList.contains('money-input')) return;

    const digits = String(el.value || '').replace(/\D/g,'');

    if(digits === ''){
        el.value = '';
        return;
    }

    let n = Number(digits);
    el.value = n.toLocaleString('id-ID');
}function formatTahun(v){if(!isFinite(v)||v<=0)return '0 Tahun';let y=Math.floor(v),m=Math.round((v-y)*12);return y+(m?` Tahun ${m} Bulan`:' Tahun');}
function applyTarget(){const t=TARGETS[targetPendidikan.value];if(!t)return;if(t.usia!=='')usiaMasuk.value=t.usia;if(t.lama!=='')lamaStudi.value=t.lama;}function updateTarget(){/* reserved */}
function getBatas(){const usiaA=Number(usiaAyah.value||0),usiaI=Number(usiaIbu.value||0),pens=Number(usiaPensiun.value||0),usia=Number(usiaAnak.value||0),masuk=Number(usiaMasuk.value||0);const sisaKuliah=masuk-usia;let b=[];if(usiaA&&pens)b.push(pens-usiaA);if(usiaI&&pens)b.push(pens-usiaI);if(sisaKuliah>0)b.push(sisaKuliah);let max=b.length?Math.min(...b):0;return {max,sisaKuliah};}
function updatePeriode(){
    const prev=periodePersiapan.value;
    const {max,sisaKuliah}=getBatas();

    periodePersiapan.innerHTML='';
    hidePensionWarning();

    if(!isFinite(max)||max<=0){
        periodePersiapan.innerHTML='<option value="">Lengkapi data dahulu</option>';
        periodeInfo.innerText='Isi usia orang tua, usia anak, dan usia masuk pendidikan.';
        customTahunBox.classList.add('d-none');
        customTahun.removeAttribute('required');
        return;
    }

    [3,5,8,10].forEach(y=>{
        if(y<=max){
            periodePersiapan.innerHTML+=`<option value="${y}">${y} Tahun</option>`;
        }
    });

    if(sisaKuliah>0 && sisaKuliah<=max){
        periodePersiapan.innerHTML+=`<option value="kuliah">Sampai Anak Masuk Pendidikan (${formatTahun(sisaKuliah)})</option>`;
    }

    if(max>=10){
        periodePersiapan.innerHTML+='<option value="custom">Custom / Tentukan Sendiri</option>';
    }

    if(!periodePersiapan.innerHTML){
        let y=Math.max(1,Math.floor(max));
        periodePersiapan.innerHTML=`<option value="${y}">${y} Tahun</option>`;
    }

    if([...periodePersiapan.options].some(o=>o.value===prev)){
        periodePersiapan.value=prev;
    }

    customTahun.max=Math.floor(max);
    customTahunBox.classList.toggle('d-none',periodePersiapan.value!=='custom');
    if(periodePersiapan.value==='custom'){
        customTahun.setAttribute('required','required');
        customTahun.placeholder=`Maksimal ${Math.floor(max)} tahun`;
    }else{
        customTahun.removeAttribute('required');
        customTahun.classList.remove('is-invalid');
    }

    periodeInfo.innerText=`Periode maksimum yang disarankan: ${formatTahun(max)}, berdasarkan sisa waktu pendidikan dan usia pensiun orang tua.`;
    validatePeriodeCustom();
}

function showPensionWarning(message){
    pensionWarning.innerHTML=message;
    pensionWarning.classList.remove('d-none');
}

function hidePensionWarning(){
    pensionWarning.innerHTML='';
    pensionWarning.classList.add('d-none');
}

function validatePeriodeCustom(){
    const {max}=getBatas();

    if(periodePersiapan.value!=='custom'){
        customTahun.classList.remove('is-invalid');
        hidePensionWarning();
        return true;
    }

    const value=Number(customTahun.value||0);
    const maxTahun=Math.floor(max);

    if(!value){
        customTahun.classList.remove('is-invalid');
        showPensionWarning(`ℹ️ Masukkan periode custom. Maksimal yang disarankan adalah <strong>${formatTahun(max)}</strong>.`);
        return false;
    }

    if(value>max){
        customTahun.classList.add('is-invalid');
        showPensionWarning(`⚠️ Periode custom <strong>${value} tahun</strong> melebihi batas aman. Maksimum periode persiapan yang disarankan adalah <strong>${formatTahun(max)}</strong>, berdasarkan sisa waktu menuju pendidikan dan usia pensiun orang tua. Silakan isi maksimal <strong>${maxTahun} tahun</strong>.`);
        return false;
    }

    if(value<=0){
        customTahun.classList.add('is-invalid');
        showPensionWarning('⚠️ Periode custom harus lebih dari 0 tahun.');
        return false;
    }

    customTahun.classList.remove('is-invalid');
    hidePensionWarning();
    return true;
}

function getPeriode(){
    const {max,sisaKuliah}=getBatas();
    let val=periodePersiapan.value;

    if(val==='kuliah') return Math.min(sisaKuliah,max);
    if(val==='custom') return Number(customTahun.value||0);
    return Math.min(Number(val||0),max);
}
function inflasiNum(){return Number(inflasi.value||0)/100;}function rate(){return Number(document.querySelector('input[name="strategiInvestasi"]:checked')?.value||0.04);}function strategiLabel(){let v=rate();return v===0.02?'Konservatif (1–2%)':v===0.06?'Agresif (6% ke atas)':'Moderat (3–5%)';}
function valid(){
    let ok=true;

    document.querySelectorAll('[required]').forEach(el=>{
        let inv=!String(el.value||'').trim();
        if(el.id==='customTahun' && periodePersiapan.value!=='custom') inv=false;
        el.classList.toggle('is-invalid',inv);
        if(inv) ok=false;
    });

    if(Number(usiaMasuk.value)<=Number(usiaAnak.value)){
        usiaMasuk.classList.add('is-invalid');
        ok=false;
    }

    if(!validatePeriodeCustom()){
        ok=false;
    }

    return ok;
}
function kosongkan(){sisaWaktu.innerText='0 Tahun';danaDibutuhkan.innerText='Rp0';kekuranganDana.innerText='Rp0';setoranBulanan.innerText='Rp0';ringkasanText.innerText='Lengkapi semua data wajib untuk melihat hasil simulasi.';insightOrtu.innerText='Lengkapi data orang tua untuk melihat analisis kesiapan sebelum masa pensiun.';tabelDana.innerHTML='';ctaSection.classList.add('d-none');last=null;}
function hitung(){if(!valid()){kosongkan();return;}let d=data();if(d.sisa<=0||d.biaya<=0||d.inflasi<0||d.periode<=0){kosongkan();return;}let target=d.biaya*Math.pow(1+d.inflasi,d.sisa);let kurang=Math.max(target-d.danaAda,0);let setor=calcSetor(kurang,d.periode,d.rate);last={...d,target,kurang,setor};sisaWaktu.innerText=formatTahun(d.sisa);danaDibutuhkan.innerText=rupiah(target);kekuranganDana.innerText=rupiah(kurang);setoranBulanan.innerText=rupiah(setor)+' / bulan';ringkasanText.innerHTML=`Target <strong>${d.targetLabel}</strong> untuk ${d.namaAnak} membutuhkan estimasi dana sebesar <strong>${rupiah(target)}</strong> dalam ${formatTahun(d.sisa)}. Dana yang sudah ada ${rupiah(d.danaAda)}, sehingga kekurangan dana sekitar <strong>${rupiah(kurang)}</strong>.`;insight(d);timeline(d);readiness(d);ctaSection.classList.remove('d-none');}
function data(){let key=targetPendidikan.value;return{namaAyah:namaAyah.value.trim(),usiaAyah:Number(usiaAyah.value),namaIbu:namaIbu.value.trim(),usiaIbu:Number(usiaIbu.value),usiaPensiun:Number(usiaPensiun.value),namaAnak:namaAnak.value.trim(),usiaAnak:Number(usiaAnak.value),targetLabel:TARGETS[key]?.label||'-',usiaMasuk:Number(usiaMasuk.value),lama:Number(lamaStudi.value),biaya:bersih(biayaSaatIni.value),inflasi:inflasiNum(),tahun:Number(tahunSekarang.value),danaAda:bersih(danaAda.value),catatan:catatan.value.trim(),rate:rate(),strategi:strategiLabel(),periode:getPeriode(),sisa:Number(usiaMasuk.value)-Number(usiaAnak.value)}}function calcSetor(k,p,r){if(k<=0||p<=0)return 0;let n=Math.round(p*12),m=r/12;if(m<=0)return k/n;return k*m/(Math.pow(1+m,n)-1);}function insight(d){let aKul=d.usiaAyah+d.sisa,iKul=d.usiaIbu+d.sisa,aFin=d.usiaAyah+d.periode,iFin=d.usiaIbu+d.periode;let warn=(aFin>d.usiaPensiun||iFin>d.usiaPensiun)?'<div class="warning-box">⚠️ Periode persiapan dana melewati usia pensiun. Sistem membatasi pilihan periode agar lebih aman.</div>':'';insightOrtu.innerHTML=`Saat ${d.namaAnak} masuk ${d.targetLabel}, ${d.namaAyah} diperkirakan berusia <strong>${aKul} tahun</strong> dan ${d.namaIbu} <strong>${iKul} tahun</strong>.<br>Dengan periode persiapan ${formatTahun(d.periode)}, usia saat dana ditargetkan terkumpul: ${d.namaAyah} <strong>${aFin.toFixed(0)} tahun</strong>, ${d.namaIbu} <strong>${iFin.toFixed(0)} tahun</strong>. ${warn}`;}
function timeline(d){let html='';for(let i=0;i<=d.sisa;i++){let dana=d.biaya*Math.pow(1+d.inflasi,i),naik=((dana-d.biaya)/d.biaya)*100;html+=`<tr><td>${d.tahun+i}</td><td>${d.usiaAnak+i} Tahun</td><td>${rupiah(dana)}</td><td>${naik.toFixed(1)}%</td></tr>`;}tabelDana.innerHTML=html;}

function getReadinessState(d){
    const sudahTahuKebutuhan = d.target > 0;
    const sudahPunyaTargetWaktu = d.periode > 0;
    const strategiPendanaanDisusun = d.setor >= 0 && d.strategi;
    const danaAwalMencukupi = d.danaAda >= d.target;

    let terpenuhi = 0;
    [sudahTahuKebutuhan, sudahPunyaTargetWaktu, strategiPendanaanDisusun, danaAwalMencukupi].forEach(v=>{
        if(v) terpenuhi++;
    });

    const score = terpenuhi * 25;

    let status='Awal';
    let message='Perencanaan baru dimulai, masih banyak aspek yang perlu dipersiapkan.';
    if(score===100){
        status='Sangat Baik';
        message='Perencanaan sangat baik, pertahankan strategi dan lakukan evaluasi berkala.';
    }else if(score>=75){
        status='Baik';
        message='Perencanaan sudah baik, fokus pada konsistensi mencapai target.';
    }else if(score>=50){
        status='Cukup';
        message='Perencanaan sudah berjalan, namun masih perlu penyempurnaan.';
    }

    return {
        score,
        terpenuhi,
        status,
        message,
        items:[
            {ok:sudahTahuKebutuhan, text:'Sudah mengetahui kebutuhan dana'},
            {ok:sudahPunyaTargetWaktu, text:'Sudah memiliki target waktu'},
            {ok:strategiPendanaanDisusun, text:'Strategi pendanaan sudah disusun'},
            {ok:danaAwalMencukupi, text:danaAwalMencukupi ? 'Dana awal sudah mencukupi' : 'Dana awal belum mencukupi'}
        ]
    };
}

function readiness(d){
    const r = getReadinessState(d);

    readinessScore.innerText = r.score + '%';
    readinessBar.style.width = r.score + '%';
    readinessText.innerText = r.message;

    const itemHTML = (item) => `
        <div class="readiness-item ${item.ok ? 'checked' : ''}">
            <span>${item.ok ? '✓' : ''}</span>
            <strong>${item.text}</strong>
        </div>
    `;

    readinessChecklist.innerHTML = r.items.map(itemHTML).join('');
}

function konsultasiWhatsApp(){if(!last)return;let d=last,msg=`Halo Pak Septino,\n\nSaya baru menggunakan aplikasi Cerdas Finansial dan ingin berkonsultasi mengenai hasil simulasi dana pendidikan.\n\nNama Anak: ${d.namaAnak}\nTarget Pendidikan: ${d.targetLabel}\nDana Dibutuhkan: ${rupiah(d.target)}\nDana Saat Ini: ${rupiah(d.danaAda)}\nKekurangan Dana: ${rupiah(d.kurang)}\nEstimasi Setoran: ${rupiah(d.setor)} / bulan\nPeriode Persiapan: ${formatTahun(d.periode)}\n\nMohon dibantu membuatkan strategi yang sesuai. Terima kasih.`;window.open(`https://wa.me/${FP.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank');}function konsultasiEmail(){let subject='Konsultasi Dana Pendidikan';location.href=`mailto:${FP.email}?subject=${encodeURIComponent(subject)}`;}function konsultasiInstagram(){window.open(FP.instagram,'_blank');}
function exportPDF(){
    if(!last){
        alert('Lengkapi data terlebih dahulu.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const d = last;
    const r = getReadinessState(d);
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });

    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 16;
    const today = new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
    const reportNo = 'CF-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-01';

    const C = {
        navy:[14,58,91],
        navy2:[7,39,64],
        green:[46,139,87],
        green2:[31,116,72],
        gold:[196,145,44],
        orange:[205,128,21],
        red:[180,58,58],
        ink:[38,50,67],
        muted:[92,105,125],
        line:[218,228,238],
        soft:[248,251,253],
        softBlue:[239,247,252],
        softGreen:[235,248,241],
        softGold:[255,247,229],
        white:[255,255,255]
    };

    function setFont(size=9, style='normal', color=C.ink){
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        doc.setTextColor(...color);
    }
    function fill(c){ doc.setFillColor(...c); }
    function stroke(c){ doc.setDrawColor(...c); }
    function line(x1,y1,x2,y2,c=C.line,w=.25){ stroke(c); doc.setLineWidth(w); doc.line(x1,y1,x2,y2); }
    function safe(v){ return v || '-'; }
    function cleanName(txt){ return String(txt||'Simulasi').replace(/[^a-z0-9_\-]+/gi,'_'); }
    function pctInflasi(){ return (d.inflasi*100).toFixed(1).replace('.0','') + '% / tahun'; }
    function card(x,y,w,h,bg=C.white,border=C.line,r=4){ fill(bg); stroke(border); doc.setLineWidth(.25); doc.roundedRect(x,y,w,h,r,r,'FD'); }
    function smallCaps(text,x,y,color=C.muted){ setFont(6.8,'bold',color); doc.text(String(text).toUpperCase(),x,y); }
    function wrap(text,x,y,w,size=8,lineH=4.5,color=C.ink,style='normal'){
        setFont(size,style,color);
        const lines = doc.splitTextToSize(String(text),w);
        doc.text(lines,x,y);
        return y + lines.length*lineH;
    }
    function logo(x,y,s=1){
    try{
        if(CF_LOGO_IMG && CF_LOGO_IMG.complete && CF_LOGO_IMG.naturalWidth > 0){
            doc.addImage(CF_LOGO_IMG,'PNG',x,y,12*s,12*s);
            return;
        }
    }catch(e){}

    fill(C.softGreen);
    doc.roundedRect(x,y,12*s,12*s,3*s,3*s,'F');

    stroke(C.green);
    doc.setLineWidth(.7*s);
    doc.circle(x+6*s,y+6*s,4*s,'S');

    doc.line(x+3.5*s,y+6*s,x+8.5*s,y+6*s);
    doc.line(x+6*s,y+3.5*s,x+6*s,y+8.5*s);
}
}
    }
    function header(page){
        fill(C.white); doc.rect(0,0,W,24,'F');
        line(0,24,W,24,C.line,.35);
        logo(M,6,.9);
        setFont(8.5,'bold',C.navy); doc.text('CERDAS',M+15,11);
        setFont(8.5,'bold',C.green); doc.text('FINANSIAL',M+15,17);
        line(M+42,7,M+42,19,C.line,.35);
        setFont(8.2,'bold',C.navy); doc.text('Laporan Simulasi Dana Pendidikan',M+48,15);
        setFont(7.2,'normal',C.muted); doc.text(`Halaman ${page} dari 3`,W-M,10,{align:'right'});
        line(W-M-30,16,W-M,16,C.green,.45);
    }
    function footer(page){
        const y = H - 18;
        line(M,y,W-M,y,C.line,.3);
        setFont(6.8,'normal',C.muted);
        doc.text('Cerdas Finansial - Digital Financial Planning System',M,H-10);
        doc.text('WA 0811-6946-999',M+72,H-10);
        doc.text('septinogao@gmail.com',M+113,H-10);
        doc.text('@septino.gao',W-M-16,H-10,{align:'right'});
        fill(C.navy); doc.roundedRect(W-M-10,H-15,10,10,2,2,'F');
        setFont(6.8,'bold',C.white); doc.text(String(page).padStart(2,'0'),W-M-5,H-8.8,{align:'center'});
    }
    function sectionTitle(title, subtitle, y){
        setFont(15,'bold',C.navy); doc.text(title,M,y);
        fill(C.green); doc.roundedRect(M,y+3.5,21,1.4,.7,.7,'F');
        if(subtitle) wrap(subtitle,M,y+10,W-M*2,7.5,4.1,C.muted);
    }
    function metricCard(x,y,w,h,label,value,note,accent=C.navy){
        card(x,y,w,h,C.white,C.line,5);
        fill(accent); doc.circle(x+9,y+10,5.2,'F');
        smallCaps(label,x+18,y+8,C.muted);
        setFont(10.5,'bold',accent); doc.text(String(value),x+18,y+17,{maxWidth:w-23});
        if(note) wrap(note,x+18,y+25,w-23,6.5,3.6,C.muted);
    }
    function profileRow(x,y,w,items){
        card(x,y,w,28,C.white,C.line,5);
        const col=w/items.length;
        items.forEach((it,i)=>{
            const xx=x+8+i*col;
            if(i>0) line(x+i*col,y+7,x+i*col,y+21,C.line,.25);
            smallCaps(it.label,xx,y+9,C.muted);
            setFont(8.4,'bold',C.navy); doc.text(String(it.value),xx,y+18,{maxWidth:col-12});
        });
    }
    function statusLabel(score){ if(score===100)return 'Sangat Baik'; if(score>=75)return 'Baik'; if(score>=50)return 'Cukup'; return 'Awal'; }
    function statusColor(score){ return score>=75?C.green:(score>=50?C.gold:C.orange); }
    function checkCircle(x,y,ok){
        fill(ok?C.softGreen:C.softGold); doc.circle(x,y,5.2,'F');
        stroke(ok?C.green:C.orange); doc.setLineWidth(.8); doc.circle(x,y,3.4,'S');
        if(ok){ stroke(C.green); doc.setLineWidth(1.1); doc.line(x-1.8,y,x-.5,y+1.4); doc.line(x-.5,y+1.4,x+2.1,y-2); }
    }
    function readinessScorePanel(x,y,w,h){
        card(x,y,w,h,C.white,C.line,5);
        fill(C.navy); doc.roundedRect(x+12,y-6,w-24,11,2,2,'F');
        setFont(7.2,'bold',C.white); doc.text('SKOR KESIAPAN',x+w/2,y+1,{align:'center'});
        const score=r.score;
        const col=statusColor(score);
        const cx=x+w/2, cy=y+36;
        stroke(C.line); doc.setLineWidth(5); doc.circle(cx,cy,19,'S');
        stroke(col); doc.setLineWidth(5);
        let lastP=null, end=-90+score*3.6;
        for(let a=-90;a<=end;a+=4){ const rad=a*Math.PI/180; const p=[cx+19*Math.cos(rad), cy+19*Math.sin(rad)]; if(lastP) doc.line(lastP[0],lastP[1],p[0],p[1]); lastP=p; }
        setFont(18,'bold',C.navy); doc.text(score+'%',cx,cy+2,{align:'center'});
        setFont(8,'bold',col); doc.text(statusLabel(score),cx,cy+12,{align:'center'});
        line(x+10,y+62,x+w-10,y+62,C.line,.25);
        setFont(9,'bold',C.navy); doc.text(`${r.terpenuhi} dari 4 indikator`,cx,y+72,{align:'center'});
        setFont(7.2,'normal',C.muted); doc.text('telah terpenuhi',cx,y+79,{align:'center'});
    }
    function infoBox(x,y,w,h,title,text,accent=C.navy){
        card(x,y,w,h,C.white,C.line,5);
        fill(accent); doc.circle(x+12,y+16,8,'F');
        setFont(12,'bold',C.white); doc.text(title==='Artinya:'?'i':'+',x+12,y+20,{align:'center'});
        setFont(9.2,'bold',accent); doc.text(title,x+26,y+12);
        wrap(text,x+26,y+22,w-34,7.6,4.2,C.ink);
    }

    // PAGE 1
    fill(C.navy2); doc.rect(0,0,W,38,'F');
    fill(C.green); doc.rect(0,38,W,2.8,'F');
    logo(M,10,1.05);
    setFont(13,'bold',C.white); doc.text('CERDAS',M+18,19);
    setFont(13,'bold',[168,227,192]); doc.text('FINANSIAL',M+18,29);
    setFont(11,'bold',C.white); doc.text('Laporan Simulasi Dana Pendidikan',W-M,18,{align:'right'});
    setFont(7.4,'normal',[222,232,240]); doc.text(`No. ${reportNo}`,W-M,27,{align:'right'});

    sectionTitle('Ringkasan Eksekutif','Simulasi disusun berdasarkan data keluarga, target pendidikan, dan asumsi yang diinput pada aplikasi.',52);
    card(W-M-46,48,46,22,C.soft,C.line,5);
    smallCaps('Tanggal Simulasi',W-M-38,57,C.muted); setFont(8.5,'bold',C.green); doc.text(today,W-M-38,66);
    line(W-M-38,72,W-M-12,72,C.green,.45);

    profileRow(M,78,W-M*2,[
        {label:'Nama Ayah',value:`${safe(d.namaAyah)} (${d.usiaAyah} th)`},
        {label:'Nama Ibu',value:`${safe(d.namaIbu)} (${d.usiaIbu} th)`},
        {label:'Nama Anak',value:`${safe(d.namaAnak)} (${d.usiaAnak} th)`},
        {label:'Target',value:d.targetLabel}
    ]);

    const gap=8, cw=(W-M*2-gap)/2; let y=118;
    metricCard(M,y,cw,30,'Target Dana Pendidikan',rupiah(d.target),'Estimasi dana saat pendidikan dimulai.',C.navy);
    metricCard(M+cw+gap,y,cw,30,'Dana Sudah Ada',rupiah(d.danaAda),'Dana yang tersedia saat ini.',C.green);
    y+=38;
    metricCard(M,y,cw,30,'Kekurangan Dana',rupiah(d.kurang),'Target yang masih perlu dipersiapkan.',C.orange);
    metricCard(M+cw+gap,y,cw,30,'Estimasi Setoran Bulanan',rupiah(d.setor)+' / bulan',`Periode ${formatTahun(d.periode)} - ${d.strategi}.`,C.green);
    y+=38;
    metricCard(M,y,cw,30,'Inflasi Pendidikan',pctInflasi(),'Asumsi kenaikan biaya pendidikan.',C.navy);
    metricCard(M+cw+gap,y,cw,30,'Periode Persiapan',formatTahun(d.periode),'Waktu pengumpulan dana yang dipilih.',C.gold);

    card(M,237,W-M*2,24,C.softBlue,C.line,5);
    setFont(8.2,'bold',C.navy); doc.text('Catatan Singkat',M+8,247);
    wrap(`Simulasi ini membantu memperkirakan kebutuhan dana pendidikan ${safe(d.namaAnak)} dan estimasi setoran berkala yang perlu disiapkan.`,M+43,247,W-M*2-52,7.1,4,C.muted);
    footer(1);

    // PAGE 2
    doc.addPage(); header(2);
    sectionTitle('Analisis Kesiapan','Evaluasi kesiapan rencana dana pendidikan berdasarkan empat indikator utama.',38);

    card(M,58,112,95,C.white,C.line,5);
    const desc=['Kebutuhan dana pendidikan sudah berhasil dihitung.','Periode persiapan dana telah ditentukan.','Strategi simulasi pendanaan telah dipilih.','Dana tersedia dibandingkan dengan target kebutuhan.'];
    r.items.forEach((it,i)=>{
        const yy=74+i*18;
        checkCircle(M+10,yy-3,it.ok);
        setFont(8.3,'bold',C.navy); doc.text(it.text,M+21,yy-5,{maxWidth:78});
        wrap(desc[i],M+21,yy+2,78,6.4,3.6,C.muted);
        if(i<3) line(M+21,yy+9,M+104,yy+9,C.line,.2);
    });
    readinessScorePanel(M+122,58,W-M*2-122,95);

    infoBox(M,164,86,40,'Artinya:',r.message,C.navy);
    infoBox(M+94,164,W-M*2-94,40,'Rekomendasi Utama:','Tingkatkan dana awal dan lakukan evaluasi rutin agar target pendidikan tercapai tepat waktu.',C.green);

    card(M,218,W-M*2,38,C.softBlue,C.line,5);
    fill(C.navy); doc.rect(M,218,10,38,'F');
    fill(C.green); doc.triangle(M+4,237,M+8,231,M+8,243,'F');
    setFont(9.5,'bold',C.navy); doc.text('Catatan Rencana',M+20,232);
    const note1=`Saat ${d.namaAnak} masuk ${d.targetLabel}, ${d.namaAyah} diperkirakan berusia ${d.usiaAyah+d.sisa} tahun dan ${d.namaIbu} ${d.usiaIbu+d.sisa} tahun.`;
    const note2=`Dengan periode persiapan ${formatTahun(d.periode)}, estimasi setoran bulanan yang perlu dipersiapkan adalah ${rupiah(d.setor)} per bulan.`;
    wrap(note1,M+63,232,W-M*2-72,7.6,4.2,C.muted);
    wrap(note2,M+20,247,W-M*2-28,7.6,4.2,C.muted);
    footer(2);

    // PAGE 3
    doc.addPage(); header(3);
    sectionTitle('Proyeksi & Rekomendasi','Ringkasan perkembangan estimasi dana pendidikan dan rekomendasi tindak lanjut.',38);
    const rows=[];
    for(let i=0;i<=d.sisa;i++){
        const show=d.sisa<=10 || i%2===0 || i===d.sisa;
        if(!show) continue;
        const dana=d.biaya*Math.pow(1+d.inflasi,i), naik=((dana-d.biaya)/d.biaya)*100;
        rows.push([String(d.tahun+i),`${d.usiaAnak+i} Tahun`,rupiah(dana),naik.toFixed(1)+'%']);
    }
    doc.autoTable({
        startY:55,
        margin:{left:M,right:M},
        theme:'grid',
        head:[['Tahun','Usia Anak','Estimasi Dana','Kenaikan']],
        body:rows,
        styles:{font:'helvetica',fontSize:7.4,cellPadding:2.6,lineColor:C.line,textColor:C.ink,overflow:'linebreak'},
        headStyles:{fillColor:C.navy,textColor:255,fontStyle:'bold'},
        alternateRowStyles:{fillColor:[246,250,252]},
        columnStyles:{0:{cellWidth:28},1:{cellWidth:40},2:{cellWidth:72},3:{cellWidth:36}}
    });
    let ty=doc.lastAutoTable.finalY+8;

    // Catatan proyeksi dibuat lebih kecil dan rapi
    card(M,ty,W-M*2,14,C.soft,C.line,4);
    setFont(7.4,'bold',C.navy);
    doc.text('Catatan:',M+6,ty+8.8);
    wrap(`Proyeksi menggunakan asumsi inflasi ${pctInflasi()}. Angka bersifat simulasi dan dapat berubah sesuai kondisi biaya pendidikan.`,M+23,ty+8.8,W-M*2-30,6.8,3.6,C.muted);

    ty+=23;

    // Rekomendasi Financial Planner - layout baru, tidak overlap
    card(M,ty,W-M*2,48,C.white,C.line,5);
    setFont(10.5,'bold',C.green);
    doc.text('Rekomendasi Financial Planner',M+8,ty+12);

    const recY1=ty+24;
    fill(C.softGreen);
    doc.circle(M+13,recY1-2,5.8,'F');
    setFont(7.8,'bold',C.green);
    doc.text('1',M+13,recY1+0.6,{align:'center'});
    wrap('Mulai persiapan sedini mungkin, lakukan evaluasi biaya pendidikan setiap tahun, dan sesuaikan strategi pendanaan dengan kemampuan cashflow keluarga.',M+25,recY1,W-M*2-33,7.0,3.7,C.ink);

    line(M+25,ty+32.5,W-M-8,ty+32.5,C.line,.22);

    const recY2=ty+41;
    fill(C.softGreen);
    doc.circle(M+13,recY2-2,5.8,'F');
    setFont(7.8,'bold',C.green);
    doc.text('2',M+13,recY2+0.6,{align:'center'});
    wrap('Pertimbangkan proteksi jiwa orang tua agar target pendidikan tetap terlindungi jika terjadi risiko finansial.',M+25,recY2,W-M*2-33,7.0,3.7,C.ink);

    ty+=58;

    // Profil planner dan disclaimer dibuat seimbang serta mudah dibaca
    const boxH=38;
    const leftW=88;
    const rightW=W-M*2-leftW-8;

    card(M,ty,leftW,boxH,C.white,C.line,5);
    fill(C.navy);
    doc.circle(M+14,ty+19,9,'F');
    setFont(7,'bold',C.white);
    doc.text('SG',M+14,ty+21.4,{align:'center'});
    setFont(9,'bold',C.navy);
    doc.text('Septino Gao, QWP®, CIS®',M+29,ty+12);
    setFont(7.2,'normal',C.muted);
    doc.text('Financial Planner',M+29,ty+20);
    setFont(6.8,'normal',C.ink);
    doc.text('WA 0811-6946-999',M+29,ty+28);
    doc.text('septinogao@gmail.com  |  @septino.gao',M+29,ty+34);

    card(M+leftW+8,ty,rightW,boxH,C.softBlue,C.line,5);
    setFont(8.8,'bold',C.navy);
    doc.text('Disclaimer',M+leftW+16,ty+12);
    wrap('Laporan ini merupakan simulasi berdasarkan data dan asumsi yang diinput. Hasil perhitungan tidak menjamin hasil investasi di masa mendatang. Diskusikan strategi yang sesuai dengan kondisi keluarga bersama Financial Planner.',M+leftW+16,ty+20,rightW-16,6.5,3.5,C.muted);

    footer(3);

    doc.save(`Laporan_Dana_Pendidikan_${cleanName(d.namaAnak)}.pdf`);
}

function resetForm(){simulasiForm.reset();tahunSekarang.value=new Date().getFullYear();document.querySelector('input[name="strategiInvestasi"][value="0.04"]').checked=true;updatePeriode();kosongkan();}
