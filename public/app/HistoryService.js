'use strict';
angular.module('FileSync')
  .factory('HistoryService', function (SocketIOService, _) {
    var edits = [];

    SocketIOService.onFileChanged(function (filename, timestamp, content) {
      edits.unshift({
        filename: filename,
        timestamp: timestamp,
        content: content
      });
      notifyModification(filename,timestamp);
    });

    return {
      edits: edits,
      remove: function (edit) {
        _.remove(edits, edit);
      }
    };
  });
  /**
  * Create notification for a change file
  * @author ImoucheG imouche.guillaume@gmail.com
  * @param fileName String File name
  * @param timesstamp 
  **/
  function notifyModification(filename, timestamp) {
    //Convert timestamp to date and construct a message for print the date
    var date = timestampToHoursMS(timestamp);
    var idElementModified = "#" + filename + timestamp;
    var titleNotif = "Modification Alert";
    var options = {
        body: filename +  ' has been modified\nClick to see\n                              at ' + date,
        icon : "../images/notification.png"
}
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  // Let's check whether notification permissions have alredy been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(titleNotif,options);
            notification.onclick = function(){location.href=idElementModified;};
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
            var notification = new Notification(titleNotif,options);
            notification.onclick = function(){location.href=idElementModified;};
      }
    });
  }
}
/**
* Convert timestamp to date HH:MM:SS
* @author ImoucheG imouche.guillaume@gmail.com
* @param timestamp
* @return the date 
**/
function timestampToHoursMS(timestamp){
  var valRet = "";
  try{
    var time = new Date(timestamp);
    valRet = time.getHours();
    valRet += ":" + time.getMinutes();
    valRet += ":" + time.getSeconds(); 
  }catch(exception){
    console.log(exception);
  }
  return valRet;
}
