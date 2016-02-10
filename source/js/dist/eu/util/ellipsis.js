define(['jquery', 'util_resize'], function($){

  var Ellipsis = function(cmp, ops, onShow) {

      var $cmp   = $(cmp);
      var $inner = $cmp.find('.ellipsis-inner');
      var text   = [];
      var sub    = '... XXX';

      var tail   = ops && ops.tail ? ops.tail : '...&nbsp;&nbsp;';
      var fixed  = false;

      var totalText = '';

      if(ops && ops.fixed){
        fixed = ops.fixed;
      }

      var fn = function(){
        if(typeof $inner[0] == 'undefined'){

          return;
        }

        return ( $inner[0].offsetHeight > $cmp.height()+3 );/* chrome +3 for border */
      };

      var tryForSize = function(length){
        $inner.html(totalText.substr(0, length) + sub);
        return !fn();
      };

      var locateMax = function(guess, bite, hone){
        var newHone = hone;
        var newBite = 0;
        var newGuess = 0;

        if(guess > totalText.length){
          newBite = Math.max(1, bite/2);
          newGuess = guess - newBite;
        }
        else{
          if(tryForSize(guess)){  // too wee or correct
            if(bite==1){
              return guess;
            }
            else{
              newBite = hone ? Math.max(1, bite/2) : bite;
              newGuess = guess + newBite;
            }
          }
          else{  // too big - start honing!
            newHone = true;
            newBite = hone ? Math.max(1, bite/2) : bite;
            newGuess = guess - newBite;
          }
        }
        return locateMax(newGuess, newBite, newHone);
      };

      var respond = function(){

        $cmp   = $(cmp);
        $inner = $cmp.find('.ellipsis-inner');

        // start new

        var max = locateMax(20, 16, false);

        var theText = totalText.substr(0, max);
        $inner.html(theText + (max < totalText.length ? totalText.length>0 ? tail : '' : '') + (fixed ? fixed : ""));

        if(fixed){
          var $fixed = $cmp.find('.fixed');
          $fixed.css("position", "absolute");
          $fixed.css("right",    ops.fixed_right ? ops.fixed_right : "0px");
          $fixed.css("bottom",   ops.fixed_bottom ? ops.fixed_bottom : "0px");
        }
        if(typeof(onShow)!='undefined'){
          onShow($cmp);
        }
        else{
          $cmp.css('visibility', 'visible');
        }
      };

      var init = function(){
        if($inner.length==0){
          var content = $cmp.html();
          $cmp.html("");
          $inner = $('<div class="ellipsis-inner"></div>').appendTo($cmp);
          $inner.append(content);
        }

        var innerHtml = $inner.html();
        innerHtml = $.trim(innerHtml);
        totalText = innerHtml;

        for(var i=0; i<innerHtml.length; i++){
          text[i]=innerHtml.substr(i, 1);
        }
        respond();

        $(window).europeanaResize(function(){
            respond();
        });
      };
      init();
  };

  return {
    create: function(cmps, ops){
      var res = [];
      cmps.each(function(){
        res.push(new Ellipsis(this, ops));
      });
      return res;
    }
  }
});
