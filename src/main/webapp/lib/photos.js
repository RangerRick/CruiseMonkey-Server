/**
 * @constructor
 */
function Photos() {
	'use strict';
	var self = this,
		uploadExisting,
		takePhoto,
		capture,
		onCaptureSuccess,
		onCaptureFail;

	uploadExisting = function _uploadExisting() {
		'use strict';
		console.log('Photos::uploadExisting()');
		self.capture(navigator.camera.PictureSourceType.SAVEDPHOTOALBUM);
	};
	takePhoto = function _takePhoto() {
		'use strict';
		console.log('Photos::takePhoto()');
		self.capture(navigator.camera.PictureSourceType.CAMERA);
	};
	capture = function _capture(sourceType) {
		'use strict';
		navigator.camera.getPicture(
			self.onCaptureSuccess,
			self.onCaptureFail,
			{
				destinationType: navigator.camera.DestinationType.DATA_URL,
				sourceType: sourceType,
				correctOrientation: true
			}
		);
	};
	onCaptureSuccess = function _onCaptureSuccess(imageData) {
		'use strict';
		var ft, options, params, win;
		// callback for when the photo has been successfully uploaded:
		var success = function _success(response) {
			'use strict';
			alert('Your photo has been uploaded!');
		};
		// callback if the photo fails to upload successfully.
		var fail = function _fail(error) {
			'use strict';
			alert('An error has occurred: Code = ' + error.code);
		};

		$.ajax({
			url: app.server.serverModel.cruisemonkey() + '/rest/cruisemonkey/photos',
			timeout: m_timeout,
			cache: false,
			data: imageData,
			processData: false,
			type: 'POST',
			contentType: 'multipart/form-data',
			mimeType: 'multipart/form-data',
			success: function _success(response) {
				'use strict';
				console.log('success! ' + response);
			}
		}).error(function _error(data) {
			'use strict';
			console.log('error: ' + ko.toJSON(data, null, 2));
		});
	};
	onCaptureFail = function _onCaptureFail(message) {
		'use strict';
		alert('Failed because: ' + message);
	};
}
