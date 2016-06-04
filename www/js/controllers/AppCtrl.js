angular.module('app.controllers', ['app.services'])
    .controller('AppCtrl', function($scope, $ionicModal, $ionicLoading, $timeout, $state, $http, $localstorage) {
        var loggedIn = false;
        $scope.$on('$ionicView.beforeEnter', function() {
            var loginCredentials = $localstorage.getObject('loggedIn');
            if (!loggedIn && loginCredentials.email) {
                $scope.doLogin(loginCredentials.email, loginCredentials.password);
            }
        });

        // Form data for the login/signup modal
        $scope.loginData = {};
        $scope.signupData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/social/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.loginModal = modal;
        });

        // Create the sign up modal
        $ionicModal.fromTemplateUrl('templates/social/signup.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.signupModal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.loginModal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.signupModal.hide();
            $scope.loginModal.show();
        };

        // close signup modal
        $scope.closeSignup = function() {
            $scope.signupModal.hide();
        };

        // Open the signup modal
        $scope.signup = function() {
            $scope.loginModal.hide();
            $scope.signupModal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function(email, password) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.loginData.email = email ? email : $scope.loginData.email;
            $scope.loginData.password = password ? password : $scope.loginData.password;
            console.log('Doing login', $scope.loginData);
            $scope.error = "";

            $http.get('https://kinsheep.com:3030/login?email=' + $scope.loginData.email + '&password=' + $scope.loginData.password).then(function(resp) {
                console.log('Success', resp);
                $localstorage.setObject('user', resp.data);
                $scope.closeLogin();
                (function sendLoc() {
                    var user = $localstorage.getObject('user');
                    var id = user ? user._id : null;
                    if (!id) {
                        return;
                    }
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var lat = position.coords.latitude;
                        var long = position.coords.longitude;
                        $http.get('https://kinsheep.com:3030/report_location?id=' + resp.data._id + '&lat=' + lat + '&long=' + long).then(function() {
                            $timeout(sendLoc, 10000);
                        });
                    });
                })();
                console.log($localstorage.getObject('loggedIn'));
                $localstorage.setObject('loggedIn', {
                    email: $scope.loginData.email,
                    password: $scope.loginData.password
                });
                loggedIn = true;
                $scope.loginData = {}; // TODO: Remove this, yet clear the login data on modal popup
                $ionicLoading.hide();
                $state.go('app.main');
            }, function(err) {
                $ionicLoading.hide();
                $scope.error = "Unable to login. Try again or reset your password!";
            });
        };

        $scope.doSignup = function() {
            $scope.error = "";
            // TODO: check that fields are valid

            if (!$scope.signupData.password || !$scope.signupData.email) {
                $scope.error = "Fields can't be empty. Try again!";
            } else if ($scope.signupData.password !== $scope.signupData.confirmPassword) {
                $scope.error = "Passwords do not match. Try again!";
            } else {
                console.log('Doing signup', $scope.signupData);
                $scope.closeSignup();
                $state.go('app.welcome', {
                    email: $scope.signupData.email,
                    password: $scope.signupData.password
                });
            }
        };
    });