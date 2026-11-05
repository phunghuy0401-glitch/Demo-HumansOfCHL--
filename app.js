(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const gradeKeys = ['10', '11', '12'];
  const letters = gradeKeys.flatMap(grade => (Array.isArray(HEART_DATA?.[grade]) ? HEART_DATA[grade] : []).map((entry, index) => {
    const item = typeof entry === 'string' ? { name: entry, specialty: entry } : (entry || {});
    return { id: `${grade}-${index + 1}`, grade, name: String(item.name || `${grade} lớp ${index + 1}`), title: String(item.name || `${grade} lớp ${index + 1}`), specialty: String(item.specialty || ''), index };
  }));
  const state = { grade: 'all', query: '' };
  const heartRows = [4, 6, 7, 7, 6, 4, 2];
  const safeMedia = Array.isArray(MEDIA_ITEMS) ? MEDIA_ITEMS.filter(item => item && typeof item.title === 'string' && typeof item.src === 'string' && item.src.trim()) : [];

  function normalize(value) {
    return String(value).toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  }
  function getFiltered() {
    const query = normalize(state.query);
    return letters.filter(item => (state.grade === 'all' || item.grade === state.grade) && (!query || normalize(item.title).includes(query)));
  }
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  function createHeart(item, order) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `heart-node grade-${item.grade}`;
    button.dataset.id = item.id;
    button.style.setProperty('--delay', `${(order % 18) * 24}ms`);
    button.setAttribute('aria-label', `Mở ${item.title}, khối ${item.grade}`);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M50 88 C43 81 12 60 8 39 C4 18 29 5 46 22 C48 24 49 26 50 28 C51 26 52 24 54 22 C71 5 96 18 92 39 C88 60 57 81 50 88 Z');
    svg.append(path);
    const label = document.createElement('span'); label.className = 'node-label'; label.textContent = item.title.replace(/^(\d+)\s+/, '$1\n');
    button.append(svg, label);
    button.addEventListener('click', () => openLetter(item));
    return button;
  }
  function renderHearts() {
    const canvas = $('#heartCanvas');
    const filtered = getFiltered();
    canvas.replaceChildren();
    const filteredIds = new Set(filtered.map(item => item.id));
    let index = 0;
    heartRows.forEach((count, rowIndex) => {
      const row = document.createElement('div'); row.className = `heart-row row-${rowIndex + 1}`;
      for (let i = 0; i < count; i++) {
        const item = letters[index++];
        if (item && filteredIds.has(item.id)) row.append(createHeart(item, index));
      }
      if (row.childElementCount) canvas.append(row);
    });
    canvas.classList.toggle('filtered', state.grade !== 'all' || Boolean(state.query));
    $('#searchEmpty').hidden = filtered.length > 0;
  }
  function openLetter(item) {
    $('#dialogGrade').textContent = `KHỐI ${item.grade}${item.specialty ? ` · CHUYÊN ${item.specialty.toLocaleUpperCase('vi')}` : ''}`;
    $('#dialogTitle').textContent = item.title;
    $('#dialogCopy').textContent = typeof LETTER_COPY === 'string' ? LETTER_COPY : 'Một mảnh ghép của trái tim Chuyên Hạ Long.';
    const dialog = $('#letterDialog');
    if (!dialog.open) dialog.showModal();
  }
  $('#closeDialog').addEventListener('click', () => $('#letterDialog').close());
  $('#letterDialog').addEventListener('click', event => { if (event.target === $('#letterDialog')) $('#letterDialog').close(); });

  $$('.grade-tab').forEach(button => button.addEventListener('click', () => {
    state.grade = button.dataset.grade;
    $$('.grade-tab').forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    renderHearts();
  }));
  $('#heartSearch').addEventListener('input', event => {
    state.query = event.target.value.trim();
    $('#clearSearch').hidden = !state.query;
    renderHearts();
  });
  $('#clearSearch').addEventListener('click', () => {
    $('#heartSearch').value = ''; state.query = ''; $('#clearSearch').hidden = true; renderHearts(); $('#heartSearch').focus();
  });
  $('#randomLetter').addEventListener('click', () => {
    const options = getFiltered();
    if (!options.length) return showToast('Không có tập thể phù hợp.');
    openLetter(options[Math.floor(Math.random() * options.length)]);
  });

  function mediaType(item) {
    if (item.type === 'video' || item.type === 'image') return item.type;
    return /\.(mp4|webm|mov|m4v|ogv)(?:\?|$)/i.test(item.src) ? 'video' : 'image';
  }
  function selectMedia(item) {
    const kind = mediaType(item), video = $('#memoryPlayer'), image = $('#memoryImage');
    video.pause(); video.removeAttribute('src'); video.removeAttribute('poster'); video.load();
    image.removeAttribute('src');
    video.hidden = kind !== 'video'; image.hidden = kind !== 'image';
    if (kind === 'video') {
      video.src = item.src;
      if (item.poster) video.poster = item.poster;
      video.load();
    } else {
      image.src = item.src; image.alt = item.title;
    }
    $('#memoryEmpty').hidden = true;
    $('#mediaName').textContent = item.title;
    $('#mediaMeta').textContent = kind === 'video' ? 'Video · Nhấn phát để xem' : 'Ảnh · Khoảnh khắc được lưu lại';
    $$('.media-card').forEach(card => {
      const active = card.dataset.src === item.src;
      card.classList.toggle('active', active); card.setAttribute('aria-pressed', String(active));
    });
  }
  function renderMedia() {
    const gallery = $('#sharedGallery'); gallery.replaceChildren();
    $('#sharedMediaCount').textContent = `${safeMedia.length} nội dung`;
    $('#mediaCount').textContent = `${safeMedia.length} mục`;
    if (!safeMedia.length) {
      const empty = document.createElement('p'); empty.className = 'empty-library'; empty.textContent = 'Thư viện sẽ được cập nhật sau.'; gallery.append(empty);
      $('#mediaMeta').textContent = 'Chưa có nội dung được thêm.';
      return;
    }
    safeMedia.forEach(item => {
      const kind = mediaType(item), card = document.createElement('button');
      card.type = 'button'; card.className = 'media-card'; card.dataset.src = item.src;
      card.setAttribute('aria-pressed', 'false'); card.setAttribute('aria-label', `Xem ${item.title}`);
      let preview;
      if (kind === 'video') {
        preview = document.createElement('video'); preview.muted = true; preview.playsInline = true; preview.preload = 'metadata';
        if (item.poster) preview.poster = item.poster;
      } else { preview = document.createElement('img'); preview.alt = item.title; preview.loading = 'lazy'; }
      preview.src = item.src;
      const caption = document.createElement('span'); caption.textContent = item.title;
      const type = document.createElement('small'); type.textContent = kind === 'video' ? '▶ VIDEO' : '✧ ẢNH';
      card.append(preview, type, caption); card.addEventListener('click', () => selectMedia(item)); gallery.append(card);
    });
    if (safeMedia.length) {
      const featured = safeMedia.find(item => mediaType(item) === 'video') || safeMedia[0];
      selectMedia(featured);
    }
  }

  let dark = true;
  try { dark = localStorage.getItem('chuyenHaLongV3Theme') !== 'light'; } catch { /* storage unavailable */ }
  function applyTheme() {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    $('#themeToggle').textContent = dark ? '☼' : '☾';
    $('#themeToggle').setAttribute('aria-label', dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
    document.querySelector('meta[name="theme-color"]').content = dark ? '#100f1d' : '#f7f3f8';
  }
  $('#themeToggle').addEventListener('click', () => {
    dark = !dark; applyTheme();
    try { localStorage.setItem('chuyenHaLongV3Theme', dark ? 'dark' : 'light'); } catch { /* storage unavailable */ }
  });
  applyTheme();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    const stars = $('#stars');
    const starCount = window.matchMedia('(max-width: 650px)').matches ? 30 : 58;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('i'); star.className = 'star';
      star.style.left = `${(i * 67 + 13) % 100}%`; star.style.top = `${(i * 43 + 7) % 100}%`;
      star.style.setProperty('--duration', `${4 + (i % 6)}s`); star.style.setProperty('--delay', `${-(i % 8)}s`);
      stars.append(star);
    }
  }

  // Reveal content as it enters the viewport; gracefully falls back on older browsers.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready');
    const revealTargets = [$('.heart-section'), $('.footer')].filter(Boolean);
    revealTargets.forEach(node => node.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    revealTargets.forEach(node => observer.observe(node));
  }

  // Keep touch controls responsive and prevent accidental double activation.
  document.addEventListener('touchstart', () => {}, { passive: true, once: true });
  renderHearts(); renderMedia();
})();
