import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Howler } from 'howler';
import { gsap } from 'gsap';
import { HALF_PI, rand, fadeInOut, angle, lerp } from 'utils/helpers';
import Sketch from 'Sketch';
const { cos, sin } = Math;

const Canvas = styled.canvas`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

const BackgroundContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	canvas {
		position: absolute;
		z-index: 99;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
`;

export default class Background extends PureComponent {
	constructor (props) {
		super(props);

		this.state = {
			particleCount: 700,
			particlePropCount: 9,
			particlePropsLength: 700 * 9,
			baseTTL: 100,
			rangeTTL: 500,
			baseSpeed: 0.1,
			rangeSpeed: 1,
			baseSize: 2,
			rangeSize: 10,
			baseHue: 0,
			rangeHue: 1,
			noiseSteps: 2,
			xOff: 0.0025,
			yOff: 0.005,
			zOff: 0.0005,
			backgroundColor: 'rgb(255, 255, 255)',
			hue: 225
		};

		this.$canvasB = React.createRef();
		this.$status = React.createRef();
		this.$background = React.createRef();

		// this._loaded = this._loaded.bind(this);
		this._next = this._next.bind(this);
		this._draw = this._draw.bind(this);
		this._play = this._play.bind(this);
		this._pause = this._pause.bind(this);
		this._mouseMove = this._mouseMove.bind(this);
	}

	componentDidMount () {
		window.addEventListener('mousemove', this._mouseMove, false);

		const music = Howler._howls[0];
		console.log('_howls', Howler._howls, music);
		music.on('play', this._play);
		music.on('pause', this._pause);
		// music.on('volume', this._next);

		this._createCanvas();
		this._resize();
		this._initParticles();
		this._draw();

		// this._webgl();
	}

	_webgl () {
		this.sketch = new Sketch({
			el: this.$background.current,
			bgCanvas: this.canvas,
			duration: 1,
			debug: true,
			uniforms: {
				radius: { value: 0.9, type: 'f', min: 0.1, max: 2 },
				width: { value: 0.35, type: 'f', min: 0.0, max: 1 }
			},
			fragment: `
				uniform float progress;
				uniform float width;
				uniform float transition;
				uniform float radius;
				uniform sampler2D texture1;
				uniform sampler2D texture2;
				uniform vec4 resolution;
				varying vec2 vUv;
				varying vec4 vPosition;
				float parabola( float x, float k ) {
					return pow( 4. * x * ( 1. - x ), k );
				}
				void main()	{
				vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
				vec2 p = newUV;
				vec2 start = vec2(0.5,0.5);
				vec2 aspect = resolution.wz;
				vec2 uv = newUV;
				float dt = parabola(progress, 1.);
				float prog = progress*0.66;
				float circ = 1. - smoothstep(-width, 0.0, radius * distance(start*aspect, uv*aspect) - prog*(1.+width));
				float intpl = pow(abs(circ), 1.);
				vec4 t1 = texture2D( texture1, (uv - 0.5) * (1.0 - intpl) + 0.5 ) ;
				vec4 t2 = texture2D( texture2, (uv - 0.5) * intpl + 0.5 );
				gl_FragColor = mix( t1, t2, intpl );
			}
			`
		});

		console.log({ sketch: this.sketch });
	}

	_createCanvas () {
		this.canvas = {
			a: document.createElement('canvas'),
			b: this.$canvasB.current
		};

		this.ctx = {
			a: this.canvas.a.getContext('2d'),
			b: this.canvas.b.getContext('2d')
		};

		this.center = [];
	}

	_initParticles () {
		this.particleProps = new Float32Array(this.state.particlePropsLength);

		let i;

		for (i = 0; i < this.state.particlePropsLength; i += this.state.particlePropCount) {
			this._initParticle(i);
		}
	}

	_initParticle (i) {
		let theta, x, y, vx, vy, life, ttl, speed, size, hue;

		x = rand(this.canvas.a.width);
		y = rand(this.canvas.a.height);
		theta = angle(x, y, this.center[0], this.center[1]);
		vx = cos(theta) * 6;
		vy = sin(theta) * 6;
		life = 0;
		ttl = this.state.baseTTL + rand(this.state.rangeTTL);
		speed = this.state.baseSpeed + rand(this.state.rangeSpeed);
		size = this.state.baseSize + rand(this.state.rangeSize);
		hue = this.state.baseHue + rand(this.state.rangeHue);

		this.particleProps.set([x, y, vx, vy, life, ttl, speed, size, hue], i);
	}

	_drawParticles () {
		let i;

		for (i = 0; i < this.state.particlePropsLength; i += this.state.particlePropCount) {
			this._updateParticle(i);
		}
	}

	_updateParticle (i) {
		let i2 = 1 + i, i3 = 2 + i, i4 = 3 + i, i5 = 4 + i, i6 = 5 + i, i7 = 6 + i, i8 = 7 + i, i9 = 8 + i;
		let x, y, theta, vx, vy, life, ttl, speed, x2, y2, size, hue;

		x = this.particleProps[i];
		y = this.particleProps[i2];
		theta = angle(x, y, this.center[0], this.center[1]) + 0.75 * HALF_PI;
		vx = lerp(this.particleProps[i3], 2 * cos(theta), 0.05);
		vy = lerp(this.particleProps[i4], 2 * sin(theta), 0.05);
		life = this.particleProps[i5];
		ttl = this.particleProps[i6];
		speed = this.particleProps[i7];
		x2 = x + vx * speed;
		y2 = y + vy * speed;
		size = this.particleProps[i8];
		hue = this.particleProps[i9];

		this._drawParticle(x, y, theta, life, ttl, size, hue);

		life++;

		this.particleProps[i] = x2;
		this.particleProps[i2] = y2;
		this.particleProps[i3] = vx;
		this.particleProps[i4] = vy;
		this.particleProps[i5] = life;

		life > ttl && this._initParticle(i);
	}

	_drawParticle (x, y, theta, life, ttl, size, hue) {
		let xRel = x - (0.5 * size), yRel = y - (0.5 * size);

		this.ctx.a.save();
		this.ctx.a.lineCap = 'round';
		this.ctx.a.lineWidth = 1;
		// this.ctx.a.strokeStyle = `hsla(10,10%,10%,${fadeInOut(life, ttl)})`;
		// this.ctx.a.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
		this.ctx.a.strokeStyle = `rgba(${this.hue || this.state.hue}, 225, 225, ${fadeInOut(life, ttl)})`;
		this.ctx.a.beginPath();
		this.ctx.a.translate(xRel, yRel);
		this.ctx.a.rotate(theta);
		this.ctx.a.translate(-xRel, -yRel);
		this.ctx.a.strokeRect(xRel, yRel, size, size);
		this.ctx.a.closePath();
		this.ctx.a.restore();
	}

	_renderGlow () {
		this.ctx.b.save();
		this.ctx.b.filter = 'blur(8px) brightness(300%)';
		this.ctx.b.globalCompositeOperation = 'darken';
		this.ctx.b.drawImage(this.canvas.a, 0, 0);
		this.ctx.b.restore();

		this.ctx.b.save();
		this.ctx.b.filter = 'blur(4px) brightness(300%)';
		this.ctx.b.globalCompositeOperation = 'darken';
		this.ctx.b.drawImage(this.canvas.a, 0, 0);
		this.ctx.b.restore();
	}

	_render () {
		this.ctx.b.save();
		this.ctx.b.globalCompositeOperation = 'darken';
		this.ctx.b.drawImage(this.canvas.a, 0, 0);
		this.ctx.b.restore();
	}

	_draw () {
		this.tick++;

		this.ctx.a.clearRect(0, 0, this.canvas.a.width, this.canvas.a.height);

		this.ctx.b.fillStyle = this.state.backgroundColor;
		this.ctx.b.fillRect(0, 0, this.canvas.a.width, this.canvas.a.height);

		this._drawParticles();
		this._renderGlow();
		this._render();

		window.requestAnimationFrame(this._draw);
	}

	_mouseMove (event) {
		this.center = [event.pageX, event.pageY];
	}

	_play () {
		// this._next();

		// this.hue = 10;
	}

	_pause () {
		// this._next();
		// this.hue = 192;
	}

	_next () {
		console.log('_next');
		// if (this.sketch.isRunning) return;
		this.sketch.isRunning = true;
		let len = this.sketch.textures.length;
		let nextTexture = this.sketch.textures[(this.sketch.current + 1) % len];
		this.sketch.material.uniforms.texture2.value = nextTexture;
		let tl = gsap.timeline();
		tl.to(this.sketch.material.uniforms.progress, this.sketch.duration, {
			value: 1,
			ease: 'power2.inOut',
			onComplete: () => {
				this.sketch.current = (this.sketch.current + 1) % len;
				this.sketch.material.uniforms.texture1.value = nextTexture;
				this.sketch.material.uniforms.progress.value = 0;
				this.sketch.isRunning = false;
			}
		});
	}

	_resize () {
		const { innerWidth, innerHeight } = window;

		this.canvas.a.width = innerWidth;
		this.canvas.a.height = innerHeight;

		this.ctx.a.drawImage(this.canvas.b, 0, 0);

		this.canvas.b.width = innerWidth;
		this.canvas.b.height = innerHeight;

		this.ctx.b.drawImage(this.canvas.a, 0, 0);

		// this.center[0] = 0.5 * this.canvas.a.width;
		// this.center[1] = 0.5 * this.canvas.a.height;
	}

	render () {
		return (
			<BackgroundContainer ref={this.$background}>
				<Canvas ref={this.$canvasB} width={this.state.width} height={this.state.height} />
			</BackgroundContainer>
		);
	}
}
