# 📘 Dokumentasi Teknis Proyek QueueQuest
## Simulasi Sistem Antrian M/M/1 pada Vending Machine

---

## 📑 Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Landasan Teori](#2-landasan-teori)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Backend (vending-be)](#4-backend-vending-be)
5. [Frontend (vending-fe)](#5-frontend-vending-fe)
6. [Alur Kerja Simulasi](#6-alur-kerja-simulasi)
7. [Integrasi Google Sheets](#7-integrasi-google-sheets)
8. [Panduan Instalasi](#8-panduan-instalasi)
9. [Referensi](#9-referensi)

---

## 1. Pendahuluan

### 1.1 Latar Belakang

**QueueQuest: The Vending Machine Challenge** adalah aplikasi simulasi web interaktif yang memvisualisasikan teori antrian (Queueing Theory) menggunakan studi kasus Vending Machine. Proyek ini dirancang untuk membantu pemahaman konsep Riset Operasi, khususnya model antrian M/M/1, dengan pendekatan yang menarik dan interaktif menggunakan tema **Pixel Art**.

### 1.2 Tujuan Proyek

1. **Edukasi**: Memberikan pemahaman visual tentang cara kerja sistem antrian M/M/1
2. **Simulasi**: Mengimplementasikan simulasi Monte Carlo untuk menghasilkan data antrian yang realistis
3. **Analisis**: Membandingkan hasil simulasi dengan nilai teoritis M/M/1
4. **Visualisasi**: Menampilkan animasi real-time pelanggan yang mengantri di depan vending machine
5. **Gamifikasi**: Menambahkan elemen game seperti skor, badge, dan leaderboard untuk meningkatkan engagement

### 1.3 Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Quick Presets** | Skenario simulasi siap pakai (Rush Hour, Relaxed Park, Overloaded, Efficient) |
| **Real-time Chart** | Grafik panjang antrian vs waktu yang dinamis |
| **Pixel Art Animation** | Visualisasi karakter mengantri dengan background dinamis |
| **Statistik Lengkap** | Perbandingan hasil simulasi vs nilai teoritis |
| **Leaderboard** | Papan peringkat berdasarkan efisiensi sistem |
| **Export to Sheets** | Integrasi dengan Google Sheets untuk menyimpan data |

---

## 2. Landasan Teori

### 2.1 Model Antrian M/M/1

Model M/M/1 adalah model antrian paling dasar dalam teori antrian dengan karakteristik:

- **M** (Markovian): Waktu antar kedatangan berdistribusi eksponensial
- **M** (Markovian): Waktu pelayanan berdistribusi eksponensial  
- **1**: Satu server (satu vending machine)

### 2.2 Parameter Input

| Simbol | Nama | Deskripsi |
|--------|------|-----------|
| λ (lambda) | Arrival Rate | Rata-rata jumlah pelanggan yang datang per satuan waktu |
| μ (mu) | Service Rate | Rata-rata jumlah pelanggan yang dapat dilayani per satuan waktu |
| ρ (rho) | Utilization | Tingkat utilisasi sistem (ρ = λ/μ), harus < 1 untuk sistem stabil |
| N | Num Customers | Jumlah pelanggan yang akan disimulasikan |

### 2.3 Rumus Teoritis M/M/1

Untuk sistem M/M/1 yang stabil (ρ < 1), nilai-nilai teoritis dapat dihitung:

**Rata-rata Waktu Tunggu dalam Antrian (Wq):**
```
Wq = ρ² / (μ × (1 - ρ)) = λ / (μ × (μ - λ))
```

**Rata-rata Waktu dalam Sistem (W):**
```
W = 1 / (μ - λ)
```

**Rata-rata Panjang Antrian (Lq):**
```
Lq = ρ² / (1 - ρ) = λ² / (μ × (μ - λ))
```

**Rata-rata Jumlah Pelanggan dalam Sistem (L):**
```
L = ρ / (1 - ρ) = λ / (μ - λ)
```

### 2.4 Simulasi Monte Carlo

Simulasi Monte Carlo digunakan untuk menghasilkan bilangan acak dan waktu:

**Interarrival Time (X1):**
```javascript
X1 = -ln(U1) / λ
```
Di mana U1 adalah bilangan acak uniform [0, 1]

**Service Time (X2):**
```javascript
X2 = -ln(U2) / μ
```
Di mana U2 adalah bilangan acak uniform [0, 1]

---

## 3. Arsitektur Sistem

### 3.1 Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    FRONTEND (Astro + Preact)                │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │ │
│  │  │ SimulationForm│  │QueueAnimation│  │ ResultsSection   │  │ │
│  │  │ (Parameter)   │  │ (Visualisasi)│  │ (Statistik)      │  │ │
│  │  └──────┬───────┘  └──────────────┘  └──────────────────┘  │ │
│  │         │                   ▲                   ▲          │ │
│  │         │                   │                   │          │ │
│  │         ▼                   │                   │          │ │
│  │  ┌──────────────────────────┴───────────────────┘          │ │
│  │  │              simulationStore (State Management)         │ │
│  │  └────────────────────────┬────────────────────────────────┘ │
│  └───────────────────────────┼──────────────────────────────────┘ │
│                              │ HTTP Request (POST /api/simulate) │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js + Express)                  │
│  ┌────────────────┐    ┌─────────────────┐    ┌────────────────┐ │
│  │  routes/       │───▶│  services/      │───▶│  Google Sheets │ │
│  │  simulate.js   │    │  simulator.js   │    │  API           │ │
│  │                │    │  googleSheets.js│    │                │ │
│  └────────────────┘    └─────────────────┘    └────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Teknologi yang Digunakan

**Frontend (`vending-fe`):**
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Astro | 5.x | Framework untuk static site generation |
| Preact | 10.x | UI library ringan untuk komponen interaktif |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Lucide Icons | - | Icon library |
| TypeScript | 5.x | Type-safe JavaScript |

**Backend (`vending-be`):**
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.x | Web framework |
| googleapis | 144.x | Google Sheets API client |
| dotenv | - | Environment variables |
| cors | - | Cross-Origin Resource Sharing |

---

## 4. Backend (vending-be)

### 4.1 Struktur Direktori

```
vending-be/
├── index.js              # Entry point aplikasi
├── routes/
│   └── simulate.js       # Route handlers untuk API
├── services/
│   ├── simulator.js      # Logic simulasi M/M/1
│   └── googleSheets.js   # Integrasi Google Sheets
├── credentials.json      # Google Service Account credentials
├── .env                  # Environment variables
└── package.json
```

### 4.2 API Endpoints

#### 4.2.1 POST /api/simulate

**Deskripsi:** Menjalankan simulasi antrian M/M/1

**Request Body:**
```json
{
  "lambda": 0.8,
  "mu": 1.0,
  "numCustomers": 30,
  "playerName": "Player1",
  "saveToSheets": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Simulation completed successfully",
  "simulation": {
    "parameters": {
      "lambda": 0.8,
      "mu": 1.0,
      "numCustomers": 30,
      "utilization": 0.8
    },
    "simulationData": [...],
    "statistics": {
      "avgInterarrivalTime": 1.2345,
      "avgServiceTime": 0.9876,
      "avgTimeInQueue": 2.3456,
      "avgTimeInSystem": 3.3332
    },
    "theoretical": {
      "avgQueueTime": 3.2,
      "avgSystemTime": 5.0,
      "avgQueueLength": 2.56,
      "avgSystemLength": 4.0
    },
    "score": 75,
    "badge": {
      "name": "Queue Master",
      "description": "Bagus! Waktu antrian cukup pendek."
    }
  }
}
```

#### 4.2.2 GET /api/leaderboard

**Deskripsi:** Mengambil data leaderboard

**Query Parameters:**
- `limit` (optional): Jumlah data yang diambil (default: 10)

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "name": "Player1",
      "avgQueueTime": 1.5,
      "score": 85,
      "timestamp": "12/01/2026, 10:30:45"
    }
  ]
}
```

#### 4.2.3 POST /api/export-to-sheets

**Deskripsi:** Export data simulasi ke Google Sheets custom

**Request Body:**
```json
{
  "sheetId": "1ABC...xyz",
  "simulationData": [...],
  "statistics": {...}
}
```

### 4.3 Service: simulator.js

#### 4.3.1 Linear Congruential Generator (LCG)

Fungsi untuk menghasilkan bilangan acak pseudo-random:

```javascript
function createRandomGenerator(seed = Date.now()) {
  let state = seed;
  const a = 1664525;      // multiplier
  const c = 1013904223;   // increment
  const m = Math.pow(2, 32); // modulus
  
  return function() {
    state = (a * state + c) % m;
    return state / m;  // Normalize ke [0, 1]
  };
}
```

**Parameter LCG:**
- a = 1664525 (multiplier)
- c = 1013904223 (increment)  
- m = 2³² (modulus)

Formula: `Xₙ₊₁ = (aXₙ + c) mod m`

#### 4.3.2 Inverse Transform Method

Menggunakan metode inverse transform untuk menghasilkan distribusi eksponensial:

```javascript
// Interarrival Time dengan distribusi eksponensial
function generateInterarrivalTime(U, lambda) {
  return -Math.log(U) / lambda;
}

// Service Time dengan distribusi eksponensial
function generateServiceTime(U, mu) {
  return -Math.log(U) / mu;
}
```

#### 4.3.3 Algoritma Simulasi

```javascript
function runSimulation({ lambda, mu, numCustomers, seed1, seed2 }) {
  const results = [];
  let previousArrivalTime = 0;
  let previousDepartureTime = 0;

  for (let i = 1; i <= numCustomers; i++) {
    // 1. Generate random numbers
    const U1 = randomStream1();
    const U2 = randomStream2();

    // 2. Hitung interarrival dan service time
    const interarrivalTime = i === 1 ? 0 : generateInterarrivalTime(U1, lambda);
    const serviceTime = generateServiceTime(U2, mu);

    // 3. Hitung waktu-waktu penting
    const arrivalTime = previousArrivalTime + interarrivalTime;
    const beginServiceTime = Math.max(arrivalTime, previousDepartureTime);
    const departureTime = beginServiceTime + serviceTime;

    // 4. Hitung metrik antrian
    const timeInQueue = beginServiceTime - arrivalTime;
    const timeInSystem = departureTime - arrivalTime;

    // 5. Update untuk pelanggan berikutnya
    previousArrivalTime = arrivalTime;
    previousDepartureTime = departureTime;
  }
}
```

#### 4.3.4 Sistem Skor dan Badge

**Perhitungan Skor:**
```javascript
function calculateScore(avgQueueTime) {
  const targetTime = 2; // Target: 2 menit
  const maxScore = 100;
  
  // Formula eksponensial decay
  const score = maxScore * Math.exp(-avgQueueTime / targetTime);
  return Math.round(Math.max(0, Math.min(maxScore, score)));
}
```

**Badge Levels:**

| Badge | Emoji | Waktu Antrian | Deskripsi |
|-------|-------|---------------|-----------|
| Vending Hero | 🏆 | < 2 menit | Luar biasa! |
| Queue Master | ⭐ | 2-4 menit | Bagus! |
| Efficiency Pro | 📊 | 4-6 menit | Efisien |
| Crowd Manager | 👥 | 6-10 menit | Perlu ditingkatkan |
| Needs Improvement | ⚠️ | > 10 menit | Perlu optimasi |

---

## 5. Frontend (vending-fe)

### 5.1 Struktur Direktori

```
vending-fe/
├── src/
│   ├── components/
│   │   ├── Badge.tsx           # Komponen display badge
│   │   ├── Footer.tsx          # Footer halaman
│   │   ├── HeroSection.tsx     # Hero section dengan karakter
│   │   ├── Leaderboard.tsx     # Papan peringkat
│   │   ├── Navbar.tsx          # Navigasi
│   │   ├── QueueAnimation.tsx  # Animasi antrian pixel art
│   │   ├── QueueChart.tsx      # Grafik antrian
│   │   ├── ResultsSection.tsx  # Hasil simulasi
│   │   ├── ResultsTable.tsx    # Tabel data simulasi
│   │   ├── SimulationForm.tsx  # Form input parameter
│   │   ├── logic/
│   │   │   └── CharacterClick.tsx  # Logic click karakter
│   │   └── stores/
│   │       └── simulationStore.ts  # State management
│   ├── layouts/
│   │   └── Layout.astro        # Layout utama
│   └── pages/
│       └── index.astro         # Halaman utama
├── public/
│   └── assets/
│       ├── background/         # Background pixel art
│       │   ├── efficient.svg
│       │   ├── overloaded.svg
│       │   ├── park.svg
│       │   └── rush_hour.svg
│       ├── character/          # Karakter animasi
│       └── hero/              # Hero characters
└── tailwind.config.mjs
```

### 5.2 State Management

Proyek ini menggunakan **custom store pattern** sederhana tanpa library eksternal:

```typescript
// simulationStore.ts
export interface SimulationState {
  results: SimulationResult | null;
  isLoading: boolean;
  isSimulating: boolean;
  error: string | null;
  currentCustomerIndex: number;
  selectedPreset: string | null;
}

export const simulationStore = {
  getState: () => ({ ...state }),
  subscribe: (callback) => { /* ... */ },
  setResults: (results) => { /* ... */ },
  setSelectedPreset: (preset) => { /* ... */ },
  // ...
};
```

### 5.3 Komponen Utama

#### 5.3.1 SimulationForm.tsx

**Fungsi:** Form input parameter simulasi dengan Quick Presets

**Quick Presets:**
| Preset | λ | μ | Customers | Background |
|--------|---|---|-----------|------------|
| Rush Hour | 0.8 | 1.0 | 30 | rush_hour.svg |
| Relaxed Park | 0.3 | 0.6 | 15 | park.svg |
| Overloaded | 0.9 | 1.0 | 25 | overloaded.svg |
| Efficient | 0.4 | 1.2 | 20 | efficient.svg |

#### 5.3.2 QueueAnimation.tsx

**Fungsi:** Visualisasi animasi antrian pixel art

**Fitur:**
- Background dinamis berdasarkan preset yang dipilih
- Animasi karakter berjalan dan mengantri
- Scene badge yang menunjukkan kondisi antrian
- Kontrol play/pause dan kecepatan animasi
- Efek scanline retro

**Logika Pemilihan Background:**
```typescript
const getBackgroundImage = () => {
  // Prioritas 1: Gunakan preset yang dipilih user
  if (state.selectedPreset) {
    switch (state.selectedPreset) {
      case 'Rush Hour': return BACKGROUNDS.rush_hour;
      case 'Efficient': return BACKGROUNDS.efficient;
      case 'Relaxed Park': return BACKGROUNDS.park;
      case 'Overloaded': return BACKGROUNDS.overloaded;
    }
  }
  
  // Prioritas 2: Deteksi otomatis berdasarkan statistik
  // ...
};
```

#### 5.3.3 ResultsSection.tsx

**Fungsi:** Menampilkan hasil simulasi dalam berbagai format

**Tab yang tersedia:**
1. **Statistik**: Parameter input, hasil simulasi, nilai teoritis, perbandingan
2. **Tabel**: Data lengkap setiap pelanggan
3. **Chart**: Grafik panjang antrian vs waktu
4. **Leaderboard**: Papan peringkat

### 5.4 Styling dan Animasi

#### 5.4.1 CSS Custom untuk Pixel Art

```css
/* Pixel Art Rendering */
.pixel-art {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

/* Pixel Character Bounce */
.pixel-character {
  animation: pixelBounce 2s ease-in-out infinite;
}

@keyframes pixelBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* Scanline Effect */
.scanlines::before {
  content: "";
  position: absolute;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1) 0px,
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
}
```

---

## 6. Alur Kerja Simulasi

### 6.1 Diagram Alur

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. User memilih Quick Preset atau input parameter manual        │
│     - Lambda (λ): Arrival rate                                   │
│     - Mu (μ): Service rate                                       │
│     - N: Jumlah pelanggan                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Frontend mengirim request ke Backend                         │
│     POST /api/simulate                                           │
│     { lambda, mu, numCustomers, playerName }                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Backend menjalankan simulasi Monte Carlo                     │
│     ┌──────────────────────────────────────────────────────┐    │
│     │ FOR each customer i = 1 to N:                         │    │
│     │   • Generate U1, U2 (random uniform [0,1])            │    │
│     │   • X1 = -ln(U1)/λ (interarrival time)               │    │
│     │   • X2 = -ln(U2)/μ (service time)                    │    │
│     │   • Calculate: arrival, begin service, departure     │    │
│     │   • Calculate: time in queue, time in system         │    │
│     └──────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Backend menghitung statistik dan nilai teoritis              │
│     • Avg Interarrival Time                                      │
│     • Avg Service Time                                           │
│     • Avg Time in Queue (simulasi vs teori)                      │
│     • Avg Time in System (simulasi vs teori)                     │
│     • Score dan Badge                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Backend menyimpan ke Google Sheets (opsional)                │
│     • Simulation Results sheet                                   │
│     • Leaderboard sheet                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Frontend menerima response dan update state                  │
│     simulationStore.setResults(data)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. UI diupdate secara reaktif                                   │
│     • QueueAnimation: Menampilkan animasi antrian               │
│     • ResultsSection: Menampilkan statistik                      │
│     • QueueChart: Menampilkan grafik                             │
│     • Badge: Menampilkan pencapaian                              │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Contoh Perhitungan

**Input:**
- λ = 0.5 pelanggan/menit
- μ = 0.8 pelanggan/menit
- N = 5 pelanggan

**Proses Simulasi (contoh):**

| Customer | U1 | X1 (Interarrival) | U2 | X2 (Service) | Arrival | Begin Service | Departure | Queue Time | System Time |
|----------|----|--------------------|----|--------------|---------|--------------:|----------:|----------:|------------:|
| 1 | - | 0 | 0.3241 | 1.4073 | 0 | 0 | 1.4073 | 0 | 1.4073 |
| 2 | 0.7521 | 0.5698 | 0.1823 | 2.1245 | 0.5698 | 1.4073 | 3.5318 | 0.8375 | 2.9620 |
| 3 | 0.4123 | 1.7712 | 0.5612 | 0.7227 | 2.3410 | 3.5318 | 4.2545 | 1.1908 | 1.9135 |
| 4 | 0.8901 | 0.2328 | 0.8234 | 0.2427 | 2.5738 | 4.2545 | 4.4972 | 1.6807 | 1.9234 |
| 5 | 0.2345 | 2.9012 | 0.4521 | 0.9932 | 5.4750 | 5.4750 | 6.4682 | 0 | 0.9932 |
| **Avg** | - | **1.3688** | - | - | - | - | - | **0.7418** | **1.8399** |

**Perbandingan dengan Teoritis:**

| Metrik | Simulasi | Teoritis | Selisih |
|--------|----------|----------|---------|
| Avg Queue Time (Wq) | 0.7418 | 1.5625 | -52.5% |
| Avg System Time (W) | 1.8399 | 3.3333 | -44.8% |

*Catatan: Selisih normal terjadi karena ukuran sampel kecil (N=5). Dengan N yang lebih besar, hasil simulasi akan mendekati nilai teoritis.*

---

## 7. Integrasi Google Sheets

### 7.1 Konfigurasi

1. Buat Service Account di Google Cloud Console
2. Enable Google Sheets API
3. Download credentials JSON
4. Share spreadsheet ke email service account

### 7.2 Environment Variables

```env
GOOGLE_SHEETS_CREDENTIALS=./credentials.json
GOOGLE_SHEET_ID=your_spreadsheet_id_here
PORT=3001
```

### 7.3 Struktur Spreadsheet

**Sheet 1: Simulation Results**
| Customer # | U1 | X1 | U2 | X2 | Arrival | Arrival (Jam) | Begin Service | Begin (Jam) | Service Time | Departure | Departure (Jam) | Queue Time | System Time |
|------------|----|----|----|----|---------|---------------|---------------|-------------|--------------|-----------|-----------------|------------|-------------|

**Sheet 2: Leaderboard**
| Nama | Avg Queue Time (menit) | Score | Badge | Timestamp |
|------|------------------------|-------|-------|-----------|

---

## 8. Panduan Instalasi

### 8.1 Prasyarat

- Node.js v18 atau lebih baru
- NPM atau PNPM
- Google Cloud account (untuk integrasi Sheets)

### 8.2 Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/username/queue-quest.git
cd queue-quest

# 2. Setup Backend
cd vending-be
npm install
cp .env.example .env
# Edit .env sesuai konfigurasi
npm run dev

# 3. Setup Frontend (terminal baru)
cd vending-fe
npm install
npm run dev
```

### 8.3 Akses Aplikasi

- Frontend: http://localhost:4321
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

---

## 9. Referensi

1. **Teori Antrian M/M/1**
   - Gross, D., & Shortle, J. F. (2008). *Fundamentals of Queueing Theory*. John Wiley & Sons.

2. **Simulasi Monte Carlo**
   - Law, A. M. (2015). *Simulation Modeling and Analysis*. McGraw-Hill Education.

3. **Linear Congruential Generator**
   - Knuth, D. E. (1997). *The Art of Computer Programming, Volume 2: Seminumerical Algorithms*. Addison-Wesley.

4. **Teknologi Frontend**
   - Astro Documentation: https://docs.astro.build
   - Preact Documentation: https://preactjs.com/guide
   - Tailwind CSS: https://tailwindcss.com/docs

5. **Teknologi Backend**
   - Express.js: https://expressjs.com
   - Google Sheets API: https://developers.google.com/sheets/api

---

**📌 Catatan:**
Dokumentasi ini dibuat untuk proyek QueueQuest versi 1.0.0. Untuk informasi terbaru, silakan merujuk ke repository GitHub proyek.

---
