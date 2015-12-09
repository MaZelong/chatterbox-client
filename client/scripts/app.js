// YOUR CODE HERE:
// $(document).ready(function(){

  

  var app = {
    server: 'https://api.parse.com/1/classes/chatterbox',
    username: 'marlon',
    roomname: 'lobby',
    lastmessage: 0,

    init: function(){
      // set interval to listen for server
      app.fetch()
      setInterval(app.fetch, 10000);
      // listen for click on #submit
      $(document).on("click", '#send',app.handleSubmit)

      // listen for add room
      $(document).on("click", "#roomSubmit", function(e){
        var room = $("#room").val();
        app.roomname = room;
        app.fetch()
        app.addRoom(room);
      })

      app.lastmessage = moment(Date.now())

      // listen for click on friend
      $(document).on("click", ".username", app.addFriend)



    },

    send: function(message){
      console.log(message.text)
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
            app.fetch()
          // show message
          //app.fetch()

        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message');
        }
      });


    },


    fetch: function(){
      // app.clearMessages()
      //debugger;
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'GET',
        data: JSON.stringify(),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message recieved');
          console.log(this);
          console.log(data)

          /*data = {results: [{
            createdAt:
            objectId:
            opoonents:
            roomname:
            text:
            updatedAt:
            username:

          }]} */
          var messages = data.results;

          //filter by room
          messages = _.filter(messages, function(obj){
            return obj.roomname === app.roomname && moment(obj.createdAt) > app.lastmessage
          })

          app.lastmessage = moment(new Date())

          // for each child, addMessage(child)
          _.each(messages, function(obj){
            console.log(obj.username, obj.text, obj.roomname)
            app.addMessage(obj)
          })
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message', data);
        }
      });

    },

    clearMessages:function(){
      $('#chats').children().remove()
    },

    addMessage:function(obj){

      function escapeHtml(username, text) {
          var div = document.createElement('div');
          div.appendChild(document.createTextNode(username + ': ' + text));
          return div.innerHTML;
      }


      // app.roomname = obj.roomname;
      // var $message = 'class="username">' + obj.username + ': '+ obj.text
      console.log('adding message')
      $('#chats').prepend("<br />")
      $('#chats').prepend(escapeHtml(obj.username, obj.text))

    },

    addRoom:function(room){
      var $room = '<option value="' + room + '">' + room + '</option>'
      $("select>option:eq("+room+")").prop("selected", true)
      $('#roomSelect').prepend($room)
      app.clearMessages()
      app.fetch()
    },

    addFriend:function(){
      console.log('yo')
    },

    handleSubmit:function(){
      var message = {
        username: app.username,
        roomname: app.roomname,
        text: $("#message").val()
      }
      app.send(message)
    },

  }

  app.init();
