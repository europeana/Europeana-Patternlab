Site_DASHBOARD={common:{init:function(){require(["smartmenus"],function(){require(["smartmenus_keyboard"],function(){$(".nav_primary>ul").smartmenus({mainMenuSubOffsetX:-1,mainMenuSubOffsetY:4,subMenusSubOffsetX:6,subMenusSubOffsetY:-6,subMenusMaxWidth:null,subMenusMinWidth:null}),$(".nav_primary>ul").smartmenus("keyboardSetHotkey","123","shiftKey")})})},finalize:function(){}},page_dashboard:{init:function(){require(["handlebars"]),$(".js-showmore").on("click",function(a){var b=$(this),c=$(this).parent();c.find(".js-showmore-panel").toggleClass("is-shortened"),b.text()===b.data("text-swap")?b.text(b.data("text-original")):(b.data("text-original",b.text()),b.text(b.data("text-swap"))),a.preventDefault()})}},page_static:{init:function(){require(["sticky"],function(){if($(window).width()>800){var a=$(".footer").outerHeight(!0)+75;$(".js-sticky").sticky({topSpacing:100,bottomSpacing:a,responsiveWidth:!0,getWidthFrom:".js-getstickywidth"})}}),require(["list"],function(){var a={listClass:"linklist-simple",searchClass:"list-search",valueNames:["list-item"]};new List("linklist",a)})}}},UTIL={fire:function(a,b,c){var d=Site_DASHBOARD;b=void 0===b?"init":b,""!==a&&d[a]&&"function"==typeof d[a][b]&&d[a][b](c)},loadEvents:function(){UTIL.fire("common"),$.each(document.body.className.split(/\s+/),function(a,b){UTIL.fire(b)}),UTIL.fire("common","finalize")}},UTIL.loadEvents();