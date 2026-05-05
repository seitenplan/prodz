status_list = [
  "geplant",
  "Sitz",
  "Abschluss",
  "Layout 1",
  "Abschluss/Sitz",
  "Erstlesung",
  "Zweitlesung",
  "Layout 2",
  "Revision",
  "Endkontrolle",
  "GzD",
];
web_status_list = [
  "geplant",
  "Sitz",
  "Abschluss",
  "Korrektorat",
  "Endkontrolle",
  "GzWeb",
];

layout_list = [
  "Stories checken",
  "Smartphone-Inhaltsverzeichnis",
  "PDFs klein",
  "Facebook Cover",
  "APP",
  "SMD/BLV",
  "Schaufi",
  "Archiv verschieben",
];

// array index 0 = own role, index 1 = default target
ticket_roles=[["layout","abschluss"],["abschluss","layout"],["foto","abschluss"]];


texttype_list = [
  // {
  //     "type_id":"nor",
  //     "title":"Normaler Artikel",
  //     "textfields":["Spitz","Titel","Lead","Autorin","Text"],
  //     "examples":["Ganze Seite","Halbe Seite","Essay","Monatsinti","Interview","etc."]
  // },
  {
    type_id: "2026_normal",
    title: "Normaler Artikel",
    textfields: ["Spitz", "Lead", "Titel", "Autorin", "Text"],
    examples: [],
  },
  {
      "type_id":"nolead",
      "title":"Ohne Lead",
      "textfields":["Spitz","Titel","Autorin","Text"],
      "examples":["Spatzen auf Kanonen", "Kulturtipp"]
  },
  // {
  //     "type_id":"noleadaut",
  //     "title":"Ohne Lead & Autor:innenzeile",
  //     "textfields":["Spitz","Titel","Text"],
  //     "examples":["Spot","DvGuB","WWG","Digi","Rätsel","KoText","Kommentar","Tipp der Woche"]
  // },
  {
    type_id: "2026_noleadaut",
    title: "Ohne Lead & Autor:innenzeile",
    textfields: ["Spitz", "Titel", "Text"],
    examples: ["Spot", "Kotext"],
  },
  {
      "type_id":"list",
      "title":"Listengefässe",
      "textfields":["Spitz","Text"],
      "examples":["Politour", "Briefe"]
  },
  {
      "type_id":"fb",
      "title":"Nur Titel",
      "textfields":["Titel","Text"],
      "examples":["Fact/Biobox","KreuzWoz","Rätsel-Lösung", "Newstext"]
  },
  // {
  //     "type_id":"noaut",
  //     "title":"Ohne Autor:innenzeile",
  //     "textfields":["Spitz","Titel","Lead","Text"],
  //     "examples":["Kolumne"]
  // },
  {
    type_id: "2026_noaut",
    title: "Ohne Autor:innenzeile",
    textfields: ["Spitz", "Lead", "Titel", "Text"],
    examples: ["Kolumne", "Kommentar", "Kolumne"],
  },
  // {
  //     "type_id":"ktipp",
  //     "title":"Kulturtipp",
  //     "textfields":["Spitz","Titel","Text"],
  //     "examples":["Kulturtipp"]
  // },
  {
      "type_id":"nospitz",
      "title":"Wobei (ohne Spitz)",
      "textfields":["Titel","Lead","Text","Autorin"],
      "examples":["Wobei-Texte"]
  },
  {
    type_id: "2026_edito",
    "title": "Editorial",
    textfields: ["Spitz", "Text"],
    "examples": []
  },
  {
      "type_id": "none",
      "title": "Kein Text",
      "textfields": [],
      "examples": []
  },

];

texttype_textfields = {}; // macht ein objekt aus texttype_list mit den textfields und type_id als index
texttype_list.forEach(function (item, index) {
  texttype_textfields[item.type_id] = item.textfields;
});
