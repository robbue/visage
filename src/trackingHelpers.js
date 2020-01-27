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
		this.canCon.beginPath();
		this.canCon.closePath();

		var n = 0;
		for (var i = 0; i < pointsNum*2; i+=2){
				if (featurePoints2D.fp[points[i]][points[i+1]-1].defined === 1){
						var x = featurePoints2D.fp[points[i]][points[i+1]-1].pos[0]*this.canvas.width;
						var y = (1 - featurePoints2D.fp[points[i]][points[i+1]-1].pos[1])*this.canvas.height;
						if (style === styles.POINT){
								this.canCon.beginPath();
								this.canCon.fillStyle = color;
								this.canCon.arc(x,y,1,0,2*Math.PI,true);
								this.canCon.closePath();
								this.canCon.fill();
						}
						if (style === styles.LINE){
								if (n%2 === 0){
										this.canCon.beginPath();
										this.canCon.moveTo(x,y);
								}
								else {
										this.canCon.lineTo(x,y);
										this.canCon.strokeStyle = color;
										this.canCon.stroke();
										this.canCon.closePath();
								}
						}
						if (style === styles.LINELOOP){
								if (n==0){
										this.canCon.beginPath();
										this.canCon.moveTo(x,y);
								}
								else{
										this.canCon.lineTo(x,y);
										this.canCon.strokeStyle = color;
										this.canCon.stroke();
										this.canCon.closePath();
										this.canCon.beginPath();
										this.canCon.moveTo(x,y);
								}
						}
						n++;
				}
		}

		if (style == styles.LINELOOP){
				var x = featurePoints2D.fp[points[0]][points[1]-1].pos[0]*this.canvas.width;
				var y = (1 - featurePoints2D.fp[points[0]][points[1]-1].pos[1])*this.canvas.height;
				this.canCon.lineTo(x,y);
				this.canCon.strokeStyle = color;
				this.canCon.stroke();
				this.canCon.closePath();
		}
}

/*
* Draw facial features
*/
function drawFaceFeatures(featurePoints2D)
{

		if(this.faceData.eyeClosure[0] == 1 && this.faceData.eyeClosure[1] == 1)
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

		if(this.faceData.eyeClosure[0] == 1 && this.faceData.eyeClosure[1] == 1){

				this.eyesOpen++;

				drawPoints2D(eyesPoints, 12, styles.POINT,featurePoints2D,EYES_COLOR);
				drawPoints2D(eyesLinesPoints1, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR);
				drawPoints2D(eyesLinesPoints2, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR);
				drawPoints2D(eyesLinesPoints3, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR);
				drawPoints2D(eyesLinesPoints4, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR);



				if ( this.eyesOpen > 15 && this.playing) {

						console.log('this.eyesOpen:', this.eyesOpen);
						// site.sound.pause();
						// $(self).trigger("pause");
						// $('.loading-text').removeClass("fadeOut");

						this.playing = false;
				}
		}
		else if(this.faceData.eyeClosure[0] == 0 && this.faceData.eyeClosure[1] == 0)
		{

				drawPoints2D(eyesPoints, 12, styles.POINT,featurePoints2D,EYES_COLOR_CLOSED);
				drawPoints2D(eyesLinesPoints1, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR_CLOSED);
				drawPoints2D(eyesLinesPoints2, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR_CLOSED);
				drawPoints2D(eyesLinesPoints3, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR_CLOSED);
				drawPoints2D(eyesLinesPoints4, 4,styles.LINELOOP, featurePoints2D,EYES_COLOR_CLOSED);

				if(!this.playing){
						this.eyesOpen = 0;
						// site.sound.play();
						// $(self).trigger("play");
						// $('.loading-text').addClass("fadeOut");

						this.playing = true;
				}

		}
}

// var timeme = false;
// var trackerReturnState = "TRACK_STAT_OFF";
//
// this.frameSample = [0,0,0,0,0];
// this.newSample = [0,0,0,0,0];

/*
* Compares two samples of 5 pixel values
*/
function checkFrameDuplicate(newSample, frameSample){
		for (var i = 0; i <  newSample.length; i+=2){
				if (newSample[i] !== frameSample[i])
						return false;
		}
		//additional check
		for (var i = 1; i < newSample.length; i+= 2)
		{
				if (newSample[i] !== frameSample[i])
						return false;
		}
		return true;
}

export {
	drawPoints2D,
	drawFaceFeatures,
	checkFrameDuplicate
};
