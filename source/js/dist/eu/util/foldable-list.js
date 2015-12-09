define(['jquery'], function($){
    $('.eu-foldable-title').on('click', function(){
        $this = $(this);
        $ul   = $this.next('ul');
        $ul.toggleClass('is-hidden');
        $this.toggleClass('opened');
    });
});