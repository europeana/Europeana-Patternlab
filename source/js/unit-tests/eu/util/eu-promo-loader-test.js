define(['util_promo_loader', 'jasmine_jquery'], function(PromoLoader){

  'use strict';

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

  var basePath     = 'base/js/unit-tests/fixtures/util';
  var basePathJSON = '/base/js/unit-tests/fixture-data/util/';
  var conf;
  var templateMarkup;

  describe('Eu Promo Loader', function(){

    beforeEach(function(){
      jasmine.getFixtures().fixturesPath = basePath;
      window.loadFixtures('fx-eu-promo-loader.html');
      conf = [
        {
          'id': 'next',
          'preloaded': { 'title': 'next' },
          'templateId': 'template-promo-next-prev'
        },
        {
          'id': 'entity',
          'url': basePathJSON + 'promo-entity.json',
          'templateId': 'template-promo-entity'
        },
        {
          'id': 'exhibition',
          'url': basePathJSON + 'promo-exhibition.json',
          'templateId': 'template-promo-exhibition'
        },
        {
          'id': 'gallery',
          'url': basePathJSON + 'promo-gallery.json',
          'templateId': 'template-promo-gallery'
        },
        {
          'id': 'news',
          'url': basePathJSON + 'promo-news.json',
          'templateId': 'template-promo-news'
        },
        {
          'id': 'generic',
          'url': basePathJSON + 'promos-generic.json',
          'templateId': 'template-promo-generic'
        },
        {
          'id': 'previous',
          'preloaded': { 'title': 'previous' },
          'templateId': 'template-promo-next-prev',
          'firstIfMissing': 'next'
        }
      ];
      templateMarkup = $('#template-markup')[0].outerHTML;
      console.log(templateMarkup + '\n\t(templateMarkup) ' + typeof(templateMarkup));
    });

    it('builds html from ajax-loaded card data', function(done){
      PromoLoader.load(conf, templateMarkup, function(markup){
        expect(markup.find('h2').length).not.toBeLessThan(conf.length);
        done();
      });
    });

    it('renders the card multiple times when supplied with an array', function(done){
      PromoLoader.load(conf, templateMarkup, function(markup){
        expect(markup.find('h2.promo-generic').length).toBe(2);
        done();
      });
    });

    it('can interpolate pre-loaded data into the loaded data', function(done){

      var testText      = 'ENTITIY-PRELOADED';
      conf[0].preloaded = { 'title': testText };

      PromoLoader.load(conf, templateMarkup, function(markup){
        expect(markup.find('h2:first').text()).toEqual(testText);
        done();
      });
    });

    it('adheres to the order defined in the config', function(done){

      // remove the next. previous, and the multi items
      conf.pop();
      conf.pop();
      conf.pop();

      var confirmInSync = function(html, configuration){
        html.find('h2').each(function(i, header){
          expect(header.textContent).toContain(configuration[i].id);
        });
      };

      PromoLoader.load(conf, templateMarkup, function(markup){

        var origTextFirstItem = $('h2:first').text();
        var origTextLastItem  = $('h2:last').text();

        confirmInSync(markup, conf);

        // backwards
        conf.reverse();

        PromoLoader.load(conf, templateMarkup, function(markup){

          var textFirstItem = $('h2:first').text();
          var textLastItem  = $('h2:last').text();

          confirmInSync(markup, conf);
          expect(origTextFirstItem).toEqual(textLastItem);
          expect(origTextLastItem).toEqual(textFirstItem);

          // with items missing
          conf = conf.splice(2, 2);

          PromoLoader.load(conf, templateMarkup, function(markup){
            confirmInSync(markup, conf);
            done();
          });
        });
      });
    });

    it('can order items conditionally on the availability of other items', function(done){

      conf.shift();

      PromoLoader.load(conf, templateMarkup, function(markup){
        expect(markup.find('h2:first').text()).toEqual('previous');
        done();
      });
    });

    describe('Error Handling', function(){

      it('ignores invalid config items', function(done){

        conf              = conf.slice(1, 2);
        conf[0].url       = false;
        conf[0].preloaded = false;

        PromoLoader.load(conf, templateMarkup, function(markup){
          expect(markup.find('h2').length).toEqual(0);
          done();
        });
      });

      it('can handle dead urls', function(done){

        var errorUrl = '/error/404';
        conf         = [conf[1]];
        conf[0].url  = errorUrl;

        PromoLoader.load(conf, templateMarkup, function(markup){
          expect(markup.is(':empty')).toBe(true);
          done();
        });
      });

    });

  });
});
