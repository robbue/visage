import React from 'react';
import styled from 'styled-components';

import { drawFaceFeatures, checkFrameDuplicate } from './trackingHelpers';

const Button = styled.button``;
const Canvas = styled.canvas``;

class Tracker extends React.Component {
	constructor (props) {
		super(props);

		this.$canvas = React.createRef();

		this._loaded = this._loaded.bind(this);
		this._initStream = this._initStream.bind(this);
		this._canPlayStream = this._canPlayStream.bind(this);
		this._tick = this._tick.bind(this);

		window.callbackDownload = this._loaded;

		this.trackerReturnState = 'TRACK_STAT_OFF';

		this.frameSample = [0, 0, 0, 0, 0];
		this.newSample = [0, 0, 0, 0, 0];
	}

	componentDidMount () {
		this.canvasContext = this.$canvas.current.getContext('2d');
		console.log('this.canvasContext', this.canvasContext);
	}

	_loaded () {
		if (this.libLoaded) return;

		this.libLoaded = true;
	}

	async _initStream () {
		let stream = null;
		this.$video = document.createElement('video');

		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false
			});

			this.$video.addEventListener('canplay', this._canPlayStream);
			this.$video.loop = this.$video.muted = this.$video.autoplay = true;
			this.$video.srcObject = stream;
			this.$video.load();
		} catch (error) {
			this._errorStream(error);
		}

		console.log('_initStream', stream);
	}

	_errorStream (error) {
		if (error) console.error(error);
	}

	_canPlayStream (stream) {
		this.startTracking = true;
		this.draw = true;

		this.$video.removeEventListener('canplay', this._canPlayStream);

		this.$video.play();

		this.$canvas.current.width = 320;
		this.$canvas.current.height = 240;

		this.mWidth = 320;
		this.mHeight = 240;

		// this.ppixels = Module._malloc(this.mWidth*this.mHeight*4);
		// this.pixels = new Uint8Array(Module.HEAPU8.buffer, this.ppixels, this.mWidth*this.mHeight*4);

		// set up tracker and licensing, valid license needs to be provided
		this.m_Tracker = new window.Tracker('visage/lib/FFT - HighPerformance.cfg');
		this.m_Tracker.initializeLicenseManager('visage/793-401-250-653-493-419-970-561-320-170-965.vlc');
		this.faceData = new window.FaceData();

		console.log('this.faceData', this.faceData);

		// Use request animation frame mechanism - slower but with smoother animation
		this._tick();
	}

	_tick () {
		window.requestAnimationFrame(this._tick);

		// console.log('processFrame')

		this.$canvas.current.width = this.mWidth;
		// this.startTracking;

		// Draws an image from cam on the canvas
		this.canvasContext.drawImage(this.$video, 0, 0, this.mWidth, this.mHeight);

		// Access pixel data
		this.imageData = this.canvasContext.getImageData(0, 0, this.mWidth, this.mHeight).data;

		// Save pixel data to preallocated buffer
		// for (i = 0; i < this.imageData.length; i += 4) {
		// 	average = 0.299 * this.imageData[i] + 0.587 * this.imageData[i + 1] + 0.114 * this.imageData[i + 2];
		// 	this.pixels[i] = this.imageData[i];
		// }

		// Alternative way to save pixel data, seems faster but not consistent
		// pixels.set(imageData);

		// Check for duplicate frames (camera only gives out 30 FPS)
		var frameIsDuplicate = false;
		if (this.frameSample.length !== 0) {
			this.newSample = [];
			for (var i = 1; i < 4; i++) {
				this.newSample.push(this.imageData[this.mHeight/(4/i)+(this.mWidth*4)/(4/1)]);
				this.newSample.push(this.imageData[this.mHeight/(4/i)+(this.mWidth*4)/(4/2)]);
				this.newSample.push(this.imageData[this.mHeight/(4/i)+(this.mWidth*4)/(4/3)]);
			}
			frameIsDuplicate = checkFrameDuplicate(this.newSample, this.frameSample);

			this.frameSample = this.newSample.slice(0);
		} else {
			this.frameSample = [];
			for (var i = 1; i < 4; i++) {
				this.frameSample.push(this.imageData[this.mHeight/(4/i)+(this.mWidth*4)/(4/1)]);
				this.frameSample.push(this.imageData[this.mHeight/(4/i)+(this.mWidth*4)/(4/2)]);
				this.frameSample.push(this.imageData[this.mHeight/(4/i)+(this.mWidth*4)/(4/3)]);
			}
		}

		// Call Update() if ready to start tracking and frame is new
		if (this.startTracking === true && frameIsDuplicate === false){
			this.trackerReturnState = this.m_Tracker.track(this.mWidth, this.mHeight, this.ppixels, this.faceData);
		}

		//Draw based upon data if tracker status is OK
		console.log(this.startTracking, this.trackerReturnState, this.draw, this.faceData);
		if (this.startTracking === true && this.trackerReturnState === 'TRACK_STAT_OFF'){
			if (this.draw === true) {
				drawFaceFeatures(this.faceData.featurePoints2D);
			}
		}
	}

	render () {
		return (
			<React.Fragment>
				<Button onClick={this._initStream}>Start</Button>
				<Canvas ref={this.$canvas} width="320" height="240" />
			</React.Fragment>
		);
	}
}

export default Tracker;
