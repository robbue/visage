import React from 'react';
import styled from 'styled-components';

const Button = styled.button``;
const Canvas = styled.canvas``;

class Tracker extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			sdkLoaded: false,
			width: 320,
			height: 240,
			threshold: 15,
			licenseName: '606-555-833-692-564-758-653-442-720-253-644.vlc',
			licenseURL: 'lib/606-555-833-692-564-758-653-442-720-253-644.vlc'
		};

		this.$canvas = React.createRef();

		this._loaded = this._loaded.bind(this);
		this._initStream = this._initStream.bind(this);
		this._canPlayStream = this._canPlayStream.bind(this);
		this._tick = this._tick.bind(this);

		window.callbackDownload = this._loaded;
	}

	componentDidMount () {
		var locateFile = function (dataFileName) {
			var relativePath = 'lib/' + dataFileName;
			return relativePath;
		};

		this.visageModule = window.VisageModule({
			onRuntimeInitialized: this._loaded,
			locateFile: locateFile
		});

		var preloadFiles = () => {
			this.visageModule.FS_createPreloadedFile('/', 'FFT-High.cfg', 'lib/Facial Features Tracker - High.cfg', true, false);
			this.visageModule.FS_createPreloadedFile('/', this.state.licenseName, this.state.licenseURL, true, false, function () {}, function () { console.error('Loading License Failed!'); });
		};

		this.visageModule.preRun.push(preloadFiles);
	}

	_loaded () {
		// license
		this.visageModule.initializeLicenseManager(this.state.licenseName);

		this.m_Tracker = new this.visageModule.VisageTracker('FFT-High.cfg');

		// Instantiate the face data object
		this.faceDataArray = new this.visageModule.FaceDataVector();
		this.faceData = new this.visageModule.FaceData();
		this.faceDataArray.push_back(this.faceData);

		this.mWidth = this.$canvas.current.width;
		this.mHeight = this.$canvas.current.height;

		// Allocate memory for image data
		this.ppixels = this.visageModule._malloc(this.mWidth * this.mHeight * 4);

		// Create a view to the memory
		this.pixels = new Uint8ClampedArray(this.visageModule.HEAPU8.buffer, this.ppixels, this.mWidth * this.mHeight * 4);

		// Canvas ctx
		this.canvasContext = this.$canvas.current.getContext('2d');

		this.eyesClosed = false;
		this.eyesClosedCounter = 0;

		// Show Start button
		this.setState({ sdkLoaded: true });
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
	}

	_errorStream (error) {
		if (error) console.error(error);
	}

	_canPlayStream (stream) {
		this.startTracking = true;
		this.draw = true;

		this.$video.removeEventListener('canplay', this._canPlayStream);

		this.$video.play();

		this.$canvas.current.width = this.state.width;
		this.$canvas.current.height = this.state.height;

		this.mWidth = this.state.width;
		this.mHeight = this.state.height;

		// setTimeout(this._tick, 1000);
		this._tick();
	}

	_tick () {
		window.requestAnimationFrame(this._tick);

		this.canvasContext.drawImage(this.$video, 0, 0, this.mWidth, this.mHeight);

		// Access pixel data
		this.imageData = this.canvasContext.getImageData(0, 0, this.mWidth, this.mHeight).data;

		// Clear canvas
		// this.canvasContext.clearRect(0, 0, this.$canvas.current.width, this.$canvas.current.height);

		// Save pixel data to preallocated buffer
		for (let i = 0; i < this.imageData.length; i += 4) {
			this.pixels[i] = this.imageData[i];
		}

		// console.log({
		// 	readyStatus: this.visageModule.VisageTrackerStatus.TRACK_STAT_OK.value,
		// 	getConfiguration: this.m_Tracker.getConfiguration(),
		// 	mWidth: this.mWidth,
		// 	mHeight: this.mHeight,
		// 	ppixels: this.ppixels,
		// 	faceData: this.faceDataArray,
		// 	VISAGE_FRAMEGRABBER_FMT_RGBA: this.visageModule.VisageTrackerImageFormat.VISAGE_FRAMEGRABBER_FMT_RGBA.value,
		// 	VISAGE_FRAMEGRABBER_ORIGIN_TL: this.visageModule.VisageTrackerOrigin.VISAGE_FRAMEGRABBER_ORIGIN_TL.value
		// });

		this.trackerReturnState = this.m_Tracker.track(
			this.mWidth,
			this.mHeight,
			this.ppixels,
			this.faceDataArray,
			this.visageModule.VisageTrackerImageFormat.VISAGE_FRAMEGRABBER_FMT_RGBA.value,
      this.visageModule.VisageTrackerOrigin.VISAGE_FRAMEGRABBER_ORIGIN_TL.value
			// 0,
			// -1,
			// 1
		);

		// console.log(this.trackerReturnState && this.trackerReturnState[0]);
		// console.log(this.faceData.getEyeClosure());

		if (this.trackerReturnState[0] === this.visageModule.VisageTrackerStatus.TRACK_STAT_OK.value) {
			const closedEyes = this.faceData.getEyeClosure();
			// Index 0 represents closure of left eye. Index 1 represents closure of right eye. Value of 1 represents open eye. Value of 0 represents closed eye.

			if (closedEyes[0] === 0 && closedEyes[1] === 0) {
				this.eyesClosedCounter++;

				if (this.eyesClosedCounter > this.state.threshold) {
					this.eyesClosed = true;
				}
			} else {
				this.eyesClosed = false;
			}

			console.log({
				eyesClosed: this.eyesClosed
			});
		}

		/*
		NEXT:
			- install howler and gsap
			fade in sound and DOM
		*/
	}

	render () {
		return (
			<React.Fragment>
				{this.state.sdkLoaded && <Button onClick={this._initStream}>Start</Button>}
				<Canvas ref={this.$canvas} width={this.state.width} height={this.state.height} />
			</React.Fragment>
		);
	}
}

export default Tracker;
