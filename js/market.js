// ── MARKETPLACE LOGIC ──────────────────────────────────────
import { auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window._user = null;

onAuthStateChanged(auth, (user) => {
  const loading = document.getElementById('loadingScreen');
  if (loading) loading.style.display = 'none';
  window._user = user;
  const btn = document.getElementById('navAuthBtn');
  if (btn && user) { btn.textContent = 'My Dashboard'; btn.href = 'dashboard.html'; }
});

// Share data including real HMH IPO data
window.shares = [
  { code: 'HMH',   name: 'HMH Holding AS',      sector: 'Energy / Oil Equipment', desc: "Norway's leading oil drilling equipment and services company. Co-owned by Baker Hughes and Akastor. IPO price NOK 190–210. 2025 revenue: NOK 821.8M. Net income: NOK 46.1M.", price: 200.00, change: +5.2, volume: '10,500,000', cap: 'NOK 948.1M', tag: 'ipo' },
  { code: 'NOR-A', name: 'Norwegian Growth A',   sector: 'Diversified Growth',     desc: 'Flagship share class offering core business ownership. Ideal for long-term investors seeking steady growth.', price: 245.00, change: +2.4, volume: '12,430',      cap: 'NOK 980K',   tag: '' },
  { code: 'NOR-B', name: 'Norwegian Growth B',   sector: 'Diversified Growth',     desc: 'Mid-tier share class at a lower entry price. Great for diversifying across multiple share classes.', price: 180.50, change: -0.8, volume: '8,210',       cap: 'NOK 722K',   tag: '' },
  { code: 'NOR-C', name: 'Norwegian Growth C',   sector: 'Diversified Growth',     desc: 'Premium share class with higher per-unit value. Suited for investors making larger single investments.', price: 310.00, change: +1.2, volume: '5,100',       cap: 'NOK 310K',   tag: '' },
  { code: 'NOR-D', name: 'Norwegian Growth D',   sector: 'Entry Level',            desc: 'Entry-level share class making investing accessible to everyone. Start with as little as 1 share.', price: 95.75,  change: +3.1, volume: '22,800',      cap: 'NOK 218K',   tag: '' },
  { code: 'NOR-E', name: 'Norwegian Growth E',   sector: 'Premium Class',          desc: 'Exclusive high-value share class for major investors. Limited availability with the highest per-share price.', price: 420.00, change: -0.3, volume: '1,800',       cap: 'NOK 168K',   tag: '' },
];

let currentFilter = 'all';
let selectedShare = null;

window.setFilter = function (f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid();
};

window.renderGrid = function () {
  const q = document.getElementById('searchInput').value.toLowerCase();
  let list = window.shares.filter(s =>
    currentFilter === 'all' ||
    (currentFilter === 'ipo' && s.tag === 'ipo') ||
    (currentFilter === 'rising' && s.change > 0) ||
    (currentFilter === 'falling' && s.change < 0)
  );
  if (q) list = list.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
  const grid = document.getElementById('sharesGrid');
  if (!list.length) { grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:rgba(255,255,255,0.4);">No shares match your search.</div>'; return; }
  grid.innerHTML = list.map(s => `
    <div class="share-card">
      <div style="display:flex;justify-content:space-between;margin-bottom:0.85rem;">
        <span class="badge badge-gold">${s.code}${s.tag === 'ipo' ? ' 🔥' : ''}</span>
        <span class="badge ${s.change >= 0 ? 'badge-green' : 'badge-red'}">${s.change >= 0 ? '▲' : '▼'} ${Math.abs(s.change)}%</span>
      </div>
      <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);margin-bottom:0.3rem;">${s.sector}</div>
      <div style="font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;margin-bottom:0.4rem;">${s.name}</div>
      <div style="font-size:0.8rem;color:rgba(255,255,255,0.45);line-height:1.6;margin-bottom:1rem;">${s.desc}</div>
      <div style="font-size:0.68rem;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);margin-bottom:0.25rem;">Price per share</div>
      <div style="font-family:'Playfair Display',serif;font-size:1.5rem;color:var(--gold);margin-bottom:0.85rem;">NOK ${s.price.toFixed(2)}</div>
      <div style="display:flex;gap:1.5rem;margin-bottom:1rem;">
        <div><div style="font-size:0.7rem;color:rgba(255,255,255,0.35);">Volume</div><div style="font-size:0.82rem;font-weight:500;">${s.volume}</div></div>
        <div><div style="font-size:0.7rem;color:rgba(255,255,255,0.35);">Market Cap</div><div style="font-size:0.82rem;font-weight:500;">${s.cap}</div></div>
      </div>
      <button class="btn btn-gold btn-block" onclick="openModal('${s.code}')">Buy ${s.code}</button>
    </div>`).join('');
};

window.openModal = function (code) {
  selectedShare = window.shares.find(s => s.code === code);
  if (!selectedShare) return;
  document.getElementById('modalTitle').textContent = 'Buy ' + selectedShare.code;
  document.getElementById('modalSubtitle').textContent = selectedShare.name;
  document.getElementById('modalPrice').textContent = 'NOK ' + selectedShare.price.toFixed(2);
  const chg = document.getElementById('modalChange');
  chg.textContent = (selectedShare.change >= 0 ? '▲ +' : '▼ ') + Math.abs(selectedShare.change) + '%';
  chg.style.color = selectedShare.change >= 0 ? '#4caf82' : '#e05555';
  document.getElementById('qtyInput').value = 1;
  document.getElementById('modalAlert').className = 'alert';
  updateTotal();
  document.getElementById('modalOverlay').classList.add('show');
};

window.updateTotal = function () {
  if (!selectedShare) return;
  const q = Math.max(1, parseInt(document.getElementById('qtyInput').value) || 1);
  document.getElementById('qtyInput').value = q;
  document.getElementById('modalTotal').textContent = 'NOK ' + (selectedShare.price * q).toFixed(2);
};

window.changeQty = function (d) {
  const i = document.getElementById('qtyInput');
  i.value = Math.max(1, (parseInt(i.value) || 1) + d);
  updateTotal();
};

window.closeModal = function () { document.getElementById('modalOverlay').classList.remove('show'); };
window.closeOutside = function (e) { if (e.target === document.getElementById('modalOverlay')) closeModal(); };

window.confirmBuy = function () {
  const a = document.getElementById('modalAlert');
  if (!window._user) {
    a.textContent = '⚠ Please sign in to buy shares.';
    a.className = 'alert show error';
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    return;
  }
  const q = parseInt(document.getElementById('qtyInput').value) || 1;
  const total = (selectedShare.price * q).toFixed(2);
  const btn = document.getElementById('confirmBtn');
  btn.textContent = 'Processing...'; btn.disabled = true;
  setTimeout(() => {
    a.textContent = '✓ ' + q + ' × ' + selectedShare.code + ' purchased for NOK ' + total + '! View in your dashboard.';
    a.className = 'alert show success';
    btn.textContent = 'Confirm Purchase'; btn.disabled = false;
    setTimeout(closeModal, 2500);
  }, 1500);
};
