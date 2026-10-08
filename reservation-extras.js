
/* Booking options planner. Display-only until Smoobu Additional Items are configured.
   Do NOT inject extras into iframe: cross-origin checkout would ignore them. */
(() => {
  "use strict";
  const langParam = new URLSearchParams(location.search).get("lang");
  let preferred = null;
  try { preferred = localStorage.getItem("lardoise-language"); } catch {}
  const lang = (langParam || preferred || navigator.language || "fr").toLowerCase().split("-")[0];
  const language = ["fr","en","de","nl","it"].includes(lang) ? lang : "en";
  const T = {
    fr:{none:"Aucune option présélectionnée",jacuzzi:"Jacuzzi extérieur",sauna:"Sauna intérieur",barbecue:"Barbecue (mai à octobre uniquement)",pet1:"1 animal domestique",pet2:"2 animaux domestiques",petMore:"Plus de 2 animaux : autorisation à demander",simple4:"Pack fondue simple – 4 personnes",simple8:"Pack fondue simple – 8 personnes",premium4:"Pack fondue premium valaisan – 4 personnes",premium8:"Pack fondue premium valaisan – 8 personnes",copy:"Copier la sélection",copied:"Sélection copiée",copyFailed:"Impossible de copier automatiquement : utilisez le courriel.",subject:"Options souhaitées – Chalet L’Ardoise",mailIntro:"Bonjour, voici les options que j'aimerais prévoir pour mon séjour au Chalet L'Ardoise :",mailOutro:"Merci de confirmer la disponibilité, les prix et les modalités de paiement. Je comprends que cette demande ne crée pas une réservation.",confirm:"Important : les options présélectionnées ici ne sont pas automatiquement ajoutées à la réservation Smoobu. Vérifiez-les dans l'étape de paiement si elles y sont proposées, sinon envoyez-nous cette sélection séparément. Le prix exact du séjour reste celui affiché par Smoobu."},
    en:{none:"No extras selected",jacuzzi:"Outdoor hot tub",sauna:"Indoor sauna",barbecue:"BBQ (May–October only)",pet1:"1 pet",pet2:"2 pets",petMore:"More than 2 pets: prior approval required",simple4:"Classic fondue pack – 4 people",simple8:"Classic fondue pack – 8 people",premium4:"Valais premium fondue pack – 4 people",premium8:"Valais premium fondue pack – 8 people",copy:"Copy selection",copied:"Selection copied",copyFailed:"Could not copy automatically. Please use email.",subject:"Requested extras – Chalet L’Ardoise",mailIntro:"Hello, I would like to request the following extras for my stay at Chalet L'Ardoise:",mailOutro:"Please confirm availability, prices and payment arrangements. I understand this message does not book the property.",confirm:"Important: selections made here are not automatically added to Smoobu checkout. Select them again at checkout if offered, or send this request separately. The final stay price is shown by Smoobu."},
    de:{none:"Keine Extras ausgewählt",jacuzzi:"Whirlpool im Freien",sauna:"Sauna im Innenbereich",barbecue:"Grill (nur Mai bis Oktober)",pet1:"1 Haustier",pet2:"2 Haustiere",petMore:"Mehr als 2 Haustiere: vorherige Genehmigung erforderlich",simple4:"Einfaches Fondue-Paket – 4 Personen",simple8:"Einfaches Fondue-Paket – 8 Personen",premium4:"Walliser Premium-Fondue-Paket – 4 Personen",premium8:"Walliser Premium-Fondue-Paket – 8 Personen",copy:"Auswahl kopieren",copied:"Auswahl kopiert",copyFailed:"Kopieren nicht möglich. Bitte E-Mail nutzen.",subject:"Gewünschte Extras – Chalet L’Ardoise",mailIntro:"Guten Tag, ich interessiere mich für folgende Extras während meines Aufenthalts im Chalet L'Ardoise:",mailOutro:"Bitte bestätigen Sie Verfügbarkeit, Preise und Bezahlung. Diese Nachricht stellt keine Buchung dar.",confirm:"Wichtig: Diese Auswahl wird nicht automatisch an die Smoobu-Buchung übermittelt. Wählen Sie die Extras gegebenenfalls beim Bezahlen erneut aus oder senden Sie die Anfrage separat. Der endgültige Preis steht bei Smoobu."},
    nl:{none:"Geen extra's geselecteerd",jacuzzi:"Jacuzzi buiten",sauna:"Sauna binnen",barbecue:"Barbecue (alleen mei–oktober)",pet1:"1 huisdier",pet2:"2 huisdieren",petMore:"Meer dan 2 huisdieren: toestemming vooraf vereist",simple4:"Eenvoudig fonduepakket – 4 personen",simple8:"Eenvoudig fonduepakket – 8 personen",premium4:"Premium fonduepakket uit Wallis – 4 personen",premium8:"Premium fonduepakket uit Wallis – 8 personen",copy:"Selectie kopiëren",copied:"Selectie gekopieerd",copyFailed:"Kopiëren mislukt. Gebruik e-mail.",subject:"Gewenste extra's – Chalet L’Ardoise",mailIntro:"Hallo, ik zou graag de volgende extra's aanvragen voor mijn verblijf in Chalet L'Ardoise:",mailOutro:"Wilt u beschikbaarheid, prijzen en betaling bevestigen? Dit bericht geldt niet als reservering.",confirm:"Belangrijk: de keuzes hier worden niet automatisch toegevoegd aan de Smoobu-boeking. Kies de extra's indien mogelijk opnieuw in de boeking, of stuur ons deze aanvraag apart. De definitieve verblijfskosten staan in Smoobu."},
    it:{none:"Nessuna opzione selezionata",jacuzzi:"Jacuzzi esterna",sauna:"Sauna interna",barbecue:"Barbecue (solo maggio–ottobre)",pet1:"1 animale domestico",pet2:"2 animali domestici",petMore:"Più di 2 animali: autorizzazione necessaria",simple4:"Pacchetto fondue semplice – 4 persone",simple8:"Pacchetto fondue semplice – 8 persone",premium4:"Pacchetto fondue premium vallesano – 4 persone",premium8:"Pacchetto fondue premium vallesano – 8 persone",copy:"Copia selezione",copied:"Selezione copiata",copyFailed:"Impossibile copiare. Usa l'e-mail.",subject:"Extra richiesti – Chalet L’Ardoise",mailIntro:"Buongiorno, desidero richiedere i seguenti extra per il mio soggiorno allo Chalet L'Ardoise:",mailOutro:"Vi prego di confermare disponibilità, prezzi e pagamento. Questo messaggio non costituisce una prenotazione.",confirm:"Importante: le opzioni selezionate qui non vengono aggiunte automaticamente alla prenotazione Smoobu. Se disponibili, selezionatele di nuovo al checkout oppure inviate la richiesta separatamente. Il prezzo definitivo è quello mostrato da Smoobu."}
  };
  const t = T[language];
  const one = (id) => document.getElementById(id);
  const toggle = (id) => one(id)?.checked || false;
  const getState = () => {
    const pets = one("extras-pets")?.value || "0";
    const simple = one("extras-fondue-simple")?.value || "0";
    const premium = one("extras-fondue-premium")?.value || "0";
    return {
      jacuzzi: toggle("extras-jacuzzi"),
      sauna: toggle("extras-sauna"),
      barbecue: toggle("extras-barbecue"),
      pets, simple, premium
    };
  };
  const getLines = (s) => {
    const lines=[];
    if (s.jacuzzi) lines.push(t.jacuzzi + " — CHF 70 / night (min. 2 nights)");
    if (s.sauna) lines.push(t.sauna + " — CHF 60 / night");
    if (s.barbecue) lines.push(t.barbecue + " — CHF 10 / night");
    if (s.pets === "1") lines.push(t.pet1 + " — CHF 15 / night");
    if (s.pets === "2") lines.push(t.pet2 + " — CHF 30 / night");
    if (s.pets === "3plus") lines.push(t.petMore);
    if (s.simple === "4") lines.push(t.simple4 + " — price to confirm");
    if (s.simple === "8") lines.push(t.simple8 + " — price to confirm");
    if (s.premium === "4") lines.push(t.premium4 + " — price to confirm");
    if (s.premium === "8") lines.push(t.premium8 + " — price to confirm");
    return lines;
  };
  function render(){
    const lines=getLines(getState());
    const list=one("extras-summary-list");
    if(!list) return;
    list.replaceChildren();
    for(const name of (lines.length?lines:[t.none])){
      const li=document.createElement("li");
      li.textContent=name;
      list.append(li);
    }
    const mail=one("extras-send");
    if(mail){
      const body = [t.mailIntro, "", ...(lines.length?lines:["–"]), "",t.mailOutro].join("\n");
      mail.href="mailto:chaletlardoise@gmail.com?subject="+encodeURIComponent(t.subject)+"&body="+encodeURIComponent(body);
    }
    one("extras-summary-disclaimer").textContent=t.confirm;
    const approval=one("extras-pet-approval");
    if(approval) approval.hidden=getState().pets!=="3plus";
  }
  for(const id of ["extras-jacuzzi","extras-sauna","extras-barbecue","extras-pets","extras-fondue-simple","extras-fondue-premium"]){
    const el=one(id);
    if(!el) continue;
    el.addEventListener("change",()=>{
      if(id==="extras-fondue-simple" && el.value!=="0") one("extras-fondue-premium").value="0";
      if(id==="extras-fondue-premium" && el.value!=="0") one("extras-fondue-simple").value="0";
      render();
    });
  }
  one("extras-copy")?.addEventListener("click",async()=>{
    const lines=getLines(getState());
    const msg=[t.mailIntro,"",...(lines.length?lines:["–"]),"",t.mailOutro].join("\n");
    const btn=one("extras-copy");
    try{
      await navigator.clipboard.writeText(msg);
      btn.textContent=t.copied;
      window.setTimeout(()=>btn.textContent=t.copy,2200);
    } catch {
      btn.textContent=t.copyFailed;
    }
  });
  render();
})();
