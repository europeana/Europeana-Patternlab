define(['jquery', 'util_resize'], function($){

  var Ellipsis = function(cmp, opsIn) {

    var ops              = $.extend({}, opsIn);
    var $cmp             = $(cmp);
    var suffix           = '...';
    var totalText        = '';
    var origTextMulti    = [];
    var totalTexts       = {};
    var exitLookup       = false;

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

    var tryForSize = function(cmp, txt, length, suppressSuffix){
      var ok = replaceTextNode(cmp, txt.substr(0, length) +  (suppressSuffix ? '' : suffix));
      if(!ok){
        exitLookup = true;
        console.log('Exit - mixed content not supported - exitLookup = ' + exitLookup);
        return true;
      }
      return !fn();
    };

    var locateMax = function(tgtCmp, nodeIndex, text, guess, bite, hone){

      var newHone  = hone;
      var newBite  = 0;
      var newGuess = 0;
      var $node    = $(tgtCmp[nodeIndex]);

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
      return locateMax(tgtCmp, nodeIndex, text, newGuess, newBite, newHone);
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
        tgtCmp: cmp,
        tgtTxt: txt
      }
    }

    var respond = function(){

      var cmpData = getCmpData();
      var tgtCmp  = cmpData.tgtCmp;
      var tgtTxt  = cmpData.tgtTxt;

      if(!tgtCmp){
        return;
      }
      exitLookup = false;

      if(!ops.multiNode){
        var max      = locateMax([tgtCmp], 0, tgtTxt, 20, 16, false).guess;
        var theText  = tgtTxt.substr(0, max);
        replaceTextNode(tgtCmp, theText + (max < tgtTxt.length ? tgtTxt.length > 0 ? suffix : '' : ''));
      }
      else{
        var index = tgtCmp.length-1;

        for(var i=0; i<tgtCmp.length; i++){
          if($(tgtCmp[i]).text().length == 0){
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
          var max   = locateMax(cmp, index, text, text.length, 16, false);

          if(max.guess == 0 && index > 0){
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
        writeNode(tgtCmp, index, text, []);
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
            var selector = ops.textSelectors[i];
            var node     = $cmp.find(selector);

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
