var animetracker = angular.module('animetracker', ['ngRoute','angularjs-dropdown-multiselect']);
animetracker.config(function ($routeProvider) { 
  'use strict';
  $routeProvider 
    .when('/', { 
      controller: 'ListController', 
      templateUrl: 'pages/list.html' 
    }).when('/register/:toLogin', { 
      controller: 'RegisterController', 
      templateUrl: 'pages/register.html' 
    })
    .when('/page/:id', { 
      controller: 'AnimeController', 
      templateUrl: 'pages/anime.html' 
    }) 
    .otherwise({ 
      redirectTo: '/' 
    });
    
});