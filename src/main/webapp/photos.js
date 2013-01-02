function Photos() {
	var self = this,

	uploadExisting = function() {
		console.log("Photos::uploadExisting()");
		self.capture(navigator.camera.PictureSourceType.SAVEDPHOTOALBUM);
	},
	takePhoto = function() {
		console.log("Photos::takePhoto()");
		self.capture(navigator.camera.PictureSourceType.CAMERA);
	},
	capture = function(sourceType) {
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
		var fail, ft, options, params, win;
		// callback for when the photo has been successfully uploaded:
		var success = function(response) {
			alert("Your photo has been uploaded!");
		};
		// callback if the photo fails to upload successfully.
		var fail = function(error) {
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
				console.log('success! ' + response);
			}
		}).error(function(data) {
			console.log("error: " + ko.toJSON(data, null, 2));
		});
	},
	onCaptureFail = function(message) {
		alert("Failed because: " + message);
	};
}