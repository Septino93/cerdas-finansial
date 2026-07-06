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
  instagramDisplay: '@septino.gao',
  name: 'Septino, QWP®, CIS®',
  title: 'Financial Planner & Insurance Consultant'
};

let last = null;

document.addEventListener('DOMContentLoaded', () => {
  tahunSekarang.value = new Date().getFullYear();

  allInputs().forEach(el => {
    el.addEventListener('input', () => {
      formatIfMoney(el);
      updateTarget();
      updatePeriode();
      hitung();
    });
  });

  targetPendidikan.addEventListener('change', () => {
    applyTarget();
    updatePeriode();
    hitung();
  });

  periodePersiapan.addEventListener('change', () => {
    customTahunBox.classList.toggle('d-none', periodePersiapan.value !== 'custom');
    hitung();
  });

  document.querySelectorAll('input[name="strategiInvestasi"]').forEach(r => r.addEventListener('change', hitung));

  updatePeriode();
  kosongkan();
});

function allInputs() {
  return [...document.querySelectorAll('#simulasiForm input,#simulasiForm select')];
}

function bersih(v) {
  return Number(String(v || '').replace(/\D/g, ''));
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

function updateTarget() {
  // reserved
}

function getBatas() {
  const usiaA = Number(usiaAyah.value || 0);
  const usiaI = Number(usiaIbu.value || 0);
  const pens = Number(usiaPensiun.value || 0);
  const usia = Number(usiaAnak.value || 0);
  const masuk = Number(usiaMasuk.value || 0);
  const sisaKuliah = masuk - usia;
  const b = [];

  if (usiaA && pens) b.push(pens - usiaA);
  if (usiaI && pens) b.push(pens - usiaI);
  if (sisaKuliah > 0) b.push(sisaKuliah);

  const max = b.length ? Math.min(...b) : 0;
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
  location.href = `mailto:${FP.email}?subject=${encodeURIComponent('Konsultasi Dana Pendidikan')}`;
}

function konsultasiInstagram() {
  window.open(FP.instagramUrl, '_blank');
}

function exportPDF() {
  if (!last) {
    alert('Lengkapi data terlebih dahulu.');
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('Library PDF belum termuat. Pastikan jsPDF ada di pendidikan.html.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const d = last;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 14;
  const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

  const color = {
    navy: [9, 49, 83],
    navy2: [15, 68, 113],
    gold: [197, 150, 54],
    green: [37, 127, 78],
    red: [192, 62, 70],
    soft: [247, 250, 253],
    goldSoft: [255, 249, 235],
    greenSoft: [239, 249, 243],
    redSoft: [255, 241, 242],
    line: [221, 232, 241],
    text: [25, 39, 57],
    muted: [105, 119, 138],
    white: [255, 255, 255]
  };

  const fmt = n => rupiah(Math.round(Number(n || 0))).replace('Rp', 'Rp');
  const cleanName = txt => String(txt || 'Simulasi').replace(/[^a-z0-9_\-]+/gi, '_');
  const bulan = Math.round((d.periode || 0) * 12);
  const periode = `${formatTahun(d.periode)} (${bulan} Bulan)`;
  const danaPercent = d.target > 0 ? Math.max(0, Math.min(100, (d.danaAda / d.target) * 100)) : 0;

  function setFill(c) { doc.setFillColor(...c); }
  function setDraw(c) { doc.setDrawColor(...c); }
  function setText(c) { doc.setTextColor(...c); }
  function font(size, style = 'normal', c = color.text) {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    setText(c);
  }
  function line(x1, y1, x2, y2, c = color.line, w = 0.25) {
    setDraw(c);
    doc.setLineWidth(w);
    doc.line(x1, y1, x2, y2);
  }
  function box(x, y, w, h, fill = color.white, stroke = color.line, r = 5) {
    setFill(fill);
    setDraw(stroke);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, h, r, r, 'FD');
  }
  function wrap(text, x, y, w, size = 7, lineH = 3.6, style = 'normal', c = color.text) {
    font(size, style, c);
    const lines = doc.splitTextToSize(String(text || ''), w);
    doc.text(lines, x, y);
    return y + lines.length * lineH;
  }
  function fit(text, x, y, w, max = 13, min = 6.5, c = color.navy, style = 'bold', align = 'center') {
    let s = max;
    doc.setFont('helvetica', style);
    doc.setFontSize(s);
    while (s > min && doc.getTextWidth(String(text)) > w) {
      s -= 0.3;
      doc.setFontSize(s);
    }
    font(s, style, c);
    doc.text(String(text), x, y, { align });
  }
  function pill(x, y, w, text, fill, c = color.white) {
    setFill(fill);
    setDraw(fill);
    doc.roundedRect(x, y, w, 7, 3.5, 3.5, 'F');
    font(5.6, 'bold', c);
    doc.text(text, x + w / 2, y + 4.8, { align: 'center' });
  }
  function logo(x, y, scale = 1) {
    setDraw(color.navy);
    doc.setLineWidth(1.25 * scale);
    doc.arc(x + 7 * scale, y + 8 * scale, 6.5 * scale, 110, 295, 'S');
    setFill(color.gold);
    doc.roundedRect(x + 8 * scale, y + 4 * scale, 8 * scale, 2.4 * scale, 1, 1, 'F');
    doc.roundedRect(x + 8 * scale, y + 7.3 * scale, 7 * scale, 2.2 * scale, 1, 1, 'F');
    doc.roundedRect(x + 8 * scale, y + 4 * scale, 2.5 * scale, 12 * scale, 1, 1, 'F');
    setFill(color.navy);
    doc.rect(x + 14 * scale, y + 11 * scale, 1.2 * scale, 4.5 * scale, 'F');
    doc.rect(x + 16 * scale, y + 9 * scale, 1.2 * scale, 6.5 * scale, 'F');
    doc.rect(x + 18 * scale, y + 7 * scale, 1.2 * scale, 8.5 * scale, 'F');
    setDraw(color.gold);
    doc.setLineWidth(0.65 * scale);
    doc.line(x + 8 * scale, y + 17 * scale, x + 20 * scale, y + 12 * scale);
  }
  function header(title, subtitle, page) {
    setFill(color.white);
    doc.rect(0, 0, W, 24, 'F');
    logo(M, 5, 0.75);
    font(7.2, 'bold', color.navy);
    doc.text('CERDAS', M + 18, 10.5);
    font(7.2, 'bold', color.gold);
    doc.text('FINANSIAL', M + 18, 16.5);
    font(12.2, 'bold', color.navy);
    doc.text(title, 82, 10.5);
    font(6.8, 'normal', color.muted);
    doc.text(subtitle, 82, 17);
    pill(W - M - 38, 8, 38, `Hal. ${page}/2`, color.goldSoft, color.navy);
    line(M, 23, W - M, 23, color.gold, 0.45);
  }
  function footer(page) {
    const y = H - 13;
    line(M, y - 3, W - M, y - 3, color.line, 0.3);
    font(5.4, 'normal', color.muted);
    doc.text('Disusun oleh', M, y + 1);
    font(6, 'bold', color.navy);
    doc.text(FP.name, M + 18, y + 1);
    font(5.4, 'normal', color.muted);
    doc.text(FP.title, M, y + 5);
    font(5.5, 'normal', color.text);
    doc.text(`WA ${FP.phoneDisplay}`, 102, y + 3);
    doc.text(FP.email, 145, y + 3);
    doc.text(FP.instagramDisplay, 205, y + 3);
    font(5.5, 'bold', color.navy);
    doc.text(`Halaman ${page} dari 2`, W - M, y + 3, { align: 'right' });
  }
  function titleBar(x, y, text) {
    font(8.5, 'bold', color.navy);
    doc.text(text, x, y);
    setFill(color.gold);
    doc.roundedRect(x, y + 2.2, 22, 1.2, 0.5, 0.5, 'F');
  }
  function kv(x, y, label, value, labelW = 42, maxW = 72) {
    font(6.4, 'normal', color.muted);
    doc.text(label, x, y);
    font(6.5, 'bold', color.text);
    doc.text(String(value || '-'), x + labelW, y, { maxWidth: maxW });
  }
  function metric(x, y, w, h, title, value, note, c, fill = color.white) {
    box(x, y, w, h, fill, color.line, 4.5);
    setFill(c);
    doc.roundedRect(x, y, w, 2.3, 1.1, 1.1, 'F');
    font(6.4, 'bold', color.navy);
    doc.text(title, x + 6, y + 10, { maxWidth: w - 12 });
    fit(value, x + w / 2, y + 23, w - 10, 11.2, 6.5, c);
    wrap(note, x + 6, y + 31, w - 12, 5.7, 3.1, 'normal', color.muted);
  }
  function dataAnak(x, y, w, h) {
    box(x, y, w, h, color.white, color.line, 5);
    setFill(color.navy);
    doc.roundedRect(x, y, w, 12, 5, 5, 'F');
    font(7.4, 'bold', color.white);
    doc.text('DATA ANAK', x + 8, y + 8);
    let yy = y + 23;
    kv(x + 8, yy, 'Nama Anak', d.namaAnak); yy += 6;
    kv(x + 8, yy, 'Usia Saat Ini', `${d.usiaAnak} tahun`); yy += 6;
    kv(x + 8, yy, 'Target Pendidikan', d.targetLabel); yy += 6;
    kv(x + 8, yy, 'Biaya Saat Ini', fmt(d.biaya)); yy += 6;
    kv(x + 8, yy, 'Inflasi Pendidikan', `${(d.inflasi * 100).toFixed(1).replace('.0', '')}% / tahun`); yy += 6;
    kv(x + 8, yy, 'Hasil Investasi', d.strategi);
  }
  function targetDana(x, y, w, h) {
    box(x, y, w, h, color.navy, color.navy, 6);
    font(8.5, 'bold', color.white);
    doc.text('KEBUTUHAN DANA', x + w / 2, y + 16, { align: 'center' });
    doc.text(`SAAT USIA ${d.usiaMasuk} TAHUN`, x + w / 2, y + 24, { align: 'center' });
    line(x + 22, y + 31, x + w - 22, y + 31, color.gold, 0.45);
    fit(fmt(d.target), x + w / 2, y + 46, w - 20, 15, 8, color.gold);
    font(6.2, 'normal', color.white);
    doc.text('Estimasi kebutuhan saat target pendidikan dimulai.', x + w / 2, y + 56, { align: 'center', maxWidth: w - 18 });
  }
  function donut(x, y, w, h) {
    box(x, y, w, h, color.white, color.line, 5);
    font(7.6, 'bold', color.navy);
    doc.text('KOMPOSISI KEBUTUHAN DANA', x + 8, y + 10);
    const cx = x + 30;
    const cy = y + 31;
    const r = 18;
    setDraw(color.line);
    doc.setLineWidth(8);
    doc.circle(cx, cy, r, 'S');
    setDraw(color.gold);
    doc.setLineWidth(8);
    let prev = null;
    const end = -90 + danaPercent * 3.6;
    for (let a = -90; a <= end; a += 4) {
      const rad = a * Math.PI / 180;
      const p = [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
      if (prev) doc.line(prev[0], prev[1], p[0], p[1]);
      prev = p;
    }
    setFill(color.white);
    doc.circle(cx, cy, 9, 'F');
    font(8.4, 'bold', color.navy);
    doc.text(`${Math.round(danaPercent)}%`, cx, cy + 2.3, { align: 'center' });

    setFill(color.navy); doc.roundedRect(x + 61, y + 20, 4, 4, 1, 1, 'F');
    font(6, 'bold', color.navy); doc.text('Dana yang sudah ada', x + 69, y + 23.5);
    font(6, 'normal', color.text); doc.text(`${danaPercent.toFixed(1).replace('.0','')}% (${fmt(d.danaAda)})`, x + 69, y + 31, { maxWidth: w - 75 });
    setFill(color.gold); doc.roundedRect(x + 61, y + 41, 4, 4, 1, 1, 'F');
    font(6, 'bold', color.navy); doc.text('Kekurangan dana', x + 69, y + 44.5);
    font(6, 'normal', color.text); doc.text(`${(100 - danaPercent).toFixed(1).replace('.0','')}% (${fmt(d.kurang)})`, x + 69, y + 52, { maxWidth: w - 75 });
  }
  function notes(x, y, w, h) {
    box(x, y, w, h, color.goldSoft, [245, 218, 153], 5);
    font(7.6, 'bold', color.navy);
    doc.text('CATATAN FINANCIAL PLANNER', x + 8, y + 10);
    const arr = [
      'Mulai lebih awal memberi peluang pertumbuhan dana yang lebih optimal.',
      'Hasil investasi dan inflasi dapat berubah dari waktu ke waktu.',
      'Disiplin menabung dan konsisten adalah kunci keberhasilan.',
      'Lakukan evaluasi berkala minimal setiap 6–12 bulan.'
    ];
    let yy = y + 20;
    arr.forEach(t => {
      font(6, 'bold', color.gold); doc.text('✓', x + 8, yy);
      wrap(t, x + 14, yy, w - 20, 6, 3.2, 'normal', color.text);
      yy += 7.8;
    });
  }
  function rec(x, y, w, h, title, value, note, c, fill = color.white) {
    box(x, y, w, h, fill, color.line, 5);
    font(6.5, 'bold', color.navy);
    doc.text(title, x + 7, y + 10, { maxWidth: w - 14 });
    fit(value, x + w / 2, y + 25, w - 12, 11.5, 6.5, c);
    wrap(note, x + 7, y + 33, w - 14, 5.7, 3.1, 'normal', color.muted);
  }
  function strategy(x, y, num, title, body, goal, c) {
    setFill(c); doc.circle(x + 4, y + 4, 4, 'F');
    font(5.5, 'bold', color.white); doc.text(String(num), x + 4, y + 5.8, { align: 'center' });
    font(6.8, 'bold', color.navy); doc.text(title, x + 13, y + 3.5);
    wrap(body, x + 13, y + 10, 68, 5.8, 3.1, 'normal', color.text);
    pill(x + 87, y + 4, 34, goal, color.soft, color.navy);
  }
  function action(x, y, w, h) {
    box(x, y, w, h, color.white, color.line, 5);
    font(7.5, 'bold', color.navy);
    doc.text('ACTION PLAN', x + 8, y + 10);
    const arr = [
      'Mulai investasi sedini mungkin.',
      'Sisihkan dana rutin setiap bulan.',
      'Tingkatkan nominal saat pendapatan naik.',
      'Review rencana minimal 1 tahun sekali.',
      'Lindungi penghasilan orang tua.',
      'Hindari pencairan sebelum target tercapai.'
    ];
    let yy = y + 21;
    arr.forEach(t => {
      font(5.8, 'bold', color.green); doc.text('✓', x + 8, yy);
      wrap(t, x + 14, yy, w - 18, 5.8, 3.1, 'normal', color.text);
      yy += 7.2;
    });
  }
  function cta(x, y, w, h) {
    box(x, y, w, h, color.navy, color.navy, 6);
    font(8.2, 'bold', color.white);
    doc.text('Butuh Strategi yang Lebih Personal?', x + 10, y + 12);
    wrap('Konsultasikan rencana pendidikan agar strategi yang dipilih sesuai dengan kebutuhan dan kondisi keuangan keluarga.', x + 10, y + 22, 105, 6, 3.2, 'normal', color.white);
    line(x + 125, y + 8, x + 125, y + h - 8, color.gold, 0.3);
    font(7.2, 'bold', color.gold); doc.text(FP.name, x + 136, y + 13);
    font(5.8, 'normal', color.white); doc.text(FP.title, x + 136, y + 20);
    font(6, 'normal', color.white); doc.text(`WA ${FP.phoneDisplay}`, x + 136, y + 30);
    doc.text(FP.email, x + 136, y + 38);
    doc.text(FP.instagramDisplay, x + 136, y + 46);
  }

  // PAGE 1
  header('LAPORAN SIMULASI DANA PENDIDIKAN', 'Perencanaan masa depan anak', 1);
  dataAnak(M, 36, 118, 56);
  targetDana(142, 36, W - 142 - M, 56);

  titleBar(M, 105, 'RINGKASAN HASIL SIMULASI');
  const gap = 6;
  const sw = (W - M * 2 - gap * 3) / 4;
  metric(M, 116, sw, 38, 'TOTAL KEBUTUHAN DANA', fmt(d.target), 'Estimasi kebutuhan saat target pendidikan dimulai.', color.navy);
  metric(M + (sw + gap), 116, sw, 38, 'DANA YANG SUDAH ADA', fmt(d.danaAda), 'Dana pendidikan yang sudah tersedia saat ini.', color.green, color.greenSoft);
  metric(M + (sw + gap) * 2, 116, sw, 38, 'KEKURANGAN DANA', fmt(d.kurang), 'Selisih dana yang perlu dipersiapkan.', color.red, color.redSoft);
  metric(M + (sw + gap) * 3, 116, sw, 38, 'SETORAN BULANAN', fmt(d.setor), 'Estimasi dana yang disiapkan setiap bulan.', color.gold, color.goldSoft);

  donut(M, 163, 128, 29);
  notes(148, 163, W - 148 - M, 29);
  footer(1);

  // PAGE 2
  doc.addPage();
  header('REKOMENDASI FINANCIAL PLANNER', 'Langkah strategis untuk mencapai target pendidikan', 2);

  titleBar(M, 38, 'RINGKASAN RENCANA DANA PENDIDIKAN');
  const rw = (W - M * 2 - gap * 2) / 3;
  rec(M, 50, rw, 40, `TARGET DANA USIA ${d.usiaMasuk} TAHUN`, fmt(d.target), 'Total kebutuhan saat target pendidikan dimulai.', color.navy);
  rec(M + rw + gap, 50, rw, 40, 'JANGKA WAKTU PERSIAPAN', periode, 'Sesuai periode persiapan yang dipilih.', color.green, color.greenSoft);
  rec(M + (rw + gap) * 2, 50, rw, 40, 'DANA DISIAPKAN PER BULAN', fmt(d.setor), 'Estimasi komitmen dana setiap bulan.', color.gold, color.goldSoft);

  titleBar(M, 103, 'LANGKAH STRATEGIS');
  box(M, 115, 128, 49, color.white, color.line, 5);
  strategy(M + 10, 125, 1, 'Investasi Jangka Panjang', 'Pilih instrumen investasi yang tepat untuk potensi hasil optimal.', 'Pertumbuhan', color.navy);
  strategy(M + 10, 141, 2, 'Proteksi', 'Lindungi rencana pendidikan dari risiko yang tidak terduga.', 'Keamanan', color.green);
  strategy(M + 10, 157, 3, 'Konsistensi', 'Disiplin menjalankan rencana sampai target pendidikan tercapai.', 'Tujuan', color.gold);

  action(150, 115, W - 150 - M, 49);
  cta(M, 172, W - M * 2, 24);
  footer(2);

  doc.save(`Laporan_Dana_Pendidikan_${cleanName(d.namaAnak)}.pdf`);
}

function resetForm() {
  simulasiForm.reset();
  tahunSekarang.value = new Date().getFullYear();
  document.querySelector('input[name="strategiInvestasi"][value="0.04"]').checked = true;
  updatePeriode();
  kosongkan();
}
