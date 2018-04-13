'use strict';

function mealClass(stepClass) {

    function Meal() {
        var self = this;
        self.id = create_UUID();
        self.name = '';
        self.duration = 0;
        self.steps = [];
    }

    Meal.prototype.convertStepsToDuration = function () {
        var duration = 0;

        this.steps.forEach(function (step) {
            return duration += step.duration;
        });

        this.duration = duration;
    };

    Meal.prototype.formattedDuration = function () {
        var hours = Math.floor(this.duration % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        var minutes = Math.floor(this.duration % (1000 * 60 * 60) / (1000 * 60));
        var seconds = Math.floor(this.duration % (1000 * 60) / 1000);

        return hours + 'h ' + minutes + 'm ' + seconds + 's';
    };

    Meal.build = function (dto) {
        var meal = new Meal();

        if (!dto) return meal;

        meal.id = dto.id;
        meal.name = dto.name;
        meal.steps = dto.steps ? dto.steps.map(stepClass.build) : [];

        meal.convertStepsToDuration();

        return meal;
    };

    return Meal;
}
'use strict';

function stepClass() {
    function Step() {
        this.id = '';
        this.name = '';
        this.duration = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
    }

    Step.prototype.parseDuration = function () {
        this.duration += this.hours * 60 * 60 * 1000;
        this.duration += this.minutes * 60 * 1000;
        this.duration += this.seconds * 1000;
    };

    Step.prototype.formattedDuration = function () {
        var hours = Math.floor(this.duration % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        var minutes = Math.floor(this.duration % (1000 * 60 * 60) / (1000 * 60));
        var seconds = Math.floor(this.duration % (1000 * 60) / 1000);

        return hours + 'h ' + minutes + 'm ' + seconds + 's';
    };

    Step.build = function (dto) {
        var step = new Step();

        if (!dto) return step;

        step.id = dto.id;
        step.name = dto.name;
        step.hours = dto.hours;
        step.minutes = dto.minutes;
        step.seconds = dto.seconds;

        step.parseDuration();

        return step;
    };

    return Step;
}
'use strict';

function mealService($http, $filter, $window, mealClass) {

    var data = '../../../data.json';

    function get() {
        var meals = angular.fromJson($window.localStorage.meals);

        return meals ? meals : [];
    }

    function getById(id) {
        var allMeals = get().map(mealClass.build);
        var mealsForId = $filter('filter')(allMeals, { id: id });

        return mealsForId.length !== 1 ? mealClass.build() : mealClass.build(mealsForId[0]);
    }

    function post(meal) {
        var meals = angular.fromJson($window.localStorage.meals);

        if (!meals) meals = [];

        var index = meals.map(function (m) {
            return m.id;
        }).indexOf(meal.id);

        if (index > -1) meals[index] = meal;else meals.push(meal);

        $window.localStorage.meals = angular.toJson(meals);
    }

    var service = {
        get: get,
        getById: getById,
        post: post
    };

    return service;
}
'use strict';

var thymerApp = angular.module('thymerApp', ['ngRoute']);

angular.module('thymerApp').factory('stepClass', stepClass);
angular.module('thymerApp').factory('mealClass', ['stepClass', mealClass]);
angular.module('thymerApp').factory('mealService', ['$http', '$filter', '$window', 'mealClass', mealService]);

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
}
'use strict';

thymerApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '../templates/_Home.html',
        controller: 'homeController'
    }).when('/New', {
        templateUrl: '../templates/_Edit.html',
        controller: 'editController'
    }).when('/Edit/:id', {
        templateUrl: '../templates/_Edit.html',
        controller: 'editController'
    }).when('/Run/:id', {
        templateUrl: '../templates/_Run.html',
        controller: 'runController'
    }).otherwise({
        redirectTo: '/'
    });
}]);
'use strict';

(function () {
    'use strict';

    angular.module('thymerApp').controller('editController', ['$scope', '$routeParams', '$location', '$filter', 'mealService', 'mealClass', 'stepClass', editController]);

    function editController($scope, $routeParams, $location, $filter, mealService, mealClass, stepClass) {
        $scope.id = $routeParams.id;
        $scope.meal = mealClass.build();

        $scope.addStep = function () {
            $scope.meal.steps.push(stepClass.build());
        };

        $scope.removeStep = function (index) {
            $scope.meal.steps.splice(index, 1);
        };

        $scope.saveMeal = function () {
            $scope.meal.convertStepsToDuration();

            mealService.post($scope.meal);
            $location.path('/');
        };

        $scope.goBack = function () {
            $location.path('/');
        };

        activate();

        function activate() {
            $scope.meal = mealService.getById($scope.id);
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('thymerApp').controller('homeController', ['$scope', '$location', '$filter', 'mealService', 'mealClass', homeController]);

    function homeController($scope, $location, $filter, mealService, mealClass) {
        $scope.meals = [];

        $scope.goAdd = function () {
            $location.path('/New');
        };

        $scope.goEdit = function (id) {
            $location.path('/Edit/' + id);
        };

        $scope.goRun = function (id) {
            $location.path('/Run/' + id);
        };

        activate();

        function activate() {
            $scope.meals = mealService.get().map(mealClass.build);
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('thymerApp').controller('runController', ['$scope', '$location', '$filter', 'mealService', 'mealClass', runController]);

    function runController($scope, $location, $filter, mealService, mealClass) {
        $scope.meal = mealClass.build();

        $scope.goRun = function () {};

        $scope.goEdit = function (id) {
            $location.path('/Edit/' + id);
        };

        activate();

        function activate() {
            $scope.meal = mealService.getById($scope.id);
        }
    }
})();