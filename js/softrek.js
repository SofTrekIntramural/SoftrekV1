   /*
    * Authors: Tom Ludwig &
    * Project: Softrek Photo Upload
    * Description: Program using Phonegap to upload pictures to a server                                 
                   and allow tag and search functionality
	* Install: Add this file to the js folder, also replace 
	           index.html with the provided one	           
    * TODO:	 - Need to implement uploading securely to server, and search 
             functionality	
			 - Comment code 
	* Notes: Photo access works
    */
	
	// Source variables for pictures and storage type
	var pictureSource; 
    var destinationType;  

    // Create listener and wait for the device to be ready
    document.addEventListener("deviceready", onDeviceReady, false);

    // Must wait for until device is ready and this function is called
    function onDeviceReady() {
		console.log(navigator.camera);
		
		// set the sources for readability
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
    }
	
	// Need to decide where to call this 
	function clearCache() {
		navigator.camera.cleanup();
	}
 
 
    // Successfully took picture, so set it to image variable
	// in html file and display it
    function onPicCaptureSuccess(imageData) {
        /* 
		var date = ""
        var d = new Date();
        date = "" + d.getDate() + "-" + (d.getMonth() + 1) + "-"
                + d.getFullYear();
        //alert(date)
        //alert(imageData);  
        */
	
        // get and set img id is myImage
        var myImage = document.getElementById('myImage');
		
        // Unhide image elements
        myImage.style.display = 'block';

        // set the picture source which displays it
        myImage.src = "data:image/jpeg;base64," + imageData;

        //alert("data:image/jpeg;base64," + imageData)	
		
		/*
		//This part is for saving the capture photo
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

		alert("HI");
        // Show the captured photo
        myImage.src =  imageURI;
    }
	
    // Failure
    function onFail(message) {
        alert('Failed because: ' + message);
    }


    /*-------------------------------------------------------------------------------------------*/
	/*----------------------- BUTTON FUNCTIONS --------------------------------------------------*/
	/*-------------------------------------------------------------------------------------------*/

    // Button to call function to take picture
    function takePic() {
		alert("hi");
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

	// TODO
	function uploadPic(source) {
		var win = function (r) {
			console.log("Code = " + r.responseCode);
			console.log("Response = " + r.response);
			console.log("Sent = " + r.bytesSent);
		}

		var fail = function (error) {
			alert("An error has occurred: Code = " + error.code);
			console.log("upload error source " + error.source);
			console.log("upload error target " + error.target);
		}

		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
		options.mimeType = "text/plain";

		var params = {};
		params.value1 = "test";
		params.value2 = "param";

		options.params = params;

		var ft = new FileTransfer();
		ft.upload(fileURL, encodeURI("http://some.server.com/upload.php"), win, fail, options);
    }


