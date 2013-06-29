'use strict';


//function ClaimCtrl($scope, masModel, masHelper, socket,$q,serviceCodes,masCrud)//,myServiceCode2)
angular.module('angular-client-side-auth')
    .controller('CodeCtrl',

        ['$rootScope', '$scope', 'masModel', 'masHelper', 'socket', '$q', 'serviceCodes', 'masCrud',
            function ($rootScope, $scope, masModel, masHelper, socket, $q, serviceCodes, masCrud) {

                    console.log('in CodeCtrl');
                $scope.form = {};
                $scope.selectedRow = {};


                $scope.handleRowSelection = function(row) {
                    $scope.selectedRow = row;
                };

                //   $scope.currentClaim;


                serviceCodes.getCode1().then(function (result) {
                    console.log(' getCode1 ');
                    $scope.types = result;
                    $scope.typesIndex = masHelper.buildIndex($scope.types, 'id');
                    console.log('$scope.types ctrl ', $scope.types);
                });
                //socket.emit('getcodeTypes', {});

                // this works
//                socket.emit('getcodeTypes', {});
//                socket.on('initcode1', function (obj) {
//                    console.log(' initcode1 ');
//                    $scope.loading = false;
//                    $scope.types =   obj.Code1;
//                    console.log(' $scope.types ', $scope.types);
//                });

            }]
    );


