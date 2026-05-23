// =========================================
// Firebase Configuration
// Ramaiah Lost & Found Portal
// Bhavani V & Sahana D
// =========================================
//
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Click "Create a project" → name it "ramaiah-lost-found"
// 3. Go to Project Settings → Your apps → Add app (</> Web)
// 4. Copy the firebaseConfig object below and replace with your values
// 5. Enable Firestore Database (Build → Firestore → Create database → Start in test mode)
// 6. Enable Storage (Build → Storage → Get started)
//
// REPLACE THE VALUES BELOW WITH YOUR OWN FIREBASE CONFIG:


const firebaseConfig = {
  apiKey: "AIzaSyAmVuOtsxgoRtebWizlcBuQRmdBGWUrUlg",
  authDomain: "ramaiah-lost-found.firebaseapp.com",
  projectId: "ramaiah-lost-found",
  storageBucket: "ramaiah-lost-found.firebasestorage.app",
  messagingSenderId: "868595985346",
  appId: "1:868595985346:web:b23c9f8bdac71cf2bdc45b",
  measurementId: "G-3FM7PH74LH"
};
// ─── Firebase SDK (v9 compat mode — works without npm) ───
// These scripts are loaded via CDN in each HTML page.
// Initialize Firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  window.db = firebase.firestore();
  window.storage = firebase.storage();
} else {
  console.warn('Firebase not loaded yet. Make sure CDN scripts are included before this file.');
}

// ─── DEMO MODE ───
// If Firebase is not configured, the app uses localStorage as a demo database.
// This lets you run the project without any backend setup for presentation purposes.
window.DEMO_MODE = (firebaseConfig.apiKey === "YOUR_API_KEY");

if (window.DEMO_MODE) {
  console.info('Running in DEMO MODE — data saved to localStorage. Configure Firebase for production.');
}
