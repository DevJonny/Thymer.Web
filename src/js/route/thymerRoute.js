thymerApp.config([
    '$routeProvider', function ($routeProvider) {
        $routeProvider.when('/',
        {
            templateUrl: '../templates/_Home.html',
            controller: 'homeController'
        }).when('/New',
        {
            templateUrl: '../templates/_Edit.html',
            controller: 'editController'
        }).when('/Edit/:id',
        {
            templateUrl: '../templates/_Edit.html',
            controller: 'editController'
        }).when('/Run/:id',
        {
            templateUrl: '../templates/_Run.html',
            controller: 'runController'
        }).otherwise({
            redirectTo: '/'
        });
    }
]);
