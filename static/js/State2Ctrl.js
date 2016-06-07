/**
 * Created by Gursimran on 16-Apr-16.
 */

app.controller("State2Ctrl", function($scope, $http) {
    var gumStream;
    var cameraPreview = document.getElementById('camera-preview');
    var mediaRecorder;
    var chunks = [];
    var count = 0;


    function successCallback(stream) {
        console.log ("Stream Obtained");
        gumStream = stream;
        cameraPreview.src = window.URL.createObjectURL(stream);
        cameraPreview.play();
        cameraPreview.muted = true;

        // Set up mediaRecorder
        mediaRecorder = new MediaRecorder(stream);

        console.log ("Recording started_A");
        mediaRecorder.start(10);
        console.log ("Recording started_B");

        mediaRecorder.ondataavailable = function(e) {
            //log('Data available...');
            //console.log(e.data);
            //console.log(e);
            chunks.push(e.data);
        };

        mediaRecorder.onerror = function(e){
            console.log('Error: ', e);
        };

        mediaRecorder.onstart = function(){
            console.log('Started, state = ' + mediaRecorder.state);
        };
    }

    function errorCallback(error) {
        // maybe another application is using the device
        console.log ("Error in invoking recordRTC")
    }

    $scope.onStartRecord = function() {
        /*
        if(getBrowser() == "Chrome"){
         var mediaConstraints = {"audio": false, "video": { "mandatory": { "minWidth": 320, "maxWidth": 320, "minHeight": 240,"maxHeight": 240 }, "optional": [] } };
        }else if(getBrowser() == "Firefox"){
         var mediaConstraints = {audio: true,video: { width: { min: 320, ideal: 320, max: 1280 }, height: { min: 240, ideal: 240, max: 720 }}};
        }
        */
        var vid_constraints = {
            mandatory: {
                maxHeight: 240,
                maxWidth: 320,
                minHeight: 240,
                minWidth: 320
            }
        };

        var mediaConstraints = {
            video: vid_constraints,
            audio: true
        };

        navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
        console.log("Requesting stream");
    }

    $scope.onStopRecord = function() {
        console.log ("Stop called")
        var audioTrack = gumStream.getTracks()[0];
        var videoTrack = gumStream.getTracks()[1];
        audioTrack.stop();
        videoTrack.stop();
	    mediaRecorder.stop();

        // Download data
		console.log('Stopped  & state = ' + mediaRecorder.state);
		var blob = new Blob(chunks, {type: "video/webm"});
        var videoURL = window.URL.createObjectURL(blob);
        downloadFile(videoURL);
        //window.open(videoURL, 'Download');
    }

    function postData(data) {
        fileName = getRandomString();
        files = {
            name: fileName + '.webm',
            type: 'video/webm',
            contents: data
        };

        $http.post("/api/video", JSON.stringify(files))
        .success(function (data) {
            console.log("Data successfully sent to server");
        })
    }

    function downloadFile(dataUrl) {
        // Construct the a element
        var link = document.createElement("a");
        link.download = getRandomString() + '.webm';
        link.target = "_blank";

        // Construct the uri
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();

        // Cleanup the DOM
        document.body.removeChild(link);
        delete link;
    }

    function getRandomString() {
        if (window.crypto) {
            var a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
            for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
            return token;
        } else {
            return (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');
        }
    }
});