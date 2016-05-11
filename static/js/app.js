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



