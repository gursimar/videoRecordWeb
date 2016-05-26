/**
 * Created by Gursimran on 16-Apr-16.
 */
app.controller('State1Ctrl', ['$scope', '$window', 'AudioService',
    function($scope, $window, AudioService) {
        $scope.onRecord = function() {
            console.log("Recording");
            $window.recordRTC.startRecording()
        }

        $scope.onStopRecord = function() {
            console.log("Stopped recording");
            $window.recordRTC.stopRecording();
            console.log("Uploading last recording");
            blob = $window.recordRTC.getBlob();
            fd = new FormData();
            fd.append('audio', blob);
            console.log (blob)
            console.log (fd)
            //$window.recordRTC.stopRecording = function(audioUrl){
             //   AudioService.UploadLastRecoding()
            //}
            //AudioService.UploadLastRecoding();
        }
    }
])