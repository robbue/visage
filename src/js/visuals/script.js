var AUDIO_URL, TOTAL_BANDS, analyser, gainNode, looping, gainVal, analyserDataArray, arrCircles, audio, build, buildCircles, changeMode, changeTheme, circlesContainer, cp, createCircleTex, gui, hammertime, init, initAudio, initGUI, initGestures, k, modes, mousePt, mouseX, mouseY, params, renderer, resize, stage, startAnimation, texCircle, themes, themesNames, update, v, windowH, windowW;
var video, canvas, ctx, canvasProperties, colorValues;

var Point = function (x, y){
  this.x = x;
  this.y = y;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

gainVal = {val:1};

AUDIO_URL = "assets/firestone.m4a";

modes = ["cubic", "conic"];

themes = {
  pinkBlue: [0xFF0032, 0xFF5C00, 0x00FFB8, 0x53FF00],
  yellowGreen: [0xF7F6AF, 0x9BD6A3, 0x4E8264, 0x1C2124, 0xD62822],
  yellowRed: [0xECD078, 0xD95B43, 0xC02942, 0x542437, 0x53777A],
  blueGray: [0x343838, 0x005F6B, 0x008C9E, 0x00B4CC, 0x00DFFC],
  blackWhite: [0xFFFFFF, 0x000000, 0xFFFFFF, 0x000000, 0xFFFFFF]
};

themesNames = [];

for (k in themes) {
  v = themes[k];
  themesNames.push(k);
}

params = {
  mode: modes[0],
  theme: themesNames[0],
  radius: 3,
  distance: 600,
  size: .5,
  numParticles: 500,
  sizeW: 1,
  sizeH: 1,
  radiusParticle: 60,
  themeArr: themes[this.theme]
};

TOTAL_BANDS = 256;

cp = new PIXI.Point();

mouseX = 0;

mouseY = 0;

mousePt = new PIXI.Point();

windowW = 0;

windowH = 0;

stage = null;

renderer = null;

texCircle = null;

circlesContainer = null;

arrCircles = [];

hammertime = null;

audio = null;

analyser = null;

analyserDataArray = null;

gui = null;

init = function(v) {

   initVideo(v);
   initUpdate();
  
};

initVideo = function (v){
    canvasProperties = {
      sW:7,
      sH:7
    };

    colorValues = [];

	  video       	= v;
    video.width     = 340;
    video.height    = 256;
    video.autoplay  = true;

   canvas =  document.createElement('canvas');
    // canvas =  document.getElementById('canvas');
    canvas.width     = 680;
    canvas.height    = 256;
    canvas.id = 'canvasID';

    ctx = canvas.getContext('2d');
};

initUpdate = function(){
  updateCanvas();
  initGestures();
  initAudio();
   resize();
   build();
   resize();
   mousePt.x = cp.x;
   mousePt.y = cp.y;
   $(window).resize(resize);
   startAnimation();
};

initAudio = function() {

  var context, source;
  context = new webkitAudioContext();

  // GAIN
  gainNode = context.createGain();
  
  analyser = context.createAnalyser();
  source = null;
  audio = new Audio();
  audio.src = AUDIO_URL;
  audio.addEventListener('canplay', function() {
    var bufferLength;
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    source.connect(context.destination);
	
	 source.connect(gainNode);
    gainNode.connect(context.destination);

    analyser.fftSize = TOTAL_BANDS * 2;
   
    bufferLength = analyser.frequencyBinCount;
    return analyserDataArray = new Uint8Array(bufferLength);
  });
};

startAnimation = function() {
  return requestAnimFrame(update);
};

initGestures = function() {
  return $(window).on('mousemove', function(e) {
    mouseX = e.clientX;
    return mouseY = e.clientY;
  });
};

build = function() {
  stage = new PIXI.Stage(0xffffff);
  renderer = PIXI.autoDetectRenderer($(window).width(), $(window).height());
  // $("body").append(renderer.view);
  texCircle = createCircleTex(0x000fff);
  return buildCircles();
};

buildCircles = function() {
  var circle, i, _i, _ref;
  circlesContainer = new PIXI.DisplayObjectContainer();
  circlesContainer.pivot.x = .5;
  circlesContainer.pivot.y = .5;
  circlesContainer.x = 0;//(window.innerWidth - circlesContainer.width)/2;
  circlesContainer.y = 0;//(window.innerHeight - circlesContainer.width)/2;
  //circlesContainer.rotation = 90 - Math.PI / 2;
  stage.addChild(circlesContainer);

  for (i = 0; i < params.numParticles; ++i){

    circle = new PIXI.Sprite(createCircleTex(0xffffff));
    circle.anchor.x = 0.5;
    circle.anchor.y = 0.5;
    // circle.position.x = circle.xInit = cp.x;
    // circle.position.y = circle.yInit = cp.y;
    circle.mouseRad = Math.random();
    circlesContainer.addChild(circle);
    arrCircles.push(circle);
    
  }

  // return arrCircles;
 return changeTheme(params.theme);
};

updateCircleColors = function (){
  var hex;
 for (var i = 0; i < arrCircles.length; ++i){
    hex = rgbToHex(colorValues[i].r + Math.floor(10*Math.random()), colorValues[i].g+20, Math.min(colorValues[i].b + 50), 255);
    arrCircles[i].tint = '0x'+hex.toString() ;
 }
};

createCircleTex = function(color) {
  var gCircle;
  gCircle = new PIXI.Graphics();
  gCircle.beginFill(color);
  gCircle.drawCircle(0, 0, params.radiusParticle);
  gCircle.endFill();
  return gCircle.generateTexture();
};

resize = function() {
  windowW = $(window).width();
  windowH = $(window).height();
  // cp.x = windowW * .5;
  // cp.y = windowH * .5;
  params.sizeW = windowH * params.size;
  params.sizeH = windowH * params.size;
  changeMode(params.mode);
  if (renderer) {
    return renderer.resize(windowW, windowH);
  }
};

changeTheme = function(name) {

  var circle, group, i, indexColor, padColor, _i, _ref, _results;
  params.themeArr = themes[name];
  indexColor = 0;
  padColor = Math.ceil(params.numParticles / params.themeArr.length);
  _results = [];
  for (i = 0; i < params.numParticles; ++i){
    circle = arrCircles[i];
    group = indexColor * padColor / params.numParticles;
    circle.blendMode = 10; //params.theme === "blackWhite" ? PIXI.blendModes.NORMAL : PIXI.blendModes.ADD;
    // circle.indexBand = Math.round(group * (TOTAL_BANDS - 156)) - 1;
    circle.indexBand = Math.round(group * (Math.random() * TOTAL_BANDS)) - 1;
    circle.s = (Math.random() + (params.themeArr.length - indexColor) * 0.2) * 0.1;
    circle.scale = new PIXI.Point(circle.s, circle.s);
    if (i % padColor === 0) {
      indexColor++;
    }
    _results.push(circle);
  }
  return _results;
};

changeMode = function(value) {
  var angle, circle, i, _i, _ref, _results;
  if (!arrCircles || arrCircles.length === 0) {
    return;
  }
  if (!value) {
    value = modes[Math.floor(Math.random() * modes.length)];
  }
  params.mode = value;
  _results = [];


  var numX = Math.floor(canvas.width / canvasProperties.sW);
  var numY = Math.floor(canvas.height / canvasProperties.sH);

  var j = 0;
  var k = 0;
  var index = 0;

   for (var x = 0; x <  canvas.width; x += canvasProperties.sW) {
    for (var y = 0; y <  canvas.height;  y += canvasProperties.sH) {
      circle = arrCircles[index];
      circle.xInit = x * 2;
      circle.yInit = y * 2;

      index++;
    }
  }

  circlesContainer.x = (window.innerWidth - circlesContainer.width)/2;
  circlesContainer.y = (window.innerHeight - circlesContainer.height)/2;


  return _results;
};

updateCanvas = function (){

    ctx.drawImage(this.video, 0, 0, video.videoWidth, video.videoHeight);
  
    var startPos ;
        
    var startposHex = 0;

    var index = 0;
    var updateIndex = 0;
    var squareIndex = 0;

    var canvasW = canvas.width;
    var canvasH = canvas.height;

    var imageData = ctx.getImageData(0, 0, canvasW, canvasH);

     for (var x = 0; x <  canvasW; x += canvasProperties.sW) {
       for (var y = 0; y <  canvasH;  y += canvasProperties.sH) {

        index = 4 * (x + y * canvasW);

       // startPos = new Point(x, y);
        
        colorValues[squareIndex] = {
          r : imageData.data[index],
          g : imageData.data[index+1],
          b : imageData.data[index+2],
          id : index
        }

        // for (var j = x; j <  x+canvasProperties.sW; ++j) {
        //   for (var k = y; k <  y+canvasProperties.sH;  ++k) {
        //     updateIndex = 4 * (j + k * canvasW);

        //     imageData.data[updateIndex] = imageData.data[index];// + (.075 * (j+k));
        //     imageData.data[updateIndex+1] = imageData.data[index+1];// + (.055 * (j+k));
        //     imageData.data[updateIndex+2] = imageData.data[index+2];// + (.025 * (j+k));
        //   }
        // }

        squareIndex++;
       }
     }

     params.numParticles = colorValues.length;
     //this.ctx.putImageData(imageData, 0, 0);
  };

var gVal = 10;
var index = 0;
var goal = 0.2;
var dista = -0.001;
var len = 15;

var angle, circle, dist, dx, dy, i, n, r, scale, xpos, ypos, _i, _ref;

update = function(time) {
  TWEEN.update(time);

  //gVal = 1.5 * (1+Math.sin(time));

  if( video.readyState === video.HAVE_ENOUGH_DATA ){
        updateCanvas();
        updateCircleColors();
  }
 
	  requestAnimFrame(update);

	  if (analyserDataArray) {
	    analyser.getByteFrequencyData(analyserDataArray);
	  }
	  // if (mouseX > 0 && mouseY > 0) {
	  //   mousePt.x += (mouseX - mousePt.x) * 0.03;
	  //   mousePt.y += (mouseY - mousePt.y) * 0.03;
	  // }
    // for (i = _i = 0, _ref = params.numParticles - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
	  for (i = 0; i < params.numParticles; ++i) {
	    circle = arrCircles[i];
	    if (analyserDataArray) {

	      n = analyserDataArray[circle.indexBand];
        // scale = ((n / 256) * circle.s * 2)  * Math.max(gainVal.val*(gVal * Math.random()), 0);
	      scale = ((n / 256) * circle.s * 2)  * Math.max(gainVal.val*1.3, 0);
	    } else {
	      scale = (circle.s * .1) * Math.max(gainVal.val, 0);
	    }
	    scale *= (params.radius) * gainVal.val*Math.random();
	    circle.scale.x += ((scale - circle.scale.x) * 0.3) * Math.max(gainVal.val, 0);
	    circle.scale.y = (circle.scale.x) * Math.max(gainVal.val, 0);
	    // dx = mousePt.x - circle.xInit;
	    // dy = mousePt.y - circle.yInit;
	    // dist = Math.sqrt(dx * dx + dy * dy);
	    // angle = Math.atan2(dy, dx);
	    // r = circle.mouseRad * params.distance + 30;
	    // xpos = circle.xInit; //circle.xInit - Math.cos(angle) * r;
	    // ypos = circle.yInit; //circle.yInit - Math.sin(angle) * r;
      // circle.position.x += (xpos - circle.position.x) * 0.1;
	    circle.position.x = circle.xInit + (len * (goal*Math.cos(index)));
      // circle.position.y += (ypos - circle.position.y) * 0.1
	    circle.position.y = circle.yInit + (len * (goal*Math.sin(index++)));

      goal += dista;
      len += dista*2;

      if(goal < -0.02 || goal > 0.02){
        dista *= -1;
      }
	  }
	  return renderer.render(stage);
};

var playstarted = false;
var gfxAdded = false;

playAudio = function(){
  if(!playstarted){
    console.log("play audio");
    audio.play();
    fadeIn();

    playstarted = true;

    if(!gfxAdded){
      $("body").append(renderer.view);
      gfxAdded = true;
    }
  }
  
};

pauseAudio = function(){
  if(playstarted){
      console.log("pause Audio")
      fadeOut();
      playstarted = false;
  }
};

var tween ;

fadeIn = function(){
	console.log("fade in");
	var self = this;
	tween = new TWEEN.Tween( gainVal )
    .to( { val:1 }, 250)
    .easing( TWEEN.Easing.Quartic.Out )
    .onUpdate( updateGain )
    .start();
// audio.play();
};

fadeOut = function(){
	console.log("fade out");
	tween = new TWEEN.Tween( gainVal )
    .to( { val:-1 }, 250)
    .easing( TWEEN.Easing.Quartic.Out )
    .onUpdate( updateGain )
    .onComplete( stopSound)
    .start();
 //audio.pause();
};

stopSound = function (){
  audio.pause();
}

stopLoop = function (){
	 looping = false 
};

updateGain = function (){
	gainNode.gain.value = gainVal.val;
};