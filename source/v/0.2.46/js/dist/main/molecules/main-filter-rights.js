require.config({paths:{featureDetect:"../../global/feature-detect",jquery:"../../lib/jquery",global:"../../eu/global",jqDropdown:"../../lib/jquery.dropdown",menus:"../../global/menus",util_scrollEvents:"../../eu/util/scrollEvents"},shim:{featureDetect:["jquery"],jqDropdown:["jquery"],menus:["jquery"]}}),require(["jquery","global"],function(a){a(document).ready(function(){a(".filter-list a").on("click",function(b){b.preventDefault();var c=a(b.target);"DIV"==c[0].nodeName&&(c=c.closest("a")),c.toggleClass("is-checked"),c.closest(".filter-list").find(".filter-item.is-checked").size()>0&&c.closest(".subfilters").size()>0&&c.closest(".subfilters").prev(".filter-item").addClass("is-checked"),!c.hasClass("is-checked")&&c.next(".subfilters").size()>0&&c.next(".subfilters").find(".filter-item").removeClass("is-checked")})})});