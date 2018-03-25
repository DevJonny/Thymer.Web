(function() {
    'use strict';

    angular
        .module('thymerApp')
        .controller('homeController', ['$scope', '$location', '$filter', 'mealService', 'mealClass', homeController]);

    function homeController($scope, $location, $filter, mealService, mealClass) {
        $scope.meals = [];

        $scope.$watch('meals', (newValue) => { console.log(newValue);});

        activate();

        function activate() {
            mealService.get().then((response) => {
                $scope.meals = response.data.meals.map(mealClass.build);
            })
        }
    }
})();