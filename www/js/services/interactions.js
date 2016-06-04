angular.module('app.services')
    .factory('$interactions', ['$localstorage', '$http', '$user', '$ionicPopup',
        function($localstorage, $http, $user, $ionicPopup) {
            return {
                getStatus: function(friend_id) {
                    var user = $localstorage.getObject('user');
                    if (user._id === friend_id) {
                        return "same";
                    }
                    var interactions = user.interactions;
                    for (var i = 0; i < interactions.length; i++) {
                        if (interactions[i].user_id === friend_id) {
                            return interactions[i].isConnected;
                        }
                    }
                    return 'not_connected';
                },
                acceptRequest: function(id, callback) {
                    console.log('accepted');
                    var user = $localstorage.getObject('user');
                    $http.get('https://kinsheep.com:3030/accept_request?from=' + user._id + '&to=' + id).then(function(resp) {
                        if (resp.data === 'ok') {
                            console.log('Request accepted');
                            var defaultMsg = "Hey, I've just accepted your request on Kinsheep. Don't feel sheepish, let's chat!";
                            $http.get('https://kinsheep.com:3030/create_message?from=' + user._id + '&to=' + id + '&msg=' + defaultMsg).then(function(resp) {
                                if (resp.data === 'ok') {
                                    console.log("Default chat created");
                                }
                            }).then(function() {
                                $user.reloadInteractions(callback);
                            });
                            return;
                        }
                        console.log("Error: " + resp.data);
                        return;
                    });
                },
                declineRequest: function(id, callback) {
                    var user = $localstorage.getObject('user');
                    $http.get('https://kinsheep.com:3030/decline_request?from=' + user._id + '&to=' + id).then(function(resp) {
                        if (resp.data === 'ok') {
                            console.log('Request declined');
                            return;
                        }
                        console.log("Error: " + resp.data);
                        return;
                    }).then(function() {
                        $user.reloadInteractions(callback);
                    });
                },
                sendRequest: function(id, callback) {
                    var user = $localstorage.getObject('user');
                    $http.get('https://kinsheep.com:3030/send_request?from=' + user._id + '&to=' + id).then(function(resp) {
                        if (resp.data === 'ok') {
                            console.log('Request sent');
                            return;
                        }
                        console.log("Error: " + resp.data);
                    }).then(function() {
                        $user.reloadInteractions(callback);
                    });
                },
                cancelRequest: function(id, callback) {
                    var savePopup = $ionicPopup.confirm({
                        title: 'Confirmation',
                        template: 'Cancel pending request?',
                        cancelType: 'button-assertive'
                    });
                    savePopup.then(function(res) {
                        if (res) {
                            var user = $localstorage.getObject('user');
                            $http.get('https://kinsheep.com:3030/cancel_request?from=' + user._id + '&to=' + id).then(function(resp) {
                                if (resp.data === 'ok') {
                                    console.log('Request cancelled');
                                    return;
                                }
                                console.log("Error: " + resp.data);
                                return;
                            }).then(function() {
                                $user.reloadInteractions(callback);
                            });
                        } else {
                            console.log("Request not cancelled");
                        }
                    });
                },
                removeFriend: function(id, callback) {
                    var savePopup = $ionicPopup.confirm({
                        title: 'Confirmation',
                        template: 'Is this friendship over?',
                        cancelType: 'button-assertive'
                    });
                    savePopup.then(function(res) {
                        if (res) {
                            var user = $localstorage.getObject('user');
                            $http.get('https://kinsheep.com:3030/remove_friend?from=' + user._id + '&to=' + id).then(function(resp) {
                                if (resp.data === 'ok') {
                                    console.log('Friend removed');
                                    return;
                                }
                                console.log("Error: " + resp.data);
                                return;
                            }).then(function() {
                                $user.reloadInteractions(callback);
                            });
                        } else {
                            console.log("Friend not removed");
                        }
                    });
                },
            };
        }
    ]);
