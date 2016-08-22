var animetracker = angular.module('animetracker', ['ngRoute']);
animetracker.config(function ($routeProvider) { 
  $routeProvider 
    .when('/', { 
      controller: 'ListController', 
      templateUrl: 'pages/list.html' 
    }) 
    .otherwise({ 
      redirectTo: '/' 
    });
    
});