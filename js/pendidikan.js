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
  whatsappDisplay: '0811-6946-999',
  email: 'septinogao@gmail.com',
  instagramUrl: 'https://instagram.com/septino.gao',
  instagramDisplay: '@septino.gao',
  name: 'Septino, QWP®, CIS®',
  title: 'Financial Planner & Insurance Consultant'
};

let last = null;

function el(id) {
  return document.getElementById(id);
}

function initDanaPendidikan() {
  if (!el('simulasiForm')) return;

  el('tahunSekarang').value = new Date().getFullYear();

  allInputs().forEach(input => {
    input.addEventListener('input', () => {
      formatIfMoney(input);
      updatePeriode();
      hitung();
    });
  });

  el('targetPendidikan').addEventListener('change', () => {
    applyTarget();
    updatePeriode();
    hitung();
  });

  el('periodePersiapan').addEventListener('change', () => {
    el('customTahunBox').classList.toggle('d-none', el('periodePersiapan').value !== 'custom');
    hitung();
  });

  document.querySelectorAll('input[name="strategiInvestasi"]').forEach(radio => {
    radio.addEventListener('change', hitung);
  });

  window.exportPDF = exportPDF;
  window.resetForm = resetForm;
  window.konsultasiWhatsApp = konsultasiWhatsApp;
  window.konsultasiEmail = konsultasiEmail;
  window.konsultasiInstagram = konsultasiInstagram;

  updatePeriode();
  kosongkan();
}

document.addEventListener('DOMContentLoaded', initDanaPendidikan);

function allInputs() {
  return [...document.querySelectorAll('#simulasiForm input, #simulasiForm select')];
}

function bersih(value) {
  return Number(String(value || '').replace(/\D/g, '')) || 0;
}

function rupiah(value) {
  return Number(value || 0).toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  });
}

function rupiahCompact(value) {
  return 'Rp' + Number(Math.round(value || 0)).toLocaleString('id-ID');
}

function formatIfMoney(input) {
  if (!input.classList.contains('money-input')) return;
  const raw = String(input.value || '').trim();
  const amount = bersih(raw);
  input.value = raw !== '' ? amount.toLocaleString('id-ID') : '';
}

function formatTahun(value) {
  if (!isFinite(value) || value <= 0) return '0 Tahun';
  const years = Math.floor(value);
  const months = Math.round((value - years) * 12);
  return years + (months ? ` Tahun ${months} Bulan` : ' Tahun');
}

function applyTarget() {
  const selected = TARGETS[el('targetPendidikan').value];
  if (!selected) return;
  if (selected.usia !== '') el('usiaMasuk').value = selected.usia;
  if (selected.lama !== '') el('lamaStudi').value = selected.lama;
}

function getBatas() {
  const usiaAyah = Number(el('usiaAyah').value || 0);
  const usiaIbu = Number(el('usiaIbu').value || 0);
  const pensiun = Number(el('usiaPensiun').value || 0);
  const usiaAnak = Number(el('usiaAnak').value || 0);
  const usiaMasuk = Number(el('usiaMasuk').value || 0);
  const sisaKuliah = usiaMasuk - usiaAnak;

  const limits = [];
  if (usiaAyah && pensiun) limits.push(pensiun - usiaAyah);
  if (usiaIbu && pensiun) limits.push(pensiun - usiaIbu);
  if (sisaKuliah > 0) limits.push(sisaKuliah);

  const max = limits.length ? Math.min(...limits) : 0;
  return { max, sisaKuliah };
}

function updatePeriode() {
  const periodeSelect = el('periodePersiapan');
  const prev = periodeSelect.value;
  const { max, sisaKuliah } = getBatas();
  periodeSelect.innerHTML = '';
  hidePensionWarning();

  if (!isFinite(max) || max <= 0) {
    periodeSelect.innerHTML = '<option value="">Lengkapi data dahulu</option>';
    el('periodeInfo').innerText = 'Isi usia orang tua, usia anak, dan usia masuk pendidikan.';
    el('customTahunBox').classList.add('d-none');
    el('customTahun').removeAttribute('required');
    return;
  }

  [3, 5, 8, 10].forEach(year => {
    if (year <= max) {
      periodeSelect.innerHTML += `<option value="${year}">${year} Tahun</option>`;
    }
  });

  if (sisaKuliah > 0 && sisaKuliah <= max) {
    periodeSelect.innerHTML += `<option value="kuliah">Sampai Anak Masuk Pendidikan (${formatTahun(sisaKuliah)})</option>`;
  }

  if (max >= 10) {
    periodeSelect.innerHTML += '<option value="custom">Custom / Tentukan Sendiri</option>';
  }

  if (!periodeSelect.innerHTML) {
    const year = Math.max(1, Math.floor(max));
    periodeSelect.innerHTML = `<option value="${year}">${year} Tahun</option>`;
  }

  if ([...periodeSelect.options].some(option => option.value === prev)) {
    periodeSelect.value = prev;
  }

  const customTahun = el('customTahun');
  customTahun.max = Math.floor(max);
  el('customTahunBox').classList.toggle('d-none', periodeSelect.value !== 'custom');

  if (periodeSelect.value === 'custom') {
    customTahun.setAttribute('required', 'required');
    customTahun.placeholder = `Maksimal ${Math.floor(max)} tahun`;
  } else {
    customTahun.removeAttribute('required');
    customTahun.classList.remove('is-invalid');
  }

  el('periodeInfo').innerText = `Periode maksimum yang disarankan: ${formatTahun(max)}, berdasarkan sisa waktu pendidikan dan usia pensiun orang tua.`;
  validatePeriodeCustom();
}

function showPensionWarning(message) {
  el('pensionWarning').innerHTML = message;
  el('pensionWarning').classList.remove('d-none');
}

function hidePensionWarning() {
  el('pensionWarning').innerHTML = '';
  el('pensionWarning').classList.add('d-none');
}

function validatePeriodeCustom() {
  const { max } = getBatas();
  const customTahun = el('customTahun');

  if (el('periodePersiapan').value !== 'custom') {
    customTahun.classList.remove('is-invalid');
    hidePensionWarning();
    return true;
  }

  const value = Number(customTahun.value || 0);
  const maxYear = Math.floor(max);

  if (!value) {
    customTahun.classList.remove('is-invalid');
    showPensionWarning(`ℹ️ Masukkan periode custom. Maksimal yang disarankan adalah <strong>${formatTahun(max)}</strong>.`);
    return false;
  }

  if (value > max) {
    customTahun.classList.add('is-invalid');
    showPensionWarning(`⚠️ Periode custom <strong>${value} tahun</strong> melebihi batas aman. Maksimal <strong>${maxYear} tahun</strong>.`);
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
  const value = el('periodePersiapan').value;
  if (value === 'kuliah') return Math.min(sisaKuliah, max);
  if (value === 'custom') return Number(el('customTahun').value || 0);
  return Math.min(Number(value || 0), max);
}

function inflasiNum() {
  return Number(el('inflasi').value || 0) / 100;
}

function rate() {
  return Number(document.querySelector('input[name="strategiInvestasi"]:checked')?.value || 0.04);
}

function strategiLabel() {
  const selectedRate = rate();
  if (selectedRate === 0.02) return 'Konservatif (1–2%)';
  if (selectedRate === 0.06) return 'Agresif (6% ke atas)';
  return 'Moderat (3–5%)';
}

function valid() {
  let ok = true;

  document.querySelectorAll('[required]').forEach(input => {
    let invalid = !String(input.value || '').trim();
    if (input.id === 'customTahun' && el('periodePersiapan').value !== 'custom') invalid = false;
    input.classList.toggle('is-invalid', invalid);
    if (invalid) ok = false;
  });

  if (Number(el('usiaMasuk').value) <= Number(el('usiaAnak').value)) {
    el('usiaMasuk').classList.add('is-invalid');
    ok = false;
  }

  if (!validatePeriodeCustom()) ok = false;
  return ok;
}

function kosongkan() {
  el('sisaWaktu').innerText = '0 Tahun';
  el('danaDibutuhkan').innerText = 'Rp0';
  el('kekuranganDana').innerText = 'Rp0';
  el('setoranBulanan').innerText = 'Rp0';
  el('ringkasanText').innerText = 'Lengkapi semua data wajib untuk melihat hasil simulasi.';
  el('insightOrtu').innerText = 'Lengkapi data orang tua untuk melihat analisis kesiapan sebelum masa pensiun.';
  el('tabelDana').innerHTML = '';
  el('ctaSection').classList.add('d-none');
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

  el('sisaWaktu').innerText = formatTahun(d.sisa);
  el('danaDibutuhkan').innerText = rupiah(target);
  el('kekuranganDana').innerText = rupiah(kurang);
  el('setoranBulanan').innerText = rupiah(setor) + ' / bulan';

  el('ringkasanText').innerHTML = `Target <strong>${d.targetLabel}</strong> untuk ${d.namaAnak} membutuhkan estimasi dana sebesar <strong>${rupiah(target)}</strong> dalam ${formatTahun(d.sisa)}. Dana yang sudah ada ${rupiah(d.danaAda)}, sehingga kekurangan dana sekitar <strong>${rupiah(kurang)}</strong>.`;

  insight(d);
  timeline(d);
  readiness({ ...d, target, kurang, setor });
  el('ctaSection').classList.remove('d-none');
}

function data() {
  const key = el('targetPendidikan').value;
  return {
    namaAyah: el('namaAyah').value.trim(),
    usiaAyah: Number(el('usiaAyah').value),
    namaIbu: el('namaIbu').value.trim(),
    usiaIbu: Number(el('usiaIbu').value),
    usiaPensiun: Number(el('usiaPensiun').value),
    namaAnak: el('namaAnak').value.trim(),
    usiaAnak: Number(el('usiaAnak').value),
    targetLabel: TARGETS[key]?.label || '-',
    usiaMasuk: Number(el('usiaMasuk').value),
    lama: Number(el('lamaStudi').value),
    biaya: bersih(el('biayaSaatIni').value),
    inflasi: inflasiNum(),
    tahun: Number(el('tahunSekarang').value),
    danaAda: bersih(el('danaAda').value),
    catatan: el('catatan').value.trim(),
    rate: rate(),
    strategi: strategiLabel(),
    periode: getPeriode(),
    sisa: Number(el('usiaMasuk').value) - Number(el('usiaAnak').value)
  };
}

function calcSetor(kurang, periode, annualRate) {
  if (kurang <= 0 || periode <= 0) return 0;
  const months = Math.round(periode * 12);
  const monthlyRate = annualRate / 12;
  if (monthlyRate <= 0) return kurang / months;
  return kurang * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
}

function insight(d) {
  const usiaAyahSaatKuliah = d.usiaAyah + d.sisa;
  const usiaIbuSaatKuliah = d.usiaIbu + d.sisa;
  const usiaAyahSelesai = d.usiaAyah + d.periode;
  const usiaIbuSelesai = d.usiaIbu + d.periode;

  const warning = (usiaAyahSelesai > d.usiaPensiun || usiaIbuSelesai > d.usiaPensiun)
    ? '<div class="warning-box">⚠️ Periode persiapan dana melewati usia pensiun. Sistem membatasi pilihan periode agar lebih aman.</div>'
    : '';

  el('insightOrtu').innerHTML = `Saat ${d.namaAnak} masuk ${d.targetLabel}, ${d.namaAyah} diperkirakan berusia <strong>${usiaAyahSaatKuliah} tahun</strong> dan ${d.namaIbu} <strong>${usiaIbuSaatKuliah} tahun</strong>.<br>Dengan periode persiapan ${formatTahun(d.periode)}, usia saat dana ditargetkan terkumpul: ${d.namaAyah} <strong>${usiaAyahSelesai.toFixed(0)} tahun</strong>, ${d.namaIbu} <strong>${usiaIbuSelesai.toFixed(0)} tahun</strong>. ${warning}`;
}

function timeline(d) {
  let html = '';
  for (let i = 0; i <= d.sisa; i++) {
    const dana = d.biaya * Math.pow(1 + d.inflasi, i);
    const naik = ((dana - d.biaya) / d.biaya) * 100;
    html += `<tr><td>${d.tahun + i}</td><td>${d.usiaAnak + i} Tahun</td><td>${rupiah(dana)}</td><td>${naik.toFixed(1)}%</td></tr>`;
  }
  el('tabelDana').innerHTML = html;
}

function getReadinessState(d) {
  const checks = [
    { ok: d.target > 0, text: 'Sudah mengetahui kebutuhan dana' },
    { ok: d.periode > 0, text: 'Sudah memiliki target waktu' },
    { ok: d.setor >= 0 && d.strategi, text: 'Strategi pendanaan sudah disusun' },
    { ok: d.danaAda >= d.target, text: d.danaAda >= d.target ? 'Dana awal sudah mencukupi' : 'Dana awal belum mencukupi' }
  ];

  const score = checks.filter(item => item.ok).length * 25;
  let message = 'Perencanaan baru dimulai, masih banyak aspek yang perlu dipersiapkan.';
  if (score === 100) message = 'Perencanaan sangat baik, pertahankan strategi dan lakukan evaluasi berkala.';
  else if (score >= 75) message = 'Perencanaan sudah baik, fokus pada konsistensi mencapai target.';
  else if (score >= 50) message = 'Perencanaan sudah berjalan, namun masih perlu penyempurnaan.';

  return { score, message, items: checks };
}

function readiness(d) {
  const state = getReadinessState(d);
  el('readinessScore').innerText = state.score + '%';
  el('readinessBar').style.width = state.score + '%';
  el('readinessText').innerText = state.message;
  el('readinessChecklist').innerHTML = state.items.map(item => `
    <div class="readiness-item ${item.ok ? 'checked' : ''}">
      <span>${item.ok ? '✓' : ''}</span>
      <strong>${item.text}</strong>
    </div>
  `).join('');
}

function konsultasiWhatsApp() {
  if (!last) return;
  const d = last;
  const message = `Halo Pak Septino,\n\nSaya baru menggunakan aplikasi Cerdas Finansial dan ingin berkonsultasi mengenai hasil simulasi dana pendidikan.\n\nNama Anak: ${d.namaAnak}\nTarget Pendidikan: ${d.targetLabel}\nDana Dibutuhkan: ${rupiah(d.target)}\nDana Saat Ini: ${rupiah(d.danaAda)}\nKekurangan Dana: ${rupiah(d.kurang)}\nEstimasi Setoran: ${rupiah(d.setor)} / bulan\nPeriode Persiapan: ${formatTahun(d.periode)}\n\nMohon dibantu membuatkan strategi yang sesuai. Terima kasih.`;
  window.open(`https://wa.me/${FP.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
}

function konsultasiEmail() {
  location.href = `mailto:${FP.email}?subject=${encodeURIComponent('Konsultasi Dana Pendidikan')}`;
}

function konsultasiInstagram() {
  window.open(FP.instagramUrl, '_blank');
}

function resetForm() {
  el('simulasiForm').reset();
  el('tahunSekarang').value = new Date().getFullYear();
  const defaultStrategy = document.querySelector('input[name="strategiInvestasi"][value="0.04"]');
  if (defaultStrategy) defaultStrategy.checked = true;
  updatePeriode();
  kosongkan();
}

function exportPDF() {
  try {
    if (!last) {
      alert('Lengkapi data terlebih dahulu sebelum export PDF.');
      return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('Library jsPDF belum termuat. Pastikan koneksi internet aktif dan script jsPDF ada di pendidikan.html.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const d = last;

    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 12;
    const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

    const C = {
      navy: [6, 43, 79],
      navy2: [10, 60, 93],
      gold: [201, 151, 48],
      goldSoft: [255, 248, 232],
      green: [46, 139, 87],
      greenSoft: [240, 249, 244],
      red: [195, 47, 50],
      redSoft: [255, 242, 242],
      ink: [18, 32, 54],
      muted: [96, 112, 132],
      line: [211, 224, 238],
      soft: [247, 250, 253],
      white: [255, 255, 255]
    };

    const cleanName = value => String(value || 'Simulasi').replace(/[^a-z0-9_\-]+/gi, '_');
    const fmt = value => rupiahCompact(Math.round(Number(value || 0)));
    const pctDana = d.target > 0 ? Math.min(100, (d.danaAda / d.target) * 100) : 0;
    const periodText = `${formatTahun(d.periode)} (${Math.round(d.periode * 12)} Bulan)`;

    function setFont(size = 8, style = 'normal', color = C.ink) {
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      doc.setTextColor(...color);
    }

    function setFill(color) { doc.setFillColor(...color); }
    function setStroke(color) { doc.setDrawColor(...color); }

    function round(x, y, w, h, r = 4, fill = C.white, stroke = C.line) {
      setFill(fill); setStroke(stroke); doc.setLineWidth(0.35); doc.roundedRect(x, y, w, h, r, r, 'FD');
    }

    function line(x1, y1, x2, y2, color = C.line, width = 0.25) {
      setStroke(color); doc.setLineWidth(width); doc.line(x1, y1, x2, y2);
    }

    function wrap(text, x, y, w, size = 6.4, lineH = 3.6, color = C.ink, style = 'normal') {
      setFont(size, style, color);
      const lines = doc.splitTextToSize(String(text), w);
      doc.text(lines, x, y);
      return y + lines.length * lineH;
    }

    function fitText(text, x, y, w, maxSize = 12, minSize = 7, color = C.ink, style = 'bold', align = 'center') {
      let size = maxSize;
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      while (size > minSize && doc.getTextWidth(String(text)) > w) {
        size -= 0.35;
        doc.setFontSize(size);
      }
      setFont(size, style, color);
      doc.text(String(text), x, y, { align });
    }

    function circleText(x, y, r, bg, text, color = C.white) {
      setFill(bg); doc.circle(x, y, r, 'F');
      setFont(6.2, 'bold', color);
      doc.text(String(text), x, y + 2.1, { align: 'center' });
    }

    function logo(x, y, scale = 1) {
      setFont(15 * scale, 'bold', C.navy);
      doc.text('C', x, y + 9 * scale);
      setFont(15 * scale, 'bold', C.gold);
      doc.text('F', x + 7 * scale, y + 9 * scale);
      setFont(7.8 * scale, 'bold', C.navy);
      doc.text('CERDAS', x + 18 * scale, y + 4 * scale);
      setFont(7.8 * scale, 'bold', C.gold);
      doc.text('FINANSIAL', x + 18 * scale, y + 11 * scale);
    }

    function header(title, subtitle) {
      logo(M, 7, 1.05);
      setFont(13, 'bold', C.navy);
      doc.text(title, 83, 13);
      setFont(8, 'normal', C.ink);
      doc.text(subtitle, 83, 21);
      setFont(6.5, 'bold', C.navy);
      doc.text('Tanggal Simulasi', W - M - 42, 12);
      setFont(7.2, 'bold', C.ink);
      doc.text(today, W - M - 42, 20);
      line(M, 29, W - M, 29, C.gold, 0.55);
    }

    function footer(page) {
      const y = H - 14;
      line(M, y - 3, W - M, y - 3, C.gold, 0.35);
      setFont(5.6, 'normal', C.muted);
      doc.text('Disusun oleh:', M, y + 1);
      setFont(5.9, 'bold', C.ink);
      doc.text(FP.name, M + 18, y + 1);
      setFont(5.5, 'normal', C.muted);
      doc.text(FP.title, M, y + 5);
      setFont(5.8, 'normal', C.ink);
      doc.text(`WA ${FP.whatsappDisplay}`, 91, y + 3);
      doc.text(FP.email, 137, y + 3);
      doc.text(FP.instagramDisplay, 197, y + 3);
      round(W - M - 28, y - 1.5, 28, 7, 2.5, C.goldSoft, [245, 216, 160]);
      setFont(5.6, 'bold', C.navy);
      doc.text(`Halaman ${page} dari 2`, W - M - 14, y + 3, { align: 'center' });
    }

    function section(x, y, title) {
      setFont(9.2, 'bold', C.navy);
      doc.text(title, x, y);
      setFill(C.gold);
      doc.roundedRect(x, y + 2, 17, 1.2, 0.6, 0.6, 'F');
    }

    function dataAnakCard(x, y, w, h) {
      round(x, y, w, h, 5);
      setFill(C.navy);
      doc.roundedRect(x, y - 6, 43, 11, 3, 3, 'F');
      circleText(x + 7, y - 0.5, 4, C.navy, '●');
      setFont(7.5, 'bold', C.white);
      doc.text('DATA ANAK', x + 16, y + 1.7);
      const rows = [
        ['Nama Anak', d.namaAnak],
        ['Usia Saat Ini', `${d.usiaAnak} tahun`],
        ['Target Pendidikan', d.targetLabel],
        ['Biaya Saat Ini', fmt(d.biaya)],
        ['Inflasi Pendidikan', `${(d.inflasi * 100).toFixed(1).replace('.0', '')}% / tahun`],
        ['Strategi', d.strategi]
      ];
      let yy = y + 12;
      rows.forEach(([label, value]) => {
        setFont(6.5, 'normal', C.ink); doc.text(label, x + 8, yy);
        setFont(6.5, 'bold', C.navy); doc.text(':', x + 58, yy);
        doc.text(String(value || '-'), x + 64, yy, { maxWidth: w - 70 });
        yy += 5.8;
      });
    }

    function kebutuhanCard(x, y, w, h) {
      round(x, y, w, h, 6, C.navy2, C.navy2);
      circleText(x + w / 2, y + 12, 8, C.gold, 'EDU', C.navy);
      setFont(9.2, 'bold', C.white);
      doc.text('KEBUTUHAN DANA', x + w / 2, y + 28, { align: 'center' });
      doc.text(`SAAT USIA ${d.usiaMasuk} TAHUN`, x + w / 2, y + 36, { align: 'center' });
      line(x + 24, y + 43, x + w - 24, y + 43, C.gold, 0.5);
      fitText(fmt(d.target), x + w / 2, y + 57, w - 18, 15.5, 9, C.gold, 'bold');
      wrap('Estimasi kebutuhan saat target pendidikan dimulai.', x + 15, y + 66, w - 30, 6.2, 3.3, C.white);
    }

    function metricCard(x, y, w, h, label, value, note, color) {
      round(x, y, w, h, 5);
      setFill(color);
      doc.roundedRect(x, y, w, 2.5, 1.2, 1.2, 'F');
      setFont(6.8, 'bold', C.navy);
      doc.text(label, x + w / 2, y + 13, { align: 'center', maxWidth: w - 8 });
      fitText(value, x + w / 2, y + 26, w - 10, 11.5, 6.8, color, 'bold');
      wrap(note, x + 6, y + 35, w - 12, 5.8, 3.1, C.ink);
    }

    function donut(x, y, w, h) {
      round(x, y, w, h, 5);
      setFont(8, 'bold', C.navy);
      doc.text('KOMPOSISI DANA', x + 9, y + 11);
      const cx = x + 35;
      const cy = y + 34;
      const r = 23;
      setStroke([217, 227, 237]); doc.setLineWidth(10); doc.circle(cx, cy, r, 'S');
      const steps = Math.max(1, Math.round(pctDana / 2));
      setStroke(C.gold); doc.setLineWidth(10);
      for (let i = 0; i < steps; i++) {
        const a1 = (-90 + i * 2) * Math.PI / 180;
        const a2 = (-90 + (i + 1) * 2) * Math.PI / 180;
        doc.line(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
      }
      setFill(C.white); doc.circle(cx, cy, 12, 'F');
      setFont(11, 'bold', C.navy); doc.text(`${Math.round(pctDana)}%`, cx, cy + 2, { align: 'center' });
      setFont(5.3, 'normal', C.muted); doc.text('Dana Ada', cx, cy + 8, { align: 'center' });
      setFill(C.navy); doc.roundedRect(x + 76, y + 24, 4, 4, 1, 1, 'F');
      setFont(6.4, 'bold', C.navy); doc.text('Dana Sudah Ada', x + 84, y + 27);
      setFont(6.3, 'bold', C.ink); doc.text(`${pctDana.toFixed(1).replace('.0', '')}% (${fmt(d.danaAda)})`, x + 84, y + 36, { maxWidth: w - 90 });
      setFill(C.gold); doc.roundedRect(x + 76, y + 48, 4, 4, 1, 1, 'F');
      setFont(6.4, 'bold', C.muted); doc.text('Kekurangan Dana', x + 84, y + 51);
      setFont(6.3, 'bold', C.gold); doc.text(`${(100 - pctDana).toFixed(1).replace('.0', '')}% (${fmt(d.kurang)})`, x + 84, y + 60, { maxWidth: w - 90 });
    }

    function catatan(x, y, w, h) {
      round(x, y, w, h, 5, C.goldSoft, [245, 216, 160]);
      setFont(8, 'bold', C.navy);
      doc.text('CATATAN SINGKAT', x + 10, y + 11);
      const notes = [
        'Mulai lebih awal memberi peluang pertumbuhan dana lebih optimal.',
        'Hasil investasi dan inflasi dapat berubah dari waktu ke waktu.',
        'Disiplin menabung dan konsisten adalah kunci keberhasilan.',
        'Lakukan evaluasi berkala minimal setiap 6–12 bulan.'
      ];
      let yy = y + 22;
      notes.forEach(note => {
        circleText(x + 9, yy - 2.4, 3, C.gold, '✓');
        wrap(note, x + 17, yy, w - 23, 6.2, 3.3, C.ink);
        yy += 9.2;
      });
    }

    function infoBox(x, y, w, h) {
      round(x, y, w, h, 4, C.soft);
      circleText(x + 9, y + h / 2, 5, C.navy, 'i');
      wrap('Perhitungan ini merupakan estimasi berdasarkan target dana pendidikan, jangka waktu persiapan, asumsi inflasi, dan estimasi hasil investasi yang dimasukkan.', x + 19, y + 7, w - 27, 6.2, 3.3, C.ink);
    }

    function recCard(x, y, w, h, title, value, desc, color, bg = C.white) {
      round(x, y, w, h, 5, bg, color);
      circleText(x + 12, y + 14, 7, color, '');
      setFont(6.7, 'bold', C.navy);
      doc.text(title, x + 25, y + 10, { maxWidth: w - 32 });
      fitText(value, x + w / 2, y + 31, w - 10, 12, 7, color, 'bold');
      wrap(desc, x + 10, y + 41, w - 20, 6, 3.2, C.ink);
    }

    function strategy(x, y, w, num, title, text, goal, color) {
      circleText(x + 5, y + 7, 4.5, color, String(num));
      setFont(7, 'bold', C.navy); doc.text(title, x + 18, y + 6);
      wrap(text, x + 18, y + 14, w - 54, 5.8, 3, C.ink);
      round(x + w - 42, y + 2, 37, 16, 3, C.soft);
      setFont(5.4, 'bold', C.navy); doc.text('Tujuan:', x + w - 24, y + 8, { align: 'center' });
      wrap(goal, x + w - 38, y + 13, 31, 5, 2.7, C.ink, 'bold');
    }

    function actionPlan(x, y, w) {
      setFont(9, 'bold', C.navy); doc.text('3  ACTION PLAN', x, y);
      const actions = [
        'Mulai investasi sedini mungkin.',
        'Sisihkan dana rutin setiap bulan.',
        'Tingkatkan nominal saat pendapatan meningkat.',
        'Review rencana minimal 1 tahun sekali.',
        'Lindungi income orang tua dengan asuransi jiwa.'
      ];
      let yy = y + 10;
      actions.forEach(text => {
        circleText(x + 3, yy - 2.2, 2.8, C.navy, '✓');
        wrap(text, x + 9, yy, w - 10, 6.2, 3.3, C.ink);
        yy += 9.5;
      });
    }

    function cta(x, y, w, h) {
      round(x, y, w, h, 6, C.goldSoft, C.gold);
      circleText(x + 14, y + h / 2, 8, C.gold, 'CF', C.navy);
      setFont(7.2, 'bold', C.navy);
      doc.text('Masa depan anak dimulai dari perencanaan hari ini.', x + 29, y + 9);
      wrap('Konsultasikan rencana pendidikan secara personal agar strategi yang dipilih sesuai kebutuhan dan kondisi keuangan keluarga.', x + 29, y + 17, w * 0.48, 5.8, 3, C.ink);
      line(x + w * 0.64, y + 6, x + w * 0.64, y + h - 6, C.gold, 0.25);
      setFont(6.7, 'bold', C.navy); doc.text('Hubungi Saya:', x + w * 0.68, y + 8);
      setFont(7, 'bold', C.ink); doc.text(FP.name, x + w * 0.68, y + 15);
      setFont(5.8, 'normal', C.muted); doc.text(FP.title, x + w * 0.68, y + 20);
      setFont(5.8, 'normal', C.ink);
      doc.text(`WA ${FP.whatsappDisplay}`, x + w * 0.68, y + 27);
      doc.text(FP.email, x + w * 0.68, y + 33);
      doc.text(FP.instagramDisplay, x + w * 0.68, y + 39);
    }

    // PAGE 1
    header('LAPORAN SIMULASI DANA PENDIDIKAN', 'Perencanaan Masa Depan Anak');
    dataAnakCard(M, 42, 116, 48);
    kebutuhanCard(142, 42, W - M - 142, 48);
    section(M, 104, 'RINGKASAN HASIL SIMULASI');

    const gap = 5;
    const cardW = (W - M * 2 - gap * 3) / 4;
    metricCard(M, 115, cardW, 38, 'TOTAL KEBUTUHAN DANA', fmt(d.target), 'Estimasi kebutuhan saat target pendidikan dimulai.', C.navy);
    metricCard(M + (cardW + gap), 115, cardW, 38, 'DANA YANG SUDAH ADA', fmt(d.danaAda), 'Dana pendidikan yang sudah tersedia saat ini.', C.green);
    metricCard(M + (cardW + gap) * 2, 115, cardW, 38, 'KEKURANGAN DANA', fmt(d.kurang), 'Selisih dana yang perlu dipersiapkan.', C.red);
    metricCard(M + (cardW + gap) * 3, 115, cardW, 38, 'SETORAN BULANAN', fmt(d.setor), 'Estimasi dana yang disiapkan setiap bulan.', C.gold);

    donut(M, 161, 128, 32);
    catatan(146, 161, W - M - 146, 32);
    infoBox(M, 194, W - M * 2, 11);
    footer(1);

    // PAGE 2
    doc.addPage();
    header('REKOMENDASI FINANCIAL PLANNER', 'Langkah strategis untuk masa depan pendidikan anak Anda');
    setFont(9, 'bold', C.navy); doc.text('1  RINGKASAN RENCANA', M + 2, 44);
    const recW = (W - M * 2 - 14) / 3;
    recCard(M, 52, recW, 44, `TARGET DANA USIA ${d.usiaMasuk} TAHUN`, fmt(d.target), 'Total kebutuhan saat target pendidikan dimulai.', C.navy);
    recCard(M + recW + 7, 52, recW, 44, 'JANGKA WAKTU PERSIAPAN', periodText, 'Sesuai periode persiapan yang dipilih.', C.green, C.greenSoft);
    recCard(M + (recW + 7) * 2, 52, recW, 44, 'DANA DISIAPKAN PER BULAN', fmt(d.setor), 'Estimasi komitmen dana setiap bulan.', C.gold, C.goldSoft);
    infoBox(M, 102, W - M * 2, 12);

    setFont(9, 'bold', C.navy); doc.text('2  LANGKAH STRATEGIS', M + 2, 130);
    line(M + 108, 124, M + 108, 176, C.line, 0.3);
    strategy(M, 139, 104, 1, 'INVESTASI JANGKA PANJANG', 'Pilih instrumen investasi yang tepat untuk potensi hasil optimal.', 'Pertumbuhan Dana', C.navy);
    strategy(M, 158, 104, 2, 'PROTEKSI', 'Lindungi rencana pendidikan dari risiko yang tidak terduga.', 'Menjaga Rencana', C.green);
    strategy(M, 177, 104, 3, 'KONSISTENSI', 'Lakukan setoran rutin dan evaluasi berkala.', 'Tujuan Pendidikan', C.gold);
    actionPlan(128, 130, 72);
    cta(M, 170, W - M * 2, 25);
    footer(2);

    doc.save(`Laporan_Dana_Pendidikan_${cleanName(d.namaAnak)}.pdf`);
  } catch (error) {
    console.error(error);
    alert('Export PDF gagal: ' + (error?.message || error));
  }
}
