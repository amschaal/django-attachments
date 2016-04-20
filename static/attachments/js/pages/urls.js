
angular.module('attachments')
.controller('URLController', ['$scope','$rootScope','URL', URLController]);

function URLController($scope,$rootScope,URL) {
	$scope.urls = [];
	var urlDefaults = {};
	function setURLsCount(){
		$rootScope.attachments_object.urls = $scope.urls.length;
	}
	$scope.deleteURL = function(url,index){
		if (!confirm("Are you sure you want to delete this url?"))
			return;
		url.$remove(function(){
			$scope.urls.splice(index,1);
			setURLsCount();
		});
	};
	$scope.editURL = function(url){
		url.editing = true;
	};
	$scope.setURLDefaults = function(defaults){
		urlDefaults = defaults;
	};
	$scope.save = function(url){
		if(url.id)
			url.$save();
		else
			url.$create();
	};
	$scope.init = function(params){
		console.log('url params',params);
		$scope.urls = URL.query({content_type:params.content_type_id,object_id:params.object_id},function(){setURLsCount()});
	}
	$scope.newURL = function(){
		var url = new URL(urlDefaults);
		url.editing=true;
		$scope.urls.push(url);
	};
	
}

