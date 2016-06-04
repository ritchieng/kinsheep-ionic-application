angular.module('app.controllers')
    .controller('ProfileOtherCtrl', function($rootScope, $scope, $http, $state, $stateParams, $localstorage, $interactions) {
        $scope.otherId = $stateParams.id;
        var user = $localstorage.getObject('user');
        var details = {};

        // fetch friend information to load their profile
        $http.get('https://kinsheep.com:3030/get_profile?id=' + $scope.otherId).then(function(resp) {
            details.profileImg = resp.data.profileImg;
            details.firstName = resp.data.firstName;
            details.lastName = resp.data.lastName;
            details.position = resp.data.position;
            details.firm = resp.data.firm;
            details.pitch = resp.data.pitch;
            details.skills = resp.data.skills;
            details._id = $scope.otherId;
        });
        this.profile = details;

        function broadcastInteractionsUpdated() {
            $rootScope.$broadcast('interactionsUpdated');
        }

        $scope.getStatus = function() {
            var id = $scope.otherId;
            return $interactions.getStatus(id);
        };
        $scope.sendRequest = function() {
            var id = $scope.otherId;
            $interactions.sendRequest(id, broadcastInteractionsUpdated);
        };
        $scope.acceptRequest = function() {
            var id = $scope.otherId;
            $interactions.acceptRequest(id, broadcastInteractionsUpdated);
        };
        $scope.declineRequest = function() {
            var id = $scope.otherId;
            $interactions.declineRequest(id, broadcastInteractionsUpdated);
        };
        $scope.cancelRequest = function() {
            var id = $scope.otherId;
            $interactions.cancelRequest(id, broadcastInteractionsUpdated);
        };
        $scope.removeFriend = function() {
            var id = $scope.otherId;
            $interactions.removeFriend(id, broadcastInteractionsUpdated);
        };
    });
