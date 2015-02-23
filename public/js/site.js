var siteApp = angular.module("siteApp", [ ]);

//custom function for find object in Array by index
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
};

siteApp.controller("projectController", function($scope, $http){
  $scope.projects = {};
  $scope.formData = {};


  $scope.fetchProjects = function(){
    $http.get("/api/projects").success(function(projects){
      $scope.projects = projects;
    }).error(function(data){
      console.log("Error processing: "+ data);
    });
  };

  $scope.createProject = function(){
    $http.post("api/projects", $scope.formData).success(function(projects){
      $scope.formData = {};
      $scope.projects = projects;
      console.log($scope.projects);
    }).error(function(data){
      console.log("Error processing: "+ data);
    });
  };

  $scope.modifyProject = function(id) {
    var localId = arrayObjectIndexOf($scope.projects, id, "_id");
    console.log(localId,id);
    $scope.projects[localId].isEdited = false;
    console.log($scope.projects[localId]._id);
    $http.put("/api/projects/"+ $scope.projects[localId]._id, $scope.projects[localId]).success(function(data){
      $scope.projects = data;
      console.log(data);
    }).error(function(data){
      console.log("Error:" + data);
    });
  };

  $scope.Edit = function(id) {
    var actual_id = arrayObjectIndexOf($scope.projects, id, "_id");
    $scope.projects[actual_id].isEdited = !$scope.projects[actual_id].isEdited;
    console.log($scope.projects[actual_id].isEdited);
  };

  $scope.deleteProject = function(id) {
      var localId = arrayObjectIndexOf($scope.projects, id, "_id");
      $http.delete("/api/projects/" + $scope.projects[localId]._id).success(function(data){
        $scope.projects = data;
        console.log(data);
      }).error(function(data){
        console.log("Error:" + data);
      });
  };



$scope.fetchProjects();
});
