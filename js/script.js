/* ==========================================================================
   ELECTRO PC — Interactions générales
   -----------------------------------------------------------------------
   1. En-tête au scroll + menu mobile
   2. Révélation au scroll / compteurs animés / jauges
   3. Cartes produit (génération depuis data.js)
   4. Fiche de vérification (accordéon)
   5. Boutique : budget, marque, catégorie, recherche, tri
   6. Formulaire de contact
   7. Bandeau défilant, images, footer, transition de page
   ========================================================================== */

/* ---------- 1. En-tête au scroll + menu mobile ------------------------- */
function initHeader() {
  const header = document.getElementById('siteHeader');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('mobileNav');
  const overlay = document.getElementById('navOverlay');

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeNav = () => {
    if (!nav) return;
    nav.classList.remove('open');
    burger && burger.setAttribute('aria-expanded', 'false');
    if (overlay) {
      overlay.classList.remove('open');
      setTimeout(() => {
        if (!nav.classList.contains('open')) overlay.hidden = true;
      }, 300);
    }
    document.body.classList.remove('no-scroll');
  };

  burger && burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (overlay) {
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.toggle('open', open));
    }
    document.body.classList.toggle('no-scroll', open);
  });

  overlay && overlay.addEventListener('click', closeNav);
  nav && nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

  // Lien actif dans les menus
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.dataset.nav === page) a.classList.add('active');
  });
}

/* ---------- 2. Révélation, compteurs, jauges --------------------------- */
let revealObserver = null;

function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    fillBars(document);
    runCounters(document);
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('in');
      fillBars(el);
      runCounters(el);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* Observe les cartes générées après coup */
function observeReveals(root) {
  const list = (root || document).querySelectorAll('.reveal:not(.in)');
  if (!revealObserver) { list.forEach(el => el.classList.add('in')); return; }
  list.forEach(el => revealObserver.observe(el));
}

function fillBars(scope) {
  (scope || document).querySelectorAll('[data-fill]').forEach(bar => {
    bar.style.width = bar.dataset.fill + '%';
  });
}

/* Compteurs animés (ex : 12 480 PC vendus) */
function runCounters(scope) {
  (scope || document).querySelectorAll('[data-count]').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = parseFloat(el.dataset.count);
    const dur = 1500;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = Math.round(val).toLocaleString('fr-FR') + (el.dataset.suffix || '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/* ---------- 3. Cartes produit ------------------------------------------ */
function stockInfo(p) {
  if (p.stock <= 0) return { cls: 'stock-out', txt: 'Épuisé' };
  if (p.stock === 1) return { cls: 'stock-low', txt: '1 unité disponible' };
  return { cls: 'stock-ok', txt: p.stock + ' unités disponibles' };
}

function verificationBlock(p) {
  const v = p.verif;
  const rows = v.rows.map(r => `
    <div class="vp-item">
      <span class="vp-ico ${r.status}">${r.status === 'ok' ? '✓' : '!'}</span>
      <span>
        <span class="vp-name">${r.label}</span><br>
        <span class="vp-val">${r.detail}</span>
      </span>
      <span class="vp-res ${r.status}">${r.value}</span>
    </div>`).join('');

  return `
    <div class="verif">
      <button class="verif-toggle" type="button" aria-expanded="false"
              aria-controls="verif-${p.id}">
        <span class="vt-ico">${icon('clipboard')}</span>
        <span>Fiche de vérification</span>
        <span class="vt-mini">${v.okCount}/${v.total} tests OK · ${v.score} %</span>
        <svg class="vt-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="verif-panel" id="verif-${p.id}" hidden>
        <div class="vp-meta">
          <span>Rapport n° ${v.ref}</span>
          <span>Contrôlé le ${v.testedAt}</span>
        </div>
        <div class="score-row">
          <div class="score-bar"><div class="score-fill" data-fill="${v.score}"></div></div>
          <span class="score-val">${v.score} %</span>
        </div>
        <div class="vp-list">${rows}</div>
        <div class="vp-note">
          ${icon('wrench')} <span>${v.repairs}</span>
          <span class="warranty-badge">${icon('shield')} Garantie 6 mois incluse</span>
        </div>
      </div>
    </div>`;
}

function productCard(p, i) {
  const s = stockInfo(p);
  const out = p.stock <= 0;
  const btn = out
    ? `<button class="btn btn-outline btn-block" disabled>${icon('alert')} Épuisé</button>`
    : `<button class="btn btn-primary btn-block btn-cart" type="button" data-add="${p.id}">
         ${icon('cart')} Ajouter au panier
       </button>`;

  return `
  <article class="pcard reveal ${out ? 'is-out' : ''}" data-d="${(i % 4) + 1}"
           data-card data-id="${p.id}" data-price="${p.price}"
           data-brand="${p.brand}" data-cat="${p.cat}" data-name="${p.name}">
    <div class="pcard-media">
      <div class="media-fallback">${icon('laptop')}</div>
      ${p.image ? `<img src="${p.image}" alt="${p.name} — PC portable d'occasion" loading="lazy">` : ''}
      <div class="pcard-tags">
        <span class="stock-tag ${s.cls}"><i class="dot"></i>${s.txt}</span>
        <span class="warranty-badge">${icon('shield')} Garantie 6 mois</span>
      </div>
      <span class="pcard-cat">${p.cat}</span>
      <span class="pcard-verif-flag">${icon('check')} Fiche vérifiée ${p.verif.score} %</span>
    </div>

    <div class="pcard-body">
      <div>
        <span class="pcard-brand">${p.brand}</span>
        <h3 class="pcard-title">${p.name}</h3>
        <p class="pcard-cpu">${p.cpu}</p>
      </div>

      <div class="chips">
        <span class="chip">${icon('cpu')} ${p.ram}</span>
        <span class="chip">${icon('box')} ${p.storage}</span>
        <span class="chip">${icon('monitor')} ${p.screen}</span>
      </div>

      <div class="batt">
        <div class="batt-top"><span>Santé batterie</span><b>${p.battery} %</b></div>
        <div class="batt-bar"><div class="batt-fill" data-fill="${p.battery}"></div></div>
      </div>

      ${verificationBlock(p)}

      <div class="pcard-foot">
        <div class="price-row">
          <div>
            <span class="price">${p.price.toLocaleString('fr-FR')}<span class="cur">DH</span></span>
            <span class="price-old">${p.oldPrice.toLocaleString('fr-FR')} DH</span>
          </div>
          <span class="save-tag">−${Math.round((1 - p.price / p.oldPrice) * 100)} %</span>
        </div>
        ${btn}
        ${out ? `<span class="small muted center">Déjà vendu — envoyez-nous un message, on cherche un équivalent.</span>` : ''}
      </div>
    </div>
  </article>`;
}

function renderGrid(target, list) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  el.innerHTML = list.map(productCard).join('');
  observeReveals(el);
}

/* ---------- 4. Fiche de vérification : accordéon ------------------------ */
function initVerifAccordion() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.verif-toggle');
    if (!btn) return;
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    panel.hidden = open;
    if (!open) {
      panel.style.animation = 'none';
      void panel.offsetWidth;
      panel.style.animation = '';
      fillBars(panel);
    }
  });
}

/* ---------- 5. Boutique : filtres, recherche, tri ------------------------ */
const BUDGETS = {
  low:  { label: 'Moins de 3 000 DH',   hint: 'Entrée de gamme & bureautique', test: p => p.price < 3000 },
  mid:  { label: '3 000 – 5 000 DH',   hint: 'Le meilleur rapport qualité/prix', test: p => p.price >= 3000 && p.price <= 5000 },
  high: { label: 'Plus de 5 000 DH',   hint: 'Gaming, Apple & haut de gamme', test: p => p.price > 5000 }
};

function initShop() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  const search = document.getElementById('shopSearch');
  const sortSel = document.getElementById('shopSort');
  const catSel = document.getElementById('shopCat');
  const brandWrap = document.getElementById('shopBrands');
  const countEl = document.getElementById('shopCount');
  const resetBtn = document.getElementById('shopReset');
  const emptyEl = document.getElementById('shopEmpty');

  let budget = '';
  let brand = 'all';

  // Génération des puces de marque depuis le catalogue
  const brands = [...new Set(LAPTOPS.map(p => p.brand))].sort((a, b) => a.localeCompare(b, 'fr'));
  brandWrap.innerHTML = ['all'].concat(brands).map(b =>
    `<button class="fchip${b === 'all' ? ' active' : ''}" type="button" data-brand="${b}">
       ${b === 'all' ? 'Toutes les marques' : b}
     </button>`).join('');

  // Génération des options de catégorie
  const cats = [...new Set(LAPTOPS.map(p => p.cat))];
  catSel.innerHTML = '<option value="all">Toutes les catégories</option>' +
    cats.map(c => `<option value="${c}">${c}</option>`).join('');

  function apply(scroll) {
    const q = (search.value || '').trim().toLowerCase();
    let list = LAPTOPS.filter(p => {
      const okB = !budget || BUDGETS[budget].test(p);
      const okR = brand === 'all' || p.brand === brand;
      const okC = catSel.value === 'all' || p.cat === catSel.value;
      const okQ = !q || (p.name + ' ' + p.brand + ' ' + p.cat + ' ' + p.cpu + ' ' +
        p.ram + ' ' + p.storage).toLowerCase().includes(q);
      return okB && okR && okC && okQ;
    });

    const sort = sortSel.value;
    if (sort === 'asc') list = list.slice().sort((a, b) => a.price - b.price);
    if (sort === 'desc') list = list.slice().sort((a, b) => b.price - a.price);
    if (sort === 'batt') list = list.slice().sort((a, b) => b.battery - a.battery);

    grid.innerHTML = list.length
      ? list.map(productCard).join('')
      : '';
    emptyEl.hidden = list.length > 0;
    observeReveals(grid);

    countEl.innerHTML = '<b>' + list.length + '</b> PC' +
      (list.length > 1 ? 's' : '') + ' trouvé' + (list.length > 1 ? 's' : '') +
      (budget ? ' · budget ' + BUDGETS[budget].label : '');

    if (scroll) {
      const top = grid.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  /* Budget quick-filter */
  document.querySelectorAll('.budget-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.budget;
      const already = budget === key;
      budget = already ? '' : key;
      document.querySelectorAll('.budget-card').forEach(c => {
        c.classList.toggle('active', c.dataset.budget === budget);
      });
      apply(true);
      if (already && history.replaceState) {
        history.replaceState(null, '', location.pathname);
      }
    });
  });

  brandWrap.addEventListener('click', (e) => {
    const chip = e.target.closest('.fchip[data-brand]');
    if (!chip) return;
    brand = chip.dataset.brand;
    brandWrap.querySelectorAll('.fchip').forEach(c =>
      c.classList.toggle('active', c === chip));
    apply(false);
  });

  let t;
  search.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => apply(false), 180);
  });
  catSel.addEventListener('change', () => apply(false));
  sortSel.addEventListener('change', () => apply(false));
  resetBtn.addEventListener('click', () => {
    budget = ''; brand = 'all';
    search.value = '';
    catSel.value = 'all';
    sortSel.value = 'featured';
    document.querySelectorAll('.budget-card').forEach(c => c.classList.remove('active'));
    brandWrap.querySelectorAll('.fchip').forEach(c =>
      c.classList.toggle('active', c.dataset.brand === 'all'));
    apply(false);
  });

  // Budget transmis depuis l'accueil : ?budget=low
  const wanted = new URLSearchParams(location.search).get('budget');
  if (wanted && BUDGETS[wanted]) {
    budget = wanted;
    document.querySelectorAll('.budget-card').forEach(c =>
      c.classList.toggle('active', c.dataset.budget === budget));
    setTimeout(() => {
      const top = grid.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }, 260);
  }

  apply(false);
}

/* ---------- 6. Formulaire de contact ----------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const lines = [
      'Bonjour Electro PC 👋',
      'Message depuis le site :',
      '',
      'Nom : ' + (data.nom || '—'),
      'Téléphone : ' + (data.tel || '—'),
      'Email : ' + (data.email || '—'),
      'Sujet : ' + (data.sujet || '—'),
      '',
      data.message || ''
    ].join('\n');
    window.open(SITE.whatsapp + '?text=' + encodeURIComponent(lines), '_blank', 'noopener');
    Cart.toast('Message envoyé via WhatsApp — répondez vite 😉', 'ok');
    form.reset();
  });
}

/* ---------- 7. Bandeau, images, footer, transition --------------------- */
function initTicker() {
  document.querySelectorAll('[data-ticker]').forEach(track => {
    if (track.children.length < 2) {
      const clone = track.firstElementChild.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
  });
}

/* Fondu d'apparition des images + repli visuel */
function initImages() {
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth) img.classList.add('loaded');
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });
}

function initFooter() {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* Transition de page douce */
function initPageTransition() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('tel:') || href.startsWith('mailto:') ||
        a.target === '_blank' || href.endsWith('.pdf')) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => { location.href = href; }, 170);
  });
}

/* ---------- Initialisation --------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initTicker();
  initImages();
  initVerifAccordion();
  initShop();
  initContactForm();
  initFooter();
  initReveal();
  // Page d'accueil : injection des PC en vedette
  const featured = document.getElementById('featuredGrid');
  if (featured) renderGrid(featured, LAPTOPS.slice(0, 8));
  // Avis clients
  const revBox = document.getElementById('reviewGrid');
  if (revBox) {
    revBox.innerHTML = REVIEWS.map((r, i) => `
      <article class="review reveal" data-d="${i + 1}">
        <div class="stars" aria-label="Note : ${r.rating} sur 5">
          ${Array.from({ length: 5 }, (_, s) =>
            `<svg viewBox="0 0 24 24" fill="${s < r.rating ? 'currentColor' : 'none'}" stroke="currentColor"
              stroke-width="1.6" stroke-linejoin="round" class="${s < r.rating ? '' : 'off'}">
              ${ICONS.star}</svg>`).join('')}
        </div>
        <p class="review-text">${r.text}</p>
        <div class="review-foot">
          <span class="review-avatar">${r.name.charAt(0)}</span>
          <div>
            <div class="review-name">${r.name}</div>
            <div class="review-meta">${r.city} · ${r.date}</div>
          </div>
          <span class="verified" style="margin-left:auto">${icon('check')} Achat vérifié</span>
        </div>
      </article>`).join('');
    observeReveals(revBox);
  }
  // Statistiques
  const statBox = document.getElementById('statsGrid');
  if (statBox) {
    statBox.innerHTML = STATS.map((s, i) => `
      <div class="stat reveal" data-d="${i + 1}">
        <span class="stat-num" data-count="${s.value}" data-suffix="${s.suffix}">0</span>
        <span class="stat-label">${s.label}</span>
      </div>`).join('');
    observeReveals(statBox);
  }
  initPageTransition();
});