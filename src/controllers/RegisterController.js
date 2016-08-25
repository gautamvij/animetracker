animetracker.controller('RegisterController', ['$scope', 'apiservice', '$routeParams', '$location',
	function ($scope, apiservice, $routeParams, $location) {
    'use strict';
    $scope.toLogin = $routeParams.toLogin;
    
    $scope.doLogin = function() {
    	console.log("Trying the login here");
    	apiservice.postLogin($scope.formData).then(function(payLoad){
    		console.log(payLoad);
    	});
    };

    $scope.doSignUp = function() { 
    	console.log("Trying the signup here");
    	apiservice.postSignup($scope.formData).then(function(payLoad){
    		console.log(payLoad);
    	});;
    };

}]);
