/* ==========================================================================
   ELECTRO PC — Panier (localStorage) + commande WhatsApp
   -----------------------------------------------------------------------
   Fonctionne sur toutes les pages : le tiroir (drawer) est injecté
   automatiquement dans la page, les articles sont stockés dans
   localStorage => le panier persiste entre les pages et les sessions.
   ========================================================================== */

const Cart = (() => {
  const KEY = 'electro_pc_cart_v1';
  const MAX = 99;

  /* ---------- Utilitaires ---------------------------------------------- */
  const nf = new Intl.NumberFormat('fr-FR');
  const fmt = (n) => nf.format(Math.round(n));
  const getProduct = (id) => LAPTOPS.find(p => p.id === id);
  const isUnique = (p) => p.stock <= 1; // unités physiques uniques

  /* ---------- État (localStorage) -------------------------------------- */
  let items = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      items = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(items)) items = [];
      // On purge les produits introuvables ou en rupture
      items = items.filter(it => {
        const p = getProduct(it.id);
        return p && p.stock > 0 && it.qty > 0;
      });
    } catch (e) {
      items = [];
    }
    save();
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); }
    catch (e) { /* mode privé : on continue sans persistance */ }
  }

  /* ---------- Injection du tiroir dans la page ------------------------- */
  function inject() {
    if (document.getElementById('cartDrawer')) return;

    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="cart-overlay" id="cartOverlay" hidden></div>
      <aside class="cart-drawer" id="cartDrawer" role="dialog" aria-modal="true"
             aria-label="Votre panier" aria-hidden="true">
        <div class="cart-grip" aria-hidden="true"></div>

        <div class="cart-head">
          <h3>Votre panier</h3>
          <span class="ch-count" id="cartCountLabel">0 article</span>
          <button class="cart-close" id="cartClose" aria-label="Fermer le panier">
            ${icon('close')}
          </button>
        </div>

        <div class="cart-reminder">
          ${icon('shield')}
          <span>Chaque PC inclut la <b>garantie 6 mois</b> et sa fiche de vérification.</span>
        </div>

        <div class="cart-items" id="cartItems"></div>

        <div class="cart-foot" id="cartFoot" hidden>
          <div class="cart-line">
            <span>Sous-total (<span id="cartQty">0</span> PC)</span>
            <span id="cartSubtotal">0 DH</span>
          </div>
          <div class="cart-line">
            <span>Livraison</span>
            <span>Partout au Maroc</span>
          </div>
          <div class="cart-total">
            <span class="ct-label">Total</span>
            <span class="ct-val" id="cartTotal">0 <span class="cur">DH</span></span>
          </div>
          <button class="btn btn-wa btn-block btn-lg" id="cartOrder">
            ${icon('whatsapp')} Commander via WhatsApp
          </button>
          <div class="cart-trust">
            <span class="warranty-badge">${icon('shield')} Garantie 6 mois</span>
            <span class="pill-note">${icon('truck')} Livraison Maroc</span>
            <span class="pill-note">${icon('wallet')} Paiement à la livraison</span>
          </div>
        </div>
      </aside>
    `;
    document.body.appendChild(wrap);

    drawer = document.getElementById('cartDrawer');
    overlay = document.getElementById('cartOverlay');
    itemsBox = document.getElementById('cartItems');
    footBox = document.getElementById('cartFoot');

    overlay.addEventListener('click', close);
    document.getElementById('cartClose').addEventListener('click', close);
    document.getElementById('cartOrder').addEventListener('click', orderViaWhatsApp);
    itemsBox.addEventListener('click', onItemAction);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });
  }

  let drawer = null, overlay = null, itemsBox = null, footBox = null;

  /* ---------- Ouverture / fermeture ------------------------------------ */
  function open() {
    if (!drawer) inject();
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.classList.add('no-scroll');
    render();
  }

  function close() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
    setTimeout(() => { if (!drawer.classList.contains('open')) overlay.hidden = true; }, 300);
    document.body.classList.remove('no-scroll');
  }

  /* ---------- Rendu ----------------------------------------------------- */
  function totalQty() {
    return items.reduce((s, it) => s + it.qty, 0);
  }

  function totalPrice() {
    return items.reduce((s, it) => {
      const p = getProduct(it.id);
      return s + (p ? p.price * it.qty : 0);
    }, 0);
  }

  function thumbHTML(p) {
    return p.image
      ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.remove()">`
      : '';
  }

  function itemHTML(it) {
    const p = getProduct(it.id);
    const max = Math.min(MAX, p.stock);
    return `
      <div class="cart-item" data-id="${p.id}">
        <div class="ci-thumb">
          ${thumbHTML(p)}
          ${!p.image ? icon('laptop') : ''}
        </div>
        <div class="ci-body">
          <div class="ci-name">${p.name}</div>
          <div class="ci-spec">${p.ram} · ${p.storage} · ${p.screen}</div>
          <div class="ci-row">
            <span class="warranty-badge">${icon('shield')} Garanti 6 mois</span>
          </div>
          <div class="ci-row">
            <div class="qty">
              <button data-act="dec" aria-label="Retirer une unité"
                ${it.qty <= 1 ? 'disabled' : ''}>${icon('minus')}</button>
              <span>${it.qty}</span>
              <button data-act="inc" aria-label="Ajouter une unité"
                ${it.qty >= max ? 'disabled' : ''}>${icon('plus')}</button>
            </div>
            <span class="ci-price">${fmt(p.price * it.qty)} <span class="ci-unit">DH</span></span>
          </div>
          <div class="ci-row">
            <span class="ci-lock">${icon('clipboard')} Fiche de vérification incluse</span>
            <button class="ci-remove" data-act="rm" style="margin-left:auto">
              ${icon('trash')} Retirer
            </button>
          </div>
          ${isUnique(p) && it.qty === 1
            ? '<div class="ci-unit">Unité unique — verrouillée après confirmation</div>' : ''}
        </div>
      </div>`;
  }

  function render(bump) {
    if (!itemsBox) return;

    if (!items.length) {
      itemsBox.innerHTML = `
        <div class="cart-empty">
          <div class="ce-ico">${icon('cart')}</div>
          <h4>Votre panier est vide</h4>
          <p>Parcourez nos PC testés, ouvrez la fiche de vérification, puis ajoutez le vôtre.</p>
          <a class="btn btn-primary" href="shop.html" data-close-cart>Voir les PC disponibles</a>
        </div>`;
      footBox.hidden = true;
    } else {
      itemsBox.innerHTML = items.map(itemHTML).join('');
      footBox.hidden = false;
      document.getElementById('cartQty').textContent = totalQty();
      document.getElementById('cartSubtotal').textContent = fmt(totalPrice()) + ' DH';
      document.getElementById('cartTotal').innerHTML = fmt(totalPrice()) + ' <span class="cur">DH</span>';
      const n = totalQty();
      document.getElementById('cartCountLabel').textContent =
        n === 1 ? '1 article' : n + ' articles';
    }
    updateBadges(!!bump);
  }

  /* Badge du navbar (mis à jour sur toutes les pages) */
  function updateBadges(bump) {
    const n = totalQty();
    document.querySelectorAll('[data-cart-badge]').forEach(el => {
      const prev = el.textContent;
      el.textContent = n;
      el.setAttribute('data-count', n);
      if (bump && prev !== String(n)) {
        el.classList.remove('bump');
        void el.offsetWidth;
        el.classList.add('bump');
      }
    });
    document.querySelectorAll('[data-cart-btn]').forEach(btn => {
      if (bump) {
        btn.classList.remove('bump');
        void btn.offsetWidth;
        btn.classList.add('bump');
      }
    });
  }

  /* ---------- Actions utilisateur --------------------------------------- */
  function onItemAction(e) {
    const btn = e.target.closest('[data-act]');
    const closeLink = e.target.closest('[data-close-cart]');
    if (closeLink) { close(); return; }
    if (!btn) return;

    const id = btn.closest('.cart-item').dataset.id;
    const p = getProduct(id);
    const it = items.find(i => i.id === id);
    if (!it || !p) return;

    if (btn.dataset.act === 'inc') {
      if (it.qty >= p.stock) {
        toast('Stock limité : il ne reste que ' + p.stock + ' unité(s) de ce PC.', 'err');
        return;
      }
      it.qty += 1;
    } else if (btn.dataset.act === 'dec') {
      it.qty -= 1;
      if (it.qty <= 0) return remove(id);
    } else if (btn.dataset.act === 'rm') {
      return remove(id);
    }
    save();
    render();
  }

  function add(id) {
    const p = getProduct(id);
    if (!p) return;
    if (p.stock <= 0) {
      toast('Ce PC est épuisé pour le moment.', 'err');
      return;
    }
    let it = items.find(i => i.id === id);
    if (!it) {
      it = { id: id, qty: 1 };
      items.push(it);
    } else if (it.qty < p.stock) {
      it.qty += 1;
    } else {
      toast('Stock limité : ' + p.stock + ' unité(s) maximum pour ce PC.', 'err');
      return;
    }
    save();
    render(true);
    toast(p.name + ' ajouté au panier', 'ok');
    if (window.innerWidth < 900) open(); // mobile : on ouvre le tiroir pour confirmer
  }

  function remove(id) {
    const row = itemsBox.querySelector('.cart-item[data-id="' + id + '"]');
    const done = () => {
      items = items.filter(i => i.id !== id);
      save();
      render();
    };
    if (row) {
      row.classList.add('removing');
      setTimeout(done, 240);
    } else done();
  }

  function clear() {
    items = [];
    save();
    render();
  }

  /* ---------- Commande WhatsApp ----------------------------------------- */
  function buildMessage() {
    const lines = items.map(it => {
      const p = getProduct(it.id);
      return '- PC Portable ' + p.name + ' (' + p.ram + ' / ' + p.storage + ' / ' + p.screen + ')' +
        '\n   x' + it.qty + ' — ' + fmt(p.price * it.qty) + ' DH' +
        '\n   Garantie 6 mois · Fiche de vérification n° ' + p.verif.ref +
        (it.qty > 1 ? '' : ' · Unité unique');
    });

    return 'Bonjour Electro PC 👋\n' +
      'Je souhaite commander :\n\n' +
      lines.join('\n') + '\n\n' +
      'Total : ' + fmt(totalPrice()) + ' DH\n' +
      'Livraison : partout au Maroc\n' +
      'Merci de me confirmer la disponibilité 🙏';
  }

  /* Copie dans le presse-papier.
     `navigator.clipboard` n'existe pas en contexte non sécurisé (http://,
     file://) : on garde une méthode de repli avec un <textarea>. */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => toast('Commande préparée — message copié 📋', 'ok'),
        () => legacyCopy(text)
      );
      return;
    }
    legacyCopy(text);
  }

  function legacyCopy(text) {
    let ok = false;
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      ok = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (err) { ok = false; }
    toast(ok ? 'Commande préparée — message copié 📋'
             : 'Commande préparée — copiez le récapitulatif 📋', 'ok');
  }

  function orderViaWhatsApp() {
    if (!items.length) return;
    const msg = buildMessage();
    // On tente d'attacher le message au lien, et on le copie aussi au
    // presse-papier (au cas où WhatsApp ignore le paramètre).
    const url = SITE.whatsapp + '?text=' + encodeURIComponent(msg);
    copyText(msg);
    window.open(url, '_blank', 'noopener');
  }

  /* ---------- Toast ------------------------------------------------------ */
  let toastBox = null;
  function toast(text, type) {
    if (!toastBox) {
      toastBox = document.createElement('div');
      toastBox.className = 'toast-wrap';
      toastBox.setAttribute('role', 'status');
      document.body.appendChild(toastBox);
    }
    const el = document.createElement('div');
    el.className = 'toast ' + (type === 'err' ? 'err' : 'ok');
    el.innerHTML = `<span class="t-ico">${icon(type === 'err' ? 'alert' : 'check')}</span>
                    <span>${text}</span>`;
    toastBox.appendChild(el);
    setTimeout(() => {
      el.classList.add('hide');
      setTimeout(() => el.remove(), 300);
    }, 3200);
  }

  /* ---------- Branchement des boutons « Ajouter au panier » ------------ */
  function bindButtons() {
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add]');
      if (addBtn) {
        e.preventDefault();
        const id = addBtn.dataset.add;
        add(id);
        // Retour visuel immédiat sur le bouton
        const p = getProduct(id);
        addBtn.classList.add('is-added');
        const original = addBtn.dataset.label || addBtn.innerHTML;
        addBtn.dataset.label = original;
        addBtn.innerHTML = icon('check') + ' Ajouté au panier';
        setTimeout(() => {
          addBtn.classList.remove('is-added');
          addBtn.innerHTML = original;
        }, 1600);
        return;
      }
      const openBtn = e.target.closest('[data-cart-btn]');
      if (openBtn) {
        e.preventDefault();
        drawer && drawer.classList.contains('open') ? close() : open();
      }
    });
  }

  /* ---------- Init ------------------------------------------------------- */
  function init() {
    inject();
    load();
    bindButtons();
    render();
    // Garde le badge à jour si le panier est modifié depuis un autre onglet
    window.addEventListener('storage', (e) => {
      if (e.key === KEY) { load(); render(); }
    });
  }

  return {
    init, add, remove, clear, open, close,
    count: totalQty, total: totalPrice, render,
    message: buildMessage, order: orderViaWhatsApp, toast
  };
})();

document.addEventListener('DOMContentLoaded', Cart.init);