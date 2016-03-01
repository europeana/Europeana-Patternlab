ResponsivePageTest = AsyncTestCase("ResponsivePageTest");

ResponsivePageTest.prototype.setUp = function(){
  this.testUtils = new TestUtils();
};

ResponsivePageTest.prototype.testNoScrollSearchObject = function(queue){

    this.added_css = [];
    jstestdriver.console.log('jquery = ' + typeof $);

    var callbackFunction = function(){};

    queue.call('load css files', function(callbacks) {
        var callbackWrapper = callbacks.add(callbackFunction);
        this.added_css.push( this.testUtils.loadCss("/test/public/styleguide/css/styleguide.css") );
        this.added_css.push( this.testUtils.loadCss("/test/public/css/search/screen.css", callbackWrapper) );
    });

    this.testUtils.loadHtml('/test/public/patterns/templates-Search-Search-object/templates-Search-Search-object.html');

    assertEquals(1, $('.logo').size());

    queue.call('load css files', function(callbacks) {
        assertEquals('Horizontal Scrollbar detected - document should not be wider than window!', $(document).width(), $(window).width());
    });

};

ResponsivePageTest.prototype.tearDown = function(){
  //clean up - after each test
  var head = document.getElementsByTagName('head')[0];
  $('body').html('');
  if (this.added_css) {
    for(var i=0; i<this.added_css.length; i++){
      head.removeChild(this.added_css[i]);
    }
  }
};
