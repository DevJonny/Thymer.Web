var thymerApp = angular.module('thymerApp', ['ngRoute']);

angular.module('thymerApp').factory('util', util);
angular.module('thymerApp').factory('stepClass', stepClass);
angular.module('thymerApp').factory('mealClass', ['util', 'stepClass', mealClass]);
angular.module('thymerApp').factory('mealService', ['$http', '$filter', '$window', 'mealClass', 'stepClass', mealService]);