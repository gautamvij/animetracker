
animetracker.service('search', ['$http', function ($http) {
	'use strict';

	// returning promise for the search query
    return {
    	getSearch: function (Query) {
	        return $http({
	            method: 'GET',
	            url: 'http://localhost:8080/apis',
	            params: {Query: Query}
	          });
	      },
	    getBrowse: function(options){
	    	console.log(options);
	    	return $http({
	            method: 'GET',
	            url: 'http://localhost:8080/apib',
	            params: { options : options}
	          });
	    },
	    getLoggedIn: function(){
	    	return $http({
	    		method: 'GET',
	            url: 'http://localhost:8080/loggedin'
	    	});
	    }
  	};
  }]);
