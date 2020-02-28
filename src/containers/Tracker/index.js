import React, { PureComponent, Fragment } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import P from 'components/P';
import Heading from 'components/Heading';
import Loading from 'components/Loading';

import Intro from './Intro';
import Music from './Music';
import { Container, Preloader, Content, CameraAccess, Completed, Skip, Skip2, Button, Text, WebcamIcon, Canvas, GeoLocationAccess, Location, PinIcon } from './styles';
import appConfig from 'app.config';
import { distance } from 'utils/helpers';

gsap.registerPlugin(SplitText);

class Tracker extends PureComponent {
	constructor (props) {
		super(props);

		this.state = {
			sdkLoaded: false,
			musicLoaded: false,
			width: 320,
			height: 240,
			threshold: 25,
			licenseName: '821-870-664-054-046-213-488-674-409-488-476.vlc',
			licenseURL: 'lib/821-870-664-054-046-213-488-674-409-488-476.vlc',
			eyesClosedSession: '',
			eyesClosedCount: 0,
			loadingGeo: false,
			distance: '0 km',
			location: { // Festiviteten i Skien: 59.2094395,9.607377
				latitude: 59.2094395,
				longitude: 9.607377
			},
			geoOptions: {
				maximumAge: 0,
				timeout: 10000,
				enableHighAccuracy: true
			},
			mobile: this.innerWidth < 1000
		};

		this.$preloader = React.createRef();
		this.$canvas = React.createRef();
		this.$status = React.createRef();
		this.$loader = React.createRef();
		this.$ready = React.createRef();
		this.$closeYourEyes = React.createRef();
		this.$completed = React.createRef();
		this.$locationAccess = React.createRef();
		this.$location = React.createRef();

		this._loaded = this._loaded.bind(this);
		this._songEnd = this._songEnd.bind(this);
		this._initStream = this._initStream.bind(this);
		this._canPlayStream = this._canPlayStream.bind(this);
		this._tick = this._tick.bind(this);
		this._introCompleted = this._introCompleted.bind(this);
		this._initGeo = this._initGeo.bind(this);
		this._geolocationSuccess = this._geolocationSuccess.bind(this);
		this._geolocationError = this._geolocationError.bind(this);
		this._watchGeoSuccess = this._watchGeoSuccess.bind(this);
		this._watchGeoError = this._watchGeoError.bind(this);
		this._geoCompleted = this._geoCompleted.bind(this);

		window.callbackDownload = this._loaded;
	}

	componentDidMount () {
		this.music = new Music();
		const { audioHowl } = this.music;

		audioHowl.once('load', () => {
			this.setState({ musicLoaded: true });
		});

		audioHowl.on('end', this._songEnd);

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

	_initGeo () {
		this.setState({ loadingGeo: true }, () => navigator.geolocation.getCurrentPosition(this._geolocationSuccess, this._geolocationError, this.state.geoOptions));
	}

	_geolocationSuccess (position) {
		const { latitude, longitude } = position.coords;
		console.log(`_geolocationSuccess longitude: ${latitude} | latitude: ${longitude}`);
		console.log({ position });

		this._checkLocation(latitude, longitude);
	}

	_geolocationError (error) {
		console.warn(`_geolocationError (${error.code}): ${error.message}`);
	}

	_watchGeo () {
		console.log('_watchGeo');

		gsap.to(this.$locationAccess.current, 0.5, {
			opacity: 0,
			y: 20,
			display: 'none',
			onComplete: () => {
				gsap.fromTo(this.$location.current, 1, {
					display: 'block',
					opacity: 0,
					y: -20
				}, {
					delay: 1,
					opacity: 1,
					y: 0,
					onComplete: () => {
						this.watchPosition = navigator.geolocation.watchPosition(this._watchGeoSuccess, this._watchGeoError, this.state.geoOptions);
					}
				});
			}
		});
	}

	_watchGeoSuccess (position) {
		const { latitude, longitude } = position.coords;
		console.log(`_watchGeoSuccess longitude: ${latitude} | latitude: ${longitude}`);
		console.log({ position });

		this._checkLocation(latitude, longitude);
	}

	_watchGeoError (error) {
		console.warn(`_geolocationError (${error.code}): ${error.message}`);
	}

	_checkLocation (currentLatitude, currentLongitude) {
		const { latitude, longitude } = this.state.location;
		let distanceKm = distance(currentLatitude, currentLongitude, latitude, longitude); // returns km
		// let distanceOutput = distanceKm < 10 ? `${Math.round(distanceKm * 1000)} meter` : `${Math.round(distanceKm)} kilometer`;
		let distanceOutput = `${Math.round(distanceKm * 1000).toLocaleString()} meter`;

		this.setState({ distance: distanceOutput });

		console.log('_checkLocation', distanceOutput, distanceKm);

		if (distanceKm < 1) {
			this._geoCompleted();
		} else {
			if (!this.watchPosition) {
				this._watchGeo();
			}
		}
	}

	_introCompleted () {
		gsap.fromTo(this.$locationAccess.current, 1, {
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

	_geoCompleted () {
		console.log('_geoCompleted');
		if (this.watchPosition) navigator.geolocation.clearWatch(this.watchPosition);

		gsap.to([this.$locationAccess.current, this.$location.current], 0.5, {
			opacity: 0,
			y: 20,
			display: 'none',
			onComplete: () => {
				gsap.fromTo(this.$ready.current, 1, {
					display: 'block',
					opacity: 0,
					y: -20
				}, {
					delay: 1,
					opacity: 1,
					y: 0,
					onComplete: () => {
						// this.setState({ sdkLoaded: true });
					}
				});
			}
		});
	}

	_songEnd () {
		this.setState({
			eyesClosedCount: this.eyesClosedCount,
			eyesClosedSession: '1 minute and 4 seconds'
		});

		gsap.to(this.$closeYourEyes.current, 0.5, {
			opacity: 0,
			display: 'none',
			onComplete: () => {
				gsap.fromTo(this.$completed.current, 1, {
					display: 'block',
					opacity: 0,
					y: -20
				}, {
					delay: 1,
					opacity: 1,
					y: 0,
					onComplete: () => {
						// this.setState({ sdkLoaded: true });
					}
				});
			}
		});
	}

	_readyToCloseEyes () {
		const $el = this.$closeYourEyes.current;
		const splitText = new SplitText($el, { type: 'words', wordsClass: 'word word++' });
		// const wordsCount = splitText.words.length;

		this.closeEyesTimeline = gsap.timeline({
			onComplete: () => {
				this.block = false;
			}
		})
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
		// this.setState({ sdkLoaded: true });

		gsap.fromTo(this.$preloader.current, 1.2, {
			visibility: 'visible',
			y: '100%'
		}, {
			delay: 1,
			y: '0%',
			ease: 'expo.inOut',
			onComplete: () => {
				gsap.set(this.$loader.current, { display: 'none' });

				gsap.to(this.$preloader.current, 1.2, {
					y: '-100%',
					ease: 'expo.inOut',
					onComplete: () => {
						this.setState({ sdkLoaded: true });
					}
				});
			}
		});
	}

	async _initStream () {
		// this.music._play();
		this.music._fadeIn();
		this.block = true;

		gsap.to(this.$ready.current, 0.5, {
			opacity: 0,
			y: 20,
			display: 'none',
			onComplete: async () => {
				// gsap.set(this.$ready.current, { display: 'none' });

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
		this.eyesClosedCount = 0;

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
					this.eyesClosedCount++;
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

		if (!this.block) {
			if (this.eyesClosed) {
				// if (!this.closedForTheFirstTime) this.closeEyesTimeline.reverse();
				// if (!this.closedForTheFirstTime) gsap.to(this.$closeYourEyes.current, 0.5, { opacity: 0 });
				this.closedForTheFirstTime = true;
				this.music._fadeIn();
				this.closeEyesTimeline.reverse();
			} else {
				this.music._fadeOut();
				if (this.closeEyesTimeline && this.closedForTheFirstTime) this.closeEyesTimeline.play();
			}
		}

		// this.$status.current.innerHTML = this.eyesClosed.toString();
	}

	render () {
		return (
			<Container>
				<Preloader ref={this.$preloader} />
				<Content>
					{!this.state.sdkLoaded && <Loading ref={this.$loader}>Laster en ny type opplevelse...</Loading>}
					<Intro sdkLoaded={this.state.sdkLoaded} onComplete={this._introCompleted} />

					<GeoLocationAccess ref={this.$locationAccess}>
						{this.state.loadingGeo ? <Loading /> : <Fragment>
							<Heading rank={2} asRank={4}>Besøk Festiviteten i Skien</Heading>
							<P>For å lytte så må du besøke vårt nye konserthus i Skien.</P>
							<Button onClick={this._initGeo}>
								<PinIcon />Hvor er du nå?
							</Button>
						</Fragment>}
					</GeoLocationAccess>

					<Location ref={this.$location}>
						<Heading rank={2} asRank={4}>Beklager</Heading>
						<P>Du er {this.state.distance} unna. Besøk Festiviteten i Skien.</P>
					</Location>

					<CameraAccess ref={this.$ready}>
						<Heading rank={2} asRank={4}>Er du klar?</Heading>
						<P>Vi må ha tilgang til kameraet ditt for å se om du lukker øynene.</P>
						<Button onClick={this._initStream}>
							<WebcamIcon />Gi kamera tilgang
						</Button>
					</CameraAccess>

					<Completed ref={this.$completed}>
						<Heading rank={2} asRank={4}>We hope you enjoyed {appConfig.SONG_TITLE} by {appConfig.ARTIST_NAME}.</Heading>
						<P>You opened your eyes {this.state.eyesClosedCount} times and your longest consecutive session was {this.state.eyesClosedSession} </P>
					</Completed>

					<Text ref={this.$closeYourEyes}><strong>Close your eyes</strong> to listen.</Text>
				</Content>
				<Canvas ref={this.$canvas} width={this.state.width} height={this.state.height} />
				<Skip onClick={this._songEnd} />
				<Skip2 onClick={this._geoCompleted} />
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
