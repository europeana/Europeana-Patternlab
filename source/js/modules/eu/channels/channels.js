define(['jquery', 'smartmenus'], function($){

  var promisedPageJS = $.Deferred();

  var log = function(msg){
    console.log('Channels: ' + msg);
  };

  require(['cookie_disclaimer'], function(cd){
    cd.init();
  });

  require(['smartmenus_keyboard'], function(){

    $('.nav_primary>ul').smartmenus({
      mainMenuSubOffsetX: -1,
      mainMenuSubOffsetY: 4,
      subMenusSubOffsetX: 6,
      subMenusSubOffsetY: -6,
      subMenusMaxWidth: null,
      subMenusMinWidth: null
    });

    $('#settings-menu').smartmenus({
      mainMenuSubOffsetX: -62,
      mainMenuSubOffsetY: 4,
      subMenusSubOffsetX: 0,
      subMenusSubOffsetY: -6,
      subMenusMaxWidth: null,
      subMenusMinWidth: null
    });

    $('#browse-menu').smartmenus({
      mainMenuSubOffsetX: -25,
      mainMenuSubOffsetY: 4,
      subMenusSubOffsetX: 0,
      subMenusSubOffsetY: -6,
      subMenusMaxWidth: null,
      subMenusMinWidth: null
    });

    $('.js-hack-smartmenu a').click(function(){
      var href = $(this).attr('href');
      if(href != '#'){
        window.location = $(this).attr('href');
      }
    });

    if($('#settings-menu li').length > 6 && !$('#settings-menu .menu-divider').length > 0){
      $('#settings-menu').addClass('as-cols');
    }

  });

  var initCollectionsFilter = function(){
    require(['purl'], function(){
      $('#list_sortby').add('#list_filterby').on('change', function(){
        var val    = $(this).val();
        var filterName = $(this).data('filter-name');
        if(!filterName){
          filterName = $(this).attr('id') == 'list_sortby' ? 'order' : 'theme';
        }
        var $url   = $.url();
        var params = $url.param();

        params[filterName] = (['*', 'all'].indexOf(val) > -1 ? '' : val);

        if(!params[filterName]){
          delete params[filterName];
        }
        if(params['page']){
          delete params['page'];
        }

        var newParams = $.param(params);
        var newUrl    = location.href.split('?')[0] + (newParams.length == 0 ? '' : '?' + $.param(params));
        location.href = newUrl;
      });
    });
  };

  var initFeedback = function(){
    if($('.feedback').size()>0){
      require(['feedback'], function(fb){
        fb.init($('.feedback'));
      });
    }
  };

  var doForAllPages = function(){
    initCollectionsFilter();

    if($('.eu-tooltip').size()>0){
      require(['eu_tooltip'], function(euTooltip){
        euTooltip.configure();
      });
    }

    initFeedback();

    if((typeof window.requirementsApplication).toLowerCase() == 'string'){
      console.log('load extra: ' + window.requirementsApplication);
      require([window.requirementsApplication], function(){
        console.log('loaded application.js');
      });
    }

  };

  if(typeof pageName == 'undefined' || !pageName){
    console.warn('pageName not specified - cannot bootstrap app');
    return;
  }
  log('pageName ' + pageName);

  switch(pageName){
    case 'explore/people':
      promisedPageJS.resolve();
      doForAllPages();
      break;

    case 'explore/colours':
      promisedPageJS.resolve();
      doForAllPages();
      break;

    case 'explore/topics':
      promisedPageJS.resolve();
      doForAllPages();
      break;

    case 'explore/periods':
      promisedPageJS.resolve();
      doForAllPages();
      break;

    case 'explore/new_content':
      promisedPageJS.resolve();
      doForAllPages();
      break;

    case 'explore/sources':
      require(['util_foldable'], function(){
        require(['util_filterable'], function(filter){
          filter.init($('.eu-filter'),
            {
              selector:  '.eu-foldable > li',
              sel_title:   ' > h4 > a',
              children: {
                selector:  '.eu-foldable-data > li',
                sel_title: 'a',
                actions: {
                  select: function($el){
                    $el.closest('.eu-foldable-data').addClass('filter-force-show');
                  },
                  deselect: function($el){
                    $el.closest('.eu-foldable-data').removeClass('filter-force-show');
                  }
                }
              }
            }
          );
        });
      });
      promisedPageJS.resolve();
      doForAllPages();
      break;

    case 'blog_posts/index':
      require(['search_blog'], function(page){
        page.initPage();
        promisedPageJS.resolve(page);
        doForAllPages();
      });
      break;
    case 'blog_posts/show':
      require(['search_blog'], function(page){
        page.initPage();
        promisedPageJS.resolve(page);
        doForAllPages();
      });
      break;
    case 'e7a_1418':
      require(['e7a_1418'], function(page){
        page.initPage();
        promisedPageJS.resolve(page);
        doForAllPages();
      });
      break;
    case 'events/index':
      require(['search_events'], function(page){
        page.initPage();
        promisedPageJS.resolve(page);
        doForAllPages();
      });
      break;
    case 'events/show':
      require(['search_events'], function(page){
        page.initPage();
        promisedPageJS.resolve(page);
        doForAllPages();
      });
      break;
    case 'galleries/index':
      require(['fashion_gallery_redirect'], function(fgr){
        fgr.redirectOrCallback(function(){
          require(['search_galleries'], function(page){
            page.initPage();
            promisedPageJS.resolve(page);
            doForAllPages();
          });
        });
      });
      break;
    case 'galleries/show':
      require(['search_galleries'], function(page){
        page.initPage();
        promisedPageJS.resolve(page);
        doForAllPages();
      });
      break;
    case 'collections/show':
      if((location.href.indexOf('?q=') == -1) && (location.href.indexOf('&q=') == -1)){
        require(['fashion_redirect'], function(fr){
          fr.redirectOrCallback(function(){
            require(['search_landing', 'search_form'], function(page, euSearchForm){
              page.initPage(euSearchForm);
              promisedPageJS.resolve(page);
              doForAllPages();
            });
          });
        });
      }
      else{
        require(['fashion_redirect'], function(fr){
          fr.redirectOrCallback(function(){
            require(['search_results', 'search_form'], function(page, euSearchForm){
              page.initPage(euSearchForm);
              promisedPageJS.resolve(page);
              doForAllPages();
            });
          });
        });
      }
      break;

    case 'entities/show':
      require(['search_entity', 'search_form'], function(page, euSearchForm){
        page.initPage(euSearchForm);
        promisedPageJS.resolve(page);
        doForAllPages();
      });
      break;

    case 'migration/index':
      console.log('load js for migration/index here');
      doForAllPages();
      break;

    case 'migration/create':
      console.log('load js for migration/new here');

      require(['ugc'], function(page){
        page.initPage();
        doForAllPages();
      });
      break;

    case 'migration/new':
      console.log('load js for migration/new here');
      require(['ugc'], function(page){
        page.initPage();
        doForAllPages();
      });
      break;

    case 'ugc/index':
      console.log('load js for ugc/index here');

      doForAllPages();
      break;

    case 'ugc/new':
      console.log('load js for ugc/new here');

      require(['ugc'], function(){
        doForAllPages();
      });
      break;

    case 'portal/show':
      require(['search_object', 'search_form'], function(page, euSearchForm){
        page.initPage(euSearchForm);
        promisedPageJS.resolve(page);
        doForAllPages();
      });
      break;
    case 'portal/show-new':
      require(['channels_object', 'search_form'], function(page, euSearchForm){
        page.initPage(euSearchForm);
        promisedPageJS.resolve(page);
        doForAllPages();
      });
      break;
    case 'portal/index':
      var loadPageJS = function(){
        require(['search_results', 'search_form'], function(page, euSearchForm){
          page.initPage(euSearchForm, euSearchForm);
          promisedPageJS.resolve(page);
          doForAllPages();
        });
      };

      if(typeof collectionName != 'undefined' && collectionName == 'fashion'){
        require(['fashion_redirect'], function(fr){
          fr.redirectOrCallback(function(){
            loadPageJS();
          });
        });
      }
      else{
        loadPageJS();
      }
      break;

    case 'pages/show':
      promisedPageJS.resolve();
      doForAllPages();
      break;

    case 'portal/static':
      require(['util_foldable']);
      promisedPageJS.resolve();
      doForAllPages();
      break;
    case 'home/index':
      require(['search_home', 'search_form'], function(page, euSearchForm){
        page.initPage(euSearchForm);
        promisedPageJS.resolve(page);
        doForAllPages();
      });
      break;
    case 'settings/language':
      require(['settings'], function(page){
        page.initPage();
        promisedPageJS.resolve(page);
        doForAllPages();
      });
      break;
    default:
      console.warn('pageName not recognised (' + pageName + ') - cannot bootstrap app');
  }

  return {
    getPromisedPageJS: function(){
      return promisedPageJS.promise();
    }
  };
});