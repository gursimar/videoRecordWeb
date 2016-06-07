/**
 * Created by Gursimran on 16-Apr-16.
 */

var app = angular.module("sampleApp", [
    'ui.router',
    'ui.bootstrap'
]);
app.controller("AppCtrl", function($scope) {
    $scope.products = ["Milk", "Bread", "Cheese"];
});

app.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/state1");

    // Now setup the state
    $stateProvider
        .state('state1', {
            url: "/state1",
            templateUrl: "static/templates/state1.html",
            controller: "State1Ctrl"
        })
        .state('state2', {
            url: "/state2",
            templateUrl: "static/templates/state2.html",
            controller: "State2Ctrl"
        })
})

app.factory('AudioService', ['$window', '$http', function($window, $http) {
        navigator.userMedia = (
        $window.navigator.getUserMedia ||
        $window.navigator.webkitGetUserMedia ||
        $window.navigator.mozGetUserMedia ||
        $window.navigator.msGetUserMedia)

        navigator.getUserMedia({
            audio: true,
            video: false
        }, function (stream) {
            $window.recordRTC = RecordRTC(stream, {
                canvas: {
                    width:320,
                    height:240
                },
                frameInterval:20
            });
        }, function (err) {
            console.log(err)
            //return
        });

        return {
            UploadLastRecording: function () {
                console.log("Uploading last recording");
                blob = $window.recordRTC.getBlob();
                fd = new FormData();
                fd.append('audio', blob);
                $http.post('/path/to/server', fd,
                    {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).success(function (data) {
                        console.log("Posted sound");
                        return data;
                    })
            }
        }
    }])
