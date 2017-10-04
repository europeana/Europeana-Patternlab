define(['jquery'], function ($){

  function Card($el){
    var self        = this;
    self.stateIndex = 0;
    self.cardStates = $el.find('.ve-foyer-card-state');
    self.label      = $el.find('.ve-label');
    self.$el        = $el;

    $el.find('.ve-card-nav-left').on('click', function(){
      self.left();
    });
    $el.find('.ve-card-nav-right').on('click', function(){
      self.right();
    });
    this.prepNextShift();
  }

  Card.prototype.updateButton = function(index){
    this.$el.find('.ve-state-button-on').removeClass('ve-state-button-on').addClass('ve-state-button-off');
    this.$el.find('.ve-state-'  + index).removeClass('ve-state-button-off').addClass('ve-state-button-on');
  };

  Card.prototype.prepNextShift = function(){
    var next = this.stateIndex == this.states.length -1 ? 0 : this.stateIndex + 1;
    var prev = this.stateIndex == 0 ? this.states.length -1 : this.stateIndex - 1;

    next = $(this.cardStates.get(next));
    prev = $(this.cardStates.get(prev));

    if(next.hasClass('hide-left')){
      next.removeClass('animating hide-left').addClass('hide-right');
    }
    if(prev.hasClass('hide-right')){
      prev.removeClass('animating hide-right').addClass('hide-left');
    }
  };

  Card.prototype.shiftState = function(shift){

    // hide the current

    var text = $(this.cardStates.get(this.stateIndex));
    text.addClass('animating ' + (shift > 0 ? 'hide-left' : 'hide-right'));

    // show the next

    var newStateIndex = this.stateIndex + shift;
    if(newStateIndex == this.states.length){
      newStateIndex = 0;
    }
    else if(newStateIndex < 0){
      newStateIndex = this.states.length -1;
    }
    this.stateIndex = newStateIndex;
    if(this.stateIndex==0){
      this.label.show();
    }
    else{
      this.label.hide();
    }
    var next = $(this.cardStates.get(this.stateIndex));

    next.removeClass('animating');

    if(shift > 0){
      next.addClass('hide-right').removeClass('hide-left');
      next.addClass('animating');
      next.removeClass('hide-right');
    }
    else{
      next.addClass('hide-left').removeClass('hide-right');
      next.addClass('animating');
      next.removeClass('hide-left');
    }
    this.prepNextShift();
    this.updateButton(this.stateIndex);
  };

  Card.prototype.left = function(){
    this.shiftState(-1);
  };

  Card.prototype.right = function(){
    this.shiftState(1);
  };

  Card.prototype.states = ['title', 'description', 'credits'];

  return Card;
});
