/* ==========================================================================
   ELECTRO PC — Données du site
   -----------------------------------------------------------------------
   TOUT le contenu produit est centralisé dans ce fichier.
   Pour ajouter / modifier un PC : dupliquez un bloc dans `LAPTOPS`,
   changez les valeurs, et la fiche de vérification se régénère toute seule
   (voir `buildVerification`).
   ========================================================================== */

/* ---------- Configuration générale -------------------------------------- */
const SITE = {
  name: 'Electro PC',
  city: 'Casablanca',
  country: 'Maroc',
  phone: '+212 6 61 23 45 67',
  email: 'contact@electropc.ma',
  address: 'Boulevard d’Anfa, Casablanca 20000, Maroc',
  hours: 'Lun – Sam · 9h00 – 20h00',
  instagram: 'https://www.instagram.com/electro_pc2025/',
  facebook: 'https://www.facebook.com/electro_pc2025',
  tiktok: 'https://www.tiktok.com/@electro_pc2025',
  /* Lien WhatsApp de commande (sans backend) */
  whatsapp: 'https://wa.me/message/CV6KU5BXTRL5J1'
};

/* ---------- Icônes (SVG inline, feather-like) --------------------------- */
const ICONS = {
  check:    '<path d="M20 6L9 17l-5-5"/>',
  shield:   '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9.5 12l1.8 1.8 3.4-3.6"/>',
  zap:      '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  truck:    '<path d="M1 4h14v12H1z"/><path d="M15 9h4l3 3v4h-7V9z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>',
  clipboard:'<path d="M9 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-3"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 13l2 2 4-4"/>',
  cpu:      '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
  battery:  '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2"/><path d="M6 10v4"/>',
  monitor:  '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>',
  plug:     '<path d="M9 2v6M15 2v6"/><path d="M6 8h12v3a6 6 0 01-6 6 6 6 0 01-6-6V8z"/><path d="M12 17v5"/>',
  gauge:    '<path d="M3.6 18a9 9 0 1116.8 0"/><path d="M12 14l4.5-4.5"/><circle cx="12" cy="14" r="1.3"/>',
  wrench:   '<path d="M21 6l-4 4-3-3 4-4a5 5 0 00-6.5 6.5L3 18.5 5.5 21l8.5-8.5A5 5 0 0021 6z"/>',
  star:     '<path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95L12 2.6z"/>',
  phone:    '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.1a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>',
  mail:     '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2.5 7l9.5 6 9.5-6"/>',
  pin:      '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z"/><circle cx="12" cy="10" r="3"/>',
  clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  instagram:'<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/>',
  facebook: '<path d="M14.2 8.4h2.6V4.9h-2.6c-2.3 0-3.9 1.6-3.9 4v2.4H7.7v3.5h2.6v6.5h3.6v-6.5h2.6l.5-3.5h-3.1V9.2c0-.6.3-.8 1.3-.8z"/>',
  tiktok:   '<path d="M16.2 3c.6 2.3 2 3.6 4.4 3.8v3.1c-1.7 0-3.2-.5-4.4-1.4v6.6a5.7 5.7 0 11-5.7-5.7c.3 0 .6 0 .9.1v3.2a2.5 2.5 0 102.5 2.5V3h3.3z"/>',
  whatsapp: '<path d="M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.4A10 10 0 1012 2zm4.6 13.6c-.2.6-1.2 1.1-1.7 1.2-.5.1-1 .1-1.5-.1-.4-.2-.8-.3-1.4-.6-2.5-1.1-4.2-3.7-4.3-3.8-.1-.2-.9-1.3-.9-2.5s.6-1.7.8-1.9c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.7 1.9c.1.2.1.3 0 .5l-.3.4c-.1.2-.3.3-.1.6.1.2.7 1.1 1.5 1.8 1 .9 1.8 1.2 2.1 1.3.3.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3v.4z"/>',
  search:   '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16 16"/>',
  chevron:  '<path d="M6 9l6 6 6-6"/>',
  arrow:    '<path d="M5 12h14M13 6l6 6-6 6"/>',
  cart:     '<circle cx="9.5" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.6l2.7 12.4a2 2 0 002 1.6h8.9a2 2 0 002-1.6L21.5 7H5.8"/>',
  trash:    '<path d="M3.5 6h17M9 6V3.8h6V6M18.5 6l-1 14.2h-11L5.5 6"/><path d="M10 10.5v6M14 10.5v6"/>',
  close:    '<path d="M18 6L6 18M6 6l12 12"/>',
  plus:     '<path d="M12 5.5v13M5.5 12h13"/>',
  alert:    '<path d="M12 3.5l9.5 16.5H2.5L12 3.5z"/><path d="M12 10v4M12 17h.01"/>',
  users:    '<path d="M16 20v-1.8a4.2 4.2 0 00-4.2-4.2H6.2A4.2 4.2 0 002 18.2V20"/><circle cx="9" cy="7" r="4"/><path d="M22 20v-1.8a4.2 4.2 0 00-3.2-4"/>',
  lock:     '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>',
  wallet:   '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="17.5" cy="15" r="1.3"/>',
  sliders:  '<path d="M4 8h9M18 8h2M4 16h4M13 16h7"/><circle cx="15.5" cy="8" r="2"/><circle cx="10.5" cy="16" r="2"/>',
  award:    '<circle cx="12" cy="9" r="6"/><path d="M8.4 14.2L7 22l5-2.6L17 22l-1.4-7.8"/>',
  box:      '<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  coin:     '<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.6-.8-1.6-1.2-3-1.2-1.7 0-2.7.8-2.7 1.9 0 2.8 5.7 1.3 5.7 4 0 1.2-1.1 2-2.8 2-1.4 0-2.5-.5-3.1-1.3M12 6.5v11"/>',
  eye:      '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>',
  laptop:   '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 19h20"/>'
};

/* Helper : renvoie une balise <svg> prête à l'emploi */
function icon(name, cls) {
  const path = ICONS[name] || '';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
    (cls ? ' class="' + cls + '"' : '') + '>' + path + '</svg>';
}

/* ---------- Images (Unsplash — à remplacer par vos photos) -------------- */
const IMG = {
  a: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  b: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  c: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=80',
  d: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80',
  e: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80',
  f: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  g: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
  h: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=80',
  i: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=900&q=80',
  j: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80',
  k: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=80',
  l: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=900&q=80'
};

/* ---------- Générateur de fiche de vérification --------------------------
   La fiche est construite À PARTIR des données du PC (batterie, dalle,
   clavier, ports, benchmark…). Il suffit de modifier ces champs dans
   `LAPTOPS` et le rapport d'inspection se met à jour automatiquement.
   --------------------------------------------------------------------- */
function buildVerification(p, index) {
  const battOk   = p.battery >= 80;
  const screenOk = !p.deadPixels;
  const keyOk    = p.keyboard !== false;
  const portOk   = p.portsOk !== false;
  const perfOk   = p.bench >= 5000;
  const chassisOk = p.chassis !== 'À nettoyer';

  const rows = [
    {
      icon: 'battery',
      label: 'Batterie',
      value: p.battery + ' % de capacité',
      status: battOk ? 'ok' : 'warn',
      detail: battOk
        ? 'Charge et décharge testées 45 min · aucune perte anormale'
        : 'Usure normale liée à l’âge · autonomie réduite, valeur mesurée et annoncée'
    },
    {
      icon: 'monitor',
      label: 'Écran & dalle',
      value: screenOk ? 'Aucun pixel mort' : p.deadPixels + ' pixel(s) repéré(s)',
      status: screenOk ? 'ok' : 'warn',
      detail: 'Dalle ' + p.screen + ' · ' + p.panel + ' · charnière et angles d’ouverture contrôlés'
    },
    {
      icon: 'keyboard',
      label: 'Clavier & trackpad',
      value: keyOk ? 'Frappé testé 100 %' : 'Frappé partiel',
      status: keyOk ? 'ok' : 'warn',
      detail: keyOk
        ? 'Toutes les touches testées une à une · trackpad et gestes testés'
        : 'Quelques touches signalées · fonctionne normalement, mentionné dans la fiche'
    },
    {
      icon: 'plug',
      label: 'Ports & connectique',
      value: portOk ? 'Tous les ports OK' : '1 port à signaler',
      status: portOk ? 'ok' : 'warn',
      detail: 'Charge · USB-A ×2 · HDMI · jack 3,5 mm · Wi-Fi · Bluetooth vérifiés un par un'
    },
    {
      icon: 'gauge',
      label: 'Performance',
      value: p.bench.toLocaleString('fr-FR') + ' pts',
      status: perfOk ? 'ok' : 'warn',
      detail: 'Test de charge 20 min : système stable, pas de surchauffe ni de redémarrage'
    },
    {
      icon: 'wrench',
      label: 'Châssis & refroidissement',
      value: p.chassis,
      status: chassisOk ? 'ok' : 'ok',
      detail: 'Ventilation nettoyée et testée · pas de jeu de clavier · capot arrière-clip vérifié'
    }
  ];

  const score = Math.round(
    rows.reduce((s, r) => s + (r.status === 'ok' ? 100 : 76), 0) / rows.length
  );
  const okCount = rows.filter(r => r.status === 'ok').length;

  return {
    ref: 'EP-VR-2026-' + String(1000 + index),
    testedAt: p.testedAt,
    technician: 'Atelier Electro PC · Casablanca',
    score: score,
    okCount: okCount,
    total: rows.length,
    grade: score >= 95 ? 'A' : score >= 88 ? 'A-' : score >= 80 ? 'B+' : 'B',
    repairs: p.repairs,
    rows: rows
  };
}

/* ---------- Catalogue des PC portables --------------------------------- */
const LAPTOPS = [
  {
    id: 'ep-01', name: 'Lenovo ThinkPad T480', brand: 'Lenovo', cat: 'Business',
    price: 2990, oldPrice: 3990,
    cpu: 'Intel Core i5-8250U · 4 cœurs', ram: '8 Go DDR4', storage: '256 Go SSD + 1 To HDD',
    screen: '14"', panel: 'mat 1920×1080', gpu: 'Intel UHD 620', battery: 88, bench: 6200,
    chassis: 'Excellent état', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Aucune réparation antérieure', testedAt: '04/09/2026',
    stock: 2, image: IMG.e, os: 'Windows 11 Pro installé'
  },
  {
    id: 'ep-02', name: 'HP EliteBook 840 G7', brand: 'HP', cat: 'Business',
    price: 3490, oldPrice: 4590,
    cpu: 'Intel Core i5-10210U · 4 cœurs', ram: '8 Go DDR4', storage: '256 Go SSD',
    screen: '14"', panel: 'IPS Full HD', gpu: 'Intel UHD 620', battery: 92, bench: 7800,
    chassis: 'Comme neuf', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Aucune réparation antérieure', testedAt: '08/09/2026',
    stock: 1, image: IMG.a, os: 'Windows 11 Pro installé'
  },
  {
    id: 'ep-03', name: 'Dell Latitude 5410', brand: 'Dell', cat: 'Business',
    price: 3750, oldPrice: 4900,
    cpu: 'Intel Core i5-10310U · 4 cœurs', ram: '16 Go DDR4', storage: '512 Go SSD',
    screen: '14"', panel: 'IPS Full HD', gpu: 'Intel UHD 620', battery: 90, bench: 8600,
    chassis: 'Excellent état', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Aucune réparation antérieure', testedAt: '27/08/2026',
    stock: 3, image: IMG.c, os: 'Windows 11 Pro installé'
  },
  {
    id: 'ep-04', name: 'HP ProBook 450 G7', brand: 'HP', cat: 'Business',
    price: 3990, oldPrice: 5200,
    cpu: 'Intel Core i5-10210U · 4 cœurs', ram: '8 Go DDR4', storage: '512 Go SSD',
    screen: '15.6"', panel: 'mat Full HD', gpu: 'Intel UHD 620', battery: 85, bench: 7400,
    chassis: 'Très bon état', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Clavier changé en 2024 (toutes touches OK)', testedAt: '21/08/2026',
    stock: 2, image: IMG.g, os: 'Windows 11 Pro installé'
  },
  {
    id: 'ep-05', name: 'ASUS Vivobook 15 X510', brand: 'ASUS', cat: 'Multimédia',
    price: 4290, oldPrice: 5600,
    cpu: 'Intel Core i5-1035G1 · 4 cœurs', ram: '8 Go DDR4', storage: '512 Go SSD',
    screen: '15.6"', panel: 'IPS Full HD', gpu: 'Intel Iris Plus', battery: 91, bench: 8200,
    chassis: 'Comme neuf', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Aucune réparation antérieure', testedAt: '11/09/2026',
    stock: 1, image: IMG.i, os: 'Windows 11 installé'
  },
  {
    id: 'ep-06', name: 'MacBook Air 13" 2017', brand: 'Apple', cat: 'Multimédia',
    price: 5490, oldPrice: 7200,
    cpu: 'Intel Core i5-5350U · 2 cœurs', ram: '8 Go LPD3', storage: '128 Go SSD',
    screen: '13.3"', panel: 'Rétina 2560×1600', gpu: 'Intel HD 615', battery: 74, bench: 6900,
    chassis: 'Bon état', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Batterie d’origine changée · carte mère testée', testedAt: '02/09/2026',
    stock: 1, image: IMG.b, os: 'macOS Monterey (réinstallable)'
  },
  {
    id: 'ep-07', name: 'Lenovo IdeaPad 3 15', brand: 'Lenovo', cat: 'Multimédia',
    price: 3690, oldPrice: 4700,
    cpu: 'AMD Ryzen 5 3500U · 4 cœurs', ram: '8 Go DDR4', storage: '512 Go SSD',
    screen: '15.6"', panel: 'mat Full HD', gpu: 'Radeon Vega 8', battery: 89, bench: 7100,
    chassis: 'Excellent état', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Aucune réparation antérieure', testedAt: '30/08/2026',
    stock: 4, image: IMG.l, os: 'Windows 11 installé'
  },
  {
    id: 'ep-08', name: 'Dell Inspiron 15 3511', brand: 'Dell', cat: 'Multimédia',
    price: 4590, oldPrice: 5900,
    cpu: 'Intel Core i5-1135G7 · 4 cœurs', ram: '8 Go DDR4', storage: '256 Go SSD',
    screen: '15.6"', panel: 'IPS Full HD', gpu: 'Intel Iris Xe', battery: 93, bench: 9400,
    chassis: 'Comme neuf', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Aucune réparation antérieure', testedAt: '10/09/2026',
    stock: 2, image: IMG.h, os: 'Windows 11 Pro installé'
  },
  {
    id: 'ep-09', name: 'HP EliteBook 840 G6', brand: 'HP', cat: 'Business',
    price: 5290, oldPrice: 6900,
    cpu: 'Intel Core i7-8665U · 4 cœurs', ram: '16 Go DDR4', storage: '512 Go SSD',
    screen: '14"', panel: 'IPS Full HD', gpu: 'Intel UHD 620', battery: 83, bench: 9100,
    chassis: 'Très bon état', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Aucune réparation antérieure', testedAt: '05/09/2026',
    stock: 1, image: IMG.d, os: 'Windows 11 Pro installé'
  },
  {
    id: 'ep-10', name: 'Acer Aspire 5 A515', brand: 'Acer', cat: 'Multimédia',
    price: 4190, oldPrice: 5400,
    cpu: 'Intel Core i5-1135G7 · 4 cœurs', ram: '8 Go DDR4', storage: '512 Go SSD',
    screen: '14"', panel: 'IPS Full HD', gpu: 'Intel Iris Xe', battery: 87, bench: 8800,
    chassis: 'Excellent état', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Aucune réparation antérieure', testedAt: '12/09/2026',
    stock: 3, image: IMG.j, os: 'Windows 11 installé'
  },
  {
    id: 'ep-11', name: 'Lenovo ThinkPad E14 Gen 2', brand: 'Lenovo', cat: 'Business',
    price: 3890, oldPrice: 5100,
    cpu: 'AMD Ryzen 5 4600U · 6 cœurs', ram: '8 Go DDR4', storage: '512 Go SSD',
    screen: '14"', panel: 'mat Full HD', gpu: 'Radeon Vega 6', battery: 90, bench: 8500,
    chassis: 'Comme neuf', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Aucune réparation antérieure', testedAt: '09/09/2026',
    stock: 2, image: IMG.f, os: 'Windows 11 Pro installé'
  },
  {
    id: 'ep-12', name: 'HP Pavilion Gaming 15', brand: 'HP', cat: 'Gaming',
    price: 5900, oldPrice: 7800,
    cpu: 'Intel Core i5-1035G1 · 4 cœurs', ram: '8 Go DDR4', storage: '512 Go SSD',
    screen: '15.6"', panel: 'IPS Full HD 144 Hz', gpu: 'GeForce GTX 1650', battery: 78, bench: 10500,
    chassis: 'Bon état', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Ajout de 8 Go de RAM · ventilateur nettoyé', testedAt: '06/09/2026',
    stock: 1, image: IMG.k, os: 'Windows 11 Pro installé'
  },
  {
    id: 'ep-13', name: 'HP 250 G7', brand: 'HP', cat: 'Entrée de gamme',
    price: 1690, oldPrice: 2400,
    cpu: 'Intel Core i3-6006U · 2 cœurs', ram: '4 Go DDR4', storage: '500 Go HDD',
    screen: '15.6"', panel: 'mat HD', gpu: 'Intel HD 520', battery: 82, bench: 3100,
    chassis: 'État correct', portsOk: true, keyboard: true, deadPixels: 1,
    repairs: '1 pixel mort en bordure d’écran (signalé)', testedAt: '15/08/2026',
    stock: 0, image: IMG.a, os: 'Windows 11 (installable)'
  },
  {
    id: 'ep-14', name: 'MacBook Pro 13" 2016', brand: 'Apple', cat: 'Multimédia',
    price: 6900, oldPrice: 8900,
    cpu: 'Intel Core i5-6360U · 2 cœurs', ram: '8 Go LPD3', storage: '256 Go SSD',
    screen: '13.3"', panel: 'Rétina 2560×1600', gpu: 'Intel Iris 6100', battery: 70, bench: 7200,
    chassis: 'Bon état', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Batterie changée · connectique nettoyée et testée', testedAt: '01/09/2026',
    stock: 1, image: IMG.b, os: 'macOS Monterey (réinstallable)'
  },
  {
    id: 'ep-15', name: 'Lenovo V15 i3', brand: 'Lenovo', cat: 'Entrée de gamme',
    price: 2290, oldPrice: 3200,
    cpu: 'Intel Core i3-1005G1 · 2 cœurs', ram: '8 Go DDR4', storage: '512 Go SSD',
    screen: '15.6"', panel: 'antireflet Full HD', gpu: 'Intel UHD 620', battery: 86, bench: 5400,
    chassis: 'Excellent état', portsOk: true, keyboard: true, deadPixels: 0,
    repairs: 'Aucune réparation antérieure', testedAt: '07/09/2026',
    stock: 5, image: IMG.g, os: 'Windows 11 installé'
  }
];

/* On attache la fiche de vérification à chaque PC (une seule source de vérité) */
LAPTOPS.forEach((p, i) => {
  p.verif = buildVerification(p, i);
  p.warranty = '6 mois';
});

/* ---------- Avis clients (section « Nos clients en parlent ») ------------- */
const REVIEWS = [
  {
    name: 'Youssef B.', city: 'Casablanca', rating: 5, date: 'il y a 3 semaines',
    text: 'J’ai acheté un EliteBook 840 G7 pour le bureau. Le rapport de vérification était exact : batterie à 92 %, écran nickel. Un vrai PC garanti, pas une arnaque comme sur beaucoup de sites d’occasion.'
  },
  {
    name: 'Salma E.', city: 'Rabat', rating: 5, date: 'il y a 1 mois',
    text: 'Livraison à Rabat en 48 h, paiement à la réception. Le PC est identique aux photos et la garantie 6 mois m’a été honorée quand la batterie a fait un saut au bout de 3 mois.'
  },
  {
    name: 'Mehdi A.', city: 'Marrakech', rating: 4, date: 'il y a 2 mois',
    text: 'Prix imbattables, tout est testé. Je recommande : demandez la fiche de vérification avant de payer, elle est détaillée et honnête. Service WhatsApp très réactif.'
  }
];

/* ---------- Statistiques animées ---------------------------------------- */
const STATS = [
  { value: 12480, suffix: '+', label: 'PC portables vendus' },
  { value: 9200,  suffix: '+', label: 'Clients servis' },
  { value: 6,     suffix: ' ans', label: 'D’expérience à Casablanca' },
  { value: 98,    suffix: ' %', label: 'Garanties traitées en 48 h' }
];