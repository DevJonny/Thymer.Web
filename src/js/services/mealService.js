function mealService($http) {

    var data = '../../../data.json';

    function get() {
        return $http.get(data);
    }

    var service = {
        get: get
    };

    return service;
}