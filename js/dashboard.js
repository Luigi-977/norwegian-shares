import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const sharePrices = {
  'HMH':200.00,'NOR-A':245.00,'NOR-B':180.50,
  'NOR-C':310.00,'NOR-D':95.75,'NOR-E':420.00
};

onAuthStateChanged(auth, async (user) => {
  const loading = document.getElementById('loadingScreen');
  if (loading) loading.style.display = 'none';
  if (!user) { window.location.href = 'login.html'; return; }

  // Set user info
  const name = user.displayName || user.email;
  const first = name.split(' ')[0];
  const el = document.getElementById('firstName');
  if (el) el.textContent = first;
  const avatar = document.getElementById('navAvatar');
  if (avatar) avatar.textContent = first.charAt(0).toUpperCase();
  const navName = document.getElementById('navName');
  if (navName) navName.textContent = name;

  // Load from Firestore
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    const txns = [];
    snap.forEach(doc => txns.push({ id: doc.id, ...doc.data() }));

    // Build portfolio
    const portfolio = {};
    let totalInvested = 0;
    txns.forEach(t => {
      if (!portfolio[t.shareCode]) portfolio[t.shareCode] = { code: t.shareCode, name: t.shareName, qty: 0, cost: 0 };
      if (t.type === 'buy') { portfolio[t.shareCode].qty += t.quantity; portfolio[t.shareCode].cost += t.totalAmount; totalInvested += t.totalAmount; }
      if (t.type === 'sell') { portfolio[t.shareCode].qty -= t.quantity; portfolio[t.shareCode].cost -= t.totalAmount; totalInvested -= t.totalAmount; }
    });

    let totalValue = 0;
    Object.values(portfolio).forEach(h => { if (h.qty > 0) totalValue += h.qty * (sharePrices[h.code] || 0); });
    const totalReturn = totalValue - totalInvested;
    const returnPct = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(2) : '0.00';
    const shareClasses = Object.values(portfolio).filter(h => h.qty > 0).length;
    const totalShares = Object.values(portfolio).reduce((s, h) => s + (h.qty > 0 ? h.qty : 0), 0);

    // Update stats
    setStatCard('statValue', 'NOK ' + totalValue.toFixed(2), totalReturn >= 0 ? 'pos' : 'neg', shareClasses > 0 ? (totalReturn >= 0 ? '▲' : '▼') + ' NOK ' + Math.abs(totalReturn).toFixed(2) : 'No shares yet');
    setStatCard('statInvested', 'NOK ' + totalInvested.toFixed(2), 'muted', totalInvested > 0 ? 'Total spent' : 'Start investing today');
    setStatCard('statShares', String(totalShares), 'muted', 'Across ' + shareClasses + ' classes');
    setStatCard('statReturn', returnPct + '%', totalReturn >= 0 ? 'pos' : 'neg', 'NOK ' + totalReturn.toFixed(2));

    // Render portfolio
    renderPortfolio(portfolio);
    renderTransactions(txns.slice(0, 5));

  } catch (e) {
    console.warn('Firestore:', e.message);
    // Show empty state if Firestore fails
    setStatCard('statValue', 'NOK 0.00', 'muted', 'No shares yet');
    setStatCard('statInvested', 'NOK 0.00', 'muted', 'Start investing today');
    setStatCard('statShares', '0', 'muted', 'Across 0 classes');
    setStatCard('statReturn', '0.00%', 'muted', 'NOK 0.00');
    renderPortfolio({});
    renderTransactions([]);
  }
});

function setStatCard(id, value, subClass, sub) {
  const el = document.getElementById(id);
  if (!el) return;
  el.querySelector('.stat-value').textContent = value;
  const s = el.querySelector('.stat-sub');
  s.textContent = sub;
  s.className = 'stat-sub ' + subClass;
}

function renderPortfolio(portfolio) {
  const el = document.getElementById('portfolioBody');
  if (!el) return;
  const holdings = Object.values(portfolio).filter(h => h.qty > 0);
  if (!holdings.length) {
    el.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:rgba(255,255,255,0.4);">No holdings yet. <a href="marketplace.html" style="color:var(--gold);">Buy your first share →</a></td></tr>';
    return;
  }
  el.innerHTML = holdings.map(h => {
    const price = sharePrices[h.code] || 0;
    const value = h.qty * price;
    const pnl = value - h.cost;
    const pnlPct = h.cost > 0 ? ((pnl / h.cost) * 100).toFixed(2) : '0.00';
    return `<tr>
      <td><span class="badge badge-gold">${h.code}</span></td>
      <td>${h.qty}</td>
      <td style="font-family:'Playfair Display',serif;color:var(--gold);">NOK ${price.toFixed(2)}</td>
      <td style="font-family:'Playfair Display',serif;color:var(--gold);">NOK ${value.toFixed(2)}</td>
      <td class="${pnl >= 0 ? 'pos' : 'neg'}">${pnl >= 0 ? '▲' : '▼'} ${Math.abs(pnlPct)}%</td>
    </tr>`;
  }).join('');
}

function renderTransactions(txns) {
  const el = document.getElementById('transactionBody');
  if (!el) return;
  if (!txns.length) {
    el.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:2rem;color:rgba(255,255,255,0.4);">No transactions yet.</td></tr>';
    return;
  }
  el.innerHTML = txns.map(t => {
    const date = t.timestamp ? new Date(t.timestamp.seconds * 1000).toLocaleDateString() : 'Just now';
    return `<tr>
      <td style="font-size:0.82rem;">${date}</td>
      <td><span class="badge ${t.type === 'buy' ? 'badge-green' : 'badge-red'}">${t.type.toUpperCase()}</span> <span class="badge badge-gold">${t.shareCode}</span></td>
      <td>${t.quantity}</td>
      <td style="font-family:'Playfair Display',serif;color:var(--gold);">NOK ${t.totalAmount.toFixed(2)}</td>
    </tr>`;
  }).join('');
}

window.handleLogout = function() {
  signOut(auth).then(() => { window.location.href = 'index.html'; });
};
