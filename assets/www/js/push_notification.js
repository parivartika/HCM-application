var pushNotification;

function onConfirm(buttonIndex) {
	if(buttonIndex==1){
		checkConnection(); //to check the connetion 
		//document.addEventListener("online", onOnline, true);
    	//document.addEventListener("offline", onOffline, true);
		//register_push_notification();
	}
	if(buttonIndex==2){
		alert("Device not registered for Push Notifiction");
	}
    //alert('You selected button ' + buttonIndex);
}

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';
    alert('Connection type: ' + states[networkState]);
    if(states[networkState] == 'No network connection') { //show_no_connection();
    alert("deivce is offline you need to connect to register");
}
    else{
    	push_notification();
    }
}

function confirm_notification(){
	alert("confirm notif function called");
	navigator.notification.confirm(
            'The application would like to register device for push notification',  // message
            onConfirm,              // callback to invoke with index of button pressed
            'Push Notification ',            // title
            'Allow,Deny'          // buttonLabels
        );
}

function register_push_notification(){
	var regid= window.localStorage["regID"];

	$.ajax({
        url: 'http://10.0.2.2/gcm_server_php/register.php', //This is the current doc
        type: "POST",
        data: {name: "abhi", email: "registernotification@eclipseregid11111", regId: regid},
        success: function(data){
        console.log(data);
        }
	
	});
}


function LoginPopup()
{
	window.localStorage["installation"]= 'COMPLETE';
	var gcm_regid= window.localStorage["regID"];
	
	$.ajax({
        url: 'http://10.0.2.2/gcm_server_php/delete_regid.php', //This is the current doc
        type: "POST",
        data: {regId: gcm_regid},
        success: function(data){
        console.log(data);
        }
        
        });
	//window.localStorage.removeItem("notification");
	window.localStorage.removeItem("regID");	
	
	window.localStorage.removeItem("Ecode");
    window.localStorage.removeItem("Application");
    window.localStorage.removeItem("module");
    //window.localStorage.removeItem("regID");
    //window.localStorage.removeItem("registration");
    
	if( (window.localStorage["Ecode"]=="" ||  window.localStorage["Ecode"]==undefined))
	{
		// call this to get a new token each time. don't call it to reuse existing token.
		//pushNotification = window.plugins.pushNotification;
		//pushNotification.unregister(successHandler, errorHandler);
		//e.preventDefault();
		//navigator.app.exitApp();
		alert("device unregistered..!!");
		var urlLogin="index.html";
	    location=urlLogin;
	}
	/*else
	{
		navigator.app.backHistory();
	}*/

    
}


function push_notification(){
	
   // $("#app-status-ul").append('<li>deviceready event received</li>');
	//alert("devicerrady event received..");
    
	document.addEventListener("backbutton", function(e)
	{
    	//$("#app-status-ul").append('<li>backbutton event received</li>');
		//alert("backbutton event received...");
			
			if( $("#home").length > 0)
		{
			// call this to get a new token each time. don't call it to reuse existing token.
			pushNotification.unregister(successHandler, errorHandler);
			e.preventDefault();
			navigator.app.exitApp();
		}
		else
		{
			navigator.app.backHistory();
		}
	}, false); 

	try 
	{ 
    	pushNotification = window.plugins.pushNotification;
    	if (device.platform == 'android' || device.platform == 'Android') {
			//$("#app-status-ul").append('<li>registering android</li>');
			//alert("registering android..");
        	pushNotification.register(successHandler, errorHandler, {"senderID":"198872155807","ecb":"onNotificationGCM"});		// required!
		} else {
			$("#app-status-ul").append('<li>registering iOS</li>');
			alert("registering iOS..");
        	pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
    	}
    }
	catch(err) 
	{ 
		txt="There was an error on this page.\n\n"; 
		txt+="Error description: " + err.message + "\n\n"; 
		alert(txt); 
	} 
}

function onNotificationAPN(e) {
    if (e.alert) {
         $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
         navigator.notification.alert(e.alert);
    }
        
    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }
    
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
    //$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
   // alert("EVENT -> RECEIVED :" + e.event);
    
    switch( e.event )
    {
        case 'registered':
		if ( e.regid.length > 0 )
		{
			//$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
			//alert("REGISTERED -> REGID:"+ e.regid);
			// Your GCM push server needs to know the regID before it can push to this device
			// here is where you might want to send it the regID for later use.
			window.localStorage["regID"]= e.regid;
			
			 $.ajax({
           url: 'http://10.0.2.2/gcm_server_php/register.php', //This is the current doc
           type: "POST",
           data: {name: "abhi", email: "helloworld@eclipseregid11111", regId: e.regid},
           success: function(data){
           console.log(data);
           }
           
           });
			
			console.log("regID = " + e.regID);
			
			navigator.notification.alert(
		            'Device is registered',  // message
		            alertDismissed,         // callback
		            'Push Notification',            // title
		            'OK'                  // buttonName
		        );			
		}
        break;
        
        case 'message':
        	// if this flag is set, this notification happened while we were in the foreground.
        	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
        	if (e.foreground)
        	{
				//$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
        		//alert("INLINE NOTITIFICATION..");
				
				// if the notification contains a soundname, play it.
				var my_media = new Media("/android_asset/www/"+e.soundname);
				my_media.play();
			}
			else
			{	// otherwise we were launched because the user touched a notification in the notification tray.
				if (e.coldstart)
					$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
				else
				$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
			}
				
			//$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
        	//alert("MESSAGE -> MSG:"+e.payload.message);
        	navigator.notification.alert(
        			e.payload.message,  // message
		            alertDismissed,         // callback
		            'Push Notification',            // title
		            'OK'                  // buttonName
		        );
        	
			//$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
        	//alert("MESSAGE -> MSGCNT:"+e.payload.msgcnt);
        break;
        
        case 'error':
			//$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
        	alert("ERROR -> MSG:"+e.msg);
        break;
        
        default:
			//$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
        	alert(" Unknown, an event was received and we do not know what it is");
        break;
    }
}

function alertDismissed() {
    // do something
}

function tokenHandler (result) {
   // $("#app-status-ul").append('<li>token: '+ result +'</li>');
	alert("token:"+result);
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler (result) {
    //$("#app-status-ul").append('<li>success:'+ result +'</li>');
    alert('result = '+result);
}

function errorHandler (error) {
    //$("#app-status-ul").append('<li>error:'+ error +'</li>');
    alert('error = '+error);
} 