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

function konsultasiWhatsApp(){if(!last)return;let d=last,msg=`Halo Pak Septino,\n\nSaya baru menggunakan aplikasi Cerdas Finansial dan ingin berkonsultasi mengenai hasil simulasi dana pendidikan.\n\nNama Anak: ${d.namaAnak}\nTarget Pendidikan: ${d.targetLabel}\nDana Dibutuhkan: ${rupiah(d.target)}\nDana Saat Ini: ${rupiah(d.danaAda)}\nKekurangan Dana: ${rupiah(d.kurang)}\nEstimasi Setoran: ${rupiah(d.setor)} / bulan\nPeriode Persiapan: ${formatTahun(d.periode)}\n\nMohon dibantu membuatkan strategi yang sesuai. Terima kasih.`;window.open(`https://wa.me/${FP.whatsapp}?text=${encodeURIComponent(msg)}`,'_blank');}function konsultasiEmail(){let subject='Konsultasi Dana Pendidikan';location.href=`mailto:${FP.email}?subject=${encodeURIComponent(subject)}`;}function konsultasiInstagram(){window.open(FP.instagram,'_blank');}
function exportPDF(){
    if(!last){
        alert('Lengkapi data terlebih dahulu.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const d = last;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });

    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 14;
    const today = new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
    const totalPages = 2;

    const C = {
        navy:[6,43,79],
        navy2:[10,60,93],
        gold:[199,154,59],
        gold2:[239,211,139],
        green:[46,139,87],
        red:[190,43,43],
        ink:[23,32,48],
        muted:[92,105,125],
        line:[218,228,238],
        soft:[248,251,253],
        softGold:[255,249,236],
        softBlue:[245,250,254],
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
    function card(x,y,w,h,bg=C.white,border=C.line,r=4){ fill(bg); stroke(border); doc.setLineWidth(.25); doc.roundedRect(x,y,w,h,r,r,'FD'); }
    function wrap(text,x,y,w,size=8,lineH=4,color=C.ink,style='normal'){
        setFont(size,style,color);
        const lines = doc.splitTextToSize(String(text||''),w);
        doc.text(lines,x,y);
        return y + (lines.length * lineH);
    }
    function safe(v){ return v || '-'; }
    function cleanName(txt){ return String(txt||'Simulasi').replace(/[^a-z0-9_\-]+/gi,'_'); }
    function pctInflasi(){ return (d.inflasi*100).toFixed(1).replace('.0','') + '% / tahun'; }
    function periodeFull(){
        const tahun = Math.floor(d.periode || 0);
        const bulan = Math.round((d.periode || 0) * 12);
        return `${formatTahun(d.periode)} (${bulan} Bulan)`;
    }
    function logoMark(x,y,s=1){
        setFont(22*s,'bold',C.navy); doc.text('C',x,y+12*s);
        setFont(22*s,'bold',C.gold); doc.text('F',x+7*s,y+12*s);
        stroke(C.gold); doc.setLineWidth(.7*s); doc.line(x+2*s,y+16*s,x+25*s,y+16*s);
        setFont(4.8*s,'bold',C.navy); doc.text('CERDAS',x+28*s,y+8*s);
        setFont(4.8*s,'bold',C.gold); doc.text('FINANSIAL',x+28*s,y+14*s);
    }
    function header(title,subtitle,page){
        fill(C.white); doc.rect(0,0,W,28,'F');
        logoMark(M,6,.7);
        setFont(12.5,'bold',C.navy); doc.text(title,74,12);
        setFont(7.7,'normal',C.muted); doc.text(subtitle,74,19);
        line(M,27,W-M,27,C.gold,.55);
        setFont(7.2,'bold',C.muted); doc.text(`Halaman ${page} dari ${totalPages}`,W-M,12,{align:'right'});
    }
    function footer(page){
        const fy = H - 18;
        line(M,fy,W-M,fy,C.gold,.45);
        setFont(6.9,'bold',C.navy); doc.text('© 2026 Cerdas Finansial',M,fy+6);
        setFont(6.5,'normal',C.muted); doc.text('Plan Today, Protect Tomorrow',M,fy+11);
        setFont(6.8,'bold',C.navy); doc.text('Disusun oleh: Septino, QWP®, CIS®',W/2,fy+6,{align:'center'});
        setFont(6.4,'normal',C.muted); doc.text('WA 0811-6946-999  |  septinogao@gmail.com  |  @septino.gao',W/2,fy+11,{align:'center'});
        setFont(6.8,'bold',C.navy); doc.text(`Halaman ${page} dari ${totalPages}`,W-M,fy+8,{align:'right'});
    }
    function sectionLabel(text,x,y){
        setFont(10.5,'bold',C.navy); doc.text(text,x,y);
        fill(C.gold); doc.roundedRect(x,y+3,15,1.2,.6,.6,'F');
    }
    function smallCaps(text,x,y,color=C.muted){ setFont(6.7,'bold',color); doc.text(String(text).toUpperCase(),x,y); }
    function miniIcon(x,y,color=C.navy,label=''){
        fill(color); doc.circle(x,y,7,'F');
        setFont(7,'bold',C.white); doc.text(label,x,y+2.4,{align:'center'});
    }
    function statCard(x,y,w,h,label,value,note,color=C.navy){
        card(x,y,w,h,C.white,C.line,4);
        fill(color); doc.roundedRect(x,y,w,2.5,1.2,1.2,'F');
        smallCaps(label,x+7,y+11,C.muted);
        setFont(12.5,'bold',color); doc.text(String(value),x+7,y+22,{maxWidth:w-12});
        if(note) wrap(note,x+7,y+31,w-12,6.5,3.4,C.muted);
    }
    function checklist(x,y,items){
        items.forEach((txt,i)=>{
            const yy=y+i*9.5;
            fill(C.softGold); doc.circle(x,yy-2.2,3.2,'F');
            stroke(C.gold); doc.setLineWidth(.7); doc.line(x-1.4,yy-2.2,x-.3,yy-.7); doc.line(x-.3,yy-.7,x+1.7,yy-4.2);
            wrap(txt,x+7,yy,70,7.1,3.5,C.ink);
        });
    }
    function donut(cx,cy,r,percent){
        stroke(C.line); doc.setLineWidth(10); doc.circle(cx,cy,r,'S');
        stroke(C.gold); doc.setLineWidth(10);
        const end=-90+percent*3.6;
        let lastP=null;
        for(let a=-90; a<=end; a+=3){
            const rad=a*Math.PI/180;
            const p=[cx+r*Math.cos(rad), cy+r*Math.sin(rad)];
            if(lastP) doc.line(lastP[0],lastP[1],p[0],p[1]);
            lastP=p;
        }
        setFont(12,'bold',C.navy); doc.text(Math.round(percent)+'%',cx,cy+4,{align:'center'});
    }

    // ================= PAGE 1 =================
    header('LAPORAN SIMULASI DANA PENDIDIKAN','Perencanaan masa depan anak',1);

    setFont(7.6,'bold',C.navy);
    doc.text(`Tanggal Simulasi: ${today}`,M,38);

    sectionLabel('DATA ANAK',M,52);
    card(M,60,105,52,C.white,C.line,5);
    const dataRows = [
        ['Nama Anak',safe(d.namaAnak)],
        ['Usia Saat Ini',`${d.usiaAnak} tahun`],
        ['Target Pendidikan',d.targetLabel],
        ['Estimasi Biaya Saat Ini',rupiah(d.biaya)],
        ['Inflasi Pendidikan',pctInflasi()],
        ['Hasil Investasi',d.strategi]
    ];
    dataRows.forEach((row,i)=>{
        const yy=70+i*7;
        setFont(7.4,'normal',C.ink); doc.text(row[0],M+6,yy);
        setFont(7.4,'bold',C.navy); doc.text(': '+row[1],M+48,yy,{maxWidth:55});
    });

    card(M+114,60,68,52,C.navy,C.navy,6);
    setFont(10,'bold',C.white); doc.text('KEBUTUHAN DANA',M+148,76,{align:'center'});
    doc.text(`SAAT USIA ${d.usiaMasuk} TAHUN`,M+148,86,{align:'center'});
    line(M+127,96,M+169,96,C.gold,.6);
    setFont(16,'bold',C.gold); doc.text(rupiah(d.target),M+148,106,{align:'center',maxWidth:60});

    sectionLabel('RINGKASAN HASIL SIMULASI',M,129);
    const g=5, w=(W-M*2-g*3)/4;
    statCard(M,138,w,45,'Total Kebutuhan Dana',rupiah(d.target),'Estimasi kebutuhan saat target pendidikan dimulai.',C.navy);
    statCard(M+w+g,138,w,45,'Dana Yang Sudah Terkumpul',rupiah(d.danaAda),'Dana pendidikan yang sudah tersedia saat ini.',C.green);
    statCard(M+(w+g)*2,138,w,45,'Kekurangan Dana',rupiah(d.kurang),'Selisih dana yang perlu disiapkan.',C.red);
    statCard(M+(w+g)*3,138,w,45,'Setoran Bulanan',rupiah(d.setor),'Estimasi dana yang disiapkan setiap bulan.',C.gold);

    card(M,194,86,52,C.white,C.line,5);
    setFont(8.5,'bold',C.navy); doc.text('KOMPOSISI KEBUTUHAN DANA',M+8,205);
    const persenAda = d.target>0 ? Math.min(100,(d.danaAda/d.target)*100) : 0;
    donut(M+29,226,15,persenAda);
    smallCaps('Dana terkumpul',M+54,220,C.muted); setFont(8,'bold',C.navy); doc.text(`${persenAda.toFixed(1).replace('.0','')}% (${rupiah(d.danaAda)})`,M+54,227,{maxWidth:34});
    smallCaps('Kekurangan dana',M+54,238,C.muted); setFont(8,'bold',C.gold); doc.text(`${(100-persenAda).toFixed(1).replace('.0','')}% (${rupiah(d.kurang)})`,M+54,245,{maxWidth:34});

    card(M+94,194,88,52,C.softGold,C.line,5);
    setFont(8.8,'bold',C.navy); doc.text('CATATAN SINGKAT',M+103,205);
    const notes = [
        'Mulai lebih awal memberi peluang pertumbuhan dana yang lebih optimal.',
        'Hasil investasi dan inflasi dapat berubah dari waktu ke waktu.',
        'Disiplin menabung dan konsisten adalah kunci keberhasilan.',
        'Lakukan evaluasi berkala minimal setiap 6–12 bulan.'
    ];
    checklist(M+104,216,notes);

    footer(1);

    // ================= PAGE 2 =================
    doc.addPage();
    header('REKOMENDASI FINANCIAL PLANNER','Langkah strategis agar rencana pendidikan lebih terarah',2);

    let y = 42;
    setFont(11,'bold',C.navy); doc.text('1',M+5,y);
    fill(C.navy); doc.circle(M+5,y-3,5.5,'F'); setFont(8,'bold',C.white); doc.text('1',M+5,y-.5,{align:'center'});
    setFont(10.2,'bold',C.navy); doc.text('RINGKASAN RENCANA DANA PENDIDIKAN',M+14,y);

    const cW=(W-M*2-10)/3;
    statCard(M,y+10,cW,54,'Target Dana Usia '+d.usiaMasuk+' Tahun',rupiah(d.target),'Total kebutuhan saat target pendidikan dimulai.',C.navy);
    statCard(M+cW+5,y+10,cW,54,'Jangka Waktu Persiapan',periodeFull(),'Sesuai periode persiapan yang dipilih.',C.green);
    statCard(M+(cW+5)*2,y+10,cW,54,'Dana Disiapkan Per Bulan',rupiah(d.setor),'Estimasi komitmen dana setiap bulan.',C.gold);

    card(M,y+72,W-M*2,18,C.softBlue,C.line,4);
    miniIcon(M+9,y+81,C.navy,'i');
    wrap('Perhitungan di atas merupakan estimasi berdasarkan target dana pendidikan, jangka waktu persiapan, asumsi inflasi, dan estimasi hasil investasi yang dimasukkan.',M+20,y+80,W-M*2-28,7.2,3.7,C.ink);

    y += 105;
    fill(C.navy); doc.circle(M+5,y-3,5.5,'F'); setFont(8,'bold',C.white); doc.text('2',M+5,y-.5,{align:'center'});
    setFont(10.2,'bold',C.navy); doc.text('LANGKAH STRATEGIS',M+14,y);

    const strategy = [
        ['Investasi Jangka Panjang','Pilih instrumen investasi yang tepat untuk potensi hasil optimal.','Pertumbuhan Dana'],
        ['Proteksi','Lindungi rencana pendidikan dari risiko yang tidak terduga.','Menjaga Rencana'],
        ['Konsistensi','Kunci keberhasilan adalah disiplin dan konsisten menjalankan rencana.','Mewujudkan Tujuan']
    ];
    strategy.forEach((it,i)=>{
        const yy=y+14+i*27;
        card(M,yy,118,22,C.white,C.line,4);
        fill(i===0?C.navy:(i===1?C.green:C.gold)); doc.circle(M+10,yy+11,5.2,'F');
        setFont(7.5,'bold',C.white); doc.text(String(i+1),M+10,yy+13.5,{align:'center'});
        setFont(8.3,'bold',C.navy); doc.text(it[0],M+21,yy+8);
        wrap(it[1],M+21,yy+15,58,6.3,3.2,C.muted);
        fill(C.softBlue); doc.roundedRect(M+84,yy+5,28,12,3,3,'F');
        setFont(6.1,'bold',C.navy); doc.text('Tujuan:',M+98,yy+10,{align:'center'});
        setFont(6,'normal',C.ink); doc.text(it[2],M+98,yy+15,{align:'center'});
    });

    fill(C.navy); doc.circle(M+132,y-3,5.5,'F'); setFont(8,'bold',C.white); doc.text('3',M+132,y-.5,{align:'center'});
    setFont(10.2,'bold',C.navy); doc.text('ACTION PLAN',M+141,y);
    const actions=[
        'Mulai investasi sedini mungkin.',
        'Sisihkan dana secara rutin setiap bulan.',
        'Tingkatkan nominal investasi ketika pendapatan meningkat.',
        'Review rencana minimal 1 tahun sekali.',
        'Lindungi penghasilan orang tua dengan asuransi jiwa.',
        'Hindari pencairan dana sebelum target pendidikan tercapai.'
    ];
    actions.forEach((txt,i)=>{
        const yy=y+16+i*12;
        fill(C.navy); doc.circle(M+134,yy-2,3.5,'F');
        stroke(C.white); doc.setLineWidth(.6); doc.line(M+132.6,yy-2,M+133.7,yy-.7); doc.line(M+133.7,yy-.7,M+136,yy-4.2);
        wrap(txt,M+142,yy,51,7.4,3.7,C.ink);
    });

    card(M,238,W-M*2,27,C.softGold,C.gold,5);
    fill(C.gold); doc.circle(M+12,251,7,'F');
    setFont(9,'bold',C.white); doc.text('EDU',M+12,254,{align:'center'});
    setFont(9.2,'bold',C.navy); doc.text('Masa depan anak dimulai dari perencanaan hari ini.',M+26,248);
    wrap('Konsultasikan rencana pendidikan secara personal agar strategi yang dipilih sesuai dengan kebutuhan dan kondisi keuangan keluarga.',M+26,257,100,7.0,3.5,C.ink);
    setFont(7.4,'bold',C.navy); doc.text('Hubungi Saya:',W-M-48,248);
    setFont(7.0,'bold',C.navy); doc.text('Septino, QWP®, CIS®',W-M-48,255);
    setFont(6.6,'normal',C.muted); doc.text('Financial Planner & Insurance Consultant',W-M-48,262);

    footer(2);

    doc.save(`Laporan_Dana_Pendidikan_${cleanName(d.namaAnak)}.pdf`);
}

function resetForm(){simulasiForm.reset();tahunSekarang.value=new Date().getFullYear();document.querySelector('input[name="strategiInvestasi"][value="0.04"]').checked=true;updatePeriode();kosongkan();}
