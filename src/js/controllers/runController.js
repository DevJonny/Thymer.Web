(function() {
    'use strict';

    angular
        .module('thymerApp')
        .controller('runController', ['$scope', '$routeParams', '$location', '$filter', 'util', 'mealService', 'mealClass', 'stepClass', runController]);

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

        $scope.goHome = () => {
            $location.path('');
        };

        $scope.goEdit = () => {
            $location.path(`/Edit/${$scope.meal.id}`);
        };

        $scope.doRun = () => {

            $scope.currentStep = $scope.nextStep;
            $scope.nextStep = $scope.meal.steps.length > 0 ? $scope.meal.steps.shift() : stepClass.build();

            if ($scope.hasRemainingSteps()) {
                $scope.nextStepTimer = $scope.currentTimer - $scope.nextStep.duration;
            } else $scope.nextStepTimer = 0;

            $scope.running = true;

            $scope.timerId = setInterval(() => {
                if ($scope.paused) return;

                $scope.currentTimer -= 1000;
                $scope.nextStepTimer = $scope.nextStep
                                            ? $scope.nextStepTimer - 1000
                                            : 1;

                var nextStepTimerElapsed = $scope.nextStepTimer <= 0;

                if (nextStepTimerElapsed) {
                    console.log(`${$scope.currentStep.name} is done!`)

                    $scope.pastSteps.push($scope.currentStep);
                    $scope.currentStep = $scope.nextStep;

                    if ($scope.hasRemainingSteps()) {
                        $scope.nextStep = $scope.meal.steps.shift();
                        $scope.nextStepTimer = $scope.nextStep.duration
                    }
                    else {
                        $scope.nextStep = null;
                        $scope.nextStepTimer = 0;
                    }
                }

                if ($scope.currentTimer <= 0) {
                    console.log(`${$scope.meal.name} is complete!`);
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

        $scope.doStop = () => {
            clearInterval($scope.timerId);

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

        $scope.remainingSteps = () => {
            if ($scope.nextStepIndex + 1 === $scope.meal.steps.length) return [];

            return $scope.meal.steps.slice($scope.nextStepIndex + 1);
        };

        $scope.hasRemainingSteps = () => {
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