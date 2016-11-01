define(['jquery', 'smartmenus'], function ($) {
	
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
      
      if(pageName && pageName == 'itemCard'){
        applyXmlBeautify();    	  
      }
      
    }
    
	function selectView() {
		
	}
	
	return {
		pageInit: function() {
			pageInit();
		}
	}    
});

