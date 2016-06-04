angular.module('app.controllers')
    .controller('SettingsCtrl', function($scope, $http, $localstorage, $ionicPopup) {
        var user = $localstorage.getObject('user');
        this.self = user;
        $scope.update = function(settings) {
            if (settings === undefined) {
                $scope.success = "";
                $scope.error = "Baaah. You can't submit an empty form.";
            } else if (settings.oldPass !== user.password && settings.oldPass !== null) {
                $scope.success = "";
                $scope.error = "Incorrect old password. Try again!";
                console.log("Incorrect password");
            } else {
                var savePopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: 'Do you want to save your details?',
                    cancelType: 'button-assertive'
                });
                savePopup.then(function(res) {
                    if (res) {
                        var firstName = settings.firstName || user.firstName;
                        var lastName = settings.lastName || user.lastName;
                        var email = settings.email || user.email;
                        var password = settings.newPass || user.password;
                        $http.get('https://kinsheep.com:3030/edit_user?id=' + user._id + '&firstName=' + firstName + '&lastName=' + lastName + '&email=' + email + '&password=' + password).then(function(resp) {
                            console.log("Settings updated");
                            $scope.success = "Success!";
                            $scope.error = "";
                        });
                        user.firstName = firstName;
                        user.lastName = lastName;
                        user.email = email;
                        user.password = password;
                        $localstorage.setObject('user', user);
                        console.log("Saved!");
                    } else {
                        console.log("Not Saved");
                    }
                });

            }
        };
    });
