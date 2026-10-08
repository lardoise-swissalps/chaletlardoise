
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

  const X = {
    fr:{dates:"Indiquez les dates d’arrivée et de départ.",invalid:"Les dates sont incorrectes : le départ doit suivre l’arrivée.",past:"L’arrivée ne peut pas être dans le passé.",guests:"Le chalet accueille de 1 à 8 voyageurs.",jacuzzi:"Jacuzzi : 2 nuits minimum.",bbq:"Barbecue : uniquement si toutes les nuitées sont entre mai et octobre.",pack:"Pour plus de 4 voyageurs, choisissez un pack pour 8 personnes.",name:"Renseignez votre nom.",email:"Renseignez une adresse e-mail valide.",extra:"Choisissez au moins une option.",night:"nuitée",summary:"Total estimé des options tarifées",pending:"Pack fondue : prix à confirmer",noDate:"Indiquez vos dates pour calculer les options.",noExtras:"Aucune option sélectionnée.",copied:"Sélection copiée",mail:"Votre application e-mail s’ouvre : vous devrez confirmer l’envoi.",intro:"Demande d’options – Chalet L’Ardoise",notice:"Ce message est une demande d’options, ni une réservation ni un paiement. Les prix définitifs restent à confirmer ; la réservation du chalet s’effectue dans Smoobu.",copyFail:"Copie impossible. Utilisez le bouton e-mail."},
    en:{dates:"Enter arrival and departure dates.",invalid:"Invalid dates: check-out must be after check-in.",past:"Arrival cannot be in the past.",guests:"Guest count must be between 1 and 8.",jacuzzi:"Hot tub: at least 2 nights required.",bbq:"BBQ is only available if every booked night falls between May and October.",pack:"For more than 4 guests, choose an 8-person fondue pack.",name:"Enter your name.",email:"Enter a valid email address.",extra:"Select at least one extra.",night:"night",summary:"Estimated priced extras total",pending:"Fondue pack price to be confirmed",noDate:"Enter your dates to calculate extras.",noExtras:"No extras selected.",copied:"Selection copied",mail:"Your email app will open: you must send the message yourself.",intro:"Extras request – Chalet L’Ardoise",notice:"This message is an enquiry, not a reservation or payment. Final prices must be confirmed; book the chalet separately through Smoobu.",copyFail:"Could not copy; use the email button."},
    de:{dates:"Bitte An- und Abreise angeben.",invalid:"Ungültige Daten: Abreise muss nach Anreise liegen.",past:"Anreise darf nicht in der Vergangenheit liegen.",guests:"Es sind 1 bis 8 Gäste erlaubt.",jacuzzi:"Whirlpool: mindestens 2 Nächte.",bbq:"Grill nur möglich, wenn alle Nächte zwischen Mai und Oktober liegen.",pack:"Für mehr als 4 Gäste bitte Fondue-Paket für 8 Personen wählen.",name:"Bitte Namen angeben.",email:"Bitte gültige E-Mail-Adresse angeben.",extra:"Bitte ein Extra wählen.",night:"Nacht",summary:"Geschätzter Preis der bepreisten Extras",pending:"Fondue-Paket: Preis auf Anfrage",noDate:"Daten für die Extras-Berechnung angeben.",noExtras:"Keine Extras ausgewählt.",copied:"Auswahl kopiert",mail:"Ihr E-Mail-Programm öffnet sich; bitte die Nachricht selbst absenden.",intro:"Anfrage für Extras – Chalet L’Ardoise",notice:"Dies ist eine Anfrage, keine Buchung oder Zahlung. Endgültige Preise werden bestätigt; das Chalet wird getrennt über Smoobu gebucht.",copyFail:"Kopieren fehlgeschlagen; bitte E-Mail nutzen."},
    nl:{dates:"Vul aankomst en vertrek in.",invalid:"Ongeldige datums: vertrek moet na aankomst zijn.",past:"Aankomst kan niet in het verleden liggen.",guests:"Van 1 tot 8 gasten toegestaan.",jacuzzi:"Jacuzzi: minimaal 2 nachten.",bbq:"Barbecue kan alleen als alle nachten tussen mei en oktober vallen.",pack:"Bij meer dan 4 gasten een pakket voor 8 personen kiezen.",name:"Vul uw naam in.",email:"Vul een geldig e-mailadres in.",extra:"Kies minstens één extra.",night:"nacht",summary:"Geschat totaal voor geprijsde extra's",pending:"Fonduepakket: prijs nog te bevestigen",noDate:"Voer datums in om kosten te berekenen.",noExtras:"Geen extra's gekozen.",copied:"Selectie gekopieerd",mail:"Uw e-mailapp wordt geopend; verstuur het bericht zelf.",intro:"Aanvraag extra's – Chalet L’Ardoise",notice:"Dit is een aanvraag, geen boeking of betaling. Definitieve prijzen moeten worden bevestigd; boek het chalet apart via Smoobu.",copyFail:"Kopiëren mislukt; gebruik e-mail."},
    it:{dates:"Inserisci le date di arrivo e partenza.",invalid:"Date non valide: la partenza deve seguire l'arrivo.",past:"L'arrivo non può essere nel passato.",guests:"Sono ammessi da 1 a 8 ospiti.",jacuzzi:"Jacuzzi: minimo 2 notti.",bbq:"Barbecue disponibile solo se tutte le notti sono tra maggio e ottobre.",pack:"Per più di 4 ospiti scegli il pacchetto da 8.",name:"Inserisci il nome.",email:"Inserisci una e-mail valida.",extra:"Seleziona almeno un extra.",night:"notte",summary:"Totale stimato degli extra con prezzo",pending:"Pacchetto fondue: prezzo da confermare",noDate:"Inserisci le date per calcolare gli extra.",noExtras:"Nessun extra selezionato.",copied:"Selezione copiata",mail:"Si apre il programma e-mail; devi inviare tu il messaggio.",intro:"Richiesta extra – Chalet L’Ardoise",notice:"Questa è una richiesta, non una prenotazione né un pagamento. Prezzi finali da confermare; prenota lo chalet separatamente con Smoobu.",copyFail:"Copia impossibile; usa il pulsante e-mail."}
  };
  const l=X[language];
  const byId=id=>document.getElementById(id);
  const yes=id=>Boolean(byId(id)?.checked);
  const getDate=str=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(str||""))return null;
    const d=new Date(str+"T12:00:00Z");
    if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==str)return null;
    return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());
  };
  const localToday=()=>{
    const d=new Date(),pad=n=>String(n).padStart(2,"0");
    return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
  };
  const stay=()=>{
    const arrival=byId("extras-arrival")?.value||"",departure=byId("extras-departure")?.value||"";
    const a=getDate(arrival),b=getDate(departure);
    return {arrival,departure,a,b,nights:a!==null&&b!==null&&b>a?(b-a)/86400000:null};
  };
  const inSeason=d=>{
    if(d.nights===null)return false;
    for(let day=0;day<d.nights;day++){
      const m=new Date(d.a+86400000*day).getUTCMonth()+1;
      if(m<5||m>10)return false;
    }
    return true;
  };
  const state=()=>({
    jacuzzi:yes("extras-jacuzzi"),sauna:yes("extras-sauna"),barbecue:yes("extras-barbecue"),
    pets:byId("extras-pets")?.value||"0",simple:byId("extras-fondue-simple")?.value||"0",
    premium:byId("extras-fondue-premium")?.value||"0"
  });
  const chf=n=>new Intl.NumberFormat(language==="fr"?"fr-CH":"en-CH",{style:"currency",currency:"CHF",minimumFractionDigits:0,maximumFractionDigits:0}).format(n);
  function calculate(){
    const d=stay(),s=state(),guests=Number(byId("extras-guests")?.value||0),rows=[];
    const add=(title,rate)=>rows.push({title,rate,total:d.nights===null?null:rate*d.nights});
    if(s.jacuzzi)add(t.jacuzzi,70);
    if(s.sauna)add(t.sauna,60);
    if(s.barbecue)add(t.barbecue,10);
    if(s.pets==="1")add(t.pet1,15);
    if(s.pets==="2")add(t.pet2,30);
    if(s.pets==="3plus")rows.push({title:t.petMore,rate:null,total:null});
    if(s.simple!=="0")rows.push({title:s.simple==="4"?t.simple4:t.simple8,rate:null,total:null});
    if(s.premium!=="0")rows.push({title:s.premium==="4"?t.premium4:t.premium8,rate:null,total:null});
    const errors=[];
    if(!d.arrival||!d.departure)errors.push(l.dates);
    else if(d.nights===null)errors.push(l.invalid);
    else if(d.arrival<localToday())errors.push(l.past);
    if(!Number.isInteger(guests)||guests<1||guests>8)errors.push(l.guests);
    if(s.jacuzzi&&d.nights!==null&&d.nights<2)errors.push(l.jacuzzi);
    if(s.barbecue&&d.nights!==null&&!inSeason(d))errors.push(l.bbq);
    if(guests>4&&(s.simple==="4"||s.premium==="4"))errors.push(l.pack);
    return {d,s,guests,rows,errors,total:rows.reduce((sum,r)=>sum+(r.total||0),0)};
  }
  const reportError=msg=>{
    const node=byId("extras-validation");if(!node)return;
    node.textContent=msg||"";node.hidden=!msg;
  };
  function render(){
    const q=calculate(),ul=byId("extras-summary-list");
    if(ul){
      ul.replaceChildren();
      for(const r of q.rows){
        const li=document.createElement("li");
        li.textContent=r.title+" — "+(r.rate===null?l.pending:q.d.nights===null?chf(r.rate)+"/"+l.night:chf(r.rate)+" × "+q.d.nights+" = "+chf(r.total));
        ul.append(li);
      }
      if(!q.rows.length){const li=document.createElement("li");li.textContent=l.noExtras;ul.append(li);}
    }
    const days=byId("extras-stay-count");
    if(days)days.textContent=q.d.nights===null?l.noDate:q.d.nights+" "+l.night+(q.d.nights>1&&language==="fr"?"s":"")+" · "+t.confirm.split(".")[0]+".";
    const estimate=byId("extras-estimate");
    if(estimate)estimate.textContent=q.d.nights===null?l.noDate:l.summary+" : "+chf(q.total)+(q.rows.some(r=>r.rate===null)?" · "+l.pending:"");
    const approval=byId("extras-pet-approval");if(approval)approval.hidden=q.s.pets!=="3plus";
    const dep=byId("extras-departure");if(dep&&q.d.arrival)dep.min=q.d.arrival;
    const explain=byId("extras-summary-disclaimer");if(explain)explain.textContent=t.confirm;
    reportError("");
  }
  function validate(emailRequired){
    const q=calculate(),issues=[...q.errors];
    if(!q.rows.length)issues.push(l.extra);
    if(emailRequired){
      if(!byId("extras-name")?.value.trim())issues.push(l.name);
      const em=byId("extras-email");
      if(!em?.value.trim()||!em.checkValidity())issues.push(l.email);
    }
    if(issues.length){
      reportError(issues.join(" "));
      byId("extras-validation")?.scrollIntoView?.({block:"nearest",behavior:"smooth"});
      return null;
    }
    reportError("");
    return q;
  }
  function message(q){
    const lines=[l.intro,"","Arrivée / Check-in: "+q.d.arrival,"Départ / Check-out: "+q.d.departure,
      "Nuitées / Nights: "+q.d.nights,"Voyageurs / Guests: "+q.guests,
      "Nom / Name: "+(byId("extras-name")?.value.trim()||"-"),
      "E-mail: "+(byId("extras-email")?.value.trim()||"-"),
      "Référence Smoobu: "+(byId("extras-reference")?.value.trim()||"-"),"",
      "Options choisies:"];
    for(const r of q.rows)lines.push("• "+r.title+" — "+(r.rate===null?l.pending:chf(r.rate)+" × "+q.d.nights+" = "+chf(r.total)));
    lines.push("",l.summary+": "+chf(q.total),l.pending+" (si commandé)");
    const notes=byId("extras-notes")?.value.trim();
    if(notes)lines.push("","Notes: "+notes);
    lines.push("",l.notice);
    return lines.join("\n");
  }
  for(const id of ["extras-arrival","extras-departure","extras-guests","extras-name","extras-email",
    "extras-reference","extras-notes","extras-jacuzzi","extras-sauna","extras-barbecue","extras-pets",
    "extras-fondue-simple","extras-fondue-premium"]){
    const node=byId(id);
    if(!node)continue;
    const change=()=>{
      if(id==="extras-fondue-simple"&&node.value!=="0")byId("extras-fondue-premium").value="0";
      if(id==="extras-fondue-premium"&&node.value!=="0")byId("extras-fondue-simple").value="0";
      render();
    };
    node.addEventListener("change",change);
    if(node.tagName==="INPUT"||node.tagName==="TEXTAREA")node.addEventListener("input",change);
  }
  const today=localToday();
  for(const id of ["extras-arrival","extras-departure"]){const node=byId(id);if(node)node.min=today;}
  byId("extras-order-form")?.addEventListener("submit",event=>event.preventDefault());
  byId("extras-send")?.addEventListener("click",()=>{
    const q=validate(true);if(!q)return;
    location.href="mailto:chaletlardoise@gmail.com?subject="+encodeURIComponent(l.intro)+"&body="+encodeURIComponent(message(q));
    reportError(l.mail);
  });
  byId("extras-copy")?.addEventListener("click",async()=>{
    const q=validate(false);if(!q)return;
    try{
      await navigator.clipboard.writeText(message(q));
      byId("extras-copy").textContent=l.copied;
      setTimeout(()=>byId("extras-copy").textContent=t.copy,2400);
    }catch{reportError(l.copyFail);}
  });
  render();
})();
