(() => {
  const SECTION_ID = "region";
  const sectionMarkup = `
    <section class="region-section" id="${SECTION_ID}" aria-labelledby="region-title">
      <div class="region-inner">
        <div class="region-heading">
          <div>
            <p class="eyebrow">Autour du chalet</p>
            <h2 id="region-title">Bien plus qu’un séjour —<br><em>vivez le Valais</em></h2>
          </div>
          <p class="region-intro">Depuis le Chalet L’Ardoise, découvrez les vignobles en terrasses de Chamoson, les sentiers entre Rhône et Muveran et les paysages alpins d’Ovronnaz. Une destination quatre saisons, entre nature, terroir et patrimoine.</p>
        </div>
        <div class="region-grid">
          <figure class="region-card">
            <img src="/chaletlardoise/images/region-vignobles-chamoson.jpg" alt="Vignobles en terrasses de Chamoson face aux Alpes valaisannes" width="1500" height="1000" loading="lazy">
            <figcaption>
              <span class="region-card-kicker">Terroir</span>
              <h3>Un vignoble d’exception</h3>
              <p>Balades entre murs de pierres sèches, caves accueillantes et panoramas ouverts sur la vallée du Rhône.</p>
              <small>Photo © Olivier Maire</small>
            </figcaption>
          </figure>
          <figure class="region-card">
            <img src="/chaletlardoise/images/region-randonnee-valais.jpg" alt="Sentier de randonnée dominant la vallée du Rhône" width="1000" height="1500" loading="lazy">
            <figcaption>
              <span class="region-card-kicker">Grand air</span>
              <h3>Du Rhône au Muveran</h3>
              <p>Des itinéraires pour chaque saison, des promenades paisibles aux randonnées alpines plus sportives.</p>
              <small>Photo © Olivier Maire</small>
            </figcaption>
          </figure>
          <figure class="region-card">
            <img src="/chaletlardoise/images/region-alpes-valais.jpg" alt="Prairie alpine et sommets près de Chamoson et Ovronnaz" width="1500" height="1000" loading="lazy">
            <figcaption>
              <span class="region-card-kicker">Quatre saisons</span>
              <h3>La nature, sans détour</h3>
              <p>Thermes, ski, alpages et villages de caractère : composez un séjour au rythme qui vous ressemble.</p>
              <small>Photo © Olivier Maire</small>
            </figcaption>
          </figure>
        </div>
        <div class="region-actions">
          <a class="region-link" href="https://www.chamoson.ch/fr/" target="_blank" rel="noreferrer">Préparer votre séjour</a>
          <a class="region-link" href="https://www.village-du-livre.ch/" target="_blank" rel="noreferrer">Village du Livre</a>
          <span class="region-note">Suggestions officielles de l’Office du Tourisme de Chamoson</span>
        </div>
      </div>
    </section>`;

  function installSection() {
    if (document.getElementById(SECTION_ID)) return;
    const situation = document.getElementById("situation");
    if (situation) situation.insertAdjacentHTML("beforebegin", sectionMarkup);
  }

  function installNavigation() {
    const nav = document.querySelector(".desktop-nav");
    if (!nav || nav.querySelector('a[href="#region"]')) return;
    const link = document.createElement("a");
    link.href = "#region";
    link.textContent = "La région";
    const situationLink = nav.querySelector('a[href="#situation"]');
    nav.insertBefore(link, situationLink || null);
  }

  function install() {
    installSection();
    installNavigation();
  }

  function start() {
    window.setTimeout(install, 450);
    window.setTimeout(install, 1200);
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      window.setTimeout(() => {
        queued = false;
        install();
      }, 180);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
