import { Howl, Howler } from 'howler';

import appConfig from 'app.config';

export default class Music {
	constructor (props) {
		this.loaded = false;

		this._load = this._load.bind(this);
		this._loaded = this._loaded.bind(this);
		this._play = this._play.bind(this);
		this._pause = this._pause.bind(this);
		this._fadeIn = this._fadeIn.bind(this);
		this._fadeOut = this._fadeOut.bind(this);
		this._resumeCtx = this._resumeCtx.bind(this);

		this._init();
	}

	_init () {
		Howler.autoUnlock = false;
		Howler.autoSuspend = false;

		this.audioHowl = new Howl({
			src: [appConfig.AUDIO_FILE],
			volume: 0,
			loop: true,
			autoplay: false
		});

		this.audioHowl.on('load', this._loaded);
	}

	_load (callback) {
		this.loadedCallback = callback;

		if (this.loaded) {
			this._loaded();
		}
	}

	_loaded () {
		this.loaded = true;
		this.audioHowl.off('load', this._loaded);

		if (Howler.usingWebAudio === true && Howler.ctx) {
			Howler.ctx.addEventListener('statechange', this._resumeCtx);
		}

		this.loadedCallback();

		// this._start();
	}

	_resumeCtx () {
		// const state = Howler.ctx.state;
		// console.log('%c HOWLER STATE CHANGE', 'background: red; color: white; font-size: 20px', state);

		if (typeof Howler.ctx !== 'undefined' && Howler.ctx) {
			if (Howler.ctx.state === 'suspended') {
				Howler.ctx.resume();
			}
		}
	}

	_play () {
		console.log('_play');
		this.audio = this.audioHowl.play();
		// this.audioHowl.fade(0.0, 1.0, 5000, this.audio);
	}

	_pause () {
		if (this.audio) this.audioHowl.pause(this.audio);
	}

	_fadeIn () {
		if (this.fadedIn) return;
		this.fadedIn = true;
		this.fadedOut = false;

		// console.log('_fadeIn', this.audioHowl._volume);
		this.audioHowl.off('fade');

		this.audio = this.audioHowl.play(this.audio);
		this.audioHowl.fade(this.audioHowl._volume, 1.0, 1000); // , this.audio
	}

	_fadeOut () {
		if (this.fadedOut) return;
		this.fadedOut = true;
		this.fadedIn = false;

		// console.log('_fadeOut', this.audioHowl._volume);
		this.audioHowl.off('fade');

		this.audioHowl.once('fade', (id) => {
			this.audioHowl.pause(this.audio).volume(0.0);
		});

		this.audioHowl.fade(this.audioHowl._volume, 0.0, 1000); // .pause(this.audio).volume(0.0) , this.audio
	}
}
