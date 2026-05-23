# Ramaiah Lost & Found Portal
### Design Thinking & Idea Lab Project
**MS Ramaiah College of Engineering, Bengaluru**

**Team:** Bhavani V & Sahana D  
**Department:** Computer Science & Engineering  
**Year:** 2025

---

## About the Project

A student-built web application that allows Ramaiah students to report lost and found items on campus, search by category, and connect directly with each other via WhatsApp.

**Problem it solves:** No centralized system existed for students to report/recover lost belongings. WhatsApp groups and notice boards were inefficient and had limited reach.

---

## Features

- Post a lost or found item with photo, description, category, campus location
- Browse all items with search and filters (type, category, status)
- One-click WhatsApp contact to reach the poster
- Mark items as resolved once returned
- Works in **Demo Mode** (no backend needed) for presentations

---

## How to Run (No Setup Required for Demo)

1. **Just open `index.html` in any browser** — the app runs in Demo Mode using localStorage
2. Demo data is pre-loaded so you can show the browse page immediately
3. Try posting an item via the Report page — it saves instantly and appears in Browse

---

## Connect Real Firebase Backend (Optional)

If you want data to persist across devices and users:

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project called `ramaiah-lost-found`
3. Click **Build → Firestore Database → Create database → Start in test mode**
4. Click **Build → Storage → Get started**
5. Go to **Project Settings → Your apps → Add web app**
6. Copy the config values
7. Open `js/firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

8. Also add these CDN scripts to each HTML file's `<head>` (before the closing `</body>`):

```html
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js"></script>
```

---

## Deploy Free on GitHub Pages

1. Create a GitHub account at [github.com](https://github.com) (free)
2. Create a new repository called `ramaiah-lost-found` (public)
3. Upload all project files
4. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
5. Your live URL: `https://your-username.github.io/ramaiah-lost-found`

---

## Project Structure

```
lost-found-app/
├── index.html          ← Homepage
├── css/
│   └── style.css       ← All styles
├── js/
│   ├── firebase-config.js  ← Firebase setup + demo mode
│   └── app.js          ← Core logic, data layer, rendering
└── pages/
    ├── browse.html     ← Browse & search items
    ├── report.html     ← Report lost/found item form
    └── about.html      ← Project info & Design Thinking process
```

---

## Tech Stack (All Free)

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Database | Firebase Firestore (free tier) |
| Storage | Firebase Storage (free tier, 1GB) |
| Hosting | GitHub Pages (free) |
| Fonts | Google Fonts — DM Sans + DM Serif Display |
| Icons | Font Awesome 6 (free CDN) |
| Contact | WhatsApp deep link API |

**Total cost: ₹0**

---

## Design Thinking Process (Summary)

| Stage | What We Did |
|-------|-------------|
| **Empathize** | Interviewed 10 Ramaiah students; 8/10 had lost something on campus with no recovery system |
| **Define** | Problem: No centralized digital system for campus lost & found |
| **Ideate** | Evaluated WhatsApp bot, QR notice boards, and web app — web app won |
| **Prototype** | Built working app in 2 weeks using free tools |
| **Test** | 5 students used it; 2 items returned in first week (67% resolution rate) |

---

*Built with ❤ for the Ramaiah campus community*
