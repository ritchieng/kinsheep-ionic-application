angular.module('app.controllers')
    .controller('NavCtrl', function($scope, $state, $ionicHistory, $localstorage) {
        $scope.goHome = function() {
            $state.go('app.main');
        };
        $scope.goProfile = function() {
            $state.go('app.profile');
        };
        $scope.goProfileEdit = function() {
            $state.go('app.editprofile');
        };
        $scope.doLogout = function() {
            $localstorage.clear();
            $ionicHistory.clearHistory();
            $state.go("app.start");
            setTimeout(function() {
                $window.location.reload(true);
            }, 100);
        };
    });
