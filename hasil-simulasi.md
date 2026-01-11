# 📊 Laporan Analisis Simulasi Vending Machine (Data Excel)
**Tanggal Pengujian:** 12 Januari 2026
**Sumber Data:** Export Spreadsheet (`uploaded_image_*.png`)

---

## 1. ⚙️ Konfigurasi Parameter & Observasi

Berdasarkan data _spreadsheet_ yang dianalisis, simulasi berjalan dengan karakteristik beban tinggi. Pola kedatangan dan pelayanan menunjukkan sistem mengalami penumpukan antrian yang signifikan mulai dari pelanggan ke-8 hingga ke-30.

| Parameter Observasi | Estimasi Nilai | Keterangan |
|---------------------|----------------|------------|
| **Total Sampel (N)** | `30` pelanggan | Data terlihat sampai baris 30 |
| **Durasi Total** | `40.90` menit | Waktu selesai service pelanggan terakhir |
| **Peak Queue Time** | `12.66` menit | Terjadi pada Pelanggan #24 |
| **Kondisi Sistem** | 🔴 **Overloaded** | Waktu tunggu sangat tinggi (>10 menit) |

---

## 2. 📈 Hasil Statistik (Analisis Data Real)

Ringkasan performa berdasarkan data Excel:

### Metrik Waktu Ekstrim
| Metrik | Nilai (Menit) | Analisis |
|--------|---------------|----------|
| **Waktu Sistem Tertinggi ($W_{max}$)** | `13.80` menit | Pelanggan #14 menghabiskan waktu paling lama di sistem. |
| **Waktu Antri Tertinggi ($Wq_{max}$)** | `12.66` menit | Pelanggan #24 harus menunggu lebih dari 12 menit! |
| **Waktu Service Terlama** | `4.59` menit | Pelanggan #6 memacetkan sistem dengan service time 4.59 menit. |
| **Waktu Service Tercepat** | `0.05` menit | Pelanggan #4 dilayani sangat cepat. |

> **Insight:** Terjadi lonjakan waktu antrian yang drastis mulai Pelanggan #9 (5.45 menit) ke Pelanggan #10 (10.70 menit). Ini kemungkinan disebabkan oleh akumulasi service time yang panjang pada pelanggan sebelumnya (terutama #6 dan #3).

---

## 3. ⏱️ Log Detil Sampel Pelanggan

Berikut adalah ekstraksi data untuk beberapa pelanggan kunci dari spreadsheet:

| No. | Arr Time | Begin Service | Dep Time | Time in Queue | Time in System | Status |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| #1 | 0.00 | 0.00 | 0.28 | **0.00** | 0.28 | ✅ Cepat |
| #3 | 1.11 | 1.11 | 4.75 | **0.00** | 3.64 | ⚠️ Lama Dilayani |
| #6 | 5.56 | 7.05 | 11.64 | **1.48** | 6.07 | ⚠️ Macet Awal |
| #10 | 10.68 | 21.39 | 21.46 | **10.70** | 10.78 | 🔴 Sangat Lama |
| #15 | 15.28 | 26.78 | 28.88 | **11.50** | 13.60 | 🔴 Overload |
| #24 | 24.81 | 37.48 | 37.94 | **12.66** | 13.12 | 🔴 Puncak Antrian |
| #30 | 28.95 | 39.52 | 40.90 | **10.56** | 11.94 | 🔴 Akhir Sesi |

---

## 4. 🔍 Analisis Bottleneck

Mengapa sistem menjadi **Overloaded**?

1.  **Pemicu Awal (Trigger):**
    - **Pelanggan #3:** Memiliki service time `3.64` menit. Ini mulai menahan antrian.
    - **Pelanggan #6:** Memiliki service time ekstrim `4.59` menit. Hal ini menyebabkan "efek bola salju". Saat Pelanggan #6 selesai di menit 11.64, Pelanggan #10 (yang datang menit 10.68) sudah menumpuk di belakang 3 orang lainnya.

2.  **Efek Domino:**
    - Setelah menit ke-10, *Time in Queue* konsisten berada di atas 10 menit.
    - Kecepatan pelayanan ($\mu$) untuk beberapa pelanggan berikutnya cukup cepat (misal #10 hanya 0.07 menit), tetapi karena *backlog* sudah terlalu besar, antrian tidak kunjung surut hingga akhir simulasi.

---

## 5. 💡 Kesimpulan & Rekomendasi

Skenario ini menunjukkan bahaya variabilitas tinggi (*high variability*) dalam sistem antrian. Meskipun mungkin rata-rata pelayanan cepat, satu atau dua pelanggan yang lambat (#3 dan #6) dapat menghancurkan performa sistem untuk waktu yang lama.

**Rekomendasi Khusus:**
1.  **Batasi Waktu Transaksi Maksimum:** Jika vending machine memiliki batas waktu transaksi (timeout) misal 2 menit, antrian ekstrim akibat Pelanggan #6 (4.59 menit) bisa dihindari.
2.  **Maintenance:** Pastikan tidak ada eror pada mesin yang menyebabkan satu pelanggan memakan waktu hingga > 4 menit.
