define(["jquery","util_scrollEvents","ga","","util_foldable","blacklight","media_controller"],function(a,b,c){function d(a){console.log("search-object: "+a)}function e(b){require(["eu_hierarchy","jsTree"],function(c){var d=JSON.parse(a(".hierarchy-objects").text()),e=require.toUrl("../../lib/jstree/css/style.css"),f=require.toUrl("../../lib/jstree/css/style-overrides.css");a("head").append('<link rel="stylesheet" href="'+e+'" type="text/css"/>'),a("head").append('<link rel="stylesheet" href="'+f+'" type="text/css"/>');var g='<div class="hierarchy-top-panel uninitialised">  <div class="hierarchy-prev"><a>'+b.label_up+'</a><span class="count"></span></div>  <div class="hierarchy-title"></div></div><div class="hierarchy-container uninitialised">  <div id="hierarchy"></div></div><div class="hierarchy-bottom-panel">  <div class="hierarchy-next"><a>'+b.label_down+'</a><span class="count"></span></div></div>';a(".hierarchy-objects").html(g);var h=c.create(a("#hierarchy"),16,a(".hierarchy-objects"),window.location.href.split("/record")[0]+"/record",window.location.href.split("/record")[0]+"/record");a(".hierarchy-objects").removeAttr("style"),h.init(d,!0)})}function f(b){var c=function(b,c,e){d("initLeaflet:\n	"+JSON.stringify(b)+"\n	"+JSON.stringify(c));var f="map",g="map-info",h=a("#js-map-place-name").text();require(["leaflet"],function(){var d="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";a("#"+f).after('<div id="'+g+'"></div>');var i='<a href="http://openstreetmap.org">OpenStreetMap</a> contributors',j=L.map(f,{center:new L.LatLng(c[0],b[0]),zoomControl:!0,zoomsliderControl:!1,zoom:8}),k=require.toUrl("").split("/");k.pop(),k.pop(),k.pop(),L.Icon.Default.imagePath=k.join("/")+"/css/map/images",j.addLayer(new L.TileLayer(d,{minZoom:4,maxZoom:18,attribution:i,type:"osm"})),j.invalidateSize();for(var l=[],m=0;m<Math.min(c.length,b.length);m++)L.marker([c[m],b[m]]).addTo(j),l.push(c[m]+"&deg; "+(c[m]>0?e.n:e.s)+", "+b[m]+"&deg; "+(b[m]>0?e.e:e.w));h=h?h.toUpperCase()+" ":"",a("#"+g).html(h+(l.length?" "+l.join(", "):"")),a("head").append('<link rel="stylesheet" href="'+require.toUrl("../../css/map/application-map.css")+'" type="text/css"/>')})},e=(b.latitude+"").split(/,*\s+/g),f=(b.longitude+"").split(/,*\s+/g);if(e&&f){for(var g=0;g<e.length;g++)e[g]=e[g].replace(/,/g,".").indexOf(".")>-1?e[g]:e[g]+".00";for(var g=0;g<f.length;g++)f[g]+f[g].replace(/,/g,".").indexOf(".")>-1?f[g]:f[g]+".00";for(var h=[],i=[],g=0;g<Math.min(e.length,f.length);g++)e[g]&&f[g]&&[e[g]+"",f[g]+""].join(",").match(/^\s*-?\d+\.\d+\,\s?-?\d+\.\d+\s*$/)?(h.push(f[g]),i.push(e[g])):d("Map data error: invalid coordinate pair:\n	"+h[g]+"\n	"+i[g]);h.length&&i.length?c(h,i,b.labels):d("Map data missing")}}function g(){a(".attribution-fmt").on("click",function(b){b.preventDefault();var c=a(this),d=c.data("e-licence-content");a(".input-attr").val(c.hasClass("html")?a("<textarea>").html(d).text():d),a(".attribution-fmt").removeClass("is-active"),c.addClass("is-active")})}function h(){a(".download-button").on("click",function(b){a(this).parent().hasClass("is-expanded")&&b.preventDefault(),a(this).parent().toggleClass("is-expanded")})}function i(){r(),p(),g(),h(),k({target:a(".single-item-thumb a")[0]});var c="undefined"==typeof Storage?null:localStorage.getItem("eu_portal_results_count");c&&a(".search-multiterm").append('<input type="hidden" name="per_page" value="'+c+'" />'),a(window).bind("showMLT",function(a,b){m(b)}),a(window).bind("showMediaThumbs",function(a,b){l(b)}),a(window).bind("showMap",function(a,b){f(b)}),a(window).bind("showHierarchy",function(a,b){e(b)}),a(window).bind("updateTechData",function(a,b){k(b)}),a(".media-viewer").trigger("media_init"),a('.single-item-thumb [data-type="oembed"]').trigger("click"),a('.multi-item .js-carousel-item:first-child a[data-type="oembed"]').first().trigger("click"),a('.single-item-thumb [data-type="iiif"]').trigger("click"),a('.multi-item .js-carousel-item:first-child a[data-type="iiif"]').first().trigger("click"),b.fireAllVisible()}c=window.fixGA(c);var j=function(b,c){var d=jQuery.Deferred();return require(["eu_carousel","eu_carousel_appender"],function(e,f){var g=f.create({cmp:b.find("ul"),loadUrl:c.loadUrl,template:c.template,total_available:c.total_available,doAfter:function(b){var c=[],d=a(".colour-navigation.js-template");a.each(b,function(b,e){var f=d.before(d.clone());c.push(f),f.removeClass("js-template"),f.removeAttr("style"),f.attr("data-thumbnail",e.thumbnail);var g=e.technical_metadata;g&&g.colours&&g.colours.present&&a.each(g.colours.items,function(a,b){var c=f.find("li.js-template"),d=c.clone();c.before(d),d.removeAttr("style"),d.removeClass("js-template"),d.find("a").css("background-color",b.hex),d.find("a").attr("href",b.url)})});for(var e=0;e<c.length;e++)d.before(c[e])}});d.resolve(e.create(b,g,c))}),d.promise()},k=function(b){var c=a(b.target),d={href:"",meta:[],fmt:""},e=c.data("thumbnail");a('.colour-navigation[data-thumbnail="'+e+'"]');a(".colour-navigation").not("[data-thumbnail='"+e+"']").addClass("js-hidden"),a('.colour-navigation[data-thumbnail="'+e+'"]').removeClass("js-hidden");var f=function(b,c,d){a(".file-info .file-title").attr("href",b),a(".file-info .file-meta li").remove(),a(".file-detail .file-type").html(d.indexOf("/")>-1?d.split("/")[1]:d&&d.length?d:"?"),a.each(c,function(b,c){a(".file-info .file-meta").append("<li>"+c+"</li>")}),b||a(".object-downloads").removeClass("is-expanded")},g=function(b,d){if(d=a(d),0==d.length)return!1;for(var e=!0,f=!1,g="",h=0;h<b.length;h++){var i=c.data(b[h].attr)||b[h].def;i?(g+=i+" ",b[h].label||(f=!0)):e=!1}return e?null!=b[0].toDataAttr?d.data(b[0].toDataAttr,g):(d.next(".val").empty(),d.next(".val").text(g.trim()),d.closest("li").removeClass("is-disabled")):null==b[0].toDataAttr&&(d.next(".val").empty(),d.closest("li").addClass("is-disabled")),f},h=a(".object-techdata"),i=g([{attr:"file-size"},{attr:"file-unit"}],".tech-meta-filesize")|g([{attr:"runtime"},{attr:"runtime-unit",label:!0}],".tech-meta-runtime")|g([{attr:"format"}],".object-techdata .tech-meta-format")|g([{attr:"codec"}],".tech-meta-codec")|g([{attr:"width"},{attr:"use_def",def:"x",label:!0},{attr:"height"},{attr:"size-unit",label:!0}],".tech-meta-dimensions")|g([{attr:"attribution-plain",toDataAttr:"e-licence-content"}],".attribution-fmt.plain")|g([{attr:"attribution-html",toDataAttr:"e-licence-content"}],".attribution-fmt.html");if(i?(h.show(),a(".attribution-fmt.plain").trigger("click")):(h.removeClass("is-expanded"),h.hide()),c.data("download-uri")){a(".object-downloads .download-button").removeClass("js-showhide").removeClass("is-disabled"),d.href=c.data("download-uri"),d.fmt=c.data("format"),d.meta=[];for(var j=a(".object-techdata-list").find("li:not(.is-disabled)"),k=0;k<Math.min(2,j.length);k++)d.meta.push(a(j[k]).html())}else a(".object-downloads .download-button").addClass("js-showhide").addClass("is-disabled"),d.href="",d.meta=[],d.fmt="";f(d.href,d.meta,d.fmt),a(".download-button").attr("href",d.href)},l=function(b){if(a(".object-media-nav li").length>1){var c=j(a(".media-thumbs"),b);c.done(function(b){a(".media-viewer").on("object-media-last-image-reached",function(a,c){b.loadMore(!1,c.doAfterLoad)}),a(".media-thumbs").on("click","a",k),k({target:a(".media-thumbs a:first")[0]})})}else d("no media carousel needed")},m=function(b){var c=function(b){require(["util_ellipsis"],function(c){b?c.create(a(".more-like-this .js-carousel-title").slice(0-b.length)):c.create(a(".more-like-this .js-carousel-title"))})};b.alwaysAfterLoad=function(a){c(a)};var d=j(a(".more-like-this"),b);d.done(function(a){c(),q()})},n=function(){if("undefined"!=typeof Storage){var b=sessionStorage.eu_portal_channel_label,c=sessionStorage.eu_portal_channel_name,e=sessionStorage.eu_portal_channel_url;if("undefined"!=typeof e&&"undefined"!=e){var f=a(".breadcrumbs li.js-channel"),g=f.find("a");g.text(b),g.attr("href",e),f.removeClass("js-channel")}return c&&"undefined"!=c&&a("#main-menu ul a").each(function(b,d){var e=a(d);e.attr("href").indexOf("/channels/"+c)>-1&&e.addClass("is-current")}),{label:b,name:c,url:e,dimension:"dimension1"}}d("no storage")},o=function(){var b=[n()],c=a(".ga-data"),d=[],e={};c.each(function(b,d){var f=a(d).data("ga-metric"),g=[];e[f]||(c.each(function(b,c){if(a(c).data("ga-metric")==f){var d=a(c).text();"dimension5"==f?0==d.indexOf("http")&&g.push(d):g.push(d)}}),g.sort(),e[f]=g.join(","))});for(var f=Object.keys(e),g=0;g<f.length;g++)d.push({dimension:f[g],name:e[f[g]]});return d.concat(b)},p=function(){a(".object-social .social-share a").on("click",function(){var b=a(this).find(".icon").attr("class").replace("icon ","").replace(" icon","").replace("icon-","");c("send",{hitType:"social",socialNetwork:b,socialAction:"share",socialTarget:window.location.href})})},q=function(){a(".mlt .left").add(a(".mlt .right")).on("click",function(){c("send",{hitType:"event",eventCategory:"Browse",eventAction:"Similar items scroll",eventLabel:"Similar items scroll"}),d("GA: Browse")})},r=function(){a(".object-origin a").on("click",function(){var b=a(this).attr("href");c("send",{hitType:"event",eventCategory:"Redirect",eventAction:b,eventLabel:"CTR Findoutmore"}),d("GA: Redirect, Action = "+b)}),a(".media-viewer .external-media").not(".playable").on("click",function(){var b=a(this).attr("href");c("send",{hitType:"event",eventCategory:"Redirect",eventAction:b,eventLabel:"CTR Thumbnail"}),d("GA: Redirect, Action = "+b)}),a(".download-button").on("click",function(){if(!a(this).hasClass("ga-sent")){var b=a(this).attr("href");c("send",{hitType:"event",eventCategory:"Download",eventAction:b,eventLabel:"Media Download"}),a(this).addClass("ga-sent"),d("GA: Download, Action = "+b)}}),a(".media-thumbs, .single-item-thumb").on("click","a.playable",function(){var b=a(this).data("uri"),e=a(this).data("type");c("send",{hitType:"event",eventCategory:"Media View",eventAction:b,eventLabel:"Media "+e}),d("GA: Media View, Action = "+b+", Label = "+e)})};return{initPage:function(){i()},getAnalyticsData:function(){return o()},getPinterestData:function(){var b=[a(".object-overview .object-title").text(),a(".object-overview object-title").text()].join(" "),c=a(".single-item-thumb .external-media.playable").attr("href")||a(".single-item-thumb .external-media img").attr("src")||a(".external-media:first").data("uri");return{media:c,desc:b}}}});