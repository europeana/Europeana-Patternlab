define(['jquery', 'util_resize'], function($){

  var Ellipsis = function(cmp, opsIn) {

    var ops        = $.extend({}, opsIn);
    var $cmp       = $(cmp);
    var suffix     = '...';
    var totalText  = '';
    var totalTexts = {};
    var exitLookup = false;


    var getFirstTextNodeValue = function(el, text){
      var nText = el.contents().filter(function() {
        return this.nodeType === 3;
      });
      if(nText.length > 0){
        return nText[0].nodeValue;
      }
      return '';
    };

    var replaceFirstTextNode = function(el, text){
      var nText = el.contents().filter(function() {
        return this.nodeType === 3;
      });
      if(nText.length == 1){
        nText.first().replaceWith(text);
        return true;
      }
      return false;
    };

    var fn = function(){
      return ($cmp[0].scrollHeight > $cmp[0].offsetHeight + 3);
    };

    var tryForSize = function(fluidCmp, fluidText, length){
      var ok = replaceFirstTextNode(fluidCmp, fluidText.substr(0, length) + suffix);
      if(!ok){
        exitLookup = true;
        console.log('Exit - mixed content not supported - exitLookup = ' + exitLookup);
        return true;
      }
      return !fn();
    };

    var locateMax = function(fluidCmp, fluidText, guess, bite, hone){
      var newHone = hone;
      var newBite = 0;
      var newGuess = 0;

      if(guess > fluidText.length){
        newBite = Math.max(1, bite/2);
        newGuess = guess - newBite;
      }
      else{
        if(tryForSize(fluidCmp, fluidText, guess)){
          if(exitLookup){
            return guess;
          }
          if(bite==1){
            return guess;
          }
          else{
            newBite = hone ? Math.max(1, bite/2) : bite;
            newGuess = guess + newBite;
          }
        }
        else{
          newHone = true;
          newBite = hone ? Math.max(1, bite/2) : bite;
          newGuess = guess - newBite;
        }
      }
      return locateMax(fluidCmp, fluidText, newGuess, newBite, newHone);
    };


    var getFluidCmpData = function(){

      var cmp = $cmp;
      var txt = totalText;

      if(ops.textSelectors){

        for(var i=0; i < ops.textSelectors.length; i++){

          var selector = ops.textSelectors[i];
          var subCmp   = $cmp.find(selector);

          if(subCmp.length > 0 && subCmp[0].offsetParent !== null){
            cmp = subCmp;
            txt = totalTexts[selector];
            break;
          }
          else{
            cmp = null;
            txt = null;
          }
        }
      }

      return {
        fluidCmp: cmp,
        fluidText: txt
      }
    }

    var respond = function(){

      var cmpData   = getFluidCmpData();
      var fluidCmp  = cmpData.fluidCmp;
      var fluidText = cmpData.fluidText;

      if(!fluidCmp){
        return;
      }
      exitLookup = false;

      var max      = locateMax(fluidCmp, fluidText, 20, 16, false);
      var theText  = fluidText.substr(0, max);

      replaceFirstTextNode(fluidCmp, theText + (max < fluidText.length ? fluidText.length > 0 ? suffix : '' : ''));
    };

    var init = function(){

      totalText = getFirstTextNodeValue($cmp);

      if(ops.textSelectors){
        for(var i=0; i < ops.textSelectors.length; i++){
          var selector         = ops.textSelectors[i];
          totalTexts[selector] = getFirstTextNodeValue( $cmp.find(selector) );
        }
        // console.log('totalTexts ' + JSON.stringify(totalTexts, null, 4));
      }
      respond();
      $(window).europeanaResize(function(){
        respond();
      });
      $(window).on('ellipsis-update', function(){
        respond();
      });
    };
    init();
  };

  return {
    create: function(cmp, ops){
      if(cmp && cmp.length > 0){
        return new Ellipsis(cmp, ops);
      }
    }
  };
});
