animetracker.controller('AnimeController', ['$scope', 'apiservice', '$routeParams', function ($scope, apiservice, $routeParams) {
    'use strict';
    var animeId = $routeParams.id;
    
    apiservice.getAnime(animeId).then(
    function(payLoad){
        console.log(payLoad.data);
        $scope.animeData = payLoad.data;
    });

}]);
