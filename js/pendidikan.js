const TARGETS={sd:{label:'SD Swasta',usia:6,lama:6},smp:{label:'SMP Swasta',usia:12,lama:3},sma:{label:'SMA Swasta',usia:15,lama:3},s1dn:{label:'S1 Dalam Negeri',usia:18,lama:4},s1ln:{label:'S1 Luar Negeri',usia:18,lama:4},kedokteran:{label:'Kedokteran',usia:18,lama:6},s2dn:{label:'S2 Dalam Negeri',usia:22,lama:2},s2ln:{label:'S2 Luar Negeri',usia:22,lama:2},custom:{label:'Custom',usia:'',lama:''}};
const FP={whatsapp:'628116946999',email:'septinogao@gmail.com',instagram:'https://instagram.com/septino.gao'};let last=null;
document.addEventListener('DOMContentLoaded',()=>{tahunSekarang.value=new Date().getFullYear();allInputs().forEach(el=>el.addEventListener('input',()=>{formatIfMoney(el);updateTarget();updatePeriode();hitung();}));targetPendidikan.addEventListener('change',()=>{applyTarget();updatePeriode();hitung();});periodePersiapan.addEventListener('change',()=>{customTahunBox.classList.toggle('d-none',periodePersiapan.value!=='custom');hitung();});document.querySelectorAll('input[name="strategiInvestasi"]').forEach(r=>r.addEventListener('change',hitung));updatePeriode();kosongkan();});
function allInputs(){return [...document.querySelectorAll('#simulasiForm input,#simulasiForm select')];}
function bersih(v){return Number(String(v||'').replace(/\D/g,''));}function rupiah(n){return Number(n||0).toLocaleString('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});}function formatIfMoney(el){if(!el.classList.contains('money-input'))return;let n=bersih(el.value);el.value=n?n.toLocaleString('id-ID'):'';}function formatTahun(v){if(!isFinite(v)||v<=0)return '0 Tahun';let y=Math.floor(v),m=Math.round((v-y)*12);return y+(m?` Tahun ${m} Bulan`:' Tahun');}
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

function periodeDetailText(tahun){
    const y = Math.floor(Number(tahun)||0);
    const m = Math.round(((Number(tahun)||0)-y)*12);
    const total = Math.round((Number(tahun)||0)*12);
    if(y<=0 && m<=0) return '0 Tahun';
    let label = y + ' Tahun' + (m ? ' ' + m + ' Bulan' : '');
    return label + ' (' + total + ' Bulan)';
}

function konsultasiWhatsApp(){if(!last)return;let d=last,msg=`Halo Pak Septino,\n\nSaya baru menggunakan aplikasi Cerdas Finansial dan ingin berkonsultasi mengenai hasil simulasi dana pendidikan.\n\nNama Anak: ${d.namaAnak}\nTarget Pendidikan: ${d.targetLabel}\nDana Dibutuhkan: ${rupiah(d.target)}\nDana Saat Ini: ${rupiah(d.danaAda)}\nKekurangan Dana: ${rupiah(d.kurang)}\nEstimasi Setoran: ${rupiah(d.setor)} / bulan\nPeriode Persiapan: ${formatTahun(d.periode)}\n\nMohon dibantu membuatkan strategi yang sesuai. Terima kasih.`;window.open(`https://wa.me/${FP.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank');}function konsultasiEmail(){let subject='Konsultasi Dana Pendidikan';location.href=`mailto:${FP.email}?subject=${encodeURIComponent(subject)}`;}function konsultasiInstagram(){window.open(FP.instagram,'_blank');}
async function exportPDF(){
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
    const M = 14;
    const today = new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
    const reportNo = 'CF-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-01';

    const C = {
        navy:[6,43,79],
        navy2:[8,57,91],
        gold:[205,156,55],
        gold2:[236,194,92],
        green:[46,139,87],
        red:[198,0,0],
        orange:[205,128,21],
        ink:[28,43,63],
        muted:[92,105,125],
        line:[214,226,238],
        soft:[248,251,253],
        softBlue:[239,247,252],
        softGold:[255,248,232],
        white:[255,255,255]
    };

    const logoData = await loadImageAsDataURL('../asset/logo-cerdas-finansial.png');

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
    function wrap(text,x,y,w,size=8,lineH=4.3,color=C.ink,style='normal'){
        setFont(size,style,color);
        const lines = doc.splitTextToSize(String(text),w);
        doc.text(lines,x,y);
        return y + lines.length*lineH;
    }
    function addLogo(x,y,w){
        if(logoData){
            doc.addImage(logoData,'PNG',x,y,w,w*0.72,undefined,'FAST');
        }else{
            fill(C.navy); doc.circle(x+w/2,y+w/3,w/5,'F');
            setFont(12,'bold',C.white); doc.text('CF',x+w/2,y+w/3+3,{align:'center'});
            setFont(8,'bold',C.navy); doc.text('CERDAS FINANSIAL',x+w/2,y+w*.65,{align:'center'});
        }
    }
    function header(page,title='Laporan Simulasi Dana Pendidikan'){
        fill(C.navy); doc.rect(0,0,W,23,'F');
        fill(C.gold); doc.rect(W-42,0,42,23,'F');
        addLogo(M,5,18);
        setFont(10,'bold',C.white); doc.text(title,M+24,12);
        setFont(6.5,'normal',[220,232,242]); doc.text('Cerdas Finansial',M+24,18);
        setFont(12,'bold',C.white); doc.text(String(page).padStart(2,'0'),W-21,15,{align:'center'});
    }
    function footer(page){
        const y=H-20;
        fill(C.navy); doc.rect(0,y,W,20,'F');
        addLogo(M,y+3,20);
        setFont(6.5,'normal',[224,235,245]); doc.text('Disusun oleh:',W-M-54,y+8);
        setFont(8,'bold',C.white); doc.text('Septino, QWP®, CIS®',W-M-54,y+14);
        setFont(6.5,'normal',[224,235,245]); doc.text(`Halaman ${page} dari 3`,W-M,y+14,{align:'right'});
    }
    function sectionTitle(title, y, subtitle=''){
        setFont(15,'bold',C.navy); doc.text(title,M,y);
        fill(C.gold); doc.roundedRect(M,y+4,22,1.5,.7,.7,'F');
        if(subtitle) wrap(subtitle,M,y+11,W-M*2,7.5,4,C.muted);
    }
    function metricCard(x,y,w,h,label,value,note,accent=C.navy){
        card(x,y,w,h,C.white,C.line,5);
        fill(accent); doc.roundedRect(x,y,w,5,2.5,2.5,'F');
        smallCaps(label,x+8,y+13,C.muted);
        setFont(10.8,'bold',accent); doc.text(String(value),x+8,y+22,{maxWidth:w-16});
        if(note) wrap(note,x+8,y+31,w-16,6.4,3.4,C.muted);
    }
    function statusLabel(score){ if(score===100)return 'Sangat Baik'; if(score>=75)return 'Baik'; if(score>=50)return 'Cukup'; return 'Awal'; }
    function statusColor(score){ return score>=75?C.green:(score>=50?C.gold:C.orange); }

    async function loadImageAsDataURL(url){
        try{
            const res = await fetch(url, {cache:'no-store'});
            if(!res.ok) return null;
            const blob = await res.blob();
            return await new Promise(resolve=>{
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            });
        }catch(e){ return null; }
    }

    function topCurve(){
        fill(C.gold); doc.triangle(W-60,0,W,0,W,42,'F');
        fill(C.white); doc.triangle(W-54,0,W,0,W,34,'F');
    }

    // PAGE 1 - COVER + RINGKASAN
    fill(C.white); doc.rect(0,0,W,H,'F');
    topCurve();
    addLogo(M,13,46);
    setFont(20,'bold',C.navy); doc.text('LAPORAN SIMULASI',M,76);
    setFont(24,'bold',C.navy); doc.text('DANA PENDIDIKAN',M,88);
    setFont(11,'normal',C.navy); doc.text('Perencanaan Masa Depan Anak',M,99);

    fill(C.navy); doc.roundedRect(M,109,82,9,4,4,'F');
    setFont(7.5,'bold',C.white); doc.text(`Tanggal Simulasi: ${today}`,M+6,115.2);

    // ilustrasi sederhana tanpa gambar eksternal
    fill(C.softGold); doc.roundedRect(W-76,38,56,54,8,8,'F');
    fill(C.navy); doc.roundedRect(W-61,50,36,6,1,1,'F');
    fill(C.gold); doc.circle(W-42,72,15,'F');
    setFont(7,'bold',C.navy); doc.text('EDU',W-42,74,{align:'center'});

    card(M,132,112,58,C.white,C.line,5);
    fill(C.navy); doc.roundedRect(M,126,50,12,3,3,'F');
    setFont(8,'bold',C.white); doc.text('DATA ANAK',M+8,134);
    const dataRows = [
        ['Nama Anak',safe(d.namaAnak)],
        ['Usia Saat Ini',`${d.usiaAnak} tahun`],
        ['Target Pendidikan',d.targetLabel],
        ['Estimasi Biaya Saat Ini',rupiah(d.biaya)],
        ['Inflasi Pendidikan',pctInflasi()],
        ['Hasil Investasi',d.strategi]
    ];
    let yy=145;
    dataRows.forEach(([a,b])=>{ setFont(7.2,'normal',C.ink); doc.text(a,M+6,yy); doc.text(':',M+63,yy); setFont(7.2,'bold',C.navy); doc.text(b,M+68,yy,{maxWidth:48}); yy+=7.2; });

    card(W-82,132,68,58,C.navy,C.navy,6);
    setFont(9,'bold',C.white); doc.text('KEBUTUHAN DANA',W-48,145,{align:'center'});
    doc.text(`SAAT USIA ${d.usiaMasuk} TAHUN`,W-48,153,{align:'center'});
    line(W-70,166,W-26,166,C.gold,.6);
    setFont(13,'bold',C.gold); doc.text(rupiah(d.target),W-48,178,{align:'center'});

    sectionTitle('Ringkasan Hasil Simulasi',207);
    const cw=(W-M*2-8)/2;
    metricCard(M,218,cw,34,'Total Kebutuhan Dana',rupiah(d.target),'Estimasi kebutuhan saat target pendidikan dimulai.',C.navy);
    metricCard(M+cw+8,218,cw,34,'Dana yang Sudah Terkumpul',rupiah(d.danaAda),'Dana pendidikan yang sudah tersedia saat ini.',C.green);
    metricCard(M,258,cw,34,'Kekurangan Dana',rupiah(d.kurang),'Selisih yang perlu dipersiapkan.',C.red);
    metricCard(M+cw+8,258,cw,34,'Setoran Bulanan',rupiah(d.setor),'Estimasi persiapan per bulan.',C.gold);

    footer(1);

    // PAGE 2 - CATATAN RENCANA, FORMAT SEPERTI CATATAN SINGKAT
    doc.addPage();
    fill(C.white); doc.rect(0,0,W,H,'F');
    header(2,'CATATAN RENCANA');
    sectionTitle('Catatan Rencana',39,'Rencana disusun hari ini, hasilnya untuk masa depan.');

    const noteCards = [
        {icon:'🎯', title:'Tujuan', text:`Mempersiapkan dana pendidikan ${safe(d.namaAnak)} untuk target ${d.targetLabel} saat usia ${d.usiaMasuk} tahun.`},
        {icon:'▣', title:'Strategi', text:`Menabung dan berinvestasi secara konsisten dengan pendekatan ${d.strategi}.`},
        {icon:'◷', title:'Waktu Persiapan', text:`Periode persiapan yang dipilih adalah ${formatTahun(d.periode)}.`},
        {icon:'₿', title:'Komitmen Bulanan', text:`Estimasi dana yang perlu disiapkan sekitar ${rupiah(d.setor)} per bulan.`},
        {icon:'✓', title:'Proteksi Pendukung', text:'Pastikan rencana pendidikan tetap aman dengan perlindungan jiwa orang tua dan dana darurat.'},
        {icon:'↻', title:'Evaluasi Berkala', text:'Tinjau ulang biaya pendidikan, inflasi, dan kemampuan menabung setiap 6–12 bulan.'}
    ];
    let ny=58;
    noteCards.forEach((n,i)=>{
        card(M,ny,W-M*2,25,C.white,C.line,5);
        fill(C.navy); doc.circle(M+14,ny+12.5,8,'F');
        setFont(9,'bold',C.white); doc.text(String(i+1),M+14,ny+15.5,{align:'center'});
        setFont(8.8,'bold',C.navy); doc.text(n.title,M+28,ny+9);
        wrap(n.text,M+28,ny+17,66,6.7,3.5,C.ink);
        stroke(C.line); doc.setLineWidth(.25);
        for(let l=0;l<3;l++) doc.line(M+105,ny+9+l*6,W-M-6,ny+9+l*6);
        ny+=31;
    });

    card(M,250,W-M*2,27,C.softBlue,C.line,5);
    setFont(18,'bold',C.navy); doc.text('“',M+11,263);
    setFont(9,'bold',C.navy); doc.text('Perencanaan yang baik hari ini adalah',W/2,263,{align:'center'});
    doc.text('jembatan menuju masa depan yang lebih baik.',W/2,271,{align:'center'});
    setFont(18,'bold',C.navy); doc.text('”',W-M-14,272);
    footer(2);

    // PAGE 3 - REKOMENDASI RAPI TANPA FOTO PRIBADI
    doc.addPage();
    fill(C.white); doc.rect(0,0,W,H,'F');
    header(3,'REKOMENDASI FINANCIAL PLANNER');
    sectionTitle('Rekomendasi Financial Planner',39,'Langkah berikutnya agar rencana pendidikan lebih terarah dan terlindungi.');

    let ry=60;
    // nomor 1 dirapikan
    fill(C.navy); doc.roundedRect(M,ry-5,10,10,2,2,'F');
    setFont(8,'bold',C.white); doc.text('1',M+5,ry+1.8,{align:'center'});
    setFont(10,'bold',C.navy); doc.text('Persiapkan Dana Sesuai Kebutuhan',M+16,ry+1);
    ry+=11;
    const recW = (W-M*2-12)/3;
    metricCard(M,ry,recW,35,`Target Dana Usia ${d.usiaMasuk} Tahun`,rupiah(d.target),'Total kebutuhan saat target pendidikan dimulai.',C.navy);
    metricCard(M+recW+6,ry,recW,35,'Jangka Waktu Persiapan',periodeDetailText(d.periode),'Sesuai periode persiapan yang dipilih.',C.green);
    metricCard(M+(recW+6)*2,ry,recW,35,'Dana Disiapkan per Bulan',rupiah(d.setor),'Estimasi komitmen bulanan.',C.gold);
    ry+=45;
    card(M,ry,W-M*2,15,C.softBlue,C.line,4);
    setFont(7.2,'bold',C.navy); doc.text('Catatan:',M+7,ry+9.5);
    wrap('Angka ini merupakan estimasi berdasarkan target dana pendidikan, jangka waktu persiapan, asumsi inflasi, dan estimasi hasil investasi yang dimasukkan.',M+25,ry+9.5,W-M*2-32,6.3,3.2,C.muted);

    ry+=29;
    // nomor 2 dirapikan
    fill(C.navy); doc.roundedRect(M,ry-5,10,10,2,2,'F');
    setFont(8,'bold',C.white); doc.text('2',M+5,ry+1.8,{align:'center'});
    setFont(10,'bold',C.navy); doc.text('Gunakan Instrumen yang Tepat',M+16,ry+1);
    ry+=11;
    const inst = [
        ['Investasi Jangka Panjang','Pilih instrumen investasi yang berpotensi memberi imbal hasil optimal.','Tujuan: Pertumbuhan Dana'],
        ['Proteksi','Lindungi rencana pendidikan dari risiko yang tidak terduga.','Tujuan: Menjaga Rencana Tetap Aman'],
        ['Konsistensi','Kunci keberhasilan adalah disiplin dan konsisten menjalankan rencana.','Tujuan: Mewujudkan Tujuan Pendidikan Anak']
    ];
    inst.forEach((it,idx)=>{
        card(M,ry,W-M*2,24,C.white,C.line,5);
        fill(C.softGold); doc.circle(M+12,ry+12,7,'F');
        setFont(8,'bold',C.gold); doc.text(String(idx+1),M+12,ry+14.5,{align:'center'});
        setFont(8.3,'bold',C.navy); doc.text(it[0],M+25,ry+9);
        wrap(it[1],M+25,ry+17,88,6.5,3.2,C.ink);
        fill(C.soft); doc.roundedRect(W-M-48,ry+5,40,14,3,3,'F');
        wrap(it[2],W-M-44,ry+11,32,6.2,3,C.navy,'bold');
        ry+=29;
    });

    ry+=5;
    fill(C.navy); doc.roundedRect(M,ry-5,10,10,2,2,'F');
    setFont(8,'bold',C.white); doc.text('3',M+5,ry+1.8,{align:'center'});
    setFont(10,'bold',C.navy); doc.text('Langkah Selanjutnya',M+16,ry+1);
    ry+=11;
    const steps = [
        ['Diskusi Lebih Lanjut','Konsultasikan rencana secara personal.'],
        ['Review Berkala','Evaluasi rencana secara rutin.'],
        ['Sesuaikan Rencana','Sesuaikan dengan kondisi terkini.'],
        ['Wujudkan Tujuan','Siapkan masa depan terbaik untuk anak.']
    ];
    const sw=(W-M*2-9)/4;
    steps.forEach((s,i)=>{
        const x=M+i*(sw+3);
        card(x,ry,sw,28,C.white,C.line,4);
        setFont(7.2,'bold',C.navy); doc.text(s[0],x+sw/2,ry+10,{align:'center',maxWidth:sw-6});
        wrap(s[1],x+5,ry+18,sw-10,6,3,C.muted);
    });

    ry+=40;
    card(M,ry,W-M*2,34,C.softGold,C.gold,5);
    setFont(9,'bold',C.navy); doc.text('Butuh Bantuan?',M+8,ry+11);
    wrap('Saya siap membantu Anda menyusun strategi dana pendidikan yang sesuai dengan kebutuhan keluarga.',M+8,ry+20,72,6.5,3.4,C.ink);
    line(M+86,ry+7,M+86,ry+27,C.gold,.35);
    setFont(8.5,'bold',C.navy); doc.text('Septino, QWP®, CIS®',M+94,ry+11);
    setFont(6.8,'normal',C.ink); doc.text('Financial Planner & Insurance Consultant',M+94,ry+18);
    doc.text('WA 0811-6946-999',M+94,ry+25);
    doc.text('septinogao@gmail.com  |  @septino.gao',M+142,ry+25);

    footer(3);

    doc.save(`Laporan_Dana_Pendidikan_${cleanName(d.namaAnak)}.pdf`);
}

function resetForm(){simulasiForm.reset();tahunSekarang.value=new Date().getFullYear();document.querySelector('input[name="strategiInvestasi"][value="0.04"]').checked=true;updatePeriode();kosongkan();}
