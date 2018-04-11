(function() {
    'use strict';

    angular
        .module('thymerApp')
        .controller('editController', ['$scope', '$routeParams', '$location', '$filter', 'mealService', 'mealClass', 'stepClass', editController]);

    function editController($scope, $routeParams, $location, $filter, mealService, mealClass, stepClass) {
        $scope.id = $routeParams.id;
        $scope.meal = mealClass.build();

        $scope.addStep = () => {
            $scope.meal.steps.push(stepClass.build());
        };

        $scope.removeStep = (index) => {
            $scope.meal.steps.splice(index, 1);
        };

        $scope.saveMeal = () => {
            $scope.meal.convertStepsToDuration();

            mealService.post($scope.meal);
            $location.path('/');
        };

        $scope.cancel = () => {
            $location.path('/');
        };

        activate();

        function activate() {
            $scope.meal = mealService.getById($scope.id);
        }
    }
})();