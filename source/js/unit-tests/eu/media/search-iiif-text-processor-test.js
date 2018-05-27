define(['jquery', 'media_iiif_text_processor', 'jasmine_jquery'], function($, Processor){
  'use strict';

  var basePathJson = '/base/js/unit-tests/fixture-data/media';

  describe('IIIF Text Processor', function(){

    var pnlTranscriptions;
    var json;
    var jsonFile = 'iiif-texts.json';

    beforeEach(function(done){

      jasmine.getFixtures().fixturesPath     = 'base/js/unit-tests/fixtures/media';
      jasmine.getJSONFixtures().fixturesPath = basePathJson;

      window.loadFixtures('fx-iiif-texts.html');
      window.loadJSONFixtures(jsonFile);

      $.getJSON(basePathJson + '/' + jsonFile).done(function(jsonIn){
        json = jsonIn;
        done();
      });

      pnlTranscriptions = $('.transcriptions');
    });

    it('exposes utility functions for filtering JSON', function(){
      Processor.init(pnlTranscriptions, 0);
      var p = Processor.getTypedData(json, 'Paragraph');
      expect(p.length).toBe(2);
    });

    describe('Processing', function(){

      var fullText;

      beforeEach(function(){
        var page = Processor.getTypedData(json, 'Page');
        fullText = page[0]['fullText'];
        Processor.init(pnlTranscriptions, 0);
      });

      it('writes the annotation text values to the configured element', function(){
        expect(pnlTranscriptions.find('word').length).toBe(0);
        expect(pnlTranscriptions.text()).toEqual('');

        Processor.processAnnotationData(fullText, json, '0');

        expect(pnlTranscriptions.find('word').length).not.toBe(0);
        expect(pnlTranscriptions.text().trim()).toEqual(fullText.value);
      });

      it('executes a callback when done', function(){

        var customHandlerCalled = false;
        var callback = function(){
          customHandlerCalled = true;
        };

        Processor.processAnnotationData(fullText, json, '0', callback);
        expect(customHandlerCalled).toBe(true);
      });
    });

    describe('Search Term Highlighting', function(){

      var fullText;
      var classMatchChars  = 'match-characters';
      var classMatchWord   = 'match-word';
      var classMatchPhrase = 'match-phrase';

      beforeEach(function(){
        var page = Processor.getTypedData(json, 'Page');
        fullText = page[0]['fullText'];
      });

      it('can apply to parts of words', function(){

        var searchTerm = 'Para';
        Processor.init(pnlTranscriptions, 0, searchTerm);
        Processor.processAnnotationData(fullText, json, '0');

        var word1 = pnlTranscriptions.find('word:first');

        var match1 = word1.find('.' + classMatchChars);

        expect(match1.length).toEqual(1);
        expect(word1.text()).toEqual('Paragraph');
        expect(match1.text()).toEqual(searchTerm);
      });

      it('can apply to whole words', function(){

        Processor.init(pnlTranscriptions, 0, 'Paragraph');
        Processor.processAnnotationData(fullText, json, '0');

        var word1  = pnlTranscriptions.find('word:first');
        var match1 = word1.find('.' + classMatchChars);

        expect(match1.length).toEqual(0);
        expect(word1.text()).toEqual('Paragraph');
        expect(word1.attr('class').indexOf(classMatchWord)).toBeGreaterThan(-1);
      });

      it('can apply to perfectly matched phrases', function(){

        var searchTerm = 'Paragraph one';

        Processor.init(pnlTranscriptions, 0, searchTerm);
        Processor.processAnnotationData(fullText, json, '0');

        var match1 = pnlTranscriptions.find('.' + classMatchPhrase);

        expect(match1.length).toEqual(1);
        expect(match1.text()).toEqual(searchTerm);
      });

      it('can apply to a phrase that splits all (both) the words it spans', function(){

        var searchTerm = 'graph on';

        Processor.init(pnlTranscriptions, 0, searchTerm);
        Processor.processAnnotationData(fullText, json, '0');

        var match1 = pnlTranscriptions.find('.' + classMatchChars);

        expect(match1.length).toEqual(2);
        expect(match1.text()).toEqual(searchTerm.replace(/ /g, ''));
      });

      it('can apply to a phrase that spans entire words and begins with a split word', function(){

        var searchTerm = 'graph one has';

        Processor.init(pnlTranscriptions, 0, searchTerm);
        Processor.processAnnotationData(fullText, json, '0');

        var match1 = pnlTranscriptions.find('.' + classMatchChars);
        var match2 = pnlTranscriptions.find('.' + classMatchPhrase);

        expect(match1.length).toEqual(1);
        expect(match2.length).toEqual(1);
        expect(match1.text() + ' ' + match2.text()).toEqual(searchTerm);
      });

      it('can apply to a phrase that spans entire words and ends with a split word', function(){

        var searchTerm = 'Paragraph one h';

        Processor.init(pnlTranscriptions, 0, searchTerm);
        Processor.processAnnotationData(fullText, json, '0');

        var match1 = pnlTranscriptions.find('.' + classMatchPhrase);
        var match2 = pnlTranscriptions.find('.' + classMatchChars);

        expect(match1.length).toEqual(1);
        expect(match2.length).toEqual(1);

        expect(match1.text() + match2.text()).toEqual(searchTerm);
      });

      it('can apply to a phrase that spans entire words and begins and ends with split words', function(){

        var searchTerm = 'graph one ha';

        Processor.init(pnlTranscriptions, 0, searchTerm);
        Processor.processAnnotationData(fullText, json, '0');

        var match1 = pnlTranscriptions.find('.' + classMatchPhrase);
        var match2 = pnlTranscriptions.find('.' + classMatchChars);

        expect(match1.length).toEqual(1);
        expect(match2.length).toEqual(2);

        expect(match2.first().text() + ' ' + match1.text() + match2.last().text()).toEqual(searchTerm);
      });

      it('can apply to a phrase that spans multiple paragraphs', function(){

        var searchTerm = 'has 5 words. Paragraph two';

        Processor.init(pnlTranscriptions, 0, searchTerm);
        Processor.processAnnotationData(fullText, json, '0');

        var match1 = pnlTranscriptions.find('.' + classMatchPhrase);

        expect(match1.length).toEqual(2);

        expect(match1.text()).toEqual(searchTerm);
      });

      it('can apply to single letters', function(){

        var searchTerm = 'h';

        Processor.init(pnlTranscriptions, 0, searchTerm);
        Processor.processAnnotationData(fullText, json, '0');

        expect(pnlTranscriptions.find('.' + classMatchChars).length).toEqual(4);
        expect(pnlTranscriptions.find('.' + classMatchPhrase).length).toEqual(0);
        expect(pnlTranscriptions.find('.' + classMatchWord).length).toEqual(0);

      });

    });
  });
});
