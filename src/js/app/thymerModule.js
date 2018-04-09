var thymerApp = angular.module('thymerApp', ['ngRoute']);

angular.module('thymerApp').factory('stepClass', stepClass);
angular.module('thymerApp').factory('mealClass', ['stepClass', mealClass]);
angular.module('thymerApp').factory('mealService', ['$http', '$filter', '$window', 'mealClass', mealService]);

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}