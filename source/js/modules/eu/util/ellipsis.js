define(['jquery', 'util_resize'], function($){

  var Ellipsis = function(cmp, ops, onShow) {

      var $cmp      = $(cmp);
      var $inner    = $cmp.find('.ellipsis-inner');
      var disabled  = false;
      var fixed     = false;
      var sub       = ops && ops.sub ? ops.sub : '...XXX';
      var tail      = ops && ops.tail ? ops.tail : '...';
      var text      = [];
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

        if(disabled){
          return;
        }

        $cmp      = $(cmp);
        $inner    = $cmp.find('.ellipsis-inner');
        fixedHTML = $cmp.find('.fixed').html();

        // start new

        var max = locateMax(20, 16, false);

        var theText = totalText.substr(0, max);


        // var fixedHtml = fixed ? fixed.htm() : '';
        $inner.html(theText + (max < totalText.length ? totalText.length>0 ? tail : '' : '') + (fixed ? fixed : ""));

        if(fixed){
          var $fixed = $cmp.find('.fixed');
          $fixed.css('position', ops.fixed_pos ? ops.fixed_pos : 'absolute');
          $fixed.css('right',    ops.fixed_right ? ops.fixed_right : '0px');
          $fixed.css('bottom',   ops.fixed_bottom ? ops.fixed_bottom : '0px');

          if(totalText.length > max){
              $fixed.html(fixedHTML);
          }

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

      return {
          getText: function(){
              return totalText;
          },
          disable: function(){
              disabled = true;
              $inner.html(totalText + (fixed ? fixed : ""));
          },
          enable: function(){
              disabled = false;
              respond();
          }
      }
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
