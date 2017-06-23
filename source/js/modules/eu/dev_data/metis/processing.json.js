define([], function(){
  var data = {
    "modification": {
      "action": "last modified",
      "date": "11/03/2017"
    },
    "dataset_processing": "The data processing data"
  };

  return {
    getData: function(params){
      return data;
    }
  }
});