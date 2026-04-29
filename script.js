/* ============================================================
   DEFENSE COMMAND CENTER — script.js
   Pure JavaScript — no libraries or frameworks
============================================================ */

// ── BOOT SEQUENCE ────────────────────────────────────────────
// Messages shown one-by-one on the boot screen
const BOOT_MESSAGES = [
  { text: '> Initializing BIOS...', cls: 'log-line', delay: 300 },
  { text: '> Establishing secure channel... [OK]', cls: 'log-line log-ok', delay: 600 },
  { text: '> Loading cryptographic modules... [OK]', cls: 'log-line log-ok', delay: 900 },
  { text: '> Connecting to satellite network... [OK]', cls: 'log-line log-ok', delay: 1300 },
  { text: '> Loading radar subsystem... [OK]', cls: 'log-line log-ok', delay: 1700 },
  { text: '> Calibrating threat detection engine... [OK]', cls: 'log-line log-ok', delay: 2100 },
  { text: '> Loading target tracking system... [OK]', cls: 'log-line log-ok', delay: 2500 },
  { text: '> Running self-diagnostics... [OK]', cls: 'log-line log-ok', delay: 2900 },
  { text: '> WARNING: 1 subsystem in STANDBY mode', cls: 'log-line log-warn', delay: 3200 },
  { text: '> Applying AES-256 encryption... [OK]', cls: 'log-line log-ok', delay: 3600 },
  { text: '> ████████████████████ SYSTEM READY ████', cls: 'log-line log-ok', delay: 4000 },
];

function runBootSequence() {
  const log  = document.getElementById('bootLog');
  const bar  = document.getElementById('bootBar');
  const pct  = document.getElementById('bootPct');
  const total = BOOT_MESSAGES.length;

  BOOT_MESSAGES.forEach((msg, i) => {
    setTimeout(() => {
      // Add log line
      const div = document.createElement('div');
      div.className = msg.cls;
      div.textContent = msg.text;
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;

      // Update progress bar
      const progress = Math.round(((i + 1) / total) * 100);
      bar.style.width = progress + '%';
      pct.textContent = progress + '%';

      // After last message, transition to dashboard
      if (i === total - 1) {
        setTimeout(showDashboard, 700);
      }
    }, msg.delay);
  });
}

function showDashboard() {
  const boot  = document.getElementById('bootScreen');
  const dash  = document.getElementById('dashboard');
  boot.classList.add('fade-out');
  setTimeout(() => {
    boot.style.display = 'none';
    dash.classList.remove('hidden');
    // Start all live features
    startClock();
    startUptime();
    buildSystemStatus();
    addLog('System initialized successfully.', 'green');
    addLog('Radar scanning sector BRAVO-9.', 'green');
    addLog('All satellites linked.', 'green');
    addLog('Awaiting operator commands...', '');
  }, 800);
}

// ── LIVE CLOCK ───────────────────────────────────────────────
function startClock() {
  function tick() {
    const now  = new Date();
    const hh   = String(now.getHours()).padStart(2, '0');
    const mm   = String(now.getMinutes()).padStart(2, '0');
    const ss   = String(now.getSeconds()).padStart(2, '0');
    const dd   = String(now.getDate()).padStart(2, '0');
    const mo   = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();

    document.getElementById('liveClock').textContent = `${hh}:${mm}:${ss}`;
    document.getElementById('liveDate').textContent  = `${dd}/${mo}/${yyyy}`;

    // Status bar time copy
    const sbTime = document.getElementById('sbTime');
    if (sbTime) sbTime.textContent = `UTC ${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);
}

// ── UPTIME COUNTER ────────────────────────────────────────────
let uptimeSeconds = 0;
function startUptime() {
  setInterval(() => {
    uptimeSeconds++;
    const h  = String(Math.floor(uptimeSeconds / 3600)).padStart(2, '0');
    const m  = String(Math.floor((uptimeSeconds % 3600) / 60)).padStart(2, '0');
    const s  = String(uptimeSeconds % 60).padStart(2, '0');
    const el = document.getElementById('uptimeDisplay');
    if (el) el.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// ── MISSION LOG ───────────────────────────────────────────────
function addLog(message, type = '') {
  const log  = document.getElementById('missionLog');
  const now  = new Date();
  const ts   = `${String(now.getHours()).padStart(2,'0')}:` +
               `${String(now.getMinutes()).padStart(2,'0')}:` +
               `${String(now.getSeconds()).padStart(2,'0')}`;

  const entry = document.createElement('div');
  entry.className = 'log-entry' + (type === 'red' ? ' alert' : type === 'yellow' ? ' warn' : '');
  entry.innerHTML =
    `<span class="log-time">[${ts}]</span>` +
    `<span class="log-msg ${type}">${message}</span>`;

  log.insertBefore(entry, log.firstChild);  // newest at top
}

function clearLog() {
  document.getElementById('missionLog').innerHTML = '';
  addLog('Log cleared by operator.', '');
}

// ── THREAT LEVEL ──────────────────────────────────────────────
const THREAT_LEVELS = [
  {
    label: 'LOW',
    cls:   'low',
    desc:  'No immediate threats detected. Routine patrol active.',
    logMsg:'Area scan complete. Threat level: LOW.',
    logType:'green'
  },
  {
    label: 'MEDIUM',
    cls:   'medium',
    desc:  'Unidentified signatures detected. Monitoring closely.',
    logMsg:'WARNING — Unidentified contact in sector. Threat: MEDIUM.',
    logType:'yellow'
  },
  {
    label: 'HIGH',
    cls:   'high',
    desc:  'HOSTILE ACTIVITY CONFIRMED! Immediate response required.',
    logMsg:'ALERT — HOSTILE TARGET CONFIRMED. Threat level: HIGH!',
    logType:'red'
  },
];

let scanHistory = [];

function scanArea() {
  const btn = document.getElementById('scanBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-icon">⏳</span> SCANNING...';

  addLog('Initiating area scan...', '');

  // Simulate scan delay
  setTimeout(() => {
    // Random threat (weighted: 50% low, 30% medium, 20% high)
    const r   = Math.random();
    const lvl = r < 0.5 ? THREAT_LEVELS[0] : r < 0.8 ? THREAT_LEVELS[1] : THREAT_LEVELS[2];

    // Update threat display
    const val = document.getElementById('threatValue');
    const bar = document.getElementById('threatBar');
    const desc = document.getElementById('threatDesc');

    val.textContent = lvl.label;
    val.className   = 'threat-level-value ' + lvl.cls;
    bar.className   = 'threat-bar ' + lvl.cls;
    desc.textContent = lvl.desc;

    // Log it
    addLog(lvl.logMsg, lvl.logType);

    // Threat history
    const now = new Date();
    const ts  = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    scanHistory.unshift({ time: ts, level: lvl.label, cls: lvl.cls });
    renderThreatLog();

    // Reset button
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">⚡</span> SCAN AREA';
  }, 1800);
}

function renderThreatLog() {
  const list = document.getElementById('threatLogList');
  list.innerHTML = '';
  scanHistory.slice(0, 5).forEach(item => {
    const div = document.createElement('div');
    div.className = 'threat-log-item';
    div.innerHTML =
      `<span style="color:var(--muted)">${item.time}</span> ` +
      `<span class="${item.cls}-text">${item.level}</span>`;
    list.appendChild(div);
  });
}

// Add color classes dynamically for threat log items
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .low-text    { color: var(--green);  }
    .medium-text { color: var(--yellow); }
    .high-text   { color: var(--red);    }
  `;
  document.head.appendChild(style);
});

// ── TARGET TRACKING ───────────────────────────────────────────
// Pools of realistic-looking fake coordinates & designations
const COORD_POOL = [
  { lat:'28.7041° N', lon:'77.1025° E', alt:'1240 m', spd:'320 km/h', desig:'TGT-ALPHA-7' },
  { lat:'19.0760° N', lon:'72.8777° E', alt:'920 m',  spd:'280 km/h', desig:'TGT-BRAVO-2' },
  { lat:'13.0827° N', lon:'80.2707° E', alt:'3400 m', spd:'540 km/h', desig:'TGT-CHARLIE-4' },
  { lat:'22.5726° N', lon:'88.3639° E', alt:'580 m',  spd:'175 km/h', desig:'TGT-DELTA-9' },
  { lat:'12.9716° N', lon:'77.5946° E', alt:'2100 m', spd:'410 km/h', desig:'TGT-ECHO-1' },
  { lat:'26.4499° N', lon:'80.3319° E', alt:'750 m',  spd:'230 km/h', desig:'TGT-FOXTROT-3' },
  { lat:'23.0225° N', lon:'72.5714° E', alt:'4800 m', spd:'680 km/h', desig:'TGT-GOLF-6' },
];

let targetLocked    = false;
let coordUpdateTimer = null;

function trackTarget() {
  const btn = document.getElementById('trackBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-icon">⏳</span> ACQUIRING...';

  addLog('Target acquisition initiated...', '');

  // Simulate acquisition delay
  setTimeout(() => {
    const coord = COORD_POOL[Math.floor(Math.random() * COORD_POOL.length)];
    lockTarget(coord);
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">🎯</span> TRACK TARGET';
  }, 2000);
}

function lockTarget(coord) {
  targetLocked = true;

  // Update crosshair
  document.getElementById('targetCrosshair').classList.add('target-locked');

  // Update status
  document.getElementById('targetStatus').textContent = 'LOCKED';
  document.getElementById('targetStatus').style.color = 'var(--red)';
  document.getElementById('targetStatus').style.borderColor = 'var(--red)';
  document.getElementById('targetStatus').classList.add('blink');

  // Update info fields
  document.getElementById('tStatus').textContent  = 'TARGET LOCKED';
  document.getElementById('tStatus').style.color  = 'var(--red)';
  document.getElementById('tLat').textContent     = coord.lat;
  document.getElementById('tLon').textContent     = coord.lon;
  document.getElementById('tAlt').textContent     = coord.alt;
  document.getElementById('tSpeed').textContent   = coord.spd;
  document.getElementById('tDesig').textContent   = coord.desig;

  addLog(`Target locked: ${coord.desig} at ${coord.lat}, ${coord.lon}`, 'red');

  // Slightly randomise coordinates every 3s to simulate movement
  coordUpdateTimer = setInterval(() => {
    if (!targetLocked) { clearInterval(coordUpdateTimer); return; }
    const jitter = (v) => (parseFloat(v) + (Math.random() - 0.5) * 0.004).toFixed(4);
    const latBase = parseFloat(coord.lat);
    const lonBase = parseFloat(coord.lon);
    const newLat  = (latBase + (Math.random() - 0.5) * 0.006).toFixed(4) + '° N';
    const newLon  = (lonBase + (Math.random() - 0.5) * 0.006).toFixed(4) + '° E';
    document.getElementById('tLat').textContent = newLat;
    document.getElementById('tLon').textContent = newLon;
  }, 3000);
}

function clearTarget() {
  targetLocked = false;
  clearInterval(coordUpdateTimer);

  document.getElementById('targetCrosshair').classList.remove('target-locked');

  const status = document.getElementById('targetStatus');
  status.textContent = 'IDLE';
  status.style.color = '';
  status.style.borderColor = '';
  status.classList.remove('blink');

  document.getElementById('tStatus').textContent = 'NO TARGET';
  document.getElementById('tStatus').style.color = '';
  document.getElementById('tLat').textContent    = '---.---- °N';
  document.getElementById('tLon').textContent    = '---.---- °E';
  document.getElementById('tAlt').textContent    = '---- m';
  document.getElementById('tSpeed').textContent  = '--- km/h';
  document.getElementById('tDesig').textContent  = '----';

  addLog('Target tracking cleared.', 'yellow');
}

// ── SYSTEM STATUS ─────────────────────────────────────────────
const SUBSYSTEMS = [
  { name: 'RADAR ARRAY',        status: 'active',  pct: 98 },
  { name: 'COMMS NETWORK',      status: 'active',  pct: 100 },
  { name: 'MISSILE DEFENSE',    status: 'active',  pct: 94 },
  { name: 'SATELLITE LINK',     status: 'active',  pct: 87 },
  { name: 'THREAT DETECTION',   status: 'active',  pct: 96 },
  { name: 'POWER GRID',         status: 'standby', pct: 72 },
  { name: 'ENCRYPTION MODULE',  status: 'active',  pct: 100 },
  { name: 'GPS TRACKING',       status: 'active',  pct: 91 },
  { name: 'FUEL RESERVES',      status: 'standby', pct: 61 },
  { name: 'FIREWALL',           status: 'active',  pct: 99 },
];

function buildSystemStatus() {
  renderSystems(SUBSYSTEMS);
}

function renderSystems(systems) {
  const grid = document.getElementById('sysGrid');
  grid.innerHTML = '';

  systems.forEach(sys => {
    const row = document.createElement('div');
    row.className = 'sys-row';
    row.innerHTML =
      `<span class="sys-name">${sys.name}</span>` +
      `<span class="sys-pct">${sys.pct}%</span>` +
      `<span class="sys-status ${sys.status}">${sys.status.toUpperCase()}</span>`;
    grid.appendChild(row);
  });
}

function refreshSystems() {
  const updated = SUBSYSTEMS.map(sys => {
    // Randomly fluctuate percentages and rarely trigger an error
    const delta   = Math.floor(Math.random() * 5) - 2;
    const newPct  = Math.min(100, Math.max(40, sys.pct + delta));
    const roll    = Math.random();
    let newStatus = sys.status;
    if (roll < 0.06)      newStatus = 'error';
    else if (roll < 0.18) newStatus = 'standby';
    else if (sys.pct > 50) newStatus = 'active';
    return { ...sys, pct: newPct, status: newStatus };
  });

  renderSystems(updated);

  const errors   = updated.filter(s => s.status === 'error').length;
  const standbys = updated.filter(s => s.status === 'standby').length;

  if (errors > 0) {
    addLog(`ALERT — ${errors} subsystem(s) in ERROR state!`, 'red');
  } else if (standbys > 0) {
    addLog(`${standbys} subsystem(s) in STANDBY mode.`, 'yellow');
  } else {
    addLog('All systems nominal after refresh.', 'green');
  }
}

// ── RADAR DOT MOVEMENT ────────────────────────────────────────
// Gently move radar targets to simulate movement
function animateRadarTargets() {
  const dots = [
    { id:'dot1', top:28, left:62 },
    { id:'dot2', top:55, left:35 },
    { id:'dot3', top:38, left:48 },
    { id:'dot4', top:68, left:58 },
  ];

  setInterval(() => {
    dots.forEach(d => {
      d.top  += (Math.random() - 0.5) * 1.5;
      d.left += (Math.random() - 0.5) * 1.5;
      // Keep within radar circle (rough bounds 15–85%)
      d.top  = Math.max(15, Math.min(82, d.top));
      d.left = Math.max(15, Math.min(82, d.left));
      const el = document.getElementById(d.id);
      if (el) {
        el.style.top  = d.top  + '%';
        el.style.left = d.left + '%';
      }
    });
  }, 2500);
}

// ── STARTUP ───────────────────────────────────────────────────
window.addEventListener('load', () => {
  runBootSequence();
  animateRadarTargets();
});
