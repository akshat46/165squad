
var myApp = angular.module('myApp', ['ui.bootstrap', 'ngFileUpload', 'ngImgCrop', 'ngMaterial', 'ngRoute']);

myApp.config(['$interpolateProvider', function($interpolateProvider) {
   $interpolateProvider.startSymbol('<%');
   $interpolateProvider.endSymbol('%>');
}]);




