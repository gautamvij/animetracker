animetracker.controller('ListController', ['$scope', 'search', function ($scope, search) {
    'use strict';
    $scope.isLoggedIn = false;
    $scope.selection = 'search';
    $scope.selections = ['search', 'browse'];
    //$scope.query = '';

    // Default result on page load set to fullmetal search query 
    // To change: Show top animes based on popularity score here
    var doSearch = search.getSearch ('fullmetal');
    doSearch.then(
        function (payLoad) {
            $scope.results = payLoad.data;
        }
    );

    var checkLogIn = search.getLoggedIn();
    checkLogIn.then(
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

    $scope.genres = ["cewvew","ewvwev","vwevwvw","ewvwe"];

    $scope.dummyFunc = function(){
        console.log($scope.bro);
        var options = {
            genres : "Action,Comedy",
            type : "Tv",
            sort : "score-desc"
        };

        var doBrowse = search.getBrowse(options);
        doBrowse.then(
            function(payLoad) {
                //console.log(payLoad.data);
                $scope.results = payLoad.data;
            });
    };

    $scope.getList = function () {
        var doSearch = search.getSearch ($scope.query);
        doSearch.then(
            function (payLoad) {
                $scope.results = payLoad.data;
            }
        );
    };

    $scope.selectedGenres=[];
     $scope.toggleSelection = function toggleSelection(genre) {
     var idx = $scope.selectedGenres.indexOf(genre);
 
     // is currently selected
     if (idx > -1) {
       $scope.selectedGenres.splice(idx, 1);
     }
 
     // is newly selected
     else {
       $scope.selectedGenres.push(genre);
     }
   };



}]);
