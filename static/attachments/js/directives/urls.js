angular.module("attachment-urls", []);

angular.module('attachments').requires.push("attachment-urls")
angular.module("attachment-urls")
.directive('attachmentUrls', function(URL) {
	return {
		restrict: 'AE',
		templateUrl: 'template/attachments/urls.html',
		scope: {
			objectId:'=',
			contentType:'='
		},
		controller: function ($scope,$rootScope) {
			$scope.urls = [];
			var urlDefaults = {};
			function setURLsCount(){
				$rootScope.attachments_object.urls = $scope.urls.length;
			}
			$scope.deleteURL = function(index){
				if (!$scope.urls[index].id)
					$scope.urls.splice(index,1);
				else {
					if (!confirm("Are you sure you want to delete this url?"))
						return;
					$scope.urls[index].$remove(function(){
						$scope.urls.splice(index,1);
						setURLsCount();
					});
				}
			};
			$scope.editURL = function(url){
				url.editing = true;
			};
			function setURLDefaults(defaults){
				urlDefaults = defaults;
			};
			$scope.save = function(url){
				if(url.id)
					url.$save(function(){},function(response){url.errors = response.data;});
				else
					url.$create(function(){setURLsCount();},function(response){url.errors = response.data;});
			};
			$scope.newURL = function(){
				var url = new URL(urlDefaults);
				url.editing=true;
				$scope.urls.push(url);
			};
			setURLDefaults({content_type:$scope.contentType,object_id:$scope.objectId})
			$scope.urls = URL.query({content_type:$scope.contentType,object_id:$scope.objectId,page_size:1000},function(){setURLsCount()});
		}
	}
});

angular.module("attachment-urls").run(['$templateCache', function($templateCache) {
	$templateCache.put('template/attachments/urls.html',
	'<h4 ng-if="!urls.length">There are currently no URLs.</h4>\
	<table class="table" ng-if="urls.length">\
	<tr class="no-border-top"><th>URL</th><th>Modified</th><th>Modified by</th><th>Description</th><td></td></tr>\
	<tr ng-repeat="url in urls | orderBy:\'-created\'">\
	<td ng-if="!url.editing"><a href="{[url.url]}"><span ng-if="url.text">{[url.text]}</span><span ng-if="!url.text">{[url.url]}</span></a></td>\
	<td ng-if="url.editing">\
		<label ng-class="{\'error\':url.errors}">URL: </label> <input ng-model="url.url"/><br>\
		<label>Text: </label> <input ng-model="url.text"/>\
	</td>\
	<td>{[url.modified|date:\'short\']}</td>\
	<td>{[url.modified_by]}</td>\
	<td ng-if="!url.editing">{[url.description]}</td><td ng-if="url.editing"><textarea ng-model="url.description"></textarea></td>\
	<td>{[file.size]}</td>\
	<td>\
		<button class="btn btn-xs btn-danger pull-right" ng-click="deleteURL($index)">Delete</button>\
		<button class="btn btn-xs pull-right" ng-if="!url.editing" ng-click="editURL(url)">Edit</button>\
		<button class="btn btn-xs btn-success pull-right" ng-if="url.editing" ng-click="save(url)">Save</button>\
	</td>\
	</tr>\
	</table>\
	<button ng-click="newURL()" class="btn btn-success">Add URL</button>'
	);
}]);


