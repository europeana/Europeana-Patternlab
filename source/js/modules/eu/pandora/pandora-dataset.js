define(['jquery'], function ($) {

  var log = function(msg){
    console.log('Pandora Dataset: ' + msg);
  };

  function initPage(){

    log('initPage');

    var cmpTabs = $('.eu-accordion-tabs');

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
        cmpTabs,
        {
          'active': 0,
          'fnOpenTab': function(index, $tabContent){

            var header = $('.metis-accordion-wrapper .tab-header:eq(' + index + ')');
            
            if(!header.hasClass('js-loaded')){

              var url    = header.data('content-url');
              var template;

              if(index == 0){
                template = $('#js-template-tab-create');
              }
              else if(index == 1){
                template = $('#js-template-tab-pandora');
              }
              else if(index == 2){
                template = $('#js-template-tab-processing');
              }
              else if(index == 3){
                template = $('#js-template-tab-preview');
              }
              else if(index == 4){
                template = $('#js-template-tab-data-quality');
              }

              if(template.length > 0) {
                header.addClass('loading');
                $.getJSON(url, null).done(function(data){
                  $tabContent.append(Mustache.render(template.text(), data));
                  header.removeClass('loading').addClass('js-loaded');
                  setHeaderInfo(header, data);
                  euAccordionTabs.fixTabContentHeight(cmpTabs);
                });
              }

              cmpTabs.find('.tab-header').on('click', function() {
                euAccordionTabs.fixTabContentHeight(cmpTabs);
              });

            }
          }
        }
      );

      require(['util_resize'], function(){
        $(window).europeanaResize(function(){
          euAccordionTabs.fixTabContentHeight(cmpTabs);
        });
      });

    });

  }

  return {
    initPage: function(){
      initPage();
    }
  };

});
