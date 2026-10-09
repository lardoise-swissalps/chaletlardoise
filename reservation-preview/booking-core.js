(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./booking-config.js"));
  } else {
    root.LArdoiseBooking = factory(root.LArdoiseBookingConfig);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (config) {
  "use strict";
  const dayMs = 86400000;
  function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return null;
    const date = new Date(value + "T12:00:00Z");
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return null;
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }
  function today(now = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: config.timeZone, year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(now);
    const value = type => parts.find(part => part.type === type).value;
    return value("year") + "-" + value("month") + "-" + value("day");
  }
  function stay(arrival, departure) {
    const a = parseDate(arrival), b = parseDate(departure);
    return { arrival, departure, a, b, nights: a !== null && b !== null && b > a ? (b - a) / dayMs : null };
  }
  function barbecueAvailable(dates) {
    if (dates.nights === null) return false;
    for (let night = 0; night < dates.nights; night++) {
      if (!config.barbecueMonths.includes(new Date(dates.a + night * dayMs).getUTCMonth() + 1)) return false;
    }
    return true;
  }
  function bookingUrl(dates, guests) {
    if (dates.nights === null || !Number.isInteger(guests) || guests < 1 || guests > config.maxGuests) return null;
    const format = value => value.slice(8, 10) + "/" + value.slice(5, 7) + "/" + value.slice(0, 4);
    const url = new URL(config.bookingUrl);
    url.searchParams.set("apartmentId", String(config.apartmentId));
    url.searchParams.set("arrivalDate", format(dates.arrival));
    url.searchParams.set("departureDate", format(dates.departure));
    url.searchParams.set("adults", String(guests));
    url.searchParams.set("children", "0");
    url.searchParams.set("loadForCurrentDate", "true");
    return url.href;
  }
  return Object.freeze({ config, parseDate, today, stay, barbecueAvailable, bookingUrl });
});
