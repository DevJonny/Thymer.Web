(function() {
    'use strict';

    angular
        .module('thymerApp')
        .controller('runController', ['$scope', '$routeParams', '$location', '$filter', 'util', 'mealService', 'mealClass', runController]);

    function runController($scope, $routeParams, $location, $filter, util, mealService, mealClass) {
        $scope.id = $routeParams.id;
        $scope.meal = mealClass.build();
        $scope.nextStepIndex = 0;
        $scope.currentTimer = 0;
        $scope.nextStepTimer = 0;
        $scope.running = false;
        $scope.paused = false;
        $scope.timerId = 0;

        $scope.goHome = () => {
            $location.path('');
        };

        $scope.goEdit = () => {
            $location.path(`/Edit/${$scope.meal.id}`);
        };

        $scope.doRun = () => {
            if (!$scope.paused) $scope.nextStepIndex++;

            if ($scope.nextStepIndex < $scope.meal.steps.length) {
                $scope.nextStepTimer = $scope.currentTimer - $scope.meal.steps[$scope.nextStepIndex].duration;
            } else $scope.nextStepTimer = 0;

            $scope.running = true;

            $scope.timerId = setInterval(() => {
                if ($scope.paused) return;

                $scope.currentTimer -= 1000;
                $scope.nextStepTimer -= 1000;
                $scope.$apply();
            }, 1000);
        };

        $scope.doStop = () => {
            clearInterval($scope.timerId);

            $scope.nextStepIndex = 0;
            $scope.running = false;
            $scope.paused = false;

            activate();
        };

        $scope.doPause = () => {
            $scope.paused = true;
            $scope.running = false;
        };

        $scope.doResume = ()=> {
            $scope.paused = false;
            $scope.running = true;
        };

        $scope.currentTimeLeft = () => {
            return util.formatDuration($scope.currentTimer);
        };

        $scope.timeUntilNextStep = () => {
            return util.formatDuration($scope.nextStepTimer);
        };

        $scope.currentStep = () => {
            if (!$scope.meal.hasSteps()) return '';
            if ($scope.nextStepIndex === 0) return $scope.meal.steps[0].name;

            return $scope.meal.steps[$scope.nextStepIndex-1].name;
        }

        $scope.remainingSteps = () => {
            if ($scope.nextStepIndex + 1 === $scope.meal.steps.length) return [];

            return $scope.meal.steps.slice($scope.nextStepIndex + 1);
        };

        activate();

        function activate() {
            $scope.meal = mealService.getById($scope.id);
            $scope.currentTimer = $scope.meal.duration;
        }
    }
})();