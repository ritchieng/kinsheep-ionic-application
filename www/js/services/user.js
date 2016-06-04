angular.module('app.services')
    .factory('$user', ['$rootScope', '$localstorage', '$http',
        function($rootScope, $localstorage, $http) {
            return {
                reloadInteractions: function(callback) {
                    var user = $localstorage.getObject('user');
                    $http.get('https://kinsheep.com:3030/get_interactions?id=' + user._id).then(function(resp) {
                        console.log('reloadInteractions');
                        user.interactions = resp.data;
                        $localstorage.setObject('user', user);
                    }).then(callback);
                }
            };
        }
    ]);
