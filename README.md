# 🦷 D Care Dental — Smile Design & Implant Clinic

**Website:** Clean, modern, production-ready dental clinic website  
**Location:** Junnasandra, Sarjapur Main Road, Bengaluru  
**Rating:** 4.9 ⭐ (159 Reviews)

---

## 📁 File Structure

```
dcare-dental/
├── index.html          ← Main website (all sections)
├── style.css           ← All styles (mobile-first, responsive)
├── script.js           ← Navbar, form validation, smooth scroll
├── api/
│   └── contact.js      ← Vercel serverless function (POST /api/contact)
├── vercel.json         ← Vercel deployment configuration
└── README.md           ← This file
```

---

## 🚀 Deployment

### 1. Run Locally

You need Node.js installed. Use the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm install -g vercel
cd dcare-dental
vercel dev
```

Open `http://localhost:3000` — the form will hit `/api/contact` via Vercel's local dev server.

> **No build step needed.** Pure HTML/CSS/JS frontend.

---

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — D Care Dental website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dcare-dental.git
git push -u origin main
```

---

### 3. Deploy on Vercel

**Option A — Vercel CLI:**
```bash
vercel --prod
```

**Option B — Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework: **Other** (no build config needed)
4. Click Deploy ✅

---

## 📧 Enable Real Email Notifications

To receive form submissions by email, in Vercel → Project Settings → **Environment Variables**, add:

| Variable         | Value                       |
|------------------|-----------------------------|
| `SMTP_HOST`      | `smtp.gmail.com`            |
| `SMTP_PORT`      | `587`                       |
| `SMTP_USER`      | `your@gmail.com`            |
| `SMTP_PASS`      | `your_app_password`         |
| `CLINIC_EMAIL`   | `info@dcaredental.in`       |

Then uncomment the **nodemailer** block in `api/contact.js`.

> For Gmail, use an [App Password](https://myaccount.google.com/apppasswords) (not your main password).

---

## 🔔 Enable Slack/WhatsApp Notifications (Optional)

Set `SLACK_WEBHOOK_URL` in your Vercel env vars and uncomment the webhook block in `api/contact.js`.

---

## ✨ Features

- ✅ Fully responsive — mobile-first design
- ✅ Sticky navbar with scroll effect
- ✅ Smooth scrolling & active link highlighting
- ✅ Hero with animated illustration
- ✅ Services grid with hover effects
- ✅ About section with floating stat cards
- ✅ Patient reviews section (5 testimonials)
- ✅ Contact form with real-time validation
- ✅ Vercel serverless API backend
- ✅ SEO meta tags
- ✅ Back-to-top button
- ✅ Mobile hamburger menu
- ✅ Security headers via vercel.json

---

## 📞 Contact Info in the Website

| Field        | Value                                         |
|--------------|-----------------------------------------------|
| Address      | Junnasandra, Sarjapur Main Rd, Bengaluru      |
| Phone        | 096328 24080                                  |
| Hours        | Mon–Sat 9AM–8PM · Sun 10AM–2PM               |

---

## 🛠 Customisation

- **Colors** — edit CSS variables in `:root` inside `style.css`
- **Content** — all text is in `index.html`; search and replace
- **Add real Google reviews** — replace the hardcoded testimonials in `index.html` with your actual Google reviews
- **Add Google Maps embed** — add an `<iframe>` in the contact section

---

Made with ❤️ for D Care Dental, Bengaluru.
