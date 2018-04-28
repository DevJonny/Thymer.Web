'use strict';

function mealClass(util, stepClass) {

    function Meal() {
        var self = this;
        self.id = util.createUUID();
        self.name = '';
        self.duration = 0;
        self.steps = [];
    }

    Meal.prototype.convertStepsToDuration = function () {

        var orderedSteps = this.steps.sort(function (a, b) {
            return a.duration < b.duration;
        });

        if (orderedSteps.length > 0) this.duration = orderedSteps[0].duration;else this.duration = 0;
    };

    Meal.prototype.formattedDuration = function () {
        return util.formatDuration(this.duration);
    };

    Meal.prototype.stepCount = function () {
        return this.steps.length;
    };

    Meal.prototype.hasSteps = function () {
        return this.steps.length > 0;
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

function stepClass(util) {
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
        return util.formatDuration(this.duration);
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

angular.module('thymerApp').factory('util', util);
angular.module('thymerApp').factory('stepClass', stepClass);
angular.module('thymerApp').factory('mealClass', ['util', 'stepClass', mealClass]);
angular.module('thymerApp').factory('mealService', ['$http', '$filter', '$window', 'mealClass', 'stepClass', mealService]);
'use strict';

function util() {

    function create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
        });
        return uuid;
    }

    function formatDuration(duration) {
        var hours = Math.floor(duration % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        var minutes = Math.floor(duration % (1000 * 60 * 60) / (1000 * 60));
        var seconds = Math.floor(duration % (1000 * 60) / 1000);

        return hours + 'h ' + minutes + 'm ' + seconds + 's';
    }

    var util = {
        createUUID: create_UUID,
        formatDuration: formatDuration
    };

    return util;
}
'use strict';

thymerApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: '/Thymer.Web/templates/Home.html',
        controller: 'homeController'
    }).when('/New', {
        templateUrl: '/Thymer.Web/templates/Edit.html',
        controller: 'editController'
    }).when('/Edit/:id', {
        templateUrl: '/Thymer.Web/templates/Edit.html',
        controller: 'editController'
    }).when('/Run/:id', {
        templateUrl: '/Thymer.Web/templates/Run.html',
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
            if ($scope.id) $scope.meal = mealService.getById($scope.id);
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

    angular.module('thymerApp').controller('runController', ['$scope', '$routeParams', '$location', '$filter', 'util', 'mealService', 'mealClass', 'stepClass', runController]);

    function runController($scope, $routeParams, $location, $filter, util, mealService, mealClass, stepClass) {
        $scope.id = $routeParams.id;
        $scope.meal = mealClass.build();
        $scope.currentStep;
        $scope.nextStep;
        $scope.currentTimer = 0;
        $scope.nextStepTimer = 0;
        $scope.pastSteps = [];
        $scope.running = false;
        $scope.paused = false;
        $scope.complete = false;
        $scope.timerId = 0;

        $scope.goHome = function () {
            $location.path('');
        };

        $scope.goEdit = function () {
            $location.path('/Edit/' + $scope.meal.id);
        };

        $scope.doRun = function () {

            $scope.currentStep = $scope.nextStep;
            $scope.nextStep = $scope.meal.steps.length > 0 ? $scope.meal.steps.shift() : stepClass.build();

            if ($scope.hasRemainingSteps()) {
                $scope.nextStepTimer = $scope.currentTimer - $scope.nextStep.duration;
            } else $scope.nextStepTimer = 0;

            $scope.running = true;

            $scope.timerId = setInterval(function () {
                if ($scope.paused) return;

                $scope.currentTimer -= 1000;
                $scope.nextStepTimer = $scope.nextStep ? $scope.nextStepTimer - 1000 : 1;

                var nextStepTimerElapsed = $scope.nextStepTimer <= 0;

                if (nextStepTimerElapsed) {
                    new Audio('/Thymer.Web/assets/step_finished.mp3').play();

                    $scope.pastSteps.push($scope.currentStep);
                    $scope.currentStep = $scope.nextStep;

                    if ($scope.hasRemainingSteps()) {
                        $scope.nextStep = $scope.meal.steps.shift();
                        $scope.nextStepTimer = $scope.nextStep.duration;
                    } else {
                        $scope.nextStep = null;
                        $scope.nextStepTimer = 0;
                    }
                }

                if ($scope.currentTimer <= 0) {
                    new Audio('/Thymer.Web/assets/meal_finished.mp3').play();
                    $scope.pastSteps.push($scope.currentStep);
                    $scope.running = false;
                    $scope.complete = true;
                    $scope.currentTimer = 0;
                    clearInterval($scope.timerId);
                    $scope.$apply();
                    return;
                }

                $scope.$apply();
            }, 1000);
        };

        $scope.doStop = function () {
            clearInterval($scope.timerId);

            $scope.running = false;
            $scope.paused = false;

            activate();
        };

        $scope.doPause = function () {
            $scope.paused = true;
            $scope.running = false;
        };

        $scope.doResume = function () {
            $scope.paused = false;
            $scope.running = true;
        };

        $scope.currentTimeLeft = function () {
            return util.formatDuration($scope.currentTimer);
        };

        $scope.timeUntilNextStep = function () {
            return util.formatDuration($scope.nextStepTimer);
        };

        $scope.remainingSteps = function () {
            if ($scope.nextStepIndex + 1 === $scope.meal.steps.length) return [];

            return $scope.meal.steps.slice($scope.nextStepIndex + 1);
        };

        $scope.hasRemainingSteps = function () {
            return $scope.meal.stepCount() > 0;
        };

        activate();

        function activate() {
            $scope.meal = mealService.getById($scope.id);
            $scope.currentTimer = $scope.meal.duration;
            $scope.nextStep = $scope.meal.steps.shift();
        }
    }
})();