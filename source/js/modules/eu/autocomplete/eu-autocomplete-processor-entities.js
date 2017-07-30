define(['jquery'], function($){

  var log = function(msg){
    console.log(msg);
  };

  var getFirst = function(ob, keys){
    var res = null;
    $(keys).each(function(i, key){
      if(!res && ob[key]){
        res = ob[key];
      }
    });
    return res;
  };

  var escapeRegExp = function(str){
    return str.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  };

  function process(term, data, ops){

    var dataList = data['contains'];

    if(!dataList){
      log('no result (return)');
      return;
    }

    var lastType = '';
    var res      = [].concat(dataList);
    var re       = new RegExp('\\b' + escapeRegExp(term), 'i');
    var typesOb  = {};
    var typesAr  = [];

    for(var i=0; i<res.length; i++){
      var type = res[i].type;
      if(!typesOb[type]){
        typesOb[type] = type;
        typesAr.push(type);
      }
    }

    res.sort(function(a, b){
      var posA = typesAr.indexOf(a.type);
      var posB = typesAr.indexOf(b.type);
      if(posA < posB){
        return -1;
      }
      if(posA > posB){
        return 1;
      }
      return 0;
    });

    for(var i=0; i<res.length; i++){

      for(var locale in res[i]['prefLabel']){

        var val     = res[i]['prefLabel'][locale];
        var match   = val.match(re);
        var inLangs = ops.languages.indexOf(locale) > -1;

        if(inLangs){
          res[i].directHit   = val;
          res[i].directMatch = match;
          if(match){
            res[i].directHitPreMatch  = val.substr(0, val.indexOf(match));
            res[i].directHitPostMatch = val.substr(val.indexOf(match) + (match + '').length);
          }
          else{
            res[i].unmatched = val;
          }
        }
        else{
          res[i].indirectHit          = val;
          res[i].indirectMatch        = match;
          res[i].indirectLocale       = locale;
          res[i].indirectHitPreMatch  = val.substr(0, val.indexOf(match));
          res[i].indirectHitPostMatch = val.substr(val.indexOf(match) + (match + '').length);
        }
      }

      res[i].life          = res[i].dateOfBirth || res[i].dateOfDeath;
      res[i].dateDeathOnly = res[i].dateOfDeath && !res[i].dateOfBirth;
      res[i].type_lc       = res[i].type ? res[i].type.toLowerCase() : '';

      if(res[i].type == 'Agent'){
        res[i].is_person = true;
      }
      else if(res[i].type == 'Concept'){
        res[i].is_concept = true;
      }
      else if(res[i].type == 'Place'){
        res[i].is_place = true;
      }

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
