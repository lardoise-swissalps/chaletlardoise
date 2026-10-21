(() => {
  'use strict';
  const base = '/chaletlardoise/';
  const copy = {
    fr: {label:'Le journal de L’Ardoise', title:'Quelques instants au chalet', intro:'Des paysages, des détails et des moments à retrouver sur nos réseaux.', post:'Voir la publication', instagram:'Suivre sur Instagram', facebook:'Retrouver sur Facebook', nav:'Inspirations', dates:'fr-CH'},
    en: {label:'The L’Ardoise journal', title:'A few moments at the chalet', intro:'Landscapes, little details and moments to discover on our social pages.', post:'View post', instagram:'Follow on Instagram', facebook:'Find us on Facebook', nav:'Inspiration', dates:'en-GB'},
    de: {label:'Das L’Ardoise Journal', title:'Einblicke ins Chalet', intro:'Landschaften, kleine Details und besondere Momente auf unseren sozialen Seiten.', post:'Beitrag ansehen', instagram:'Auf Instagram folgen', facebook:'Auf Facebook entdecken', nav:'Inspirationen', dates:'de-CH'},
    it: {label:'Il diario di L’Ardoise', title:'Qualche momento allo chalet', intro:'Paesaggi, piccoli dettagli e momenti da scoprire sui nostri social.', post:'Vedi il post', instagram:'Seguici su Instagram', facebook:'Scoprici su Facebook', nav:'Ispirazioni', dates:'it-CH'}
  };
  const escape = value => String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const external = value => {
    try { const url = new URL(value); return url.protocol === 'https:' && ['www.instagram.com','www.facebook.com','facebook.com'].includes(url.hostname) ? url.href : ''; } catch { return ''; }
  };
  let entries = [], lastLanguage = '', queued = false;
  function language() {
    const html = document.documentElement.lang.slice(0,2);
    let saved;
    try { saved = localStorage.getItem('lardoise-language'); } catch {}
    return copy[html] ? (html === 'fr' && copy[saved] ? saved : html) : 'fr';
  }
  function install() {
    if (!entries.length) return;
    const anchor = document.querySelector('.booking-section');
    if (!anchor) return;
    const lang = language(), t = copy[lang];
    let section = document.getElementById('inspirations');
    if (section && lastLanguage === lang) return;
    const created = !section;
    if (!section) {
      section = document.createElement('section');
      section.id = 'inspirations';
      section.className = 'chalet-journal';
      section.setAttribute('aria-labelledby', 'chalet-journal-title');
      anchor.before(section);
    }
    section.lang = lang;
    section.innerHTML = `<div class="chalet-journal-inner"><div class="chalet-journal-heading"><div><p class="eyebrow">${escape(t.label)}</p><h2 id="chalet-journal-title">${escape(t.title)}</h2></div><p>${escape(t.intro)}</p></div><div class="chalet-journal-grid">${entries.slice(0,3).map(entry => {
      const words = entry[lang] || entry.fr;
      const date = new Date(entry.date + 'T12:00:00Z');
      const href = external(entry.instagram || entry.facebook);
      return `<article class="chalet-journal-card"><a class="chalet-journal-image" href="${escape(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(words.title + ' — ' + t.post)}"><img src="${escape(base+entry.image)}" alt="${escape(words.alt)}" loading="lazy" decoding="async" width="1536" height="1024"></a><div class="chalet-journal-copy"><time datetime="${escape(entry.date)}">${escape(new Intl.DateTimeFormat(t.dates, {day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Zurich'}).format(date))}</time><h3>${escape(words.title)}</h3><p>${escape(words.text)}</p>${entry.credit ? '<small>'+escape(entry.credit)+'</small>' : ''}<a class="chalet-journal-link" href="${escape(href)}" target="_blank" rel="noopener noreferrer">${escape(t.post)} <span aria-hidden="true">↗</span></a></div></article>`;
    }).join('')}</div><div class="chalet-journal-social"><a href="https://www.instagram.com/lardoise.swissalps/" target="_blank" rel="noopener noreferrer">${escape(t.instagram)} <span aria-hidden="true">↗</span></a><a href="https://www.facebook.com/profile.php?id=61583674463497" target="_blank" rel="noopener noreferrer">${escape(t.facebook)} <span aria-hidden="true">↗</span></a></div></div>`;
    const footer = document.querySelector('footer nav');
    if (footer) {
      let link = footer.querySelector('[data-journal-link]');
      if (!link) { link = document.createElement('a'); link.href = '#inspirations'; link.dataset.journalLink = ''; footer.append(link); }
      link.textContent = t.nav;
    }
    lastLanguage = lang;
    if (created && window.location.hash === '#inspirations') section.scrollIntoView({block:'start'});
  }
  function queue() {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; install(); }, 160);
  }
  async function start() {
    try {
      const response = await fetch(base+'journal-posts.json');
      if (!response.ok) return;
      const data = await response.json();
      if (!Array.isArray(data)) return;
      entries = data.filter(entry => external(entry.instagram || entry.facebook) && /^images\/[a-zA-Z0-9/_-]+\.jpe?g$/.test(entry.image) && /^\d{4}-\d{2}-\d{2}$/.test(entry.date));
      setTimeout(install, 600);
      new MutationObserver(queue).observe(document.body, {childList:true,subtree:true});
      new MutationObserver(queue).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
      window.addEventListener('storage', queue);
    } catch { /* Keep the rest of the page available if the journal cannot load. */ }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest && event.target.closest('a[href="#inspirations"]');
    const section = document.getElementById('inspirations');
    if (!link || !section) return;
    event.preventDefault();
    event.stopPropagation();
    history.replaceState(null, '', '#inspirations');
    section.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
