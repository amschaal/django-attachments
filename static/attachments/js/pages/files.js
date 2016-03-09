
angular.module('attachments')
.requires.push('ngFileUpload');
angular.module('attachments')
.controller('FilesController', ['$scope','$rootScope','Upload','File', FilesController]);

function FilesController($scope,$rootScope,Upload,$File) {
	$scope.files = [];
	var upload_url = {};
	function setFilesCount(){
		$rootScope.attachments_object.files = $scope.files.length;
	}
	$scope.deleteFile = function(file,index){
		if (!confirm("Are you sure you want to delete this file?"))
			return;
		file.$remove(function(){
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
	$scope.init = function(params){
		console.log('params',params);
		upload_url = $scope.getURL('attach_file',params);
		$scope.files = $File.query({content_type:params.content_type_id,object_id:params.pk},function(){setFilesCount()});
	}
	$scope.uploadFiles = function (files) {
	      if (files && files.length) {
	        for (var i = 0; i < files.length; i++) {
	          Upload.upload({url:upload_url, data: {file:files[i]}})
		          .then(function (resp) {
		              console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
		              $scope.files.push(new $File(resp.data));
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
	
}

