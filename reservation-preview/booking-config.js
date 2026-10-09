/* Customer-facing defaults only. The final accommodation/checkout price comes
   from Smoobu. Never place credentials or supplier purchase prices here. */
(function (root, factory) {
  const config = factory();
  if (typeof module === "object" && module.exports) module.exports = config;
  else root.LArdoiseBookingConfig = config;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  return Object.freeze({
    currency: "CHF",
    timeZone: "Europe/Zurich",
    accountId: 1441081,
    apartmentId: 2948066,
    bookingUrl: "https://booking.smoobu.com/9A1441081",
    maxGuests: 8,
    maxPets: 2,
    jacuzziMinNights: 2,
    barbecueMonths: Object.freeze([5, 6, 7, 8, 9, 10]),
    nightly: Object.freeze({ jacuzzi: 70, sauna: 60, barbecue: 10, pet: 15 }),
    // null means an enquiry, not a free or bookable pack. Retail prices are
    // deliberately unset; the negotiated wine price is NOT a pack retail price.
    fondue: Object.freeze({ simple4: null, simple8: null, premium4: null, premium8: null })
  });
});
