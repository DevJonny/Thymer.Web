function() {
    'use strict';

    angular
        .module('thymerApp')
        .controller('homeController', ['$scope', '$location', homeController]);

    function homeController($scope, $location, $filter, sprintService, sprintClass) {
        console.log('Hello world....')
    }
}();