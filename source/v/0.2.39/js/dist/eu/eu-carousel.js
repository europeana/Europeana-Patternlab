define(["jquery","jqScrollto","touch_move","touch_swipe","util_resize"],function(a){var b=function(a){console.log("carousel: "+a)},c=function(a,b){for(item in a)b[item]=a[item];return b},d=function(d,e,f){var g,h,i,j,k,l,m,n,o=null,p=null,q=null,r=null,s="left",t=!1,d=a(d),e=e,u=0,v=1,w=e.getDataCount(),x=100,y=400,z=d.find(".js-carousel-item:first"),A=z.width(),B=!1,C=!1,D={};p||d.addClass("h");var E=function(){var e={dynamic:!1,svg:!1,minSpacingPx:15},g=c(f,e);D={arrowClasses:{container:"js-carousel-arrows",back:"left",fwd:"right",content:{back:g.svg?'<svg class="icon icon-previous"><use xlink:href="#icon-previous"/></svg>':"&lt;",fwd:g.svg?'<svg class="icon icon-next"><use xlink:href="#icon-next"/></svg>':"&gt;",up:g.svg?'<svg class="icon icon-caret-up"><use xlink:href="#icon-caret-up"/></svg>':"^",down:g.svg?'<svg class="icon icon-caret-down"><use xlink:href="#icon-caret-down"/></svg>':"^"}},itemClass:"js-carousel-item",itemDivClass:"mlt-img-div height-to-width",itemInnerClass:"inner",itemLinkClass:"link",titleClass:"js-carousel-title"},o="undefined"!=typeof g.bpVertical,q=g.bpVertical,n=g.alwaysAfterLoad,o?(G(),b("carousel will be vertical ("+p+") on breakpoint "+q+" (px)")):p=!1,s=p?"top":"left",k=g.loadUrl,x=g.total_available?g.total_available:x,j=g.minSpacingPx,l=j,i=d.find("ul"),N();var h=Math.min(-100,0-A/2);d.on("movestart",function(b){if(m)return void b.preventDefault();var c=a(b.target);"a"==c[0].nodeName.toLowerCase()&&c.addClass("disabled");var d=b.distX>b.distY&&b.distX<-b.distY||b.distX<b.distY&&b.distX>-b.distY;if(p){if(!d)return void b.preventDefault()}else if(d)return void b.preventDefault()}).on("move",function(a){C=!0,p?(a.distY<0&&(i.css("top",a.distY+"px"),a.distY<h&&(B||v+u+u>w&&(B=!0,M()))),a.distY>0&&i.css("top",a.distY+"px")):(i.css("top","0px"),a.distX<0&&(i.css("left",a.distX+"px"),a.distX<h&&(B||v+u+u>w&&(B=!0,M()))),a.distX>0&&i.css("left",a.distX+"px"))}).on("moveend",function(b){var c=a(b.target);if("a"==c[0].nodeName.toLowerCase()&&setTimeout(function(){c.removeClass("disabled")},1e3),b.stopPropagation(),p){var e=c.height(),f=Math.round(b.distY/(e+l/2)),g=v+-1*f;g==v&&Math.abs(b.distY)>=e/2.5&&(g+=b.distY>0?-1:1),d.scrollTo(d.scrollTop()-parseInt(i.css("top")),0),i.css("top",""),B=!1,C=!1,v=Math.max(1,g),v=Math.min(v,x),H()}else{var f=Math.round(b.distX/(A+l/2)),g=v+-1*f;g==v&&Math.abs(b.distX)>=A/2.5&&(g+=b.distX>0?-1:1),d.scrollTo(d.scrollLeft()-parseInt(i.css("left")),0),i.css("left",""),B=!1,C=!1,v=Math.max(1,g),v=Math.min(v,x),H()}}),"undefined"!=typeof a(window).europeanaResize&&a(window).europeanaResize(function(){var a=y;y=0,H(),y=a}),H()},F=function(){t=!0,i.css(s,"0");var a=i.find("."+D.itemClass+":nth-child("+v+")");d.scrollTo(a,1==u?0:y,{onAfter:function(){var a=function(){t=!1,I()};1==u?(i.find("."+D.itemClass+":first").css("margin-"+s),i.css(s,l+"px")):i.css(s,"0"),a()}})},G=function(){var c=a(document).width()+12;o&&q>c&&(null==p||1==p)?(p=!1,d.removeClass("v"),d.prev(".js-carousel-arrows").removeClass("v"),d.prev(".js-carousel-arrows").addClass("h"),h&&(h.html(D.arrowClasses.content.fwd),g.html(D.arrowClasses.content.back)),i&&(i.css("height","100%"),i.css("width","100%")),s="left",d.find("."+D.itemClass).css("margin-top","0px"),d.find("."+D.itemClass).css("margin-left","0px"),b("switched to horizontal bp("+q+"), w("+c+")"),r&&r(p)):o&&c>=q&&(null==p||0==p)&&(p=!0,d.addClass("v"),d.prev(".js-carousel-arrows").removeClass("h"),d.prev(".js-carousel-arrows").addClass("v"),h&&(h.html(D.arrowClasses.content.down),g.html(D.arrowClasses.content.up)),i&&(i.css("height","100%"),i.css("width","100%")),s="top",d.find("."+D.itemClass).css("margin-top","0px"),d.find("."+D.itemClass).css("margin-left","0px"),b("switched to vertical bp("+q+"), w("+c+")"),r&&r(p))},H=function(){if(C)return void b("!resize (swiping)");G();var a=p?d.height():d.width(),c=null,e=i.find("."+D.itemClass).first(),c=p?e.outerHeight():e.outerWidth();if(d.removeAttr("style"),g.css("display","block"),h.css("display","block"),m=a>=x*c+(x-1)*j)return g.css("display","none"),h.css("display","none"),d.css("display","table"),d.css("width","auto"),d.css("margin","auto"),i.css(p?"height":"width","auto"),i.find("."+D.itemClass).css("margin-left",j+"px"),i.find("."+D.itemClass+":first").css("margin-left","0px"),l=j,void(u=x);var f=parseInt(a/(c+j));f=Math.min(f,x),l=j,1==f?(l=(a-c)/2,l+=2):l=(a-f*c)/(f-1),l=parseInt(l),u=f,i.find("."+D.itemClass).css("margin-"+s,parseInt(l)+"px"),1!=f&&i.find("."+D.itemClass+":first").css("margin-"+s,"0px"),i.css(p?"height":"width",a+w*(c+l)),F()},I=function(){g&&(1==v?g.addClass("arrow-hidden"):g.removeClass("arrow-hidden")),h&&(x>v-1+u?h.removeClass("arrow-hidden"):h.addClass("arrow-hidden"))},J=function(){t=!0;var a=1>v-u?1:v-u;b("prev index = "+a),v=a,a=i.find("."+D.itemClass+":nth-child("+a+")"),i.css(s,"0"),d.scrollTo(a,1==u?0:1e3,{onAfter:function(){var a=function(){t=!1,I()};1==u?(i.find("."+D.itemClass+":first").css("margin-"+s),i.css(s,l+"px")):i.css(s,"0"),a()}})},K=function(){var a=v+u,c=i.find("."+D.itemClass+":nth-child("+a+")");return 0==c.length?(b("cannot scroll forward (return)"),d.removeClass("loading"),void I()):(v=a,i.css(s,"0"),t=!0,void d.scrollTo(c,1==u?0:1e3,{onAfter:function(){var a=function(){d.removeClass("loading"),t=!1,I()};1==u?i.css(s,l+"px"):i.css(s,"0"),a()}}))},L=function(){w>v+u+u?K():M(!0)},M=function(a,c){return k?d.hasClass("loading")?void b("already loading (return)"):w==x?(b("no more to load (scroll and return)"),void(C||K())):(d.addClass("loading ("+u+")"),void e.append(function(f){w=e.getDataCount(),f.length?(H(),a?K():d.removeClass("loading"),w==x&&b("loaded all")):0==f.length?b("loaded all (added 0)"):(b("load error: only "+w+" available"),x=w,d.removeClass("loading"),C||K()),c&&c(f),n&&n(f)},u)):void b("no load url (return)")},N=function(){g=a('<a class="'+D.arrowClasses.back+'">'+(p?D.arrowClasses.content.up:D.arrowClasses.content.back)+"</a>"),h=a('<a class="'+D.arrowClasses.fwd+'">'+(p?D.arrowClasses.content.down:D.arrowClasses.content.fwd)+"</a>"),d.before('<div class="'+D.arrowClasses.container+(p?" v":" h")+'"></div>'),d.prev("."+D.arrowClasses.container).append(g),d.prev("."+D.arrowClasses.container).append(h),w=i.find("."+D.itemClass).length,g.click(function(a){return t||J(),a.stopPropagation(),!1}),h.click(function(a){return t||L(),a.stopPropagation(),!1})};return E(),{resize:function(){H()},isVertical:function(){return p},vChange:function(a){r=a},inView:function(){return fnInView()},loadMore:function(a,b){M(a,b)},goLeft:function(){console.error("deprecated function call in eu-carousel: goLeft"),J()},goRight:function(){console.error("deprecated function call in eu-carousel: goRight"),L()}}};return{create:function(a,b,c){return d(a,b,c)}}});