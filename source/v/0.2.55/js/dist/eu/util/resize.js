define(["jquery"],function(a){!function(a,b){var c=function(a,b,c){var d;return function(){function e(){c||a.apply(f,g),d=null}var f=this,g=arguments;d?clearTimeout(d):c&&a.apply(f,g),d=setTimeout(e,b||100)}};jQuery.fn[b]=function(a){return a?this.bind("resize",c(a)):this.trigger(b)}}(a,"europeanaResize")});