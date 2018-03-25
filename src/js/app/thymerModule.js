var thymerApp = angular.module('thymerApp', ['ngRoute']);

angular.module('thymerApp').factory('stepClass', stepClass);
angular.module('thymerApp').factory('mealClass', ['stepClass', mealClass]);
angular.module('thymerApp').factory('mealService', ['$http', mealService]);