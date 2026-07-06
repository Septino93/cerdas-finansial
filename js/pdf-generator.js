function formatIDR(n){return Number(n||0).toLocaleString('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0});}
function fmtYears(v){v=Number(v||0);if(v<=0)return '0 Tahun';const y=Math.floor(v),m=Math.round((v-y)*12);return y+(m?` Tahun ${m} Bulan`:' Tahun');}
function safeName(s){return String(s||'Dana_Pendidikan').replace(/[^a-z0-9_-]+/gi,'_');}
function todayID(){return new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'});}
function buildEducationReportHTML(d,fp){
  const pct=d.target>0?Math.min(100,(d.danaAda/d.target)*100):0;
  const deg=(pct*3.6).toFixed(1)+'deg';
  const periode=`${fmtYears(d.periode)} (${Math.round((d.periode||0)*12)} Bulan)`;
  const inflation=((d.inflasi||0)*100).toFixed(1).replace('.0','')+'% / tahun';
  const footer=(p)=>`<div class="pdf-footer"><div><strong>Cerdas Finansial © 2026</strong><br>${fp.name}</div><div>${fp.phone} • ${fp.email} • ${fp.ig}</div><div><strong>Halaman ${p} / 2</strong></div></div>`;
  const header=(title,sub)=>`<div class="pdf-header"><div class="pdf-logo"><div class="pdf-logo-mark"><span class="c">C</span> <span class="f">F</span></div><div class="pdf-logo-text">CERDAS<span>FINANSIAL</span></div></div><div class="pdf-title"><h1>${title}</h1><p>${sub}</p></div><div class="pdf-date">Tanggal Simulasi<strong>${todayID()}</strong></div></div>`;
  return `
  <div class="pdf-stage" id="pdfReport">
    <section class="pdf-page">
      ${header('LAPORAN SIMULASI DANA PENDIDIKAN','Perencanaan Masa Depan Anak')}
      <div class="pdf-grid-2">
        <div class="pdf-card">
          <h2 class="pdf-section-title">DATA ANAK</h2>
          <table class="pdf-data-table">
            <tr><td>Nama Anak</td><td>${d.namaAnak||'-'}</td></tr>
            <tr><td>Usia Saat Ini</td><td>${d.usiaAnak||0} tahun</td></tr>
            <tr><td>Target Pendidikan</td><td>${d.targetLabel}</td></tr>
            <tr><td>Biaya Saat Ini</td><td>${formatIDR(d.biaya)}</td></tr>
            <tr><td>Inflasi Pendidikan</td><td>${inflation}</td></tr>
            <tr><td>Strategi</td><td>${d.strategi}</td></tr>
          </table>
        </div>
        <div class="pdf-card pdf-target">
          <div class="label">KEBUTUHAN DANA<br>SAAT USIA ${d.usiaMasuk} TAHUN</div>
          <div class="money">${formatIDR(d.target)}</div>
          <div>Estimasi kebutuhan saat target pendidikan dimulai.</div>
        </div>
      </div>
      <div class="pdf-spacer"></div>
      <h2 class="pdf-section-title">RINGKASAN HASIL SIMULASI</h2>
      <div class="pdf-grid-4">
        <div class="pdf-card pdf-stat"><span>Total Kebutuhan Dana</span><strong>${formatIDR(d.target)}</strong><p>Estimasi kebutuhan saat target pendidikan dimulai.</p></div>
        <div class="pdf-card pdf-stat green"><span>Dana yang Sudah Ada</span><strong>${formatIDR(d.danaAda)}</strong><p>Dana pendidikan yang sudah tersedia saat ini.</p></div>
        <div class="pdf-card pdf-stat red"><span>Kekurangan Dana</span><strong>${formatIDR(d.kurang)}</strong><p>Selisih dana yang perlu dipersiapkan.</p></div>
        <div class="pdf-card pdf-stat gold"><span>Setoran Bulanan</span><strong>${formatIDR(d.setor)}</strong><p>Estimasi dana yang disiapkan setiap bulan.</p></div>
      </div>
      <div class="pdf-spacer"></div>
      <div class="pdf-grid-2">
        <div class="pdf-card">
          <h2 class="pdf-section-title">KOMPOSISI DANA</h2>
          <div class="pdf-donut-row">
            <div class="pdf-donut" style="--deg:${deg}" data-pct="${Math.round(pct)}%"></div>
            <div class="pdf-legend">
              <div>Dana Sudah Ada<br><strong>${pct.toFixed(1).replace('.0','')}% (${formatIDR(d.danaAda)})</strong></div>
              <div>Kekurangan Dana<br><strong>${(100-pct).toFixed(1).replace('.0','')}% (${formatIDR(d.kurang)})</strong></div>
            </div>
          </div>
        </div>
        <div class="pdf-card cream">
          <h2 class="pdf-section-title">CATATAN SINGKAT</h2>
          <div class="pdf-note-list">
            <div>Mulai lebih awal memberi peluang pertumbuhan dana lebih optimal.</div>
            <div>Evaluasi biaya pendidikan dan inflasi setiap 6–12 bulan.</div>
            <div>Konsistensi menabung menjadi kunci utama keberhasilan.</div>
            <div>Sesuaikan nominal setoran saat penghasilan meningkat.</div>
          </div>
        </div>
      </div>
      <div class="pdf-info">Perhitungan ini merupakan estimasi berdasarkan target dana pendidikan, jangka waktu persiapan, asumsi inflasi, dan estimasi hasil investasi yang dimasukkan.</div>
      ${footer(1)}
    </section>

    <section class="pdf-page">
      ${header('REKOMENDASI FINANCIAL PLANNER','Langkah strategis untuk masa depan pendidikan anak Anda')}
      <h2 class="pdf-section-title">1. RINGKASAN RENCANA DANA PENDIDIKAN</h2>
      <div class="pdf-grid-3">
        <div class="pdf-card pdf-summary-card"><div class="icon"></div><h3>Target Dana Usia ${d.usiaMasuk} Tahun</h3><strong>${formatIDR(d.target)}</strong><p>Total kebutuhan saat target pendidikan dimulai.</p></div>
        <div class="pdf-card pdf-summary-card green"><div class="icon"></div><h3>Jangka Waktu Persiapan</h3><strong>${periode}</strong><p>Sesuai periode persiapan yang dipilih.</p></div>
        <div class="pdf-card pdf-summary-card gold"><div class="icon"></div><h3>Dana Disiapkan per Bulan</h3><strong>${formatIDR(d.setor)}</strong><p>Estimasi komitmen dana setiap bulan.</p></div>
      </div>
      <div class="pdf-info">Angka di atas perlu dievaluasi berkala sesuai perubahan biaya pendidikan, kemampuan menabung, dan kondisi investasi.</div>
      <div class="pdf-spacer"></div>
      <h2 class="pdf-section-title">2. LANGKAH STRATEGIS</h2>
      <div class="pdf-strategy">
        <div class="pdf-step"><div class="pdf-step-num">1</div><div><h4>INVESTASI JANGKA PANJANG</h4><p>Pilih instrumen investasi yang tepat untuk potensi hasil optimal.</p></div><div class="pdf-step-goal">Tujuan:<br>Pertumbuhan Dana</div></div>
        <div class="pdf-step"><div class="pdf-step-num">2</div><div><h4>PROTEKSI</h4><p>Lindungi rencana pendidikan dari risiko yang tidak terduga.</p></div><div class="pdf-step-goal">Tujuan:<br>Menjaga Rencana</div></div>
        <div class="pdf-step"><div class="pdf-step-num">3</div><div><h4>KONSISTENSI</h4><p>Lakukan setoran rutin dan evaluasi berkala.</p></div><div class="pdf-step-goal">Tujuan:<br>Pendidikan Anak</div></div>
      </div>
      <div class="pdf-spacer"></div>
      <h2 class="pdf-section-title">3. ACTION PLAN</h2>
      <div class="pdf-checks">
        <div class="pdf-check">Mulai investasi sedini mungkin.</div>
        <div class="pdf-check">Sisihkan dana rutin setiap bulan.</div>
        <div class="pdf-check">Tingkatkan nominal saat pendapatan meningkat.</div>
        <div class="pdf-check">Review rencana minimal 1 tahun sekali.</div>
        <div class="pdf-check">Lindungi income orang tua dengan asuransi jiwa.</div>
        <div class="pdf-check">Hindari pencairan dana sebelum target pendidikan tercapai.</div>
      </div>
      <div class="pdf-spacer"></div>
      <div class="pdf-cta">
        <div><h3>Masa depan anak dimulai dari perencanaan hari ini.</h3><p>Konsultasikan rencana pendidikan secara personal agar strategi yang dipilih sesuai kebutuhan dan kondisi keuangan keluarga.</p></div>
        <div class="pdf-contact"><strong>Hubungi Saya:</strong><strong>${fp.name}</strong>${fp.title}<br><br>WA ${fp.phone}<br>${fp.email}<br>${fp.ig}</div>
      </div>
      ${footer(2)}
    </section>
  </div>`;
}
async function generateEducationPDF(d,fp){
  if(typeof html2pdf==='undefined') throw new Error('Library html2pdf belum ter-load. Cek koneksi internet atau script CDN di pendidikan.html.');
  const mount=document.getElementById('pdfMount')||document.body;
  mount.innerHTML=buildEducationReportHTML(d,fp);
  const el=document.getElementById('pdfReport');
  if(!el) throw new Error('Template PDF tidak terbentuk.');
  await new Promise(r=>setTimeout(r,650));
  const opt={margin:0,filename:`Laporan_Dana_Pendidikan_${safeName(d.namaAnak)}.pdf`,image:{type:'jpeg',quality:0.98},html2canvas:{scale:2,useCORS:true,allowTaint:true,backgroundColor:'#ffffff',scrollX:0,scrollY:0,windowWidth:794},jsPDF:{unit:'pt',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy'],before:'.pdf-page:not(:first-child)'}};
  await html2pdf().set(opt).from(el).save();
  mount.innerHTML='';
}
