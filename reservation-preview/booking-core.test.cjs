const test = require("node:test");
const assert = require("node:assert/strict");
const booking = require("./booking-core.js");

test("strict dates, leap years and positive night counts", () => {
  assert.equal(booking.parseDate("2026-02-29"), null);
  assert.notEqual(booking.parseDate("2028-02-29"), null);
  assert.equal(booking.parseDate("2026-1-01"), null);
  assert.equal(booking.stay("2026-11-16", "2026-11-18").nights, 2);
  assert.equal(booking.stay("2026-11-18", "2026-11-16").nights, null);
  assert.equal(booking.stay("2026-11-16", "2026-11-16").nights, null);
});
test("night counts survive Swiss DST changes", () => {
  assert.equal(booking.stay("2026-10-24", "2026-10-27").nights, 3);
  assert.equal(booking.stay("2027-03-27", "2027-03-30").nights, 3);
});
test("Swiss date rather than UTC or guest device date", () => {
  assert.equal(booking.today(new Date("2026-10-09T22:30:00Z")), "2026-10-10");
  assert.equal(booking.today(new Date("2026-12-09T23:30:00Z")), "2026-12-10");
});
test("BBQ is available only when every booked night is May–October", () => {
  assert.equal(booking.barbecueAvailable(booking.stay("2026-10-30", "2026-11-01")), true);
  assert.equal(booking.barbecueAvailable(booking.stay("2026-10-30", "2026-11-02")), false);
  assert.equal(booking.barbecueAvailable(booking.stay("2027-04-30", "2027-05-02")), false);
  assert.equal(booking.barbecueAvailable(booking.stay("2027-05-01", "2027-05-03")), true);
  assert.equal(booking.barbecueAvailable(booking.stay("2026-11-16", "2026-11-18")), false);
});
test("Smoobu handoff includes exact dates and the actual chalet property", () => {
  const url = new URL(booking.bookingUrl(booking.stay("2026-11-16", "2026-11-18"), 4));
  assert.equal(url.origin, "https://booking.smoobu.com");
  assert.equal(url.searchParams.get("apartmentId"), "2948066");
  assert.equal(url.searchParams.get("arrivalDate"), "16/11/2026");
  assert.equal(url.searchParams.get("departureDate"), "18/11/2026");
  assert.equal(url.searchParams.get("adults"), "4");
  assert.equal(url.searchParams.get("children"), "0");
  assert.equal(booking.bookingUrl(booking.stay("2026-11-16", "2026-11-18"), 9), null);
  assert.equal(booking.bookingUrl(booking.stay("2026-11-18", "2026-11-16"), 4), null);
  assert.equal(url.searchParams.has("guest.email"), false);
});
test("unconfirmed pack prices cannot silently turn into free purchases", () => {
  for (const price of Object.values(booking.config.fondue)) assert.equal(price, null);
  assert.equal(booking.config.nightly.jacuzzi, 70);
  assert.equal(booking.config.nightly.sauna, 60);
  assert.equal(booking.config.nightly.barbecue, 10);
  assert.equal(booking.config.nightly.pet, 15);
});

// Run the real view script against a minimal DOM, without a browser or network.
function planner(settings = {}, config = booking.config) {
  const vm = require("node:vm");
  const fs = require("node:fs");
  const nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      id, value: "", checked: false, textContent: "", tagName: "INPUT", hidden: false,
      children: [], events: {}, attributes: {},
      addEventListener(type, callback) { this.events[type] = callback; },
      append(child) { this.children.push(child); },
      replaceChildren() { this.children = []; },
      setAttribute(name, value) { this.attributes[name] = value; },
      checkValidity() { return /.+@.+\..+/.test(this.value); }
    });
    return nodes.get(id);
  };
  for (const [id, value] of Object.entries({
    "extras-arrival": "2099-11-16", "extras-departure": "2099-11-18",
    "extras-guests": "4", "extras-pets": "0", "extras-fondue-simple": "0",
    "extras-fondue-premium": "0", ...settings
  })) {
    if (typeof value === "boolean") node(id).checked = value;
    else node(id).value = value;
  }
  const context = {
    window: { LArdoiseBooking: { ...booking, config } },
    location: { search: "?lang=fr" }, localStorage: { getItem: () => null },
    navigator: { language: "fr" }, URLSearchParams, Intl, Date, setTimeout,
    document: {
      getElementById: node, querySelectorAll: () => [], querySelector: () => null,
      createElement: () => ({ textContent: "" })
    }
  };
  vm.runInNewContext(fs.readFileSync(require.resolve("./reservation-extras.js"), "utf8"), context);
  return { node, context };
}
test("actual planner bills nightly extras for the whole stay", () => {
  const { node } = planner({ "extras-jacuzzi": true, "extras-sauna": true, "extras-pets": "2" });
  assert.match(node("extras-estimate").textContent, /320/);
  assert.equal(node("extras-summary-list").children.length, 3);
  assert.match(node("extras-summary-list").children[0].textContent, /× 2 = .*140/);
  assert.match(node("extras-summary-list").children[1].textContent, /× 2 = .*120/);
  assert.match(node("extras-summary-list").children[2].textContent, /× 2 = .*60/);
});
test("priced fondue is billed once and fractional prices are preserved", () => {
  const config = { ...booking.config, fondue: { ...booking.config.fondue, simple4: 99.5 } };
  const { node } = planner({ "extras-fondue-simple": "4" }, config);
  assert.match(node("extras-estimate").textContent, /99[.,]5/);
  assert.match(node("extras-summary-list").children[0].textContent, /× 1 =/);
  assert.doesNotMatch(node("extras-summary-list").children[0].textContent, /× 2/);
});
test("pending packs and extra pets remain enquiries, not purchases", () => {
  const { node } = planner({ "extras-fondue-premium": "8", "extras-pets": "3plus" });
  assert.match(node("extras-summary-list").children[0].textContent, /autorisation/);
  assert.match(node("extras-summary-list").children[1].textContent, /prix à confirmer/);
  assert.equal(node("extras-pet-approval").hidden, false);
});
test("invalid BBQ and one-night jacuzzi cannot use the dates handoff", () => {
  const bbq = planner({ "extras-barbecue": true });
  assert.equal(bbq.node("extras-book").attributes["aria-disabled"], "true");
  let prevented = false;
  bbq.node("extras-book").events.click({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.match(bbq.node("extras-validation").textContent, /Barbecue/);
  const jacuzzi = planner({ "extras-jacuzzi": true, "extras-departure": "2099-11-17" });
  assert.equal(jacuzzi.node("extras-book").attributes["aria-disabled"], "true");
});
test("dates-only handoff works without contact fields or selected extras", () => {
  const { node } = planner();
  assert.equal(node("extras-book").attributes["aria-disabled"], "false");
  const url = new URL(node("extras-book").href);
  assert.equal(url.searchParams.get("arrivalDate"), "16/11/2099");
  assert.equal(url.searchParams.get("adults"), "4");
  assert.equal(url.searchParams.has("optionalItems"), false);
});
