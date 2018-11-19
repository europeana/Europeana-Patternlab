define([], function(){

  var promo = {
    "url": "javascript:alert('open this exhibition (1)')",
    "title": "The Exhibition: Johann Vermeer can be found here too along with other objets d'art including some Art Nouveau",
    "description": "<p>Tired of the old conventions, Art Nouveau artists readily embraced glass in their projects. It became an essential tool in creating luminous living areas and spaces</p>",
    "image": "/images/virtual-exhibitions/art-nouveau/wiki-art-nouveau-thumbnail.png",
    "logo_url": "../../images/europeana-logo-collections.svg",
    "type": "Exhibition",
    "relation": "Feautues Johann Vermeer"
  };

  return {
    getData: function(params){
      return promo;
    }
  };
});
