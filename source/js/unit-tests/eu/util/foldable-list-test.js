define(['jasmine_jquery', 'util_foldable'], function(x, uf){
  'use strict';
  var basePath = 'base/js/unit-test-fixtures/';

  describe('Eu Foldable', function(){

    beforeEach(function(done){
      jasmine.getFixtures().fixturesPath = basePath;
      window.loadFixtures('util/fx-foldable.html');
      done();
    });

    it('shows its items when opened', function(){

      var firstItem = $('.eu-foldable-title').eq(0);

      expect($('.eu-foldable-data:not(.eu-foldable-hidden)').length).toEqual(0);

      firstItem.click();

      expect($('.eu-foldable-data:not(.eu-foldable-hidden)').length).toEqual(1);
    });

    it('hides its items when closed', function(){

      var firstItem = $('.eu-foldable-title').eq(0);

      expect($('.eu-foldable-data:not(.eu-foldable-hidden)').length).toEqual(0);

      firstItem.click();

      expect($('.eu-foldable-data:not(.eu-foldable-hidden)').length).toEqual(1);
      firstItem.click();
      expect($('.eu-foldable-data:not(.eu-foldable-hidden)').length).toEqual(0);
    });

    it('shows closed items if filtering', function(){

      var firstItem = $('.eu-foldable-title').eq(0);

      expect($('.eu-foldable-data:not(.eu-foldable-hidden)').length).toEqual(0);

      firstItem.click();

      expect($('.eu-foldable-data:not(.eu-foldable-hidden)').length).toEqual(1);
      firstItem.closest('li').addClass(uf.classes.showClass);
      firstItem.click();
      expect($('.eu-foldable-data:not(.eu-foldable-hidden)').length).toEqual(1);
    });

  });
});
