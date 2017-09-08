define([], function(){

  var manifest_transcriptions = {
    "sequences": [
      {
        "canvases": [
          {
            "@context" : "http://iiif.io/api/image/2/context.json",
            "@id" : "http://iiif.europeana.eu//data-providers/TheEuropeanLibrary/records/3000119062998/representations/presentation_images/node-5/image/SBB/Berliner_Börsenzeitung/1927/07/21/F_073_335_0/F_SBB_00007_19270721_073_335_0_001",
            "label" : "image one",
            "images" : [{
              "resource": {
                "service": {
                  "@id" : "http://iiif.europeana.eu//data-providers/TheEuropeanLibrary/records/3000119062998/representations/presentation_images/node-5/image/SBB/Berliner_Börsenzeitung/1927/07/21/F_073_335_0/F_SBB_00007_19270721_073_335_0_001",
                }
              }
            }]
          },
          {
            "@context" : "http://iiif.io/api/image/2/context.json",
            "@id" : "http://iiif.europeana.eu//data-providers/TheEuropeanLibrary/records/3000096309638/representations/presentation_images/node-2/image/SBB/Berliner_Tageblatt/1926/12/12/0/F_SBB_00001_19261212_055_586_0_010",
            "label" : "image two",
            "images" : [{
              "resource": {
                "service": {
                  "@id": "http://iiif.europeana.eu//data-providers/TheEuropeanLibrary/records/3000096309638/representations/presentation_images/node-2/image/SBB/Berliner_Tageblatt/1926/12/12/0/F_SBB_00001_19261212_055_586_0_010",
                }
              }
            }]
          }
        ]
      }
    ]
  };

  return {
    getData: function(params){

      console.log('MANIFEST-DATA: ' + JSON.stringify(params));

      if(params.manifest_transcriptions){
        return manifest_transcriptions;
      }
    }
  };

});

