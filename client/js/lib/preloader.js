PreloaderFactory = function( $compile ) {

    var directive = {

        restrict : "A",

        link : function( scope, elm, attrs ) {

            scope.preloader = jQuery( "<ng-include />" );
            scope.preloader.attr( "src", "'"+ attrs.preloader +".html'" );

            $compile( scope.preloader )( scope );

            jQuery( "body" ).append( scope.preloader );

            scope.$on( "applicationComplete", function( event ) {

                jQuery( scope.preloader ).remove();
            });
        }
    }
    return directive;
}

function PreloaderController( $scope, $timeout ) {

    $scope.percentCompleted = 0;

    $scope.applicationProgressMock = function() {

        if( $scope.percentCompleted == 100 ) {
            $scope.$emit( "applicationComplete" );
        }
        else
        {
            $scope.percentCompleted += 5;
            $timeout( $scope.applicationProgressMock, 100 );
        }
    }
    $timeout( $scope.applicationProgressMock, 100 );

    $scope.clickHandler = function( event ) {
        $scope.percentCompleted = 100;
    }
}