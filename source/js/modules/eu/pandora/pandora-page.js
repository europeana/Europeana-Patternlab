define(['jquery', 'mustache', 'smartmenus'], function ($, Mustache) {
    function log(msg) {
        console.log(msg);
    }

    function setFieldValueStatus(id, status){
    	log('set field value id = ' + id);    	
    	$('#' + id).removeClass('field_value_valid field_value_invalid field_value_suspicious');   	
    	switch (status) {
			case "Valid": 
				$('#' + id).addClass('field_value_valid'); 
				break;
			case "Suspicious": 
				$('#' + id).addClass('field_value_suspicious'); 
				break;
			case "Invalid": 
				$('#' + id).addClass('field_value_invalid'); 
			    break;
			default:
				log('switch does not match');
		}
    }
    
    function bindTableCellClick(){   	
    	$('.mapping-field .flag').on('click', function(e){
        	var $cell = $(e.target).closest('.mapping-field')
    		var cellId = $cell.attr('id');
        	log('show menu for ' + cellId + ' menu length = ' +   ( $('.theme_select')).length  );
        	$('.theme_select').attr('active-cell', cellId);
    	});
    	
    	$('body').on('click', '.dropdown-menu a', function(e){
          e.preventDefault();
      	  var $el = $(e.target);
      	  var val = $el.text();
      	  var cellId = $('.theme_select').attr('active-cell');
      	  log('clicked on cell id ' + cellId);
      	  
      	  setFieldValueStatus(cellId, val);
      	});
 	
    } 
    
    function expandCollapseMappingCard() {
        $('.widget-expanded').hide();
    	$('.values-expand').click(function() {
    		var $card = $(this).closest('.widget-collapsed');
    		var $objId = $card.attr('object_id');
    		$('.widget-collapsed[object_id='+ $objId +']').hide();
    		$('.widget-expanded[object_id='+ $objId +']').show();
    	});
    	
    	$('.values-collapse').click(function() {
    		var $card = $(this).closest('.widget-expanded');
    		var $objId = $card.attr('object_id');
    		$('.widget-expanded[object_id='+ $objId +']').hide();
    		$('.widget-collapsed[object_id='+ $objId +']').show();
    	});
    }
    
    function applyXmlBeautify() {
        require(['jush'], function() {
        	jush.style('../../js/modules/lib/jush/jush.css');
        	jush.highlight_tag('code');
        	document.getElementById('xml-formatted').innerHTML = '<pre><code class=\'xml-view-div\'>' + jush
        	.highlight('xml', document.getElementById('xml').value)
        	.replace(/\t/g, '')
        	.replace(/(^|\n| ) /g, '$1 ') + '</code></pre>';
        	document.getElementById('xml-formatted-expanded').innerHTML = '<pre><code class=\'xml-view-div\'>' + jush
        	.highlight('xml', document.getElementById('xml').value)
        	.replace(/\t/g, '')
        	.replace(/(^|\n| ) /g, '$1 ') + '</code></pre>';
        	//.replace(new RegExp('xmlns:','g'), '&#13;&#10;xmlns:')        	
        });
    }
    
    function validateProfileForm() {
        $('.user-profile-password').hide();
        $('.error_nonequal').hide();
        $('.error_missing').hide();
        $('.profile-select-orgs').hide();
        $('.user-profile-choose_org_drpdwn').click(function() {
        	if ($('.profile-select-orgs').is(":visible")) {
        		$('.profile-select-orgs').hide();
	        } else {
				$('.profile-select-orgs').show();
			}
        });
        $('.user-profile-update-password').click(function() {
        	if ($('.user-profile-password').is(":visible")) {
        		$('.user-profile-password').hide();
        	} else {
        		$('.user-profile-password').show();        		
        	}
        });
  	  $('.metis-profile-form').submit(function(event) {
//  		  var template = $('.metis-profile-form').html();
//  		  var data = {error_nonequal_new_confirm_pwd: "Error: a new password and the confirmed password are not the same"};
//  		  var html = Mustache.render(template, data);
//  		  $('.metis-profile-form').html(html);
  		  var valid = true;
  		  if ($('#password_new').val() != null && $('#password_new').val() != "" && $('#password_new').val() != ($('#password_new2').val())) {
  			  $('.error_nonequal').show(); 
  			  valid = false;
  		  }
  		  if (($('#password').val() == null || $('#password').val() == "") && ($('#password_new').val() != null && $('#password_new').val() != "")) {
  			  $('.error_missing').show(); 
  			  valid = false;
  		  }
  		  if (!valid) {
  			  event.preventDefault();  			  
  		  }
  	  });
    }
    
	function pageInit() {     
//    log('typeof pageName ' + (typeof pageName));
//      
//	  log('in page init: pageName = ' + (typeof pageName != 'undefined') ? pageName : 'not defined' );
	  
      $(window).on('scroll', function() {
        log('close open menus here...')
      });
      
      require(['smartmenus'], function() {
          require(['smartmenus_keyboard'], function() {
      	    log('loaded menus');
            $('.nav_primary>ul').smartmenus({
                mainMenuSubOffsetX: -1,
                mainMenuSubOffsetY: 4,
                subMenusSubOffsetX: 6,
                subMenusSubOffsetY: -6,
                subMenusMaxWidth: null,
                subMenusMinWidth: null
              });
              $('#settings-menu').smartmenus({
                mainMenuSubOffsetX: -62,
                mainMenuSubOffsetY: 4,
                subMenusSubOffsetX: 0,
                subMenusSubOffsetY: -6,
                subMenusMaxWidth: null,
                subMenusMinWidth: null
              });
          });
      });
      
      
      require(['jqDropdown'], function() {
        bindTableCellClick();
      });

      require(['eu_tooltip'], function(euTooltip){
        euTooltip.configure();
      });
        
      //require(['util_ellipsis'], function(EllipsisUtil){
      //  var ellipsis = EllipsisUtil.create(  '.eu-tooltip-anchor' );
      //});
      
      expandCollapseMappingCard();
      
      validateProfileForm();
      
      if(pageName && pageName == 'itemCard'){
        applyXmlBeautify();    	  
      }
      
    }

    // jQuery plugin to select/move items from list A to B.
    (function($) {
        //Moves selected item(s) from sourceList to destinationList
        $.fn.moveToList = function(sourceList, destinationList) {
            var opts = $(sourceList + ' option:selected');
            if (opts.length == 0) {
                console.log("Nothing Selected");
            }

            $(destinationList).append($(opts).clone());
        };

        //Moves all items from sourceList to destinationList
        $.fn.moveAllToList = function(sourceList, destinationList) {
            var opts = $(sourceList + ' option');
            if (opts.length == 0) {
                console.log("Nothing Selected");
            }

            $(destinationList).append($(opts).clone());
        };

        //Moves selected item(s) from sourceList to destinationList and deleting the
        // selected item(s) from the source list
        $.fn.moveToListAndDelete = function(sourceList, destinationList) {
            var opts = $(sourceList + ' option:selected');
            if (opts.length == 0) {
                console.log("Nothing Selected");
            }

            $(opts).remove();
            $(destinationList).append($(opts).clone());
        };

        //Moves all items from sourceList to destinationList and deleting
        // all items from the source list
        $.fn.moveAllToListAndDelete = function(sourceList, destinationList) {
            var opts = $(sourceList + ' option');
            if (opts.length == 0) {
                console.log("Nothing Selected");
            }

            $(opts).remove();
            $(destinationList).append($(opts).clone());
        };

        //Removes selected item(s) from list
        $.fn.removeSelected = function(list) {
            var opts = $(list + ' option:selected');
            if (opts.length == 0) {
                console.log("Nothing to remove");
            }

            $(opts).remove();
        };

        //Moves selected item(s) up or down in a list
        $.fn.moveUpDown = function(list, btnUp, btnDown) {
            var opts = $(list + ' option:selected');
            if (opts.length == 0) {
                console.log("Nothing Selected");
            }

            if (btnUp) {
                opts.first().prev().before(opts);
            } else if (btnDown) {
                opts.last().next().after(opts);
            }
        };
    })($);

    // Using jQuery plugin to implement organization's selection in Metis.
    $('#btnAvenger').click(function(e) {
        $('select').moveToList('#StaffList', '#PresenterList');
        e.preventDefault();
    });

    $('#btnRemoveAvenger').click(function(e) {
        $('select').removeSelected('#PresenterList');
        e.preventDefault();
    });

    $('#btnAvengerUp').click(function(e) {
        $('select').moveUpDown('#PresenterList', true, false);
        e.preventDefault();
    });

    $('#btnAvengerDown').click(function(e) {
        $('select').moveUpDown('#PresenterList', false, true);
        e.preventDefault();
    });

    $('#btnShield').click(function(e) {
        $('select').moveToList('#StaffList', '#ContactList');
        e.preventDefault();
    });

    $('#btnRemoveShield').click(function(e) {
        $('select').removeSelected('#ContactList');
        e.preventDefault();
    });

    $('#btnShieldUp').click(function(e) {
        $('select').moveUpDown('#ContactList', true, false);
        e.preventDefault();
    });

    $('#btnShieldDown').click(function(e) {
        $('select').moveUpDown('#ContactList', false, true);
        e.preventDefault();
    });

    $('#btnJusticeLeague').click(function(e) {
        $('select').moveToList('#StaffList', '#FacilitatorList');
        e.preventDefault();
    });

    $('#btnRemoveJusticeLeague').click(function(e) {
        $('select').removeSelected('#FacilitatorList');
        e.preventDefault();
    });

    $('#btnJusticeLeagueUp').click(function(e) {
        $('select').moveUpDown('#FacilitatorList', true, false);
        e.preventDefault();
    });

    $('#btnJusticeLeagueDown').click(function(e) {
        $('select').moveUpDown('#FacilitatorList', false, true);
        e.preventDefault();
    });

    $('#btnRight').click(function(e) {
        $('select').moveToListAndDelete('#lstBox1', '#lstBox2');
        updateOrgList();
        e.preventDefault();
    });

    $('#btnAllRight').click(function(e) {
        $('select').moveAllToListAndDelete('#lstBox1', '#lstBox2');
        updateOrgList();
        e.preventDefault();
    });

    $('#btnLeft').click(function(e) {
        $('select').moveToListAndDelete('#lstBox2', '#lstBox1');
        updateOrgList();
        e.preventDefault();
    });

    $('#btnAllLeft').click(function(e) {
        $('select').moveAllToListAndDelete('#lstBox2', '#lstBox1');
        updateOrgList();
        e.preventDefault();
    });
    // END OF ORGANIZATION'S SELECTION BLOCK CODE.

    function updateOrgList() {
    	$('.org-list').empty();
    	$("#lstBox2 option").each(function() {
    		$('.org-list').append($(this).text());
    	});
    }
    
    function selectView() {
		
	}
	
	return {
		pageInit: function() {
			pageInit();
		}
	}    
});

