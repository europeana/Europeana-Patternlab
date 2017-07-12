define(['jquery', 'util_resize'], function($){

  var Ellipsis = function(cmp, opsIn) {

    var ops        = $.extend({}, opsIn);
    var $cmp             = $(cmp);
    var suffix           = '...';
    var totalText        = '';
    var origTextMulti    = [];
    var totalTexts       = {};
    var exitLookup       = false;
    var multiTextLengths = [];

    var getTextNodeValue = function(el, text){
      var nText = el.contents().filter(function() {
        return this.nodeType === 3;
      });
      if(nText.length > 0){
        return nText[0].nodeValue;
      }
      return '';
    };

    var replaceTextNode = function(el, text){

      var nText = el.contents().filter(function() {
        return this.nodeType === 3;
      });
      if(nText.length == 1){
        nText.first().replaceWith(text);
        return true;
      }
      else if(ops.multiNode == true){
        el.text(text);
        return true;
      }
      return false;
    };

    var fn = function(){
      return ($cmp[0].scrollHeight > $cmp[0].offsetHeight + 3);
    };

    var tryForSize = function(fluidCmp, fluidText, length, suppressSuffix){
      var ok = replaceTextNode(fluidCmp, fluidText.substr(0, length) +  (suppressSuffix ? '' : suffix));
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

    var locateMaxMultiple = function(fluidCmp, nodeIndex, text, guess, bite, hone){

        var newHone = hone;
        var newBite = 0;
        var newGuess = 0;

        var $node = $(fluidCmp[nodeIndex]);

        if(guess > text.length){
          newBite  = Math.max(1, bite/2);
          newGuess = guess - newBite;
        }
        else{
          if(tryForSize($node, text, guess, guess == text.length)){
            if(exitLookup){
              return {
                guess: guess,
                index: nodeIndex
              }
            }

            if(bite==1){
              return {
                guess: guess,
                index: nodeIndex
              };
            }
            else{
              newBite = hone ? Math.max(1, bite/2) : bite;
              newGuess = guess + newBite;
            }
          }
          else{
            if(guess < 1){

              replaceTextNode($node, '');
              return {
                guess: 0,
                index: nodeIndex
              };
            }

            newHone = true;
            newBite = hone ? Math.max(1, bite/2) : bite;
            newGuess = guess - newBite;
          }
        }
        return locateMaxMultiple(fluidCmp, nodeIndex, text, newGuess, newBite, newHone);
    };


    var getCmpData = function(){

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

      var cmpData   = getCmpData();
      var fluidCmp  = cmpData.fluidCmp;
      var fluidText = cmpData.fluidText;

      if(!fluidCmp){
        return;
      }
      exitLookup = false;

      if(fluidCmp.length == 1){
        var max      = locateMax(fluidCmp, fluidText, 20, 16, false);
        var theText  = fluidText.substr(0, max);
        replaceTextNode(fluidCmp, theText + (max < fluidText.length ? fluidText.length > 0 ? suffix : '' : ''));
      }
      else if(fluidCmp.length > 1){


        var index = fluidCmp.length-1;

        for(var i=0; i<fluidCmp.length; i++){
          if($(fluidCmp[i]).text().length == 0){
            index --;
          }
        }

        var text  = origTextMulti[index];
        var loops = 0;

        var writeNode = function(cmp, index, text, triedIndexes){

          loops ++;
          if(loops > 12){
            console.log('too much recursion!');
            return;
          }
          var max   = locateMaxMultiple(cmp, index, text, text.length, 16, false);
          if(max.guess == 0){
            if(index > 0){

              if(triedIndexes.indexOf(index-1) > -1){
                replaceTextNode($(cmp[index]), suffix);
              }
              else{
                replaceTextNode($(cmp[index]), '');
                triedIndexes.push(index);
                index --;
                text = origTextMulti[index];
                writeNode(cmp, index, text, triedIndexes);
              }
            }
          }
          else if(max.guess >= text.length){

            if(index+1 < cmp.length){

              if(triedIndexes.indexOf(index+1) > -1){
                replaceTextNode($(cmp[index]), text + suffix);
              }
              else{
                triedIndexes.push(index);
                index ++;
                text  = origTextMulti[index];
                replaceTextNode($(cmp[index]), text);
                writeNode(cmp, index, text, triedIndexes);
              }
            }
            else{
              replaceTextNode($(cmp[index]), text);
            }
          }
        }
        writeNode(fluidCmp, index, text, []);
      }
    };

    var init = function(){

      totalText = getTextNodeValue($cmp);

      if(ops.textSelectors){

        if(ops.multiNode){
          if(ops.textSelectors.length > 1){
            console.error('cannot use multiple selectors in multiNode mode');
            return;
          }
          var selector         = ops.textSelectors[0];
          $cmp.find(selector).each(function(i, ob){
            origTextMulti.push($(ob).text());
          });

        }
        else{
          for(var i=0; i < ops.textSelectors.length; i++){
            var selector         = ops.textSelectors[i];
            var node             = $cmp.find(selector);

            if(node.length > 1){
              console.error('multiple elements found - please configure multiNode mode');
              return;
            }
            totalTexts[selector] = getTextNodeValue(node);
          }
        }
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
