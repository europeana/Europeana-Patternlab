define(['jquery'], function ($) {

    function log(msg){
        console.log(msg);
    }

    /*
    function Optimiser(initialVal, fnTest, jump){

        this.history = {}
        this.direction = 'd';
        this.jump = jump ? jump : 4;
        this.val = initialVal;
        this.initialVal = initialVal;
        this.tries = 0;
        this.test = fnTest ? fnTest : function(fs){

            log('default optimise test');
            return fs <= 11;
        };
        this.max_while_break = 10;
    }

    Optimiser.prototype = {

        constructor : Optimiser,

        find : function(){

            var self = this;
            var next = self.getNext(self.val);
            var esc = 0;

            while(!next.isFinal){
                next = self.getNext(next.val);
                esc++;
                if(esc > self.max_while_break){
                    break;
                }
            }
            return next.val;
        },

        halfJump : function(){

            var self = this;
            if(self.jump > 1){
                self.jump = Math.max(1, Math.floor(self.jump / 2));
            }
        },

        getNext : function(val){

            var self = this;
            var testResult = null;

            val = (self.direction == 'd') ? val - self.jump : val + self.jump;

            if(typeof self.history['' + val] == 'undefined'){
                testResult = self.test(val);
                self.history['' + val] = testResult;
            }
            else{
                testResult = self.history['' + val];
            }

            if(testResult){
                if(self.jump == 1){
                    return {
                        val : val,
                        isFinal : true
                    }
                }
                else{
                    if(self.direction == 'd'){
                        self.direction = 'u';
                        self.halfJump();
                    }
                }
            }
            else{
                if(self.direction == 'u'){
                    self.direction = 'd';
                    self.halfJump();
                }
            }

            log('getNext val = ' + val + ', testRes = ' + testResult + ', jump = ' + (self.jump == 1) + ' (' + self.jump + ')');
            return {
                val : val,
                isFinal : (testResult && self.jump == 1)
            }

        }
    }

    function WrapNiceGroup(selCmpArray, selText, selTweak){

        this.selCmpArray = selCmpArray;
        this.selText = selText;
        this.selTweak = selTweak;
        this.minFs = 100;
        this.members = [];
        this.styleIds = {
            'base' : 'wrap-nice-base',
            'test' : 'wrap-nice-test',
            'real' : 'wrap-nice-style',
            'fs' : 'wrap-nice-fs'
        };
        this.styles = {
            '$base' : null,
            '$test' : null,
            '$real' : null,
            '$fs' : null
        };
        this.css = {
            'wwn' : 'word-wrap:normal;',
            'oa' : 'overflow:auto;'
        };
        this.init();
    }

    WrapNiceGroup.prototype = {

        constructor : WrapNiceGroup,

        init : function(){

            var self = this;

            $(self.selCmpArray).each(function(){

                self.members.push(new WrapNice($(this), self));
            });

            self.styleToSmallestFs();
        },

        set_text : function($el, text){

            $el.empty();
            $el[0].appendChild(document.createTextNode(text));
        },

        get_style_tag : function(id){

            return $('<style id="' + id + '" type="text/css"></style>').appendTo('head');
        },

        get_style_tag_text : function(selectors){

            var res = '';

            for(var i = 0; i < selectors.length; i++){

                res += selectors[i].sel + '{\n';

                for(var j = 0; j < selectors[i].rules.length; j++){
                    res += selectors[i].rules[j] + '\n'
                }
                res += '}\n'
            }
            return res;
        },

        enable_stylesheet : function(ss){

            var self = this;

            log('ENABLE ' + (ss ? ss.attr('id') : '') + ' ???')
            if(ss){
                if(ss.text().indexOf('\/*') > -1){
                    var text = ss.text().replace('\/*', '').replace('*\/', '');
                    self.set_text(ss, text);
                }
                else{
                    log('ALREADY ENABLED');
                }
            }
            else{
                log('ENABLE WHAT ???');
            }
        },

        disable_stylesheet : function(ss){

            var self = this;

            log('DISABLE ' + (ss ? ss.attr('id') : '') + ' ???')
            if(ss){
                if(ss.text().indexOf('\/*') == -1){
                    self.set_text(ss, '\/*' + ss.text() + '*\/');
                }
                else{
                    log('ALREADY DISABLED ' + ss.attr('id'));
                }
            }
            else{
                log('DISABLE WHAT ???');
            }
        },

        styleToSmallestFs : function(){

            var self = this;
            var fs = self.minFs;

            self.test_start();

            for(var i = 0; i < self.members.length; i++){
                self.members[i].tryFit();
                fs = self.members[i].fs ? Math.min(self.members[i].fs, fs) : fs;
            }

            self.test_end();

            if(fs < self.minFs){

                var rule = 'font-size:' + fs + 'px;';
                var selectors = [{
                    sel : self.selCmpArray + ' ' + self.selTweak,
                    rules : [self.css.wwn, rule]
                }];
                var css = self.get_style_tag_text(selectors);

                if(!self.styles.$real){
                    self.styles.$real = self.get_style_tag(self.styleIds.real);
                }
                self.set_text(self.styles.$real, css);
            }
        },

        test_start : function(){

            // allows overflow on containers until test_end is called

            var self = this;

            self.history = {};

            if(self.styles.$test){
                self.enable_stylesheet(self.styles.$test);
            }
            else{
                var textBase = self.get_style_tag_text([{
                    sel : self.selCmpArray,
                    rules : [self.css.wwn]
                }]);
                var textTest = self.get_style_tag_text([{
                    sel : self.selCmpArray + ' ' + self.selText,
                    rules : [self.css.oa]
                }]);

                self.styles.$base = self.get_style_tag(self.styleIds.base);
                self.styles.$test = self.get_style_tag(self.styleIds.test);
                self.set_text(self.styles.$base, textBase);
                self.set_text(self.styles.$test, textTest);


                // var text = self.get_style_tag_text([ { sel: self.selCmpArray,
                // rules: [self.css.wwn] }, { sel: self.selCmpArray + ' ' +
                // self.selText, rules: [self.css.oa] } ]); self.styles.$test =
                // self.get_style_tag(self.styleIds.test);
                // self.set_text(self.styles.$test, text);
            }
        },

        apply_fs : function(fs){

            // applies font size

            var self = this;

            if(!fs){
                self.disable_stylesheet(self.styles.$fs);
                return;
            }

            var rule = 'font-size:' + fs + 'px;';
            var selectors = [{
                sel : self.selCmpArray + ' ' + self.selTweak,
                rules : [rule]
            }];
            var css = self.get_style_tag_text(selectors);

            if(!self.styles.$fs){
                self.styles.$fs = self.get_style_tag(self.styleIds.fs);
            }
            // Explicit enabling not needed, i.e.
            // self.enable_stylesheet(self.styles.$fs);
            self.set_text(self.styles.$fs, css);

            log('apply(' + fs + '),  test stylesheet = ' + $('#' + self.styleIds.test).length)
        },

        test_end : function(){

            var self = this;

            log('test_end: disable test..');
            self.disable_stylesheet(self.styles.$test);
        },

        resize : function(){

            var self = this;

            log('resize, disable real...');
            self.disable_stylesheet(self.styles.$real);
            self.styleToSmallestFs();
        }
    }

    function WrapNice($cmp, parent){

        this.$cmp = $cmp;
        this.$txt = $cmp.find(parent.selText);
        this.$twk = $cmp.find(parent.selTweak);
        this.parent = parent;
        this.fs = null;
        this.init();
    }

    WrapNice.prototype = {
        constructor : WrapNice,

        init : function(){

            var self = this;
            self.tryFit();
        },

        tryFit : function(){

            var self = this;

            var fits = function(){

                return self.$txt.width() == self.$txt[0].scrollWidth;
            }

            if(!fits()){
                self.fs = new Optimiser(parseInt(self.$twk.css('font-size')) - 1, function(fs){

                    self.parent.apply_fs(fs);
                    return fits();
                }, 5).find();
                self.parent.apply_fs();
            }
        }
    }
    */

    function initHome(){

        log('init home');
        /*
        if(window.location.href.indexOf('wrapnice') > -1){

            var sel1 = '.home-promo > li';
            var sel2 = '.promo-block > a';
            var sel3 = 'span.title';

            wrapNiceGroup = new WrapNiceGroup(sel1, sel2, sel3);

            $(window).europeanaResize(function(){

                wrapNiceGroup.resize()
            });

        }
        */
    };

    return {
        initPage: function(){
            initHome();
        }
    }

});
