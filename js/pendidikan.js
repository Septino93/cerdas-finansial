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
    const doc = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });

    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 12;
    const today = new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});

    const C = {
        navy:[8,47,83],
        navy2:[5,36,64],
        gold:[202,151,46],
        gold2:[236,184,70],
        green:[46,139,87],
        red:[194,45,48],
        ink:[19,35,57],
        muted:[87,103,126],
        line:[214,226,238],
        soft:[248,251,253],
        softBlue:[241,247,252],
        softGold:[255,248,231],
        softGreen:[237,248,241],
        white:[255,255,255]
    };

    function cleanName(txt){ return String(txt||'Simulasi').replace(/[^a-z0-9_\-]+/gi,'_'); }
    function safe(v){ return v || '-'; }
    function pctInflasi(){ return (d.inflasi*100).toFixed(1).replace('.0','') + '% / tahun'; }
    function bulanPeriode(){ return Math.round((d.periode || 0) * 12); }
    function periodeText(){ return `${formatTahun(d.periode)} (${bulanPeriode()} Bulan)`; }
    function font(size=9,style='normal',color=C.ink){
        doc.setFont('helvetica',style);
        doc.setFontSize(size);
        doc.setTextColor(...color);
    }
    function fill(c){ doc.setFillColor(...c); }
    function stroke(c){ doc.setDrawColor(...c); }
    function line(x1,y1,x2,y2,c=C.line,w=.25){ stroke(c); doc.setLineWidth(w); doc.line(x1,y1,x2,y2); }
    function round(x,y,w,h,r=4,fillColor=C.white,lineColor=C.line){
        fill(fillColor); stroke(lineColor); doc.setLineWidth(.35); doc.roundedRect(x,y,w,h,r,r,'FD');
    }
    function wrap(text,x,y,w,size=8,lineH=4,color=C.ink,style='normal'){
        font(size,style,color);
        const lines=doc.splitTextToSize(String(text),w);
        doc.text(lines,x,y);
        return y + lines.length*lineH;
    }
    function fitText(text,x,y,w,maxSize=13,minSize=7,color=C.ink,style='bold',align='left'){
        let size=maxSize;
        doc.setFont('helvetica',style);
        while(size>minSize && doc.getTextWidth(String(text))>w){ size-=.4; doc.setFontSize(size); }
        font(size,style,color);
        doc.text(String(text),x,y,{align});
    }
    function iconCircle(x,y,r=6,color=C.navy,txt=''){
        fill(color); doc.circle(x,y,r,'F');
        if(txt){ font(8,'bold',C.white); doc.text(txt,x,y+2.5,{align:'center'}); }
    }
    function logoMark(x,y,s=1){
        // Simple CF mark, vector-based supaya tajam di PDF.
        stroke(C.navy); doc.setLineWidth(1.8*s); doc.arc(x+8*s,y+8*s,7*s,110,295,'S');
        fill(C.gold); doc.roundedRect(x+8*s,y+4*s,9*s,3.2*s,1.5*s,1.5*s,'F');
        fill(C.gold); doc.roundedRect(x+8*s,y+7.2*s,8*s,3*s,1.2*s,1.2*s,'F');
        fill(C.gold); doc.roundedRect(x+8*s,y+4*s,3.2*s,13*s,1.5*s,1.5*s,'F');
        fill(C.navy); doc.rect(x+14*s,y+12*s,1.6*s,4*s,'F');
        fill(C.navy); doc.rect(x+16.4*s,y+10*s,1.6*s,6*s,'F');
        fill(C.navy); doc.rect(x+18.8*s,y+8*s,1.6*s,8*s,'F');
        stroke(C.gold); doc.setLineWidth(.9*s); doc.line(x+8*s,y+17*s,x+21*s,y+12*s);
    }
    function header(title,subtitle,page){
        fill(C.white); doc.rect(0,0,W,34,'F');
        logoMark(M,7,1.15);
        font(10,'bold',C.navy); doc.text('CERDAS',M+28,15);
        font(10,'bold',C.gold); doc.text('FINANSIAL',M+28,22);
        font(14,'bold',C.navy); doc.text(title,84,15);
        font(8.4,'normal',C.ink); doc.text(subtitle,84,23);
        if(page===1){
            font(7.5,'bold',C.navy); doc.text('Tanggal Simulasi',W-M-48,13);
            font(8,'bold',C.ink); doc.text(today,W-M-48,21);
        }
        line(M,31,W-M,31,C.gold,.55);
    }
    function footer(page){
        const y=199;
        line(M,y,W-M,y,C.gold,.35);
        font(6.8,'bold',C.navy); doc.text('Disusun oleh:',M,y+6);
        font(7.4,'bold',C.ink); doc.text('Septino, QWP®, CIS®',M,y+11);
        font(6.4,'normal',C.muted); doc.text('Financial Planner & Insurance Consultant',M,y+15.5);
        font(6.8,'normal',C.ink); doc.text('WA 0811-6946-999',92,y+10);
        doc.text('septinogao@gmail.com',142,y+10);
        doc.text('@septino.gao',205,y+10);
        round(W-M-25,y+5,25,9,3,C.softGold,[245,215,150]);
        font(6.8,'bold',C.navy); doc.text(`Halaman ${page} dari 2`,W-M-12.5,y+11,{align:'center'});
    }
    function sectionTitle(x,y,title){
        font(10,'bold',C.navy); doc.text(title,x,y);
        fill(C.gold); doc.roundedRect(x,y+2,18,1.4,.7,.7,'F');
    }
    function dataTable(x,y,w,h){
        round(x,y,w,h,4,C.white,C.line);
        fill(C.navy); doc.roundedRect(x,y-6,42,11,3,3,'F');
        iconCircle(x+7,y-.8,4.2,C.navy,'');
        font(8,'bold',C.white); doc.text('DATA ANAK',x+15,y+1.5);
        const rows=[
            ['Nama Anak', safe(d.namaAnak)],
            ['Usia Saat Ini', `${d.usiaAnak} tahun`],
            ['Target Pendidikan', d.targetLabel],
            ['Estimasi Biaya Saat Ini', rupiah(d.biaya)],
            ['Inflasi Pendidikan', pctInflasi()],
            ['Hasil Investasi', d.strategi]
        ];
        let yy=y+13;
        rows.forEach(([a,b])=>{
            font(7.2,'normal',C.ink); doc.text(a,x+8,yy);
            font(7.2,'bold',C.navy); doc.text(':',x+w*.48,yy);
            doc.text(String(b),x+w*.53,yy,{maxWidth:w*.4});
            yy+=6.5;
        });
    }
    function bigNeedCard(x,y,w,h){
        round(x,y,w,h,6,C.navy2,C.navy2);
        iconCircle(x+w/2,y+12,8,C.gold,'');
        font(6.8,'bold',C.white); doc.text('EDU',x+w/2,y+14.3,{align:'center'});
        font(10,'bold',C.white); doc.text('KEBUTUHAN DANA',x+w/2,y+28,{align:'center'});
        font(10,'bold',C.white); doc.text(`SAAT USIA ${d.usiaMasuk} TAHUN`,x+w/2,y+37,{align:'center'});
        line(x+26,y+45,x+w-26,y+45,C.gold,.55);
        fitText(rupiah(d.target),x+w/2,y+60,w-18,17,10,C.gold,'bold','center');
        font(7.2,'normal',C.white); doc.text('Estimasi kebutuhan saat target pendidikan dimulai.',x+w/2,y+70,{align:'center',maxWidth:w-22});
    }
    function summaryCard(x,y,w,h,label,value,note,color,iconTxt){
        round(x,y,w,h,4,C.white,C.line);
        fill(color); doc.roundedRect(x,y,w,2.7,1.3,1.3,'F');
        iconCircle(x+w/2,y+12,7,color,iconTxt);
        font(7.2,'bold',C.navy); doc.text(label,x+w/2,y+24,{align:'center',maxWidth:w-8});
        fitText(value,x+w/2,y+35,w-8,11,7,color,'bold','center');
        wrap(note,x+6,y+44,w-12,6.3,3.5,C.ink);
    }
    function donut(x,y,r,percent){
        const cx=x+r, cy=y+r;
        stroke([216,226,236]); doc.setLineWidth(10); doc.circle(cx,cy,r-5,'S');
        stroke(C.gold); doc.setLineWidth(10);
        let prev=null,end=-90+percent*3.6;
        for(let a=-90;a<=end;a+=3){
            const rad=a*Math.PI/180;
            const p=[cx+(r-5)*Math.cos(rad),cy+(r-5)*Math.sin(rad)];
            if(prev) doc.line(prev[0],prev[1],p[0],p[1]);
            prev=p;
        }
        fill(C.white); doc.circle(cx,cy,r-12,'F');
        font(14,'bold',C.navy); doc.text(`${Math.round(percent)}%`,cx,cy+2,{align:'center'});
        font(5.8,'normal',C.muted); doc.text('Dana Terkumpul',cx,cy+8,{align:'center'});
    }
    function noteChecklist(x,y,w,h){
        round(x,y,w,h,5,C.softGold,[245,215,150]);
        font(9.5,'bold',C.navy); doc.text('CATATAN SINGKAT',x+12,y+12);
        const notes=[
            'Mulai lebih awal memberi peluang pertumbuhan dana yang lebih optimal.',
            'Hasil investasi dan inflasi dapat berubah dari waktu ke waktu.',
            'Disiplin menabung dan konsisten adalah kunci keberhasilan.',
            'Lakukan evaluasi berkala minimal setiap 6–12 bulan.'
        ];
        let yy=y+25;
        notes.forEach(n=>{
            iconCircle(x+13,yy-2.5,3.4,C.gold,'✓');
            wrap(n,x+22,yy,w-30,6.7,3.6,C.ink);
            yy+=9.8;
        });
    }
    function infoStrip(x,y,w,h){
        round(x,y,w,h,4,C.softBlue,C.line);
        iconCircle(x+12,y+h/2,6,C.navy,'i');
        wrap('Perhitungan di atas merupakan estimasi berdasarkan target dana pendidikan, jangka waktu persiapan, asumsi inflasi, dan estimasi hasil investasi yang dimasukkan.',x+24,y+8,w-34,7,3.8,C.ink);
    }
    function recommendCard(x,y,w,h,title,value,desc,color){
        round(x,y,w,h,5,C.white,color);
        iconCircle(x+15,y+16,8,color,'');
        font(7.4,'bold',C.navy); doc.text(title,x+30,y+12,{maxWidth:w-38});
        fitText(value,x+w/2,y+32,w-14,13,8,color,'bold','center');
        wrap(desc,x+12,y+43,w-24,6.8,3.8,C.ink);
    }
    function strategyItem(x,y,w,num,title,text,goal,color){
        iconCircle(x+5,y+6,5,color,String(num));
        font(18,'normal',C.navy); doc.text(num===1?'↗':num===2?'🛡':'◎',x+18,y+11);
        font(7.4,'bold',C.navy); doc.text(title,x+34,y+5);
        wrap(text,x+34,y+13,w-72,6.2,3.5,C.ink);
        round(x+w-48,y+1,40,15,3,C.soft,C.line);
        font(6.2,'bold',C.navy); doc.text('Tujuan:',x+w-28,y+7,{align:'center'});
        wrap(goal,x+w-45,y+12,34,5.5,3,C.ink,'bold');
    }
    function actionList(x,y){
        font(10,'bold',C.navy); doc.text('3  ACTION PLAN',x,y);
        const arr=['Mulai investasi sedini mungkin.','Sisihkan dana secara rutin setiap bulan.','Tingkatkan nominal investasi setiap kenaikan pendapatan.','Review rencana minimal 1 tahun sekali.','Lindungi penghasilan orang tua dengan asuransi jiwa.','Hindari pencairan dana sebelum target pendidikan tercapai.'];
        let yy=y+12;
        arr.forEach(t=>{ iconCircle(x+3,yy-2.5,3.3,C.navy,'✓'); wrap(t,x+10,yy,58,6.8,3.8,C.ink); yy+=11; });
    }
    function ctaBox(x,y,w,h){
        round(x,y,w,h,6,C.softGold,C.gold);
        iconCircle(x+15,y+h/2,9,C.gold,'EDU');
        font(8.2,'bold',C.navy); doc.text('Masa depan anak dimulai dari perencanaan hari ini.',x+33,y+13);
        wrap('Konsultasikan rencana pendidikan secara personal agar strategi yang dipilih sesuai dengan kebutuhan dan kondisi keuangan keluarga.',x+33,y+24,w*.48,6.5,3.6,C.ink);
        line(x+w*.62,y+9,x+w*.62,y+h-9,C.gold,.3);
        font(7.5,'bold',C.navy); doc.text('Hubungi Saya:',x+w*.66,y+11);
        font(8,'bold',C.ink); doc.text('Septino, QWP®, CIS®',x+w*.66,y+21);
        font(6.5,'normal',C.muted); doc.text('Financial Planner & Insurance Consultant',x+w*.66,y+29);
        font(6.8,'normal',C.ink); doc.text('WA 0811-6946-999',x+w*.66,y+38);
        doc.text('septinogao@gmail.com',x+w*.66,y+46);
        doc.text('@septino.gao',x+w*.66,y+54);
    }

    // PAGE 1
    header('LAPORAN SIMULASI DANA PENDIDIKAN','Perencanaan Masa Depan Anak',1);
    dataTable(M,43,116,52);
    bigNeedCard(142,43,W-M-142,52);

    sectionTitle(M,111,'RINGKASAN HASIL SIMULASI');
    const sw=(W-M*2-15)/4;
    const sy=122;
    summaryCard(M,sy,sw,42,'TOTAL KEBUTUHAN DANA',rupiah(d.target),'Estimasi kebutuhan saat target pendidikan dimulai.',C.navy,'');
    summaryCard(M+sw+5,sy,sw,42,'DANA YANG SUDAH TERKUMPUL',rupiah(d.danaAda),'Dana pendidikan yang sudah tersedia saat ini.',C.green,'');
    summaryCard(M+(sw+5)*2,sy,sw,42,'KEKURANGAN DANA',rupiah(d.kurang),'Selisih dana yang perlu dipersiapkan.',C.red,'');
    summaryCard(M+(sw+5)*3,sy,sw,42,'SETORAN BULANAN YANG DISIAPKAN',rupiah(d.setor),'Estimasi dana yang perlu disiapkan setiap bulan.',C.gold,'');

    const percent=d.target>0 ? Math.min(100,(d.danaAda/d.target)*100) : 0;
    round(M,174,118,38,5,C.white,C.line);
    font(8.4,'bold',C.navy); doc.text('KOMPOSISI KEBUTUHAN DANA',M+10,184);
    donut(M+14,187,22,percent);
    font(7,'bold',C.navy); doc.text('Dana Terkumpul',M+62,194);
    font(7.2,'bold',C.ink); doc.text(`${percent.toFixed(1).replace('.0','')}% (${rupiah(d.danaAda)})`,M+62,203);
    font(7,'bold',C.muted); doc.text('Kekurangan Dana',M+62,216);
    font(7.2,'bold',C.gold); doc.text(`${(100-percent).toFixed(1).replace('.0','')}% (${rupiah(d.kurang)})`,M+62,225);

    noteChecklist(142,174,W-M-142,38);
    infoStrip(M,222,W-M*2,18);
    footer(1);

    // PAGE 2
    doc.addPage();
    header('REKOMENDASI FINANCIAL PLANNER','Langkah strategis untuk masa depan pendidikan anak Anda.',2);

    font(10,'bold',C.navy); doc.text('1  RINGKASAN RENCANA DANA PENDIDIKAN',M+4,47);
    const rw=(W-M*2-14)/3;
    recommendCard(M,55,rw,48,'TARGET DANA USIA '+d.usiaMasuk+' TAHUN',rupiah(d.target),'Total kebutuhan saat target pendidikan dimulai.',C.navy);
    recommendCard(M+rw+7,55,rw,48,'JANGKA WAKTU PERSIAPAN',periodeText(),'Sesuai periode persiapan yang dipilih.',C.green);
    recommendCard(M+(rw+7)*2,55,rw,48,'DANA DISIAPKAN PER BULAN',rupiah(d.setor),'Estimasi komitmen dana yang perlu disiapkan setiap bulan.',C.gold);
    infoStrip(M,110,W-M*2,15);

    font(10,'bold',C.navy); doc.text('2  LANGKAH STRATEGIS',M+4,139);
    line(M+108,133,M+108,181,C.line,.3);
    strategyItem(M,148,105,1,'INVESTASI JANGKA PANJANG','Pilih instrumen investasi yang tepat untuk potensi hasil optimal.','Pertumbuhan Dana',C.navy);
    strategyItem(M,165,105,2,'PROTEKSI','Lindungi rencana pendidikan dari risiko yang tidak terduga.','Menjaga Rencana',C.green);
    strategyItem(M,182,105,3,'KONSISTENSI','Kunci keberhasilan adalah disiplin dan konsisten menjalankan rencana.','Tujuan Pendidikan',C.gold);
    actionList(128,139);
    ctaBox(M,184,W-M*2,39);
    footer(2);

    doc.save(`Laporan_Dana_Pendidikan_${cleanName(d.namaAnak)}.pdf`);
}
function resetForm(){simulasiForm.reset();tahunSekarang.value=new Date().getFullYear();document.querySelector('input[name="strategiInvestasi"][value="0.04"]').checked=true;updatePeriode();kosongkan();}
