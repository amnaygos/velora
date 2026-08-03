/* ============================================================
   VELORA Admin — shared shell + interactions
   Injects the sidebar into <div id="sidebar-root"> and marks the
   active page from <body data-page="...">. Pure static, works on
   file:// (no fetch). Small UI helpers live at the bottom.
   ============================================================ */

const ICONS = {
  overview:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  enquiries: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"><path d="M3 5h18v14H3z"/><path d="M3 6l9 7 9-7"/></svg>',
  projects:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>',
  calendar:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"><rect x="3" y="5" width="18" height="16"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>',
  portfolio: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"><rect x="3" y="4" width="18" height="16"/><path d="M3 15l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="9" r="1.4"/></svg>',
  settings:  '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"><path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="#242426"/><circle cx="15" cy="12" r="2" fill="#242426"/><circle cx="8" cy="17" r="2" fill="#242426"/></svg>',
  signout:   '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"><path d="M9 21H4V3h5"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
  search:    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
  bell:      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/></svg>',
  plus:      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.3"><path d="M12 5v14M5 12h14"/></svg>',
  kanban:    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.3"><rect x="3" y="4" width="5" height="16"/><rect x="10" y="4" width="5" height="11"/><rect x="17" y="4" width="4" height="14"/></svg>',
  list:      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.3"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  arrow:     '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.3"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  chevL:     '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.3"><path d="M15 6l-6 6 6 6"/></svg>',
  chevR:     '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.3"><path d="M9 6l6 6-6 6"/></svg>',
  close:     '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.3"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  edit:      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>',
};

const NAV = [
  { group: 'Workspace', items: [
    { id: 'overview',  label: 'Overview',   href: 'index.html' },
    { id: 'enquiries', label: 'Enquiries',  href: 'enquiries.html', badge: '4' },
    { id: 'projects',  label: 'Projects',   href: 'projects.html' },
    { id: 'calendar',  label: 'Calendar',   href: 'calendar.html' },
  ]},
  { group: 'Content', items: [
    { id: 'portfolio', label: 'Portfolio',  href: 'portfolio.html' },
  ]},
  { group: 'System', items: [
    { id: 'settings',  label: 'Settings',   href: 'settings.html' },
  ]},
];

function renderSidebar() {
  const root = document.getElementById('sidebar-root');
  if (!root) return;
  const active = document.body.dataset.page;

  const groups = NAV.map(g => `
    <div class="side-group-label">${g.group}</div>
    ${g.items.map(it => `
      <a class="side-link ${it.id === active ? 'active' : ''}" href="${it.href}">
        ${ICONS[it.id] || ''}
        <span>${it.label}</span>
        ${it.badge ? `<span class="badge">${it.badge}</span>` : ''}
      </a>`).join('')}
  `).join('');

  root.innerHTML = `
    <aside class="sidebar">
      <div class="side-logo">
        <img src="../public/images/logo full velora.svg" alt="VELORA" style="height:18px;width:auto;filter:brightness(0) invert(1);" />
        <span>ADMIN</span>
      </div>
      <nav class="side-scroll">${groups}</nav>
      <div class="side-foot">
        <div class="avatar avatar-olive">AD</div>
        <div class="meta">
          <b>Admin</b>
          <span>ADMINISTRATOR</span>
        </div>
        <a class="signout" href="login.html" title="Sign out">${ICONS.signout}</a>
      </div>
    </aside>`;
}

/* ---- Drawer / overlay helpers ---- */
function openDrawer(id) {
  const d = document.getElementById(id);
  const o = document.getElementById('overlay');
  if (d) d.classList.add('open');
  if (o) o.classList.add('open');
}
function closeDrawer() {
  document.querySelectorAll('.drawer.open').forEach(d => d.classList.remove('open'));
  const o = document.getElementById('overlay');
  if (o) o.classList.remove('open');
}

/* ---- Projects view toggle (kanban <-> table) ---- */
function setProjectView(view, btn) {
  document.querySelectorAll('[data-view]').forEach(el => {
    el.classList.toggle('hide', el.dataset.view !== view);
  });
  document.querySelectorAll('.seg button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

/* ---- Simple chip filter toggle (visual only) ---- */
function toggleChip(el) { el.classList.toggle('on'); }

/* ---- Choice cards (multi-select) ---- */
function toggleChoice(el) { el.classList.toggle('sel'); }

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
});
