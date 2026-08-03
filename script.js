// scroll progress bar
const progress = document.getElementById('progress');
function updateProgress() {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight || 1) * 100;
  progress.style.width = scrolled + '%';
}
document.addEventListener('scroll', updateProgress);

// reveal sections on scroll
const sections = document.querySelectorAll('main section');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
  });
}, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
sections.forEach(s => io.observe(s));

// publication filters + live search (only present on research.html)
const filterBtns = document.querySelectorAll('#filters button');
const searchBox = document.getElementById('pubSearch');
const pubCount = document.getElementById('pubCount');
let activeFilter = 'all';

const talkList = document.querySelector('ol.pub-list[data-group="talk"]');
const talkToggle = document.getElementById('talkToggle');
const talkCount = talkList ? talkList.querySelectorAll('li').length : 0;
if (talkToggle && talkList) {
  talkToggle.addEventListener('click', () => {
    const expanded = talkList.classList.toggle('expanded');
    talkToggle.textContent = expanded ? '学会発表を閉じる' : `学会発表をすべて表示（${talkCount}件）`;
  });
}

function applyPubFilter() {
  if (!searchBox) return;
  const query = searchBox.value.trim().toLowerCase();
  if (query && talkList && !talkList.classList.contains('expanded')) {
    talkList.classList.add('expanded');
    if (talkToggle) talkToggle.textContent = '学会発表を閉じる';
  }
  let visible = 0;
  document.querySelectorAll('.pub-list').forEach(list => {
    const group = list.dataset.group;
    const groupMatches = (activeFilter === 'all' || activeFilter === group);
    let groupVisibleCount = 0;
    list.querySelectorAll('li').forEach(li => {
      const textMatches = !query || li.textContent.toLowerCase().includes(query);
      const show = groupMatches && textMatches;
      li.classList.toggle('hide', !show);
      if (show) { groupVisibleCount++; visible++; }
    });
    list.style.display = groupVisibleCount > 0 ? '' : 'none';
    const heading = list.previousElementSibling;
    if (heading && heading.tagName === 'H3') {
      heading.style.display = groupVisibleCount > 0 ? '' : 'none';
    }
  });
  if (pubCount) pubCount.textContent = (query || activeFilter !== 'all') ? visible + ' 件表示中' : '';
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyPubFilter();
  });
});
if (searchBox) searchBox.addEventListener('input', applyPubFilter);

// theme toggle
const themeToggle = document.getElementById('themeToggle');
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  try { localStorage.setItem('theme', theme); } catch (e) {}
}
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch (e) {}
setTheme(savedTheme);
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// copy email (only present on contact.html)
const pill = document.getElementById('emailPill');
if (pill) {
  pill.addEventListener('click', () => {
    const email = 'k-shimizu@rs.tus.ac.jp';
    navigator.clipboard && navigator.clipboard.writeText(email).catch(() => {});
    const original = pill.textContent;
    pill.textContent = 'コピーしました ✓';
    setTimeout(() => { pill.textContent = original; }, 1600);
  });
}

// back to top
const toTop = document.getElementById('toTop');
document.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 500);
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
