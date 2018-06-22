define(['eu_title_bar', 'jasmine_jquery'], function(EuTitleBar){

  'use strict';

  describe('Eu TitleBar', function(){

    var conf;
    var waitTime = 200;
    // var headerHeight;

    // var elBottom;
    var elHeader;
    var elTop;

    beforeEach(function(done) {

      jasmine.getFixtures().fixturesPath = 'base/js/unit-tests/fixtures';
      window.loadFixtures('fx-eu-title-bar.html');
      window.scrollTo(0, 0);

      // elBottom = $('.el-bottom');
      elHeader = $('.el-header');
      elTop    = $('.el-top');

      conf = {
        $container: elHeader,
        $detectionElement: elTop,
        markup: '<div class="title-bar"><h3>The content</h3></div>'
      };
      setTimeout(function(){
        done();
      }, waitTime);
    });

    it('uses custom markup', function(){

      var customElClass = 'custom-class';
      conf.markup       = '<div class="title-bar ' + customElClass + '">The content</div>';

      expect($('.' + customElClass).length).toEqual(0);
      EuTitleBar.init(conf);
      expect($('.' + customElClass).length).toEqual(1);
    });

    it('is hidden by default', function(done){
      EuTitleBar.init(conf);

      setTimeout(function(){
        expect( $('.title-bar').height()).toEqual(0);
        done();
      }, waitTime);
    });

    // Get these working with PhantomJS
    /*
    it('becomes visible when detection element is scrolled off-screen', function(done){
      EuTitleBar.init(conf);

      headerHeight = elHeader.height();

      expect( EuTitleBar.elementIsInViewport(elTop.get(0),    headerHeight)).toBe(true);
      expect( EuTitleBar.elementIsInViewport(elBottom.get(0), headerHeight)).not.toBe(true);

      window.scrollTo(0,document.body.scrollHeight);

      expect( EuTitleBar.elementIsInViewport(elTop.get(0),    headerHeight)).not.toBe(true);
      expect( EuTitleBar.elementIsInViewport(elBottom.get(0), headerHeight)).toBe(true);

      setTimeout(function(){
        expect( $('.title-bar').height()).toBeGreaterThan(0);
        done();
      }, waitTime);
    });

    it('becomes hidden when detection element is scrolled on-screen', function(done){

      EuTitleBar.init(conf);
      expect( $('.title-bar').height()).toEqual(0);

      window.scrollTo(0, document.body.scrollHeight);

      headerHeight = elHeader.height();

      setTimeout(function(){
        expect( $('.title-bar').height()).toBeGreaterThan(0);

        window.scrollTo(0, 0);

        setTimeout(function(){

          expect( $('.title-bar').height()).toEqual(0);
          done();

        }, waitTime);
      }, waitTime);
    });
    */

  });
});
