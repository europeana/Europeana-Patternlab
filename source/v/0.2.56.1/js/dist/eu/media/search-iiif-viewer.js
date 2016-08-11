define([],function(){"use strict";function a(a){console.log(a)}function b(b,d,e){l(e),b.indexOf("info.json")==b.length-"info.json".length?(m(1),h(1,b),$("#iiif").removeClass("loading")):$.getJSON(b,function(a){$.each(a.sequences[0].canvases,function(a,b){f[b.label]=b}),m(Object.keys(f).length),h(),$("#iiif").removeClass("loading"),g[Object.keys(g)[0]].addTo(c),$(".media-viewer").trigger("object-media-open",{hide_thumb:!0}),j()}).fail(function(b){a("error loading manifest: "+JSON.stringify(b,null,4)),$(".media-viewer").trigger({type:"remove-playability",$thumb:d,player:"iiif"})})}$("head").append('<link rel="stylesheet" href="'+require.toUrl("../../css/map/application-map.css")+'" type="text/css"/>'),$("head").append('<link rel="stylesheet" href="'+require.toUrl("../../lib/iiif/iiif.css")+'" type="text/css"/>');var c,d,e=0,f={},g={},h=function(a,b){if(b){var d=L.tileLayer.iiif(b);return g.single=d,d.addTo(c),void j()}for(var h=5,i=0,k=a?a:e,l=Math.max(k-parseInt(h/2),0),m=!1;!m;)if(i==h)m=!0;else if(l>=Object.keys(f).length)m=!0;else{var n=Object.keys(f)[l],o=f[n];if(!g[o.label]){var d=L.tileLayer.iiif(o.images[0].resource.service["@id"]+"/info.json");g[o.label]=d,i+=1}l+=1}},i=function(a){for(var b in g)c.hasLayer(g[b])&&g[b]!=a&&c.removeLayer(g[b]);c.addLayer(a)},j=function(){$("#iiif-ctrl .title").html(Object.keys(f)[e]),$("#iiif-ctrl .jump-to-img").val(e+1),$("#iiif-ctrl .first").attr("disabled",0==e),$("#iiif-ctrl .prev").attr("disabled",0==e),$("#iiif-ctrl .next").attr("disabled",e==d-1),$("#iiif-ctrl .last").attr("disabled",e==d-1),$("#iiif-ctrl .jump-to-img").attr("disabled",1==d)},k=function(a,b){if(!a.attr("disabled")){var c=Object.keys(f)[b],d=g[c];d||($("#iiif").addClass("loading"),h(b),d=g[c],$("#iiif").removeClass("loading")),i(d),e=b,j()}},l=function(a){$("#iiif").addClass("loading"),c=L.map("iiif",{center:[0,0],crs:L.CRS.Simple,zoom:0,maxZoom:10,zoomsliderControl:!0}),a&&L.control.fullscreen({position:"topright",forceSeparateButton:!0,forcePseudoFullscreen:!1}).addTo(c),c.on("enterFullscreen",function(){$(".leaflet-container").css("background-color","#000")}),c.on("exitFullscreen",function(){$(".leaflet-container").removeAttr("style")}),$("#iiif-ctrl .first").off("click").on("click",function(a){a.preventDefault(),k($(this),0)}),$("#iiif-ctrl .prev").off("click").on("click",function(a){a.preventDefault(),k($(this),e-1)}),$("#iiif-ctrl .next").off("click").on("click",function(a){a.preventDefault(),k($(this),e+1)}),$("#iiif-ctrl .last").off("click").on("click",function(a){a.preventDefault(),k($(this),d-1)}),$(c._container).off("keydown").on("keydown",function(a){var b=window.event?a.keyCode:a.which;a=a||window.event,(a.shiftKey||a.ctrlKey)&&(a.stopPropagation(),a.preventDefault(),37==b&&$("#iiif-ctrl .prev").click(),38==b&&$("#iiif-ctrl .first").click(),39==b&&$("#iiif-ctrl .next").click(),40==b&&$("#iiif-ctrl .last").click())}),$("#iiif-ctrl .jump-to-img").off("keydown").on("keydown",function(a){var b=window.event?a.keyCode:a.which;if(13==b){var c=parseInt($(this).val());!isNaN(c)&&c>0&&d+1>c?k($(this),c-1):$(this).val(e+1)}})},m=function(a){d=a,$("#iiif-ctrl .total-images").html("/ "+d)};return{init:function(a,c,d){require(["leaflet_iiif"],function(){b(a,c,d)})},hide:function(){c.remove(),e=0,d=0,f={},g={}}}});