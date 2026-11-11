# Opliora Private Limited — Official Corporate Platform

> **"A Group of Businesses. One Vision."**  
> *"Building Businesses. Shaping Tomorrow."*

Official corporate web platform and business showcase for **Opliora Private Limited**, a diversified parent company with multi-industry business interests.

---

## ✦ Overview

Opliora Private Limited operates as a diversified parent company committed to building meaningful ventures, creating long-term value, and delivering sustainable growth across industries.

This repository contains the production source code for the public corporate platform, featuring:
- **WebGL Kinetic 3D Hero:** Custom Three.js geometry with GLSL shaders (Fresnel rim lighting, iridescent shimmer wave, interactive mouse parallax).
- **GSAP ScrollTrigger Storytelling:** Pinned narrative sequences and smooth scroll orchestration powered by Lenis.
- **Dedicated Feedo Delivery Brand Experience:** Fully internalized showcase (`#business` and `#feedo-details`) highlighting Feedo Delivery's logistics, merchant network, and customer experience without external fragmentation.
- **Secure Contact & Communications API:** Node.js / Vercel Serverless contact endpoint with anti-spam honeypot, IP rate limiting, input sanitization, and direct Nodemailer Gmail SMTP integration (`oplioraprivatelimited@gmail.com`).
- **Complete Visual & Brand Identity:** Authentic high-resolution Opliora and Feedo brand assets, glassmorphic navigation, dual infinite marquees, interactive 3D principle cards, and a careers journey timeline.

---

## ✦ Technology Stack

- **Frontend Core:** Semantic HTML5, Advanced Modern CSS (CSS Grid, Flexbox, custom properties, backdrop filters).
- **Motion & 3D:** Three.js, GSAP 3, ScrollTrigger, Lenis Smooth Scroll.
- **Iconography:** Lucide Icons (Self-contained, zero external CDN dependencies).
- **Backend / API:** Node.js HTTP server + Vercel Serverless Functions (`api/contact.js`).
- **Email Delivery:** Nodemailer with Gmail SMTP.

---

## ✦ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm`

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/hrithik577/opliora.git
cd opliora
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):
```bash
cp .env.example .env
```

Configure your environment variables:
```env
PORT=3000
GMAIL_USER=oplioraprivatelimited@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
CONTACT_RECIPIENT=oplioraprivatelimited@gmail.com
```

> **Note:** If `GMAIL_APP_PASSWORD` is left unset, the contact form automatically provides a pre-formatted direct `mailto:` fallback to `oplioraprivatelimited@gmail.com`, ensuring no corporate inquiry is ever lost.

### 4. Running Locally
Start the production server:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✦ Project Structure

```
├── api/
│   └── contact.js          # Serverless contact handler with rate limiting & Nodemailer
├── images/
│   ├── opliora-logo.jpg    # Authentic Opliora Private Limited brand logo
│   └── feedo-logo.jpg      # Authentic Feedo Delivery brand logo
├── js/
│   ├── components/
│   │   ├── contact.js      # Contact form validation, honeypot & submission
│   │   └── nav.js          # Glassmorphic nav elevation & active section spy
│   ├── config.js           # Central corporate metadata & email configuration
│   ├── hero-3d.js          # Three.js kinetic scene & GLSL shaders
│   ├── main.js             # Application initialization orchestrator
│   └── motion.js           # GSAP ScrollTrigger timelines & Lenis integration
├── vendor/
│   ├── gsap.min.js         # GSAP core
│   ├── ScrollTrigger.min.js# ScrollTrigger plugin
│   ├── lenis.min.js        # Lenis smooth scroll
│   ├── three.min.js        # Three.js 3D library
│   └── lucide.min.js       # Lucide SVG icon library
├── index.html              # Semantic HTML5 markup with Open Graph & Schema.org JSON-LD
├── styles.css              # Custom design system, typography & responsive layouts
├── server.js               # Node.js static & API server
├── vercel.json             # Vercel deployment configuration & security headers
├── sitemap.xml             # Search engine sitemap
├── robots.txt              # Search crawler directives
└── package.json            # Node.js scripts & dependencies
```

---

## ✦ Deployment

### Vercel
The repository includes a ready-to-deploy [`vercel.json`](vercel.json) configuration:
1. Import this repository into [Vercel](https://vercel.com/).
2. In Project Settings &rarr; **Environment Variables**, set:
   - `GMAIL_USER`: `oplioraprivatelimited@gmail.com`
   - `GMAIL_APP_PASSWORD`: Your 16-character Google App Password
   - `CONTACT_RECIPIENT`: `oplioraprivatelimited@gmail.com`
3. Deploy.

---

## ✦ Corporate Inquiries

- **Email:** [oplioraprivatelimited@gmail.com](mailto:oplioraprivatelimited@gmail.com)
- **Positioning:** Diversified Parent Company

---

© Opliora Private Limited. All rights reserved.
