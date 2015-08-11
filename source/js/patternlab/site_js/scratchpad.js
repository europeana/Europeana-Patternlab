


$(".js-attribution-widget .button-bar").on("click", "button-bar__button", function (e) {

  var attribution = $(this).data("e-licence-content");
   alert("Hi!");
  $(".js-attribution-widget input-attr").addClass("is-active").value(attribution).focus();



  e.preventDefault();



});