define(['jquery', 'purl'], function($){

  var keyDB     = 'eu_dc_data';

  var getDB = function(){
    return localStorage.getItem(keyDB) ? JSON.parse(localStorage.getItem(keyDB)) : {};
  };

  var deleteItem = function(dc){
    var db   = getDB();
    var data = db[dc];
    db[dc]   = undefined;

    localStorage.setItem(keyDB, JSON.stringify(db));
    return data;
  };

  var addItem = function(key, dc){
    var db  = getDB();
    db[key] = dc;

    localStorage.setItem(keyDB, JSON.stringify(db));
  };

  var prepOutgoing = function($tgts, key, data){

    var onUnload = function(){

      addItem(key, data);
      //console.log('written [' + key + '] - ' + (typeof data) + '\n\t' + JSON.stringify(data));

    };

    $(window).on('beforeunload', onUnload);

    $tgts.each(function(){
      $(this).on('click', onUnload);
      $(this).on('focus', onUnload);
    });

    $tgts.each(function(){

      var $this  = $(this);
      var href   = $this.attr('href');
      var params = $.url(href).param();

      params['dc'] = key;

      href = href.split('?')[0] + '?' + $.param(params);

      $this.attr('href', href);
    });

  };

  var receiveIncoming = function(){
    var url  = $.url(window.location.href);
    var dc   = url.param('dc');

    console.log(' - dc param is ' + dc + ', will load from ' + dc);

    var data = deleteItem(dc);

    console.log(' - loaded data =  ' + data + ', typeof ' + data + ' from (deleted key) ' + dc );


    return {'data': data, 'dc': dc};
  };

  var clearOld = function(){
    // TODO
  };

  return {
    prepOutgoing: prepOutgoing,
    receiveIncoming: receiveIncoming
  };

});