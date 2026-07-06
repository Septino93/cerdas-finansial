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
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });

    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 12;
    const CONTENT_BOTTOM = H - 22;
    const today = new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});
    const totalPages = 2;

    const C = {
        navy:[5,44,80], navy2:[10,66,112], gold:[199,154,59], goldSoft:[255,248,230],
        green:[46,139,87], greenSoft:[240,249,244], red:[194,47,52], redSoft:[255,242,242],
        ink:[20,31,48], muted:[88,102,124], line:[216,228,240], soft:[248,251,254], white:[255,255,255]
    };

    const logoUrlCandidates = ['../asset/logo-cerdas-finansial.png','asset/logo-cerdas-finansial.png','../assets/logo-cerdas-finansial.png','assets/logo-cerdas-finansial.png'];
    let logoData = null;
    for (const url of logoUrlCandidates) {
        try { logoData = await imageToDataURL(url); if (logoData) break; } catch(e) {}
    }

    function imageToDataURL(url){
        return new Promise((resolve,reject)=>{
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img,0,0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    function setFont(size=9, style='normal', color=C.ink){
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        doc.setTextColor(...color);
    }
    function fill(c){ doc.setFillColor(...c); }
    function stroke(c){ doc.setDrawColor(...c); }
    function line(x1,y1,x2,y2,c=C.line,w=.25){ stroke(c); doc.setLineWidth(w); doc.line(x1,y1,x2,y2); }
    function card(x,y,w,h,bg=C.white,border=C.line,r=5){ fill(bg); stroke(border); doc.setLineWidth(.25); doc.roundedRect(x,y,w,h,r,r,'FD'); }
    function wrap(text,x,y,w,size=7.4,lineH=3.7,color=C.ink,style='normal'){
        setFont(size,style,color);
        const lines = doc.splitTextToSize(String(text||''),w);
        doc.text(lines,x,y);
        return y + (lines.length * lineH);
    }
    function safe(v){ return v || '-'; }
    function cleanName(txt){ return String(txt||'Simulasi').replace(/[^a-z0-9_\-]+/gi,'_'); }
    function pctInflasi(){ return (d.inflasi*100).toFixed(1).replace('.0','') + '% / tahun'; }
    function periodeFull(){
        const bulan = Math.round((d.periode || 0) * 12);
        return `${formatTahun(d.periode)} (${bulan} Bulan)`;
    }
    function logoMark(x,y,w=32){
        if(logoData){
            doc.addImage(logoData,'PNG',x,y,w,w*.48,undefined,'FAST');
        }else{
            setFont(14,'bold',C.navy); doc.text('CF',x,y+8);
            setFont(8,'bold',C.navy); doc.text('CERDAS',x+14,y+5);
            setFont(8,'bold',C.gold); doc.text('FINANSIAL',x+14,y+10);
        }
    }
    function header(title,subtitle,page){
        fill(C.white); doc.rect(0,0,W,31,'F');
        logoMark(M,8,38);
        setFont(12.5,'bold',C.navy); doc.text(title,M+52,13);
        setFont(8.3,'normal',C.ink); doc.text(subtitle,M+52,20);
        setFont(6.8,'bold',C.muted); doc.text('Tanggal Simulasi',W-M-42,11);
        setFont(7.4,'bold',C.navy); doc.text(today,W-M,18,{align:'right'});
        line(M,29,W-M,29,C.gold,.55);
    }
    function footer(page){
        const fy = H - 17;
        line(M,fy,W-M,fy,C.gold,.45);
        setFont(6.6,'bold',C.navy); doc.text('Disusun oleh:',M,fy+5);
        setFont(7.0,'bold',C.navy); doc.text('Septino, QWP®, CIS®',M,fy+10);
        setFont(6.0,'normal',C.muted); doc.text('Financial Planner & Insurance Consultant',M,fy+14);
        setFont(6.6,'normal',C.ink); doc.text('WA 0811-6946-999',77,fy+8);
        doc.text('septinogao@gmail.com',120,fy+8);
        doc.text('@septino.gao',164,fy+8);
        setFont(6.8,'bold',C.navy); doc.text(`Halaman ${page} dari ${totalPages}`,W-M,fy+10,{align:'right'});
    }
    function sectionTitle(text,x,y,icon=''){
        if(icon){ fill(C.navy); doc.circle(x+3,y-3,4.3,'F'); setFont(7,'bold',C.white); doc.text(icon,x+3,y-.7,{align:'center'}); x += 11; }
        setFont(9.5,'bold',C.navy); doc.text(text,x,y);
        fill(C.gold); doc.roundedRect(x,y+2.7,16,1.1,.55,.55,'F');
    }
    function miniLabel(text,x,y,color=C.muted){ setFont(6.4,'bold',color); doc.text(String(text).toUpperCase(),x,y); }
    function statCard(x,y,w,h,label,value,note,color=C.navy,bg=C.white){
        card(x,y,w,h,bg,C.line,4.5);
        fill(color); doc.circle(x+w/2,y+10,6.8,'F');
        setFont(7,'bold',C.white); doc.text(iconLetter(label),x+w/2,y+12.4,{align:'center'});
        miniLabel(label,x+w/2,y+24,C.navy); // centered via manual below cannot with miniLabel
        setFont(6.8,'bold',C.navy); doc.text(doc.splitTextToSize(label.toUpperCase(),w-12),x+w/2,y+22,{align:'center'});
        setFont(10.4,'bold',color); doc.text(String(value),x+w/2,y+35,{align:'center',maxWidth:w-8});
        if(note) wrap(note,x+6,y+43,w-12,6.4,3.2,C.ink);
    }
    function iconLetter(label){
        label=String(label).toLowerCase();
        if(label.includes('setoran')||label.includes('per bulan')) return 'Rp';
        if(label.includes('dana yang sudah')) return '✓';
        if(label.includes('kekurangan')) return '!';
        if(label.includes('waktu')) return 'T';
        return '•';
    }
    function checklist(x,y,items,color=C.gold,lineH=8.1){
        items.forEach((txt,i)=>{
            const yy=y+i*lineH;
            fill(color); doc.circle(x,yy-2.4,2.6,'F');
            stroke(C.white); doc.setLineWidth(.55); doc.line(x-1.2,yy-2.4,x-.25,yy-1.2); doc.line(x-.25,yy-1.2,x+1.4,yy-4.0);
            wrap(txt,x+7,yy,78,6.7,3.2,C.ink);
        });
    }
    function donut(cx,cy,r,percent){
        stroke(C.line); doc.setLineWidth(10); doc.circle(cx,cy,r,'S');
        stroke(C.gold); doc.setLineWidth(10);
        const end=-90+percent*3.6;
        let lastP=null;
        for(let a=-90; a<=end; a+=2.5){
            const rad=a*Math.PI/180;
            const p=[cx+r*Math.cos(rad), cy+r*Math.sin(rad)];
            if(lastP) doc.line(lastP[0],lastP[1],p[0],p[1]);
            lastP=p;
        }
        setFont(11,'bold',C.navy); doc.text(Math.round(percent)+'%',cx,cy+3.5,{align:'center'});
        setFont(5.8,'normal',C.muted); doc.text('Dana terkumpul',cx,cy+9,{align:'center'});
    }
    function infoBox(x,y,w,text){
        card(x,y,w,17,C.soft,C.line,4);
        fill(C.navy); doc.circle(x+8,y+8.5,5.3,'F');
        setFont(8,'bold',C.white); doc.text('i',x+8,y+11,{align:'center'});
        wrap(text,x+18,y+7.3,w-24,6.8,3.4,C.ink);
    }
    function moneyShort(n){ return rupiah(n); }

    // PAGE 1
    header('LAPORAN SIMULASI DANA PENDIDIKAN','Perencanaan Masa Depan Anak',1);

    const yTop = 42;
    sectionTitle('DATA ANAK',M,yTop,'');
    card(M,yTop+8,98,55,C.white,C.line,5);
    const dataRows = [
        ['Nama Anak',safe(d.namaAnak)],
        ['Usia Saat Ini',`${d.usiaAnak} tahun`],
        ['Target Pendidikan',d.targetLabel],
        ['Estimasi Biaya Saat Ini',rupiah(d.biaya)],
        ['Inflasi Pendidikan',pctInflasi()],
        ['Hasil Investasi',d.strategi]
    ];
    dataRows.forEach((row,i)=>{
        const yy=yTop+19+i*7.2;
        setFont(7.0,'normal',C.ink); doc.text(row[0],M+6,yy);
        setFont(7.0,'bold',C.navy); doc.text(': '+row[1],M+50,yy,{maxWidth:43});
    });

    card(M+108,yTop+8,78,55,C.navy,C.navy,6);
    fill(C.gold); doc.circle(M+147,yTop+18,6.5,'F');
    setFont(8,'bold',C.navy); doc.text('EDU',M+147,yTop+20.5,{align:'center'});
    setFont(10.2,'bold',C.white); doc.text('KEBUTUHAN DANA',M+147,yTop+31,{align:'center'});
    doc.text(`SAAT USIA ${d.usiaMasuk} TAHUN`,M+147,yTop+40,{align:'center'});
    line(M+126,yTop+45,M+168,yTop+45,C.gold,.55);
    setFont(15,'bold',C.gold); doc.text(moneyShort(d.target),M+147,yTop+53,{align:'center',maxWidth:68});

    sectionTitle('RINGKASAN HASIL SIMULASI',M,112);
    const gap=4.5, statW=(W-M*2-gap*3)/4;
    statCard(M,122,statW,48,'Total Kebutuhan Dana',moneyShort(d.target),'Estimasi kebutuhan saat target pendidikan dimulai.',C.navy);
    statCard(M+statW+gap,122,statW,48,'Dana Yang Sudah Terkumpul',moneyShort(d.danaAda),'Dana pendidikan yang sudah tersedia saat ini.',C.green);
    statCard(M+(statW+gap)*2,122,statW,48,'Kekurangan Dana',moneyShort(d.kurang),'Selisih dana yang perlu dipersiapkan.',C.red);
    statCard(M+(statW+gap)*3,122,statW,48,'Setoran Bulanan',moneyShort(d.setor),'Estimasi dana yang disiapkan setiap bulan.',C.gold);

    const bottomY=184;
    card(M,bottomY,92,52,C.white,C.line,5);
    setFont(8.5,'bold',C.navy); doc.text('KOMPOSISI KEBUTUHAN DANA',M+8,bottomY+10);
    const persenAda = d.target>0 ? Math.min(100,(d.danaAda/d.target)*100) : 0;
    donut(M+30,bottomY+31,15,persenAda);
    fill(C.navy); doc.roundedRect(M+56,bottomY+21,3.2,3.2,.8,.8,'F');
    setFont(6.8,'bold',C.navy); doc.text('Dana Terkumpul',M+62,bottomY+24);
    setFont(7.1,'bold',C.ink); doc.text(`${persenAda.toFixed(1).replace('.0','')}% (${moneyShort(d.danaAda)})`,M+62,bottomY+31,{maxWidth:28});
    fill(C.gold); doc.roundedRect(M+56,bottomY+37,3.2,3.2,.8,.8,'F');
    setFont(6.8,'bold',C.navy); doc.text('Kekurangan Dana',M+62,bottomY+40);
    setFont(7.1,'bold',C.gold); doc.text(`${(100-persenAda).toFixed(1).replace('.0','')}% (${moneyShort(d.kurang)})`,M+62,bottomY+47,{maxWidth:28});

    card(M+98,bottomY,88,52,C.goldSoft,C.line,5);
    setFont(8.6,'bold',C.navy); doc.text('CATATAN SINGKAT',M+108,bottomY+10);
    const notes = [
        'Mulai lebih awal memberi peluang pertumbuhan dana yang lebih optimal.',
        'Hasil investasi dan inflasi dapat berubah dari waktu ke waktu.',
        'Disiplin menabung dan konsisten adalah kunci keberhasilan.',
        'Lakukan evaluasi berkala minimal setiap 6–12 bulan.'
    ];
    checklist(M+109,bottomY+21,notes,C.gold,8.0);

    infoBox(M,244,W-M*2,'Perhitungan di atas merupakan estimasi berdasarkan target dana pendidikan, jangka waktu persiapan, asumsi inflasi, dan estimasi hasil investasi yang dimasukkan.');
    footer(1);

    // PAGE 2
    doc.addPage();
    header('REKOMENDASI FINANCIAL PLANNER','Langkah strategis untuk masa depan pendidikan anak Anda',2);

    sectionTitle('RINGKASAN RENCANA DANA PENDIDIKAN',M,43,'1');
    const recY=53, recW=(W-M*2-10)/3;
    statCard(M,recY,recW,57,'Target Dana Usia '+d.usiaMasuk+' Tahun',moneyShort(d.target),'Total kebutuhan saat target pendidikan dimulai.',C.navy,C.white);
    statCard(M+recW+5,recY,recW,57,'Jangka Waktu Persiapan',periodeFull(),'Sesuai periode persiapan yang dipilih.',C.green,C.greenSoft);
    statCard(M+(recW+5)*2,recY,recW,57,'Dana Disiapkan Per Bulan',moneyShort(d.setor),'Estimasi komitmen dana setiap bulan.',C.gold,C.goldSoft);

    infoBox(M,118,W-M*2,'Perhitungan ini bersifat estimasi dan perlu dievaluasi berkala sesuai perubahan biaya pendidikan, kemampuan menabung, serta kondisi investasi.');

    sectionTitle('LANGKAH STRATEGIS',M,148,'2');
    const strategy = [
        ['Investasi Jangka Panjang','Pilih instrumen investasi yang tepat untuk potensi hasil optimal.','Pertumbuhan Dana'],
        ['Proteksi','Lindungi rencana pendidikan dari risiko yang tidak terduga.','Menjaga Rencana'],
        ['Konsistensi','Kunci keberhasilan adalah disiplin dan konsisten menjalankan rencana.','Mewujudkan Tujuan']
    ];
    strategy.forEach((it,i)=>{
        const yy=158+i*25;
        card(M,yy,111,21,C.white,C.line,4);
        fill(i===0?C.navy:(i===1?C.green:C.gold)); doc.circle(M+9,yy+10.5,5,'F');
        setFont(7.4,'bold',C.white); doc.text(String(i+1),M+9,yy+13,{align:'center'});
        setFont(7.7,'bold',C.navy); doc.text(it[0],M+20,yy+8);
        wrap(it[1],M+20,yy+14.5,54,5.9,3.0,C.ink);
        fill(C.soft); doc.roundedRect(M+78,yy+5,28,11,2.8,2.8,'F');
        setFont(5.8,'bold',C.navy); doc.text('Tujuan:',M+92,yy+9.5,{align:'center'});
        setFont(5.7,'normal',C.ink); doc.text(doc.splitTextToSize(it[2],24),M+92,yy+14,{align:'center'});
    });

    sectionTitle('ACTION PLAN',M+123,148,'3');
    const actions=[
        'Mulai investasi sedini mungkin.',
        'Sisihkan dana secara rutin setiap bulan.',
        'Tingkatkan nominal investasi saat pendapatan meningkat.',
        'Review rencana minimal 1 tahun sekali.',
        'Lindungi penghasilan orang tua dengan asuransi jiwa.',
        'Hindari pencairan dana sebelum target pendidikan tercapai.'
    ];
    actions.forEach((txt,i)=>{
        const yy=160+i*11.3;
        fill(C.navy); doc.circle(M+126,yy-2.5,3.3,'F');
        stroke(C.white); doc.setLineWidth(.55); doc.line(M+124.8,yy-2.4,M+126,yy-1.1); doc.line(M+126,yy-1.1,M+128,yy-4.4);
        wrap(txt,M+133,yy,54,6.7,3.2,C.ink);
    });

    // CTA contact card, redesigned and includes WA, Email, Instagram.
    card(M,235,W-M*2,36,C.goldSoft,C.gold,5);
    fill(C.white); stroke(C.gold); doc.setLineWidth(.35); doc.circle(M+14,253,9,'FD');
    setFont(9.5,'bold',C.gold); doc.text('CF',M+14,256,{align:'center'});
    setFont(8.5,'bold',C.navy); doc.text('Masa depan anak dimulai dari perencanaan hari ini.',M+30,246);
    wrap('Konsultasikan rencana pendidikan secara personal agar strategi yang dipilih sesuai dengan kebutuhan dan kondisi keuangan keluarga.',M+30,255,83,6.4,3.2,C.ink);
    line(M+120,241,M+120,266,C.line,.3);
    setFont(7.5,'bold',C.navy); doc.text('Hubungi Saya:',M+126,245);
    setFont(7.7,'bold',C.navy); doc.text('Septino, QWP®, CIS®',M+126,252);
    setFont(6.4,'normal',C.muted); doc.text('Financial Planner & Insurance Consultant',M+126,258);
    setFont(6.5,'normal',C.ink); doc.text('WA 0811-6946-999',M+126,264);
    doc.text('septinogao@gmail.com',M+158,264);
    doc.text('@septino.gao',M+126,270);

    footer(2);
    doc.save(`Laporan_Dana_Pendidikan_${cleanName(d.namaAnak)}.pdf`);
}

function resetForm(){simulasiForm.reset();tahunSekarang.value=new Date().getFullYear();document.querySelector('input[name="strategiInvestasi"][value="0.04"]').checked=true;updatePeriode();kosongkan();}
