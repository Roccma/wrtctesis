'use strict';

var constraints = {
	video : true
};

const hdConstraint = {
	video : {
		width : 1280,
		height : {
			min : 720
		}
	}
};

var video = document.querySelector('video');

function handleSuccess(stream){
	video.srcObject = stream;
}

function handleError(error){
	console.log('getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(hdConstraint).then(handleSuccess).catch(handleError);