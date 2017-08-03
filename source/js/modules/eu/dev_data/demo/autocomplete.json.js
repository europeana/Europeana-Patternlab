define([], function(){

  var paramName = 'term';

  function log(msg){
    console.log('Demo Autocomplete: ' + msg);
  }

  var data = [
    "Alchemy",
    "Amsterdam",
    "Aristotle",
    "Anaxagoras",
    "Blues Music",
    "Banjo",
    "Bergamo",
    "Bismarck (Otto von)",
    "Classical music",
    "Caligula",
    "Chopin",
    "Canterbury",
    "Damascus",
    "David Hasselhof",
    "Delaware",
    "Denver",
    "Empoli",
    "Erasmus",
    "Francis Bacon",
    "Feathers",
    "Fresco",
    "Florence",
    "Glasgow",
    "Grenwich",
    "Goya",
    "Galileo Galilei",
    "Houston",
    "Hanover",
    "Howard Hughes",
    "India",
    "Imola",
    "Impressionism",
    "Indie Music",
    "Japan",
    "Jazz Music",
    "Jelly",
    "Jordan Peterson",
    "Jules Verne",
    "Kelly-Anne Conway",
    "Kapsalon",
    "Klingon",
    "Lichen",
    "Mona Lisa",
    "Liguria",
    "Madness",
    "Mick Jagger",
    "Music",
    "Musical instrument",
    "Nicotine",
    "Norville Barnes",
    "Nothingness",
    "Roast Chicken",
    "Rennaissance",
    "Robin Hood",
    "Rock music",
    "Stained glass",
    "Steve Jobs",
    "Seurat",
    "Teddy Roosevelt",
    "Tiles",
    "King",
    "Tyrannosaurus Rex",
    "United States",
    "Utilitarianism",
    "Ugo Foscolo",
    "Verona",
    "Virginia",
    "Voltaire",
    "Washington",
    "West Wherever",
    "Winston Churchill",
    "X-Ray",
    "Xylophone",
    "Yeast",
    "Yellow",
    "Zebra",
    "Zen",
    "Zoolander"
  ];

  var escapeRegExp = function(str){
    return str.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  return {
    getData: function(params){

      log('params = ' + JSON.stringify(params, null, 4));
      var res  = [];
      var term = params[paramName];
      var re   = new RegExp('\\b' + escapeRegExp(term), 'i');

      $(data).each(function(i, ob){
        if(ob.match(re)){
          res.push($.extend(true, {}, {"text": ob}));
        }
      });

      return res;
    }
  };
});
