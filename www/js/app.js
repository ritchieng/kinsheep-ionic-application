angular.module('app.core', ['ionic', 'app.controllers', 'app.services', 'app.directives', 'btford.socket-io', 'ionic-native-transitions'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicNativeTransitionsProvider) {
    $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction: 'left'
    });

    $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'right'
    });

    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/social/menu.html",
            controller: 'AppCtrl'
        })
        .state('app.start', {
            url: "/start",
            views: {
                'menuContent': {
                    templateUrl: "templates/social/start-fullscreen.html"
                }
            }
        })
        .state('app.main', {
            url: "/main",
            views: {
                'menuContent': {
                    templateUrl: "templates/social/main.html"
                }
            }
        })
        .state('app.editprofile', {
            cache: false,
            url: "/editprofile",
            views: {
                'menuContent': {
                    templateUrl: "templates/social/profile-edit.html",
                }
            }
        })
        .state('app.email', {
            url: "/email",
            views: {
                'menuContent': {
                    templateUrl: "templates/social/send-email.html"
                }
            }
        })
        .state('app.profile', {
            cache: false,
            url: "/profile",
            views: {
                'menuContent': {
                    templateUrl: "templates/social/profile.html",
                }
            }
        })
        .state('app.profile-other', {
            cache: false,
            url: "/profile-other?id",
            views: {
                'menuContent': {
                    templateUrl: "templates/social/profile-other.html"
                }
            }
        })
        .state('app.settings', {
            url: "/settings",
            views: {
                'menuContent': {
                    templateUrl: "templates/social/settings.html"
                }
            }
        })
        .state('app.conversation', {
            url: "/conversation?id&name",
            views: {
                'menuContent': {
                    templateUrl: "templates/social/conversation.html"
                }
            }
        })
        .state('app.welcome', {
            url: "/welcome",
            views: {
                'menuContent': {
                    templateUrl: "templates/social/welcome.html"
                }
            },
            params: {
                "email": "",
                "password": ""
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/start');

    // $ionicConfigProvider.scrolling.jsScrolling(false);
});
