var AppMessage = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox',
  defaults: {
    username: "marlon",
    roomname: "lobby"
  } 

});

// 

var AppCollection = Backbone.Collection.extend({
  model: AppMessage,
  url: 'https://api.parse.com/1/classes/chatterbox',
  parse: function(response){
    return response.results
  }
});

var AppView = Backbone.View.extend({

  // initialize: function(){
  //   this.model.on('change', this.render, this)
  // },
  render: function(){
      var username = this.model.get('username')
      var text = this.model.get('text')
      var message = username + ': ' + text
      $(this.el).html(message)

      return this.el
  }

})

var AppCollectionView = Backbone.View.extend({
  el: "body",
  events: {
    'click #send': 'handleSubmit'
  },
  initialize: function(){
    this.collection.on('change', this.render, this)
  },
  render: function(){
    this.collection.forEach(function(model){
      var modelView = new AppView({model: model})
      $("#chats").append(modelView.render());
    } , this)
  },

  handleSubmit: function(){
    var message = new AppMessage({text: $("#message").val()});
    message.save({}, {
      success: function(model, resonse, options) {
        console.log("the model has been saved to the server");
      },
      error: function(model, response, options){
        console.log("something went wrong while saving the model");
      }
    });
    this.collection.fetch()
    this.render()

    // this.collection.create({text: $("#message").val()})
    // this.collection.save()
  }


});



/*

send

appview
handle submit
addmessage
clearmessage*/