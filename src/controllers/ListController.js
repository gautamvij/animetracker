animetracker.controller('ListController', ['$scope', 'apiservice','$location', function ($scope, apiservice, $location) {
    'use strict';
    $scope.isLoggedIn = false;
    $scope.selection = 'search';
    $scope.selections = ['search', 'browse'];
    $scope.selectedGenres = [];
    $scope.selectedType = {};
    $scope.loading  = false;
    $scope.animeData = {data1: "random"};
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
     $scope.modalShown = false;
     $scope.toggleModal = function(result) {
        console.log(result);
        result.toShow = !result.toShow;
        console.log(result.toShow);
        putAnimeDataInModel(result.id);
      };

    $scope.typeSettings = {
        buttonClasses : 'browsedropbutton',
        selectionLimit : 1,
        showUncheckAll : false,
        smartButtonMaxItems: 1,
    };

    $scope.typeTexts = {
        buttonDefaultText : "Type"
    };
    $scope.genreTexts = {
        buttonDefaultText : "Genres"
    };

    $scope.genreSettings = {
        buttonClasses : 'browsedropbutton',
        smartButtonMaxItems: 10,
        enableSearch : true, 
        closeOnBlur : true,
        scrollable : true
    };



    var putAnimeDataInModel = function(id){
        var promise = apiservice.getAnime(id);
        promise.then(function(payLoad){
            console.log(payLoad);
            $scope.animeData = payLoad.data;
            if($scope.isLoggedIn == false){
                $scope.animeData.animeStatus = 1;    
            }
            else
            {
                if(findAnimeInUser($scope.animeData.id))
                {
                    $scope.animeData.animeStatus = 3;           
                }
                else{
                    $scope.animeData.animeStatus = 2;
                }   
            }
            
        });
    };

    

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
        var options = {};
        $scope.results = [];
        $scope.loading = true;
        options = {
            genres : $scope.selectedGenres.map(function(elem){ return elem.id;}).join(","),
            type : $scope.selectedType.id,
            sort : "score-desc"
        };
        var doBrowse = apiservice.getBrowse(options);
        doBrowse.then(
            function(payLoad) {
                $scope.loading = false;
                $scope.results = payLoad.data;
                $scope.results.forEach(function(e){
                    e.toShow = false;
                });
            }).catch(function(error){
                console.log(error);
        });
    };

    // Shows the default data on screen 
    $scope.getBrowse();


    $scope.getResults = function () {
        var doSearch = apiservice.getSearch ($scope.query);
        $scope.loading = true;
        $scope.results = [];
        doSearch.then(
            function (payLoad) {
                $scope.loading = false;
                $scope.results = payLoad.data;
                $scope.results.forEach(function(e){
                    e.toShow = false;
                });

            }
        );
    };

    $scope.removeFromLib = function(id){
        if(id === 0){
            return;
        }
        var dummyFunc = apiservice.removeAnime(id);
        dummyFunc.then(function(payLoad){
            console.log(payLoad);
            console.log("removing anime of id " + id);
            $scope.animeData.animeStatus = 1;
            apiservice.getUserAnimeData().then(function(payLoad){
                $scope.userData = payLoad.data;
            });
            //$scope.showUserWishList();
        }).then(function(error){
            console.log(error);
        });

    };

    $scope.addToLib = function(id){
        if(id === 0 ){
            return;
        }
        apiservice.addAnime(id,null).then(function(payLoad){
            console.log(payLoad);
            if(payLoad.data === "No")
            {
                $location.path('/register/1');
            }
            console.log("adding to library " + id);

            $scope.animeData.animeStatus = 3;
            apiservice.getUserAnimeData().then(function(payLoad){
                $scope.userData = payLoad.data;
            });

        }).catch(function(error){
            console.log(error);
        });
        
    };

    apiservice.getUserAnimeData().then(function(payLoad){
        if(payLoad.data === "No" ){
            $scope.userData = [];
        }
        else
        {
            $scope.userData = payLoad.data;
        }
    });

    var findAnimeInUser = function(id){
        for(var iter = 0; iter < $scope.userData.length; iter++)
        {
          if($scope.userData[iter].animeId === id)
          {
            return true;
          }
        }
        return false;
    };

    $scope.showUserWishList = function(){
        debugger;
        $scope.loading=true;
        if($scope.isLoggedIn === true){
            $scope.results = [];
            apiservice.getUserAnimeData().then(function(payLoad){
            $scope.userData = payLoad.data;
            if($scope.userData.length ===0)
                $scope.loading= false;
            $scope.userData.forEach(function(e){
                    var promise = apiservice.getAnime(e.animeId);
                    promise.then(function(payLoad){
                        console.log(payLoad.data);
                        $scope.results.push(payLoad.data);
                        $scope.loading=false;
                    });
                });
            });
        }
        else
        {
            $location.path('/register/1');
        }
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
