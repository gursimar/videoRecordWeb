/**
 * Created by Gursimran on 16-Apr-16.
 */

var app = angular.module("sampleApp", []);
app.controller("AppCtrl", function($scope) {
    $scope.products = ["Milk", "Bread", "Cheese"];
});



