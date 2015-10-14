

app.Models.UserScoreModel = Backbone.Model.extend({

    url:"services/index.php/addscore"

});

app.Models.ScoreModel = Backbone.Model.extend({

    initialize: function(){

    },

    change:function(){
        console.log("change");
        this.set({score:getScore(this.get("score"))});

    }

});

app.Collections.ScoreCollection = Backbone.Collection.extend({

    model: app.Models.ScoreModel,
    url : "services/index.php/highscores"

});

app.Views.HighScoresView = Backbone.View.extend({

  className:"highScoreContainer",

  initialize:function () {

    return this;

    },

    render:function (eventName) {

    var tabHS = ["1ST","2ND","3RD","4TH","5TH","6TH","7TH","8TH","9TH","10TH"];

    _.each(this.collection.models, function (score,index) {

        scoreView = new app.Views.ScoreView({model:score});
        scoreView.model.set({id:tabHS[index]})
        $(this.el).append(scoreView.render().el);

    },this);

    return this;

    },

    events: {
        /*'keydown':'onKeydown'*/
        /*'swipe':'swipe'*/
        /*'mouseover':'mouseOver'*/
    }

});

app.Views.ScoreView = Backbone.View.extend({

  tagName: 'div',
  className: "scoreItem",

  initialize:function () {

    this.model.set({score:getScore(this.model.get("score"))});
    this.template = _.template($("#scoreTemplate").html());
    return this;

    },

    render:function (eventName) {

    $(this.el).html(this.template(this.model.toJSON()));
    return this;

    },

    events: {
        /*'keydown':'onKeydown'*/
        /*'swipe':'swipe'*/
        /*'mouseover':'mouseOver'*/
    }

});

function getScore(score){

    var nbCharMax = 6;
    var str ="";
    var nbChar = score.toString().length;
    var len = nbCharMax - nbChar;
    for (var i=0;i<len;i++) str += "0";
    str += score.toString();
    return str;

}





