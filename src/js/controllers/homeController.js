(function() {
    'use strict';

    angular
        .module('thymerApp')
        .controller('homeController', ['$scope', '$location', '$filter', 'mealService', 'mealClass', homeController]);

    function homeController($scope, $location, $filter, mealService, mealClass) {
        $scope.meals = [];

        $scope.goAdd = () => {
            $location.path('/New');
        };

        $scope.goEdit = (id) => {
            $location.path(`/Edit/${id}`);
        };

        activate();

        function activate() {
            $scope.meals = mealService.get().map(mealClass.build);
        }
    }
})();