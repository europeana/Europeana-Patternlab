define(['jquery', 'jasmine_jquery', 'jasmine_ajax'], function($){

  'use strict';

  var EuColourNav;
  var ajaxData;

  describe('Eu Colour Navigation', function(){

    var waitInit         = 1750;
    var waitRender       = 750;

    var basePathJson = '/base/js/unit-tests/fixture-data';
    var ajaxFile     = 'eu-colour-navigation.json';
    var ajaxPath     = basePathJson + '/' + ajaxFile;

    afterEach(function(){
      jasmine.Ajax.uninstall();
    });

    beforeEach(function(done) {

      jasmine.getFixtures().fixturesPath     = 'base/js/unit-tests/fixtures';
      jasmine.getJSONFixtures().fixturesPath =  basePathJson;

      window.loadFixtures('fx-eu-colour-navigation.html');
      window.loadJSONFixtures(ajaxFile);

      $.get(ajaxPath, function(data){
        ajaxData = data;
      });

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
        + '        [[#colourName]]<span class="colour-name">[[.]]</span>[[/colourName]]'
        + '      </a>'
        + '    </li>'
        + '  [[/items]]'
        + '</ol>'
      });

      require(['eu_colour_nav', 'i18n_base', 'i18n'], function(lib){
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

        EuColourNav.addColourDataFromAjax(ajaxData);

        setTimeout(function(){
          var totalLoaded = $('.colour-grid').length;
          expect(totalLoaded).toBeGreaterThan(initiallyLoaded);
          done();
        }, waitRender);
      }, waitInit);
    });

    it('Uses I18n to label colours with their name', function(done){

      EuColourNav.initColourData();

      setTimeout(function(){
        expect($('.colour-name').length).toBeGreaterThan(0);
        done();
      }, waitInit);

    });

    it('Leaves colour name labels blank if I18n translations are unavailable', function(done){

      var window_I18n = window.I18n;
      window.I18n = null;

      EuColourNav.initColourData();
      setTimeout(function(){
        expect($('.colour-name').length).toEqual(0);
        done();
      }, waitInit);

      window.I18n = window_I18n;
    });

    it('Only displays colour elements corresponding to "active" elements in the data source', function(done){

      EuColourNav.initColourData();

      setTimeout(function(){
        expect($('.colour-grid.active').length).toEqual(0);
        $('.media.1').addClass('active');
        EuColourNav.updateColourData();
        expect($('.colour-grid.active').length).toBeGreaterThan(0);
        done();
      }, waitInit);
    });

    it('Triggers an event indicating when colour data is available', function(done){

      var eventCallback  = { 'coloursAvailable': function(){}};
      spyOn(eventCallback, 'coloursAvailable');
      $(window).on('colour-data-available', eventCallback.coloursAvailable);

      EuColourNav.initColourData();

      setTimeout(function(){
        $('.media.1').addClass('active');
        EuColourNav.updateColourData();
        expect(eventCallback.coloursAvailable).toHaveBeenCalled();
        expect(eventCallback.coloursAvailable.calls.mostRecent().args[1].tf).toBe(true);
        done();
      }, waitInit);
    });

    it('Triggers an event indicating when colour data is NOT available', function(done){

      var eventCallback  = { 'coloursAvailable': function(){}};

      spyOn(eventCallback, 'coloursAvailable');
      $(window).on('colour-data-available', eventCallback.coloursAvailable);

      EuColourNav.initColourData();

      setTimeout(function(){
        EuColourNav.updateColourData();
        expect(eventCallback.coloursAvailable).toHaveBeenCalled();
        expect(eventCallback.coloursAvailable.calls.mostRecent().args[1].tf).toBe(false);
        done();
      }, waitInit);
    });

  });
});
