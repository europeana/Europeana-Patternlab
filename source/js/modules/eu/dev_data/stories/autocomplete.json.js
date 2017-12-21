define([], function(){

  var paramName = 'term';

  function log(msg){
    console.log('Demo Autocomplete: ' + msg);
  }

  var data = [
    {"value": 100, "text": "Alchemy"},
    {"value": 101, "text": "Andy"},
    {"value": 102, "text": "Amsterdam"},
    {"value": 103, "text": "Aristotle"},
    {"value": 104, "text": "Anaxagoras"},
    {"value": 105, "text": "Blues Music"},
    {"value": 106, "text": "Banjo"},
    {"value": 107, "text": "Bergamo"},
    {"value": 108, "text": "Bismarck (Otto von)"},
    {"value": 109, "text": "Classical music"},
    {"value": 110, "text": "Caligula"},
    {"value": 111, "text": "Chopin"},
    {"value": 112, "text": "Canterbury"},
    {"value": 113, "text": "Damascus"},
    {"value": 114, "text": "David Hasselhof"},
    {"value": 115, "text": "Delaware"},
    {"value": 116, "text": "Denver"},
    {"value": 117, "text": "Empoli"},
    {"value": 118, "text": "Erasmus"},
    {"value": 119, "text": "Francis Bacon"},
    {"value": 120, "text": "Feathers"},
    {"value": 121, "text": "Fresco"},
    {"value": 122, "text": "Florence"},
    {"value": 123, "text": "Glasgow"},
    {"value": 124, "text": "Grenwich"},
    {"value": 125, "text": "Goya"},
    {"value": 126, "text": "Galileo Galilei"},
    {"value": 127, "text": "Houston"},
    {"value": 128, "text": "Hanover"},
    {"value": 129, "text": "Howard Hughes"},
    {"value": 130, "text": "India"},
    {"value": 131, "text": "Imola"},
    {"value": 132, "text": "Impressionism"},
    {"value": 133, "text": "Indie Music"},
    {"value": 134, "text": "Japan"},
    {"value": 135, "text": "Jazz Music"},
    {"value": 136, "text": "Jelly"},
    {"value": 137, "text": "Jordan Peterson"},
    {"value": 138, "text": "Jules Verne"},
    {"value": 139, "text": "Kelly-Anne Conway"},
    {"value": 140, "text": "Kapsalon"},
    {"value": 141, "text": "Klingon"},
    {"value": 142, "text": "Lichen"},
    {"value": 143, "text": "Mona Lisa"},
    {"value": 144, "text": "Liguria"},
    {"value": 145, "text": "Madness"},
    {"value": 146, "text": "Mick Jagger"},
    {"value": 147, "text": "Music"},
    {"value": 148, "text": "Musical instrument"},
    {"value": 149, "text": "Nicotine"},
    {"value": 150, "text": "Norville Barnes"},
    {"value": 151, "text": "Nothingness"},
    {"value": 152, "text": "Roast Chicken"},
    {"value": 153, "text": "Rennaissance"},
    {"value": 154, "text": "Robin Hood"},
    {"value": 155, "text": "Rock music"},
    {"value": 156, "text": "Stained glass"},
    {"value": 157, "text": "Steve Jobs"},
    {"value": 158, "text": "Seurat"},
    {"value": 159, "text": "Teddy Roosevelt"},
    {"value": 160, "text": "Tiles"},
    {"value": 161, "text": "King"},
    {"value": 162, "text": "Tyrannosaurus Rex"},
    {"value": 163, "text": "United States"},
    {"value": 164, "text": "Utilitarianism"},
    {"value": 165, "text": "Ugo Foscolo"},
    {"value": 166, "text": "Verona"},
    {"value": 167, "text": "Virginia"},
    {"value": 168, "text": "Voltaire"},
    {"value": 169, "text": "Washington"},
    {"value": 170, "text": "West Wherever"},
    {"value": 171, "text": "Winston Churchill"},
    {"value": 172, "text": "X-Ray"},
    {"value": 173, "text": "Xylophone"},
    {"value": 174, "text": "Yeast"},
    {"value": 175, "text": "Yellow"},
    {"value": 176, "text": "Zebra"},
    {"value": 177, "text": "Zen"},
    {"value": 178, "text": "Zoolander"}
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
        if(ob['text'].match(re)){
          res.push($.extend(true, {}, ob));
        }
      });

      return res;
    }
  };
});
