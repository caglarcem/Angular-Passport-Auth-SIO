'use strict';

angular.module('angular-client-side-auth')
.directive('accessLevel', ['$rootScope', 'Auth', function($rootScope, Auth) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var prevDisp = element.css('display');
            $rootScope.$watch('user.role', function(role) {
                if(!Auth.authorize(attrs.accessLevel))
                    element.css('display', 'none');
                else
                    element.css('display', prevDisp);
            });
        }
    };
}]);

angular.module('angular-client-side-auth').directive('activeNav', ['$location', function(location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var nestedA = element.find('a')[0];
            var path = nestedA.href;

            scope.location = location;
            scope.$watch('location.absUrl()', function(newPath) {
                if (path === newPath) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

}])
    .directive('ngBlur', function () {
        console.log('in blr')
        return function (scope, elem, attrs) {
            elem.bind('blur', function () {
                scope.$apply(attrs.ngBlur);
            });
        };
    })
// google pie chart
    .directive('qnPiechart', [
        function() {
            return {
                require: '?ngModel',
                link: function(scope, element, attr, controller) {
                    var settings = {
                        is3D: true
                    };

                    var getOptions = function() {
                        return angular.extend({ }, settings, scope.$eval(attr.qnPiechart));
                    };

                    // creates instance of datatable and adds columns from settings
                    var getDataTable = function() {
                        var columns = scope.$eval(attr.qnColumns);
                        var data = new google.visualization.DataTable();
                        angular.forEach(columns, function(column) {
                            data.addColumn(column.type, column.name);
                        });
                        return data;
                    };

                    var init = function() {
                        var options = getOptions();
                        if (controller) {

                            var drawChart = function() {
                                var data = getDataTable();
                                // set model
                                data.addRows(controller.$viewValue);

                                // Instantiate and draw our chart, passing in some options.
                                var pie = new google.visualization.PieChart(element[0]);
                                pie.draw(data, options);
                                //http://www.netmagazine.com/tutorials/create-beautiful-data-visualisations-svg-google-charts-api
                                $(window).smartresize(function () {
                                    pie.draw(data, options);
                                });
                            };


                            controller.$render = function() {
                                drawChart();
                            };
                        }

                        if (controller) {
                            // Force a render to override
                            controller.$render();
                        }
                    };

                    // Watch for changes to the directives options
                    scope.$watch(getOptions, init, true);
                    scope.$watch(getDataTable, init, true);
                }
            };
        }
    ])

    .directive('layout', function() {
        console.log('in 1 la');
        return {

            link: function(scope, elm, attrs) {
                var layout = elm.layout({ applyDefaultStyles: true });

                scope.layout  = layout;
                console.log('in la');
                scope.$watch(attrs.state, function(state) {
                    if (state == true) {
                        scope.layout.sizePane('east', 120);
                        scope.layout.show('west');
                        scope.layout.show('south');
                    } else {
                        scope.layout.sizePane('east', 60);
                        scope.layout.hide('west');
                        scope.layout.hide('south');
                    }
                });
            }
        };
    })

    .directive('hcPie', function () {
        return {
            restrict: 'C',
            replace: true,
            scope: {
                items: '='
            },
            controller: function ($scope, $element, $attrs) {
                //      console.log(2, $scope.$root.highchartTitle);//.highchartTitle);//.highchartTitle);

            },
            template: '<div id="container" style="margin: 0 auto">not working</div>',
            link: function (scope, element, attrs) {
//                console.log(3,scope);//,element,attrs);
//                console.log('3a',scope.$parent,scope.$parent.chartTitle);//.scope.$id,scope.$root,scope.$root.highchartTitle);//.items);// scope.this.highchartTitle);
//                console.log('3b',scope.$parent.chartTitle);
//                console.log('3c',scope.$root.highchartTitle);
//                console.log('3d',scope.$parent.highchartTitle2);
                //  var b = scope.$root.highchartTitle;
                //      var a = scope.$eval(attr);
                //      console.log('imurls',a,b);

                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        // text: 'Workers Comp '
                        text:scope.$root.highchartTitle
                        //scope.title
                    },
                    tooltip: {

                        pointFormat: '{series.name}: <b>{point.percentage}% - {point.y}/{point.total}  </b>',
                        percentageDecimals: 1
                    },
                    exporting: {
                        enabled: true
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                percentageDecimals:1,
                                formatter: function () {
                                    //return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
                                    //return '<b>' + this.point.name + '</b>: '  +Math.round(this.percentage)+ ' %';
                                    return '<b>' + this.point.name + '</b>: '  +  this.percentage.toFixed(1)+ ' %';

                                }
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'workers comp',
                        data: scope.items
                    }]
                });
//                scope.$watch("title", function (newValue) {
//                   // chart.title.text.setData(newValue, true);
//                    console.log('nv ',scope.$root.highchartTitle,newValue)
//                   //chart.title.text.setTitle({text: newValue});
//                    chart.setTitle({text: 'test '+scope.$root.highchartTitle});
//                }, true);
                scope.$watch("items", function (newValue) {
                    chart.series[0].setData(newValue, true);
                    chart.setTitle({text: scope.$root.highchartTitle});

                }, true);

            }
        }
    })

    .directive('mwValidate', function($log) {
        var noop = function() {};

        var nullFormCtrl = {
            isNull: true,
            $addControl: noop,
            $removeControl: noop,
            $setValidity: noop,
            $setDirty: noop
        };

        $log.info('Initializing mw-validate');

        return {
            restrict: 'A',
            require: '^form', // Looks on parent also

            // The linking function will add behavior to the template
            // The fourth parameter is a NgModelController (http://docs.angularjs.org/api/ng.directive:ngModel.NgModelController)
            link: function(scope, element, attrs, parentFormCtrl) {
                var modelCtrl = { $name: attrs.name || attrs.mwName },
                    nameExp = attrs.mwNameExp,
                    validateExpr = attrs.mwValidate;

                var $error = this.$error = {}; // keep invalid keys here

                parentFormCtrl = parentFormCtrl || nullFormCtrl ;

                $log.info('Creating controller for: ' + modelCtrl.$name );

                validateExpr = scope.$eval(validateExpr);

                if ( ! validateExpr) {
                    return;
                }

                if (angular.isFunction(validateExpr)) {
                    validateExpr = { validator: validateExpr };
                }

                // TODO Is necessary?
                parentFormCtrl.$addControl(modelCtrl);

                element.bind('$destroy', function() {
                    parentFormCtrl.$removeControl(modelCtrl);
                });

                if ( nameExp ) {
                    scope.$watch( nameExp, function( newValue ) {
                        modelCtrl.$name = newValue;
                    });
                }

                scope.xxxform = parentFormCtrl;
                // Register watches
                angular.forEach(validateExpr, function(validExp, validationErrorKey) {
                    // Check for change in "boolean" value (true or false)
                    scope.$watch( '(' + validExp + ') && true', function(newIsValid, oldIsValid) {
                        $log.info('validating ' + validExp + ' as ' + validationErrorKey + ' with value ' +  newIsValid + '? ' + $error[validationErrorKey]);
                        if ( ($error[validationErrorKey] || false) === newIsValid) {
                            $error[validationErrorKey] = ! newIsValid;

                            parentFormCtrl.$setValidity(validationErrorKey, newIsValid, modelCtrl);
                        }
                    });
                });

            }
        };
    })
// this fixes date prob with chrome Version 24.0.1312.56 m
    .directive('input', function () {
        return {
            require: '?ngModel',
            restrict: 'E',
            link: function (scope, element, attrs, ngModel) {
                if ( attrs.type="date" && ngModel ) {
                    element.bind('change', function () {
                        scope.$apply(function() {
                            ngModel.$setViewValue(element.val());
                        });
                    });
                }
            }
        };
    })
    .directive('jlMarkdown', function ($http) {
        return {
            restrict:'E',
            require: 'ngModel',
            scope: {
                jlValue: '=ngModel',
                template: '='
            },
            template:
                '<textarea ng-show="isEditMode" ng-dblclick="switchToPreview()" rows="10" cols="10" ng-model="jlValue">'+
                    '</textarea>' +
                    '<div ng-hide="isEditMode" ng-dblclick="switchToEdit()" ng-bind-html-unsafe="jlValue | markdown">'+
                    '</div>',
            link: function(scope, elm, attrs) {
                $http.get(scope.template).success(function(data) {
                    scope.jlValue = data;
                });

                scope.isEditMode = false; //ture

                scope.switchToPreview = function () {
                    scope.isEditMode = false;
                };
                scope.switchToEdit = function () {
                    scope.isEditMode = false;//true;
                };
            }
        };
    }).filter('markdown',function() {
        var converter = new Showdown.converter();
        return function(value) {
            return converter.makeHtml(value || '');
        };
    })
    .value('ui.config' , {

        jq: {
            // The Tooltip namespace
            tooltip: {
                // Tooltip options. This object will be used as the defaults
                placement: 'right'
            },
            select2: {
                allowClear: true
            }
        }
    })

    .directive('fileButton', function() {
        return {
            link: function(scope, element, attributes) {

                var el = angular.element(element)
                var button = el.children()[0]

                el.css({
                    position: 'relative',
                    overflow: 'hidden',
                    width: button.offsetWidth,
                    height: button.offsetHeight
                })

                var fileInput = angular.element('<input id="uploadInput" type="file" multiple />')
                fileInput.css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    'z-index': '2',
                    width: '100%',
                    height: '100%',
                    opacity: '0',
                    cursor: 'pointer'
                })

                el.append(fileInput)
                //  scope.files=   fileInput;


            }
        }
    }).run()

    .directive('myDirective', function() {
        return {
            templateUrl: 'partials/my-directive.html',
            replace: true,
            restrict: 'E',
            scope: {
                filename: '=ngModel'
            },

            link: function(scope, elm, attrs) {

                $(elm).fileupload({
                    dataType: 'json',
                    paramName: 'files[]',

                    progressall: function(e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        scope.$apply(function() {
                            scope.progress = progress;
                        });

                    },

                    done: function(e, data) {

                        $.each(data.result, function(index, file) {
                            scope.$apply(function() {
                                scope.filename = file.name;
                            });
                        })

                    }
                });
            }

        }
    })


    .directive('btnSwitch', function(){

        return {
            restrict : 'A',
            require :  'ngModel',
            templateUrl : 'switcher.html',
            replace : true,
            link : function(scope, element, attrs, ngModel){

                // Specify how UI should be updated
                ngModel.$render = function() {
                    render();
                };

                var render=function(){
                    var val = ngModel.$viewValue;

                    var open=angular.element(element.children()[0]);
                    open.removeClass(val ? 'hide' : 'show');
                    open.addClass(val ? 'show' : 'hide');

                    var closed=angular.element(element.children()[1]);
                    closed.removeClass(val ? 'show' : 'hide');
                    closed.addClass(val ? 'hide' : 'show');
                };

                // Listen for the button click event to enable binding
                element.bind('click', function() {
                    scope.$apply(toggle);
                });

                // Toggle the model value
                function toggle() {
                    var val = ngModel.$viewValue;
                    ngModel.$setViewValue(!val);
                    render();
                }

                if(!ngModel){
                    //TODO: Indicate that something is missing!
                    return;
                }  // do nothing if no ng-model

                // Initial render
                render();
            }
        };
    })


    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])

    .directive('redWhen', function() {
        return function(scope,elm,attrs) {
            //  console.log('scope,elm,attrs',scope,elm,attrs)
            scope.$watch(attrs.redWhen, function(newVal, oldVal) {
                //if (newVal) {
                if (newVal && elm[0].value=='') {
                    elm.css('background-color', 'yellowgreen');
                } else {
                    elm.css('background-color', 'white');
                }
            });
        };
    }) ;