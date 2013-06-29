'use strict';

/* Filters */

angular.module('angular-client-side-auth.filters', []).
    filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace( /\%VERSION\%/mg , version ) ;
        }
    }]).
    filter('moment', function() {
        return function(dateString, format) {
            return moment(dateString).format(format);
        };
    })
    .
    filter('checkbox', function() {

        return function(String) {
            console.log('cb ',String)
            if (String=='X') {
                console.log('in 1');
                return 1
            }else{ return 0 }
        };
    })
    .filter('money', ['$filter',function($filter) {
        return function(input) {
            var output = '';
            var clean;

            if (angular.isUndefined(input)) return output;

            if (angular.isString(input)) {
                input = parseFloat(input.replace(/[$]/g, ''));
            }

            if (angular.isNumber(input)) {
                clean = parseFloat(input);
                output = (clean !== 0) ? $filter('currency')(clean) : output;
            }

            return output;
        };
    }])
;
