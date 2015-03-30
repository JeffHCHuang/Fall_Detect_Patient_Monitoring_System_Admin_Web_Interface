var app = angular.module("fallingMyoApp", ["firebase"]);

app.factory("unauthorizedPatients", ["$firebaseArray",
  function ($firebaseArray) {
      var unauthorizedReferece = new Firebase("https://fallingmyo.firebaseIO.com/Unauthorized");

      return $firebaseArray(unauthorizedReferece);
  }
]);

app.factory("authorizedPatients", ["$firebaseArray",
    function ($firebaseArray) {
        
        var authorizedReference = new Firebase("https://fallingmyo.firebaseIO.com/Authorized");

        var updatedRefArray = $firebaseArray(authorizedReference);

        return updatedRefArray;
    }
]);

app.controller("unauthorizedController", ["$scope", "unauthorizedPatients", "authorizedPatients",

    function ($scope, unauthorizedPatients, authorizedPatients) {
        
        $scope.unauthorizedPatients = unauthorizedPatients;

        $scope.authorizedPatients = authorizedPatients;

        $scope.authorizePatient = function (patient) {
            var accountID = $scope.accountID;
            var newRoomNumber = $scope.newRoomNumber;
            $scope.authorizedPatients.$add(patient);
            $scope.unauthorizedPatients.$remove(patient);
        }

        $scope.deletePatient = function (patient) {
            $scope.unauthorizedPatients.$remove(patient);   
        }
    }
]);

app.controller("authorizedController", ["$scope", "unauthorizedPatients", "authorizedPatients",

    function ($scope, unauthorizedPatients, authorizedPatients) {

        $scope.editRoomIndices = new Array();

        $scope.unauthorizedPatients = unauthorizedPatients;

        $scope.authorizedPatients = authorizedPatients;

        $scope.isThereAnEmergency = function () {
            for (var i = 0; i < $scope.authorizedPatients.length; i++) {
                if ($scope.authorizedPatients[i].emergency) {
                    return true;
                }
            }
            return false;
        }

        $scope.isThereAPendingRequest = function () {
            for (var i = 0; i < $scope.authorizedPatients.length; i++) {
                if ($scope.authorizedPatients[i].assistanceRequired != "NONE") {
                    return true;
                }
            }
            return false;
        }

        $scope.editPatientRoomNumber = function (index) {
            $scope.editRoomIndices.push(index);
        }

        $scope.submitNewRoomNumber = function (patient, index) {
            $scope.authorizedPatients.$save(patient);
            $scope.editRoomIndices.splice($scope.editRoomIndices.indexOf(index), 1);
        }

        $scope.emergencyHandled = function (patient) {
            patient.emergency = false;
            console.log(patient);
            $scope.authorizedPatients.$save(patient);
        }

        $scope.assistanceHandled = function (patient) {
            patient.assistanceRequired = "NONE";
            $scope.authorizedPatients.$save(patient);
        }
    }
]);