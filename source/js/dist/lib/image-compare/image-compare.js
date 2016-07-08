define(['jquery'], function ($){

  'use strict';

  $('head').append('<link rel="stylesheet" href="' + require.toUrl('../../lib/image-compare/style.css') + '" type="text/css"/>');

  var dragging  = false;
  var scrolling = false;

  var imageComparisonContainers = $('.image-compare');

  function log(msg){
    console.log(msg);
  }

  function removeDrags(dragElement) {
      dragElement.off("mousedown vmousedown mouseup vmouseup");
  }

  //draggable funtionality - credits to http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
  function drags(dragElement, resizeElement, container) {
      dragElement.on("mousedown vmousedown", function(e) {
          dragElement.addClass('draggable');
          resizeElement.addClass('resizable');

          log('dragElement.outerWidth() = ' + dragElement.outerWidth())

          var dragWidth = dragElement.outerWidth(),
              xPosition = dragElement.offset().left + dragWidth - e.pageX,
              containerOffset = container.offset().left,
              containerWidth = container.outerWidth(false),
              minLeft = containerOffset - (dragWidth / 2),
              maxLeft = containerOffset + containerWidth - (dragWidth / 2);

          dragElement.parents().on("mousemove vmousemove", function(e) {
              if( !dragging) {
                  dragging =  true;
                  ( !window.requestAnimationFrame )
                      ? setTimeout(function(){animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement);}, 100)
                      : requestAnimationFrame(function(){animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement);});
              }
          }).on("mouseup vmouseup", function(e){
              dragElement.removeClass('draggable');
              resizeElement.removeClass('resizable');
          });
          e.preventDefault();
      }).on("mouseup vmouseup", function(e) {
          dragElement.removeClass('draggable');
          resizeElement.removeClass('resizable');
      });
  }

  function animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement) {
      var leftValue = e.pageX + xPosition - dragWidth;
      //constrain the draggable element to move inside his container
      if(leftValue < minLeft ) {
          leftValue = minLeft;
      } else if ( leftValue > maxLeft) {
          leftValue = maxLeft;
      }

      var widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';

      $('.draggable').css('left', widthValue).on("mouseup vmouseup", function() {
          $(this).removeClass('draggable');
          resizeElement.removeClass('resizable');
      });

      $('.resizable').css('width', widthValue);

      dragging =  false;
  }

  function init(){
    log('init image compare');

    //make the .handle element draggable and modify .cd-resize-img width according to its position
    imageComparisonContainers.each(function(){
      var actual = $(this);
      drags(
        actual.find('.handle'),
        actual.find('.resize-img'),
        actual
        );
    });

    /*
    $(window).on('resize', function(){
      setTimeout(function(){
          dragging  = false;
          scrolling = false;
          imageComparisonContainers = $('.image-compare');
          imageComparisonContainers.each(function(){
              var actual = $(this);
              var handle = actual.find('.handle');
              var resize = actual.find('.resize-img');
              handle.removeAttr('style');
              resize.removeAttr('style');
              removeDrags(handle);
              init();
            });
      }, 30000);
    });
    */
  }

  return {
    init: function(){
      init();
    }
  }
});
