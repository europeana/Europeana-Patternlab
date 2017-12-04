require.config({
  paths: {
    eu_mock_ajax:     '../../eu/util/eu-mock-ajax',
    jquery:           '../../lib/jquery/jquery',
    mustache:         '../../lib/mustache/mustache',
    purl:             '../../lib/purl/purl',
    util_eu_ellipsis: '../../eu/util/eu-ellipsis',
    util_resize:      '../../eu/util/resize'
  }
});

require(['jquery'], function($) {
  require(['mustache'], function(Mustache){

    $('body').addClass('collections-promos');

    var template;
    var applyEllipsis = function(){

      require(['util_eu_ellipsis'], function(Ellipsis){

        $('.promo-title').each(function(i, ob){
          Ellipsis.create($(ob), {textSelectors:['a']});
        });

        $('.image-set-title').each(function(i, ob){
          Ellipsis.create($(ob));
        });

        $('.promo-tags').each(function(i, ob){
          Ellipsis.create($(ob), {multiNode:true, textSelectors:['.promo-tag-link']});
        });

        $('.text-main').each(function(i, ob){
          ob = $(ob);
          ob.html(ob.text());
          Ellipsis.create(ob);
        });

        $('.collections-promo-overlay .title').each(function(i, ob){
          Ellipsis.create(ob);
        });

      });
    };


    if(typeof window.template_id != 'undefined'){
      template = $('#' + window.template_id);
    }
    else{
      console.log('template_id is required');
      return;
    }

    if(template.length == 1 && window.mock_ajax){

      require(['eu_mock_ajax'], function(){

        $.getJSON(window.ajax_call).done(function(data){

          console.log(JSON.stringify(data, null, 4));

          Mustache.tags = ['[[', ']]'];

          if(window.template_id == 'template-promo-next-prev'){
            template.after(Mustache.render(template.text(), data['search_results'][0]));
          }
          else if(window.template_id == 'template-promo-exhibition'){
            template.after(Mustache.render(template.text(), data['exhibition_promo']));
          }
          else if(window.template_id == 'template-promo-generic' || window.template_id == 'template-promo-gallery' || window.template_id == 'template-promo-news'){
            template.after(Mustache.render(template.text(), data[0]));
          }
          else{
            template.after(Mustache.render(template.text(), data));
          }

          $('.js-remove').remove();
          applyEllipsis();

        });
      });
    }
    else{
      console.log('Template #' + window.template_id + ' not found');
    }

  });
});

