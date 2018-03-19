thymerApp.config([
    '$routeProvider', function ($routeProvider) {
        $routeProvider.when('/',
        {
            templateUrl: '../html/_Home.html',
            controller: 'homeController'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
]);
