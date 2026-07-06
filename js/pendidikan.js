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

    const C = {
        navy:[12,43,75],
        navySoft:[235,243,250],
        gold:[199,150,47],
        goldSoft:[255,248,232],
        green:[46,139,87],
        red:[202,0,0],
        ink:[24,38,56],
        muted:[92,105,125],
        line:[216,226,236],
        soft:[248,251,253],
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
    function cleanName(txt){ return String(txt||'Simulasi').replace(/[^a-z0-9_\-]+/gi,'_'); }
    function pctInflasi(){ return (d.inflasi*100).toFixed(1).replace('.0','') + '% / tahun'; }
    function safe(v){ return v || '-'; }
    function mmPeriode(){ return `${Math.round(d.periode*12)} Bulan`; }
    function card(x,y,w,h,bg=C.white,border=C.line,r=5){
        fill(bg); stroke(border); doc.setLineWidth(.25); doc.roundedRect(x,y,w,h,r,r,'FD');
    }
    function line(x1,y1,x2,y2,c=C.line,w=.25){
        stroke(c); doc.setLineWidth(w); doc.line(x1,y1,x2,y2);
    }
    function wrap(text,x,y,w,size=8,lineH=4,color=C.ink,style='normal'){
        setFont(size,style,color);
        const lines = doc.splitTextToSize(String(text),w);
        doc.text(lines,x,y);
        return y + lines.length*lineH;
    }
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
    function addLogo(x,y,w=28){
        if(logoData){
            doc.addImage(logoData,'PNG',x,y,w,w*.72,undefined,'FAST');
        }else{
            setFont(11,'bold',C.navy); doc.text('CERDAS',x,y+8);
            setFont(8,'bold',C.gold); doc.text('FINANSIAL',x,y+14);
        }
    }
    function header(page,title){
        fill(C.white); doc.rect(0,0,W,28,'F');
        addLogo(M,7,30);
        setFont(8,'bold',C.navy); doc.text('CERDAS FINANSIAL',M+35,12);
        setFont(7,'normal',C.muted); doc.text('Education Funding Report',M+35,18);
        setFont(7,'bold',C.muted); doc.text(`Halaman ${page} dari 2`,W-M,12,{align:'right'});
        setFont(7,'normal',C.muted); doc.text(today,W-M,18,{align:'right'});
        fill(C.gold); doc.rect(M,26,W-M*2,1.2,'F');
    }
    function footer(page){
        const y = H - 20;
        line(M,y,W-M,y,C.line,.35);
        setFont(7,'bold',C.navy); doc.text('Cerdas Finansial',M,y+6);
        setFont(6.5,'normal',C.muted); doc.text('Disusun oleh: Septino, QWP®, CIS®',M,y+12);
        setFont(6.5,'normal',C.muted); doc.text('WA 0811-6946-999  |  septinogao@gmail.com  |  @septino.gao',W-M,y+6,{align:'right'});
        setFont(6.5,'normal',C.muted); doc.text(`Halaman ${page} dari 2`,W-M,y+12,{align:'right'});
    }
    function sectionTitle(title, y, subtitle=''){
        setFont(15,'bold',C.navy); doc.text(title,M,y);
        fill(C.gold); doc.roundedRect(M,y+3,22,1.4,.7,.7,'F');
        if(subtitle) wrap(subtitle,M,y+10,W-M*2,7.2,3.7,C.muted);
    }
    function smallLabel(text,x,y){
        setFont(6.8,'bold',C.muted); doc.text(String(text).toUpperCase(),x,y);
    }
    function metricCard(x,y,w,h,label,value,note,accent=C.navy){
        card(x,y,w,h,C.white,C.line,5);
        fill(accent); doc.roundedRect(x,y,w,4.2,2,2,'F');
        smallLabel(label,x+7,y+12);
        setFont(10.5,'bold',accent); doc.text(String(value),x+7,y+21,{maxWidth:w-14});
        if(note) wrap(note,x+7,y+29,w-14,6.2,3.2,C.muted);
    }
    function infoRow(label,value,x,y,w){
        setFont(7.2,'normal',C.muted); doc.text(label,x,y);
        setFont(7.4,'bold',C.navy); doc.text(String(value),x+w,y,{align:'right',maxWidth:w-4});
    }
    function checkItem(text,x,y,w){
        stroke(C.green); doc.setLineWidth(.6); doc.circle(x+3,y-1,2.2,'S');
        setFont(7.4,'normal',C.ink); doc.text(doc.splitTextToSize(text,w-10),x+9,y);
    }

    // PAGE 1: EXECUTIVE SUMMARY
    fill(C.white); doc.rect(0,0,W,H,'F');
    header(1,'Laporan Simulasi Dana Pendidikan');

    setFont(20,'bold',C.navy); doc.text('LAPORAN SIMULASI',M,48);
    setFont(24,'bold',C.navy); doc.text('DANA PENDIDIKAN',M,60);
    setFont(10,'normal',C.muted); doc.text('Ringkasan kebutuhan dan strategi persiapan dana pendidikan anak.',M,69);
    fill(C.goldSoft); doc.roundedRect(W-66,38,52,38,8,8,'F');
    fill(C.navy); doc.roundedRect(W-52,48,30,5,1,1,'F');
    fill(C.gold); doc.circle(W-37,64,11,'F');
    setFont(6,'bold',C.navy); doc.text('EDU',W-37,66,{align:'center'});

    fill(C.navy); doc.roundedRect(M,80,74,9,4,4,'F');
    setFont(7.2,'bold',C.white); doc.text(`Tanggal Simulasi: ${today}`,M+6,86.2);

    const leftW = 112;
    const rightW = W - M*2 - leftW - 8;
    card(M,104,leftW,58,C.white,C.line,5);
    fill(C.navy); doc.roundedRect(M,98,46,12,3,3,'F');
    setFont(8,'bold',C.white); doc.text('DATA ANAK',M+8,106);
    let y=118;
    [
        ['Nama Anak', safe(d.namaAnak)],
        ['Usia Saat Ini', `${d.usiaAnak} tahun`],
        ['Target Pendidikan', d.targetLabel],
        ['Estimasi Biaya Saat Ini', rupiah(d.biaya)],
        ['Inflasi Pendidikan', pctInflasi()],
        ['Hasil Investasi', d.strategi]
    ].forEach(([a,b])=>{ infoRow(a,b,M+7,y,96); y+=7; });

    card(M+leftW+8,98,rightW,64,C.navy,C.navy,6);
    setFont(8.5,'bold',C.white); doc.text(`KEBUTUHAN DANA SAAT USIA ${d.usiaMasuk} TAHUN`,M+leftW+8+rightW/2,114,{align:'center',maxWidth:rightW-10});
    line(M+leftW+22,127,W-M-14,127,C.gold,.55);
    setFont(15,'bold',C.gold); doc.text(rupiah(d.target),M+leftW+8+rightW/2,141,{align:'center',maxWidth:rightW-12});
    setFont(7,'normal',[220,232,242]); doc.text(`Jangka waktu persiapan: ${formatTahun(d.periode)} (${mmPeriode()})`,M+leftW+8+rightW/2,153,{align:'center'});

    sectionTitle('Ringkasan Hasil Simulasi',181);
    const cw=(W-M*2-8)/2;
    metricCard(M,193,cw,33,'Total Kebutuhan Dana',rupiah(d.target),'Estimasi kebutuhan saat target pendidikan dimulai.',C.navy);
    metricCard(M+cw+8,193,cw,33,'Dana yang Sudah Terkumpul',rupiah(d.danaAda),'Dana pendidikan yang sudah tersedia saat ini.',C.green);
    metricCard(M,232,cw,33,'Kekurangan Dana',rupiah(d.kurang),'Selisih yang perlu dipersiapkan.',C.red);
    metricCard(M+cw+8,232,cw,33,'Setoran Bulanan',rupiah(d.setor),'Estimasi persiapan per bulan.',C.gold);

    card(M,271,88,18,C.goldSoft,C.line,4);
    setFont(8.2,'bold',C.navy); doc.text('Catatan Singkat',M+7,278);
    wrap('Mulai lebih awal dan lakukan evaluasi berkala agar rencana pendidikan tetap sesuai dengan inflasi.',M+7,285,74,6.4,3.1,C.ink);
    card(M+96,271,W-M*2-96,18,C.soft,C.line,4);
    setFont(9,'bold',C.navy); doc.text('Investasi terbaik adalah investasi pada pendidikan anak.',M+102,282,{maxWidth:80});
    footer(1);

    // PAGE 2: REKOMENDASI
    doc.addPage();
    fill(C.white); doc.rect(0,0,W,H,'F');
    header(2,'Rekomendasi Financial Planner');
    sectionTitle('Rekomendasi Financial Planner',42,'Langkah berikutnya agar rencana pendidikan lebih terarah dan terlindungi.');

    let ry=63;
    setFont(10,'bold',C.navy); doc.text('1. Persiapkan Dana Sesuai Kebutuhan',M,ry);
    ry+=9;
    const tw=(W-M*2-12)/3;
    metricCard(M,ry,tw,34,`Target Dana Usia ${d.usiaMasuk} Tahun`,rupiah(d.target),'Total kebutuhan saat target pendidikan dimulai.',C.navy);
    metricCard(M+tw+6,ry,tw,34,'Jangka Waktu Persiapan',`${formatTahun(d.periode)}`,`${mmPeriode()} sesuai periode yang dipilih.`,C.green);
    metricCard(M+(tw+6)*2,ry,tw,34,'Dana Disiapkan per Bulan',rupiah(d.setor),'Estimasi komitmen bulanan.',C.gold);
    ry+=44;

    card(M,ry,W-M*2,15,C.navySoft,C.line,4);
    setFont(7.3,'bold',C.navy); doc.text('Catatan:',M+7,ry+9.5);
    wrap('Perhitungan dibuat berdasarkan target dana pendidikan, jangka waktu persiapan, asumsi inflasi, dana awal, dan estimasi hasil investasi yang dimasukkan.',M+25,ry+9.5,W-M*2-32,6.4,3.1,C.muted);
    ry+=28;

    setFont(10,'bold',C.navy); doc.text('2. Action Plan Financial Planner',M,ry);
    ry+=10;
    card(M,ry,W-M*2,58,C.white,C.line,5);
    const col1=M+8, col2=W/2+4;
    checkItem('Mulai investasi rutin sesuai nominal yang direkomendasikan.',col1,ry+14,78);
    checkItem('Evaluasi perkembangan dana minimal 1 kali setiap tahun.',col1,ry+30,78);
    checkItem('Tingkatkan nominal investasi ketika penghasilan meningkat.',col1,ry+46,78);
    checkItem('Lindungi income orang tua dengan proteksi jiwa dan kesehatan.',col2,ry+14,78);
    checkItem('Hindari pencairan dana sebelum target pendidikan tercapai.',col2,ry+30,78);
    checkItem('Sesuaikan target jika biaya pendidikan berubah signifikan.',col2,ry+46,78);
    ry+=72;

    setFont(10,'bold',C.navy); doc.text('3. Strategi yang Disarankan',M,ry);
    ry+=9;
    const stW=(W-M*2-8)/3;
    const strategies = [
        ['Investasi Jangka Panjang','Gunakan instrumen yang sesuai profil risiko dan jangka waktu persiapan.'],
        ['Proteksi Pendukung','Pastikan rencana tetap berjalan walaupun terjadi risiko pada pencari nafkah.'],
        ['Konsistensi','Kunci keberhasilan adalah disiplin menabung dan melakukan review berkala.']
    ];
    strategies.forEach((s,i)=>{
        const x=M+i*(stW+4);
        card(x,ry,stW,40,C.soft,C.line,5);
        fill(i===0?C.navy:(i===1?C.gold:C.green)); doc.circle(x+10,ry+12,5,'F');
        setFont(7,'bold',C.white); doc.text(String(i+1),x+10,ry+14.4,{align:'center'});
        setFont(8.2,'bold',C.navy); doc.text(s[0],x+18,ry+11,{maxWidth:stW-24});
        wrap(s[1],x+8,ry+24,stW-16,6.3,3.2,C.ink);
    });
    ry+=52;

    card(M,ry,W-M*2,34,C.goldSoft,C.gold,5);
    setFont(9.2,'bold',C.navy); doc.text('Butuh Bantuan Menyusun Strategi?',M+8,ry+11);
    wrap('Konsultasikan kembali rencana pendidikan ini setiap 12 bulan agar tetap sesuai dengan inflasi, kondisi keluarga, dan kemampuan menabung.',M+8,ry+20,94,6.6,3.4,C.ink);
    line(M+112,ry+7,M+112,ry+27,C.gold,.35);
    setFont(8.8,'bold',C.navy); doc.text('Septino, QWP®, CIS®',M+120,ry+11);
    setFont(6.8,'normal',C.ink); doc.text('Financial Planner & Insurance Consultant',M+120,ry+18);
    doc.text('WA 0811-6946-999',M+120,ry+25);
    doc.text('septinogao@gmail.com  |  @septino.gao',M+153,ry+25);

    footer(2);

    doc.save(`Laporan_Dana_Pendidikan_${cleanName(d.namaAnak)}.pdf`);
}


function resetForm(){simulasiForm.reset();tahunSekarang.value=new Date().getFullYear();document.querySelector('input[name="strategiInvestasi"][value="0.04"]').checked=true;updatePeriode();kosongkan();}
