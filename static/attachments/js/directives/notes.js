angular.module("attachment-notes", []);

angular.module('attachments').requires.push("attachment-notes")
angular.module("attachment-notes")
.directive('attachmentNotes', function(Note) {
	return {
		restrict: 'AE',
		templateUrl: 'template/attachments/notes.html',
		scope: {
			objectId:'=',
			contentType:'=',
			tags:'@'
		},
		controller: function ($scope,$rootScope) {
			var noteHash={}, noteDefaults={};
			$scope.getResponses = function(note){
				if(note)
					return noteHash[note.id];
				else
					return noteHash[null];
			};
			function setNotesCount(){
				var count = 0;
				console.log('setNotesCount')
				angular.forEach(noteHash,function(notes,key){
					console.log('counting',notes,key);
					count += notes.length;
				});
				if ($scope.notes)
					$rootScope.attachments_object.notes = count;
			}
			var setNoteDefaults = function(defaults){
				noteDefaults = defaults;
			};
			$scope.save = function(note){
				if(note.id)
					note.$save();
				else
					note.$create();
			};
			$scope.newNote = function(){
				var note = new Note(noteDefaults);
				note.editing=true;
				note.parent = null;
				$scope.addNote(note);
			};
			$scope.deleteNote = function(note){
				if (!confirm("Are you sure you want to delete this note and all responses?"))
					return;
				var parent = note.parent;
				var id = note.id;
				var removeFunc = function() {
					for (var i in noteHash[parent]){
						if (noteHash[parent][i].id == id)
							noteHash[parent].splice(i,1);
					}
					setNotesCount();
				};
				if(!id){
					removeFunc();
					return;
				}
				note.$remove(removeFunc);
			};
			$scope.respond = function(parent){
				var note = new Note(noteDefaults);
				note.parent=parent.id;
				note.editing=true;
				$scope.addNote(note);
			};
			$scope.addNote = function(note){
				console.log(note);
				if(!noteHash[note.parent])
					noteHash[note.parent] = [];
				noteHash[note.parent].push(note);
				setNotesCount();
			};
			$scope.toggleTag  = function (note,tag) {
				console.log('before',note.tags,tag);
		        if (note.tags.indexOf(tag) === -1) {
		        	note.tags.push(tag);
		        } else {
		        	note.tags.splice(note.tags.indexOf(tag), 1);
		        }
		        console.log('after',note.tags,tag);
		    };
		    $scope.getTagLabel = function(tag){
		    	return $scope.tags[tag] ? $scope.tags[tag] : tag;
		    }
		    if (!$scope.tags)
		    	$scope.tags = {
		            'issue':'Issue',
		            'closed':'Closed'
		        }; 
		    setNoteDefaults({content_type:$scope.contentType,object_id:$scope.objectId, tags:[]})
		    var query = angular.copy(noteDefaults);
		    query.page_size = -1;
			$scope.notes = Note.query(query,function() {
				angular.forEach($scope.notes,function(note){
					$scope.addNote(note);
				});
				setNotesCount();
				console.log(noteHash);
			});
		}
	}
});

angular.module("attachment-notes").run(['$templateCache', function($templateCache) {
	$templateCache.put('template/attachments/noteResponses.html',
	'<div class="note-wrapper" ng-class="note.tags" ng-repeat="note in getResponses(note)|orderBy:\'created\'">\
	<div class="alert note" >\
	<div ng-if="note.editing">\
		<button type="button" class="close" data-dismiss="alert" ng-click="note.editing=false"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>\
		<textarea ng-model="note.content" placeholder="Enter text here..." class="form-control">{[note.content]}</textarea>\
		<span class="pull-left"><label ng-repeat="(tag,label) in tags"><input type="checkbox" ng-checked="note.tags.indexOf(tag) != -1" ng-click="toggleTag(note,tag)"> {[label]} </label></span>\
		<button class="btn btn-success btn-sm pull-right" ng-click="save(note)">Save</button>\
		<div style="clear:both"></div>\
	</div>\
	<div ng-if="!note.editing">\
		<p>\
		<small class="details">Created {[note.created|date:"short"]} by {[note.created_by]}</small>\
		<small ng-if="note.modified && note.modified_by" class="details"> Last modified {[note.modified|date:"short"]} by {[note.modified_by]}</small>\
		<small class="pull-right" ng-if="note.tags.length"> <i class="glyphicon glyphicon-tags"></i> <span ng-repeat="tag in note.tags"> {[getTagLabel(tag)]}{[$last ? "" : ", "]}</span></small>\
		</p>\
		<div class="content">{[note.content]}</div>\
		<p>\
		<i style="margin-left:5px" class="glyphicon glyphicon-share-alt pull-right" ng-click="respond(note)" ng-if="note.id"></i>\
		<i style="margin-left:5px" class="glyphicon glyphicon-pencil pull-right" ng-click="note.editing=true"></i>\
		<i class="glyphicon glyphicon-remove pull-right" ng-click="deleteNote(note)"></i>\
		</p>\
	</div>\
</div>\
<ng-include src="\'template/attachments/noteResponses.html\'"></ng-include>\
</div>'
	);
}]);


angular.module("attachment-notes").run(['$templateCache', function($templateCache) {
	$templateCache.put('template/attachments/notes.html',
			'<h4 ng-if="notes.length < 1">There are currently no notes.</h4>\
			<ng-include src="\'template/attachments/noteResponses.html\'"></ng-include>\
			<button ng-click="newNote()" class="btn btn-success">Add note</button>'
	);
}]);

