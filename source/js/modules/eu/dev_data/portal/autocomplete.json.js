define([], function(){

  var paramName = 'text';

  function log(msg){
    console.log('Autocomplete: ' + msg);
  }

  var data = [
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Alchemy", "it": "Alchimia"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/place/base/235",
      "prefLabel": {"en": "Amsterdam"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "prefLabel": {"en": "Aristotle", "it": "Aristotole"},
      "dateOfBirth": "384 BC",
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "prefLabel": {"en": "Anaxagoras"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Blues Music", "it": "Musica Blues"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Banjo"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/place/base/235",
      "prefLabel": {"en": "Bergamo"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "prefLabel": {"en": "Bismarck (Otto von)"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Classical music", "it": "Musica Classica"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "prefLabel": {"en": "Caligula"},
      "dateOfDeath": "41 AD",
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "prefLabel": {"en": "Chopin"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/place/base/235",
      "prefLabel": {"en": "Canterbury"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/place/base/235",
      "prefLabel": {"en": "Damascus"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "prefLabel": {"en": "David Hasselhof"},
      "dateOfBirth": "1952-17-07",
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/place/base/235",
      "prefLabel": {"en": "Delaware"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/place/base/235",
      "prefLabel": {"en": "Denver"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/place/base/177576",
      "prefLabel": {"en": "Empoli"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/agent/base/177576",
      "dateOfBirth": "1521-01-08",
      "dateOfDeath": "1601-12-12",
      "prefLabel": {"en": "Erasmus"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/agent/base/177576",
      "dateOfBirth": "28-10-1909",
      "dateOfDeath": "28-04-1992",
      "prefLabel": {"en": "Francis Bacon"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/concept/base/177576",
      "prefLabel": {"en": "Feathers", "it": "Piume"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/177576",
      "prefLabel": {"en": "Fresco", "it": "Affreschi"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/place/base/177576",
      "prefLabel": {"en": "Florence", "it": "Firenze"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/place/base/177576",
      "prefLabel": {"en": "Glasgow"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/place/base/21",
      "prefLabel": {"en": "Grenwich"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/agent/base/21",
      "prefLabel": {"en": "Goya"},
      "dateOfBirth": "30-03-1746",
      "dateOfDeath": "16-04-1828",
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/agent/base/21",
      "prefLabel": {"en": "Galileo Galilei"},
      "dateOfBirth": "15-02-1564",
      "dateOfDeath": "01-08-1642",
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/place/base/21",
      "prefLabel": {"en": "Houston"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/place/base/21",
      "prefLabel": {"en": "Hanover"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/agent/base/21",
      "prefLabel": {"en": "Howard Hughes"},
      "dateOfBirth": "24-12-1905",
      "dateOfDeath": "05-04-1976",
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/place/base/21",
      "prefLabel": {"en": "India"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/place/base/21",
      "prefLabel": {"en": "Imola"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/concept/base/21",
      "prefLabel": {"en": "Impressionism"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/21",
      "prefLabel": {"en": "Indie Music", "it": "Musica Indie"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/place/base/21",
      "prefLabel": {"en": "Japan", "it": "Giappone"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Jazz Music", "it": "Musica Jazz"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/place/base/21",
      "prefLabel": {"en": "Jelly", "it": "Gello"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/place/base/21",
      "dateOfBirth": "1947-01-08",
      "prefLabel": {"en": "Jordan Peterson"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/place/base/21",
      "dateOfBirth": "1821-01-08",
      "dateOfDeath": "1892-12-12",
      "prefLabel": {"en": "Jules Verne"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/agent/base/21",
      "dateOfBirth": "1954-21-02",
      "prefLabel": {"en": "Kelly-Anne Conway"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/concept/base/21",
      "prefLabel": {"en": "Kapsalon"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/21",
      "prefLabel": {"en": "Klingon"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/21",
      "prefLabel": {"en": "Lichen"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/place/base/21",
      "prefLabel": {"en": "Mona Lisa", "it": "La Giaconda"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/place/base/21",
      "prefLabel": {"en": "Liguria"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/concept/base/62",
      "prefLabel": {"en": "Madness", "it": "Pazzia"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/agent/base/62",
      "dateOfBirth": "1949-04-05",
      "prefLabel": {"en": "Mick Jagger"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/concept/base/62",
      "prefLabel": {"en": "Music", "it": "Musica"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/46",
      "prefLabel": {"en": "Musical instrument", "it": "Strumento Musicale"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/46",
      "prefLabel": {"en": "Nicotine", "it": "Nicotina"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/agent/base/46",
      "prefLabel": {"en": "Norville Barnes"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/concept/base/46",
      "prefLabel": {"en": "Nothingness", "it": "Il nulla"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Roast Chicken", "it": "Pollo Arrostato"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Rennaissance", "it": "Il Rinascimento"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "prefLabel": {"en": "Robin Hood"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Rock music", "it": "Musica Rock"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"de": "Glasmalerei", "en": "Stained glass", "it": "Vetro Colorato"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "dateOfBirth": "1961-31-07",
      "dateOfDeath": "2014-05-02",
      "prefLabel": {"en": "Steve Jobs"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "dateOfBirth": "1840-31-07",
      "dateOfDeath": "1910-05-02",
      "prefLabel": {"en": "Seurat"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "dateOfBirth": "1882-31-02",
      "dateOfDeath": "1949-05-02",
      "prefLabel": {"en": "Teddy Roosevelt"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Tiles", "it": "Piastrelle"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "King", "it": "Re", "ru": "Tsar"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Tyrannosaurus Rex"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/place/base/235",
      "prefLabel": {"en": "United States", "it": "Stati Uniti"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Utilitarianism"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/agent/235",
      "prefLabel": {"en": "Ugo Foscolo"},
      "dateOfBirth": "1777-31-07",
      "dateOfDeath": "1844-05-02",
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/place/base/235",
      "prefLabel": {"en": "Verona"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/place/base/235",
      "prefLabel": {"en": "Virginia"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/concept/agent/235",
      "prefLabel": {"en": "Voltaire"},
      "dateOfBirth": "1746-12-01",
      "dateOfDeath": "1814-15-07",
      "type": "Agent",
      "professionOrOccupation": {
        "en": ["Writer, philosopher, playwright"]
      }
    },
    {
      "id": "http://data.europeana.eu/place/base/235",
      "prefLabel": {"en": "Washington"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/place/base/235",
      "prefLabel": {"en": "West Wherever"},
      "type": "Place"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "dateOfBirth": "1871-31-07",
      "dateOfDeath": "1967-05-02",
      "prefLabel": {"en": "Winston Churchill"},
      "type": "Agent"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "X-Ray"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Xylophone"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Yeast"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Yellow", "it": "Giallo"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Zebra"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/concept/base/235",
      "prefLabel": {"en": "Zen"},
      "type": "Concept"
    },
    {
      "id": "http://data.europeana.eu/agent/base/235",
      "prefLabel": {"en": "Zoolander"},
      "type": "Agent"
    }
  ];

  var escapeRegExp = function(str){
    return str.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  return {
    getData: function(params){

      var res  = [];
      var term = params[paramName];
      var re   = new RegExp('\\b' + escapeRegExp(term), 'i');

      $(data).each(function(i, ob){

        var cpy = false;

        for(key_name in ob['prefLabel']){
          if(ob['prefLabel'][key_name].match(re)){
            cpy = true;
            break;
          }
        }
        if(cpy){
          res.push($.extend(true, {}, ob));
        }
      });

      return {
        "@context": ["https://www.w3.org/ns/ldp.jsonld","http://www.europeana.eu/schemas/context/entity.jsonld"],
        "contains": res
      };
    }
  };
});
