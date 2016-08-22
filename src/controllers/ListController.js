animetracker.controller('ListController', ['$scope', 'search', function ($scope, search) {
    'use strict';


    $scope.myBrowsers = [ "GC", "AS" ];

    $scope.browsers = [
        { value: "GC", label: "Chrome" },
        { value: "FF", label: "Firefox" },
        { value: "AS", label: "Safari" },
        { value: "IE", label: "Internet Explorer" }
    ];
    $scope.query = '';

    // Default result on page load set to fullmetal search query 
    // To change: Show top animes based on popularity score here
    var promise = search.getSearch ('fullmetal');
    promise.then(
        function (payLoad) {
            $scope.results = payLoad.data;
        }
    );

    $scope.getList = function () {
        var promise = search.getSearch ($scope.query);
        promise.then(
            function (payLoad) {
                $scope.results = payLoad.data;
            }
        );
    };

}]);