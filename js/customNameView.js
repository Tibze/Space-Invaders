// Array Namespace

var app = {Models: {},Views: {}};

app.Models.ItemCustomNameModel = Backbone.Model.extend({});

app.Views.CustomNameView = Backbone.View.extend({

  initialize:function () {

    //this.template = _.template($("#itemTemplate").html());
    return this;

    },

    render:function (eventName) {

    this.setElement(this.template(this.model.toJSON()));
    //Hammer(this.el).on("swipe", this.swipe);
    return this;

    },

    events: {
        /*'click':'onClick'*/
        /*'swipe':'swipe'*/
        /*'mouseover':'mouseOver'*/
    },

    mouseOver:function() {

        console.log("mouseOver");

    },

    swipe:function(){

        console.log("swipe");

    },

    onClick:function(){

      this.trigger('click');

    }

});

app.Views.ItemCustomNameView = Backbone.View.extend({

  initialize:function () {

    this.template = _.template($("#inputTemplate").html());
    return this;

    },

    render:function (eventName) {

    this.setElement(this.template(this.model.toJSON()));
    //Hammer(this.el).on("swipe", this.swipe);
    return this;

    },

    events: {
        /*'click':'onClick'*/
        /*'swipe':'swipe'*/
        /*'mouseover':'mouseOver'*/
    },

    mouseOver:function() {

        console.log("mouseOver");

    },

    swipe:function(){

        console.log("swipe");

    },

    onClick:function(){

      this.trigger('click');

    }

});





