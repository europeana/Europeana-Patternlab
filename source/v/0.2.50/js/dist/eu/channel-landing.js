define(["jquery","util_scrollEvents"],function(a,b){function c(b){var c=a(".tumblr-feed");require(["eu_carousel","eu_carousel_appender"],function(a,d){var e=d.create({cmp:c.find("ul"),loadUrl:b.loadUrl,template:b.template,total_available:b.total_available});jQuery.Deferred().resolve(a.create(c,e,b))})}function d(){a(window).bind("showCarousel",function(a,b){c(b)}),b.fireAllVisible()}return{initPage:function(){d()}}});