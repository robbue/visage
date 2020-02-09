import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { rem, em } from 'polished';

import P from 'components/P';
import Heading from 'components/Heading';
import Loading from 'components/Loading';
import { ReactComponent as Webcam } from 'assets/svg/webcam.svg';

import Intro from './Intro';
import Music from './Music';
import { colors, fontWeights, fontFaces, fontSizes } from 'styles/index';

gsap.registerPlugin(SplitText);

const Container = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

const Content = styled.div`
	position: absolute;
	z-index: 2;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const CameraAccess = styled.div`
	text-align: center;
	display: none;
`;

const Button = styled.button`
	display: inline-flex;
	align-items: center;
	font-size: ${rem('13px')};
	font-weight: ${fontWeights.medium};
	text-transform: uppercase;

	padding: ${rem('12px')} ${rem('15px')};
	margin-top: ${em('15px')};
	cursor: pointer;

	border: 1px solid ${colors.light};
`;

const Text = styled.p`
	font-family: ${fontFaces.header};
	font-size: ${rem(fontSizes.large)};
	color: ${colors.text};
	line-height: 1.8;

	padding: 0 ${rem('25px')};
	margin: 0;
	display: none;
`;

const WebcamIcon = styled(Webcam)`
	width: ${em('23px')};
	height: ${em('23px')};
	margin-right: ${em('15px')};

	path, circle {
		fill: ${colors.grey};
	}
`;

const Canvas = styled.canvas``;
const Status = styled.p``;

class Tracker extends PureComponent {
	constructor (props) {
		super(props);

		this.state = {
			sdkLoaded: false,
			musicLoaded: false,
			width: 320,
			height: 240,
			threshold: 25,
			licenseName: '606-555-833-692-564-758-653-442-720-253-644.vlc',
			licenseURL: 'lib/606-555-833-692-564-758-653-442-720-253-644.vlc'
		};

		this.$canvas = React.createRef();
		this.$status = React.createRef();
		this.$loader = React.createRef();
		this.$ready = React.createRef();
		this.$closeYourEyes = React.createRef();

		this._loaded = this._loaded.bind(this);
		this._initStream = this._initStream.bind(this);
		this._canPlayStream = this._canPlayStream.bind(this);
		this._tick = this._tick.bind(this);
		this._introCompleted = this._introCompleted.bind(this);

		window.callbackDownload = this._loaded;
	}

	componentDidMount () {
		this.music = new Music();

		this.music._load(() => {
			console.log('this.music', this.music);
			this.setState({ musicLoaded: true });
		});

		var locateFile = function (dataFileName) {
			var relativePath = 'lib/' + dataFileName;
			return relativePath;
		};

		this.visageModule = window.VisageModule({
			onRuntimeInitialized: this._loaded,
			locateFile: locateFile
		});

		var preloadFiles = () => {
			// the most powerful devices such as newer computers, or mobile devices such as iPhone X/Samsung Galaxy S9.
			// this.visageModule.FS_createPreloadedFile('/', 'FFT-Ultra.cfg', 'lib/Facial Features Tracker - Ultra.cfg', true, false);
			// most computers and mobile devices such as iPhone 6/Samsung Galaxy S5 or better
			this.visageModule.FS_createPreloadedFile('/', 'FFT-High.cfg', 'lib/Facial Features Tracker - High.cfg', true, false);
			// low performance mobile devices such as iPhone4S. Tracks head pose, mouth, eyebrows and eye motion.
			// this.visageModule.FS_createPreloadedFile('/', 'FFT-Low.cfg', 'lib/Facial Features Tracker - Low.cfg', true, false);
			this.visageModule.FS_createPreloadedFile('/', this.state.licenseName, this.state.licenseURL, true, false, function () {}, function () { console.error('Loading License Failed!'); });
		};

		this.visageModule.preRun.push(preloadFiles);
	}

	_introCompleted () {
		gsap.fromTo(this.$ready.current, 1, {
			display: 'block',
			opacity: 0,
			y: -20
		}, {
			opacity: 1,
			y: 0,
			onComplete: () => {
				// this.setState({ sdkLoaded: true });
			}
		});
	}

	_readyToCloseEyes () {
		const $el = this.$closeYourEyes.current;
		const splitText = new SplitText($el, { type: 'words', wordsClass: 'word word++' });
		// const wordsCount = splitText.words.length;

		this.closeEyesTimeline = gsap.timeline()
		.set($el, { display: 'block' })
		.from(splitText.words, { duration: 2, opacity: 0, y: 3, ease: 'power2', stagger: 0.1 }, 'words');
		// .to(splitText.words, { duration: 0.2, opacity: 0, ease: 'power2', stagger: 0.1 }) // , 'words+=2'
		// .set($el, { display: 'none' });
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
		this.music._play();

		gsap.to(this.$ready.current, 0.5, {
			opacity: 0,
			y: 20,
			onComplete: async () => {
				gsap.set(this.$ready.current, { display: 'none' });

				this.$video = document.createElement('video');

				try {
					const stream = await navigator.mediaDevices.getUserMedia({
						video: true,
						audio: false
					});

					this.$video.addEventListener('canplay', this._canPlayStream);
					this.$video.setAttribute('muted', true);
					this.$video.setAttribute('playsinline', true);
					this.$video.srcObject = stream;
					this.$video.load();
				} catch (error) {
					this._errorStream(error);
				}
			}
		});
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
		this._readyToCloseEyes();
	}

	_tick () {
		window.requestAnimationFrame(this._tick);

		// Draw to canvas
		this.canvasContext.drawImage(this.$video, 0, 0, this.mWidth, this.mHeight);

		// Access pixel data
		this.imageData = this.canvasContext.getImageData(0, 0, this.mWidth, this.mHeight).data;

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
		);

		// console.log(this.trackerReturnState && this.trackerReturnState[0]);
		// console.log(this.faceData.getEyeClosure());

		if (this.trackerReturnState[0] === this.visageModule.VisageTrackerStatus.TRACK_STAT_OK.value) {
			const closedEyes = this.faceData.getEyeClosure();
			// Index 0 represents closure of left eye. Index 1 represents closure of right eye. Value of 1 represents open eye. Value of 0 represents closed eye.

			if (closedEyes[0] === 0 && closedEyes[1] === 0) {
				if (this.eyesClosedCounter > this.state.threshold) {
					this.eyesClosed = true;
				} else {
					this.eyesClosedCounter++;
				}
			} else {
				this.eyesClosedCounter = 0;
				this.eyesClosed = false;
			}
		} else {
			this.eyesClosedCounter = 0;
			this.eyesClosed = false;
		}

		if (this.eyesClosed) {
			// if (!this.closedForTheFirstTime) this.closeEyesTimeline.reverse();
			if (!this.closedForTheFirstTime) gsap.to(this.$closeYourEyes.current, 0.5, { opacity: 0 });
			this.closedForTheFirstTime = true;
			this.music._fadeIn();
		} else {
			this.music._fadeOut();
		}

		// this.$status.current.innerHTML = this.eyesClosed.toString();
	}

	render () {
		return (
			<Container>
				<Content>
					{!this.state.sdkLoaded && <Loading ref={this.$loader}>Loading...</Loading>}
					<Intro sdkLoaded={this.state.sdkLoaded} onComplete={this._introCompleted} />

					<CameraAccess ref={this.$ready}>
						<Heading rank={2} asRank={4}>Are you ready?</Heading>
						<P>We need access to your webcam to be able to track if you close your eyes.</P>
						<Button onClick={this._initStream}>
							<WebcamIcon />Give camera access
						</Button>
					</CameraAccess>

					<Text ref={this.$closeYourEyes}><strong>Close your eyes</strong> to listen.</Text>
				</Content>
				<Canvas ref={this.$canvas} width={this.state.width} height={this.state.height} />
			</Container>
		);

		// return (
		// 	<Container>
		// 		<Intro sdkLoaded={this.state.sdkLoaded} />
		// 		<Status ref={this.$status} />
		// 		<Canvas ref={this.$canvas} width={this.state.width} height={this.state.height} />
		// 		<Container>
		// 			{this.state.sdkLoaded && <Button onClick={this._initStream}>Start</Button>}
		// 		</Container>
		// 	</Container>
		// );
	}
}

export default Tracker;
