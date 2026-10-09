"""Refresh the exported site's copy while preserving its existing galleries.

The repository contains a static export. This bounded patch keeps the original
chunks as inputs and gives changed chunks new names so visitors cannot combine
the new HTML with an older cached page module. No pricing settings are changed.
"""
from pathlib import Path
import hashlib
import html
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
ORIGINAL_PAGE = "page-B7Ju9-4Y.js"
ORIGINAL_BOOT = "index-D-wQDluK.js"
ORIGINAL_LAYOUT = "layout-segment-context-DBvBeHfX.js"
page = (ROOT / "assets" / ORIGINAL_PAGE).read_text()
index = (ROOT / "index.html").read_text()

def synchronize_module_graph(page_name, index):
    # The layout imports the bootstrap's exported context. Rename both ends of
    # that cycle; otherwise loading the old bootstrap restores its old page map.
    boot_name = "index-chalet-20261009.js"
    layout_name = "layout-segment-context-chalet-20261009.js"
    boot = (ROOT / "assets" / ORIGINAL_BOOT).read_text()
    boot = boot.replace(ORIGINAL_PAGE, page_name).replace(ORIGINAL_LAYOUT, layout_name)
    layout = (ROOT / "assets" / ORIGINAL_LAYOUT).read_text().replace(ORIGINAL_BOOT, boot_name)
    (ROOT / "assets" / boot_name).write_text(boot)
    (ROOT / "assets" / layout_name).write_text(layout)
    index = index.replace(ORIGINAL_PAGE, page_name).replace(ORIGINAL_BOOT, boot_name)
    index = index.replace("index-4fe4a3d89d.js", boot_name).replace(ORIGINAL_LAYOUT, layout_name)
    (ROOT / "index.html").write_text(index)
    print("Synchronized module graph:", page_name, boot_name, layout_name)

if "Notes consultées le 9 octobre 2026." in index:
    page_name = re.search(r"assets/(page-[a-f0-9]{10}\.js)", index).group(1)
    synchronize_module_graph(page_name, index)
    print("Site copy migration already applied.")
    sys.exit(0)

def replace_once(text, old, new):
    count = text.count(old)
    if count != 1:
        raise ValueError(f"Expected one match for {old[:80]!r}, found {count}")
    return text.replace(old, new, 1)

languages = ["fr", "en", "de", "it"]
cleaning = {
    "fr": ["Nettoyage inclus", "Entretien du chalet", "Ménage de fin de séjour compris", "Ménage final : CHF 290, inclus dans le total"],
    "en": ["Cleaning included", "Chalet care", "End-of-stay cleaning included", "Final cleaning: CHF 290, included in the total"],
    "de": ["Reinigung inklusive", "Chaletpflege", "Endreinigung inbegriffen", "Endreinigung: CHF 290, im Gesamtpreis enthalten"],
    "it": ["Pulizie incluse", "Cura dello chalet", "Pulizia finale compresa", "Pulizia finale: CHF 290, inclusa nel totale"],
}
booking = {
    "fr": ["Comment envoyer une demande de réservation ?", "Comment réserver en direct ?", "Consultez le calendrier Smoobu synchronisé, puis indiquez vos dates et le nombre de voyageurs dans le formulaire. Nous vous répondons sous 24 heures.", "Cliquez sur Réserver, choisissez vos dates et vos voyageurs, puis vos options dans le formulaire. Smoobu affiche le prix du séjour, le ménage et les options sélectionnées avant confirmation. Pour une question particulière, contactez-nous."],
    "en": ["How do I send a booking request?", "How do I book directly?", "Check the synchronised Smoobu calendar, then add your dates and guest count to the form. We reply within 24 hours.", "Click Book, choose dates and guests, then select your extras in the form. Smoobu shows the accommodation price, cleaning fee and selected extras before confirmation. Contact us for any specific questions."],
    "de": ["Wie sende ich eine Buchungsanfrage?", "Wie buche ich direkt?", "Prüfen Sie den synchronisierten Smoobu-Kalender und geben Sie Daten und Gästezahl im Formular an. Wir antworten innerhalb von 24 Stunden.", "Klicken Sie auf Buchen, wählen Sie Daten, Gästezahl und Extras im Formular. Smoobu zeigt Unterkunft, Reinigung und gewählte Extras vor der Bestätigung an. Bei besonderen Fragen kontaktieren Sie uns."],
    "it": ["Come invio una richiesta di prenotazione?", "Come prenoto direttamente?", "Consulta il calendario Smoobu sincronizzato, quindi indica date e numero di ospiti nel modulo. Rispondiamo entro 24 ore.", "Clicca su Prenota, scegli date e ospiti, poi gli extra nel modulo. Smoobu mostra il prezzo dello chalet, le pulizie e gli extra selezionati prima della conferma. Contattaci per domande specifiche."],
}
payment = {"fr": ["Paiement sécurisé", "Paiement par virement"], "en": ["Secure payment", "Payment by bank transfer"], "de": ["Sichere Zahlung", "Zahlung per Überweisung"], "it": ["Pagamento sicuro", "Pagamento con bonifico"]}
review_dates = {
    "fr": " Notes consultées le 9 octobre 2026. Les dernières notes et les nouveaux avis sont disponibles sur les plateformes.",
    "en": " Ratings checked on 9 October 2026. Visit the platforms for the latest ratings and reviews.",
    "de": " Bewertungen am 9. Oktober 2026 geprüft. Aktuelle Noten und neue Bewertungen finden Sie auf den Plattformen.",
    "it": " Valutazioni consultate il 9 ottobre 2026. Le valutazioni e recensioni più recenti sono sulle piattaforme.",
}
faq_additions = {
    "fr": [["Comment le ménage est-il facturé ?", "Le ménage de fin de séjour est de CHF 290 par réservation. Il figure dans le récapitulatif Smoobu et est compris dans le total affiché avant confirmation."], ["Quel moyen de paiement est proposé ?", "Le règlement est actuellement prévu intégralement par virement bancaire. Les instructions de paiement sont communiquées avec votre réservation."], ["Une caution est-elle prévue ?", "En réservation directe, une caution de CHF 480 est prévue en plus du séjour, payable à l’arrivée. Elle est restituée sous 7 jours après le départ, après vérification du chalet."], ["Quelles sont les conditions d’annulation ?", "Pour une réservation directe, contactez-nous avant de confirmer afin de recevoir les conditions d’annulation applicables à votre offre. Pour Airbnb et Booking.com, consultez les conditions de la réservation sur la plateforme concernée."]],
    "en": [["How is cleaning charged?", "Final cleaning costs CHF 290 per booking. It appears in the Smoobu breakdown and is included in the total shown before confirmation."], ["How can I pay?", "Full payment is currently by bank transfer. Payment instructions are provided with your booking."], ["Is there a security deposit?", "Direct bookings include a CHF 480 security deposit, separate from the stay price and payable on arrival. It is returned within 7 days of check-out after inspection of the chalet."], ["What is the cancellation policy?", "For direct bookings, contact us before confirming to receive the cancellation terms for your offer. For Airbnb and Booking.com, check the terms of your booking on the relevant platform."]],
    "de": [["Wie wird die Reinigung berechnet?", "Die Endreinigung kostet CHF 290 pro Buchung. Sie erscheint in der Smoobu-Preisübersicht und ist im Gesamtpreis vor der Bestätigung enthalten."], ["Wie kann ich bezahlen?", "Derzeit ist der vollständige Betrag per Banküberweisung zu bezahlen. Zahlungsinformationen erhalten Sie mit Ihrer Buchung."], ["Ist eine Kaution vorgesehen?", "Bei Direktbuchungen ist eine Kaution von CHF 480 zusätzlich zum Aufenthalt bei Anreise fällig. Sie wird innerhalb von 7 Tagen nach Abreise und Prüfung des Chalets zurückgezahlt."], ["Welche Stornobedingungen gelten?", "Kontaktieren Sie uns bei Direktbuchungen vor der Bestätigung, um die Stornobedingungen Ihres Angebots zu erhalten. Bei Airbnb und Booking.com gelten die Bedingungen Ihrer Buchung auf der jeweiligen Plattform."]],
    "it": [["Come vengono addebitate le pulizie?", "Le pulizie finali costano CHF 290 per prenotazione. Compaiono nel riepilogo Smoobu e sono incluse nel totale mostrato prima della conferma."], ["Come posso pagare?", "Attualmente il pagamento integrale è previsto tramite bonifico bancario. Le istruzioni sono comunicate con la prenotazione."], ["È prevista una cauzione?", "Per le prenotazioni dirette è prevista una cauzione di CHF 480, separata dal prezzo del soggiorno, da versare all’arrivo. Viene restituita entro 7 giorni dalla partenza dopo la verifica dello chalet."], ["Quali sono le condizioni di cancellazione?", "Per prenotazioni dirette, contattaci prima di confermare per ricevere le condizioni applicabili alla tua offerta. Per Airbnb e Booking.com consulta le condizioni della tua prenotazione sulla piattaforma interessata."]],
}
info_links = {"fr": ["Infos de séjour", "Données personnelles"], "en": ["Stay information", "Personal data"], "de": ["Aufenthaltsinfos", "Persönliche Daten"], "it": ["Info sul soggiorno", "Dati personali"]}

for lang in languages:
    name_old, name_new, detail_old, detail_new = cleaning[lang]
    page = replace_once(page, f"{lang}:`{name_old}`", f"{lang}:`{name_new}`")
    page = replace_once(page, f"{lang}:`{detail_old}`", f"{lang}:`{detail_new}`")
    question_old, question_new, answer_old, answer_new = booking[lang]
    page = replace_once(page, question_old, question_new)
    page = replace_once(page, answer_old, answer_new)
    page = replace_once(page, f"secure:`{payment[lang][0]}`", f"secure:`{payment[lang][1]}`")

for old, new in [("7 avis", "8 avis"), ("7 reviews", "8 reviews"), ("7 Bewertungen", "8 Bewertungen"), ("7 recensioni", "8 recensioni")]:
    page = replace_once(page, f"reviewsBooking:`{old}`", f"reviewsBooking:`{new}`")

review_matches = list(re.finditer(r"reviewsText:`([^`]+)`", page))
if len(review_matches) != 4:
    raise ValueError("Unexpected review translation count")
for lang, match in reversed(list(zip(languages, review_matches))):
    old = match.group(1)
    page = page[:match.start(1)] + old + review_dates[lang] + page[match.end(1):]
    if lang == "fr":
        index = replace_once(index, html.escape(old, quote=False), html.escape(old + review_dates[lang], quote=False))

faq_blocks = list(re.finditer(r"faqItems:\[(.*?)\],faqLink:", page))
if len(faq_blocks) != 4:
    raise ValueError("Unexpected FAQ translation count")
for lang, match in reversed(list(zip(languages, faq_blocks))):
    extra = "," + ",".join("[`" + question + "`,`" + answer + "`]" for question, answer in faq_additions[lang])
    page = page[:match.end(1)] + extra + page[match.end(1):]

labels = "{" + ",".join(lang + ":[`" + "`,`".join(info_links[lang]) + "`]" for lang in languages) + "}"
footer_old = "(0,V.jsx)(`a`,{href:`#faq`,children:s.faqLink})"
footer_new = footer_old + ",(0,V.jsx)(`a`,{href:`/chaletlardoise/infos-sejour/?lang=${e}`,children:" + labels + "[e][0]}),(0,V.jsx)(`a`,{href:`/chaletlardoise/infos-sejour/?lang=${e}#donnees`,children:" + labels + "[e][1]})"
page = replace_once(page, footer_old, footer_new)

# Keep server-rendered French consistent with hydration and search engines.
for old, new in [(cleaning["fr"][0], cleaning["fr"][1]), (cleaning["fr"][2], cleaning["fr"][3]), (booking["fr"][0], booking["fr"][1]), (booking["fr"][2], booking["fr"][3]), ("7 avis", "8 avis")]:
    index = replace_once(index, old, new)
faq_html = "".join("<details><summary>" + html.escape(q) + '<span aria-hidden="true">+</span></summary><p>' + html.escape(a) + "</p></details>" for q, a in faq_additions["fr"])
index = replace_once(index, '</div></section><footer>', faq_html + '</div></section><footer>')
index = replace_once(index, '<a href="#faq">Questions fréquentes</a></nav>', '<a href="#faq">Questions fréquentes</a><a href="/chaletlardoise/infos-sejour/">Infos de séjour</a><a href="/chaletlardoise/infos-sejour/#donnees">Données personnelles</a></nav>')

page_name = "page-" + hashlib.sha256(page.encode()).hexdigest()[:10] + ".js"
(ROOT / "assets" / page_name).write_text(page)
synchronize_module_graph(page_name, index)
