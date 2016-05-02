angular.module("attachment-files", ['ngFileUpload']);

angular.module('attachments').requires.push("attachment-files")
angular.module("attachment-files")
.directive('attachmentFiles', function(File) {
	return {
		restrict: 'AE',
		templateUrl: 'template/attachments/files.html',
		scope: {
			objectId:'@',
			contentType:'@'
		},
		controller: function ($scope,$rootScope,Upload) {
			$scope.files = [];
			var upload_url = {};
			function setFilesCount(){
				$rootScope.attachments_object.files = $scope.files.length;
			}
			$scope.deleteFile = function(index){
				if (!confirm("Are you sure you want to delete this file?"))
					return;
				$scope.files[index].$remove(function(){
					$scope.files.splice(index,1);
					setFilesCount();
				});
			};
			$scope.editFile = function(file){
				file.editing = true;
			};
			$scope.saveFile = function(file){
				file.$save();
			};
			function init(){
				upload_url = $rootScope.getURL('attach_file',{content_type_id:$scope.contentType,pk:$scope.objectId});
				$scope.files = File.query({content_type:$scope.contentType,object_id:$scope.objectId},function(){setFilesCount()});
			}
			$scope.uploadFiles = function (files) {
			      if (files && files.length) {
			        for (var i = 0; i < files.length; i++) {
			          Upload.upload({url:upload_url, data: {file:files[i]}})
				          .then(function (resp) {
				              console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
				              $scope.files.push(new File(resp.data));
				              setFilesCount();
				          }, function (resp) {
				              console.log('Error status: ' + resp.status);
				          }, function (evt) {
				              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				          });
			        }
			      }
		    }
			init();
		}
	}
});

angular.module("attachment-files").run(['$templateCache', function($templateCache) {
	$templateCache.put('template/attachments/files.html',
	'<div ngf-drop="uploadFiles($files)" class="drop-box" ng-model="file_uploads"\
			  ngf-drag-over-class="\'dragover\'" ngf-multiple="true">Drop files here</div>\
		  <div ngf-no-file-drop>File Drag/Drop is not supported for this browser</div>\
		  <h4 ng-if="!files.length">There are currently no files.</h4>\
		  <table class="table" ng-if="files.length">\
			  <tr class="no-border-top"><th>File</th><th>Uploaded</th><th>Uploaded by</th><th>Description</th><th>Size</th><td></td></tr>\
			  <tr ng-repeat="file in files | orderBy:\'-uploaded\'">\
			  <td><a href="{[file.file]}">{[file.name]}</a></td>\
			  <td>{[file.uploaded|date:"short"]}</td>\
			  <td>{[file.uploaded_by]}</td>\
			  <td ng-if="!file.editing">{[file.description]}</td><td ng-if="file.editing"><textarea ng-model="file.description"></textarea></td>\
			  <td>{[file.size]}</td>\
			  <td>\
			  	<button class="btn btn-xs btn-danger pull-right" ng-click="deleteFile($index)">Delete</button>\
			  	<button class="btn btn-xs pull-right" ng-if="!file.editing" ng-click="editFile(file)">Edit</button>\
			  	<button class="btn btn-xs btn-success pull-right" ng-if="file.editing" ng-click="saveFile(file)">Save</button>\
			  </td>\
			  </tr>\
		  </table>'
	);
}]);


