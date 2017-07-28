define(['jquery'], function($){

  var log = function(msg){
    console.log(msg);
  };

  var getFirst = function(ob, keys){
    var res = null;
    $(keys).each(function(i, key){
      if(ob[key]){
        res = ob[key];
      }
    });
    return res;
  };

  var compare = function(a, b){
    if(a.type < b.type){
      return -1;
    }
    if(a.type > b.type){
      return 1;
    }
    return 0;
  };

  var escapeRegExp = function(str){
    return str.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  function process(term, data, ops){

    // log('translations:\n' + JSON.stringify(ops.translations), null, 4);

    var dataList = data['contains'];

    if(!dataList){
      console.warn('no contains in data:\n\n' + JSON.stringify(data, null, 2));
      return;
    }

    var res      = [].concat(dataList);
    var re       = new RegExp('\\b' + escapeRegExp(term), 'i');
    var lastType = '';
    res.sort(compare);

    for(var i=0; i<res.length; i++){

      for(var locale in res[i]['prefLabel']){

        var val     = res[i]['prefLabel'][locale];
        var match   = val.match(re);
        var inLangs = ops.languages.indexOf(locale) > -1;

        if(inLangs){
          res[i].directHit           = val;
          res[i].directMatch         = match;
          if(match){
            res[i].directHitPreMatch   = val.substr(0, val.indexOf(match));
            res[i].directHitPostMatch  = val.substr(val.indexOf(match) + (match+'').length);
          }
          else{
            res[i].unmatched         = val;
          }
        }
        else{
          res[i].indirectHit           = val;
          res[i].indirectMatch         = match;
          res[i].indirectLocale        = locale;

          res[i].indirectHitPreMatch   = val.substr(0, val.indexOf(match));
          res[i].indirectHitPostMatch  = val.substr(val.indexOf(match) + (match+'').length);

        }
      }

      res[i].life                = res[i].dateOfBirth || res[i].dateOfDeath;
      res[i].dateDeathOnly       = res[i].dateOfDeath && !res[i].dateOfBirth;
      res[i].type_lc             = res[i].type ? res[i].type.toLowerCase() : '';
      res[i].type_translated     = (res[i].type && ops.translations) ? ops.translations[res[i].type] : res[i].type;

      if(res[i].type != lastType){
        res[i].groupBegin = true;
        lastType = res[i].type;
      }
      if(res[i].professionOrOccupation){
        res[i]['life_summary'] = getFirst(res[i].professionOrOccupation, ops.languages);
      }
    }

    return res;
  }

  return {
    process: function(term, data, ops){
      return process(term, data, ops);
    }
  };
});
