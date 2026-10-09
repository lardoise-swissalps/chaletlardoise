/* Load the booking engine with real stay dates, not its legacy default view.
   Only dates and guest count are passed; Smoobu remains the source of prices. */
(() => {
  "use strict";
  const core = window.LArdoiseBooking;
  const byId = id => document.getElementById(id);
  let stored = null;
  try { stored = localStorage.getItem("lardoise-language"); } catch {}
  const candidate = (new URLSearchParams(location.search).get("lang") || stored || navigator.language || "fr").toLowerCase().split("-")[0];
  const lang = ["fr","en","de","it","nl"].includes(candidate) ? candidate : "en";
  const text = {
    fr:{search:"Voir le prix de mon séjour",invalid:"Vérifiez vos dates et le nombre de voyageurs (1 à 8). Le départ doit suivre l’arrivée et l’arrivée ne peut pas être dans le passé.",loaded:"Votre séjour est chargé dans Smoobu ci-dessous. Sélectionnez vos options, puis vérifiez le total avant confirmation. Le lien d’ouverture dans un nouvel onglet reprend ces mêmes dates.",title:"Réservation directe du Chalet L’Ardoise"},
    en:{search:"View my stay price",invalid:"Check your dates and guest count (1–8). Check-out must be after check-in and arrival cannot be in the past.",loaded:"Your stay is loaded in Smoobu below. Select extras and check the total before confirming. The new-tab link uses the same dates.",title:"Direct booking at Chalet L’Ardoise"},
    de:{search:"Preis meines Aufenthalts ansehen",invalid:"Prüfen Sie Daten und Gästezahl (1–8). Abreise muss nach Anreise liegen; Anreise darf nicht in der Vergangenheit liegen.",loaded:"Ihr Aufenthalt ist unten in Smoobu geladen. Wählen Sie Extras und prüfen Sie den Gesamtpreis vor Bestätigung. Der Link zum neuen Tab übernimmt dieselben Daten.",title:"Direktbuchung Chalet L’Ardoise"},
    it:{search:"Vedi il prezzo del soggiorno",invalid:"Verifica date e ospiti (1–8). La partenza deve seguire l’arrivo e l’arrivo non può essere nel passato.",loaded:"Il soggiorno è caricato in Smoobu sotto. Scegli gli extra e verifica il totale prima di confermare. Il link per una nuova scheda mantiene le stesse date.",title:"Prenotazione diretta Chalet L’Ardoise"},
    nl:{search:"Bekijk mijn verblijfsprijs",invalid:"Controleer datums en aantal gasten (1–8). Vertrek moet na aankomst zijn; aankomst mag niet in het verleden liggen.",loaded:"Uw verblijf is hieronder in Smoobu geladen. Kies extra’s en controleer het totaal vóór bevestiging. De link naar een nieuw tabblad gebruikt dezelfde datums.",title:"Direct boeken bij Chalet L’Ardoise"}
  }[lang];
  const form = byId("booking-entry"), frame = byId("booking-current-stay"), status = byId("booking-entry-status");
  byId("booking-search").textContent = text.search;
  frame.title = text.title;
  byId("booking-arrival").min = core.today();
  byId("booking-departure").min = core.today();
  byId("booking-arrival").addEventListener("change", () => {
    byId("booking-departure").min = byId("booking-arrival").value || core.today();
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const arrival = byId("booking-arrival").value;
    const departure = byId("booking-departure").value;
    const guests = Number(byId("booking-guests").value);
    const stay = core.stay(arrival,departure);
    const url = core.bookingUrl(stay,guests);
    if (!url || arrival < core.today()) { status.textContent = text.invalid; return; }
    frame.src = url;
    frame.hidden = false;
    status.textContent = text.loaded;
    const fallback = document.querySelector(".booking-fallback a");
    if (fallback) fallback.href = url;
    // Reuse the dates if the guest subsequently opens the optional estimator.
    for (const [id,value] of [["extras-arrival",arrival],["extras-departure",departure],["extras-guests",String(guests)]]) {
      const input = byId(id);
      input.value = value;
      input.dispatchEvent(new Event("change",{bubbles:true}));
    }
    frame.scrollIntoView({block:"start",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  });
})();
