var Bees = Bees || {};
var myApp = angular.module('myApp', ['ngRoute'])

/* 
 Route for game
*/
.config(['$routeProvider',function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'pages/game.html',
      controller  : 'myCtrl'
  })
}])

/*
  Controller for application
*/
myApp.controller('myCtrl',['$scope','$timeout', function($scope, $timeout) {

  $scope.availableBees = [];
  $scope.states = {
    intro: true,
    startGame: false
  }
  /* Set coundown value for 5 seconds */
  $scope.countDown = 5;


  $scope.beginGame = function() {
    $scope.states.intro = false;
    $scope.states.startGame = true;
  }

  /* Push bees to availableBees */
  $scope.availableBees.push(Bees.availableBees('Queen'));

  for(var i = 0; i < 5; i++) {
    $scope.availableBees.push(Bees.availableBees('Worker', i+1));
  }

  for(var i = 0; i < 8; i++) {
    $scope.availableBees.push(Bees.availableBees('Drone', i+1));
  }
  
  /* Copy original available bees */
  $scope.origData = angular.copy($scope.availableBees);

  $scope.hitBee = function(random) {
    /* Get random number to select a bee */
    var random = (typeof random !=='undefined') ? random : Math.floor((Math.random() * $scope.availableBees.length));
    
    if ($scope.availableBees[random].life > 0) {
        $scope.availableBees[random].life -= $scope.availableBees[random].hit;
        $scope.hit = $scope.availableBees[random].beeName;
       
        if ($scope.availableBees[random].life < 0) {
          $scope.availableBees[random].life = 0;
        }
        /* If bee equals queen and its life is zero then set all other bees should have a life of 0. */
        if ($scope.availableBees[random].beeType === 'Queen' && $scope.availableBees[random].life === 0) {
          $scope.queenDead = true;
          for(var i=0; i<$scope.availableBees.length; i++) {
            $scope.availableBees[i].life = 0;
          }


          /* Countdown the time to reset the game. */  
          var timer = setInterval(function(){
            $scope.countDown--;
            $scope.$apply();
          }, 1000);

          /* Call reset data to restart the game. */
          $scope.resetData();
        }
      }
      else {
        // If Bee is dead run function again
        $scope.hitBee();
      }
  }

  $scope.resetData = function() {
    $timeout(function() {
      for(var i=0; i<$scope.availableBees.length; i++) {
        $scope.availableBees[i].life = angular.copy($scope.origData[i].life);
      }
      $scope.queenDead = false;
      $scope.hit = '';
    }, 5000);
  }

}])

.filter('groupBy', function() {
  return _.memoize(function(items, field) {
    return _.groupBy(items, field);
  });
});


Bees.availableBees = function(beeType, index) {
  var beeAttributes = {};
  switch(beeType) {
    case 'Queen': 
      beeAttributes = {
        beeType: beeType,
        beeName: beeType,
        life: 100,
        hit: 8
      }
    break;
    case 'Worker':
      beeAttributes = {
        beeType: beeType,
        beeName: beeType + ' ' + index,
        life: 75,
        hit: 10
      }
    break;
    case 'Drone':
      beeAttributes = {
        beeType: beeType,
        beeName: beeType + ' ' + index,
        life: 50,
        hit: 12
      }
    break;
    default: 
    break;
  }
  return beeAttributes;
}
