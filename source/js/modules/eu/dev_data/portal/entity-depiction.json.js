define([], function(){

  var data = [
    {
	    "api_response": {
		    "depiction": {
		      "id":     "http://commons.wikimedia.org/wiki/Special:FilePath/Diepenbrock.alph.portrait.jpg",
			    "XXXsource": "http://commons.wikimedia.org/wiki/File:Diepenbrock.alph.portrait.jpg"
		    }
	    }
    },
    {
	    "api_response": {
		    "depiction": {
          "id":	    "https://upload.wikimedia.org/wikipedia/commons/f/f6/Raffaello_Sanzio.jpg",
          "XXXsource":	"http://commons.wikimedia.org/wiki/File:Raffaello%20Sanzio.jpg"
		    }
	    }
    },
    {
	    "api_response": {
		    "depiction": {
          "id":	"http://commons.wikimedia.org/wiki/Special:FilePath/Cropped%20version%20of%20Jan%20Vermeer%20van%20Delft%20002.jpg",
          "XXXsource":	"http://commons.wikimedia.org/wiki/File:Cropped%20version%20of%20Jan%20Vermeer%20van%20Delft%20002.jpg"
		    }
	    }
    }
  ];

  return {
    getData: function(params){
      console.log('incoming params ' + JSON.stringify(params, null, 4) + ' >> INDEX = ' + params.index);
      return data[params.index ? params.index : 0];
    }
  };

});
