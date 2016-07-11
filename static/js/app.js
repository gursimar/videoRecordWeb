/**
 * Created by Gursimran on 16-Apr-16.
 */

var app = angular.module("sampleApp", [
    'ui.router',
    'ui.bootstrap',
    'timer'
]);
app.controller("AppCtrl", function($scope, AuthService) {
    $scope.products = ["Milk", "Bread", "Cheese"];
                    $scope.timerRunning = true;
                    $scope.startTimer = function (){
                        $scope.$broadcast('timer-start');
                        $scope.timerRunning = true;
                    };
                    $scope.stopTimer = function (){
                        $scope.$broadcast('timer-stop');
                        $scope.timerRunning = false;
                    };
                    $scope.$on('timer-stopped', function (event, args) {
                        console.log('timer-stopped args = ', args);
                        alert ('Your timer expired');
                    });
});

app.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/login");

    // Now setup the state
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "static/templates/login.html",
            controller: "loginCtrl",
            authenticate: false
        })
        .state('logout', {
            url: "/logout",
            templateUrl: "static/templates/logout.html",
            controller: "logoutCtrl",
            authenticate: false
        })
        .state('state1', {
            url: "/state1",
            templateUrl: "static/templates/state1.html",
            controller: "State1Ctrl",
            authenticate: true
        })
        .state('state2', {
            url: "/state2",
            templateUrl: "static/templates/state2.html",
            controller: "State2Ctrl",
            authenticate: true
        })
})


app.run(function ($rootScope, $state, AuthService) {
    console.log ("hurr");
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
        AuthService.getUserStatus()
            .then(function(){
                if (toState.authenticate && AuthService.isLoggedIn() === false) {
                    console.log ('Not allowed')
                    $state.transitionTo("login");
                    event.preventDefault();
                }
            })
    });
});
