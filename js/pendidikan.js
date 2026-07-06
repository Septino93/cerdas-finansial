const TARGETS = {
  sd: { label: 'SD Swasta', usia: 6, lama: 6 },
  smp: { label: 'SMP Swasta', usia: 12, lama: 3 },
  sma: { label: 'SMA Swasta', usia: 15, lama: 3 },
  s1dn: { label: 'S1 Dalam Negeri', usia: 18, lama: 4 },
  s1ln: { label: 'S1 Luar Negeri', usia: 18, lama: 4 },
  kedokteran: { label: 'Kedokteran', usia: 18, lama: 6 },
  s2dn: { label: 'S2 Dalam Negeri', usia: 22, lama: 2 },
  s2ln: { label: 'S2 Luar Negeri', usia: 22, lama: 2 },
  custom: { label: 'Custom', usia: '', lama: '' }
};

const FP = {
  whatsapp: '628116946999',
  phoneDisplay: '0811-6946-999',
  email: 'septinogao@gmail.com',
  instagramUrl: 'https://instagram.com/septino.gao',
  instagram: '@septino.gao',
  name: 'Septino, QWP®, CIS®',
  title: 'Financial Planner & Insurance Consultant'
};

let last = null;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof tahunSekarang !== 'undefined') tahunSekarang.value = new Date().getFullYear();

  allInputs().forEach(el => {
    el.addEventListener('input', () => {
      formatIfMoney(el);
      updateTarget();
      updatePeriode();
      hitung();
    });
  });

  if (typeof targetPendidikan !== 'undefined') {
    targetPendidikan.addEventListener('change', () => {
      applyTarget();
      updatePeriode();
      hitung();
    });
  }

  if (typeof periodePersiapan !== 'undefined') {
    periodePersiapan.addEventListener('change', () => {
      customTahunBox.classList.toggle('d-none', periodePersiapan.value !== 'custom');
      hitung();
    });
  }

  document.querySelectorAll('input[name="strategiInvestasi"]').forEach(r => r.addEventListener('change', hitung));

  updatePeriode();
  kosongkan();

  window.exportPDF = exportPDF;
  window.resetForm = resetForm;
  window.konsultasiWhatsApp = konsultasiWhatsApp;
  window.konsultasiEmail = konsultasiEmail;
  window.konsultasiInstagram = konsultasiInstagram;
});

function allInputs() {
  return [...document.querySelectorAll('#simulasiForm input,#simulasiForm select')];
}

function bersih(v) {
  return Number(String(v || '').replace(/\D/g, '')) || 0;
}

function rupiah(n) {
  return Number(n || 0).toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  });
}

function formatIfMoney(el) {
  if (!el.classList.contains('money-input')) return;
  const raw = String(el.value || '').trim();
  const n = bersih(raw);
  el.value = raw !== '' ? n.toLocaleString('id-ID') : '';
}

function formatTahun(v) {
  if (!isFinite(v) || v <= 0) return '0 Tahun';
  const y = Math.floor(v);
  const m = Math.round((v - y) * 12);
  return y + (m ? ` Tahun ${m} Bulan` : ' Tahun');
}

function applyTarget() {
  const t = TARGETS[targetPendidikan.value];
  if (!t) return;
  if (t.usia !== '') usiaMasuk.value = t.usia;
  if (t.lama !== '') lamaStudi.value = t.lama;
}

function updateTarget() {}

function getBatas() {
  const usiaA = Number(usiaAyah.value || 0);
  const usiaI = Number(usiaIbu.value || 0);
  const pens = Number(usiaPensiun.value || 0);
  const usia = Number(usiaAnak.value || 0);
  const masuk = Number(usiaMasuk.value || 0);
  const sisaKuliah = masuk - usia;
  const batas = [];

  if (usiaA && pens) batas.push(pens - usiaA);
  if (usiaI && pens) batas.push(pens - usiaI);
  if (sisaKuliah > 0) batas.push(sisaKuliah);

  const max = batas.length ? Math.min(...batas) : 0;
  return { max, sisaKuliah };
}

function updatePeriode() {
  const prev = periodePersiapan.value;
  const { max, sisaKuliah } = getBatas();

  periodePersiapan.innerHTML = '';
  hidePensionWarning();

  if (!isFinite(max) || max <= 0) {
    periodePersiapan.innerHTML = '<option value="">Lengkapi data dahulu</option>';
    periodeInfo.innerText = 'Isi usia orang tua, usia anak, dan usia masuk pendidikan.';
    customTahunBox.classList.add('d-none');
    customTahun.removeAttribute('required');
    return;
  }

  [3, 5, 8, 10].forEach(y => {
    if (y <= max) periodePersiapan.innerHTML += `<option value="${y}">${y} Tahun</option>`;
  });

  if (sisaKuliah > 0 && sisaKuliah <= max) {
    periodePersiapan.innerHTML += `<option value="kuliah">Sampai Anak Masuk Pendidikan (${formatTahun(sisaKuliah)})</option>`;
  }

  if (max >= 10) periodePersiapan.innerHTML += '<option value="custom">Custom / Tentukan Sendiri</option>';

  if (!periodePersiapan.innerHTML) {
    const y = Math.max(1, Math.floor(max));
    periodePersiapan.innerHTML = `<option value="${y}">${y} Tahun</option>`;
  }

  if ([...periodePersiapan.options].some(o => o.value === prev)) periodePersiapan.value = prev;

  customTahun.max = Math.floor(max);
  customTahunBox.classList.toggle('d-none', periodePersiapan.value !== 'custom');

  if (periodePersiapan.value === 'custom') {
    customTahun.setAttribute('required', 'required');
    customTahun.placeholder = `Maksimal ${Math.floor(max)} tahun`;
  } else {
    customTahun.removeAttribute('required');
    customTahun.classList.remove('is-invalid');
  }

  periodeInfo.innerText = `Periode maksimum yang disarankan: ${formatTahun(max)}, berdasarkan sisa waktu pendidikan dan usia pensiun orang tua.`;
  validatePeriodeCustom();
}

function showPensionWarning(message) {
  pensionWarning.innerHTML = message;
  pensionWarning.classList.remove('d-none');
}

function hidePensionWarning() {
  pensionWarning.innerHTML = '';
  pensionWarning.classList.add('d-none');
}

function validatePeriodeCustom() {
  const { max } = getBatas();

  if (periodePersiapan.value !== 'custom') {
    customTahun.classList.remove('is-invalid');
    hidePensionWarning();
    return true;
  }

  const value = Number(customTahun.value || 0);
  const maxTahun = Math.floor(max);

  if (!value) {
    customTahun.classList.remove('is-invalid');
    showPensionWarning(`ℹ️ Masukkan periode custom. Maksimal yang disarankan adalah <strong>${formatTahun(max)}</strong>.`);
    return false;
  }

  if (value > max) {
    customTahun.classList.add('is-invalid');
    showPensionWarning(`⚠️ Periode custom <strong>${value} tahun</strong> melebihi batas aman. Maksimum periode persiapan yang disarankan adalah <strong>${formatTahun(max)}</strong>. Silakan isi maksimal <strong>${maxTahun} tahun</strong>.`);
    return false;
  }

  if (value <= 0) {
    customTahun.classList.add('is-invalid');
    showPensionWarning('⚠️ Periode custom harus lebih dari 0 tahun.');
    return false;
  }

  customTahun.classList.remove('is-invalid');
  hidePensionWarning();
  return true;
}

function getPeriode() {
  const { max, sisaKuliah } = getBatas();
  const val = periodePersiapan.value;

  if (val === 'kuliah') return Math.min(sisaKuliah, max);
  if (val === 'custom') return Number(customTahun.value || 0);
  return Math.min(Number(val || 0), max);
}

function inflasiNum() {
  return Number(inflasi.value || 0) / 100;
}

function rate() {
  return Number(document.querySelector('input[name="strategiInvestasi"]:checked')?.value || 0.04);
}

function strategiLabel() {
  const v = rate();
  if (v === 0.02) return 'Konservatif (1–2%)';
  if (v === 0.06) return 'Agresif (6% ke atas)';
  return 'Moderat (3–5%)';
}

function valid() {
  let ok = true;

  document.querySelectorAll('[required]').forEach(el => {
    let inv = !String(el.value || '').trim();
    if (el.id === 'customTahun' && periodePersiapan.value !== 'custom') inv = false;
    el.classList.toggle('is-invalid', inv);
    if (inv) ok = false;
  });

  if (Number(usiaMasuk.value) <= Number(usiaAnak.value)) {
    usiaMasuk.classList.add('is-invalid');
    ok = false;
  }

  if (!validatePeriodeCustom()) ok = false;

  return ok;
}

function kosongkan() {
  sisaWaktu.innerText = '0 Tahun';
  danaDibutuhkan.innerText = 'Rp0';
  kekuranganDana.innerText = 'Rp0';
  setoranBulanan.innerText = 'Rp0';
  ringkasanText.innerText = 'Lengkapi semua data wajib untuk melihat hasil simulasi.';
  insightOrtu.innerText = 'Lengkapi data orang tua untuk melihat analisis kesiapan sebelum masa pensiun.';
  tabelDana.innerHTML = '';
  ctaSection.classList.add('d-none');
  last = null;
}

function hitung() {
  if (!valid()) {
    kosongkan();
    return;
  }

  const d = data();
  if (d.sisa <= 0 || d.biaya <= 0 || d.inflasi < 0 || d.periode <= 0) {
    kosongkan();
    return;
  }

  const target = d.biaya * Math.pow(1 + d.inflasi, d.sisa);
  const kurang = Math.max(target - d.danaAda, 0);
  const setor = calcSetor(kurang, d.periode, d.rate);

  last = { ...d, target, kurang, setor };

  sisaWaktu.innerText = formatTahun(d.sisa);
  danaDibutuhkan.innerText = rupiah(target);
  kekuranganDana.innerText = rupiah(kurang);
  setoranBulanan.innerText = rupiah(setor) + ' / bulan';

  ringkasanText.innerHTML = `Target <strong>${d.targetLabel}</strong> untuk ${d.namaAnak} membutuhkan estimasi dana sebesar <strong>${rupiah(target)}</strong> dalam ${formatTahun(d.sisa)}. Dana yang sudah ada ${rupiah(d.danaAda)}, sehingga kekurangan dana sekitar <strong>${rupiah(kurang)}</strong>.`;

  insight(d);
  timeline(d);
  readiness(d);
  ctaSection.classList.remove('d-none');
}

function data() {
  const key = targetPendidikan.value;
  return {
    namaAyah: namaAyah.value.trim(),
    usiaAyah: Number(usiaAyah.value),
    namaIbu: namaIbu.value.trim(),
    usiaIbu: Number(usiaIbu.value),
    usiaPensiun: Number(usiaPensiun.value),
    namaAnak: namaAnak.value.trim(),
    usiaAnak: Number(usiaAnak.value),
    targetLabel: TARGETS[key]?.label || '-',
    usiaMasuk: Number(usiaMasuk.value),
    lama: Number(lamaStudi.value),
    biaya: bersih(biayaSaatIni.value),
    inflasi: inflasiNum(),
    tahun: Number(tahunSekarang.value),
    danaAda: bersih(danaAda.value),
    catatan: catatan.value.trim(),
    rate: rate(),
    strategi: strategiLabel(),
    periode: getPeriode(),
    sisa: Number(usiaMasuk.value) - Number(usiaAnak.value)
  };
}

function calcSetor(k, p, r) {
  if (k <= 0 || p <= 0) return 0;
  const n = Math.round(p * 12);
  const m = r / 12;
  if (m <= 0) return k / n;
  return k * m / (Math.pow(1 + m, n) - 1);
}

function insight(d) {
  const aKul = d.usiaAyah + d.sisa;
  const iKul = d.usiaIbu + d.sisa;
  const aFin = d.usiaAyah + d.periode;
  const iFin = d.usiaIbu + d.periode;
  const warn = (aFin > d.usiaPensiun || iFin > d.usiaPensiun)
    ? '<div class="warning-box">⚠️ Periode persiapan dana melewati usia pensiun. Sistem membatasi pilihan periode agar lebih aman.</div>'
    : '';

  insightOrtu.innerHTML = `Saat ${d.namaAnak} masuk ${d.targetLabel}, ${d.namaAyah} diperkirakan berusia <strong>${aKul} tahun</strong> dan ${d.namaIbu} <strong>${iKul} tahun</strong>.<br>Dengan periode persiapan ${formatTahun(d.periode)}, usia saat dana ditargetkan terkumpul: ${d.namaAyah} <strong>${aFin.toFixed(0)} tahun</strong>, ${d.namaIbu} <strong>${iFin.toFixed(0)} tahun</strong>. ${warn}`;
}

function timeline(d) {
  let html = '';
  for (let i = 0; i <= d.sisa; i++) {
    const dana = d.biaya * Math.pow(1 + d.inflasi, i);
    const naik = ((dana - d.biaya) / d.biaya) * 100;
    html += `<tr><td>${d.tahun + i}</td><td>${d.usiaAnak + i} Tahun</td><td>${rupiah(dana)}</td><td>${naik.toFixed(1)}%</td></tr>`;
  }
  tabelDana.innerHTML = html;
}

function getReadinessState(d) {
  const sudahTahuKebutuhan = d.target > 0;
  const sudahPunyaTargetWaktu = d.periode > 0;
  const strategiPendanaanDisusun = d.setor >= 0 && d.strategi;
  const danaAwalMencukupi = d.danaAda >= d.target;

  let terpenuhi = 0;
  [sudahTahuKebutuhan, sudahPunyaTargetWaktu, strategiPendanaanDisusun, danaAwalMencukupi].forEach(v => {
    if (v) terpenuhi++;
  });

  const score = terpenuhi * 25;
  let status = 'Awal';
  let message = 'Perencanaan baru dimulai, masih banyak aspek yang perlu dipersiapkan.';

  if (score === 100) {
    status = 'Sangat Baik';
    message = 'Perencanaan sangat baik, pertahankan strategi dan lakukan evaluasi berkala.';
  } else if (score >= 75) {
    status = 'Baik';
    message = 'Perencanaan sudah baik, fokus pada konsistensi mencapai target.';
  } else if (score >= 50) {
    status = 'Cukup';
    message = 'Perencanaan sudah berjalan, namun masih perlu penyempurnaan.';
  }

  return {
    score,
    terpenuhi,
    status,
    message,
    items: [
      { ok: sudahTahuKebutuhan, text: 'Sudah mengetahui kebutuhan dana' },
      { ok: sudahPunyaTargetWaktu, text: 'Sudah memiliki target waktu' },
      { ok: strategiPendanaanDisusun, text: 'Strategi pendanaan sudah disusun' },
      { ok: danaAwalMencukupi, text: danaAwalMencukupi ? 'Dana awal sudah mencukupi' : 'Dana awal belum mencukupi' }
    ]
  };
}

function readiness(d) {
  const r = getReadinessState(d);
  readinessScore.innerText = r.score + '%';
  readinessBar.style.width = r.score + '%';
  readinessText.innerText = r.message;

  readinessChecklist.innerHTML = r.items.map(item => `
    <div class="readiness-item ${item.ok ? 'checked' : ''}">
      <span>${item.ok ? '✓' : ''}</span>
      <strong>${item.text}</strong>
    </div>
  `).join('');
}

function konsultasiWhatsApp() {
  if (!last) return;
  const d = last;
  const msg = `Halo Pak Septino,\n\nSaya baru menggunakan aplikasi Cerdas Finansial dan ingin berkonsultasi mengenai hasil simulasi dana pendidikan.\n\nNama Anak: ${d.namaAnak}\nTarget Pendidikan: ${d.targetLabel}\nDana Dibutuhkan: ${rupiah(d.target)}\nDana Saat Ini: ${rupiah(d.danaAda)}\nKekurangan Dana: ${rupiah(d.kurang)}\nEstimasi Setoran: ${rupiah(d.setor)} / bulan\nPeriode Persiapan: ${formatTahun(d.periode)}\n\nMohon dibantu membuatkan strategi yang sesuai. Terima kasih.`;
  window.open(`https://wa.me/${FP.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
}

function konsultasiEmail() {
  const subject = 'Konsultasi Dana Pendidikan';
  location.href = `mailto:${FP.email}?subject=${encodeURIComponent(subject)}`;
}

function konsultasiInstagram() {
  window.open(FP.instagramUrl, '_blank');
}

/* ==========================
   PDF EXPORT - VERSION RAPI
   ========================== */
function exportPDF() {
  try {
    if (!last) {
      alert('Lengkapi data terlebih dahulu sebelum export PDF.');
      return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('Library jsPDF belum termuat. Coba refresh halaman terlebih dahulu.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const d = last;

    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 12;

    const C = {
      navy: [5, 42, 76],
      navy2: [10, 57, 97],
      gold: [200, 151, 46],
      green: [43, 135, 82],
      red: [196, 47, 50],
      ink: [17, 32, 53],
      muted: [93, 108, 132],
      line: [214, 226, 238],
      soft: [248, 251, 254],
      goldSoft: [255, 248, 232],
      greenSoft: [239, 248, 243],
      redSoft: [255, 241, 241],
      white: [255, 255, 255]
    };

    const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

    function fmt(n) { return rupiah(Math.round(Number(n || 0))); }
    function cleanName(txt) { return String(txt || 'Simulasi').replace(/[^a-z0-9_\-]+/gi, '_'); }
    function periodeBulan() { return Math.round((d.periode || 0) * 12); }
    function periodeText() { return `${formatTahun(d.periode)} (${periodeBulan()} Bulan)`; }

    function font(size = 8, style = 'normal', color = C.ink) {
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      doc.setTextColor(...color);
    }

    function fill(color) { doc.setFillColor(...color); }
    function stroke(color) { doc.setDrawColor(...color); }

    function box(x, y, w, h, r = 4, bg = C.white, border = C.line) {
      fill(bg);
      stroke(border);
      doc.setLineWidth(0.35);
      doc.roundedRect(x, y, w, h, r, r, 'FD');
    }

    function line(x1, y1, x2, y2, color = C.line, width = 0.25) {
      stroke(color);
      doc.setLineWidth(width);
      doc.line(x1, y1, x2, y2);
    }

    function wrap(text, x, y, w, size = 6.5, lineH = 3.6, color = C.ink, style = 'normal') {
      font(size, style, color);
      const lines = doc.splitTextToSize(String(text || ''), w);
      doc.text(lines, x, y);
      return y + lines.length * lineH;
    }

    function fitText(text, x, y, w, maxSize = 12, minSize = 6, color = C.ink, style = 'bold', align = 'center') {
      let size = maxSize;
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      while (size > minSize && doc.getTextWidth(String(text)) > w) {
        size -= 0.25;
        doc.setFontSize(size);
      }
      font(size, style, color);
      doc.text(String(text), x, y, { align });
    }

    function circleText(x, y, r, color, text, tColor = C.white, size = 6.2) {
      fill(color);
      doc.circle(x, y, r, 'F');
      font(size, 'bold', tColor);
      doc.text(String(text), x, y + size * 0.28, { align: 'center' });
    }

    function logo(x, y) {
      font(15, 'bold', C.navy);
      doc.text('C', x, y + 9);
      font(15, 'bold', C.gold);
      doc.text('F', x + 8, y + 9);
      font(7.5, 'bold', C.navy);
      doc.text('CERDAS', x + 19, y + 4.5);
      font(7.5, 'bold', C.gold);
      doc.text('FINANSIAL', x + 19, y + 11.5);
    }

    function header(title, subtitle) {
      logo(M, 8);
      font(13, 'bold', C.navy);
      doc.text(title, 74, 14);
      font(8, 'normal', C.ink);
      doc.text(subtitle, 74, 22);
      font(6.5, 'bold', C.navy);
      doc.text('Tanggal Simulasi', W - M - 42, 13);
      font(7.2, 'bold', C.ink);
      doc.text(today, W - M - 42, 21);
      line(M, 30, W - M, 30, C.gold, 0.5);
    }

    function footer(page) {
      const y = H - 13;
      line(M, y - 3, W - M, y - 3, C.gold, 0.35);
      font(5.7, 'normal', C.muted);
      doc.text('Disusun oleh:', M, y + 1);
      font(6.2, 'bold', C.ink);
      doc.text(FP.name, M + 20, y + 1);
      font(5.7, 'normal', C.muted);
      doc.text(FP.title, M, y + 5);
      font(5.8, 'normal', C.ink);
      doc.text(`WA ${FP.phoneDisplay}`, 100, y + 2);
      doc.text(FP.email, 148, y + 2);
      doc.text(FP.instagram, 205, y + 2);
      fill(C.goldSoft);
      stroke([240, 213, 155]);
      doc.roundedRect(W - M - 28, y - 1.8, 28, 7, 2, 2, 'FD');
      font(5.8, 'bold', C.navy);
      doc.text(`Halaman ${page} dari 2`, W - M - 14, y + 2.8, { align: 'center' });
    }

    function section(x, y, title) {
      font(9, 'bold', C.navy);
      doc.text(title, x, y);
      fill(C.gold);
      doc.roundedRect(x, y + 2, 18, 1.2, 0.6, 0.6, 'F');
    }

    function dataAnakCard(x, y, w, h) {
      box(x, y, w, h, 5, C.white, C.line);
      fill(C.navy);
      doc.roundedRect(x, y - 6, 42, 10, 3, 3, 'F');
      font(7.4, 'bold', C.white);
      doc.text('DATA ANAK', x + 10, y + 1.2);

      const rows = [
        ['Nama Anak', d.namaAnak || '-'],
        ['Usia Saat Ini', `${d.usiaAnak} tahun`],
        ['Target Pendidikan', d.targetLabel],
        ['Biaya Saat Ini', fmt(d.biaya)],
        ['Inflasi Pendidikan', `${(d.inflasi * 100).toFixed(1).replace('.0', '')}% / tahun`],
        ['Strategi', d.strategi]
      ];

      let yy = y + 12;
      rows.forEach(([label, value]) => {
        font(6.3, 'normal', C.ink);
        doc.text(label, x + 8, yy);
        font(6.3, 'bold', C.navy);
        doc.text(':', x + 58, yy);
        doc.text(String(value), x + 64, yy, { maxWidth: w - 70 });
        yy += 5.5;
      });
    }

    function targetCard(x, y, w, h) {
      box(x, y, w, h, 6, C.navy2, C.navy2);
      circleText(x + w / 2, y + 11, 7, C.gold, 'EDU', C.navy, 5.8);
      font(9, 'bold', C.white);
      doc.text('KEBUTUHAN DANA', x + w / 2, y + 25, { align: 'center' });
      doc.text(`SAAT USIA ${d.usiaMasuk} TAHUN`, x + w / 2, y + 33, { align: 'center' });
      line(x + 22, y + 39, x + w - 22, y + 39, C.gold, 0.45);
      fitText(fmt(d.target), x + w / 2, y + 52, w - 18, 15, 8, C.gold, 'bold');
      font(6.5, 'normal', C.white);
      doc.text('Estimasi kebutuhan saat target pendidikan dimulai.', x + w / 2, y + 61, { align: 'center', maxWidth: w - 20 });
    }

    function summaryCard(x, y, w, h, title, value, desc, color) {
      box(x, y, w, h, 5, C.white, C.line);
      fill(color);
      doc.roundedRect(x, y, w, 2.5, 1, 1, 'F');
      font(6.7, 'bold', C.navy);
      doc.text(title, x + w / 2, y + 12, { align: 'center', maxWidth: w - 8 });
      fitText(value, x + w / 2, y + 24, w - 10, 11.5, 6.6, color, 'bold');
      wrap(desc, x + 6, y + 32, w - 12, 5.8, 3.1, C.ink);
    }

    function progressBlock(x, y, w, h) {
      box(x, y, w, h, 5, C.white, C.line);
      font(8.1, 'bold', C.navy);
      doc.text('KOMPOSISI DANA', x + 9, y + 11);

      const pct = d.target > 0 ? Math.min(100, Math.max(0, (d.danaAda / d.target) * 100)) : 0;
      const barX = x + 12;
      const barY = y + 26;
      const barW = w - 24;

      fill([224, 233, 242]);
      doc.roundedRect(barX, barY, barW, 8, 4, 4, 'F');
      fill(C.gold);
      doc.roundedRect(barX, barY, barW * pct / 100, 8, 4, 4, 'F');

      font(16, 'bold', C.navy);
      doc.text(`${Math.round(pct)}%`, x + 12, y + 50);
      font(6.5, 'normal', C.muted);
      doc.text('Dana sudah tersedia dari total target.', x + 12, y + 57);

      font(6.4, 'bold', C.navy);
      doc.text(`Dana Ada: ${fmt(d.danaAda)}`, x + w - 82, y + 44);
      font(6.4, 'bold', C.gold);
      doc.text(`Kekurangan: ${fmt(d.kurang)}`, x + w - 82, y + 55);
    }

    function noteCard(x, y, w, h) {
      box(x, y, w, h, 5, C.goldSoft, [240, 216, 160]);
      font(8.1, 'bold', C.navy);
      doc.text('CATATAN SINGKAT', x + 10, y + 11);
      const notes = [
        'Mulai lebih awal memberi peluang pertumbuhan dana lebih optimal.',
        'Hasil investasi dan inflasi dapat berubah dari waktu ke waktu.',
        'Disiplin menabung dan konsisten adalah kunci keberhasilan.',
        'Evaluasi berkala minimal setiap 6–12 bulan.'
      ];
      let yy = y + 22;
      notes.forEach(n => {
        circleText(x + 10, yy - 2.2, 3, C.gold, '✓', C.white, 5);
        wrap(n, x + 18, yy, w - 24, 5.9, 3.2, C.ink);
        yy += 9;
      });
    }

    function infoStrip(x, y, w, h) {
      box(x, y, w, h, 4, C.soft, C.line);
      circleText(x + 10, y + h / 2, 5, C.navy, 'i', C.white, 6);
      wrap('Perhitungan ini merupakan estimasi berdasarkan target dana pendidikan, jangka waktu persiapan, asumsi inflasi, dan estimasi hasil investasi yang dimasukkan.', x + 20, y + 7, w - 30, 6, 3.2, C.ink);
    }

    function recCard(x, y, w, h, title, value, desc, color, bg = C.white) {
      box(x, y, w, h, 5, bg, color);
      circleText(x + 12, y + 13, 6.5, color, '', C.white, 5.5);
      font(6.6, 'bold', C.navy);
      doc.text(title, x + 23, y + 10, { maxWidth: w - 28 });
      fitText(value, x + w / 2, y + 29, w - 12, 11.8, 6.6, color, 'bold');
      wrap(desc, x + 10, y + 40, w - 20, 5.8, 3.2, C.ink);
    }

    function strategicSteps(x, y, w, h) {
      box(x, y, w, h, 5, C.white, C.line);
      font(8.5, 'bold', C.navy);
      doc.text('2 LANGKAH STRATEGIS', x + 8, y + 11);

      const items = [
        ['1', 'INVESTASI JANGKA PANJANG', 'Pilih instrumen investasi sesuai profil risiko dan jangka waktu.', C.navy],
        ['2', 'PROTEKSI', 'Lindungi rencana pendidikan dari risiko yang tidak terduga.', C.green],
        ['3', 'KONSISTENSI', 'Lakukan setoran rutin dan evaluasi berkala.', C.gold]
      ];

      let yy = y + 25;
      items.forEach(([no, title, text, color]) => {
        circleText(x + 12, yy - 1, 4.5, color, no, C.white, 5.4);
        font(6.5, 'bold', C.navy);
        doc.text(title, x + 23, yy - 2);
        wrap(text, x + 23, yy + 5, w - 32, 5.8, 3.1, C.ink);
        yy += 19;
      });
    }

    function actionPlanCard(x, y, w, h) {
      box(x, y, w, h, 5, C.white, C.line);
      font(8.5, 'bold', C.navy);
      doc.text('3 ACTION PLAN', x + 8, y + 11);
      const plans = [
        'Mulai investasi sedini mungkin.',
        'Sisihkan dana rutin setiap bulan.',
        'Tingkatkan nominal saat pendapatan meningkat.',
        'Review rencana minimal 1 tahun sekali.',
        'Lindungi income orang tua dengan asuransi jiwa.'
      ];
      let yy = y + 24;
      plans.forEach(p => {
        circleText(x + 11, yy - 2.2, 3, C.navy, '✓', C.white, 4.8);
        wrap(p, x + 18, yy, w - 26, 5.9, 3.1, C.ink);
        yy += 10;
      });
    }

    function cta(x, y, w, h) {
      box(x, y, w, h, 6, C.goldSoft, C.gold);
      circleText(x + 15, y + h / 2, 8, C.gold, 'CF', C.white, 6.2);
      font(8, 'bold', C.navy);
      doc.text('Butuh bantuan menyusun strategi?', x + 30, y + 11);
      wrap('Konsultasikan rencana pendidikan agar strategi yang dipilih sesuai kebutuhan keluarga.', x + 30, y + 19, w * 0.48, 5.8, 3.1, C.ink);
      line(x + w * 0.63, y + 6, x + w * 0.63, y + h - 6, [226, 198, 145], 0.25);
      font(6.7, 'bold', C.navy);
      doc.text('Hubungi Saya:', x + w * 0.68, y + 9);
      font(7, 'bold', C.ink);
      doc.text(FP.name, x + w * 0.68, y + 16);
      font(5.9, 'normal', C.muted);
      doc.text(FP.title, x + w * 0.68, y + 21);
      font(5.9, 'normal', C.ink);
      doc.text(`WA ${FP.phoneDisplay}`, x + w * 0.68, y + 28);
      doc.text(FP.email, x + w * 0.68, y + 34);
      doc.text(FP.instagram, x + w * 0.68, y + 40);
    }

    // PAGE 1
    header('LAPORAN SIMULASI DANA PENDIDIKAN', 'Perencanaan Masa Depan Anak');
    dataAnakCard(M, 43, 118, 48);
    targetCard(142, 43, W - M - 142, 48);

    section(M, 105, 'RINGKASAN HASIL SIMULASI');
    const gap = 5;
    const cardW = (W - M * 2 - gap * 3) / 4;
    summaryCard(M, 116, cardW, 36, 'TOTAL KEBUTUHAN DANA', fmt(d.target), 'Estimasi kebutuhan saat target pendidikan dimulai.', C.navy);
    summaryCard(M + (cardW + gap), 116, cardW, 36, 'DANA YANG SUDAH ADA', fmt(d.danaAda), 'Dana pendidikan yang sudah tersedia saat ini.', C.green);
    summaryCard(M + (cardW + gap) * 2, 116, cardW, 36, 'KEKURANGAN DANA', fmt(d.kurang), 'Selisih dana yang perlu dipersiapkan.', C.red);
    summaryCard(M + (cardW + gap) * 3, 116, cardW, 36, 'SETORAN BULANAN', fmt(d.setor), 'Estimasi dana yang disiapkan setiap bulan.', C.gold);

    progressBlock(M, 161, 128, 31);
    noteCard(146, 161, W - M - 146, 31);
    infoStrip(M, 195, W - M * 2, 10);
    footer(1);

    // PAGE 2
    doc.addPage();
    header('REKOMENDASI FINANCIAL PLANNER', 'Langkah strategis untuk masa depan pendidikan anak Anda');

    font(8.6, 'bold', C.navy);
    doc.text('1 RINGKASAN RENCANA', M + 1, 45);
    const recW = (W - M * 2 - 12) / 3;
    recCard(M, 54, recW, 43, `TARGET DANA USIA ${d.usiaMasuk} TAHUN`, fmt(d.target), 'Total kebutuhan saat target pendidikan dimulai.', C.navy, C.white);
    recCard(M + recW + 6, 54, recW, 43, 'JANGKA WAKTU PERSIAPAN', periodeText(), 'Sesuai periode persiapan yang dipilih.', C.green, C.greenSoft);
    recCard(M + (recW + 6) * 2, 54, recW, 43, 'DANA DISIAPKAN PER BULAN', fmt(d.setor), 'Estimasi komitmen dana setiap bulan.', C.gold, C.goldSoft);

    infoStrip(M, 104, W - M * 2, 11);
    strategicSteps(M, 125, 130, 55);
    actionPlanCard(148, 125, W - M - 148, 55);
    cta(M, 184, W - M * 2, 18);
    footer(2);

    doc.save(`Laporan_Dana_Pendidikan_${cleanName(d.namaAnak)}.pdf`);
  } catch (err) {
    console.error(err);
    alert('Export PDF gagal: ' + (err?.message || err));
  }
}

function resetForm() {
  simulasiForm.reset();
  tahunSekarang.value = new Date().getFullYear();
  const defaultStrategy = document.querySelector('input[name="strategiInvestasi"][value="0.04"]');
  if (defaultStrategy) defaultStrategy.checked = true;
  updatePeriode();
  kosongkan();
}

window.exportPDF = exportPDF;
window.resetForm = resetForm;
window.konsultasiWhatsApp = konsultasiWhatsApp;
window.konsultasiEmail = konsultasiEmail;
window.konsultasiInstagram = konsultasiInstagram;
