
animetracker.service('search', ['$http', function ($http) {
	'use strict';

	// returning promise for the search query
    return {
    	getSearch: function (Query) {
	        return $http({
	            method: 'GET',
	            url: 'http://localhost:8080/api',
	            params: {Query: Query}
	          });
	      }
  	};
  }]);
