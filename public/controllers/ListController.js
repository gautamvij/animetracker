animetracker.controller('ListController', ['$scope', 'search', function ($scope, search) {
    $scope.query = '';
    search ('fullmetal').success(function (data) {
      $scope.results = data;
    });

    $scope.getList = function () {
         search ($scope.query).success(function (data) {
             console.log(data);
             $scope.results = data;
           });
    };

}]);
