'use strict';
angular.module('FileSync')
.factory('NotificationService', function () {

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
var notification = notifyInfos(titleNotif, options);
notification.onclick = function(){location.href = idElementModified;};

}
/**
* Publish a notifcation
* @author ImoucheG imouche.guillaume@gmail.com
* @param title String
* @param options ArrayObject
**/
function notifyInfos(title, options){
	var notification = null;
// Let's check if the browser supports notifications
if (!("Notification" in window)) {
	alert("This browser does not support desktop notification");
}
// Let's check whether notification permissions have alredy been granted
else if (Notification.permission === "granted") {
// If it's okay let's create a notification
notification = new Notification(title,options);
}
// Otherwise, we need to ask the user for permission
else if (Notification.permission !== 'denied') {
	Notification.requestPermission(function (permission) {
  // If the user accepts, let's create a notification
  if (permission === "granted") {
  	notification = new Notification(title,options);
  }
});
}
return notification;
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
return {
	notifyInfos: function (filename, timestamp) {
		notifyModification(filename, timestamp);
	}
};
});
