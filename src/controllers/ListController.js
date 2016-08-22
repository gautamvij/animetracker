animetracker.controller('ListController', ['$scope', 'search', function ($scope, search) {
    'use strict';
    $scope.isLoggedIn = false;
    $scope.selection = 'search';
    $scope.selections = ['search', 'browse'];
    $scope.query = '';

    // Default result on page load set to fullmetal search query 
    // To change: Show top animes based on popularity score here
    var promise = search.getSearch ('fullmetal');
    promise.then(
        function (payLoad) {
            $scope.results = payLoad.data;
        }
    );

    
    var promise2 = search.getLoggedIn();
    promise2.then(
        function(payLoad){
            console.log(payLoad.data); 
            if(payLoad.data === "0")
            {
                $scope.isLoggedIn = false;
            }
            else
            {
                $scope.isLoggedIn = true;
            }
            
        }
        ).catch(function(error){
            console.log(error);
        });

    
    $scope.getList = function () {
        var promise = search.getSearch ($scope.query);
        promise.then(
            function (payLoad) {
                $scope.results = payLoad.data;
            }
        );
    };

}]);
