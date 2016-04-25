describe('The Bee Game App', function () {

  // load the controller's module
  beforeEach(function() {
    module('myApp');
  });

  var myCtrl,
    scope, 
    $filter;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$filter_,$rootScope, $controller) {
    $filter = _$filter_;
    scope = $rootScope.$new();
    // The injector unwraps the underscores (_) from around the parameter names when matching
    myCtrl =  $controller('myCtrl', {
      $scope: scope
    });
  }));

  it("should attach a list of bees to the scope", function () {
    expect(scope.availableBees.length).toBe(14);
  });

  it("expect queen bee length to be 1", function () {
    var groupedBees = $filter('groupBy')(scope.availableBees, 'beeType');
    expect(groupedBees.Queen.length).toBe(1);
  });

  it("expect worker bee length to be 5", function () {
    var groupedBees = $filter('groupBy')(scope.availableBees, 'beeType');
    expect(groupedBees.Worker.length).toBe(5);
  });

  it("expect drone bee length to be 8", function () {
    var groupedBees = $filter('groupBy')(scope.availableBees, 'beeType');
    expect(groupedBees.Drone.length).toBe(8);
  });

  it("expect life to be 75", function () {
    var random = 3;
    expect(scope.availableBees[random].life).toBe(75);
  });

  it("expect name to be Worker 5", function () {
    var random = 5;
    expect(scope.availableBees[random].beeName).toBe('Worker 5');
  });

  it("expect life to be 38", function () {
    var random = 7;
    scope.hitBee(random);
    expect(scope.availableBees[random].life).toBe(38);
  });

  it("expect queen dead to be true", function () {
    scope.availableBees[0].life = 4;
    scope.hitBee(0);
    expect(scope.queenDead).toBe(true);
  });
  
});