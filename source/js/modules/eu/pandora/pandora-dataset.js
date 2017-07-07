define(['jquery'], function ($) {

  var log = function(msg){
    console.log('Pandora Dataset: ' + msg);
  };

  function fixTabContentHeight($){
    $('.eu-accordion-tabs').removeAttr('style');
    if(!$('.eu-accordion-tabs').hasClass('as-tabs')){
      return;
    }
    var h1 = $('.eu-accordion-tabs').height();
    var h2 = $('.tab-content.active').height();
    $('.eu-accordion-tabs').attr('style', 'height:' + (h1 + h2) + 'px');
  }

  function initPage(){

    log('initPage');

    require(['mustache', 'eu_accordion_tabs'], function(Mustache, euAccordionTabs){
      Mustache.tags = ['[[', ']]'];

      var setHeaderInfo = function($tabHeader, data){
        if(data && data.modification){
          var template = $('#js-template-tab-header');
          data.modification.title = $tabHeader.find('.tab-title').text();
          $tabHeader.html(Mustache.render(template.text(), data));
        }
      };

      euAccordionTabs.init(
        $('.eu-accordion-tabs'),
        {
          'active': 0,
          'fnOpenTab': function(index, $tabContent){

            var header = $('.metis-accordion-wrapper .tab-header:eq(' + index + ')');

            if(!header.hasClass('js-loaded')){

              var url    = header.data('content-url');
              var template;

              if(index == 0){
                template = $('#js-template-tab-create noscript');
              }
              else if(index == 1){
                template = $('#js-template-tab-pandora noscript');
              }
              else if(index == 2){
                template = $('#js-template-tab-processing noscript');
              }
              else if(index == 3){
                template = $('#js-template-tab-preview noscript');
              }
              else if(index == 4){
                template = $('#js-template-tab-data-quality noscript');
              }

              if(template.length > 0){
                header.addClass('loading');
                $.getJSON(url, null).done(function(data){
                  $tabContent.append(Mustache.render(template.text(), data));
                  header.removeClass('loading').addClass('js-loaded');
                  setHeaderInfo(header, data);
                  fixTabContentHeight($);
                });
              }
            }
          }
        }
      );
    });

    require(['util_resize'], function(){
      $(window).europeanaResize(function(){
        fixTabContentHeight($);
      });
    });
  }

  return {
    initPage: function(){
      initPage();
    }
  };

});
