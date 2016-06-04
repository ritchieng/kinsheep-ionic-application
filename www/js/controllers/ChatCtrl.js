angular.module('app.controllers')
    .controller('ChatCtrl', function($scope, $timeout, $ionicScrollDelegate, $http, $localstorage, $stateParams) {

        var user = $localstorage.getObject('user');
        $scope.showTime = true;

        var alternate, isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

        $scope.sendMessage = function() {
            alternate = !alternate;

            var d = new Date();
            // format the display format
            var displayDate = d.toLocaleTimeString().replace(/:\d+ /, ' ');

            // create message object in the server for reference
            $http.get('https://kinsheep.com:3030/create_message?from=' + $scope.myId + '&to=' + $scope.toId + '&msg=' + $scope.data.message);

            $scope.messages.push({
                body: $scope.data.message,
                time: displayDate,
                from: $scope.myId,
                to: $scope.toId
            });

            delete $scope.data.message;
            $ionicScrollDelegate.scrollBottom(true);

        };


        $scope.inputUp = function() {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };

        $scope.inputDown = function() {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        $scope.closeKeyboard = function() {
            // cordova.plugins.Keyboard.close();
        };


        $scope.data = {};
        $scope.myId = user._id;
        $scope.toName = $stateParams.name;
        $scope.toId = $stateParams.id;
        // load the initial view with message history
        $http.get('https://kinsheep.com:3030/get_chat?from=' + $scope.myId + '&to=' + $scope.toId).then(function(resp) {
            $scope.messages = resp.data.messages;
            $ionicScrollDelegate.scrollBottom(true);
            // $ionicScrollDelegate.resize();
        });

    });
