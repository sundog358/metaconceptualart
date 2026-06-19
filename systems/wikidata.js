/*
 * Metaconceptual Art — live link into the Wikidata graph.
 *
 * The Systems page grounds each concept node in a Wikidata QID. This script
 * follows those anchors one step outward, asking Wikidata for the concepts,
 * movements, and figures directly connected to them by influence, and renders
 * them as a live "related concepts" register.
 *
 * Progressive enhancement: the page is fully meaningful without this script.
 * If Wikidata is unreachable or JavaScript is off, the static seed links
 * already in the markup remain the canonical layer.
 */
(function () {
  "use strict";

  var mount = document.getElementById("wikidata-related");
  if (!mount) return;

  // Anchor concepts (see data/graph.json -> anchorConcepts):
  // conceptual art, institutional critique, systems art, internet art.
  var ANCHORS = ["Q203209", "Q6041145", "Q919251", "Q1569950"];
  var ENDPOINT = "https://query.wikidata.org/sparql";
  var ENTITY = "https://www.wikidata.org/wiki/";

  var values = ANCHORS.map(function (q) {
    return "wd:" + q;
  }).join(" ");
  var exclude = ANCHORS.map(function (q) {
    return "wd:" + q;
  }).join(", ");

  var query =
    "SELECT DISTINCT ?item ?itemLabel ?itemDescription WHERE {" +
    "  VALUES ?anchor { " + values + " }" +
    "  { ?anchor wdt:P737 ?item. } UNION { ?item wdt:P737 ?anchor. }" +
    "  FILTER(?item NOT IN (" + exclude + "))" +
    '  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }' +
    "}" +
    "ORDER BY ?itemLabel LIMIT 24";

  var url =
    ENDPOINT + "?format=json&query=" + encodeURIComponent(query);

  function setStatus(text) {
    var status = document.getElementById("wikidata-status");
    if (status) status.textContent = text;
  }

  function render(rows) {
    if (!rows.length) {
      setStatus("No related concepts returned.");
      return;
    }

    var frag = document.createDocumentFragment();
    rows.forEach(function (row) {
      var qid = row.item.value.replace(/^.*\//, "");
      var li = document.createElement("li");

      var link = document.createElement("a");
      link.className = "wd-link";
      link.href = ENTITY + qid;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = row.itemLabel ? row.itemLabel.value : qid;

      var qidTag = document.createElement("span");
      qidTag.className = "wd-qid";
      qidTag.textContent = qid;

      var name = document.createElement("p");
      name.className = "wd-related-name";
      name.appendChild(link);
      name.appendChild(qidTag);
      li.appendChild(name);

      if (row.itemDescription && row.itemDescription.value) {
        var desc = document.createElement("p");
        desc.className = "wd-related-desc";
        desc.textContent = row.itemDescription.value;
        li.appendChild(desc);
      }

      frag.appendChild(li);
    });

    mount.innerHTML = "";
    mount.appendChild(frag);
    setStatus("Live from Wikidata — " + rows.length + " related concepts.");
  }

  setStatus("Querying Wikidata…");

  fetch(url, { headers: { Accept: "application/sparql-results+json" } })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      render(data.results.bindings);
    })
    .catch(function () {
      setStatus(
        "Wikidata could not be reached. The seed concepts above remain the canonical layer."
      );
    });
})();
