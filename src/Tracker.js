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
			licenseName: '251-700-611-878-240-511-438-067-770-738-460.vlc',
			licenseURL: 'lib/251-700-611-878-240-511-438-067-770-738-460.vlc'
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
			this.visageModule.FS_createPreloadedFile('/', 'Facial Features Tracker - High.cfg', 'lib/Facial Features Tracker - High.cfg', true, false);
			this.visageModule.FS_createPreloadedFile('/', this.state.licenseName, this.state.licenseURL, true, false, function () {}, function () { console.error('Loading License Failed!'); });
		};

		this.visageModule.preRun.push(preloadFiles);
	}

	_loaded () {
		// license
		this.visageModule.initializeLicenseManager(this.state.licenseName);

		this.m_Tracker = new this.visageModule.VisageTracker('Facial Features Tracker - High.cfg');

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

		this._tick();
	}

	_tick () {
		window.requestAnimationFrame(this._tick);

		// here we should do something with the tracker
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
