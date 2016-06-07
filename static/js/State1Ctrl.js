/**
 * Created by Gursimran on 16-Apr-16.
 */

app.controller("State1Ctrl", function($scope, $http) {
    var recordRTC;
    var gumStream;
    var cameraPreview = document.getElementById('camera-preview');


    function successCallback(stream) {
        console.log ("Stream Obtained");
        gumStream = stream;
        cameraPreview.src = window.URL.createObjectURL(stream);
        cameraPreview.play();
        cameraPreview.muted = true;

        // Set up RecordRTC
        var options = {
            recorderType: MediaStreamRecorder,
            type: 'video',
            mimeType: 'video/webm', // or video/mp4 or audio/ogg
            video: {
                width: 320,
                height: 240
            },
            canvas: {
                width: 320,
                height: 240
            },
            numberOfAudioChannels: 1,

            bitsPerSecond: 22100, // if this line is provided, skip above two
            getNativeBlob: false
        };
        recordRTC = RecordRTC(gumStream, options);
        milliseconds = 5000;
        recordRTC.setRecordingDuration(milliseconds, $scope.onStopRecord);
        recordRTC.canvas = {
            width: 320,
            height: 240
        };
        recordRTC.videoWidth  = 320;
        recordRTC.videoHeight = 240;

        console.log ("Recording started_A");
        recordRTC.startRecording();
        console.log ("Recording started_B");
    }

    function errorCallback(error) {
        // maybe another application is using the device
        console.log ("Error in invoking recordRTC")
    }

    $scope.onStartRecord = function() {
        var vid_constraints = {
            mandatory: {
                maxHeight: 180,
                maxWidth: 360,
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

        recordRTC.stopRecording(function (audioVideoWebMURL) {
            console.log("==Recording stopped==");
            // Get tracks
            var audioTrack = gumStream.getTracks()[0];
            var videoTrack = gumStream.getTracks()[1];
            console.log("==Tracks==")
            console.log("Closing " + audioTrack.kind);
            console.log("Closing " + videoTrack.kind);

            cameraPreview.src = audioVideoWebMURL;
            var recordedBlob = recordRTC.getBlob();

            // Capture data and send it upstream
            recordRTC.getDataURL(function (dataURL) {
                // Write the data to disk
                console.log("==Saving file==");
                recordRTC.save('simar.mp4');
                console.log("File saved");
                //console.log(dataURL);
                console.log("==Sending file to server==");
                //postData(dataURL);
                console.log("Sending data")
            });
        });
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