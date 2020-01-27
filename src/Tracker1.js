import React from 'react';
import styled from 'styled-components';

// import { drawFaceFeatures, checkFrameDuplicate } from './trackingHelpers';

const Button = styled.button``;
const Canvas = styled.canvas``;

class Tracker extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			sdkLoaded: false,
			licenseName: '251-700-611-878-240-511-438-067-770-738-460.vlc',
			licenseURL: '251-700-611-878-240-511-438-067-770-738-460.vlc',
			maxFacesTracker: 1
		};

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
		var locateFile = function (dataFileName) {
			var relativePath = 'visage/lib/' + dataFileName;
			return relativePath;
		};

		this.visageModule = window.VisageModule({
			onRuntimeInitialized: this._loaded,
			locateFile: locateFile
		});

		var preloadFiles = () => {
			this.visageModule.FS_createPreloadedFile('/', 'Facial Features Tracker - High.cfg', 'Facial Features Tracker - High.cfg', true, false);
			this.visageModule.FS_createPreloadedFile('/', this.state.licenseName, this.state.licenseURL, true, false, function () {}, function () { console.error('L;oading License Failed!'); });
		};

		this.visageModule.preRun.push(preloadFiles);

		this.canvasContext = this.$canvas.current.getContext('2d');
		// console.log('this.canvasContext', this.canvasContext);
	}

	_loaded () {
		console.log('_loaded', this.visageModule);

		// license
		this.visageModule.initializeLicenseManager(this.state.licenseName);

		this.m_Tracker = new this.visageModule.VisageTracker('Facial Features Tracker - High.cfg');

		// Instantiate the face data object
		this.faceDataArray = new this.visageModule.FaceDataVector();
		this.faceDataArray.push_back(new this.visageModule.FaceData());

		this.frameWidth = this.$canvas.current.width;
		this.frameHeight = this.$canvas.current.height;

		// Allocate memory for image data
		this.ppixels = this.visageModule._malloc(this.mWidth * this.mHeight * 4);

		// Create a view to the memory
		this.pixels = new Uint8ClampedArray(this.visageModule.HEAPU8.buffer, this.ppixels, this.mWidth * this.mHeight * 4);

		// this.ppixels = this.visageModule._malloc(this.mWidth * this.mHeight * 4);

		// this.m_Tracker = new this.visageModule.VisageTracker('Facial Features Tracker - High.cfg');
		// const maxFacesTracker = 1;
		//
		// this.TfaceDataArray = new window.VisageModule.FaceDataVector();
		// for (var i = 0; i < maxFacesTracker; ++i) {
		// 	this.TfaceDataArray.push_back(new window.VisageModule.FaceData());
		// }

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

		this._tick();
	}

	_tick () {
		window.requestAnimationFrame(this._tick);

		// console.log('processFrame')
		// this.trackerReturnState = this.m_Tracker.track(
		// 	this.mWidth, this.mHeight, this.ppixels, this.TfaceDataArray,
		// 	this.visageModule.VisageTrackerImageFormat.VISAGE_FRAMEGRABBER_FMT_RGBA.value,
		// 	this.visageModule.VisageTrackerOrigin.VISAGE_FRAMEGRABBER_ORIGIN_TL.value,
		// 	0,
		// 	-1,
		// 	this.state.maxFacesTracker
		// );
	}

	render () {
		return (
			<React.Fragment>
				{this.state.sdkLoaded && <Button onClick={this._initStream}>Start</Button>}
				<Canvas ref={this.$canvas} width="320" height="240" />
			</React.Fragment>
		);
	}
}

export default Tracker;
