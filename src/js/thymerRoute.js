thymerApp.config([
    '$routeProvider', function ($routeProvider) {
        $routeProvider.when('/',
        {
            templateUrl: '../templates/_Home.html',
            controller: 'homeController'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
]);
