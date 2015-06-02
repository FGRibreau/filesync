'use strict';
angular.module('FileSync').factory('ChatService', function (SocketIOService, _) {
    var messages = [];

    this._getUrlPreview = function(text) {
      var html = "";
      var xhr = new XMLHttpRequest();
      var regex_url = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/;

      if(regex_url.test(text)) {
        xhr.open('GET', "http://open.iframe.ly/api/oembed?url=" + encodeURIComponent(text) + "&width=206", false);
        xhr.send(null);  
        if(xhr.status == 200) {
          var obj = JSON.parse(xhr.responseText);
          if(obj.html == undefined)
            html = "<a href='" + obj.url + "' target='_blank'>" + obj.url + "</a>";
          else
            html = obj.html;
        }
      }
      else {
        html = text;
      } 
      
      return html;
    }

    return {
      messages: messages,
      deleteMessage: function (index) {
        this.messages.splice(index, 1);
      },
      sendMessage: function (inputValue) {
        SocketIOService.sendChatMessage(this._getUrlPreview(inputValue));
      }.bind(this),
      formatMessage: function(message, $sce){
        return $sce.trustAsHtml(message);
      },
      getFomatedTimestamp: function() {
        var date = new Date();

        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();

        var formatedTimestamp = hours + ':' + minutes.substr(minutes.length-2);

        return formatedTimestamp;
      }
    }
});
