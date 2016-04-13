define(["jquery","ga","purl"],function(a,b){function c(a){console.log(a)}var d=a.url(),e=a(".search-results"),f=[],g=a(".icon-view-grid").closest("a"),h=a(".icon-view-list").closest("a"),i=function(){var b=e.find(".result-items h2:not(.js-ellipsis)"),c=[];b.css("overflow-y","auto"),b.each(function(){a(this).find("a")[0].offsetHeight>a(this).height()&&(a(this).addClass("js-ellipsis"),c.push(a(this)))}),b.css("overflow-y","hidden"),c.length>0&&require(["util_ellipsis"],function(b){for(var d=b.create(a(c)),e=0;e<d.length;e++)f.push(d[e])});var d=e.find(".search-list-item.missing-image .item-image .missing-image-text:not(.js-ellipsis)");d.size()>0&&(require(["util_ellipsis"],function(a){for(var b=a.create(d),c=0;c<b.length;c++)f.push(b[c])}),d.addClass("js-ellipsis"))},j=function(b,e,f){var g={};g[b]=e,e||delete g[b];var h=d.param();h[b]=e,e||delete h[b];var i=a.param(h);c("set state (replace): "+JSON.stringify(g)),f?window.history.replaceState(g,"","?"+i):window.history.pushState(g,"","?"+i)};window.onpopstate=function(a){if(a.state)c("state present, view = "+a.state.view),"grid"==a.state.view?p(!0):"list"==a.state.view&&q(!0),"undefined"!=typeof a.state.results&&k(a.state.results);else{if(-1!=navigator.userAgent.indexOf("Safari")&&-1==navigator.userAgent.indexOf("Chrome"))return;q()}};var k=function(b){var c=a(".result-items>li"),d=c.size();if(b>d){var e=a(".result-items>li").slice(0,b-d);e.each(function(b,c){a(c).parent().append(a(c).clone())}),a(".result-items>li").size()<b&&k(b)}else if(d>b){var f=a(".result-items>li").slice(b,d);f.remove()}l(b)},l=function(b){if(a(".result-actions a.dropdown-trigger").size()>0){var c=a(".result-actions a.dropdown-trigger").text(),d=c.match(/\d+/)[0];b=b?b:d,c=c.replace(d,""),a(".result-actions a.dropdown-trigger").html(c+'<span class="active">'+b+"</span>")}},m=function(){return"undefined"==typeof Storage?"list":localStorage.getItem("eu_portal_results_view")},n=function(a){"undefined"!=typeof Storage&&localStorage.setItem("eu_portal_results_view",a)},o=function(b){var c=function(c){var d=a.url(c.attr("href")),e=d.param("view");e!=b&&("undefined"==typeof e?"grid"==b&&c.attr("href",c.attr("href")+"&view="+b):c.attr("href",c.attr("href").replace("&view="+e,"&view="+b)))};a("#results_menu .dropdown-menu a, .results-list .pagination a, .searchbar a, .refine a").each(function(){c(a(this))})},p=function(b){a("body").addClass("display-grid"),g.addClass("is-active"),h.removeClass("is-active"),b&&n("grid");for(var c=0;c<f.length;c++)f[c].enable();o("grid"),i()},q=function(b){a("body").removeClass("display-grid"),h.addClass("is-active"),g.removeClass("is-active"),b&&n("list"),o("list");for(var c=0;c<f.length;c++)f[c].disable()},r=function(){g.on("click",function(a){a.preventDefault(),j("view","grid"),p(!0)}),h.on("click",function(a){a.preventDefault(),j("view","list"),q(!0)});var a=d.param("view");a?"grid"==a?p(!0):q(!0):"grid"==m()?(j("view","grid",!0),p()):q()},s=function(){a(".item-origin .external").on("click",function(){var d=a(this).attr("href");b("send",{hitType:"event",eventCategory:"Redirect",eventAction:d,eventLabel:"CTR List"}),c("GA: Redirect, Action = "+d)})},t=function(){if(r(),s(),"undefined"!=typeof Storage){var b=a(".breadcrumbs").data("store-channel-label"),c=a(".breadcrumbs").data("store-channel-name"),d=a(".breadcrumbs").data("store-channel-url");sessionStorage.eu_portal_channel_label=b,sessionStorage.eu_portal_channel_name=c,sessionStorage.eu_portal_channel_url=d}};return{initPage:function(){t()}}});