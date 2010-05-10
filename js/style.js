/* Code to add/remove custom styles */

Stylebot.Style = {
    //Temporary cache to store style when it is being tested
    rules:[],
    apply: function(selector, property, value){
        var el = $(selector);

        /* TODO: Any original inline CSS should remain unaltered */
        var origCSS = el.attr('style');
        origCSS = (typeof(origCSS) == "undefined") ? "" : origCSS;
        
        this.applyInlineCSS(el, this.getInlineCSS(selector, property, value));
        
        this.updateRule(selector, property, value);
    },
    updateRule: function(selector, property, value){
        var index = this.search(this.rules, "selector", selector);
        if(index != null)
        {
            console.log("Rule already exists at index "+ index + "\n");
            var rule = this.rules[index];
            index = this.search(rule.styles, "property", property);
            if(index != null)
            {
                console.log("Property already exists in rule at index "+ index + "\n");
                rule.styles[index].value = value;
            }
            else
                rule.styles[rule.styles.length] = {property: property, value: value};
        }
        else
        {
            console.log("Nothing found. Creating a new rule \n");
            this.rules[this.rules.length] = {selector: selector, styles:[{property: property, value: value}]};
        }
        
        for(var i=0;i < this.rules.length; i++)
        {
            console.log("Rule "+i+" Selector: "+this.rules[i].selector+"\n");
        }
    },
    search: function(arr, pName, pValue){
        var len = arr.length;
        for(var i=0; i<len; i++)
        {
            console.log("Comparing "+arr[i][pName]+" to "+pValue+"\n");
            if(arr[i][pName] == pValue)
                return i;
        }
        return null;
    },
    getInlineCSS: function(selector, property, value){
        /* TODO: Try using $.each for iteration here */
        var index = this.search(this.rules, "selector", selector);
        if(index != null)
        {
            var css = "";
            var rule = this.rules[index];
            var len = rule.styles.length;
            var isPropertyPresent = false;
            for(var i=0; i<len; i++)
            {
                if(rule.styles[i].property == property && !isPropertyPresent)
                {
                    rule.styles[i].value = value;
                    isPropertyPresent = true;
                }
                css += this.getCSSDeclaration(rule.styles[i].property, rule.styles[i].value, true);
            }
            if(!isPropertyPresent)
                css += this.getCSSDeclaration(property, value, true);
            return css;
        }
        else
            return this.getCSSDeclaration(property, value, true);
    },
    applyInlineCSS: function(el, css){
        el.attr({
            style: css,
            'stylebot-css': css //save stylebot css in a separate attribute
        });
    },
    clearInlineCSS: function(el){
        $(selector).attr({
            style:'',
            'stylebot-css':''
        });
    },
    getStyles: function(selector){
        var index = this.search(this.rules, "selector", selector);
        if(index != null)
            return this.rules[index].styles;
        else
            return null;
    },
    crunchCSS: function(){
        var len = this.rules.length;
        var css = '';
        for(var i=0; i<len; i++)
        {
            var rule = this.rules[i];
            css += rule.selector + "{ " + "\n";
            var styles_len = rule.styles.length;
            for(var j=0; j<styles_len; j++)
            {
                css += "\t" + this.getCSSDeclaration(rule.styles[j].property, rule.styles[j].value) + "\n";
            }
            css += "}" + "\n";
        }
        return css;
    },
    getCSSDeclaration: function(property, value, setImportant){
        if(setImportant)
            return property + ": " + value + " !important;";
        else
            return property + ": " + value + ";";
    }
}