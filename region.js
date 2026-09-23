(() => {
  const SECTION_ID = "region";
  const MAP_LINK = "https://www.openstreetmap.org/?mlat=46.2034&mlon=7.1843#map=14/46.2034/7.1843";
  const MAP_EMBED = "https://www.openstreetmap.org/export/embed.html?bbox=7.145%2C46.175%2C7.225%2C46.235&layer=mapnik&marker=46.2034%2C7.1843";
  const sectionMarkup = `
    <section class="region-section" id="${SECTION_ID}" aria-labelledby="region-title">
      <div class="region-inner">
        <div class="region-heading">
          <div>
            <p class="eyebrow">Autour du chalet</p>
            <h2 id="region-title">Bien plus qu’un séjour —<br><em>vivez le Valais</em></h2>
          </div>
          <p class="region-intro">Depuis le Chalet L’Ardoise, découvrez le vignoble et le patrimoine de Chamoson, les sentiers entre Rhône et Muveran ainsi que les thermes et activités alpines d’Ovronnaz. Une destination quatre saisons, entre nature, terroir et bien-être.</p>
        </div>
        <div class="region-grid">
          <figure class="region-card">
            <img src="/chaletlardoise/images/region-vignobles-chamoson.jpg" alt="Vignobles en terrasses de Chamoson face aux Alpes valaisannes" width="1500" height="1000" loading="lazy">
            <figcaption>
              <span class="region-card-kicker">Terroir</span>
              <h3>Un vignoble d’exception</h3>
              <p>Plus de 400 hectares de vignes, environ 2 500 heures de soleil par an, des caves accueillantes et des panoramas ouverts sur la vallée du Rhône.</p>
              <small>Photo © Olivier Maire</small>
            </figcaption>
          </figure>
          <figure class="region-card">
            <img src="/chaletlardoise/images/region-randonnee-valais.jpg" alt="Sentier de randonnée dominant la vallée du Rhône" width="1000" height="1500" loading="lazy">
            <figcaption>
              <span class="region-card-kicker">Grand air</span>
              <h3>Du Rhône au Muveran</h3>
              <p>De la vallée du Rhône aux reliefs du Muveran, explorez à pied ou à vélo une grande diversité de paysages, du vignoble à la haute montagne.</p>
              <small>Photo © Olivier Maire</small>
            </figcaption>
          </figure>
          <figure class="region-card">
            <img src="/chaletlardoise/images/region-alpes-valais.jpg" alt="Prairie alpine et sommets près de Chamoson et Ovronnaz" width="1500" height="1000" loading="lazy">
            <figcaption>
              <span class="region-card-kicker">Quatre saisons</span>
              <h3>Ovronnaz, quatre saisons</h3>
              <p>À quelques minutes du chalet : bains thermaux, ski, randonnées, VTT et activités familiales, été comme hiver.</p>
              <small>Photo © Olivier Maire</small>
            </figcaption>
          </figure>
        </div>
        <div class="region-actions">
          <a class="region-link" href="https://www.chamoson.ch/fr/" target="_blank" rel="noreferrer">Découvrir Chamoson</a>
          <a class="region-link" href="https://www.ovronnaz.ch/" target="_blank" rel="noreferrer">Découvrir Ovronnaz</a>
          <a class="region-link" href="https://www.village-du-livre.ch/" target="_blank" rel="noreferrer">Village du Livre</a>
          <span class="region-note">Informations issues des offices du tourisme de Chamoson et d’Ovronnaz</span>
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

  function installMap() {
    const mapLink = document.querySelector('.map-section a[href*="openstreetmap.org"]');
    if (mapLink) mapLink.setAttribute("href", MAP_LINK);

    const mapFrame = document.querySelector(".map-frame iframe");
    if (mapFrame && mapFrame.getAttribute("src") !== MAP_EMBED) {
      mapFrame.setAttribute("src", MAP_EMBED);
    }

    const placeLabel = document.querySelector(".location-image > div > span");
    if (placeLabel) placeLabel.textContent = "Mayens-de-Chamoson";

    const altitudeLabel = document.querySelector(".location-image > div > strong");
    if (altitudeLabel) altitudeLabel.textContent = "env. 1 200 m";
  }

  function install() {
    installSection();
    installNavigation();
    installMap();
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
