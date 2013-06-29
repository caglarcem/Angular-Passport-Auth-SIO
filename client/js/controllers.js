'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('AppCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {

    $scope.getUserRoleText = function(role) {
        return _.invert(Auth.userRoles)[role];
    };

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.rememberme = false;// true;
    $scope.username='JRT';
    $scope.password='123';
    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);

angular.module('angular-client-side-auth')
.controller('HomeCtrl',
['$rootScope', function($rootScope) {
  // alert($rootScope.user.username)
}]);

angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = routingConfig.userRoles.user;

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role
            },
            function(res) {
                $rootScope.user = res;
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);



angular.module('angular-client-side-auth')
    .controller('PrivateCtrl',
        ['$rootScope', '$scope', 'Adjusters','socket', function($rootScope, $scope, Adjusters,socket) {
//            ['$rootScope', '$scope', 'socket', function($rootScope, $scope,socket) {

                $scope.loading = true;
            socket.on('send:name', function (data) {
                console.log(data)
                $scope.name = data.name;
                $scope.name3 = data.name3;
            });
            socket.on('send:time', function (data) {
                $scope.time = data.time;
                $scope.namet = data.namet;
            });

           // form={};
            socket.emit('getAdjusters', {});// data does not work
            socket.on('initAdjusters', function (obj) {
                $scope.loading = false;
                $scope.adjusters = obj.Adjusters;
                console.log(' $scope.adjusters ', $scope.adjusters);
            });


           // rest
//            Adjusters.getAll(function(res) {
//          //    Adjusters.get(function(res) {
//                console.log('res ',res);
//                $scope.adjusters = res;
//                $scope.loading = false;
//            }, function(err) {
//                $rootScope.error = "Failed to fetch users.";
//                $scope.loading = false;
//            });

        }]);
angular.module('angular-client-side-auth')
.controller('AdminCtrl',
['$rootScope', '$scope', 'Users', function($rootScope, $scope, Users) {
    $scope.loading = true;
    console.log('res ');
    Users.getAll(function(res) {
        console.log('res ',res);
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });

}]);

