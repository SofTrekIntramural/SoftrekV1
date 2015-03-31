/*
    Copyright (c) 2012-2014 Adobe Systems Incorporated. All rights reserved.
    http://www.apache.org/licenses/LICENSE-2.0
	 
    * Authors: Softrek Student Dev Team
    * Project: Softrek Photo Upload
    * Description: Program using Phonegap to upload pictures to a server                                 
                   and allow tag and search functionality
	* Install: replace index.html with the provided one	also
               add softrek.js to js folder	
    * TODO:	 - Documentation
			 - HANDLE JSON RETURNED FROM PICTURE UPLOAD
			 - Sanity/Security Checking
			 - CSS HTML
			 - Test on multiple browsers, and then IOS...
	* Notes: Some functions do not work in IE11  
*/
	
	// Source variables for pictures and storage type
	var pictureSource; 
    var destinationType;  

    // Create listener and wait for the device to be ready
    document.addEventListener("deviceready", onDeviceReady, false);

    // Must wait for until device is ready and this function is called
    function onDeviceReady() {
		console.log(navigator.camera);
	    console.log(FileTransfer);	
		// set the sources for readability
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
    }
	
	// Need to decide where to call this 
	function clearCache() {
		navigator.camera.cleanup();
	}
 
    // Successfully took picture, so set it to image variable and display it
    function onPicCaptureSuccess(imageData) {
        // get and set img id is myImage
        var myImage = document.getElementById('myImage');
        // Unhide image elements
        myImage.style.display = 'block';
        // set the picture source which displays it
        myImage.src = "data:image/jpeg;base64," + imageData;

        //alert("data:image/jpeg;base64," + imageData)	
		
		/*
		//TODO IMPLEMENT SAVING PICTURES AFTER TAKING IT
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

        function gotFS(fileSystem) {
            alert("image/" + date + ".jpeg")
            fileSystem.root.getFile("image/" + date + ".jpeg", {
                create : true,
                exclusive : false
            }, gotFileEntry, fail);
        }
		
        function gotFileEntry(fileEntry) {
            fileEntry.createWriter(gotFileWriter, fail);
        }
		
        function gotFileWriter(writer) {
            var data = "data:image/jpeg;base64," + imageData;
            writer.write(data);
        }
		
        function fail(error) {
            alert("error")
            console.log(error.code);
        }
		*/
    }


    // select picture from storage source and display it
    function onPicSelectSuccess(imageURI) {
        console.log(imageURI);
		
        // Get image handle
        var myImage = document.getElementById('myImage');
        // Unhide image elements
        myImage.style.display = 'block';

		//alert("HI");
        // Show the captured photo
        myImage.src =  imageURI;
    }
	
    // Failure
    function onFail(message) {
        alert('Failed because: ' + message);
    }

 	/*====================================== BUTTON FUNCTIONS =======================================*/   
	// SET THE UPLOAD/DELETE IMAGE IDNUMBER
	function setProfileAccount(idnum){
		var upform = document.getElementById('upload-form');
		var delformID = document.getElementById('delID');
		upform.action = "http://democv.softrek.com:8082/clearview-api/external/prospect/" + idnum + "/image/upload?token=f37f22f4-4eea-4c93-a241-2723a879971e";
		delformID.value = idnum;
	}
	
	// QUERY SERVER FOR PROFILE PICTURE
    function updateProfilePic(idnum){
		var id = idnum;
		var leimage = document.getElementById('myImage');
		var delformTrans = document.getElementById('delTrans');
		var queryURL = "http://democv.softrek.com:8082/clearview-api/external/prospect/" + idnum +"/images?token=f37f22f4-4eea-4c93-a241-2723a879971e";
		var request = new XMLHttpRequest();
		
		// SET THE ACCOUNT IDS
		setProfileAccount(id);
		
		// CLEAR THE ORIGINAL PICTURE
		leimage.src = "";
		request.open("GET", queryURL, true);
		
		request.onreadystatechange = function() { // Call a function when the state changes.
			if (request.readyState == 4) {
				if (request.status == 200 || request.status == 0) {
					try{
						var ledata = JSON.parse(request.response);
						console.log("Response is " + request.responseText);
						console.log("encoded pic " + ledata[0].documentContent);
						
						delformTrans.value = ledata[0].transnum;
						leimage.src = "data:image/jpeg;base64," + ledata[0].documentContent;
						if(ledata[0].documentContent == null)
							leimage.src = "data:image/jpeg;base64," + ledata[0].attachmentData;
						
						console.log(leimage.src);
					} catch(err) {
						alert("No image found.");
						leimage.src = "img/default-avatar.png";
					}			
				}
			}				
		}	
		request.send();
	}	
	
    // SEARCH DATABASE FOR USERS
    function findUsers() {
        // GET TEXTBOX HANDLE TO ADD TO QUERY
        var userQuery = document.getElementById('myFilter').value;
		var queryURL = "http://democv.softrek.com:8082/clearview-api/external/prospect/search?token=f37f22f4-4eea-4c93-a241-2723a879971e&q=" + userQuery;
		//alert("user called");
		console.log("FIND USER: Query is" + queryURL);
		//var items="";
		//var searchTable = $('#jsontable').dataTable();
		var request = new XMLHttpRequest();
		request.open("GET", queryURL, true);
		request.onreadystatechange = function() { // Call a function when the state changes.
			if (request.readyState == 4) {
				if (request.status == 200 || request.status == 0) {
					var ledata = JSON.parse(request.responseText);
					//console.log("Response is " + request.responseText);
					//console.log("Number of results is " + ledata.length);

					// TODO: CHECK IF DATA IS ALREADY IN LIST BEFORE ADDING
					//       OR CLEAR ENTIRE LIST
					for(var i = 0; i < ledata.length; i++) {
						var namenode = document.createTextNode(ledata[i].fullName);
						var idnumber = ledata[i].idNumber;
						var phone = ledata[i].preferredPhone;
						var addy = ledata[i].preferredAddress;
						
						var linky = document.createElement("a");					
						//alert($("li").get(i));
						linky.appendChild(namenode);
						// MAYBE IMPLEMENT GETTING DATA THROUGH LINK
						linky.setAttribute('href', "#"  );	
						
						// CREATE EVENT TO SET DATA IN MAIN HTML
						 var node = document.createElement("LI"),
							obj = {
								// NEED TO GET NODE VALUE UNLIKE THE FOLLOWING VARS
								inname: namenode.nodeValue,
								inphone: phone,
								inaddy: addy,
								idnum: idnumber,
								
								handleEvent: function() {
									//var liAddy = document.createElement("LI");
									//liAddy.appendChild(addy);
									//setInfo(this);
									//alert(this.inaddy);
									//document.getElementById("mainList").removeChild();
									// UPDATE THE PROFILE VALUES
									document.getElementById("nameid").innerHTML = "Name: " + this.inname;
									document.getElementById("phoneid").innerHTML = "Phone: " + this.inphone;
									if(this.inaddy.length > 8){ 
										document.getElementById("addressid").innerHTML = "Address: " + this.inaddy.substring(0,23);
										document.getElementById("addyoverflow").innerHTML = "(continued) " + this.inaddy.substring(23);
									}
									else{ document.getElementById("addressid").innerHTML = "Address: " + this.inaddy; }
									// OLD CODE TO APPEND NODE, WE CAN JUST CHANGE THE TEXT
									//document.getElementById("mainList").appendChild((document.createElement("LI").appendChild(this.name)));
									// IMPORTANT FUNCTIONS
									updateProfilePic(this.idnum);								
									$("#searchPanel").panel("close");
								}
							}; 						
				
						// FOR WHEN USER CLICKS LINK, CALLS FUNCTION TO SET DATA
						node.addEventListener("click", obj, false);
						node.appendChild(linky);		
						document.getElementById("lelist").appendChild(node);
						//console.log((document.getElementById("lelist")).childNodes[0].nodeValue);
						//alert($( "li" ).index( listItems ));
					};
				}
					
				// CLEAR THE SEARCH LIST SO WE CAN SHOW SEARCH VALUES
				$("#myFilter").val("");
				$("#myFilter").trigger("keyup");			
			}
		}
		
		request.send();
			
		/* ATTEMPT #1: DOES NOT WORK?
		$.getJSON("http://democv.softrek.com:8082/clearview-api/external/prospect/search?token=f37f22f4-4eea-4c93-a241-2723a879971e&q=homer",
			function(data){
				alert(data); 
			})
        // ATTEMP #2432: STILL DOES NOT WORK
		$.ajax(
		{ 
			  //beforeSend: function (xhr) { xhr.setRequestHeader ('Authorization', 'Token f37f22f4-4eea-4c93-a241-2723a879971e') },
			  type: "GET",
			  url: "http://democv.softrek.com:8082/clearview-api/external/prospect/search?token=f37f22f4-4eea-4c93-a241-2723a879971e&q=homer",
			  //url: "http://democv.softrek.com:8082/clearview-api/view/login",
			  dataType: 'text',
	          contentType: "application/json; charset=utf-8",
			  xhrFields: {
			  withCredentials: true
			  },
			  async: true,
			  crossDomain: true,
			  beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "f37f22f4-4eea-4c93-a241-2723a879971e");
			  },

			  success: function(data){
				alert("success");
			  },
			  error: function (request, status, error) {
				    //console.log(JSON.stringify(xhr));
					 alert(JSON.stringify(request));
					 console.log("status " + status)
					 console.log("error " + error);
			  }
			}
		); */ 			
    }
	
    // Button to call function to take picture
    function takePic() {
		//alert("Taking pic");
        // Take picture, call success function
        navigator.camera.getPicture(onPicCaptureSuccess, onFail, {
            quality : 50,
            destinationType : destinationType.DATA_URL // FILE_URI ?
        });
    }

    // Button gets picture from specified source
    function getPic(source) {
        navigator.camera.getPicture(onPicSelectSuccess, onFail, {
            quality : 50,
            destinationType : destinationType.FILE_URI,
            sourceType : source
        });
    }

	/*
	// UPLOADING PIC IF SERVER HAS PHP 
	function uploadPic() {
		var img = document.getElementById('myImage');
		var imageURI = img.src;
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
		options.mimeType = "image/jpeg";
		//options.httpMethod = "POST";

		var params = new Object();
		options.params = params;
		options.chunkedMode = false;
		options.headers = {Connection: "close"};
		var ft = new FileTransfer();
		ft.upload(imageURI, "http://democv.softrek.com:8082/clearview-api/external/prospect/1/image/upload?token=f37f22f4-4eea-4c93-a241-2723a879971e", win, fail,
			options);
	} */
	 
