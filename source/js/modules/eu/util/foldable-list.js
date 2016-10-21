define(['jquery'], function($){

  var classes = {
    showClass :         'filter-force-show',
    showChildrenClass : 'filter-force-show-children',
    hideClass :         'filter-force-hide'
  }

  $('.eu-foldable-title').on('click', function(){
    $this = $(this);

    // reset any filter
    $li = $this.closest('li');
    var openedByFilter = $li.hasClass(classes.showClass) || $li.hasClass(classes.showChildrenClass);
    $li.removeClass(classes.showClass);
    $li.removeClass(classes.showChildrenClass);
    $li.removeClass(classes.hideClass);

    // expand / collapse
    if(!openedByFilter){
      $ul   = $this.next('ul');
      $ul.toggleClass('is-hidden');
      $this.toggleClass('opened');
    }
  });

  return {
    classes: classes
  }
});