# TripWise AI — AI-Powered Tourism Intelligence Platform

An enterprise-grade Tourism Intelligence and Operations Platform for India connecting tourists, destination managers, hospitality operators, and administrative authorities through an integrated telemetry and predictive forecasting system.

Director: **V J Nithish** (Director, Tourism Operations Command)

---

## 🚀 Key Features

1. **Executive Overview Dashboard**
   - Key Tourism KPIs: Footfall volume, capacity saturation, package yield, active disputes, and quarterly projected revenue.
   - Interactive Republic of India corridor map with real-time crowd risk halos.
   - AI Daily Tourism Intelligence summary briefing.

2. **CrowdSense AI — Crowd Intelligence**
   - Real-time turnstile telemetry and dynamic 24-hour & 7-day ARIMA predictive curves.
   - Capacity utilization bars and ceiling threshold alerts.
   - Root-cause diagnostics with automated traffic dispersal and bus dispatch workflows.

3. **LocalTrip AI — Local Travel Intelligence**
   - Multimodal transit engine (Vande Bharat Express, Volvo buses, private chauffeurs).
   - Cost in INR, travel duration, carbon load (kg CO₂), and reliability scores.
   - Multilingual regional assistant supporting English, Tamil, Hindi, and Malayalam.

4. **RefundResolve AI — Dispute & Complaint Management**
   - SLA countdown tracking (<6h Urgent flags).
   - GenAI dispute summarization, missing evidence detection, and legal defense checks.
   - **Strict Human-in-the-Loop Gateway**: Mandatory supervisor sign-off before executing financial disbursements.

5. **PriceGuard AI — Price Transparency & Auditing**
   - Itemized package ledger (base tariff, accommodation, transit, guide fees, 5% GST).
   - Optical anomaly detection identifying unitemized festival surcharges and hidden cesses.
   - Payout freeze and compliance clearance controls.

6. **SeasonCast AI — Demand Forecasting**
   - 7-day, 30-day, and 90-day predictive horizons.
   - What-If Scenario sandbox (Festival surge sliders, monsoon weather variation, extended holiday weekend multipliers).
   - 95% confidence interval bands with statistical error validation (MAE: 3.8%, R²: 0.96).

7. **Agentic AI Workflow Automation Center**
   - 5 specialized autonomous agents (Crowd Monitoring, Complaint Resolution, Price Audit, Demand Planning, Travel Information).
   - Full lifecycle execution trace from trigger detection to human approval.

8. **Reports & Analytics**
   - Executive Briefing document generator with state corridor filters.
   - Client-side downloadable CSV dataset export and printable PDF layout.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations & Splines**: Smooth SVG Bezier Catmull-Rom engine with real-time telemetry streaming simulation

---

## 💻 Local Development

### 1. Clone & Install
```bash
git clone <your-repository-url>
cd tripwise-ai
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized static production files will be output to the `dist/` folder.

---

## 🌐 One-Click Hosting Options

### Option A: GitHub Pages (Automatic via GitHub Actions)
1. Push this repository to GitHub.
2. Go to **Settings > Pages** in your GitHub repository.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. That's it! The included `.github/workflows/deploy.yml` workflow will automatically build and publish your site whenever you push to `main`.

### Option B: Vercel / Netlify / Cloudflare Pages
1. Push the code to GitHub.
2. In Vercel or Netlify, click **Add New Project** and select your repository.
3. Keep default settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

---

## 🔒 Data & AI Integrity

All simulated turnstile streams, statistical models, and demo agent workflows are labeled in compliance with platform governance standards. Consequential financial disbursements strictly mandate supervisor approval.
