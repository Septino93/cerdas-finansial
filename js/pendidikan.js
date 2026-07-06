const TARGETS={sd:{label:'SD Swasta',usia:6,lama:6},smp:{label:'SMP Swasta',usia:12,lama:3},sma:{label:'SMA Swasta',usia:15,lama:3},s1dn:{label:'S1 Dalam Negeri',usia:18,lama:4},s1ln:{label:'S1 Luar Negeri',usia:18,lama:4},kedokteran:{label:'Kedokteran',usia:18,lama:6},s2dn:{label:'S2 Dalam Negeri',usia:22,lama:2},s2ln:{label:'S2 Luar Negeri',usia:22,lama:2},custom:{label:'Custom',usia:'',lama:''}};
const FP={whatsapp:'628116946999',email:'septinogao@gmail.com',instagram:'https://instagram.com/septino.gao'};let last=null;
document.addEventListener('DOMContentLoaded',()=>{tahunSekarang.value=new Date().getFullYear();allInputs().forEach(el=>el.addEventListener('input',()=>{formatIfMoney(el);updateTarget();updatePeriode();hitung();}));targetPendidikan.addEventListener('change',()=>{applyTarget();updatePeriode();hitung();});periodePersiapan.addEventListener('change',()=>{customTahunBox.classList.toggle('d-none',periodePersiapan.value!=='custom');hitung();});document.querySelectorAll('input[name="strategiInvestasi"]').forEach(r=>r.addEventListener('change',hitung));updatePeriode();kosongkan();});
function allInputs(){return [...document.querySelectorAll('#simulasiForm input,#simulasiForm select')];}
function bersih(v){return Number(String(v||'').replace(/\D/g,''));}function rupiah(n){return Number(n||0).toLocaleString('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});}function formatIfMoney(el){if(!el.classList.contains('money-input'))return;let raw=String(el.value||'').trim();let n=bersih(raw);el.value=raw!==''?n.toLocaleString('id-ID'):'';}function formatTahun(v){if(!isFinite(v)||v<=0)return '0 Tahun';let y=Math.floor(v),m=Math.round((v-y)*12);return y+(m?` Tahun ${m} Bulan`:' Tahun');}
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
        alert('Lengkapi data terlebih dahulu sebelum export PDF.');
        return;
    }

    try{
        if(!window.jspdf || !window.jspdf.jsPDF){
            alert('Library jsPDF belum terbaca. Pastikan script jsPDF ada di pendidikan.html.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const d = last;
        const doc = new jsPDF({ orientation:'landscape', unit:'mm', format:'a4' });
        const W = doc.internal.pageSize.getWidth();
        const H = doc.internal.pageSize.getHeight();
        const M = 14;
        const today = new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});

        const C = {
            navy:[7,48,84],
            navy2:[13,64,108],
            gold:[197,151,54],
            goldSoft:[255,249,235],
            green:[40,137,83],
            greenSoft:[238,248,242],
            red:[203,61,65],
            redSoft:[255,242,242],
            blueSoft:[244,249,253],
            ink:[30,42,58],
            muted:[102,112,133],
            line:[218,228,238],
            white:[255,255,255],
            soft:[249,251,253]
        };

        const plannerName = 'Septino, QWP®, CIS®';
        const plannerTitle = 'Financial Planner & Insurance Consultant';
        const phone = '0811-6946-999';
        const email = 'septinogao@gmail.com';
        const ig = '@septino.gao';

        const fmt = n => rupiah(Math.round(Number(n||0)));
        const clean = txt => String(txt||'Simulasi').replace(/[^a-z0-9_-]+/gi,'_');
        const bulan = Math.round((d.periode || 0) * 12);
        const periode = `${formatTahun(d.periode)} (${bulan} Bulan)`;
        const danaAdaPct = d.target > 0 ? Math.min(100, (d.danaAda / d.target) * 100) : 0;
        const kurangPct = Math.max(0, 100 - danaAdaPct);

        function setFont(size=8, style='normal', color=C.ink){
            doc.setFont('helvetica', style);
            doc.setFontSize(size);
            doc.setTextColor(...color);
        }
        function fill(color){ doc.setFillColor(...color); }
        function stroke(color){ doc.setDrawColor(...color); }
        function rounded(x,y,w,h,r=4,fc=C.white,lc=C.line){
            fill(fc); stroke(lc); doc.setLineWidth(.35); doc.roundedRect(x,y,w,h,r,r,'FD');
        }
        function line(x1,y1,x2,y2,color=C.line,width=.3){
            stroke(color); doc.setLineWidth(width); doc.line(x1,y1,x2,y2);
        }
        function text(t,x,y,size=8,style='normal',color=C.ink,opt={}){
            setFont(size,style,color); doc.text(String(t),x,y,opt);
        }
        function wrap(t,x,y,w,size=7,lineH=4,color=C.ink,style='normal'){
            setFont(size,style,color);
            const lines = doc.splitTextToSize(String(t),w);
            doc.text(lines,x,y);
            return y + (lines.length * lineH);
        }
        function fitText(t,x,y,w,max=12,min=6,style='bold',color=C.ink,align='center'){
            let size=max;
            doc.setFont('helvetica',style); doc.setFontSize(size);
            while(size > min && doc.getTextWidth(String(t)) > w){
                size -= .3; doc.setFontSize(size);
            }
            text(t,x,y,size,style,color,{align});
        }
        function logo(x,y,s=1){
            stroke(C.navy); doc.setLineWidth(1.1*s);
            doc.arc(x+6*s,y+7*s,6*s,105,300,'S');
            fill(C.gold); doc.roundedRect(x+7*s,y+4*s,8*s,2.2*s,1,1,'F');
            fill(C.gold); doc.roundedRect(x+7*s,y+7*s,7*s,2.2*s,1,1,'F');
            fill(C.gold); doc.roundedRect(x+7*s,y+4*s,2.4*s,12*s,1,1,'F');
            fill(C.navy); doc.rect(x+13*s,y+11*s,1.2*s,4*s,'F');
            fill(C.navy); doc.rect(x+15*s,y+9*s,1.2*s,6*s,'F');
            fill(C.navy); doc.rect(x+17*s,y+7*s,1.2*s,8*s,'F');
        }
        function header(title,subtitle,page){
            fill(C.white); doc.rect(0,0,W,31,'F');
            logo(M,7,.9);
            text('CERDAS',M+22,13.5,8.8,'bold',C.navy);
            text('FINANSIAL',M+22,20,8.8,'bold',C.gold);
            text(title,78,13.5,13,'bold',C.navy);
            text(subtitle,78,21,7.2,'normal',C.muted);
            text('Tanggal Simulasi',W-M-45,13.5,6.5,'bold',C.muted);
            text(today,W-M-45,21,7.2,'bold',C.ink);
            line(M,28,W-M,28,C.gold,.45);
        }
        function footer(page){
            const y=198;
            line(M,y,W-M,y,C.line,.35);
            text('Disusun oleh',M,y+5,5.8,'normal',C.muted);
            text(plannerName,M+20,y+5,6.2,'bold',C.ink);
            text(`${phone}  •  ${email}  •  ${ig}`,W/2,y+5,6,'normal',C.muted,{align:'center'});
            rounded(W-M-24,y+1.8,24,7,3,C.goldSoft,[238,210,150]);
            text(`${page}/2`,W-M-12,y+6.6,6.2,'bold',C.navy,{align:'center'});
        }
        function section(x,y,title){
            text(title,x,y,9.2,'bold',C.navy);
            fill(C.gold); doc.roundedRect(x,y+2,18,1.2,.5,.5,'F');
        }
        function labelValue(x,y,label,value,w=90){
            text(label,x,y,6.6,'normal',C.muted);
            text(String(value||'-'),x+42,y,6.7,'bold',C.ink,{maxWidth:w-44});
        }
        function dataCard(x,y,w,h){
            rounded(x,y,w,h,5,C.white,C.line);
            fill(C.navy); doc.roundedRect(x,y,w,10,4,4,'F');
            text('DATA ANAK',x+8,y+7,7.4,'bold',C.white);
            const rows=[
                ['Nama Anak',d.namaAnak],
                ['Usia Saat Ini',`${d.usiaAnak} tahun`],
                ['Target Pendidikan',d.targetLabel],
                ['Biaya Saat Ini',fmt(d.biaya)],
                ['Inflasi Pendidikan',`${(d.inflasi*100).toFixed(1).replace('.0','')}% / tahun`],
                ['Strategi',d.strategi]
            ];
            let yy=y+19;
            rows.forEach(r=>{ labelValue(x+8,yy,r[0],r[1],w-16); yy+=5.8; });
        }
        function targetCard(x,y,w,h){
            rounded(x,y,w,h,6,C.navy2,C.navy2);
            text(`KEBUTUHAN DANA SAAT USIA ${d.usiaMasuk} TAHUN`,x+w/2,y+15,10,'bold',C.white,{align:'center'});
            line(x+32,y+21,x+w-32,y+21,C.gold,.45);
            fitText(fmt(d.target),x+w/2,y+38,w-20,17,9,'bold',C.gold,'center');
            text('Estimasi kebutuhan saat target pendidikan dimulai.',x+w/2,y+48,6.6,'normal',C.white,{align:'center'});
        }
        function metric(x,y,w,h,title,value,note,color,soft=C.white){
            rounded(x,y,w,h,5,soft,C.line);
            fill(color); doc.roundedRect(x,y,w,2.4,1,1,'F');
            text(title,x+6,y+10,6.8,'bold',C.navy,{maxWidth:w-12});
            fitText(value,x+w/2,y+23,w-10,10.5,6.5,'bold',color,'center');
            wrap(note,x+6,y+31,w-12,5.7,3.2,C.muted);
        }
        function donut(x,y,w,h){
            rounded(x,y,w,h,5,C.white,C.line);
            text('KOMPOSISI DANA',x+8,y+10,8,'bold',C.navy);
            const cx=x+35, cy=y+28, r=18;
            stroke([225,233,240]); doc.setLineWidth(8); doc.circle(cx,cy,r,'S');
            stroke(C.gold); doc.setLineWidth(8);
            let prev=null;
            for(let a=-90; a<=-90+danaAdaPct*3.6; a+=3){
                const rad=a*Math.PI/180, p=[cx+r*Math.cos(rad),cy+r*Math.sin(rad)];
                if(prev) doc.line(prev[0],prev[1],p[0],p[1]);
                prev=p;
            }
            fill(C.white); doc.circle(cx,cy,9,'F');
            text(`${Math.round(danaAdaPct)}%`,cx,cy+2,9.5,'bold',C.navy,{align:'center'});
            fill(C.green); doc.roundedRect(x+67,y+21,4,4,1,1,'F');
            text('Dana sudah ada',x+74,y+24,6.2,'bold',C.ink);
            text(fmt(d.danaAda),x+74,y+31,6.1,'normal',C.muted,{maxWidth:w-80});
            fill(C.gold); doc.roundedRect(x+67,y+39,4,4,1,1,'F');
            text('Kekurangan dana',x+74,y+42,6.2,'bold',C.ink);
            text(fmt(d.kurang),x+74,y+49,6.1,'normal',C.muted,{maxWidth:w-80});
        }
        function notes(x,y,w,h){
            rounded(x,y,w,h,5,C.goldSoft,[242,213,154]);
            text('CATATAN FINANCIAL PLANNER',x+8,y+10,8,'bold',C.navy);
            const arr=[
                'Mulai lebih awal memberi peluang pertumbuhan dana lebih optimal.',
                'Evaluasi biaya pendidikan dan inflasi setiap 6-12 bulan.',
                'Konsistensi menabung menjadi kunci utama keberhasilan.'
            ];
            let yy=y+21;
            arr.forEach(t=>{
                fill(C.gold); doc.circle(x+9,yy-1.8,2.2,'F');
                text('✓',x+9,yy-.4,4.7,'bold',C.white,{align:'center'});
                wrap(t,x+15,yy,w-22,6.4,3.7,C.ink);
                yy+=10;
            });
        }
        function recMetric(x,y,w,h,title,value,note,color,soft=C.white){
            rounded(x,y,w,h,5,soft,C.line);
            text(title,x+7,y+11,6.8,'bold',C.navy,{maxWidth:w-14});
            fitText(value,x+w/2,y+25,w-12,11,6.5,'bold',color,'center');
            wrap(note,x+7,y+34,w-14,5.8,3.2,C.muted);
        }
        function strategy(x,y,w,num,title,desc,color){
            rounded(x,y,w,23,5,C.white,C.line);
            fill(color); doc.circle(x+10,y+11.5,6,'F');
            text(num,x+10,y+14,7,'bold',C.white,{align:'center'});
            text(title,x+22,y+9,7.2,'bold',C.navy);
            wrap(desc,x+22,y+16,w-28,5.9,3,C.ink);
        }
        function actionPlan(x,y,w,h){
            rounded(x,y,w,h,5,C.blueSoft,C.line);
            text('3  ACTION PLAN',x+8,y+10,8.2,'bold',C.navy);
            const arr=[
                'Mulai investasi sedini mungkin.',
                'Sisihkan dana rutin setiap bulan.',
                'Tingkatkan nominal saat pendapatan meningkat.',
                'Review rencana minimal 1 tahun sekali.',
                'Lindungi income orang tua dengan asuransi jiwa.'
            ];
            let yy=y+21;
            arr.forEach(t=>{
                fill(C.navy); doc.circle(x+9,yy-1.8,2.2,'F');
                text('✓',x+9,yy-.4,4.5,'bold',C.white,{align:'center'});
                wrap(t,x+15,yy,w-21,6.1,3.2,C.ink);
                yy+=8.2;
            });
        }
        function cta(x,y,w,h){
            rounded(x,y,w,h,6,C.goldSoft,C.gold);
            text('Butuh Bantuan Menyusun Strategi?',x+10,y+11,8.2,'bold',C.navy);
            wrap('Konsultasikan rencana pendidikan secara personal agar strategi sesuai kebutuhan dan kondisi keuangan keluarga.',x+10,y+20,w*0.48,6.2,3.5,C.ink);
            line(x+w*0.58,y+7,x+w*0.58,y+h-7,C.gold,.3);
            text(plannerName,x+w*0.62,y+11,7.4,'bold',C.ink);
            text(plannerTitle,x+w*0.62,y+18,5.8,'normal',C.muted);
            text(`WA ${phone}`,x+w*0.62,y+27,6.2,'normal',C.ink);
            text(email,x+w*0.62,y+34,6.2,'normal',C.ink);
            text(ig,x+w*0.62,y+41,6.2,'normal',C.ink);
        }

        // PAGE 1
        header('LAPORAN SIMULASI DANA PENDIDIKAN','Perencanaan Masa Depan Anak',1);
        dataCard(M,38,112,48);
        targetCard(M+120,38,W-M*2-120,48);

        section(M,99,'RINGKASAN HASIL SIMULASI');
        const gap=6;
        const cw=(W-M*2-gap*3)/4;
        metric(M,110,cw,36,'TOTAL KEBUTUHAN DANA',fmt(d.target),'Estimasi kebutuhan saat target pendidikan dimulai.',C.navy);
        metric(M+cw+gap,110,cw,36,'DANA YANG SUDAH ADA',fmt(d.danaAda),'Dana pendidikan yang sudah tersedia saat ini.',C.green,C.greenSoft);
        metric(M+(cw+gap)*2,110,cw,36,'KEKURANGAN DANA',fmt(d.kurang),'Selisih dana yang perlu dipersiapkan.',C.red,C.redSoft);
        metric(M+(cw+gap)*3,110,cw,36,'SETORAN BULANAN',fmt(d.setor),'Estimasi dana yang disiapkan setiap bulan.',C.gold,C.goldSoft);

        donut(M,156,128,35);
        notes(M+136,156,W-M*2-136,35);
        footer(1);

        // PAGE 2
        doc.addPage();
        header('REKOMENDASI FINANCIAL PLANNER','Langkah strategis untuk masa depan pendidikan anak Anda',2);

        section(M,41,'1  RINGKASAN RENCANA');
        const rw=(W-M*2-gap*2)/3;
        recMetric(M,52,rw,39,`TARGET DANA USIA ${d.usiaMasuk} TAHUN`,fmt(d.target),'Total kebutuhan saat target pendidikan dimulai.',C.navy);
        recMetric(M+rw+gap,52,rw,39,'JANGKA WAKTU PERSIAPAN',periode,'Sesuai periode persiapan yang dipilih.',C.green,C.greenSoft);
        recMetric(M+(rw+gap)*2,52,rw,39,'DANA DISIAPKAN PER BULAN',fmt(d.setor),'Estimasi komitmen dana setiap bulan.',C.gold,C.goldSoft);

        section(M,105,'2  LANGKAH STRATEGIS');
        strategy(M,116,W-M*2,1,'Investasi Jangka Panjang','Pilih instrumen investasi sesuai profil risiko dan jangka waktu persiapan.',C.navy);
        strategy(M,144,W-M*2,2,'Proteksi','Lindungi rencana pendidikan dari risiko yang tidak terduga.',C.green);
        strategy(M,172,W-M*2,3,'Konsistensi','Lakukan setoran rutin dan evaluasi berkala agar rencana tetap sesuai target.',C.gold);

        actionPlan(M+154,116,W-M*2-154,51);
        cta(M+154,172,W-M*2-154,23);
        footer(2);

        doc.save(`Laporan_Dana_Pendidikan_${clean(d.namaAnak)}.pdf`);
    }catch(err){
        console.error(err);
        alert('Export PDF gagal: ' + (err.message || err));
    }
}

function resetForm(){
    simulasiForm.reset();
    tahunSekarang.value=new Date().getFullYear();
    const defaultRadio=document.querySelector('input[name="strategiInvestasi"][value="0.04"]');
    if(defaultRadio) defaultRadio.checked=true;
    updatePeriode();
    kosongkan();
}

// Override validasi agar Dana yang Sudah Ada boleh kosong dan dibaca Rp0.
function valid(){
    let ok=true;
    document.querySelectorAll('[required]').forEach(el=>{
        let inv=!String(el.value||'').trim();
        if(el.id==='danaAda') inv=false;
        if(el.id==='customTahun' && periodePersiapan.value!=='custom') inv=false;
        el.classList.toggle('is-invalid',inv);
        if(inv) ok=false;
    });
    if(Number(usiaMasuk.value)<=Number(usiaAnak.value)){
        usiaMasuk.classList.add('is-invalid');
        ok=false;
    }
    if(!validatePeriodeCustom()) ok=false;
    return ok;
}

window.exportPDF = exportPDF;
window.resetForm = resetForm;
window.konsultasiWhatsApp = konsultasiWhatsApp;
window.konsultasiEmail = konsultasiEmail;
window.konsultasiInstagram = konsultasiInstagram;
