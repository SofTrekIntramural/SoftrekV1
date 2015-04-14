/*
    Copyright (c) 2012-2014 Adobe Systems Incorporated. All rights reserved.
    http://www.apache.org/licenses/LICENSE-2.0
	 
    * Authors: Softrek Student Dev Team
    * Project: Softrek Photo Upload
    * Description: Program using Phonegap to upload pictures to a server                                 
                   and allow tag and search functionality
	* Install: replace index.html with the provided one	also
               add softrek.js to js folder	
    * TODO:	 -
	* Notes: Some functions do not work in IE11  
*/	
	// Source variables for pictures and storage type
	var pictureSource; 
    var destinationType;  
	var imageArray = [];
	var delFormArray = [];
	var imageArrBound = 0;
	var imageCounter = 0;

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
	// THE TWO FUNCTIONS BELOW ARE FOR TESTING ONLY
	/*
	function dataURItoBlob(dataURI)
	{
		var byteString = atob(dataURI.split(',')[1]);

		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++)
		{
			ia[i] = byteString.charCodeAt(i);
		}

		var bb = new Blob([ab], { "type": mimeString });
		return bb;
	}

	function loadImageFileAsURL()
	{
		var filesSelected = document.getElementById("inputFileToLoad").files;
		if (filesSelected.length > 0)
		{
			var fileToLoad = filesSelected[0];

			var fileReader = new FileReader();

			fileReader.onload = function(fileLoadedEvent) 
			{
				var textAreaFileContents = document.getElementById("textAreaFileContents");
		        //var blob = dataURItoBlob(fileLoadedEvent.target.result);
				textAreaFileContents.innerHTML = blob;
				document.getElementById("inputFileToLoad").files[0] = fileLoadedEvent.target.result;
			};

			fileReader.readAsDataURL(fileToLoad);
		}
	}
	*/

	// LOGIN 
	function ulogin(){
	//$(document).ready(function () {
		//$("#uLogin").click(function (e) {
			//e.preventDefault(); //Prevent Default action	
			var uName=document.getElementById("username").value;
			var uPass=document.getElementById("password").value;
			
			//window.location="main.html";
			$.ajax({
				url: "http://democv.softrek.com:8082/clearview-api/j_spring_security_check",
				type: 'POST',
				data:  'j_username='+uName+'&j_password='+uPass+'&tenant-name=dev&app-name=ClearView&app-version=2.4.6-SNAPSHOT',
				contentType: "application/x-www-form-urlencoded",
				//cache: false,
				//mimeType:"multipart/form-data", 
				//dataType: "json", 
				//processData:false,
				complete: function(xhr){ 
					//console.log(xhr.getAllResponseHeaders());
					//console.log(xhr.responseText);
					//console.log(xhr.statusCode());
				},
				success: function(data, textStatus, jqXHR)
				{
					//console.log(jqXHR.readyState);
					//console.log(jqXHR.status);
					//console.log(jqXHR.statusText);
					//console.log(jqXHR.responsetext);
					console.log(data.search("ClearView - Login") != -1);
	
					if(!(data.search("ClearView - Login") != -1)) {
						alert("authentication success");
						//window.location="main.html";					
						var x = document.createElement("iframe");
						
						x.addEventListener('load', function(){ 			
							alert("hi");
							var token = x.contentWindow.document.getElementById('token_EXTERNAL_API').getElementsByTagName('span');	//
							//for(var i = 0; i < token.length; i++){
							console.log("global token is " + token[0].innerHTML);
							var leToken = token[0].innerHTML;
							//use local storage
							//document.cookie = 'cookie1=test; expires=Fri, 6 Mar 2015 20:47:11 UTC; path=/'; //= "token=" + token[0].innerHTML;
							window.localStorage.setItem("key", leToken);
							var keyToken = window.localStorage.getItem("key");
						    window.location="main.html";
						});
						x.style.setProperty('display', 'none')
						x.setAttribute("src", "http://democv.softrek.com:8082/clearview-api/view/settings/tokens"); 
						document.getElementById("leindex").appendChild(x);
				
					} else {
						alert("authentication failure");
					}
				},
				error: function(jqXHR, textStatus, errorThrown)
				{
					alert("Check your internet connection.");
				}         
			});
						
						
		//e.unbind();
		//});   
	//});
	}

	// GET NEXT Pic
	function getNextPic(){
		var leimage = document.getElementById('myImage');
		var delformTrans = document.getElementById('delTrans');
		
		if(imageCounter < imageArrBound){
			leimage.src = imageArray[imageCounter];
			delformTrans = delFormArray[imageCounter];
			imageCounter++;
		}
		else{
			imageCounter = 0;
			leimage.src = imageArray[imageCounter];
			delformTrans = delFormArray[imageCounter];
		}
	}
	
	// SET THE UPLOAD/DELETE IMAGE IDNUMBER
	function setProfileAccount(idnum, keyToken){
		var upform = document.getElementById('upload-form');
		var delformID = document.getElementById('delID');
		upform.action = "http://democv.softrek.com:8082/clearview-api/external/prospect/" + idnum + "/image/upload?token=" + keyToken;
		//upform.action = "http://democv.softrek.com:8082/clearview-api/external/prospect/1/image/upload?token=f37f22f4-4eea-4c93-a241-2723a879971e";
		delformID.value = idnum;
				var x = document.createElement("iframe");
						
				x.addEventListener('load', function(){ 			
				x.contentWindow.document.getElementById('softrek_Tools_0_softrek_tools_VisualTool_0_label').click();
				//var token = x.contentWindow.document.getElementsByClassName('colsingle_cont'); //.getElementsByTagName( 'div' )[0];
				});
						//x.style.setProperty('display', 'none')
						x.height = 380;
						x.width = 220;
						x.setAttribute("src", "http://democv.softrek.com:8082/clearview-api/view/prospect/1/attachments"); 
						document.getElementById("uploadPanel").appendChild(x);
		
	}
	
	// QUERY SERVER FOR PROFILE PICTURE
	// UNFORTUNATELY, THE API CALL DOESN'T RETURN ALL
	// THE PICTURES THAT HAVE BEEN UPLOADED?
	// HACK TIME: LOAD AN IFRAME AND VIEW SOURCE...
    function updateProfilePic(idnum, keyToken){
		var id = idnum;
		var leimage = document.getElementById('myImage');
		var delformTrans = document.getElementById('delTrans');
		// INTERNAL API CALL
		//var queryURL = "http://democv.softrek.com:8082/clearview-api/view/prospect/" + idnum  + "/attachments";
		// EXTERNAL API CALL 
		var queryURL = "http://democv.softrek.com:8082/clearview-api/external/prospect/" + idnum +"/images?token=" + keyToken;
		var request = new XMLHttpRequest();
		
		// SET THE ACCOUNT IDS
		setProfileAccount(id, keyToken);
		
		// CLEAR THE ORIGINAL PICTURE
		leimage.src = "";
		
		try{
			request.open("GET", queryURL, true);
			request.timeout = 10000;
			request.ontimeout = function () { alert("server is overloaded..."); }
			
			request.onreadystatechange = function() { // Call a function when the state changes.
				if (request.readyState == 4) {
					if (request.status == 200 || request.status == 0) {
						try{			
							console.log("Response is " + request.responseText);
							var ledata = JSON.parse(request.response);
							alert(ledata.length);
							console.log("encoded pic " + ledata[0].documentContent);
							imageArrBound = ledata.length;
							
							for(var i = 0; i < ledata.length; i++) {
								delformTrans.value = ledata[i].transnum;
								leimage.src = "data:image/jpeg;base64," + ledata[i].documentContent;
								if(ledata[i].documentContent == null)
									leimage.src = "data:image/jpeg;base64," + ledata[i].attachmentData;
								
								imageArray.push(leimage.src);
								delFormArray.push(ledata[i].transnnum);
							}
							
							console.log(leimage.src);
						} catch(err) {
							alert("No image found.");
							leimage.src = "img/default-avatar.png";
						}			
					}
				}
				//else{ alert("Server is overloaded..."); }
			}	
			request.send();
		} catch(e) { alert("error: " + e); }
	}	
	
    // SEARCH DATABASE FOR USERS
    function findUsers() {
		// GET THE Token
		var keyToken = window.localStorage.getItem("key");
		alert("token is " + keyToken)
        // GET TEXTBOX HANDLE TO ADD TO QUERY
        var userQuery = document.getElementById('myFilter').value;
		var queryURL = "http://democv.softrek.com:8082/clearview-api/external/prospect/search?token=" + keyToken + "&q=" + userQuery;
		//alert("user called");
		console.log("FIND USER: Query is " + queryURL);
		//var items="";
		//var searchTable = $('#jsontable').dataTable();
		var request = new XMLHttpRequest();
		try{
			request.open("GET", queryURL, true);
			request.timeout = 10000;
			request.ontimeout = function () { alert("server is overloaded..."); }
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
										updateProfilePic(this.idnum, keyToken);								
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
		} catch(e) { alert("error: " + e); }
			
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
	 
