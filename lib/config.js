status_list=["geplant","Sitz","Abschluss","Layout 1","Abschluss/Sitz","Erstlesung","Zweitlesung","Layout 2","Revision","Endkontrolle","GzD"];
web_status_list=["geplant","Sitz","Abschluss","Korrektorat","Endkontrolle","GzWeb"];

layout_list=["Stories checken","Smartphone-Inhaltsverzeichnis","PDFs klein","Facebook Cover","APP","SMD/BLV","Schaufi","Archiv verschieben"];


// array index 0 = own role, index 1 = default target
ticket_roles=[["layout","abschluss"],["abschluss","layout"],["foto","abschluss"]];


texttype_list=[
  {
      "type_id":"nor",
      "title":"Normaler Artikel",
      "textfields":["Spitz","Titel","Lead","Autorin","Text"],
      "examples":["Ganze Seite","Halbe Seite","Essay","Monatsinti","Interview","etc."]
  },
  {
      "type_id":"nolead",
      "title":"Ohne Lead",
      "textfields":["Spitz","Titel","Autorin","Text"],
      "examples":["Seite 1","Seite 2 Komm.","Sibille Berg","Affekt/NadW","Zoo"]
  },
  {
      "type_id":"noleadaut",
      "title":"Ohne Lead & Autor:innenzeile",
      "textfields":["Spitz","Titel","Text"],
      "examples":["Spot","DvGuB","WWG","Digi","Rätsel","KoText","Kommentar","Tipp der Woche"]
  },
  {
      "type_id":"list",
      "title":"Listengefässe",
      "textfields":["Spitz","Text"],
      "examples":["Haumis","Politour","Agenda","Briefe","Woznews"]
  },
  {
      "type_id":"fb",
      "title":"Nur Titel",
      "textfields":["Titel","Text"],
      "examples":["Fact/Biobox","Korrigenda","KreuzWoz","Rätsel-Lösung"]
  },
  {
      "type_id":"noaut",
      "title":"Ohne Autor:innenzeile",
      "textfields":["Spitz","Titel","Lead","Text"],
      "examples":["Kolumne"]
  },
  {
      "type_id":"ktipp",
      "title":"Kulturtipp",
      "textfields":["Spitz","Titel","Text"],
      "examples":["Kulturtipp"]
  },
  {
      "type_id":"nospitz",
      "title":"Ohne Spitz",
      "textfields":["Titel","Lead","Text","Autorin"],
      "examples":["Wobei-Texte"]
  },
  {
      "type_id":"none",
      "title":"Kein Text",
      "textfields":[],
      "examples":[]
  }
]


texttype_textfields={}; // macht ein objekt aus texttype_list mit den textfields und type_id als index
texttype_list.forEach(function (item, index) {
 texttype_textfields[item.type_id]=item.textfields;
});
