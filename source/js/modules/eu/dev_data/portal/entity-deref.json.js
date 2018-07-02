define([], function(){

  var data = {
    depiction: {
      id: "/images/sample/object_thumbnail.jpg"
    }
  };

  var dataAlternative = {
    depiction: {
      id: "/images/sample/object_thumbnail2.jpg"
    }
  };

  return {
    getData: function(params){
      if(params.id){
        return data;
      }
      else{
        return dataAlternative;
      }
    }
  };
});
