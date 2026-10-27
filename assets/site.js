/* uLace concept site — interactions for index.html and pdp.html */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + n.toFixed(2); };

  /* ---------- toast ---------- */
  var toast = document.createElement('div');
  toast.className = 'ul-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  var toastTimer;
  function say(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  /* ---------- cart badge ---------- */
  var badge = $('a[href="#cart"] span');
  var cartCount = badge ? parseInt(badge.textContent, 10) || 0 : 0;
  function addToCart(qty, label) {
    cartCount += qty;
    if (badge) {
      badge.textContent = cartCount;
      badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
    }
    say('Added to cart · ' + label);
  }

  /* ---------- mobile menu ---------- */
  var header = $('header'), nav = $('header nav[aria-label="Main"]');
  if (header && nav) {
    var mb = document.createElement('button');
    mb.type = 'button'; mb.className = 'menu-btn'; mb.setAttribute('aria-label', 'Menu'); mb.setAttribute('aria-expanded', 'false');
    mb.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#030303" stroke-width="2.5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
    header.insertBefore(mb, nav.nextSibling);
    mb.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { header.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---------- forms ---------- */
  $$('form[role="search"]').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); say('Search would open results here'); });
  });
  var email = $('section[aria-label="Email sign-up"] form');
  if (email) {
    email.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input[type="email"]', email);
      if (!input.value || input.value.indexOf('@') < 1) { input.focus(); say('Enter your email to get 10% off'); return; }
      email.innerHTML = '<p class="hl" style="margin:0;font-size:28px;color:#fff;">You’re in. Check your inbox for 10% off.</p>';
    });
  }

  /* ---------- generic add buttons (homepage + PDP cross-sell) ---------- */
  $$('button').forEach(function (b) {
    if (b.id) return; // PDP buy-box buttons are wired below
    var t = b.textContent.trim();
    var card = b.closest('article');
    var name = card && $('h3, .hl', card) ? $('h3, .hl', card).textContent.trim() : '';
    if (/^Add to cart$/i.test(t) && !b.closest('#sticky-bar')) {
      b.addEventListener('click', function () { addToCart(1, name || 'uLace'); });
    } else if (/^Add$/i.test(t)) {
      b.addEventListener('click', function () { addToCart(1, name || 'item'); });
    } else if (/^Build my (\d+)-pack$/i.test(t)) {
      var n = parseInt(t.match(/(\d+)/)[1], 10);
      b.addEventListener('click', function () { addToCart(n, n + '-pack bundle — choose colours at checkout'); });
    } else if (/^Load more reviews$/i.test(t)) {
      b.addEventListener('click', function () { say('Loads more reviews from Loox in the live build'); });
    }
  });

  /* ---------- review filter chips ---------- */
  $$('.js-chip').forEach(function (c) {
    c.addEventListener('click', function () {
      $$('.js-chip').forEach(function (x) { x.classList.remove('chip-ok'); x.setAttribute('aria-pressed', 'false'); });
      c.classList.add('chip-ok'); c.setAttribute('aria-pressed', 'true');
    });
  });

  /* ================= PDP only ================= */
  if (!document.getElementById('add-btn')) return;

  var state = { colour: 'Black', packs: 2, price: 12.98, qty: 1 };
  var colourImages = {
    'Black': 'assets/01-classic-black.jpg',
    'Dark Navy': 'assets/11-white-navy.jpg',
    'Scarlet Red': 'assets/12-white-red.jpg'
  };

  /* gallery */
  var mainImg = $('#main-img'), mainPh = $('#main-ph'), counter = $('#media-count');
  var thumbs = $$('.js-thumb');
  function showThumb(i) {
    var t = thumbs[i];
    thumbs.forEach(function (x) { x.classList.remove('thumb-on'); });
    t.classList.add('thumb-on');
    if (t.dataset.ph) {
      mainImg.style.display = 'none';
      mainPh.style.display = 'flex';
      mainPh.textContent = '[' + t.dataset.ph + ']';
    } else {
      mainPh.style.display = 'none';
      mainImg.style.display = 'block';
      mainImg.src = t.getAttribute('src');
      mainImg.alt = t.getAttribute('alt');
    }
    counter.textContent = (i + 1) + ' / ' + thumbs.length;
  }
  thumbs.forEach(function (t, i) {
    t.setAttribute('tabindex', '0');
    t.setAttribute('role', 'button');
    t.addEventListener('click', function () { showThumb(i); });
    t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showThumb(i); } });
  });

  /* colours */
  function pickColour(sw) {
    $$('.sw').forEach(function (x) { x.classList.remove('sw-on'); x.setAttribute('aria-checked', 'false'); });
    sw.classList.add('sw-on'); sw.setAttribute('aria-checked', 'true');
    state.colour = sw.getAttribute('title');
    $('#colour-name').textContent = state.colour;
    $('#title-colour').textContent = '— ' + state.colour;
    document.title = 'uLace Classic — ' + state.colour + ' | No-tie sneaker laces';
    var img = colourImages[state.colour];
    if (img) {
      thumbs[0].setAttribute('src', img);
      thumbs[0].setAttribute('alt', state.colour + ' uLace on white sneaker, close-up');
      $('#sticky-img').src = img;
      showThumb(0);
    }
    render();
  }
  $$('.sw').forEach(function (sw) {
    sw.setAttribute('role', 'radio');
    sw.setAttribute('tabindex', '0');
    sw.setAttribute('aria-label', sw.getAttribute('title'));
    sw.addEventListener('click', function () { pickColour(sw); });
    sw.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickColour(sw); } });
  });
  function toggleMore(e) {
    if (e) e.preventDefault();
    var box = $('#extra-swatches'), btn = $('#more-colours');
    var open = box.style.display !== 'none';
    box.style.display = open ? 'none' : 'flex';
    btn.textContent = open ? '+ 64 more' : 'Show fewer';
  }
  $('#more-colours').addEventListener('click', toggleMore);
  $('#all-colours').addEventListener('click', toggleMore);

  /* pack tiers */
  var tiers = $$('.tier');
  function pickTier(t) {
    tiers.forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); });
    t.classList.add('on'); t.setAttribute('aria-checked', 'true');
    state.packs = parseInt(t.dataset.packs, 10);
    state.price = parseFloat(t.dataset.price);
    render();
  }
  tiers.forEach(function (t) {
    t.setAttribute('role', 'radio');
    t.setAttribute('tabindex', '0');
    t.addEventListener('click', function () { pickTier(t); });
    t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickTier(t); } });
  });

  /* quantity */
  $('#qty-minus').addEventListener('click', function () { if (state.qty > 1) { state.qty--; render(); } });
  $('#qty-plus').addEventListener('click', function () { if (state.qty < 20) { state.qty++; render(); } });

  function packsLabel(n) { return n + (n === 1 ? ' pack' : ' packs'); }
  function render() {
    var packs = state.packs * state.qty;
    var total = state.price * state.qty;
    $('#qty-val').textContent = state.qty;
    $('#add-btn').textContent = 'Add ' + packsLabel(packs) + ' to cart · ' + money(total);
    $('#sticky-name').textContent = 'uLace Classic — ' + state.colour + ' · ' + packsLabel(packs);
    $('#sticky-price').textContent = money(total);
  }
  function addCurrent() {
    var packs = state.packs * state.qty;
    addToCart(packs, packsLabel(packs) + ' of uLace Classic — ' + state.colour);
  }
  $('#add-btn').addEventListener('click', addCurrent);
  $('#sticky-add').addEventListener('click', addCurrent);
  $('#buy-now').addEventListener('click', function () { say('Shop Pay checkout opens here in the live build'); });

  /* sticky bar: appears once the main Add to cart button scrolls out of view */
  var bar = $('#sticky-bar');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      var past = !e.isIntersecting && e.boundingClientRect.top < 0;
      bar.classList.toggle('show', past);
      bar.setAttribute('aria-hidden', past ? 'false' : 'true');
    }).observe($('#add-btn'));
  }

  /* accordions */
  $$('.acc').forEach(function (h) {
    var body = h.nextElementSibling;
    h.setAttribute('role', 'button');
    h.setAttribute('tabindex', '0');
    function set(open) {
      body.style.display = open ? 'block' : 'none';
      h.setAttribute('aria-expanded', open ? 'true' : 'false');
      h.lastElementChild.textContent = open ? '−' : '+';
    }
    set(h.hasAttribute('data-open'));
    h.addEventListener('click', function () { set(body.style.display === 'none'); });
    h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h.click(); } });
  });

  render();
})();
