/* 
Project: Kygo

Author: Robert Bue & Thomas Nordahl
		Good Morning
*/
var site = site || {};
var tracking = false;
var self = this;

$(document).ready(function(){

	site.soundId = 'song';
	site.eyesOpen = 0;
	site.eyesClosed = 0;
	site.bodyEl = document.getElementById("body");

	//$('.button-start').hide();

	// createjs.Sound.on("fileload", loadHandler);
	// createjs.Sound.registerSound("assets/firestone.m4a", site.soundId);
	// function loadHandler(event) {
	// 	site.sound = createjs.Sound.play(site.soundId);
	// 	site.sound.pause();

	// 	$('.button-start').show();
	// 	//instance.volume = 0.5;
	// }

	site.eyeTracking = new EyeTracking();

	$(site.eyeTracking).on("pause", function(){
		pauseAudio();
	});

	$(site.eyeTracking).on("play", function(){
		playAudio();
	});

	$('.button-start').on('click', function() {
		if(!tracking){
			site.eyeTracking.startTracker();
			tracking = true;

			init(site.eyeTracking.video);
		};
	});
});

/*
* Callback method mentioned in the documentation. 
* Gets executed after all the preparation is done (all the files have been downloaded) and tracker is ready to start tracking.
* In this case it enables buttons on the page.
*/
function callbackDownload(){
	
	if ( site.downloadComplete ) {
		return;
	}

	site.downloadComplete = true;

	console.log('callbackDownload');

	$('body').addClass("loading-complete");

	
}