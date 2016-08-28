
animetracker.service('apiservice', ['$http', function ($http) {

	// returning promise for the search query
  return {
		getSearch: function (Query) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/apisearch',
            params: {Query: Query}
          });
      },

    addAnime: function(id, storeType){
    	return $http({
    		method: 'GET',
    		url : 'http://localhost:8080/adddata',
    		params : {
    			animeId: id,
    			storeType : storeType
    		}
    	});
    },

    removeAnime: function(id){
    	return $http({
    		method: 'GET',
    		url : 'http://localhost:8080/removedata',
    		params : {
    			animeId: id,
    		}
    	});
    },

    getUserAnimeData: function(){
    	return $http({
    		method: 'GET',
    		url: "http://localhost:8080/getdata"
    	});
    },
      
    getBrowse: function(options){
    	return $http({
            method: 'GET',
            url: 'http://localhost:8080/apibrowse',
            params: { options : options}
          });
    },
    getLoggedIn: function(){
    	return $http({
    		method: 'GET',
            url: 'http://localhost:8080/loggedin'
    	});
    },
    getGenres: function(){
    	return $http({
    		method: 'GET',
            url: 'http://localhost:8080/apigenre'
    	});	
    },
    getAnime: function(ID){
    	return $http({
    		method: 'GET',
            url: 'http://localhost:8080/apianime',
            params: {id : ID}
    	});	
    },    

    postLogin : function(formData){
    	return $http({
    		method: 'POST',
    		url: 'http://localhost:8080/login',
    		data: formData,
    		transformRequest: function(obj) {
		        var str = [];
		        for(var p in obj)
		        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		        return str.join("&");
		    },
    		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    	});
    },

    postSignup : function(formData){
    	return $http({
    		method: 'POST',
    		url: 'http://localhost:8080/signup',
    		data: formData,
    		transformRequest: function(obj) {
	        var str = [];
	        for(var p in obj)
	        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	        return str.join("&");
		    },
    		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    	});
    },

	};
}]);

