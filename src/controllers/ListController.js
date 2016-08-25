animetracker.controller('ListController', ['$scope', 'apiservice', function ($scope, apiservice) {
    'use strict';
    $scope.isLoggedIn = false;
    $scope.selection = 'search';
    $scope.selections = ['search', 'browse'];
    $scope.selectedGenres = [];
    $scope.selectedType = {};
    $scope.types = [
    {
        id : "Tv",
        label : "Tv"
    },
    {
        id : "Movie",
        label : "Movie"
    },
    {
        id : "Special",
        label : "Special"
    },
    {
        id : "OVA",
        label : "OVA"
    },
    {
        id : "ONA",
        label : "ONA"
    },
    {
        id : "Tv Short",
        label : "Tv Short"
    }
    ];

    $scope.typeSettings = {
        buttonClasses : 'temp',
        selectionLimit : 1,
        showUncheckAll : false,
        smartButtonMaxItems: 1,
    };

    $scope.genreSettings = {
        buttonClasses : 'temp',
        smartButtonMaxItems: 3,
        enableSearch : true, 
        closeOnBlur : true,
        scrollable : true
    };
    //$scope.query = '';

    // Default result on page load set to fullmetal search query 
    // To change: Show top animes based on popularity score here
    var doSearch = apiservice.getSearch ('fullmetal');
    doSearch.then(
        function (payLoad) {
            $scope.results = payLoad.data;
        }
    );

    var checkLogIn = apiservice.getLoggedIn();
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

    apiservice.getGenres()
    .then(function(payLoad){
        $scope.genreList = payLoad.data;
        $scope.genreList.forEach(function(e) {
            e.label = e.genre;
            e.id = e.genre;
            delete e.genre;    
        });
    })
    .catch(function(error) {console.log(error);});


    $scope.getBrowse = function(){

        console.log($scope.bro);
        var options = {};
        console.log(undefined);
        // if(isEmpty($scope.selectedGenres))
        // {
        //     options.genres = $scope.selectedGenres.map(function(elem){ return elem.id;}).join(",");
        // }
        // if($scope.selectedType)
        // {
        //     options.type=$scope.selectedType.id; 
        // }

        // options.sort="score-desc"; 
        options = {
            genres : $scope.selectedGenres.map(function(elem){ return elem.id;}).join(","),
            type : $scope.selectedType.id,
            sort : "score-desc"
        };
        console.log(options);


        var doBrowse = apiservice.getBrowse(options);
        doBrowse.then(
            function(payLoad) {
                //console.log(payLoad.data);
                $scope.results = payLoad.data;
            }).catch(function(error){
                console.log(error);
        });
    };

    apiservice.getUserAnimeData().then(function(payLoad){
        console.log(payLoad);
    });

    $scope.getResults = function () {
        var doSearch = apiservice.getSearch ($scope.query);
        doSearch.then(
            function (payLoad) {
                $scope.results = payLoad.data;
            }
        );
    };

    $scope.addToLib = function(id){
        apiservice.addAnime(id).then(function(payLoad){
            console.log(payLoad);
        });
        console.log(id);
    };

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
