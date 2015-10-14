// Array Namespace

var app = { Models: {},Views: {}, Collections: {} };

app.Models.ItemCustomNameModel = Backbone.Model.extend({});

app.Views.CustomNameView = Backbone.View.extend({

  initialize:function () {

    this.currentItem = 0;
    this.tabItem = [];

    return this;

    },

    render:function (eventName) {


    for (var i=0;i<3;i++) {

        itemCustomNameModel = new app.Models.ItemCustomNameModel();
        itemCustomNameModel.set("letter","A");
        itemCustomNameView = new app.Views.ItemCustomNameView({model:itemCustomNameModel})
        itemCustomNameView.removeHighlight();
        $(this.el).append(itemCustomNameView.render().el);
        this.tabItem.push(itemCustomNameView);

    }

    $(window).bind("keydown",{target: this},this.onKeydown);

    this.tabItem[this.currentItem].setHighlight();

    return this;

    },

    setScore:function(score){

        this.score = score;

    },

    events: {
        /*'keydown':'onKeydown'*/
        /*'swipe':'swipe'*/
        /*'mouseover':'mouseOver'*/
    },

    onKeydown:function(e){

        var target = e.data.target;

        if (e.keyCode == 39) {
            if (target.currentItem < target.tabItem.length-1) target.currentItem++;
            else target.currentItem = 0;
        }

        if (e.keyCode == 37) {

            if (target.currentItem > 0) target.currentItem--;
            else target.currentItem = target.tabItem.length - 1;

        }

        target.tabItem[target.currentItem].setHighlight();

        for (var i=0;i<target.tabItem.length;i++) {

            if (i == target.currentItem) target.tabItem[i].setHighlight();
            else target.tabItem[i].removeHighlight();

        }

        if (e.keyCode == 38) {

            target.tabItem[target.currentItem].up();

        }

        if (e.keyCode == 40) {

            target.tabItem[target.currentItem].down();

        }

        if (e.keyCode == 13) {

            $(window).unbind("keydown",target.onKeydown);
            // save
            var userScore = new app.Models.UserScoreModel();
            var name = ""+target.tabItem[0].model.get("letter")+""+target.tabItem[1].model.get("letter")+""+target.tabItem[2].model.get("letter");
            userScore.save({score:target.score,pseudo:name},{success:function(){
                target.trigger("complete");

            }});

        }

    }

});

app.Views.ItemCustomNameView = Backbone.View.extend({

  tagName: 'div',
  className: "letterItem",

  initialize:function () {

    this.alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    this.index = 0;
    this.model.on('change',this.render,this);
    this.template = _.template($("#inputTemplate").html());
    return this;

    },

    render:function (eventName) {

    $(this.el).html(this.template(this.model.toJSON()));
    return this;

    },

    setHighlight:function(){

        $(this.el).css({"border-color": "#04dd08",
                 "border-width":"1px",
                 "border-style":"solid"});

    },

    removeHighlight:function(){

        $(this.el).css({"border-color": "#000000",
                 "border-width":"1px",
                 "border-style":"solid"});

    },

    up:function(){

        this.index++;
        if (this.index > this.alphabet.length -1) this.index = 0;
        this.model.set("letter",this.alphabet[this.index]);

    },

    down:function(){

        this.index--;
        if (this.index < 0) this.index = this.alphabet.length -1;
        this.model.set("letter",this.alphabet[this.index]);

    },

    events: {
        /*'keydown':'onKeydown'*/
        /*'swipe':'swipe'*/
        /*'mouseover':'mouseOver'*/
    },

    onKeydown:function(){

        //console.log("onKeyUp");

    },

    mouseOver:function() {

        //console.log("mouseOver");

    },

    swipe:function(){

        //console.log("swipe");

    },

    onClick:function(){

      this.trigger('click');

    }

});





