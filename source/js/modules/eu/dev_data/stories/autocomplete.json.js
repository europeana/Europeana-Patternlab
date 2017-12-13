define([], function(){

  var paramName = 'term';

  function log(msg){
    console.log('Demo Autocomplete: ' + msg);
  }

  var data = [
    {"id": 100, "text": "Alchemy"},
    {"id": 101, "text": "Andy"},
    {"id": 102, "text": "Amsterdam"},
    {"id": 103, "text": "Aristotle"},
    {"id": 104, "text": "Anaxagoras"},
    {"id": 105, "text": "Blues Music"},
    {"id": 106, "text": "Banjo"},
    {"id": 107, "text": "Bergamo"},
    {"id": 108, "text": "Bismarck (Otto von)"},
    {"id": 109, "text": "Classical music"},
    {"id": 110, "text": "Caligula"},
    {"id": 111, "text": "Chopin"},
    {"id": 112, "text": "Canterbury"},
    {"id": 113, "text": "Damascus"},
    {"id": 114, "text": "David Hasselhof"},
    {"id": 115, "text": "Delaware"},
    {"id": 116, "text": "Denver"},
    {"id": 117, "text": "Empoli"},
    {"id": 118, "text": "Erasmus"},
    {"id": 119, "text": "Francis Bacon"},
    {"id": 120, "text": "Feathers"},
    {"id": 121, "text": "Fresco"},
    {"id": 122, "text": "Florence"},
    {"id": 123, "text": "Glasgow"},
    {"id": 124, "text": "Grenwich"},
    {"id": 125, "text": "Goya"},
    {"id": 126, "text": "Galileo Galilei"},
    {"id": 127, "text": "Houston"},
    {"id": 128, "text": "Hanover"},
    {"id": 129, "text": "Howard Hughes"},
    {"id": 130, "text": "India"},
    {"id": 131, "text": "Imola"},
    {"id": 132, "text": "Impressionism"},
    {"id": 133, "text": "Indie Music"},
    {"id": 134, "text": "Japan"},
    {"id": 135, "text": "Jazz Music"},
    {"id": 136, "text": "Jelly"},
    {"id": 137, "text": "Jordan Peterson"},
    {"id": 138, "text": "Jules Verne"},
    {"id": 139, "text": "Kelly-Anne Conway"},
    {"id": 140, "text": "Kapsalon"},
    {"id": 141, "text": "Klingon"},
    {"id": 142, "text": "Lichen"},
    {"id": 143, "text": "Mona Lisa"},
    {"id": 144, "text": "Liguria"},
    {"id": 145, "text": "Madness"},
    {"id": 146, "text": "Mick Jagger"},
    {"id": 147, "text": "Music"},
    {"id": 148, "text": "Musical instrument"},
    {"id": 149, "text": "Nicotine"},
    {"id": 150, "text": "Norville Barnes"},
    {"id": 151, "text": "Nothingness"},
    {"id": 152, "text": "Roast Chicken"},
    {"id": 153, "text": "Rennaissance"},
    {"id": 154, "text": "Robin Hood"},
    {"id": 155, "text": "Rock music"},
    {"id": 156, "text": "Stained glass"},
    {"id": 157, "text": "Steve Jobs"},
    {"id": 158, "text": "Seurat"},
    {"id": 159, "text": "Teddy Roosevelt"},
    {"id": 160, "text": "Tiles"},
    {"id": 161, "text": "King"},
    {"id": 162, "text": "Tyrannosaurus Rex"},
    {"id": 163, "text": "United States"},
    {"id": 164, "text": "Utilitarianism"},
    {"id": 165, "text": "Ugo Foscolo"},
    {"id": 166, "text": "Verona"},
    {"id": 167, "text": "Virginia"},
    {"id": 168, "text": "Voltaire"},
    {"id": 169, "text": "Washington"},
    {"id": 170, "text": "West Wherever"},
    {"id": 171, "text": "Winston Churchill"},
    {"id": 172, "text": "X-Ray"},
    {"id": 173, "text": "Xylophone"},
    {"id": 174, "text": "Yeast"},
    {"id": 175, "text": "Yellow"},
    {"id": 176, "text": "Zebra"},
    {"id": 177, "text": "Zen"},
    {"id": 178, "text": "Zoolander"}
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
