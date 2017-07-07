define(['jquery', 'purl'], function($){

  var resolvePathAndParams = function(url){

    var path   = url.split('?')[0];
    var $url   = $.url(url);
    var params = $url.param();

    if(path.indexOf('hierarchy/') > -1){

      var key = path.split(/[\S]*\/templates[^\/]*\//);
      key = key[key.length-1].replace('hierarchy/', '');

      if(key.indexOf('/')>-1){
        params['id']     = key.split('/')[0].replace('record', '');
        params['action'] = key.split('/')[1];
      }
      else{
        params['action'] = key;
      }
      if(!params['id']){
        params['id'] = '1';
      }
      path = 'portal_hierarchy';
    }
    else if(path.indexOf('/federated.json') > -1){
      path = 'portal_federated';
    }

    return {
      'path': path,
      'params': params
    };
  };

  return {
    'paths': {
      'metis-data-quality':        '../../eu/dev_data/metis/data-quality.json',
      'metis-dataset-info-create': '../../eu/dev_data/metis/dataset-info-create.json',
      'metis-pandora':             '../../eu/dev_data/metis/pandora.json',
      'metis-preview':             '../../eu/dev_data/metis/preview.json',
      'metis-processing':          '../../eu/dev_data/metis/processing.json',
      'portal_entity':             '../../eu/dev_data/portal/entity.json',
      'portal_federated':          '../../eu/dev_data/portal/federated.json',
      'portal_hierarchy':          '../../eu/dev_data/portal/hierarchy.json',
      'portal_similar_items':      '../../eu/dev_data/portal/mlt.json'
    },
    resolvePathAndParams: function(url){
      return resolvePathAndParams(url);
    }
  };
});
