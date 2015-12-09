define(['jquery'], function ($){
    /*
     * function SearchTags($form){ this.$form = $form; this.$input =
     * $form.find('.js-search-input'); this.$tags =
     * $form.find('.js-search-tags'); this.$hidden = $('<select name="q[]"
     * style="position:absolute; left:-1000em;" multiple>').prependTo($form);
     * this.tagId = 1; this.confirmKeys = [13, 44]; this.init(); }
     *
     * SearchTags.prototype = { constructor: SearchTags,
     *
     * add: function(item) {
     *
     * var self = this; // Ignore strings only containg whitespace if
     * (item.toString().match(/^\s*$/)){ console.log('add tag exit'); return; }
     *  // add a tag element and hidden field
     *
     * var disp = $('<div />').text(item).html(); var $tag = $('<li id="search-tag-' + self.tagId + '" class="search-tag">' +
     * disp + '<a data-role="remove"></a></li>');
     *
     * self.$tags.append($tag); $tag.after(' ');
     *
     * self.$hidden.append('<option id="search-val-' + self.tagId + '"
     * selected="selected">' + item + '</option>'); self.tagId += 1; },
     *
     * remove: function($el){ var self = this;
     *
     * var id = $el.parent().attr('id').match(/\d+/); $el.parent().remove();
     * self.$form.find('#search-val-' + id).remove(); },
     *
     * removeLast: function(){ var self = this;
     *
     * if(self.$input.val().length<1){
     * self.$hidden.find('option:last').remove();
     * self.$tags.find('.search-tag:last').remove(); } },
     *
     * init: function(){ var self = this;
     *
     * self.$form.find('.search-tag').remove();
     * self.$form.find('.js-hidden-search-term').each(function(i, ob){
     * self.add($(ob).val()); });
     * self.$form.find('.js-hidden-search-term').remove();
     *  // input focus / disabling
     *
     * self.$form.on('click', '.js-hitarea', $.proxy(function(event) {
     * self.$input.focus(); }, self));
     *
     * self.$form.on('click', '.js-search-tags a', $.proxy(function(event) {
     * self.remove($(event.target)) event.preventDefault(); }, self));
     *  // keyboard shortcuts
     *
     * self.$form.on('keydown', 'input', function(event) {
     * //console.log(event.which + ' ' + String.fromCharCode(event.which) )
     * switch (event.which) { case 8: self.removeLast();
     * //console.log('backspace'); break; case 46: self.removeLast();
     * //console.log('delete'); break; } });
     *
     * self.$form.on('keypress', 'input', $.proxy(function(event) {
     * if(self.confirmKeys.indexOf(event.which)>-1){ var $input =
     * $(event.target); var text = $input.val();
     *
     * if(text.length>0){ event.preventDefault(); self.add(text);
     * $input.val(''); } } }, self));
     *
     * self.$form.on('submit', $.proxy(function(event) {
     * if(self.$input.val().length==0){ self.$input.attr('name', null); } })); } }
     */

  function initSearchForm(){
     var form = $('.search-multiterm');

     var input = form.find('.js-search-input');
     form.on('click', '.js-hitarea', function(event) {
        input.focus();
     });

     form.on('submit', function(event) {
         if(input.attr('name')=='qf[]' && input.val().length==0){
             return false;
         }
     });

  }


 initSearchForm();

});
