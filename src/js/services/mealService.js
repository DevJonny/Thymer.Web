function mealService($http, $filter, $window, mealClass) {

    var data = '../../../data.json';

    function get() {
        var meals = angular.fromJson($window.localStorage.meals);

        return meals ? meals : [];
    }

    function getById(id) {
        var allMeals = get().map(mealClass.build);
        var mealsForId = $filter('filter')(allMeals, { id: id });

        return mealsForId.length !== 1 ? mealClass.build() : mealClass.build(mealsForId[0]);
    }

    function post(meal) {
        var meals = angular.fromJson($window.localStorage.meals);

        if (!meals) meals = [];

        var index = meals.map((m) => { return m.id }).indexOf(meal.id);

        if (index > -1) meals[index] = meal;
        else meals.push(meal);

        $window.localStorage.meals = angular.toJson(meals);
    }


    var service = {
        get: get,
        getById: getById,
        post: post
    };

    return service;
}