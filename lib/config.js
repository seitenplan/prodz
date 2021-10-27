text_submit_baseurl="https://prodsys2021-staging.schreibzeug.org/article-ui/#/text/submit/print/";

status_list=["geplant","Abschluss","Layout 1","Abschluss/Sitz","Erstlesung","Zweitlesung","Layout 2","Revision","Endkontrolle","GzD"];

layout_list=["Stories checken","Smartphone-Inhaltsverzeichnis","PDFs klein","Facebook Cover","APP","SMD/BLV","Schaufi","Archiv verschieben"];


// array index 0 = own role, index 1 = default target
ticket_roles=[["layout","abschluss"],["abschluss","layout"],["foto","abschluss"]];


texttype_list=[
  {
      "type_id":"nor",
      "title":"Normaler Artikel",
      "Textfields":["Spitz","Titel","Lead","Autorin","Text","Fussnote"],
      "examples":["Ganze Seite","Halbe Seite","Essay","etc."]
  },
  {
      "type_id":"nolead",
      "title":"Ohne Lead",
      "Textfields":["Spitz","Titel","Autorin","Text","Fussnote"],
      "examples":["Seite 1","Seite 2 Komm.","Sibille Berg","Affekt/NadW"]
  },
  {
      "type_id":"noleadaut",
      "title":"Ohne Lead & Autor:in",
      "Textfields":["Spitz","Titel","Text","Fussnote"],
      "examples":["DvGuB","WWG","Digi","Rätsel","KoText","Kommentar"]
  },
  {
      "type_id":"list",
      "title":"Listengefässe",
      "Textfields":["Spitz","Text","Fussnote"],
      "examples":["Haumis","Politour","Agenda","Briefe","Woznews"]
  },
  {
      "type_id":"fb",
      "title":"Fact/Biobox",
      "Textfields":["Titel","Text","Fussnote"],
      "examples":["Fact/Biobox"]
  },
  {
      "type_id":"noaut",
      "title":"Ohne Autor:in",
      "Textfields":["Spitz","Titel","Lead","Text","Fussnote"],
      "examples":["Kolumne"]
  },
  {
      "type_id":"ktipp",
      "title":"Kulturtipp",
      "Textfields":["Spitz","Titel","Fussnote","Text"],
      "examples":["Kulturtipp"]
  }
]


texttype_textfields={}; // macht ein objekt aus texttype_list mit den textfields und type_id als index
texttype_list.forEach(function (item, index) {
 texttype_textfields[item.type_id]=item.textfields;
});
