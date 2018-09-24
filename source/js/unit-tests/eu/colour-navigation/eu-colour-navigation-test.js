define(['jquery', 'jasmine_jquery', 'jasmine_ajax'], function($){

  'use strict';

  var EuColourNav;
  var ajaxData;

  describe('Eu Colour Navigation', function(){

    var waitInit         = 4000;
    var waitRender       = 1000;

    var basePathJson = '/base/js/unit-tests/fixture-data';
    var ajaxFile     = 'eu-colour-navigation.json';
    var ajaxPath     = basePathJson + '/' + ajaxFile;

    afterEach(function(){
      jasmine.Ajax.uninstall();
    })
    beforeEach(function(done) {

      jasmine.getFixtures().fixturesPath     = 'base/js/unit-tests/fixtures';
      jasmine.getJSONFixtures().fixturesPath =  basePathJson;

      window.loadFixtures('fx-eu-colour-navigation.html');
      window.loadJSONFixtures(ajaxFile);

      if(!ajaxData){
        $.get(ajaxPath, function(data){
          ajaxData = data;
        });
      }

      jasmine.Ajax.install();
      jasmine.Ajax.stubRequest(
        /.*\/js-mustache\/.*colour-navigation-colour-navigation.mustache\?_=.*/
      ).andReturn({
        status: 200,
        contentType: 'text/plain',
        responseText: ''
        + '<ol class="colour-grid">'
        + '  [[#items]]'
        + '    <li class="colour-grid-item">'
        + '      <a [[#url]]href="[[.]]"[[/url]]>'
        + '        <span class="colour-sample" style="background-color:[[hex]];"></span>'
        + '        <span class="colour-hex">[[#hex]][[.]][[/hex]][[^hex]]&nbsp;[[/hex]]</span>'
        + '        <span class="colour-name">[[#colourName]][[.]][[/colourName]][[^colourName]]&nbsp;[[/colourName]]</span>'
        + '      </a>'
        + '    </li>'
        + '  [[/items]]'
        + '</ol>'
      });

      require(['eu_colour_nav'], function(lib){
        EuColourNav = lib;
        done();
      });
    });

    it('Builds elements containing colours from markup-embedded data', function(done){

      expect($('.colour-container').length).toEqual(1);
      expect($('.colour-grid').length).toEqual(0);

      EuColourNav.initColourData();

      setTimeout(function(){
        expect($('.colour-grid').length).toBeGreaterThan(0);
        done();
      }, waitInit);
    });

    it('Builds elements containing colours from ajax data', function(done){

      expect($('.colour-container').length).toEqual(1);
      expect($('.colour-grid').length).toEqual(0);

      EuColourNav.initColourData();

      setTimeout(function(){

        var initiallyLoaded = $('.colour-grid').length;

        console.log('ajaxData = ' + JSON.stringify(ajaxData))
        EuColourNav.addColourDataFromAjax(ajaxData);

        setTimeout(function(){
          var totalLoaded = $('.colour-grid').length;
          expect(totalLoaded).toBeGreaterThan(initiallyLoaded);
          done();
        }, waitRender);
      }, waitInit);
    });

    /*
    it('Uses I18n to label colours with their name', function(done){
      done();
    });

    it('Leaves colour name lables blank if I18n translations are unavailable', function(done){
      done();
    });

    it('Only displays colour elements corresponding to "active" elements in the data source', function(done){
      done();
    });

    it('Triggers an event indicating when colour data is available', function(done){
      done();
    });

    it('Triggers an event indicating when colour data is not available', function(done){
      done();
    });
    */
  });
});
