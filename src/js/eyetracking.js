var EyeTracking = function() {

   var self = this;

   console.log('Class: EyeTracking');

   self.initEyetracking();

   self.canvas = document.getElementById('canvas');

   return self;
}

EyeTracking.prototype.video = null;
EyeTracking.prototype.canvas = null;
EyeTracking.prototype.playing = false;

EyeTracking.prototype.initEyetracking = function() {

    var self = this;

    console.log('initEyetracking');

    //VARS
    //**********
    self.fpsOut = document.getElementById('boldStuff');
    self.fpsTracker = document.getElementById('fpsTracker');
    self.transOutput = document.getElementById('myTrans');
    self.rotOutput = document.getElementById('myRot');
    self.statOutput = document.getElementById('myStat');
    self.canvas = document.getElementById('canvas');

    self.mWidth = 0,
    self.mHeight = 0;
        
    self.fps = 0,
    self.now = 0, 
    self.lastUpdate = 0
    self.fpsFilter = 50;
        
    self.canCon = self.canvas.getContext('2d');   
    self.startTracking = false;
    self.draw = true;
    self.eyesOpen = 0;

    var CHIN_POINTS = "#8080FF",
        INNER_LIP_POINTS    =   "#EC0000",
        OUTER_LIP_POINTS    =   "#EC0000",
        NOSE_COLOR          =   "#646464",
        IRIS_COLOR          =   "#FFFF64",
        EYES_COLOR          =   "#FF8F20",
        EYES_COLOR_CLOSED   =   "#FF0000",
        CHEEKS_COLOR        =   "#646464",
        EYEBROWS_COLOR      =   "#E3FE49",
        HAIR_COLOR          =   "#646464",
        GAZE_COLOR          =   "#00FF00";
        
    var styles = {'LINE' : 0, 'LINELOOP' : 1, 'POINT' : 2}
        
    /*
    * Draw lines using canvas draw methods
    */
    function drawPoints2D(points, pointsNum, style, featurePoints2D, color)
    {
        self.canCon.beginPath();
        self.canCon.closePath();
        
        var n = 0;
        for (var i = 0; i < pointsNum*2; i+=2){
            if (featurePoints2D.fp[points[i]][points[i+1]-1].defined === 1){
                var x = featurePoints2D.fp[points[i]][points[i+1]-1].pos[0]*self.canvas.width;
                var y = (1 - featurePoints2D.fp[points[i]][points[i+1]-1].pos[1])*self.canvas.height;
                if (style === styles.POINT){
                    self.canCon.beginPath();
                    self.canCon.fillStyle = color;
                    self.canCon.arc(x,y,1,0,2*Math.PI,true);
                    self.canCon.closePath();
                    self.canCon.fill();
                }
                if (style === styles.LINE){
                    if (n%2 === 0){
                        self.canCon.beginPath();
                        self.canCon.moveTo(x,y);
                    }
                    else {
                        self.canCon.lineTo(x,y);
                        self.canCon.strokeStyle = color;
                        self.canCon.stroke();
                        self.canCon.closePath();
                    }
                }
                if (style === styles.LINELOOP){
                    if (n==0){
                        self.canCon.beginPath();
                        self.canCon.moveTo(x,y);
                    }
                    else{
                        self.canCon.lineTo(x,y);
                        self.canCon.strokeStyle = color;
                        self.canCon.stroke();
                        self.canCon.closePath();
                        self.canCon.beginPath();
                        self.canCon.moveTo(x,y);
                    }
                }
                n++;
            }
        }
                
        if (style == styles.LINELOOP){
            var x = featurePoints2D.fp[points[0]][points[1]-1].pos[0]*self.canvas.width;
            var y = (1 - featurePoints2D.fp[points[0]][points[1]-1].pos[1])*self.canvas.height;
            self.canCon.lineTo(x,y);
            self.canCon.strokeStyle = color;
            self.canCon.stroke();
            self.canCon.closePath();
        }
    }

    /*
    * Draw facial features
    */
    function drawFaceFeatures(featurePoints2D)
    {

        if(self.faceData.eyeClosure[0] == 1 && self.faceData.eyeClosure[1] == 1)
        {
            //if eye is open, draw the iris
            var irisPoints = [
                3,  5,
                3,  6,
            ]
            drawPoints2D(irisPoints, 2,styles.POINT, featurePoints2D,IRIS_COLOR);
        }

        var eyesPoints = [
            3,  1,
            3,  2,
            3,  3,
            3,  4,
            3,  7,
            3,  8,
            3,  9,
            3,  10,
            3,  11,
            3,  12,
            3,  13,
            3,  14,
        ]
        var eyesLinesPoints1 = [
            3,  12,
            3,  14,
            3,  8,
            3,  10,
        ]
        var eyesLinesPoints2 = [
            3,  12,
            3,  2,
            3,  8,
            3,  4,
        ]
        var eyesLinesPoints3 = [
            3,  11,
            3,  13,
            3,  7,
            3,  9,
        ]
        var eyesLinesPoints4 = [
            3,  11,
            3,  1,
            3,  7,
            3,  3,
        ]

        if(self.faceData.eyeClosure[0] == 1 && self.faceData.eyeClosure[1] == 1){

            self.eyesOpen++;

            drawPoints2D(eyesPoints, 12, styles.POINT,featurePoints2D,EYES_COLOR);
            drawPoints2D(eyesLinesPoints1, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR);
            drawPoints2D(eyesLinesPoints2, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR);
            drawPoints2D(eyesLinesPoints3, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR);
            drawPoints2D(eyesLinesPoints4, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR);
            


            if ( self.eyesOpen > 15 && self.playing) {

                console.log('self.eyesOpen:', self.eyesOpen);
                // site.sound.pause();
                $(self).trigger("pause");
                $('.loading-text').removeClass("fadeOut");

                self.playing = false;
            }
        }
        else if(self.faceData.eyeClosure[0] == 0 && self.faceData.eyeClosure[1] == 0)
        {

            drawPoints2D(eyesPoints, 12, styles.POINT,featurePoints2D,EYES_COLOR_CLOSED);
            drawPoints2D(eyesLinesPoints1, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR_CLOSED);
            drawPoints2D(eyesLinesPoints2, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR_CLOSED);
            drawPoints2D(eyesLinesPoints3, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR_CLOSED);
            drawPoints2D(eyesLinesPoints4, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR_CLOSED);

            if(!self.playing){
                self.eyesOpen = 0;
                // site.sound.play();
                $(self).trigger("play");
                $('.loading-text').addClass("fadeOut");

                self.playing = true;
            }
            
        }
    }

    var timeme = false;
    var trackerReturnState = "TRACK_STAT_OFF";

    self.frameSample = [0,0,0,0,0];
    self.newSample = [0,0,0,0,0];
    self.ppixels,
    self.pixels;

    /*
    * Compares two samples of 5 pixel values 
    */
    function checkFrameDuplicate(newSample){
        for (var i = 0; i <  newSample.length; i+=2){
            if (newSample[i]!==self.frameSample[i])
                return false;
        }
        //additional check
        for (var i = 1; i < newSample.length; i+= 2)
        {
            if (newSample[i]!==self.frameSample[i])
                return false;
        }
        return true;
    }

    /*
    *Method that is called on every frame via requestAnimationFrame mechanism.
    *Draws camera image on the canvas, takes the pixel data, sends them to the tracker and finally, depending on the result, draws the results.
    *Rudimentary timing is implemented to be activated on button click and it also checks for duplicate frames.
    */
    self.processFrame = function(){
        window.requestAnimationFrame(self.processFrame);

        //console.log('processFrame')

        self.canvas.width = self.mWidth;self.startTracking
        //Draws an image from cam on the canvas
        self.canCon.drawImage(self.video, 0, 0, self.mWidth, self.mHeight);
        
        //Access pixel data 
        self.imageData = self.canCon.getImageData(0,0, self.mWidth, self.mHeight).data;
        
        //Save pixel data to preallocated buffer
        for(i=0; i<self.imageData.length; i+=4)
        {
            average = 0.299*self.imageData[i] + 0.587*self.imageData[i+1] + 0.114*self.imageData[i+2];
            self.pixels[i] = self.imageData[i];
        }
        
        //Alternative way to save pixel data, seems faster but not consistent
        //pixels.set(imageData);
        
        //Check for duplicate frames (camera only gives out 30 FPS)
        var frameIsDuplicate = false;
        if (self.frameSample.length !== 0){
            self.newSample = [];
            for (var i= 1; i < 4; i++){
                self.newSample.push(self.imageData[self.mHeight/(4/i)+(self.mWidth*4)/(4/1)]);
                self.newSample.push(self.imageData[self.mHeight/(4/i)+(self.mWidth*4)/(4/2)]);
                self.newSample.push(self.imageData[self.mHeight/(4/i)+(self.mWidth*4)/(4/3)]);
            }
            frameIsDuplicate = checkFrameDuplicate(self.newSample);
            
            self.frameSample = self.newSample.slice(0);
        }       
        else{
            frameSample = [];
            for (var i= 1; i < 4; i++){
                self.frameSample.push(self.imageData[self.mHeight/(4/i)+(self.mWidth*4)/(4/1)]);
                self.frameSample.push(self.imageData[self.mHeight/(4/i)+(self.mWidth*4)/(4/2)]);
                self.frameSample.push(self.imageData[self.mHeight/(4/i)+(self.mWidth*4)/(4/3)]);
            }
        }
        
        //Call Update() if ready to start tracking and frame is new
        if (self.startTracking===true && frameIsDuplicate===false){
            trackerReturnState = self.m_Tracker.track(self.mWidth, self.mHeight, self.ppixels, self.faceData);
        }
        
        //Draw based upon data if tracker status is OK
        if (self.startTracking===true && trackerReturnState==="TRACK_STAT_OK"){
            if (self.draw === true){
                drawFaceFeatures(self.faceData.featurePoints2D);
            }
        }
      
    }
}

EyeTracking.prototype.startTracker = function() {

    console.log('startTracker');

    var self = this;

    self.startTracking = true;

    self.m_Tracker;
    self.faceData;
    self.imageData;

    self.video = document.createElement('video');

    //Handlers for camera communication
    //callback methods for getUserMedia : deniedStream, errorStream, startStream
    //**************************************************************************

    //Alerts the user when there is no camera
    function deniedStream(){
        alert("Camera access denied!)");
    }
    //Pushes error to the console when there is error with camera access
    function errorStream(e){
        if (e){
            console.error(e);
        }
    }

    //Is triggered when cam stream is successfully fetched
    //NOTE: Can be buggy, try to increase the value from 1000ms to some higher value in that case
    function startStream(stream){
        TweenMax.to('.bg, .button-start', 0.2, { autoAlpha: 0 });

        TweenMax.fromTo('.text-1', 0.2, { autoAlpha: 0, display: 'block' }, { autoAlpha: 1 });

        self.video.addEventListener('canplay', function DoStuff() {
            self.video.removeEventListener('canplay', DoStuff, true);
            setTimeout(function() {
                
                self.video.play();
        
                self.canvas.width = 320;
                self.canvas.height = 240;
                
                self.mWidth = 320;
                self.mHeight = 240;

                /*self.canvas.width = self.video.videoWidth;
                self.canvas.height = self.video.videoHeight;
                
                self.mWidth = self.video.videoWidth;
                self.mHeight = self.video.videoHeight;*/
                
                self.ppixels = Module._malloc(self.mWidth*self.mHeight*4);
                self.pixels = new Uint8Array(Module.HEAPU8.buffer, self.ppixels, self.mWidth*self.mHeight*4);
                
                //set up tracker and licensing, valid license needs to be provided
                self.m_Tracker = new Tracker("visage/lib/FFT - HighPerformance.cfg");
                //self.m_Tracker.initializeLicenseManager("585-603-040-440-174-699-862-212-691-262-812.vlc");
                self.faceData = new FaceData();
        
                //Use request animation frame mechanism - slower but with smoother animation
                self.processFrame();

                TweenMax.to('.loading-text', 0.2, { className: "+=fadein", onComplete: function() {
                    TweenMax.to('.text-1', 0.2, { delay: 1, autoAlpha: 0, onComplete: function() {
                        TweenMax.fromTo('.text-2', 0.2, { autoAlpha: 0, display: 'block' }, { autoAlpha: 1 });
                    }});
                }});


                

                //Use set interval mechanism - faster but depends on browser usage, choppy
                //setInterval(self.processFrame,1);
            }, 1000);
        }, true);
            
        var domURL = window.URL || window.webkitURL;
        self.video.src = domURL ? domURL.createObjectURL(stream) : stream;
            
        self.video.play();
    }

    //Different browser support for fetching camera stream
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia_ =  navigator.getUserMedia || navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia || navigator.msGetUserMedia;
                              

    //Here is where the stream is fetched
    try {
        navigator.getUserMedia_({
            video: true,
            audio: false
        }, startStream, deniedStream);
    } catch (e) {
        try {
            navigator.getUserMedia_('video', startStream, deniedStream);
        } catch (e) {
            errorStream(e);
        }
    }
    self.video.loop = self.video.muted = true;
    self.video.autoplay = true;
    self.video.load();
}

EyeTracking.prototype.stopTracker = function() {
    var self = this;

    self.startTracking = false;
}