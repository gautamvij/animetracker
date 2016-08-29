angular.module('animetracker').controller('RegisterController', ['$scope', 'apiservice', '$routeParams', '$location',
	function ($scope, apiservice, $routeParams, $location) {
  $scope.toLogin = $routeParams.toLogin;
  $scope.ErrorMessage = 0;
  $scope.doLogin = function() {
    apiservice.postLogin($scope.formData).then( function (){
      $scope.ErrorMessage = 0;
      $location.path('/');
    }, function(error){

      if(error.data === 'NoUsername\n')
        $scope.ErrorMessage = 1;
      else if(error.data === 'Wrong password\n')
        $scope.ErrorMessage = 2;
      // console.log("Error payLoad inlogin callback");
      // console.log(error);
    }).catch(function(){
          // console.log(" Check this error something is wrong with server " + error);
    });
  };

  $scope.doSignUp = function() { 
    apiservice.postSignup($scope.formData).then(function(){
      $scope.ErrorMessage = 0;
    //   console.log("Signup was success");
    // console.log(payLoad);
      $location.path('/');
    }, function(){
      $scope.ErrorMessage = 3;
          //console.log("Error caught here in signup");
        //console.log(error);
    });
  };

}]);

