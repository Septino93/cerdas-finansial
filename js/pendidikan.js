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
    const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

    const C = {
      navy: [8, 48, 83],
      navy2: [11, 62, 105],
      gold: [202, 151, 46],
      goldSoft: [255, 249, 236],
      green: [43, 135, 82],
      greenSoft: [241, 249, 245],
      red: [196, 47, 50],
      redSoft: [255, 244, 244],
      ink: [18, 32, 52],
      muted: [92, 108, 132],
      line: [215, 226, 238],
      soft: [248, 251, 254],
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
      stroke(c);
      doc.setLineWidth(w);
      doc.line(x1, y1, x2, y2);
    }

    function box(x, y, w, h, bg = C.white, border = C.line, r = 5) {
      fill(bg);
      stroke(border);
      doc.setLineWidth(0.35);
      doc.roundedRect(x, y, w, h, r, r, 'FD');
    }

    function wrap(text, x, y, w, size = 7.5, lineH = 4, color = C.ink, style = 'normal') {
      font(size, style, color);
      const lines = doc.splitTextToSize(String(text || ''), w);
      doc.text(lines, x, y);
      return y + (lines.length * lineH);
    }

    function fitText(text, x, y, w, maxSize = 14, minSize = 7, color = C.ink, style = 'bold', align = 'center') {
      let size = maxSize;
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      while (size > minSize && doc.getTextWidth(String(text)) > w) {
        size -= 0.3;
        doc.setFontSize(size);
      }
      font(size, style, color);
      doc.text(String(text), x, y, { align });
    }

    function circle(x, y, r, color, text = '', textColor = C.white) {
      fill(color);
      doc.circle(x, y, r, 'F');
      if (text) {
        font(Math.min(7, r * 1.2), 'bold', textColor);
        doc.text(String(text), x, y + r * 0.35, { align: 'center' });
      }
    }

    function simpleLogo(x, y, s = 1) {
      font(13 * s, 'bold', C.navy);
      doc.text('C', x, y + 8 * s);
      font(13 * s, 'bold', C.gold);
      doc.text('F', x + 8 * s, y + 8 * s);
      font(6.4 * s, 'bold', C.navy);
      doc.text('CERDAS', x + 21 * s, y + 3.5 * s);
      font(6.4 * s, 'bold', C.gold);
      doc.text('FINANSIAL', x + 21 * s, y + 10.5 * s);
    }

    function header(title, subtitle) {
      fill(C.white);
      doc.rect(0, 0, W, 34, 'F');
      simpleLogo(M, 10, 1);
      font(12, 'bold', C.navy);
      doc.text(title, 72, 15);
      font(7.2, 'normal', C.ink);
      doc.text(subtitle, 72, 22);
      font(6.2, 'bold', C.muted);
      doc.text('Tanggal Simulasi', W - M - 40, 14);
      font(7, 'bold', C.navy);
      doc.text(today, W - M - 40, 22);
      line(M, 30, W - M, 30, C.gold, 0.45);
    }

    function footer(page, total = 3) {
      const y = 282;
      line(M, y - 4, W - M, y - 4, C.gold, 0.3);
      font(6, 'bold', C.navy);
      doc.text('Cerdas Finansial (c) 2026', M, y);
      font(5.6, 'normal', C.muted);
      doc.text(`${FP.name}  |  ${FP.phoneText}  |  ${FP.email}`, M, y + 4);
      fill(C.goldSoft);
      stroke([239, 209, 139]);
      doc.roundedRect(W - M - 30, y - 2, 30, 8, 3, 3, 'FD');
      font(5.8, 'bold', C.navy);
      doc.text(`Halaman ${page}/${total}`, W - M - 15, y + 3.2, { align: 'center' });
    }

    function sectionTitle(y, title) {
      font(9.2, 'bold', C.navy);
      doc.text(title, M, y);
      fill(C.gold);
      doc.roundedRect(M, y + 2.3, 20, 1.3, 0.7, 0.7, 'F');
    }

    function labelValueRows(x, y, rows, labelW = 45) {
      let yy = y;
      rows.forEach(([label, value]) => {
        font(7.2, 'normal', C.ink);
        doc.text(label, x, yy);
        font(7.2, 'bold', C.navy);
        doc.text(':', x + labelW, yy);
        doc.text(String(value || '-'), x + labelW + 5, yy, { maxWidth: 65 });
        yy += 7;
      });
    }

    function dataCard(x, y, w, h) {
      box(x, y, w, h, C.white, C.line, 6);
      fill(C.navy);
      doc.roundedRect(x, y - 5, 38, 10, 3, 3, 'F');
      font(7, 'bold', C.white);
      doc.text('DATA ANAK', x + 9, y + 1.8);
      labelValueRows(x + 8, y + 14, [
        ['Nama Anak', d.namaAnak || '-'],
        ['Usia Saat Ini', `${d.usiaAnak} tahun`],
        ['Target', d.targetLabel],
        ['Biaya Saat Ini', fmt(d.biaya)],
        ['Inflasi', `${(d.inflasi * 100).toFixed(1).replace('.0', '')}% / tahun`],
        ['Strategi', d.strategi]
      ], 42);
    }

    function targetCard(x, y, w, h) {
      box(x, y, w, h, C.navy2, C.navy2, 7);
      font(10, 'bold', C.white);
      doc.text('KEBUTUHAN DANA', x + w / 2, y + 17, { align: 'center' });
      doc.text(`SAAT USIA ${targetAge} TAHUN`, x + w / 2, y + 26, { align: 'center' });
      line(x + 16, y + 34, x + w - 16, y + 34, C.gold, 0.5);
      fitText(fmt(d.target), x + w / 2, y + 51, w - 18, 18, 9, C.gold, 'bold', 'center');
      wrap('Estimasi kebutuhan saat target pendidikan dimulai.', x + 12, y + 61, w - 24, 6.5, 3.5, C.white, 'normal');
    }

    function metricCard(x, y, w, h, title, value, note, color, bg = C.white) {
      box(x, y, w, h, bg, C.line, 6);
      fill(color);
      doc.roundedRect(x, y, w, 2.5, 1, 1, 'F');
      font(6.7, 'bold', C.muted);
      doc.text(title, x + 6, y + 10, { maxWidth: w - 12 });
      fitText(value, x + w / 2, y + 22, w - 12, 12, 7, color, 'bold', 'center');
      wrap(note, x + 6, y + 31, w - 12, 6.1, 3.3, C.ink);
    }

    function infoBox(x, y, w, h) {
      box(x, y, w, h, C.soft, C.line, 5);
      circle(x + 8, y + h / 2, 4, C.navy, 'i');
      wrap('Perhitungan ini merupakan estimasi berdasarkan target dana pendidikan, jangka waktu persiapan, asumsi inflasi, dan estimasi hasil investasi yang dimasukkan.', x + 17, y + 7, w - 24, 6.2, 3.4, C.ink);
    }

    function progressCard(x, y, w, h) {
      box(x, y, w, h, C.white, C.line, 6);
      font(9, 'bold', C.navy);
      doc.text('KOMPOSISI DANA', x + 8, y + 12);
      font(28, 'bold', C.navy);
      doc.text(`${Math.round(percentAda)}%`, x + 12, y + 39);
      font(6.3, 'normal', C.muted);
      doc.text('Dana sudah tersedia', x + 13, y + 46);
      const bx = x + 12, by = y + 55, bw = w - 24;
      fill([230, 237, 245]);
      doc.roundedRect(bx, by, bw, 6, 3, 3, 'F');
      fill(C.gold);
      doc.roundedRect(bx, by, Math.max(1, bw * percentAda / 100), 6, 3, 3, 'F');
      font(6.8, 'bold', C.green);
      doc.text(`Dana Ada: ${fmt(danaAda)}`, bx, by + 16);
      font(6.8, 'bold', C.gold);
      doc.text(`Kekurangan: ${fmt(d.kurang)}`, bx, by + 25);
    }

    function noteCard(x, y, w, h) {
      box(x, y, w, h, C.goldSoft, [238, 214, 157], 6);
      font(9, 'bold', C.navy);
      doc.text('CATATAN SINGKAT', x + 8, y + 12);
      const notes = [
        'Mulai lebih awal memberi peluang pertumbuhan dana lebih optimal.',
        'Evaluasi biaya pendidikan dan inflasi setiap 6-12 bulan.',
        'Konsistensi menabung menjadi kunci utama keberhasilan.',
        'Sesuaikan nominal setoran saat penghasilan meningkat.'
      ];
      let yy = y + 26;
      notes.forEach(t => {
        circle(x + 9, yy - 2, 2.5, C.gold, '-');
        wrap(t, x + 16, yy, w - 23, 6.4, 3.4, C.ink);
        yy += 12;
      });
    }

    function recommendationCard(x, y, w, h, title, value, note, color, bg) {
      box(x, y, w, h, bg, color, 7);
      font(7.2, 'bold', C.navy);
      doc.text(title, x + 8, y + 11, { maxWidth: w - 16 });
      fitText(value, x + w / 2, y + 30, w - 16, 14, 8, color, 'bold', 'center');
      wrap(note, x + 8, y + 41, w - 16, 6.3, 3.4, C.ink);
    }

    function strategicCard(x, y, w, h, no, title, text, color) {
      box(x, y, w, h, C.white, C.line, 6);
      circle(x + 11, y + 13, 5, color, no);
      font(7.8, 'bold', C.navy);
      doc.text(title, x + 23, y + 11);
      wrap(text, x + 23, y + 20, w - 31, 6.4, 3.4, C.ink);
    }

    function actionPlanCard(x, y, w, h) {
      box(x, y, w, h, C.white, C.line, 6);
      font(9, 'bold', C.navy);
      doc.text('ACTION PLAN', x + 8, y + 12);
      const arr = [
        'Mulai investasi sedini mungkin.',
        'Sisihkan dana rutin setiap bulan.',
        'Tingkatkan nominal saat pendapatan meningkat.',
        'Review rencana minimal 1 tahun sekali.',
        'Lindungi income orang tua dengan asuransi jiwa.'
      ];
      let yy = y + 27;
      arr.forEach(t => {
        circle(x + 9, yy - 2, 2.5, C.navy, '-');
        wrap(t, x + 16, yy, w - 23, 6.4, 3.4, C.ink);
        yy += 11;
      });
    }

    function ctaCard(x, y, w, h) {
      box(x, y, w, h, C.goldSoft, C.gold, 7);
      font(10, 'bold', C.navy);
      doc.text('Masa depan anak dimulai dari perencanaan hari ini.', x + 8, y + 13);
      wrap('Konsultasikan rencana pendidikan secara personal agar strategi yang dipilih sesuai kebutuhan dan kondisi keuangan keluarga.', x + 8, y + 23, w - 16, 6.6, 3.8, C.ink);
      line(x + 8, y + 42, x + w - 8, y + 42, C.gold, 0.25);
      font(8, 'bold', C.navy);
      doc.text(FP.name, x + 8, y + 52);
      font(6.4, 'normal', C.muted);
      doc.text(FP.title, x + 8, y + 58);
      font(6.6, 'normal', C.ink);
      doc.text(`WA ${FP.phoneText}`, x + 8, y + 68);
      doc.text(FP.email, x + 8, y + 76);
      doc.text(FP.igText, x + 8, y + 84);
    }

    // PAGE 1 - EXECUTIVE SUMMARY
    header('LAPORAN SIMULASI DANA PENDIDIKAN', 'Perencanaan Masa Depan Anak');
    dataCard(M, 44, W - M * 2, 62);
    targetCard(M, 114, W - M * 2, 74);
    infoBox(M, 198, W - M * 2, 22);
    footer(1, 4);

    // PAGE 2 - RINGKASAN DETAIL
    doc.addPage();
    header('RINGKASAN HASIL SIMULASI', 'Estimasi kebutuhan dana pendidikan anak');
    const cw = (W - M * 2 - 8) / 2;
    metricCard(M, 44, cw, 40, 'TOTAL KEBUTUHAN DANA', fmt(d.target), 'Estimasi kebutuhan saat target pendidikan dimulai.', C.navy);
    metricCard(M + cw + 8, 44, cw, 40, 'DANA YANG SUDAH ADA', fmt(danaAda), 'Dana pendidikan yang sudah tersedia saat ini.', C.green, C.greenSoft);
    metricCard(M, 92, cw, 40, 'KEKURANGAN DANA', fmt(d.kurang), 'Selisih dana yang perlu dipersiapkan.', C.red, C.redSoft);
    metricCard(M + cw + 8, 92, cw, 40, 'SETORAN BULANAN', fmt(d.setor), 'Estimasi dana yang disiapkan setiap bulan.', C.gold, C.goldSoft);
    progressCard(M, 145, W - M * 2, 62);
    noteCard(M, 218, W - M * 2, 48);
    footer(2, 4);

    // PAGE 3 - REKOMENDASI
    doc.addPage();
    header('REKOMENDASI FINANCIAL PLANNER', 'Langkah strategis untuk masa depan pendidikan anak Anda');
    recommendationCard(M, 44, W - M * 2, 38, `TARGET DANA USIA ${targetAge} TAHUN`, fmt(d.target), 'Total kebutuhan saat target pendidikan dimulai.', C.navy, C.white);
    recommendationCard(M, 90, W - M * 2, 38, 'JANGKA WAKTU PERSIAPAN', periodText, 'Sesuai periode persiapan yang dipilih.', C.green, C.greenSoft);
    recommendationCard(M, 136, W - M * 2, 38, 'DANA DISIAPKAN PER BULAN', fmt(d.setor), 'Estimasi komitmen dana setiap bulan.', C.gold, C.goldSoft);
    strategicCard(M, 185, W - M * 2, 24, '1', 'Investasi Jangka Panjang', 'Pilih instrumen sesuai profil risiko dan jangka waktu.', C.navy);
    strategicCard(M, 214, W - M * 2, 24, '2', 'Proteksi', 'Lindungi rencana pendidikan dari risiko yang tidak terduga.', C.green);
    strategicCard(M, 243, W - M * 2, 24, '3', 'Konsistensi', 'Lakukan setoran rutin dan evaluasi berkala.', C.gold);
    footer(3, 4);

    doc.addPage();
    header('ACTION PLAN', 'Langkah praktis setelah simulasi dana pendidikan');
    actionPlanCard(M, 44, W - M * 2, 78);
    ctaCard(M, 134, W - M * 2, 98);
    footer(4, 4);

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
