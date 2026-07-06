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
  phoneText: '0811-6946-999',
  email: 'septinogao@gmail.com',
  instagram: 'https://instagram.com/septino.gao',
  igText: '@septino.gao',
  name: 'Septino, QWP®, CIS®',
  title: 'Financial Planner & Insurance Consultant'
};

let last = null;

window.addEventListener('DOMContentLoaded', () => {
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

  window.exportPDF = exportPDF;
  window.resetForm = resetForm;
  window.konsultasiWhatsApp = konsultasiWhatsApp;
  window.konsultasiEmail = konsultasiEmail;
  window.konsultasiInstagram = konsultasiInstagram;

  updatePeriode();
  kosongkan();
});

function allInputs() {
  return [...document.querySelectorAll('#simulasiForm input,#simulasiForm select,#simulasiForm textarea')];
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
  if (typeof periodePersiapan === 'undefined') return;

  const prev = periodePersiapan.value;
  const { max, sisaKuliah } = getBatas();

  periodePersiapan.innerHTML = '';
  hidePensionWarning();

  if (!isFinite(max) || max <= 0) {
    periodePersiapan.innerHTML = '<option value="">Lengkapi data dahulu</option>';
    if (typeof periodeInfo !== 'undefined') periodeInfo.innerText = 'Isi usia orang tua, usia anak, dan usia masuk pendidikan.';
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

  if (typeof periodeInfo !== 'undefined') {
    periodeInfo.innerText = `Periode maksimum yang disarankan: ${formatTahun(max)}, berdasarkan sisa waktu pendidikan dan usia pensiun orang tua.`;
  }

  validatePeriodeCustom();
}

function showPensionWarning(message) {
  if (typeof pensionWarning === 'undefined') return;
  pensionWarning.innerHTML = message;
  pensionWarning.classList.remove('d-none');
}

function hidePensionWarning() {
  if (typeof pensionWarning === 'undefined') return;
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
  if (typeof sisaWaktu !== 'undefined') sisaWaktu.innerText = '0 Tahun';
  if (typeof danaDibutuhkan !== 'undefined') danaDibutuhkan.innerText = 'Rp0';
  if (typeof kekuranganDana !== 'undefined') kekuranganDana.innerText = 'Rp0';
  if (typeof setoranBulanan !== 'undefined') setoranBulanan.innerText = 'Rp0';
  if (typeof ringkasanText !== 'undefined') ringkasanText.innerText = 'Lengkapi semua data wajib untuk melihat hasil simulasi.';
  if (typeof insightOrtu !== 'undefined') insightOrtu.innerText = 'Lengkapi data orang tua untuk melihat analisis kesiapan sebelum masa pensiun.';
  if (typeof tabelDana !== 'undefined') tabelDana.innerHTML = '';
  if (typeof ctaSection !== 'undefined') ctaSection.classList.add('d-none');
  last = null;
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
  if (typeof tabelDana === 'undefined') return;
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
  [sudahTahuKebutuhan, sudahPunyaTargetWaktu, strategiPendanaanDisusun, danaAwalMencukupi].forEach(v => { if (v) terpenuhi++; });

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
  if (typeof readinessScore === 'undefined') return;
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
  location.href = `mailto:${FP.email}?subject=${encodeURIComponent('Konsultasi Dana Pendidikan')}`;
}

function konsultasiInstagram() {
  window.open(FP.instagram, '_blank');
}

function exportPDF() {
  try {
    if (!last) {
      alert('Lengkapi data terlebih dahulu.');
      return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('Library jsPDF belum terbaca. Pastikan script jsPDF ada di pendidikan.html.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const d = last;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 14;
    const bottomSafe = 270;
    const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

    const C = {
      navy: [8, 48, 83],
      navy2: [12, 64, 110],
      gold: [202, 151, 46],
      gold2: [232, 189, 93],
      green: [43, 135, 82],
      red: [196, 47, 50],
      ink: [18, 32, 52],
      muted: [90, 105, 128],
      line: [217, 228, 239],
      soft: [247, 250, 253],
      goldSoft: [255, 249, 235],
      greenSoft: [241, 249, 245],
      redSoft: [255, 243, 243],
      white: [255, 255, 255]
    };

    const fmt = n => rupiah(Math.round(Number(n || 0)));
    const cleanName = txt => String(txt || 'Simulasi').replace(/[^a-z0-9_\-]+/gi, '_');
    const targetAge = d.usiaMasuk || 18;
    const danaAda = Number(d.danaAda || 0);
    const percentAda = d.target > 0 ? Math.min(100, Math.max(0, (danaAda / d.target) * 100)) : 0;
    const periodMonths = Math.round((d.periode || 0) * 12);
    const periodText = `${formatTahun(d.periode)} (${periodMonths} Bulan)`;

    function font(size = 9, style = 'normal', color = C.ink) {
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      doc.setTextColor(...color);
    }
    function fill(c) { doc.setFillColor(...c); }
    function stroke(c) { doc.setDrawColor(...c); }
    function line(x1, y1, x2, y2, c = C.line, w = 0.3) {
      stroke(c); doc.setLineWidth(w); doc.line(x1, y1, x2, y2);
    }
    function rect(x, y, w, h, fillColor = C.white, lineColor = C.line, r = 4) {
      fill(fillColor); stroke(lineColor); doc.setLineWidth(0.35); doc.roundedRect(x, y, w, h, r, r, 'FD');
    }
    function wrap(text, x, y, w, size = 8, lineH = 4.2, color = C.ink, style = 'normal') {
      font(size, style, color);
      const lines = doc.splitTextToSize(String(text || ''), w);
      doc.text(lines, x, y);
      return y + lines.length * lineH;
    }
    function fitText(text, x, y, w, maxSize = 14, minSize = 7, color = C.ink, style = 'bold', align = 'center') {
      let size = maxSize;
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      while (size > minSize && doc.getTextWidth(String(text)) > w) {
        size -= 0.35;
        doc.setFontSize(size);
      }
      font(size, style, color);
      doc.text(String(text), x, y, { align });
    }
    function circle(x, y, r, color, text = '', textColor = C.white) {
      fill(color); doc.circle(x, y, r, 'F');
      if (text) {
        font(Math.min(7, r * 1.25), 'bold', textColor);
        doc.text(String(text), x, y + r * 0.38, { align: 'center' });
      }
    }
    function simpleLogo(x, y, s = 1) {
      font(13 * s, 'bold', C.navy); doc.text('C', x, y + 8 * s);
      font(13 * s, 'bold', C.gold); doc.text('F', x + 8 * s, y + 8 * s);
      font(6.5 * s, 'bold', C.navy); doc.text('CERDAS', x + 21 * s, y + 3.5 * s);
      font(6.5 * s, 'bold', C.gold); doc.text('FINANSIAL', x + 21 * s, y + 10.5 * s);
    }
    function header(title, subtitle) {
      fill(C.white); doc.rect(0, 0, W, 34, 'F');
      simpleLogo(M, 10, 1);
      font(12, 'bold', C.navy); doc.text(title, 72, 15);
      font(7.2, 'normal', C.ink); doc.text(subtitle, 72, 22);
      font(6.2, 'bold', C.muted); doc.text('Tanggal Simulasi', W - M - 38, 14);
      font(7, 'bold', C.navy); doc.text(today, W - M - 38, 22);
      line(M, 30, W - M, 30, C.gold, 0.45);
    }
    function footer(page) {
      const y = 284;
      line(M, y - 4, W - M, y - 4, C.gold, 0.35);
      font(6, 'bold', C.navy); doc.text('Cerdas Finansial © 2026', M, y);
      font(5.8, 'normal', C.muted); doc.text(`${FP.name} • ${FP.phoneText} • ${FP.email} • ${FP.igText}`, M, y + 4);
      fill(C.goldSoft); stroke([239, 209, 139]); doc.roundedRect(W - M - 30, y - 2, 30, 8, 3, 3, 'FD');
      font(5.8, 'bold', C.navy); doc.text(`Halaman ${page} / 2`, W - M - 15, y + 3.2, { align: 'center' });
    }
    function section(y, title, no = '') {
      if (no) circle(M + 3, y - 2.5, 3.5, C.navy, no);
      font(8.4, 'bold', C.navy); doc.text(title, no ? M + 10 : M, y);
      fill(C.gold); doc.roundedRect(no ? M + 10 : M, y + 2.2, 18, 1.2, 0.6, 0.6, 'F');
    }
    function valueCard(x, y, w, h, title, value, note, color = C.navy, bg = C.white) {
      rect(x, y, w, h, bg, C.line, 5);
      fill(color); doc.roundedRect(x, y, w, 2.5, 1, 1, 'F');
      font(6.7, 'bold', C.muted); doc.text(title, x + 6, y + 10, { maxWidth: w - 12 });
      fitText(value, x + w / 2, y + 22, w - 12, 12, 7, color, 'bold', 'center');
      wrap(note, x + 6, y + 31, w - 12, 6.1, 3.2, C.ink);
    }
    function dataBox(x, y, w, h) {
      rect(x, y, w, h, C.white, C.line, 5);
      fill(C.navy); doc.roundedRect(x, y - 4, 36, 9, 3, 3, 'F');
      font(7, 'bold', C.white); doc.text('DATA ANAK', x + 9, y + 2);
      const rows = [
        ['Nama Anak', d.namaAnak || '-'],
        ['Usia Saat Ini', `${d.usiaAnak} tahun`],
        ['Target Pendidikan', d.targetLabel],
        ['Biaya Saat Ini', fmt(d.biaya)],
        ['Inflasi Pendidikan', `${(d.inflasi * 100).toFixed(1).replace('.0', '')}% / tahun`],
        ['Strategi', d.strategi]
      ];
      let yy = y + 13;
      rows.forEach(([a, b]) => {
        font(6.7, 'normal', C.ink); doc.text(a, x + 7, yy);
        font(6.7, 'bold', C.navy); doc.text(':', x + 55, yy);
        doc.text(String(b), x + 60, yy, { maxWidth: w - 66 });
        yy += 5.8;
      });
    }
    function targetBox(x, y, w, h) {
      rect(x, y, w, h, C.navy, C.navy, 6);
      circle(x + w / 2, y + 14, 8, C.gold, 'EDU', C.navy);
      font(8.5, 'bold', C.white); doc.text('KEBUTUHAN DANA', x + w / 2, y + 30, { align: 'center' });
      font(8.5, 'bold', C.white); doc.text(`SAAT USIA ${targetAge} TAHUN`, x + w / 2, y + 38, { align: 'center' });
      line(x + 18, y + 45, x + w - 18, y + 45, C.gold, 0.45);
      fitText(fmt(d.target), x + w / 2, y + 59, w - 16, 15, 8, C.gold, 'bold', 'center');
      wrap('Estimasi kebutuhan saat target pendidikan dimulai.', x + 10, y + 69, w - 20, 6.2, 3.4, C.white, 'normal');
    }
    function progressBar(x, y, w, pct) {
      fill([230, 237, 245]); doc.roundedRect(x, y, w, 5, 2.5, 2.5, 'F');
      fill(C.gold); doc.roundedRect(x, y, Math.max(1, w * pct / 100), 5, 2.5, 2.5, 'F');
    }
    function komposisiBox(x, y, w, h) {
      rect(x, y, w, h, C.white, C.line, 5);
      font(8, 'bold', C.navy); doc.text('KOMPOSISI DANA', x + 8, y + 10);
      const bx = x + 10, by = y + 22, bw = w - 20;
      font(17, 'bold', C.navy); doc.text(`${Math.round(percentAda)}%`, x + 18, y + 30);
      font(6.2, 'normal', C.muted); doc.text('Dana sudah tersedia', x + 18, y + 36);
      progressBar(bx, by + 22, bw, percentAda);
      font(6.2, 'bold', C.green); doc.text(`Dana Ada: ${fmt(danaAda)}`, bx, by + 36);
      font(6.2, 'bold', C.gold); doc.text(`Kekurangan: ${fmt(d.kurang)}`, bx, by + 43);
    }
    function noteBox(x, y, w, h) {
      rect(x, y, w, h, C.goldSoft, [238, 214, 157], 5);
      font(8.2, 'bold', C.navy); doc.text('CATATAN SINGKAT', x + 8, y + 10);
      const notes = [
        'Mulai lebih awal memberi peluang pertumbuhan dana lebih optimal.',
        'Evaluasi biaya pendidikan dan inflasi setiap 6–12 bulan.',
        'Konsistensi menabung menjadi kunci utama keberhasilan.',
        'Sesuaikan nominal setoran saat penghasilan meningkat.'
      ];
      let yy = y + 21;
      notes.forEach(t => {
        circle(x + 8, yy - 2, 2.5, C.gold, '✓');
        wrap(t, x + 15, yy, w - 20, 6.3, 3.4, C.ink);
        yy += 9.5;
      });
    }
    function infoBox(x, y, w, h) {
      rect(x, y, w, h, C.soft, C.line, 4);
      circle(x + 8, y + h / 2, 4, C.navy, 'i');
      wrap('Perhitungan ini merupakan estimasi berdasarkan target dana pendidikan, jangka waktu persiapan, asumsi inflasi, dan estimasi hasil investasi yang dimasukkan.', x + 16, y + 7, w - 22, 6, 3.3, C.ink);
    }
    function recCard(x, y, w, h, title, value, note, color, bg) {
      rect(x, y, w, h, bg, color, 6);
      font(6.9, 'bold', C.navy); doc.text(title, x + 7, y + 10, { maxWidth: w - 14 });
      fitText(value, x + w / 2, y + 26, w - 14, 12.5, 7, color, 'bold', 'center');
      wrap(note, x + 7, y + 37, w - 14, 6, 3.2, C.ink);
    }
    function strategicList(x, y, w, h) {
      rect(x, y, w, h, C.white, C.line, 5);
      font(8.2, 'bold', C.navy); doc.text('2  LANGKAH STRATEGIS', x + 6, y + 10);
      const items = [
        ['1', 'Investasi Jangka Panjang', 'Pilih instrumen sesuai profil risiko dan jangka waktu.', C.navy],
        ['2', 'Proteksi', 'Lindungi rencana pendidikan dari risiko yang tidak terduga.', C.green],
        ['3', 'Konsistensi', 'Lakukan setoran rutin dan evaluasi berkala.', C.gold]
      ];
      let yy = y + 23;
      items.forEach(([no, title, desc, color]) => {
        circle(x + 9, yy - 2, 4, color, no);
        font(6.8, 'bold', C.navy); doc.text(title, x + 17, yy);
        wrap(desc, x + 17, yy + 6, w - 25, 5.8, 3.1, C.ink);
        yy += 20;
      });
    }
    function actionBox(x, y, w, h) {
      rect(x, y, w, h, C.white, C.line, 5);
      font(8.2, 'bold', C.navy); doc.text('3  ACTION PLAN', x + 6, y + 10);
      const arr = [
        'Mulai investasi sedini mungkin.',
        'Sisihkan dana rutin setiap bulan.',
        'Tingkatkan nominal saat pendapatan meningkat.',
        'Review rencana minimal 1 tahun sekali.',
        'Lindungi income orang tua dengan asuransi jiwa.'
      ];
      let yy = y + 22;
      arr.forEach(t => {
        circle(x + 9, yy - 2, 2.8, C.navy, '✓');
        wrap(t, x + 16, yy, w - 22, 6.2, 3.3, C.ink);
        yy += 10.2;
      });
    }
    function ctaBox(x, y, w, h) {
      rect(x, y, w, h, C.goldSoft, C.gold, 6);
      font(8.5, 'bold', C.navy); doc.text('Masa depan anak dimulai dari perencanaan hari ini.', x + 8, y + 11);
      wrap('Konsultasikan rencana pendidikan secara personal agar strategi yang dipilih sesuai kebutuhan dan kondisi keuangan keluarga.', x + 8, y + 20, w - 16, 6.2, 3.4, C.ink);
      line(x + 8, y + 36, x + w - 8, y + 36, C.gold, 0.25);
      font(7, 'bold', C.navy); doc.text(FP.name, x + 8, y + 45);
      font(6.1, 'normal', C.muted); doc.text(FP.title, x + 8, y + 51);
      font(6.2, 'normal', C.ink); doc.text(`WA ${FP.phoneText}`, x + 8, y + 60);
      doc.text(FP.email, x + 70, y + 60);
      doc.text(FP.igText, x + 138, y + 60);
    }

    // PAGE 1
    header('LAPORAN SIMULASI DANA PENDIDIKAN', 'Perencanaan Masa Depan Anak');
    dataBox(M, 42, 88, 58);
    targetBox(M + 96, 42, W - M * 2 - 96, 58);

    section(112, 'RINGKASAN HASIL SIMULASI');
    const cw = (W - M * 2 - 8) / 2;
    valueCard(M, 120, cw, 36, 'TOTAL KEBUTUHAN DANA', fmt(d.target), 'Estimasi kebutuhan saat target pendidikan dimulai.', C.navy);
    valueCard(M + cw + 8, 120, cw, 36, 'DANA YANG SUDAH ADA', fmt(danaAda), 'Dana pendidikan yang sudah tersedia saat ini.', C.green);
    valueCard(M, 162, cw, 36, 'KEKURANGAN DANA', fmt(d.kurang), 'Selisih dana yang perlu dipersiapkan.', C.red);
    valueCard(M + cw + 8, 162, cw, 36, 'SETORAN BULANAN', fmt(d.setor), 'Estimasi dana yang disiapkan setiap bulan.', C.gold);

    komposisiBox(M, 207, cw, 45);
    noteBox(M + cw + 8, 207, cw, 45);
    infoBox(M, 258, W - M * 2, 15);
    footer(1);

    // PAGE 2
    doc.addPage();
    header('REKOMENDASI FINANCIAL PLANNER', 'Langkah strategis untuk masa depan pendidikan anak Anda');
    section(44, 'RINGKASAN RENCANA', '1');

    recCard(M, 54, W - M * 2, 30, `TARGET DANA USIA ${targetAge} TAHUN`, fmt(d.target), 'Total kebutuhan saat target pendidikan dimulai.', C.navy, C.white);
    recCard(M, 90, W - M * 2, 30, 'JANGKA WAKTU PERSIAPAN', periodText, 'Sesuai periode persiapan yang dipilih.', C.green, C.greenSoft);
    recCard(M, 126, W - M * 2, 30, 'DANA DISIAPKAN PER BULAN', fmt(d.setor), 'Estimasi komitmen dana setiap bulan.', C.gold, C.goldSoft);
    infoBox(M, 164, W - M * 2, 16);

    strategicList(M, 188, 87, 62);
    actionBox(M + 96, 188, W - M * 2 - 96, 62);
    ctaBox(M, 256, W - M * 2, 24);
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
  const defaultRadio = document.querySelector('input[name="strategiInvestasi"][value="0.04"]');
  if (defaultRadio) defaultRadio.checked = true;
  updatePeriode();
  kosongkan();
}
