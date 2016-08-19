animetracker.factory('search', ['$http', function ($http) {
    return function (query) {
        return $http({
            method: 'GET',
            url: 'https://anilist.co/api/anime/search/'+ query + '?access_token=xgNbKjEUmV4lD7Wdx6G5a9qwVMb3LAgowabiE3yF'
          });
      };
  }]);
