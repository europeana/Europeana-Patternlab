define(['jquery'], function($){

  'use strict';

  var pnlTranscriptions;
  var iiifMinMaxRatio;
  var searchTerm;

  function init(pnlTranscriptionsIn, iiifMinMaxRatioIn, searchTermIn){
    pnlTranscriptions = pnlTranscriptionsIn;
    iiifMinMaxRatio   = iiifMinMaxRatioIn;
    searchTerm        = searchTermIn;
  }

  function getTypedData(json, type){
    return $.grep(json.resources, function(r){
      return r['dc:type'] === type;
    });
  }

  function addFeatureData(geoJSON, c, id){
    geoJSON.features.push(
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': fmtCoord(c[0], c[1], c[2], c[3])
        },
        'properties': {
          'id': id
        }
      }
    );
  }

  function fmtCoord(x, y, w, h){

    var divider = iiifMinMaxRatio;

    x = parseInt(x);
    y = parseInt(y);
    w = parseInt(w);
    h = parseInt(h);

    return [[
      [ x      / divider, 0 - (y      / divider)],
      [(x + w) / divider, 0 - (y      / divider)],
      [(x + w) / divider, 0 - (y + h) / divider],
      [ x      / divider, 0 - (y + h) / divider],
      [ x      / divider, 0 - (y      / divider)]
    ]];
  }

  function processSearchTerm(fullText){

    if(!searchTerm){
      return null;
    }

    fullText = fullText.replace(/\s/g, ' ');

    var searchMatches = [];
    var regexSearch   = new RegExp(searchTerm, 'gi');

    var match;

    while((match = regexSearch.exec(fullText)) !== null){
      searchMatches.push(match.index);
    }
    return searchMatches;
  }

  function preProcessFeatureData(f, geoJSON, searchMatches){

    $.each(f, function(i, fData){

      // build feature data
      var id = fData['@id'].split('/').pop();

      // "on" is now an array...
      var onValue = fData['on'];

      $.each(onValue, function(i, ob){
        addFeatureData(geoJSON, ob.split('#')[1].split('=')[1].split(','), id);
      });

      // write data
      var hash  = fData['resource']['@id'].split('#')[1];
      var chars = hash.split('=')[1].split(',');

      fData.id    = id;
      fData.range = [parseInt(chars[0]), parseInt(chars[1])];

      if(searchMatches){

        var makeMatchData = function(){
          return {'open':[], 'close':[]};
        };

        $.each(searchMatches, function(i, searchMatch){

          if(fData.range[0] <= searchMatch && fData.range[1] >= searchMatch){
            fData.matchData = fData.matchData ? fData.matchData : makeMatchData();
            fData.matchData.open.push(searchMatch - fData.range[0]);
          }
          var offset = searchMatch + searchTerm.length;
          if(fData.range[0] <= offset && fData.range[1] >= offset){
            fData.matchData = fData.matchData ? fData.matchData : makeMatchData();
            fData.matchData.close.push(offset - fData.range[0]);
          }
        });
      }
    });
  }

  function processAnnotationData(ft, annotationData, pageRef, cb){

    var geoJSON = {
      'type': 'FeatureCollection',
      'features': []
    };

    var p = getTypedData(annotationData, 'Paragraph');
    var w = getTypedData(annotationData, 'Word');

    var fullText      = ft.value ? ft.value : ft['rdf:value'];
    var searchMatches = processSearchTerm(fullText);

    preProcessFeatureData(p, geoJSON);
    preProcessFeatureData(w, geoJSON, searchMatches);
    processParagraphData(p, w, fullText, pageRef, searchMatches !== null);

    if(cb){
      cb(geoJSON, pageRef);
    }
  }

  function processParagraphData(p, w, fullText, pageRef, hasSearchMatches){

    var markup             = '';
    var openedCarryOver    = false;
    var openCarryOver      = false;
    var defMatchCharacters = 'match-characters';
    var defMatchPhrase     = 'match-phrase';
    var defMatchWord       = 'match-word';
    var elOpenPhrase       = '<span class="' + defMatchPhrase + '">';
    var elOpenChars        = '<span class="' + defMatchCharacters + '">';

    $.each(p, function(i, paragraph){

      var id = paragraph.id;

      var containedWords = $.grep(w, function(word){
        return word.range[0] >= paragraph.range[0] && word.range[1] <= paragraph.range[1];
      });

      var text = '';

      if(openedCarryOver){
        openCarryOver = true;
        text          = elOpenPhrase;
      }

      if(hasSearchMatches){

        openCarryOver   = false;

        $.each(containedWords, function(i, cWord){

          var word;
          var wordClass;
          var prefix     = '';
          var suffix     = '';

          if(!cWord.matchData){

            word = fullText.slice(cWord.range[0], cWord.range[1]);

            if(openCarryOver){
              openCarryOver = false;
              prefix        = elOpenPhrase;
              //openedCarryOver = false;
            }
          }
          else{

            word                   = fullText.slice(cWord.range[0], cWord.range[1]);
            var matchData          = cWord.matchData;
            var elClose            = '</span>';

            var opensSingleAtStart = matchData.open.length  === 1 && matchData.open[0]  === 0;
            var closesSingleAtEnd  = matchData.close.length === 1 && matchData.close[0] === word.length;
            var closesComplexAtEnd = matchData.close.slice(-1).pop() === word.length;

            if(opensSingleAtStart && matchData.close.length === 0){
              prefix          = elOpenPhrase;
              openedCarryOver = true;
            }

            if(matchData.open.length < matchData.close.length){
              if(closesSingleAtEnd){
                suffix          = elClose;
                openedCarryOver = false;
                //openCarryOver = false;
              }
            }

            if((opensSingleAtStart && closesSingleAtEnd)
              ||
              (opensSingleAtStart && matchData.close.length === 0)
              ||
              (closesSingleAtEnd && matchData.open.length === 0)){

              // match entire word
              wordClass = defMatchWord;
            }
            else{
              // match only part of word

              var word2          = '';
              var includesOpened = 0;
              var includesClosed = 0;

              $.each(word.split(''), function(j, letter){

                if(matchData.open.indexOf(j) > -1){
                  if(j > 0){
                    word2          += elOpenChars;
                    includesOpened ++;
                    // close the gaps...
                    // wordClass      = 'match-partial';
                  }
                }

                if(matchData.close.indexOf(j) > -1 || closesComplexAtEnd && j === word.length-1){

                  includesClosed ++;

                  if(closesComplexAtEnd && j === word.length-1){
                    suffix += elClose;
                  }
                  else{
                    word2 += elClose;
                  }
                  if(includesClosed > includesOpened){
                    word2          = elOpenChars + word2;
                    includesOpened ++;
                    // close the gaps...
                    // wordClass      = 'match-partial';
                  }
                  if(openedCarryOver){
                    prefix          = elClose;
                    openedCarryOver = false;
                    openCarryOver   = false;
                  }
                }
                word2 += letter;
              });

              if(includesOpened > includesClosed){
                word2           += elClose;
                includesClosed  ++;
                openCarryOver   = true;
                openedCarryOver = true;
              }
              word = word2;
            }
          }

          text += prefix + '<word ' + (wordClass ? 'class="' + wordClass + '" ' : '') + 'id="' + cWord.id + '">' + word + '</word>' + (suffix ? suffix + ' ' : ' ');
        }); // end contained words
      }
      else{
        $.each(containedWords, function(i, ob){
          var word = fullText.slice(ob.range[0], ob.range[1]);
          text += '<word id="' + ob.id + '" data-range="' + JSON.stringify(ob.range) + '">' + word + '</word> ';
        });
      }

      markup += '<div class="transcription ' + pageRef + '"><p id="' + id + '">' + text + '</p></div>';
    });

    pnlTranscriptions.append(markup);
  }

  return {
    init: init,
    getTypedData: getTypedData,
    processAnnotationData: processAnnotationData
  };
});
