define([], function(){

    var init904 = function(){

        alert('init904 ' + window.NOFLogging_ready);


        window.NOFLogging_ready = window.NOFLogging_ready || [];

        console.log('push window.NOFLogging_ready');

        window.NOFLogging_ready.push(function(){

          alert('window.NOFLogging_read');

          var config = {
            api_url : 'http://analytics.904labs.com',
            project_key : 'c6k2l3csHzhHlRMIEEyVPCEERcSDSozQDf1IPk0rfhg',
            log_mouse_movements : false,
            log_mouse_clicks : false,
            post_events_queue_on_browser_close : true,
            log_browser_close : true,
            debug : false
          };

          NOFLogging.init(config, function(){

            alert('bind bu');

            $(window).bind('beforeunload', function(e) {
              var message = "Why are you leaving?";
              e.returnValue = message;
              alert(message);
              return message;
            });

            /*
             * Wrapper function for NOFLogging.query
             *
             * @newUrl - requested search page url that facet data can be extracted from
             *
             */
            var queryNOF = function(newUrl, saved){
              var purl       = $.url(newUrl);
              var queryParam = purl.param('q');
              var qf         = purl.param('qf');

              if(qf || queryParam){
                var facets = purl.param('qf');
                var rowsParam = purl.param('rows');
                var data = {
                  "NTW" : (window.history.length == 1)
                };
                if(rowsParam){
                  data.rows = rowsParam;
                }
                if(saved){
                  data.saved_search = true;
                }
                if(facets){
                  facets = (facets instanceof Array) ? facets : [facets];
                  var fd = {};
                  for(var i=0; i<facets.length; i++){
                    var fs = facets[i].replace(/http:\/\//g, '').split(':');
                    var fName = fs[0];
                    var fVal = fs.length > 1 ? fs[1] : '';

                    if(fVal.length == 0){
                      fVal = fName;
                      fName = 'refinements';
                    }
                    if(fName == 'RIGHTS'){
                      fVal = 'http://' + fVal;
                    }
                    if(fd[fs[0]]){
                      fd[fName].push(fVal);
                    }
                    else{
                      fd[fName] = [fVal];
                    }
                  }
                  data.facets = fd;
                } // end facets


                // NOFLogging.query(queryParam ? queryParam : '*:*', data);
                console.error( 'NOFLogging.query ' + (queryParam ? queryParam : '*:*', data));


              } // end qf param
            } // end queryNOF

            /*
             * NOF binding for all pages
             *
             */
            $('.search-multiterm').submit(function(e){
              var urlExt = 'http://x.com/?q=' + encodeURIComponent($('.search-input').val());
              queryNOF(urlExt);
            });

            //if(eu.europeana.vars.page_name == 'myeuropeana/index'){
              $('#language-settings form input[type="submit"]').click(function(){
                var state = NOFLogging.getState();
                state.portal_language           = eu.europeana.vars.NOF_languageItem ? eu.europeana.vars.NOF_languageItem : "en";
                state.portal_translate_keywords = $('#keyword-languages input[type="checkbox"]:checked').map(function(i, ob){
                  return $(ob).val();
                }).get();
                NOFLogging.setState(state);
              });

              $('#saved-searches a').click(function(e){
                var href = $(this).attr('href');
                queryNOF(href, true);
              });
            //}

            //if(eu.europeana.vars.page_name == 'full-doc.html'){
              var href    = null;
              var evtName = null;
              var rank    = null;
              var from    = window.location.href.split('record/')[1].split('.html')[0];

              var logNav = function(){
                if(rank != null){
                  var purlHref = $.url(rank);
                  rank = parseInt(purlHref.param('start'));
                }
                if(href != null && evtName != null){
                  NOFLogging.logEvent(evtName, {to:href, to_rank: rank, from: from});
                }
              }

              $('#navigation li:nth-child(1) a').click(function(){
                var href     = $(this).attr('href');
                var purlHref = $.url(href);
                var start    = parseInt(purlHref.param('start') ? purlHref.param('start') : 1);

                start = Math.ceil(start / eu.europeana.vars.rows);

                NOFLogging.logEvent('return_to_results', {results_page : start, rows : parseInt(eu.europeana.vars.rows)});
              });

              $('#navigation li a.pagination-previous').click(function(){
                href = $(this).attr('href');
                rank = $(this).attr('href');
                href = href.split('record/')[1].split('.html')[0];
                evtName = 'prev_result';
                logNav();
              });

              $('#navigation li a.pagination-next').click(function(){
                href = $(this).attr('href');
                rank = $(this).attr('href');
                href = href.split('record/')[1].split('.html')[0];
                evtName = 'next_result';
                logNav();
              });
            //} // end fulldoc

            //if(eu.europeana.vars.page_name == 'search.html'){

              /*
               * Log results for this page
               */
              var getObjectIds = function(){
                var objectIds = [];
                $('.thumb-frame>a').each(function(){
                  var url = $(this).attr('href');
                  url = /\/record\/([^;]+).html/.exec(url)[1];
                  objectIds.push(url);
                });
                return objectIds;
              };

              NOFLogging.queryResults(getObjectIds(), eu.europeana.vars.msg.result_count, $('.thumb-frame').length);

              /*
               * Extra NOF binding for search page
               *
               */

              $('.nav-next a').add('.nav-prev a').add('.nav-first a').add('.nav-last a').click(function(e){

                var url = $(e.target).attr('href');
                var start = $.url(url).param('start');
                var cPage = Math.ceil(eu.europeana.vars.msg.start / eu.europeana.vars.rows);
                var nPage = Math.ceil(start / eu.europeana.vars.rows);

                NOFLogging.paginate(nPage, cPage);
              });

              $('.jump-to-page').submit(function(e){
                var cPage = Math.ceil(eu.europeana.vars.msg.start / eu.europeana.vars.rows);
                var nPage = $(e.target).find('#start-page').val();

                if(nPage && typeof parseInt(nPage) == 'number'){
                  NOFLogging.paginate(parseInt(nPage), cPage);
                }
                else{
                  js.console.log('not a number = ' + nPage);
                }
              });

              $('.thumb-frame').add('.thumb-frame + a').click(function(e){

                var url         = $(e.target).closest('.li').find('a').attr('href');
                var purlClicked = $.url(url);
                var rank        = parseInt(purlClicked.param('start') ? purlClicked.param('start') : 1);

                url = url.split('record/')[1].split('.html')[0];

                NOFLogging.logEvent('clicked_result', { url:url, rank: rank } );
              });

              $('#facets-actions li input[type=checkbox]').click(function(e){

                var url = ($(e.target)[0].nodeName.toUpperCase() == 'LABEL' ? $(e.target).closest('a') : $(e.target).next('a')).attr('href');
                queryNOF(url);

                e.stopPropagation();
              });

              $('#search-filter a').add('#search-filter a span').click(function(e){
                var url = ($(e.target)[0].nodeName.toUpperCase() == 'SPAN' ? $(e.target).closest('a') : $(e.target)).attr('href');
                queryNOF(url);
                e.stopPropagation();
              });

              $('#refine-search-form').submit(function(e){
                var urlExt = '&qf=' + encodeURIComponent($('#refine-search-form #newKeyword').val());
                queryNOF(window.location.href + urlExt);
              });
            //} // end search

            // initial state has english as default language and no translatable
            // keywords

            var state = NOFLogging.getState();
            var doOnLogout = function(){
              state.portal_language = 'en';
              state.portal_translate_keywords = [];
              NOFLogging.setState(state);
            }

            if(!eu.europeana.vars.NOF.user && state.user_id){
              doOnLogout();
              NOFLogging.userLogout();
            }
            if(!state.user_id){
              doOnLogout();
            }

            // NOF login

            if(eu.europeana.vars.NOF.user){
              if(!NOFLogging.getState().user_id){
                var username    = eu.europeana.vars.NOF.username;
                var state       = NOFLogging.getState();
                state.portal_language = eu.europeana.vars.NOF.portal_language;
                state.portal_translate_keywords = eu.europeana.vars.NOF.portal_translate_keywords ? eu.europeana.vars.NOF.portal_translate_keywords : [];

                NOFLogging.setState(state);
                NOFLogging.userLogin(username);
              }
            }
            else{
              var state       = NOFLogging.getState();

              if(typeof $.cookie('portalLanguage') != 'undefined'){
                state.portal_language = $.cookie('portalLanguage');
              }

              if(typeof $.cookie('keywordLanguagesApplied') != 'undefined' && $.cookie('keywordLanguagesApplied') == 'true'){
                if(typeof $.cookie('keywordLanguages') != 'undefined'){
                  state.portal_translate_keywords = $.cookie('keywordLanguages').split('|');
                }
              }
            }

            $('a[href="logout.html"]').click(function(){
              doOnLogout();
              NOFLogging.userLogout();
            });

          }); // end NOF init
    })} // end NOF init


    return {
        init904: function(){
            init904();
        }
    }

});

