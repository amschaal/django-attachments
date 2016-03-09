var transformDjangoRestResponse = function(data, headers){
	try {
        var jsonObject = JSON.parse(data); // verify that json is valid
        return jsonObject.results;
    }
    catch (e) {
        console.log("did not receive a valid Json: " + e)
    }
    return {};
}

angular.module('attachments',['ngResource'])
.run(function($rootScope) {
    $rootScope.attachments_object = {};
})
.factory('Note', ['$resource', function ($resource) {
  return $resource('/attachments/api/notes/:id/', {id:'@id'}, {
    query: { method: 'GET', transformResponse:transformDjangoRestResponse, isArray:true },
    save : { method : 'PUT' },
    create : { method : 'POST' },
    remove : { method : 'DELETE' }
  });
}])
.factory('File', ['$resource', function ($resource) {
  return $resource('/attachments/api/files/:id/', {id:'@id'}, {
    query: { method: 'GET', transformResponse:transformDjangoRestResponse, isArray:true },
    save : { method : 'PUT' },
    remove : { method : 'DELETE' }
  });
}]);

