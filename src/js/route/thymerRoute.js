thymerApp.config([
    '$routeProvider', function ($routeProvider) {
        $routeProvider.when('/',
        {
            templateUrl: '../templates/Home.html',
            controller: 'homeController'
        }).when('/New',
        {
            templateUrl: '../templates/Edit.html',
            controller: 'editController'
        }).when('/Edit/:id',
        {
            templateUrl: '../templates/Edit.html',
            controller: 'editController'
        }).when('/Run/:id',
        {
            templateUrl: '../templates/Run.html',
            controller: 'runController'
        }).otherwise({
            redirectTo: '/'
        });
    }
]);
