// =========================================
// app.js — Core Application Logic
// Ramaiah Lost & Found Portal
// Bhavani V & Sahana D
// =========================================

// ─── Data Layer: Firebase + Demo Mode fallback ───

const STORAGE_KEY = 'ramaiah_lost_found_items';

function getItems() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ─── Add Item ───
async function addItem(itemData) {
  if (window.DEMO_MODE) {
    const items = getItems();
    const newItem = {
      ...itemData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    items.unshift(newItem);
    saveItems(items);
    return newItem.id;
  } else {
    const docRef = await window.db.collection('items').add({
      ...itemData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'active'
    });
    return docRef.id;
  }
}

// ─── Get All Items ───
async function getAllItems(filters = {}) {
  if (window.DEMO_MODE) {
    let items = getItems();
    if (filters.type && filters.type !== 'all') {
      items = items.filter(i => i.type === filters.type);
    }
    if (filters.category && filters.category !== 'all') {
      items = items.filter(i => i.category === filters.category);
    }
    if (filters.status && filters.status !== 'all') {
      items = items.filter(i => i.status === filters.status);
    } else {
      items = items.filter(i => i.status !== 'resolved');
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
      );
    }
    return items;
  } else {
    let query = window.db.collection('items');
    if (filters.type && filters.type !== 'all') query = query.where('type', '==', filters.type);
    if (filters.category && filters.category !== 'all') query = query.where('category', '==', filters.category);
    if (!filters.status || filters.status === 'all') {
      query = query.where('status', '==', 'active');
    } else {
      query = query.where('status', '==', filters.status);
    }
    query = query.orderBy('createdAt', 'desc');
    const snap = await query.get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

// ─── Get Recent Items ───
async function getRecentItems(limit = 3) {
  if (window.DEMO_MODE) {
    return getItems().filter(i => i.status !== 'resolved').slice(0, limit);
  } else {
    const snap = await window.db.collection('items')
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

// ─── Resolve Item ───
async function resolveItem(id) {
  if (window.DEMO_MODE) {
    const items = getItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx !== -1) items[idx].status = 'resolved';
    saveItems(items);
  } else {
    await window.db.collection('items').doc(id).update({ status: 'resolved' });
  }
}

// ─── Stats ───
async function getStats() {
  if (window.DEMO_MODE) {
    const items = getItems();
    return {
      total: items.length,
      resolved: items.filter(i => i.status === 'resolved').length
    };
  } else {
    const total = await window.db.collection('items').get();
    const resolved = await window.db.collection('items').where('status', '==', 'resolved').get();
    return { total: total.size, resolved: resolved.size };
  }
}

// ─── Upload Image (demo: base64) ───
async function uploadImage(file) {
  if (window.DEMO_MODE) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  } else {
    const ref = window.storage.ref('items/' + Date.now() + '_' + file.name);
    await ref.put(file);
    return await ref.getDownloadURL();
  }
}

// ─── Render Helpers ───

function getCategoryIcon(cat) {
  const icons = {
    'id-card': 'fa-id-card',
    'phone': 'fa-mobile-screen',
    'keys': 'fa-key',
    'bag': 'fa-bag-shopping',
    'wallet': 'fa-wallet',
    'laptop': 'fa-laptop',
    'book': 'fa-book',
    'other': 'fa-box'
  };
  return icons[cat] || 'fa-box';
}

function getCategoryLabel(cat) {
  const labels = {
    'id-card': 'ID Card', 'phone': 'Phone', 'keys': 'Keys',
    'bag': 'Bag', 'wallet': 'Wallet', 'laptop': 'Laptop',
    'book': 'Book', 'other': 'Other'
  };
  return labels[cat] || 'Other';
}

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

function buildItemCard(item) {
  const isLost = item.type === 'lost';
  const isResolved = item.status === 'resolved';
  const badgeClass = isResolved ? 'badge-resolved' : (isLost ? 'badge-lost' : 'badge-found');
  const badgeLabel = isResolved ? 'Resolved' : (isLost ? 'Lost' : 'Found');

  const imgHtml = item.imageUrl
    ? `<img class="item-card-img" src="${item.imageUrl}" alt="${item.title}" loading="lazy"/>`
    : `<div class="item-card-img-placeholder"><i class="fa-solid ${getCategoryIcon(item.category)}"></i></div>`;

  const waLink = item.phone
    ? `https://wa.me/91${item.phone.replace(/\D/g, '')}?text=Hi%2C+I+saw+your+post+on+the+Ramaiah+Lost+%26+Found+portal+about+${encodeURIComponent(item.title)}.`
    : '#';

  const contactBtn = item.phone
    ? `<a href="${waLink}" target="_blank" class="btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> Contact</a>`
    : `<a href="mailto:${item.email || ''}" class="btn-whatsapp" style="background:#378ADD;"><i class="fa-solid fa-envelope"></i> Email</a>`;

  const resolveBtn = !isResolved
    ? `<button class="btn-resolve" onclick="markResolved('${item.id}', this)">Mark Resolved</button>`
    : '';

  const time = item.createdAt ? timeAgo(item.createdAt) : '';

  return `
    <div class="item-card" id="card-${item.id}">
      ${imgHtml}
      <div class="item-card-body">
        <span class="item-type-badge ${badgeClass}">${badgeLabel}</span>
        <div class="item-card-title">${escapeHtml(item.title)}</div>
        <div class="item-card-meta">
          <span><i class="fa-solid fa-tag" style="font-size:10px;"></i> ${getCategoryLabel(item.category)}</span>
          <span><i class="fa-solid fa-location-dot" style="font-size:10px;"></i> ${escapeHtml(item.location)}</span>
          <span><i class="fa-regular fa-clock" style="font-size:10px;"></i> ${time}</span>
        </div>
        <div class="item-card-desc">${escapeHtml(item.description)}</div>
        <div class="item-card-footer">
          ${contactBtn}
          ${resolveBtn}
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Mark resolved ───
async function markResolved(id, btn) {
  if (!confirm('Mark this item as resolved (returned to owner)?')) return;
  await resolveItem(id);
  const card = document.getElementById('card-' + id);
  if (card) {
    card.querySelector('.item-type-badge').className = 'item-type-badge badge-resolved';
    card.querySelector('.item-type-badge').textContent = 'Resolved';
    btn.remove();
  }
  showToast('Item marked as resolved! Great job.', 'success');
}

// ─── Toast ───
function showToast(msg, type = '') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = 'toast ' + type;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}"></i> ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── Homepage Functions ───
async function loadRecentItems() {
  const container = document.getElementById('recent-items');
  if (!container) return;
  try {
    const items = await getRecentItems(3);
    if (items.length === 0) {
      container.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <i class="fa-solid fa-box-open"></i>
        <h3>No items posted yet</h3>
        <p>Be the first to report a lost or found item!</p>
      </div>`;
    } else {
      container.innerHTML = items.map(buildItemCard).join('');
    }
  } catch (e) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <h3>Could not load items</h3><p>Please try refreshing.</p>
    </div>`;
  }
}

async function loadStats() {
  try {
    const stats = await getStats();
    const t = document.getElementById('stat-total');
    const r = document.getElementById('stat-resolved');
    if (t) t.textContent = stats.total;
    if (r) r.textContent = stats.resolved;
  } catch (e) {}
}

// ─── Seed demo data if empty ───
(function seedDemo() {
  if (!window.DEMO_MODE) return;
  if (getItems().length > 0) return;
  const seed = [
    {
      id: generateId(), type: 'lost', status: 'active',
      title: 'Blue College ID Card', category: 'id-card',
      description: 'Lost my ID card near the canteen. Name: Priya. Please contact if found.',
      location: 'Main Canteen', phone: '9876543210', email: '',
      createdAt: new Date(Date.now() - 3600000).toISOString(), imageUrl: ''
    },
    {
      id: generateId(), type: 'found', status: 'active',
      title: 'Black OnePlus Phone', category: 'phone',
      description: 'Found a OnePlus phone near the library entrance. Screen cracked slightly. Contact to claim.',
      location: 'Library Entrance', phone: '9123456780', email: '',
      createdAt: new Date(Date.now() - 7200000).toISOString(), imageUrl: ''
    },
    {
      id: generateId(), type: 'lost', status: 'active',
      title: 'Set of 3 Keys with Keychain', category: 'keys',
      description: 'Lost my room keys near the hostel block C. Has a red Ramaiah keychain attached.',
      location: 'Hostel Block C', phone: '9988776655', email: '',
      createdAt: new Date(Date.now() - 86400000).toISOString(), imageUrl: ''
    },
    {
      id: generateId(), type: 'found', status: 'resolved',
      title: 'Grey Backpack', category: 'bag',
      description: 'Found a grey Wildcraft bag near the basketball court. Returned to owner.',
      location: 'Basketball Court', phone: '9012345678', email: '',
      createdAt: new Date(Date.now() - 172800000).toISOString(), imageUrl: ''
    }
  ];
  saveItems(seed);
})();
