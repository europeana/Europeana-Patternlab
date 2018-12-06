define(['util_promo_loader', 'jasmine_jquery'], function(PromoLoader){

  'use strict';

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

  var basePath     = 'base/js/unit-tests/fixtures/util';
  var basePathJSON = '/base/js/unit-tests/fixture-data/util/';
  var conf;

  describe('Eu Promo Loader', function(){

    beforeEach(function(){
      jasmine.getFixtures().fixturesPath = basePath;
      conf = [
        {
          id: 'next',
          preloaded: { 'title': 'next' },
          templateMarkup: '<div id="template-promo-next-prev"><h2 class="promo-next-prev" >{{title}}</h2></div>'
        },
        {
          id: 'entity',
          url: basePathJSON + 'promo-entity.json',
          templateMarkup: '<div id="template-promo-entity"><h2 class="promo-entity">{{title}}</h2></div>'
        },
        {
          id: 'exhibition',
          url: basePathJSON + 'promo-exhibition.json',
          templateMarkup: '<div id="template-promo-exhibition"><h2 class="promo-exhibition">{{title}}</h2></div>'
        },
        {
          id: 'gallery',
          url: basePathJSON + 'promo-gallery.json',
          templateMarkup: '<div id="template-promo-gallery"><h2 class="promo-gallery">{{title}}</h2></div>'
        },
        {
          id: 'news',
          url: basePathJSON + 'promo-news.json',
          templateMarkup: '<div id="template-promo-news"><h2 class="promo-news">{{title}}</h2></div>'
        },
        {
          id: 'generic',
          url: basePathJSON + 'promos-generic.json',
          templateMarkup: '<div id="template-promo-generic"><h2 class="promo-generic">{{title}}</h2></div>'
        },
        {
          id: 'previous',
          'preloaded': { 'title': 'previous' },
          templateMarkup: '<div id="template-promo-next-prev"><h2 class="promo-next-prev">{{title}}</h2></div>',
          'firstIfMissing': 'next'
        }
      ];
    });

    it('builds html from ajax-loaded card data', function(done){

      var markup;
      var cbSetMarkup = function(markupIn){
        markup = markupIn;
      };

      PromoLoader.load(conf, function(){
        expect(markup.find('h2').length).not.toBeLessThan(conf.length);
        done();
      }, cbSetMarkup);
    });

    it('can interpolate pre-loaded data into the loaded data', function(done){

      var markup;
      var cbSetMarkup = function(markupIn){
        markup = markupIn;
      };
      var testText      = 'ENTITIY-PRELOADED';
      conf[0].preloaded = { 'title': testText };

      PromoLoader.load(conf, function(){
        expect(markup.find('h2:first').text()).toEqual(testText);
        done();
      }, cbSetMarkup);
    });

    it('adheres to the order defined in the config', function(done){

      var markup;
      var cbSetMarkup = function(markupIn){
        markup = markupIn;
      };

      // remove the next. previous, and the multi items
      conf.pop();
      conf.pop();
      conf.pop();

      var confirmInSync = function(html, configuration){
        html.find('h2').each(function(i, header){
          expect(header.textContent).toContain(configuration[i].id);
        });
      };

      PromoLoader.load(conf, function(){

        var origTextFirstItem = $('h2:first').text();
        var origTextLastItem  = $('h2:last').text();

        confirmInSync(markup, conf);

        // backwards
        conf.reverse();

        PromoLoader.load(conf, function(){

          var textFirstItem = $('h2:first').text();
          var textLastItem  = $('h2:last').text();

          confirmInSync(markup, conf);
          expect(origTextFirstItem).toEqual(textLastItem);
          expect(origTextLastItem).toEqual(textFirstItem);

          // with items missing
          conf = conf.splice(2, 2);

          PromoLoader.load(conf, function(){
            confirmInSync(markup, conf);
            done();
          }, cbSetMarkup);
        }, cbSetMarkup);
      }, cbSetMarkup);
    });

    it('can execute a callback when an individual promo has been loaded and appended', function(done){


      var eventCallbackParam;
      var confItemCallback  = { 'cb': function(){} };

      spyOn(confItemCallback, 'cb');

      conf = [{
        id: 'gallery',
        url: basePathJSON + 'promo-gallery.json',
        templateMarkup: '<div id="template-promo-gallery"><h2 class="promo-gallery">{{title}}</h2></div>',
        callback: confItemCallback.cb
      }];

      PromoLoader.load(conf);

      setTimeout(function(){
        expect(confItemCallback.cb).toHaveBeenCalled();
        done();
      }, 100);

    });

    describe('Error Handling', function(){

      it('ignores invalid config items', function(done){

        var markup;
        var cbSetMarkup = function(markupIn){
          markup = markupIn;
        };

        conf = [{
          id: 'next',
          url: false,
          templateMarkup: '<div id="template-promo-next-prev"><h2 class="promo-next-prev" >{{title}}</h2></div>'
        }];

        PromoLoader.load(conf, function(){
          expect(markup).toBeUndefined();
          done();
        }, cbSetMarkup);
      });

      it('can handle dead urls', function(){

        var cbSetMarkup = function(markupIn){
          expect(markupIn).toBeUndefined();
        };

        var errorUrl = '/error/404';
        conf         = [conf[1]];
        conf[0].url  = errorUrl;

        PromoLoader.load(conf, function(){}, cbSetMarkup);
      });

    });

  });
});
