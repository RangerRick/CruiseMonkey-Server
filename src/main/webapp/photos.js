function Photos() {
	"use strict";
	var self = this,

	uploadExisting = function() {
		"use strict";
		console.log("Photos::uploadExisting()");
		self.capture(navigator.camera.PictureSourceType.SAVEDPHOTOALBUM);
	},
	takePhoto = function() {
		"use strict";
		console.log("Photos::takePhoto()");
		self.capture(navigator.camera.PictureSourceType.CAMERA);
	},
	capture = function(sourceType) {
		"use strict";
		navigator.camera.getPicture(
			self.onCaptureSuccess,
			self.onCaptureFail,
			{
				destinationType: navigator.camera.DestinationType.DATA_URL,
				sourceType: sourceType,
				correctOrientation: true
			}
		);
	},
	onCaptureSuccess = function(imageData) {
		"use strict";
		var ft, options, params, win;
		// callback for when the photo has been successfully uploaded:
		var success = function(response) {
			"use strict";
			alert("Your photo has been uploaded!");
		};
		// callback if the photo fails to upload successfully.
		var fail = function(error) {
			"use strict";
			alert("An error has occurred: Code = " + error.code);
		};
		
		$.ajax({
			url: serverModel.cruisemonkey() + '/rest/cruisemonkey/photos',
			timeout: m_timeout,
			cache: false,
			data: imageData,
			processData: false,
			type: 'POST',
			contentType: 'multipart/form-data',
			mimeType: 'multipart/form-data',
			success: function(response) {
				"use strict";
				console.log('success! ' + response);
			}
		}).error(function(data) {
			"use strict";
			console.log("error: " + ko.toJSON(data, null, 2));
		});
	},
	onCaptureFail = function(message) {
		"use strict";
		alert("Failed because: " + message);
	};
}