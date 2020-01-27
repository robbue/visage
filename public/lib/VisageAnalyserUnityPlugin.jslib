/**
* <br/>
* The VisageAnalyserUnityPlugin is a native plugin (see <a href=https://docs.unity3d.com/Manual/NativePlugins.html>Native Plugins</a>)
* written in JavaScript for Unity. 
* The plugin exposes face analysis features of visage|SDK for use in Unity WebGL build.
* <br/>	<br/>
* The plugin code is placed in VisageAnalyserUnityPlugin.jslib file and can be found in /lib folder.
* <br/>	<br/>
* <b>Note:</b> This version of the plugin is adapted to Unity version 2019.1, while for all older versions of Unity <b>unityInstance</b> in _estimateEmotion() function has to be renamed to <b>gameInstance</b>.
*<br/> <br/>
*
* <h3>&emsp;Dependencies </h3>
* The plugin depends on visageSDK.js file that loads visageSDK.data and visageAnalysisData.js that loads visageAnalysisData.data. 
* Therefore, visageSDK.js has to be included in WebGL build output file - index.html, while visageAnalysisData.js has to be loaded
* by calling {@link module:VisageAnalyserUnityPlugin._preloadAnalysisData|_preloadAnalysisData} function with string parameter that represents link to the visageAnalysisData.js script relative to the
* main .html file.
* <br>
* For example, if visageAnalysisData.js is placed in the same folder as the main .html file:
* <pre class="prettyprint source"><code>
* 	VisageTrackerNative._preloadAnalysisData("visageAnalysisData.js");
*
* </code></pre>
* <br/>
* <h3>&emsp;Usage </h3>
* For the functions to be accessible from C#, a C# wrapper interface is used.
* The example can be seen in the following function:
* <pre class="prettyprint source"><code>
* 	[DllImport("__Internal")]
* 	public static extern void _initAnalyser(string initCallback);
*
* </code></pre>
* The usage is demonstrated in VisageTrackerUnityDemo sample, VisageTrackerNativ.HTML5.cs file. All C# scripts are located in Assets/Scripts folder of the project. 
* <br/>
* In order to use VisageAnalyserUnityPlugin plugin in Unity projects visageSDK.js must be included in output index.html file (see <a href="trackerunity.html#BuildUnity">link</a>),
* visageAnalysisData.js must be loaded using {@link module:VisageAnalyserUnityPlugin._preloadAnalysisData|_preloadAnalysisData} function. 
* The frame that will be forwarded to the functions for estimating age, gender and emotions has to be processed before using VisageTracker.
*<br/>
*<br/>
*
* <h3>&emsp;Callbacks</h3>
* Generally, it is common to use callback functions in JavaScript, due to its asynchronous nature. 
*
* <br/>
* Within the plugin, some functions are implemented so they expect a <b>callback function name</b> as a parameter.
* Callback functions are defined in C# code.
* Examples can be seen in {@link module:VisageAnalyserUnityPlugin._initAnalyser|_initAnalyser} function.
* <br/><br/>
* 
* 
* 
* @exports VisageAnalyserUnityPlugin
* <br/>
*/

var VisageAnalyserUnityPlugin = 
{	
	/*
	* Declares {@link module:VisageAnalyserUnityPlugin._preloadAnalysisData|_preloadAnalysisData} dependency on 
	* {@link module:VisageAnalyserUnityPlugin.data|data} parameter.
	*/
	_preloadAnalysisData__deps: ['data'],
	
	/**
	* Stores url and name of the visageAnalysisData.js file that loads visageAnalysisData.data into the file system.
	* It is expected that the url will be relative to the main index.html file position.
	* It has to be called before using any of the functionalities from visage|SDK. 
	* The recommendation for calling this function is within the function Awake() in Unity. 
	* <br/>
	* @param {string} fileURL - the name and path to the script file.
	*/
	_preloadAnalysisData: function(fileURL)
	{
		var url = Pointer_stringify(fileURL);
		_data.push(url);
	},	
	
	/*
	* Declares {@link module:VisageAnalyserUnityPlugin._initAnalyser|_initAnalyser} dependency on 
	* {@link module:VisageAnalyserUnityPlugin.mInitVis|mInitVis} and {@link module:VisageAnalyserUnityPlugin.mLicenseInitialize|mLicenseInitialize} parameter.
	*/
	_initAnalyser__deps:['mInitVis', 'mLicenseInitialize'],
	
	/**
	* Initializes VisageAnalyser.
	* <br/>
	* In order to use VisageAnalyser functions visageAnalysisData.data must be preloaded by calling 
	* {@link module:VisageAnalyserUnityPlugin._preloadAnalysisData|_preloadAnalysisData} function
	* at the very beginning of the code execution. The recommendation is to call this function in Awake() function in Unity.
	*
	* Parameter <i>callback</i> is name of function defined in Unity script.
	* An example of a callback function definition and {@link module:VisageAnalyserUnityPlugin._initAnalyser|_initAnalyser} function call:
	* <pre class="prettyprint source"><code>
	*	//callback function
	*	void initAnalyserCallback()
    *	{
	*		Debug.Log("AnalyserInited");
	*		AnalyserInitialized = true;
    *	}
	*	//call of the _initAnalyser() function:
	*	VisageTrackerNative._initAnalyser("initAnalyserCallback");
	* </code></pre>
	*
	* <br/>
	* @param {string} callback - <b>the name</b> of the callback function.
	*/
	_initAnalyser: function(callback)
	{	
		if(typeof mCallbackAnalyser === 'undefined')
		{
			mCallbackAnalyser = Pointer_stringify(callback);
		}
	
		if(!_mInitVis || !_mLicenseInitialize)
		{
			setTimeout(__initAnalyser, 2, callback);
			return;
		}	
			
		analyser = new VisageModule.VisageFaceAnalyser();	
	
		SendMessage('Analyser', mCallbackAnalyser);	
		
		delete mCallbackAnalyser;
	},
	
	
	_releaseAnalyser: function()
	{
		if(typeof analyser !== 'undefined')
		{
			analyser.delete();
		}
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._estimateAge|_estimateAge} dependency on 
	* {@link module:VisageTrackerUnityPlugin.ppixels|ppixels} parameter.
	*/
	_estimateAge__deps: ['ppixels'],
	
	/**
	* Estimates age from a facial image. 
	* @param {number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* @return {number} Estimated age if estimation was successful or -1 if it failed. 
	*/
	_estimateAge: function(faceIndex)
	{
		if(typeof analyser === 'undefined')
			return -1;
		
		var mWidth = w;
		var mHeight = h;

		var faceData = faceDataArray.get(faceIndex);
		var age = analyser.estimateAge(mWidth, mHeight, _ppixels, faceData);
	
		return age;
	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._estimateEmotion|_estimateEmotion} dependency on 
	* {@link module:VisageTrackerUnityPlugin.ppixels|ppixels} parameter.
	*/
	_estimateEmotion__deps: ['ppixels'],
	
	/**
	* Estimates emotion from a facial image. 
	* @param {Array} emotionsArray - 7-dimension array in which the estimated probabilities for basic emotions will be stored.
	* @param {number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	*/
	_estimateEmotion: function(emotionsArray, faceIndex)
	{
		if(typeof analyser === 'undefined')
			return;
		
		var mWidth = w;
		var mHeight = h;
		var faceData = faceDataArray.get(faceIndex);
		var emotions = new VisageModule.VectorFloat();
		var emotionsArrayView = new Float32Array(unityInstance.Module.buffer, emotionsArray, 7);
		var emotion =  analyser.estimateEmotion(mWidth, mHeight, _ppixels, faceData, emotions);
		
		if (emotion)
		{
			for (var i = 0; i < 7; ++i)
			{
				emotionsArrayView[i] = emotions.get(i);
			}
		}
		
		return;

	},
	
	/*
	* Declares {@link module:VisageTrackerUnityPlugin._estimateGender|_estimateGender} dependency on 
	* {@link module:VisageTrackerUnityPlugin.ppixels|ppixels} parameter.
	*/
	_estimateGender__deps: ['ppixels'],
	
	/**
	* Estimates gender from a facial image. 
	* @param {number} faceIndex - value between 0 and MAX_FACES-1, used to access the data of a particular tracked face.
	* @return {number} 0 if estimated gender is female, 1 if it is a male and -1 if it failed. 
	*/
	_estimateGender: function(faceIndex)
	{
		if(typeof analyser === 'undefined')
			return -1; 
		
		var mWidth = w;
		var mHeight = h;
		var faceData = faceDataArray.get(faceIndex);
		var gender = analyser.estimateGender(mWidth, mHeight, _ppixels, faceData);

		return gender;
	}
	
};

mergeInto(LibraryManager.library, VisageAnalyserUnityPlugin);

	
