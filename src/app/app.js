angular.module('animetracker', ['ngRoute','angularjs-dropdown-multiselect'])
.config(function ($routeProvider) {
  'use strict';
  $routeProvider 
    .when('/', { 
      controller: 'ListController', 
      templateUrl: 'pages/list.html' 
    }).when('/register/:toLogin', { 
      controller: 'RegisterController', 
      templateUrl: 'pages/register.html' 
    })
    .otherwise({ 
      redirectTo: '/' 
    });
    
});
