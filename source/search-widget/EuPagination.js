var EuPagination = function(cmpIn, options){

    // conf
    var self       = this;
    self.cmp       = cmpIn;
    self.options   = options ? options : {};
    self.ajax      = self.options.ajax ? self.options.ajax : false;

    // dom 
    self.first     = null;
    self.previous  = null;
    self.next      = null;
    self.last      = null;
    self.form      = null;
    self.jump      = null;

    // data
    self.records   = 0;
    self.rows      = 0;

    // initialise to be called once html cmp is set
    self.init = function() {

        self.first        = self.cmp.find('.nav-first');
        self.previous     = self.cmp.find('.nav-prev');
        self.next         = self.cmp.find('.nav-next');
        self.last         = self.cmp.find('.nav-last');
        self.form         = self.cmp.find('form');
        self.jump         = self.cmp.find('#start-page');
        self.ofPages      = self.cmp.find('form .of-bracket');

        if (self.options.fns) {
            if (self.options.fns.fnFirst) {
                self.first.find('a').click(self.options.fns.fnFirst );
            }
            if (self.options.fns.fnPrevious) {
                self.previous.find('a').click(self.options.fns.fnPrevious );
            }
            if (self.options.fns.fnNext) {
                self.next.find('a').click(self.options.fns.fnNext );
            }
            if (self.options.fns.fnLast) {
                self.last.find('a').click(self.options.fns.fnLast );
            }
            if (self.options.fns.fnSubmit) {
                self.form.unbind('click')
                    .unbind('submit')
                    .submit(function(e){
                        try {
                            return self.options.fns.fnSubmit(self.jump.val());
                        }
                        catch(e){
                            console.log(e);
                            return false;
                        }
                });
            }
        }

        self.form.bind('submit',   jumpToPageSubmit);
        self.jump.bind('keypress', validateJumpToPage);

        if (self.options.data) {
            self.setData(self.options.data.records, self.options.data.rows, self.options.data.start)
        }
    };

    self.setData = function(records, rows, start) {
        self.records = records;
        self.rows    = (rows && !isNaN(rows)) ? rows : eu.europeana.vars.rows;
        console.log("self.rows:" + self.rows);

        if (self.ajax) {
            // set link display
            $.each([self.first, self.previous], function(i, ob){ob.css('visibility', (start == 1) ? 'hidden' : 'visible')});
            $.each([self.next, self.last],      function(i, ob){ob.css('display', start < getMaxStart() ? 'table-cell' : 'none')});

            // labels & input
            self.ofPages.html(getMaxPages());

            var res = (records > rows) ? parseInt(start/rows) + 1 : 1;
            self.jump.val( res );
        }
    };

    var jumpToPageSubmit = function(e) {
        if(!self.ajax){
            var pageNum     = parseInt(self.jump.val());
            var newStart    = 1 + ((pageNum-1) * self.rows);
            self.cmp.find('#start').val(newStart);
        }
    };

    var getMaxStart = function() {
        return (self.rows * getMaxPages()) - (self.rows - 1);
    }

    var getMaxPages = function() {
        return parseInt(self.records / self.rows) + (self.records % self.rows ? 1 : 0);
    };

    var validateJumpToPage = function(e) {

        if(e.ctrlKey || e.metaKey || e.keyCode == 9){
            // ctrl or cmd or tab
            return;
        }

        var $this        = $(this);
        var $jumpToPage  = $(this).parent();
        var key          = window.event ? e.keyCode : e.which;
        var maxPages     = getMaxPages();

        if ([8, 46, 37, 38, 39, 40].indexOf(e.keyCode)>-1) {
            /* delete, backspace, left, up, right, down */
            return true;
        }
        else if (e.keyCode == 13) {
            /* return */
            var currVal = self.jump.val();
            return currVal.length > 0;
        }
        else if ( key < 48 || key > 57 ) {
            /* alphabet */
            return false;
        }
        else {
            /* number */

            var val = parseInt( $this.val() + String.fromCharCode(key) );

            if(typeof $this[0].selectionStart != 'undefined' && typeof $this[0].selectionEnd != 'undefined' && $this[0].selectionStart != $this[0].selectionEnd){
                val = parseInt(    $this.val().substr(0, $this[0].selectionStart -1)    + String.fromCharCode(key) + $this.val().substr($this[0].selectionEnd, $this.val().length )    );      
            }

            var overwrite;

            if (!val>0) {
                overwrite = 1;
                val = 1;
            }
            else if (val > maxPages) {
                overwrite = maxPages;
                val = maxPages;
            }
            if (overwrite) {
                $(e.target).val(overwrite);
                e.preventDefault();
            }
            return true;
        }
    };

    /* initialise */
    self.init();

    /* exposed functionality */
    return {
        "setData": function(records, rows, start) {
            self.setData(records, rows, start)
        },
        "getMaxPages": function() {
        	return getMaxPages();
        },
        "getMaxStart": function() {
        	return getMaxStart();
        }
    };
};