angular.module('app.controllers')
    .controller('MainCtrl', function($rootScope, $http, $localstorage, $scope, $state, $stateParams, $interactions, $user, $ionicLoading) {
        function populateNearbyList() {
            $scope.nearbyList = [];
            var user = $localstorage.getObject('user');
            var ids = [];
            $http.get('https://kinsheep.com:3030/get_nearby?onlyIds=true&id=' + user._id).then(function(resp) {
                ids = resp.data;
            }, function(err) {
                // hardcoded list in case server is unresponsive
                var nearbyAndre = [{
                    profileImg: "img/gemionic/profile-image.jpg",
                    firstName: "Error Von Wrong",
                    position: "Lord of the Void",
                    firm: "Realm of Nothingness",
                    lastMessage: "Zilch. Non. Zero. Nada.",
                    pitch: "I can't access the server"
                }];
                console.error('ERR', err);
                $scope.nearbyList = nearbyAndre;
            }).then(function() {
                ids.forEach(function(id) {
                    $http.get('https://kinsheep.com:3030/get_profile?id=' + id).then(function(resp) {
                        $scope.nearbyList.push(resp.data);
                    });
                })
            });
        }

        function populateMessageList() {
            // TODO: Use $q to join all chat requests
            $scope.messageList = [];
            var user = $localstorage.getObject('user');

            function processChat(friend_id) {
                return function(chatResponse) {
                    var tempMessages = chatResponse.data.messages;
                    var lastMsg = tempMessages[tempMessages.length - 1];
                    $http.get('https://kinsheep.com:3030/get_profile?id=' + friend_id).then(function(chatResponse) {
                        $scope.messageList.push({
                            "_id": chatResponse.data._id,
                            "profileImg": chatResponse.data.profileImg,
                            "firstName": chatResponse.data.firstName,
                            "lastName": chatResponse.data.lastName,
                            "lastMessage": lastMsg.body,
                            "timestamp": lastMsg.time
                        });
                    });
                };
            }

            for (var i = 0; i < user.interactions.length; i++) {
                if (user.interactions[i].isConnected == "connected") {
                    var friend_id = user.interactions[i].user_id;
                    $http.get('https://kinsheep.com:3030/get_chat?from=' + user._id + '&to=' + friend_id).then(processChat(friend_id));
                }
            }
        }

        function populateRequestList() {
            // TODO: Use $q to join profile of all friend requesters
            var user = $localstorage.getObject('user');
            var interactions = user.interactions;
            $scope.requestList = [];

            function processRequest(friendRequest) {
                $scope.requestList.push({
                    "_id": friendRequest.data._id,
                    "profileImg": friendRequest.data.profileImg,
                    "firstName": friendRequest.data.firstName,
                    "lastName": friendRequest.data.lastName
                });
            }

            // loop through list of interactions and filter requests that have not been accepted
            for (var i = 0; i < interactions.length; i++) {
                if (interactions[i].isConnected == "req_received") {
                    $http.get('https://kinsheep.com:3030/get_profile?id=' + interactions[i].user_id).then(processRequest);
                }
            }

        }

        $scope.getStatus = function(friend_id) {
            return $interactions.getStatus(friend_id);
        };

        $scope.sendRequest = function(id) {
            $interactions.sendRequest(id, reloadView);
        };

        $scope.acceptRequest = function(id) {
            $interactions.acceptRequest(id, reloadView);
        };

        $scope.declineRequest = function(id) {
            $interactions.declineRequest(id, reloadView);
        };

        $scope.cancelRequest = function(id) {
            $interactions.cancelRequest(id, reloadView);
        };

        $scope.reloadRequestList = function() {
            function callback() {
                reloadView();
                $scope.$broadcast('scroll.refreshComplete');
            }
            $user.reloadInteractions(callback);
        };

        function reloadView() {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.lastUpdated = (new Date()).toLocaleTimeString();
            populateNearbyList();
            populateMessageList();
            populateRequestList();
            $ionicLoading.hide();
        }

        reloadView();

        $scope.$on('interactionsUpdated', function() {
            console.log("interactionsUpdated");
            reloadView();
        });
    });